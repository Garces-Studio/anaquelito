import { NextRequest, NextResponse } from 'next/server';
import { crearCliente } from '@/lib/supabase/server';
import { obtenerSesionAdmin } from '@/lib/supabase/autorizacion';

const CATEGORIAS_VALIDAS = ['frutos_secos', 'gomitas', 'chocolates', 'semillas', 'dulces', 'fritos'];

type CamposProducto = {
  nombre?: string;
  descripcion?: string | null;
  categoria?: string | null;
  unidad?: string;
  precio_mayoreo?: number;
  precio_menudeo?: number | null;
  precio_sugerido_reventa?: number | null;
  imagen_url?: string | null;
  activo?: boolean;
};

function validarCampos(campos: CamposProducto, esCreacion: boolean): string | null {
  if (esCreacion) {
    if (!campos.nombre?.trim()) return 'El nombre es obligatorio';
    if (typeof campos.precio_mayoreo !== 'number' || campos.precio_mayoreo <= 0) {
      return 'El precio de mayoreo debe ser un número mayor a 0';
    }
  }
  if (campos.precio_mayoreo !== undefined && (typeof campos.precio_mayoreo !== 'number' || campos.precio_mayoreo <= 0)) {
    return 'El precio de mayoreo debe ser un número mayor a 0';
  }
  for (const clave of ['precio_menudeo', 'precio_sugerido_reventa'] as const) {
    const valor = campos[clave];
    if (valor !== undefined && valor !== null && (typeof valor !== 'number' || valor <= 0)) {
      return `${clave} debe ser un número mayor a 0 (o vacío)`;
    }
  }
  if (campos.categoria && !CATEGORIAS_VALIDAS.includes(campos.categoria)) {
    return `Categoría inválida. Usa: ${CATEGORIAS_VALIDAS.join(', ')}`;
  }
  return null;
}

// Extrae solo los campos permitidos (evita que el cuerpo meta columnas extra).
function extraerCampos(cuerpo: Record<string, unknown>): CamposProducto {
  const campos: CamposProducto = {};
  if ('nombre' in cuerpo) campos.nombre = String(cuerpo.nombre ?? '').trim();
  if ('descripcion' in cuerpo) campos.descripcion = cuerpo.descripcion ? String(cuerpo.descripcion) : null;
  if ('categoria' in cuerpo) campos.categoria = cuerpo.categoria ? String(cuerpo.categoria) : null;
  if ('unidad' in cuerpo) campos.unidad = String(cuerpo.unidad ?? 'pieza');
  if ('precio_mayoreo' in cuerpo) campos.precio_mayoreo = Number(cuerpo.precio_mayoreo);
  if ('precio_menudeo' in cuerpo) campos.precio_menudeo = cuerpo.precio_menudeo == null || cuerpo.precio_menudeo === '' ? null : Number(cuerpo.precio_menudeo);
  if ('precio_sugerido_reventa' in cuerpo) campos.precio_sugerido_reventa = cuerpo.precio_sugerido_reventa == null || cuerpo.precio_sugerido_reventa === '' ? null : Number(cuerpo.precio_sugerido_reventa);
  if ('imagen_url' in cuerpo) campos.imagen_url = cuerpo.imagen_url ? String(cuerpo.imagen_url) : null;
  if ('activo' in cuerpo) campos.activo = Boolean(cuerpo.activo);
  return campos;
}

async function exigirAdmin() {
  const { user, esAdmin } = await obtenerSesionAdmin();
  if (!user || !esAdmin) {
    return NextResponse.json({ error: 'Solo administradores' }, { status: 403 });
  }
  return null;
}

/**
 * Sincroniza el código de barras (UPC) de un producto: reemplaza los códigos
 * anteriores por el nuevo (o los borra todos si viene vacío). El escáner de
 * la tienda busca en esta tabla.
 * Devuelve un mensaje de error legible, o null si todo salió bien.
 */
