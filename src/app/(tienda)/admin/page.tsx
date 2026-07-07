import Link from 'next/link';
import { ArrowRight, CircleDollarSign, Clock3, PackageSearch, ShoppingBag, Store } from 'lucide-react';
import { crearCliente } from '@/lib/supabase/server';

const ESTADO_ETIQUETA: Record<string, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const ESTADO_COLOR: Record<string, string> = {
  pendiente: 'bg-[#FFB400]/15 text-[#8A6200]',
  confirmado: 'bg-[#00A699]/12 text-[#007A70]',
  enviado: 'bg-[#7621B0]/10 text-[#7621B0]',
  entregado: 'bg-[#1E9E6A]/12 text-[#177a52]',
  cancelado: 'bg-[#D64545]/10 text-[#D64545]',
};

/** Resumen del negocio para el administrador (las políticas RLS de la
 *  migración 0005 le dan visibilidad total; el guard vive en el layout). */
export default async function PaginaAdminResumen() {
  const supabase = await crearCliente();

  const [{ data: pedidos }, { count: totalProductos }, { count: productosActivos }, { count: totalClientes }] =
    await Promise.all([
      supabase
        .from('pedidos')
        .select('id, estado, total, creado_en, clientes(nombre_negocio)')
        .order('creado_en', { ascending: false }),
      supabase.from('productos').select('id', { count: 'exact', head: true }),
      supabase.from('productos').select('id', { count: 'exact', head: true }).eq('activo', true),
      supabase.from('clientes').select('id', { count: 'exact', head: true }),
    ]);

  const ventasTotales = (pedidos ?? [])
    .filter((pedido) => pedido.estado !== 'cancelado')
    .reduce((suma, pedido) => suma + Number(pedido.total), 0);
  const pendientes = (pedidos ?? []).filter((pedido) => pedido.estado === 'pendiente').length;
  const recientes = (pedidos ?? []).slice(0, 6);

  const tarjetas = [
    { Icono: ShoppingBag, dato: pedidos?.length ?? 0, texto: 'Pedidos totales', color: '#FF5A5F' },
    { Icono: Clock3, dato: pendientes, texto: 'Pendientes por atender', color: '#FFB400' },
    { Icono: CircleDollarSign, dato: `$${ventasTotales.toFixed(0)}`, texto: 'Ventas (sin cancelados)', color: '#00A699' },
    { Icono: Store, dato: totalClientes ?? 0, texto: 'Negocios registrados', color: '#7621B0' },
  ];

  return (
    <>
      <header className="aparecer">
        <h1 className="max-w-4xl text-[clamp(2.6rem,7vw,5.5rem)] !font-black uppercase leading-[0.86]">
          Panel de control
        </h1>
        <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-[#6B5546] md:text-base">
          Pedidos, catálogo y clientes de Anaquelito en un solo lugar.
          {' '}{productosActivos ?? 0} de {totalProductos ?? 0} productos activos en el catálogo.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tarjetas.map(({ Icono, dato, texto, color }, indice) => (
          <article
            key={texto}
            className="aparecer rounded-lg border border-[#EBD9C3] bg-white/80 p-5 shadow-[0_18px_50px_rgba(43,27,18,0.06)] backdrop-blur-xl"
            style={{ animationDelay: `${0.08 + indice * 0.06}s` }}
          >
            <span
              className="grid h-11 w-11 place-items-center rounded-full text-white shadow-[0_14px_30px_rgba(43,27,18,0.12)]"
              style={{ backgroundColor: color }}
            >
              <Icono size={18} />
            </span>
            <strong className="mt-4 block text-4xl !font-black leading-none">{dato}</strong>
            <span className="mt-2 block text-[10px] font-black uppercase tracking-[0.18em] text-[#6B5546]">
              {texto}
            </span>
          </article>
        ))}
      </div>

      <section className="aparecer retraso-2 mt-8 rounded-lg border border-[#EBD9C3] bg-white/82 p-5 shadow-[0_24px_70px_rgba(43,27,18,0.08)] backdrop-blur-xl md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl !font-black uppercase leading-none md:text-3xl">Últimos pedidos</h2>
          <Link
            href="/admin/pedidos"
            className="group inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#FF5A5F]"
          >
            Gestionar todos <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        {recientes.length === 0 ? (
          <p className="text-sm font-semibold text-[#6B5546]">Todavía no hay pedidos registrados.</p>
        ) : (
          <ul className="divide-y divide-[#EBD9C3]/70">
            {recientes.map((pedido) => (
              <li key={pedido.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black uppercase">
                    #{pedido.id.slice(0, 8)} · {(pedido.clientes as { nombre_negocio?: string } | null)?.nombre_negocio ?? 'Invitado'}
                  </p>
                  <p className="text-xs font-semibold text-[#6B5546]">
                    {new Date(pedido.creado_en).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${ESTADO_COLOR[pedido.estado] ?? 'bg-[#EBD9C3]/50'}`}>
                    {ESTADO_ETIQUETA[pedido.estado] ?? pedido.estado}
                  </span>
                  <strong className="text-lg !font-black">${Number(pedido.total).toFixed(2)}</strong>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="aparecer retraso-3 mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/productos"
          className="group flex items-center justify-between rounded-lg bg-[#2B1B12] p-6 text-[#FFF6EC] shadow-[0_24px_70px_rgba(43,27,18,0.14)] transition hover:bg-[#FF5A5F]"
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/55">Catálogo</p>
            <p className="mt-2 text-2xl !font-black uppercase leading-none">Agregar o editar productos</p>
          </div>
          <PackageSearch size={28} className="shrink-0 transition group-hover:scale-110" />
        </Link>
        <Link
          href="/admin/pedidos"
          className="group flex items-center justify-between rounded-lg border border-[#EBD9C3] bg-white/80 p-6 shadow-[0_18px_50px_rgba(43,27,18,0.06)] backdrop-blur-xl transition hover:border-[#00A699]"
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6B5546]">Operación</p>
            <p className="mt-2 text-2xl !font-black uppercase leading-none">Atender pedidos pendientes</p>
          </div>
          <ArrowRight size={28} className="shrink-0 text-[#00A699] transition group-hover:translate-x-1" />
        </Link>
      </div>
    </>
  );
}
