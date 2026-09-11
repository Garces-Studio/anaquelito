import { createHmac } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { Preference } from 'mercadopago';
import { crearClienteAdmin } from '@/lib/supabase/admin';
import { crearCliente } from '@/lib/supabase/server';
import { crearClienteMercadoPago } from '@/lib/mercadopago/cliente';
import { validarCheckout } from '@/lib/validacion';
import { limitarSolicitud } from '@/lib/limites';

export async function POST(solicitud: NextRequest) {
  if (process.env.CHECKOUT_HABILITADO !== 'true' || !process.env.MERCADOPAGO_ACCESS_TOKEN?.trim() || !process.env.MERCADOPAGO_WEBHOOK_SECRET?.trim()) {
    return NextResponse.json({ error: 'El pago web aún no está habilitado. Conservamos tu carrito para continuar después.' }, { status: 503 });
  }
  if (solicitud.headers.get('origin') !== solicitud.nextUrl.origin) return NextResponse.json({ error: 'Origen no permitido' }, { status: 403 });
  const cuerpo = await solicitud.json().catch(() => null);
  const errorValidacion = validarCheckout(cuerpo);
  if (errorValidacion) return NextResponse.json({ error: errorValidacion }, { status: 400 });
  const clave = solicitud.headers.get('Idempotency-Key');
  if (!clave || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(clave)) return NextResponse.json({ error: 'Actualiza la página e intenta de nuevo.' }, { status: 400 });
  try {
    const limite = await limitarSolicitud(solicitud, 'checkout', 30);
    if (limite) return limite;
    const admin = crearClienteAdmin();
    const { data: { user } } = await (await crearCliente()).auth.getUser();
    const cantidades = new Map<string, number>();
    for (const a of cuerpo.articulos as { id: string; cantidad: number }[]) cantidades.set(a.id, (cantidades.get(a.id) ?? 0) + a.cantidad);
    const articulos = [...cantidades].sort(([a], [b]) => a.localeCompare(b)).map(([id, cantidad]) => ({ id, cantidad }));
    const negocio = { nombre_negocio: cuerpo.negocio.nombre_negocio.trim(), telefono: cuerpo.negocio.telefono.trim(), direccion: cuerpo.negocio.direccion.trim(), tipo_negocio: cuerpo.negocio.tipo_negocio ?? 'tiendita' };
    const huella = createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY!).update(JSON.stringify({ usuario: user?.id ?? null, articulos, negocio })).digest('hex');
    const { data: pedido, error } = await admin.rpc('crear_pedido_atomico', { p_clave: clave, p_huella: huella, p_usuario: user?.id ?? null, p_negocio: negocio, p_articulos: articulos });
    if (error) {
      const mensajes: Record<string,string> = { STOCK_INSUFICIENTE: 'Las existencias cambiaron. Revisa las cantidades de tu carrito.', PRODUCTO_NO_DISPONIBLE: 'Un producto ya no está disponible. Revisa tu carrito.', MINIMO_NO_CUMPLIDO: 'Revisa la cantidad mínima de cada producto.', CHECKOUT_DISTINTO: 'Los datos del pedido cambiaron. Actualiza la página antes de continuar.' };
      return NextResponse.json({ error: mensajes[error.message] ?? 'No pudimos preparar el pedido. Intenta nuevamente.' }, { status: 409 });
    }
    if (pedido.pago_estado === 'aprobado' || pedido.pago_estado === 'reembolsado' || pedido.estado === 'cancelado') return NextResponse.json({ error: 'Este pedido ya fue procesado. Consulta su estado antes de iniciar otro.' }, { status: 409 });
    if (pedido.url_pago) return NextResponse.json({ urlPago: pedido.url_pago, pedidoId: pedido.id });
    const { data: lineas, error: errorLineas } = await admin.from('pedido_items').select('producto_id,nombre_producto,cantidad,precio_unitario').eq('pedido_id', pedido.id);
    if (errorLineas || !lineas?.length) throw new Error('Pedido incompleto');
    const base = solicitud.nextUrl.origin;
    const preferencia = await new Preference(crearClienteMercadoPago()).create({
      requestOptions: { idempotencyKey: pedido.id },
      body: {
        items: lineas.map((l) => ({ id: l.producto_id, title: l.nombre_producto, quantity: l.cantidad, unit_price: Number(l.precio_unitario), currency_id: 'MXN' })),
        external_reference: pedido.id,
        back_urls: { success: `${base}/checkout/confirmacion?pedido=${pedido.id}&token=${pedido.token_confirmacion}`, pending: `${base}/checkout/confirmacion?pedido=${pedido.id}&token=${pedido.token_confirmacion}`, failure: `${base}/checkout?error=pago` },
        auto_return: 'approved', notification_url: `${base}/api/mercadopago/webhook`,
      },
    });
    const urlPago = process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith('TEST-') ? preferencia.sandbox_init_point : preferencia.init_point;
    if (!urlPago || !preferencia.id) throw new Error('Preferencia incompleta');
    const { error: guardar } = await admin.from('pedidos').update({ url_pago: urlPago, preferencia_id: preferencia.id }).eq('id', pedido.id);
    if (guardar) throw new Error('No se pudo guardar preferencia');
    return NextResponse.json({ urlPago, pedidoId: pedido.id });
  } catch {
    // Un fallo de red no demuestra que la pasarela haya fallado: conservar la clave del pedido.
    return NextResponse.json({ error: 'No pudimos conectar con el pago. Reintenta con estos mismos datos; tu pedido se conserva.' }, { status: 503 });
  }
}
