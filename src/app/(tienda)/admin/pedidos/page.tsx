'use client';

import { useEffect, useState } from 'react';
import { MapPin, Phone, RefreshCw, Truck } from 'lucide-react';

type ItemPedido = {
  cantidad: number;
  precio_unitario: number;
  productos: { nombre: string; unidad: string } | null;
};

type Pedido = {
  id: string;
  estado: string;
  total: number;
  metodo_pago: string | null;
  creado_en: string;
  clientes: { nombre_negocio: string; telefono: string | null; direccion: string | null } | null;
  pedido_items: ItemPedido[];
};

const ESTADOS: { valor: string; texto: string }[] = [
  { valor: 'pendiente', texto: 'Pendiente' },
  { valor: 'confirmado', texto: 'Confirmado' },
  { valor: 'enviado', texto: 'Enviado' },
  { valor: 'entregado', texto: 'Entregado' },
  { valor: 'cancelado', texto: 'Cancelado' },
];

const COLOR_ESTADO: Record<string, string> = {
  pendiente: 'border-[#FFB400] bg-[#FFB400]/10 text-[#8A6200]',
  confirmado: 'border-[#00A699] bg-[#00A699]/10 text-[#007A70]',
  enviado: 'border-[#7621B0] bg-[#7621B0]/10 text-[#7621B0]',
  entregado: 'border-[#1E9E6A] bg-[#1E9E6A]/10 text-[#177a52]',
  cancelado: 'border-[#D64545] bg-[#D64545]/10 text-[#D64545]',
};

export default function PaginaAdminPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guardandoId, setGuardandoId] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('');

  const cargar = async () => {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await fetch('/api/admin/pedidos');
      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.error ?? 'No se pudieron cargar los pedidos');
      setPedidos(datos.pedidos ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const cambiarEstado = async (id: string, estado: string) => {
    const anterior = pedidos;
    setGuardandoId(id);
    // Actualización optimista; si el servidor falla, se revierte.
    setPedidos((lista) => lista.map((p) => (p.id === id ? { ...p, estado } : p)));
    try {
      const respuesta = await fetch('/api/admin/pedidos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, estado }),
      });
      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.error ?? 'No se pudo actualizar');
    } catch (err) {
      setPedidos(anterior);
      setError(err instanceof Error ? err.message : 'Error al actualizar el pedido');
    } finally {
      setGuardandoId(null);
    }
  };

  const visibles = filtroEstado ? pedidos.filter((p) => p.estado === filtroEstado) : pedidos;

  return (
    <>
      <header className="aparecer flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(2.4rem,6vw,4.5rem)] !font-black uppercase leading-[0.86]">Pedidos</h1>
          <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-[#6B5546]">
            Cambia el estado de cada pedido conforme lo confirmas, envías y entregas.
          </p>
        </div>
        <button
          type="button"
          onClick={cargar}
          className="inline-flex items-center gap-2 rounded-full border border-[#EBD9C3] bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] shadow-sm transition hover:border-[#00A699] hover:text-[#00A699]"
        >
          <RefreshCw size={14} className={cargando ? 'animate-spin' : ''} /> Actualizar
        </button>
      </header>

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Filtrar pedidos por estado">
        <button
          type="button"
          onClick={() => setFiltroEstado('')}
          className={`rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] transition ${
            !filtroEstado ? 'border-[#2B1B12] bg-[#2B1B12] text-white' : 'border-[#EBD9C3] bg-white/70 text-[#6B5546] hover:border-[#2B1B12]'
          }`}
        >
          Todos ({pedidos.length})
        </button>
        {ESTADOS.map(({ valor, texto }) => {
          const cantidad = pedidos.filter((p) => p.estado === valor).length;
          return (
            <button
              key={valor}
              type="button"
              onClick={() => setFiltroEstado(valor)}
              className={`rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] transition ${
                filtroEstado === valor ? 'border-[#2B1B12] bg-[#2B1B12] text-white' : 'border-[#EBD9C3] bg-white/70 text-[#6B5546] hover:border-[#2B1B12]'
              }`}
            >
              {texto} ({cantidad})
            </button>
          );
        })}
      </nav>

      {error && (
        <p className="mt-6 rounded-lg border border-[#D64545]/30 bg-[#D64545]/10 px-4 py-3 text-sm font-bold text-[#D64545]">
          {error}
        </p>
      )}

      {cargando && (
        <div className="mt-16 flex flex-col items-center gap-3 text-[#6B5546]">
          <RefreshCw className="h-8 w-8 animate-spin text-[#FF5A5F]" />
          <p className="text-[11px] font-black uppercase tracking-[0.18em]">Cargando pedidos…</p>
        </div>
      )}

      {!cargando && visibles.length === 0 && !error && (
        <div className="mt-10 rounded-lg border border-[#EBD9C3] bg-white/80 p-10 text-center shadow-sm backdrop-blur">
          <Truck className="mx-auto mb-3 h-8 w-8 text-[#6B5546]/60" />
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#6B5546]">
            No hay pedidos {filtroEstado ? `en "${ESTADOS.find((e) => e.valor === filtroEstado)?.texto}"` : 'todavía'}
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {visibles.map((pedido) => (
          <article
            key={pedido.id}
            className="rounded-lg border border-[#EBD9C3] bg-white/82 p-5 shadow-[0_18px_50px_rgba(43,27,18,0.06)] backdrop-blur-xl"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6B5546]">
                  #{pedido.id.slice(0, 8)} · {new Date(pedido.creado_en).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <h2 className="mt-1 truncate text-xl !font-black uppercase leading-tight md:text-2xl">
                  {pedido.clientes?.nombre_negocio ?? 'Invitado'}
                </h2>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-[#6B5546]">
                  {pedido.clientes?.telefono && (
                    <span className="inline-flex items-center gap-1"><Phone size={12} /> {pedido.clientes.telefono}</span>
                  )}
                  {pedido.clientes?.direccion && (
                    <span className="inline-flex items-center gap-1"><MapPin size={12} /> {pedido.clientes.direccion}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <strong className="text-2xl !font-black">${Number(pedido.total).toFixed(2)}</strong>
                <select
                  value={pedido.estado}
                  disabled={guardandoId === pedido.id}
                  onChange={(e) => cambiarEstado(pedido.id, e.target.value)}
                  aria-label={`Estado del pedido ${pedido.id.slice(0, 8)}`}
                  className={`cursor-pointer rounded-full border-2 px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] outline-none transition disabled:opacity-50 ${COLOR_ESTADO[pedido.estado] ?? 'border-[#EBD9C3]'}`}
                >
                  {ESTADOS.map(({ valor, texto }) => (
                    <option key={valor} value={valor}>{texto}</option>
                  ))}
                </select>
              </div>
            </div>

            {pedido.pedido_items.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2 border-t border-[#EBD9C3]/70 pt-4">
                {pedido.pedido_items.map((item, indice) => (
                  <li
                    key={indice}
                    className="rounded-full bg-[#FFF6EC] px-3 py-1.5 text-xs font-bold text-[#2B1B12]"
                  >
                    {item.cantidad}× {item.productos?.nombre ?? 'Producto'}{' '}
                    <span className="text-[#6B5546]">(${Number(item.precio_unitario).toFixed(2)} c/u)</span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
