import Link from 'next/link';
import { crearCliente } from '@/lib/supabase/server';

export default async function PaginaConfirmacion({
  searchParams,
}: {
  searchParams: Promise<{ pedido?: string; status?: string }>;
}) {
  const { pedido: pedidoId } = await searchParams;

  if (!pedidoId) {
    return (
      <main className="contenedor pagina-colorida" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <h1 className="seccion-titulo titulo-degradado">No encontramos tu pedido</h1>
        <Link href="/catalogo" className="boton boton-primario">Volver al catálogo</Link>
      </main>
    );
  }

  // Se usa el cliente admin porque el comprador aún no tiene sesión iniciada
  // (checkout de invitado) — ver src/app/api/checkout/route.ts.
  const supabase = await crearCliente();
  const { data: pedido } = await supabase
    .from('pedidos')
    .select('id, estado, total, creado_en')
    .eq('id', pedidoId)
    .single();

  return (
    <main className="contenedor pagina-colorida" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
      {/* Vacía el carrito del navegador ahora que el pedido ya quedó registrado */}

      <h1 className="seccion-titulo titulo-degradado aparecer">{pedido ? 'Estado de tu pedido' : 'Confirmación pendiente'}</h1>
      <p className="seccion-bajada aparecer retraso-1" style={{ marginInline: 'auto' }}>
        {pedido
          ? `Tu pedido #${pedido.id.slice(0, 8)} por $${pedido.total} está ${pedido.estado}. Te contactaremos para confirmar la entrega.`
          : 'No podemos verificar este pedido. Inicia sesión o contacta al negocio con tu comprobante. Volver desde la pasarela no confirma un pago.'}
      </p>
      <Link href="/catalogo" className="boton boton-primario aparecer retraso-2">
        Seguir comprando
      </Link>
    </main>
  );
}
