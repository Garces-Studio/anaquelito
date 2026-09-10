import { NextRequest, NextResponse } from 'next/server';
import { InvalidWebhookSignatureError, Payment, WebhookSignatureValidator } from 'mercadopago';
import { crearClienteMercadoPago } from '@/lib/mercadopago/cliente';
import { crearClienteAdmin } from '@/lib/supabase/admin';

const ESTADOS: Record<string, 'pendiente' | 'en_proceso' | 'aprobado' | 'rechazado' | 'cancelado' | 'reembolsado'> = {
  pending: 'pendiente', in_process: 'en_proceso', approved: 'aprobado',
  rejected: 'rechazado', cancelled: 'cancelado', refunded: 'reembolsado', charged_back: 'reembolsado',
};

export async function POST(solicitud: NextRequest) {
  const secreto = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  const dataId = solicitud.nextUrl.searchParams.get('data.id');
  if (!secreto || !dataId) return NextResponse.json({ error: 'Notificación inválida' }, { status: 400 });

  try {
    WebhookSignatureValidator.validate({
      xSignature: solicitud.headers.get('x-signature'),
      xRequestId: solicitud.headers.get('x-request-id'),
      dataId, secret: secreto, toleranceSeconds: 300,
    });
  } catch (error) {
    if (error instanceof InvalidWebhookSignatureError) return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
    throw error;
  }

  const cuerpo = await solicitud.json().catch(() => null) as { type?: string; data?: { id?: string } } | null;
  if (cuerpo?.type !== 'payment' || String(cuerpo.data?.id ?? '') !== dataId) return NextResponse.json({ recibido: true });

  const pago = await new Payment(crearClienteMercadoPago()).get({ id: dataId });
  const pedidoId = pago.external_reference;
  if (!pedidoId || pago.currency_id !== 'MXN' || typeof pago.transaction_amount !== 'number') {
    return NextResponse.json({ error: 'Pago sin referencia válida' }, { status: 409 });
  }

  const admin = crearClienteAdmin();
  const { data: pedido } = await admin.from('pedidos').select('id,total,pago_estado').eq('id', pedidoId).single();
  if (!pedido || Math.abs(Number(pedido.total) - pago.transaction_amount) > 0.009) {
    return NextResponse.json({ error: 'El pago no coincide con el pedido' }, { status: 409 });
  }

  const pagoEstado = ESTADOS[pago.status ?? ''] ?? 'pendiente';
  // Una notificación retrasada de un intento anterior jamás puede degradar
  // un pedido cuyo pago ya fue verificado como aprobado.
  if (pedido.pago_estado === 'aprobado' && pagoEstado !== 'aprobado') return NextResponse.json({ recibido: true });
  const { error } = await admin.from('pedidos').update({
    pago_estado: pagoEstado,
    estado: pagoEstado === 'aprobado' ? 'confirmado' : pagoEstado === 'cancelado' || pagoEstado === 'rechazado' ? 'cancelado' : 'pendiente',
    mercadopago_payment_id: String(pago.id), actualizado_en: new Date().toISOString(),
  }).eq('id', pedido.id);
  if (error) return NextResponse.json({ error: 'No se pudo actualizar el pedido' }, { status: 500 });
  return NextResponse.json({ recibido: true });
}
