import { NextRequest, NextResponse } from 'next/server';
import { crearCliente } from '@/lib/supabase/server';
import { obtenerSesionAdmin } from '@/lib/supabase/autorizacion';
import { esObjeto } from '@/lib/validacion';

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
      empresa_envio, guia_envio, url_rastreo, enviado_en, entregado_en, pago_requiere_revision,
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

  let cuerpo: { id?: string; estado?: string; empresa_envio?: string; guia_envio?: string; url_rastreo?: string };
  try {
    cuerpo = await solicitud.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo de la solicitud inválido' }, { status: 400 });
  }

  if (!esObjeto(cuerpo)) return NextResponse.json({ error: 'Revisa los datos del pedido.' }, { status: 400 });
  const { id, estado } = cuerpo;
  const formatoUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const editaEnvio = cuerpo.empresa_envio !== undefined || cuerpo.guia_envio !== undefined || cuerpo.url_rastreo !== undefined;
  if (!id || !formatoUuid.test(id) || (!estado && !editaEnvio) || (estado && !ESTADOS_VALIDOS.includes(estado as (typeof ESTADOS_VALIDOS)[number]))) {
    return NextResponse.json(
      { error: `Se requiere un pedido y un cambio válido (${ESTADOS_VALIDOS.join(', ')})` },
      { status: 400 }
    );
  }

  const empresaEnvio = String(cuerpo.empresa_envio ?? '').trim();
  const guiaEnvio = String(cuerpo.guia_envio ?? '').trim();
  const urlRastreo = String(cuerpo.url_rastreo ?? '').trim();
  if (empresaEnvio.length > 100 || guiaEnvio.length > 160 || urlRastreo.length > 500 || (urlRastreo && !/^https:\/\//i.test(urlRastreo))) {
    return NextResponse.json({ error: 'Revisa la paquetería, la guía y usa un enlace HTTPS válido.' }, { status: 400 });
  }

  const supabase = await crearCliente();
  let error = null;
  if (estado === 'cancelado') {
    ({ error } = await supabase.rpc('cancelar_pedido_y_liberar_reserva', { p_pedido: id }));
  } else {
    const cambios: Record<string, string | null> = {};
    if (estado) cambios.estado = estado;
    if (editaEnvio) {
      cambios.empresa_envio = empresaEnvio || null;
      cambios.guia_envio = guiaEnvio || null;
      cambios.url_rastreo = urlRastreo || null;
    }
    ({ error } = await supabase.from('pedidos').update(cambios).eq('id', id));
  }

  if (error) {
    if (error.message.includes('CONCILIAR_PASARELA')) return NextResponse.json({ error: 'Este pedido tiene un intento de pago. Antes de liberar existencias hay que conciliar y cerrar el cobro en Mercado Pago.' }, { status: 409 });
    const requiereDevolucion = error.message.includes('REQUIERE_DEVOLUCION');
    return NextResponse.json({ error: requiereDevolucion ? 'Este pedido ya descontó mercancía. Primero confirma la devolución o el reembolso antes de cancelarlo.' : 'No se puede realizar ese cambio. Revisa el pago y el estado actual.' }, { status: 409 });
  }
  return NextResponse.json({ ok: true });
}
