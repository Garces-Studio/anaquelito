import { NextRequest, NextResponse } from 'next/server';
import { crearCliente } from '@/lib/supabase/server';
import { obtenerSesionAdmin } from '@/lib/supabase/autorizacion';

const ESTADOS_VALIDOS = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'] as const;

/**
 * GET  /api/admin/pedidos  → todos los pedidos con cliente e items.
 * PATCH /api/admin/pedidos → { id, estado } cambia el estado de un pedido.
 *
 * Ambas verifican que la sesión sea de administrador. Además las consultas
 * usan el cliente normal (no service_role), así que las políticas RLS de la
 * migración 0005 son una segunda barrera: sin fila en `administradores`,
 * la base de datos no devuelve nada.
 */
export async function GET() {
  const { user, esAdmin } = await obtenerSesionAdmin();
  if (!user || !esAdmin) {
    return NextResponse.json({ error: 'Solo administradores' }, { status: 403 });
  }

  const supabase = await crearCliente();
  const { data: pedidos, error } = await supabase
    .from('pedidos')
    .select(`
      id, estado, pago_estado, total, metodo_pago, creado_en, datos_entrega,
      clientes ( nombre_negocio, telefono, direccion ),
      pedido_items ( cantidad, precio_unitario, nombre_producto, presentacion, productos ( nombre, unidad ) )
    `)
    .order('creado_en', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ pedidos: pedidos?.map(p => ({ ...p, clientes: p.datos_entrega ?? p.clientes, pedido_items: p.pedido_items.map(i => ({ ...i, productos: i.nombre_producto ? { nombre: i.nombre_producto, unidad: i.presentacion } : i.productos })) })) });
}

export async function PATCH(solicitud: NextRequest) {
  if (solicitud.headers.get('origin') !== solicitud.nextUrl.origin) return NextResponse.json({ error: 'Origen no permitido' }, { status: 403 });
  const { user, esAdmin } = await obtenerSesionAdmin();
  if (!user || !esAdmin) {
    return NextResponse.json({ error: 'Solo administradores' }, { status: 403 });
  }

  let cuerpo: { id?: string; estado?: string };
  try {
    cuerpo = await solicitud.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo de la solicitud inválido' }, { status: 400 });
  }

  const { id, estado } = cuerpo;
  if (!id || !estado || !ESTADOS_VALIDOS.includes(estado as (typeof ESTADOS_VALIDOS)[number])) {
    return NextResponse.json(
      { error: `Se requiere id y un estado válido (${ESTADOS_VALIDOS.join(', ')})` },
      { status: 400 }
    );
  }

  const supabase = await crearCliente();
  const { error } = await supabase.from('pedidos').update({ estado }).eq('id', id);

  if (error) {
    return NextResponse.json({ error: 'No se puede realizar ese cambio. Revisa el pago y el estado actual; las cancelaciones con mercancía reservada requieren conciliación.' }, { status: 409 });
  }
  return NextResponse.json({ ok: true });
}