async function sincronizarCodigoBarras(
  supabase: Awaited<ReturnType<typeof crearCliente>>,
  productoId: string,
  codigo: string | null
): Promise<string | null> {
  const limpio = codigo?.replace(/\s+/g, '') ?? '';
  if (limpio && !/^\d{6,14}$/.test(limpio)) {
    return 'El código de barras debe tener solo dígitos (6 a 14, como un UPC/EAN)';
  }

  // ¿El código ya pertenece a OTRO producto?
  if (limpio) {
    const { data: existente } = await supabase
      .from('codigos_barra')
      .select('producto_id')
      .eq('codigo', limpio)
      .maybeSingle();
    if (existente && existente.producto_id !== productoId) {
      return 'Ese código de barras ya está asignado a otro producto';
    }
    if (existente) return null; // ya está asignado a este mismo producto
  }

  const { error: errorBorrado } = await supabase
    .from('codigos_barra')
    .delete()
    .eq('producto_id', productoId);
  if (errorBorrado) return errorBorrado.message;

  if (limpio) {
    const { error: errorInsercion } = await supabase
      .from('codigos_barra')
      .insert({ producto_id: productoId, codigo: limpio });
    if (errorInsercion) return errorInsercion.message;
  }
  return null;
}

/** GET: todos los productos, incluidos los inactivos (RLS de admin lo permite). */
export async function GET() {
  const bloqueo = await exigirAdmin();
  if (bloqueo) return bloqueo;

  const supabase = await crearCliente();
  const { data: productos, error } = await supabase
    .from('productos')
    .select('id, nombre, descripcion, categoria, unidad, precio_mayoreo, precio_menudeo, precio_sugerido_reventa, imagen_url, activo, creado_en, codigos_barra(codigo)')
    .order('creado_en', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ productos });
}

/** POST: crear producto nuevo. */
export async function POST(solicitud: NextRequest) {
  const bloqueo = await exigirAdmin();
  if (bloqueo) return bloqueo;

  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await solicitud.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo de la solicitud inválido' }, { status: 400 });
  }

  const campos = extraerCampos(cuerpo);
  const errorValidacion = validarCampos(campos, true);
  if (errorValidacion) return NextResponse.json({ error: errorValidacion }, { status: 400 });

  const supabase = await crearCliente();
  const { data: producto, error } = await supabase
    .from('productos')
    .insert({ activo: true, unidad: 'pieza', ...campos })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Código de barras opcional del formulario
  if (typeof cuerpo.codigo_barras === 'string') {
    const errorCodigo = await sincronizarCodigoBarras(supabase, producto.id, cuerpo.codigo_barras);
    if (errorCodigo) {
      return NextResponse.json({ error: `Producto creado, pero el código de barras falló: ${errorCodigo}` }, { status: 400 });
    }
  }

  return NextResponse.json({ ok: true, id: producto.id });
}

/** PATCH: editar producto existente ({ id, ...campos }). */
export async function PATCH(solicitud: NextRequest) {
  const bloqueo = await exigirAdmin();
  if (bloqueo) return bloqueo;

  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await solicitud.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo de la solicitud inválido' }, { status: 400 });
  }

  const id = typeof cuerpo.id === 'string' ? cuerpo.id : null;
  if (!id) return NextResponse.json({ error: 'Falta el id del producto' }, { status: 400 });

  const campos = extraerCampos(cuerpo);
  const errorValidacion = validarCampos(campos, false);
  if (errorValidacion) return NextResponse.json({ error: errorValidacion }, { status: 400 });

  const supabase = await crearCliente();
  // Puede venir SOLO el código de barras (sin otros campos que actualizar)
  if (Object.keys(campos).length > 0) {
    const { error } = await supabase.from('productos').update(campos).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (typeof cuerpo.codigo_barras === 'string') {
    const errorCodigo = await sincronizarCodigoBarras(supabase, id, cuerpo.codigo_barras);
    if (errorCodigo) return NextResponse.json({ error: errorCodigo }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

/**
 * DELETE: eliminar producto ({ id }).
 * Si el producto ya aparece en pedidos, la base de datos lo protege
 * (FK con "on delete restrict"); en ese caso se sugiere desactivarlo.
 */
export async function DELETE(solicitud: NextRequest) {
  const bloqueo = await exigirAdmin();
  if (bloqueo) return bloqueo;

  let cuerpo: { id?: string };
  try {
    cuerpo = await solicitud.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo de la solicitud inválido' }, { status: 400 });
  }
  if (!cuerpo.id) return NextResponse.json({ error: 'Falta el id del producto' }, { status: 400 });

  const supabase = await crearCliente();
  const { error } = await supabase.from('productos').delete().eq('id', cuerpo.id);

  if (error) {
    const esRestriccion = error.code === '23503';
    return NextResponse.json(
      {
        error: esRestriccion
          ? 'Este producto ya aparece en pedidos y no puede eliminarse. Desactívalo para ocultarlo del catálogo.'
          : error.message,
      },
      { status: esRestriccion ? 409 : 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
