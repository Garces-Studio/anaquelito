import Link from 'next/link';
import { crearClienteAdmin } from '@/lib/supabase/admin';
import EstadoConfirmacion from './EstadoConfirmacion';
import { crearCliente } from '@/lib/supabase/server';

export default async function PaginaConfirmacion({ searchParams }: { searchParams: Promise<{ pedido?: string; token?: string }> }) {
  const { pedido: pedidoId, token } = await searchParams;
  const formatoUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  let pedido: { id: string; estado: string; pago_estado: string; total: number } | null = null;
  if (pedidoId && token && formatoUuid.test(pedidoId) && formatoUuid.test(token)) {
    const { data } = await crearClienteAdmin().from('pedidos').select('id,estado,pago_estado,total').eq('id', pedidoId).eq('token_confirmacion', token).maybeSingle();
    pedido = data;
  }
  const aprobado = pedido?.pago_estado === 'aprobado';
  const { data: { user } } = await (await crearCliente()).auth.getUser();
  return <main className="contenedor pagina-colorida" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
    {pedido && <EstadoConfirmacion aprobado={aprobado} pedidoId={pedido.id} total={Number(pedido.total)} />}
    <h1 className="seccion-titulo titulo-degradado aparecer">{aprobado ? 'Pago confirmado' : pedido ? 'Pago en validación' : 'No encontramos tu pedido'}</h1>
    <p className="seccion-bajada aparecer retraso-1" style={{ marginInline: 'auto' }}>
      {aprobado
        ? `Tu pedido ANQ-${pedido!.id.slice(0, 8).toUpperCase()} por $${Number(pedido!.total).toFixed(2)} está confirmado.`
        : pedido
          ? `El pedido ANQ-${pedido.id.slice(0, 8).toUpperCase()} está registrado, pero todavía no figura como pagado. Conservaremos tu carrito hasta recibir la confirmación segura de Mercado Pago.`
          : 'El enlace no permite verificar un pedido. Volver desde la pasarela nunca se considera por sí solo una confirmación de pago.'}
    </p>
    <Link href={aprobado ? '/catalogo' : '/carrito'} className="boton boton-primario aparecer retraso-2">{aprobado ? 'Seguir comprando' : 'Volver al carrito'}</Link>
    {aprobado && !user && <p className="mt-5"><Link href={`/crear-cuenta?pedido=${pedido!.id}&token=${token}`} className="b2b-consultar">Crear mi cuenta y guardar este pedido</Link></p>}
  </main>;
}
