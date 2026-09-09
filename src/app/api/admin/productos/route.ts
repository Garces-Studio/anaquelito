import { NextRequest, NextResponse } from 'next/server';
import { crearCliente } from '@/lib/supabase/server';
import { obtenerSesionAdmin } from '@/lib/supabase/autorizacion';

const CATEGORIAS_VALIDAS = ['frutos_secos', 'gomitas', 'chocolates', 'semillas', 'dulces', 'fritos'];

type CamposProducto = {
  nombre?: string;
  slug?: string | null;
  sku?: string | null;
  descripcion?: string | null;
  categoria?: string | null;
  unidad?: string | null;
  precio_mayoreo?: number | null;
  precio_menudeo?: number | null;
  precio_sugerido_reventa?: number | null;
  piezas_por_caja?: number | null;
  bolsas_por_caja?: number | null;
  peso_por_bolsa_g?: number | null;
  stock?: number | null;
  cantidad_minima?: number | null;
  disponibilidad?: 'por_confirmar' | 'disponible' | 'agotado';
  imagen_url?: string | null;
  activo?: boolean;
};

function validarCampos(campos: CamposProducto, esCreacion: boolean): string | null {
  if (esCreacion) {
    if (!campos.nombre?.trim()) return 'El nombre es obligatorio';
  }
  if (campos.nombre !== undefined && (!campos.nombre || campos.nombre.length > 160)) return 'El nombre no es válido';
  if (campos.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(campos.slug)) return 'El slug solo admite minúsculas, números y guiones';
  if (campos.precio_mayoreo !== undefined && campos.precio_mayoreo !== null && (!Number.isFinite(campos.precio_mayoreo) || campos.precio_mayoreo <= 0)) {
    return 'El precio de mayoreo debe ser mayor a 0 o quedar vacío';
  }
  for (const clave of ['precio_menudeo', 'precio_sugerido_reventa'] as const) {
    const valor = campos[clave];
    if (valor !== undefined && valor !== null && (typeof valor !== 'number' || !Number.isFinite(valor) || valor <= 0)) {
      return `${clave} debe ser un número mayor a 0 (o vacío)`;
    }
  }
  if (campos.categoria && !CATEGORIAS_VALIDAS.includes(campos.categoria)) {
    return `Categoría inválida. Usa: ${CATEGORIAS_VALIDAS.join(', ')}`;
  }
  for (const clave of ['piezas_por_caja', 'bolsas_por_caja', 'cantidad_minima'] as const) {
    const valor = campos[clave];
    if (valor !== undefined && valor !== null && (!Number.isSafeInteger(valor) || valor <= 0)) return `${clave} debe ser un entero mayor a 0`;
  }
  if (campos.stock !== undefined && campos.stock !== null && (!Number.isSafeInteger(campos.stock) || campos.stock < 0)) return 'El stock debe ser un entero igual o mayor a 0';
  if (campos.peso_por_bolsa_g !== undefined && campos.peso_por_bolsa_g !== null && (!Number.isFinite(campos.peso_por_bolsa_g) || campos.peso_por_bolsa_g <= 0)) return 'El peso por bolsa debe ser mayor a 0';
  if (campos.disponibilidad && !['por_confirmar', 'disponible', 'agotado'].includes(campos.disponibilidad)) return 'Disponibilidad inválida';
  return null;
}

function numeroOpcional(valor: unknown): number | null {
  if (valor === null || valor === undefined || valor === '') return null;
  return Number(valor);
}

// Extrae solo los campos permitidos (evita que el cuerpo meta columnas extra).
function extraerCampos(cuerpo: Record<string, unknown>): CamposProducto {
  const campos: CamposProducto = {};
  if ('nombre' in cuerpo) campos.nombre = String(cuerpo.nombre ?? '').trim();
  if ('slug' in cuerpo) campos.slug = cuerpo.slug ? String(cuerpo.slug).trim().toLowerCase() : null;
  if ('sku' in cuerpo) campos.sku = cuerpo.sku ? String(cuerpo.sku).trim() : null;
  if ('descripcion' in cuerpo) campos.descripcion = cuerpo.descripcion ? String(cuerpo.descripcion) : null;
  if ('categoria' in cuerpo) campos.categoria = cuerpo.categoria ? String(cuerpo.categoria) : null;
  if ('unidad' in cuerpo) campos.unidad = cuerpo.unidad ? String(cuerpo.unidad).trim() : null;
  if ('precio_mayoreo' in cuerpo) campos.precio_mayoreo = numeroOpcional(cuerpo.precio_mayoreo);
  if ('precio_menudeo' in cuerpo) campos.precio_menudeo = numeroOpcional(cuerpo.precio_menudeo);
  if ('precio_sugerido_reventa' in cuerpo) campos.precio_sugerido_reventa = numeroOpcional(cuerpo.precio_sugerido_reventa);
  if ('piezas_por_caja' in cuerpo) campos.piezas_por_caja = numeroOpcional(cuerpo.piezas_por_caja);
  if ('bolsas_por_caja' in cuerpo) campos.bolsas_por_caja = numeroOpcional(cuerpo.bolsas_por_caja);
  if ('peso_por_bolsa_g' in cuerpo) campos.peso_por_bolsa_g = numeroOpcional(cuerpo.peso_por_bolsa_g);
  if ('stock' in cuerpo) campos.stock = numeroOpcional(cuerpo.stock);
  if ('cantidad_minima' in cuerpo) campos.cantidad_minima = numeroOpcional(cuerpo.cantidad_minima);
  if ('disponibilidad' in cuerpo) campos.disponibilidad = String(cuerpo.disponibilidad) as CamposProducto['disponibilidad'];
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
    .select('id, slug, sku, nombre, descripcion, categoria, unidad, precio_mayoreo, precio_menudeo, precio_sugerido_reventa, piezas_por_caja, bolsas_por_caja, peso_por_bolsa_g, stock, cantidad_minima, disponibilidad, imagen_url, activo, creado_en, codigos_barra(codigo)')
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
    .insert({ activo: true, disponibilidad: 'por_confirmar', ...campos })
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
