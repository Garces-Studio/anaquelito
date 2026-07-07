import Link from 'next/link';
import { redirect } from 'next/navigation';
import { crearCliente } from '@/lib/supabase/server';
import BotonCerrarSesion from '@/componentes/BotonCerrarSesion';

const ESTADO_ETIQUETA: Record<string, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export default async function PaginaDashboard() {
  const supabase = await crearCliente();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/iniciar-sesion');

  const { data: cliente } = await supabase
    .from('clientes')
    .select('id, nombre_negocio, tipo_negocio, telefono, nivel_precio')
    .eq('auth_user_id', user.id)
    .single();

  // Caso raro: el usuario tiene sesión pero nunca terminó su registro de negocio.
  if (!cliente) {
    return (
      <main className="contenedor" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <h1 className="seccion-titulo">Falta completar tu registro</h1>
        <p className="seccion-bajada" style={{ marginInline: 'auto' }}>
          Tu cuenta existe pero no encontramos los datos de tu negocio. Escríbenos a hola@anaquelito.mx para ayudarte.
        </p>
        <BotonCerrarSesion />
      </main>
    );
  }

  const [{ data: pedidos }, { data: direcciones }, { data: cupones }] = await Promise.all([
    supabase
      .from('pedidos')
      .select('id, estado, total, creado_en, pedido_items(cantidad, precio_unitario, productos(nombre))')
      .eq('cliente_id', cliente.id)
      .order('creado_en', { ascending: false }),
    supabase
      .from('direcciones')
      .select('id, etiqueta, calle_numero, colonia, municipio, estado, codigo_postal, predeterminada')
      .eq('cliente_id', cliente.id)
      .order('predeterminada', { ascending: false }),
    supabase
      .from('cupones')
      .select('id, codigo, descripcion, descuento_porcentaje, valido_hasta'),
  ]);

  const totalGastado = (pedidos ?? []).reduce((suma, p) => suma + Number(p.total), 0);

  return (
    <main className="contenedor" style={{ padding: '3rem 1.25rem 4rem' }}>
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem',
      }}>
        <div>
          <h1 className="seccion-titulo aparecer">Hola, {cliente.nombre_negocio}</h1>
          <p style={{ color: 'var(--tinta-suave)' }} className="aparecer retraso-1">
            Este es tu panel: tus pedidos, direcciones y cupones.
          </p>
        </div>
        <div className="aparecer retraso-1">
          <BotonCerrarSesion />
        </div>
      </header>

      {/* Resumen */}
      <div className="rejilla-niveles aparecer retraso-2" style={{ marginBottom: '3rem' }}>
        <div className="nivel">
          <span className="descuento">{pedidos?.length ?? 0}</span>
          <h3>Pedidos realizados</h3>
        </div>
        <div className="nivel nivel-destacado">
          <span className="descuento">${totalGastado.toFixed(0)}</span>
          <h3>Total comprado</h3>
        </div>
        <div className="nivel">
          <span className="descuento">{cupones?.length ?? 0}</span>
          <h3>Cupones disponibles</h3>
        </div>
      </div>

      {/* Pedidos */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Tus pedidos</h2>
        {!pedidos || pedidos.length === 0 ? (
          <div className="resumen-checkout" style={{ maxWidth: 'none' }}>
            <p style={{ color: 'var(--tinta-suave)' }}>
              Todavía no has hecho ningún pedido. <Link href="/catalogo" style={{ color: 'var(--coral)', fontWeight: 700 }}>Ver catálogo</Link>
            </p>
          </div>
        ) : (
          <div className="lista-carrito">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="fila-carrito" style={{ alignItems: 'flex-start' }}>
                <div className="fila-carrito-info">
                  <strong>Pedido #{pedido.id.slice(0, 8)}</strong>
                  <span className="unidad">
                    {new Date(pedido.creado_en).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span className="unidad">
                    {(pedido.pedido_items ?? []).map((item: any) => `${item.cantidad}× ${item.productos?.nombre ?? 'Producto'}`).join(', ')}
                  </span>
                </div>
                <div className="fila-carrito-acciones">
                  <span className="chip" style={{ cursor: 'default' }}>
                    {ESTADO_ETIQUETA[pedido.estado] ?? pedido.estado}
                  </span>
                  <span className="fila-carrito-importe">${Number(pedido.total).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Direcciones */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Tus direcciones</h2>
        {!direcciones || direcciones.length === 0 ? (
          <p style={{ color: 'var(--tinta-suave)' }}>No tienes direcciones guardadas todavía.</p>
        ) : (
          <div className="rejilla-segmentos">
            {direcciones.map((dir) => (
              <div key={dir.id} className="tarjeta-segmento" style={{ cursor: 'default' }}>
                <h3>{dir.etiqueta}{dir.predeterminada && ' ⭐'}</h3>
                <p>
                  {dir.calle_numero}
                  {dir.colonia && `, ${dir.colonia}`}
                  {dir.municipio && `, ${dir.municipio}`}
                  {dir.estado && `, ${dir.estado}`}
                  {dir.codigo_postal && ` — CP ${dir.codigo_postal}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cupones */}
      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Tus cupones</h2>
        {!cupones || cupones.length === 0 ? (
          <p style={{ color: 'var(--tinta-suave)' }}>
            Todavía no hay cupones disponibles. En cuanto tengamos promociones activas, aparecerán aquí.
          </p>
        ) : (
          <div className="rejilla-segmentos">
            {cupones.map((cupon) => (
              <div key={cupon.id} className="tarjeta-segmento" style={{ cursor: 'default' }}>
                <h3>{cupon.codigo} — {cupon.descuento_porcentaje}%</h3>
                <p>{cupon.descripcion}</p>
                {cupon.valido_hasta && (
                  <span className="enlace">Válido hasta {new Date(cupon.valido_hasta).toLocaleDateString('es-MX')}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
