'use client';

import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { usarCarrito } from './ContextoCarrito';
import { CAJAS_POR_TARIMA, pesos } from '@/lib/mayoreo';

type ProductoAgregable = {
  id: string;
  nombre: string;
  unidad: string;
  precio_mayoreo: number;
  imagen?: string | null;
  imagen_url?: string | null;
  piezas_por_caja?: number | null;
  bolsas_por_caja?: number | null;
};

/** Botón de compra de las tarjetas de producto, sin modales:
 *  - Si el dulce NO está en el carrito, muestra "Agregar".
 *  - Si YA está, se convierte en un control de cantidad (− n +)
 *    para ajustar el pedido directo desde la tarjeta. */
export default function BotonAgregar({ producto }: { producto: ProductoAgregable }) {
  const { articulos, agregar, cambiarCantidad } = usarCarrito();
  const enCarrito = articulos.find((a) => a.id === producto.id);
  const imagen = producto.imagen ?? producto.imagen_url ?? undefined;

  const articuloBase = {
    id: producto.id,
    nombre: producto.nombre,
    unidad: producto.unidad,
    precio_mayoreo: Number(producto.precio_mayoreo),
    imagen,
    piezas_por_caja: producto.piezas_por_caja,
    bolsas_por_caja: producto.bolsas_por_caja,
  };

  if (enCarrito) {
    return (
      <div className="grid w-full gap-2">
        <div className="flex w-full items-center justify-between rounded-2xl border border-[#E6D8CD] bg-[#FFF8F1] p-1 text-[#2B1B12] shadow-inner">
          <button type="button" onClick={() => cambiarCantidad(producto.id, enCarrito.cantidad - 1)} className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-[#FFF6EC] active:scale-90" aria-label={`Quitar una caja de ${producto.nombre}`}><Minus size={16} /></button>
          <span className="text-sm font-black uppercase tracking-[0.08em]">{enCarrito.cantidad} cajas</span>
          <button type="button" onClick={() => agregar(articuloBase)} className="grid h-10 w-10 place-items-center rounded-xl bg-[#FF5A5F] text-white transition hover:bg-[#E0484D] active:scale-90" style={{ backgroundColor: '#FF5A5F', color: '#FFFFFF' }} aria-label={`Agregar una caja de ${producto.nombre}`}><Plus size={16} /></button>
        </div>
        <button type="button" onClick={() => agregar(articuloBase, CAJAS_POR_TARIMA)} className="w-full rounded-xl border border-[#00A699]/25 bg-[#E9F8F5] px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#007A70] transition hover:border-[#00A699]">
          + Agregar tarima · 100 cajas
        </button>
      </div>
    );
  }

  return <div className="grid w-full gap-2">
    <button type="button" onClick={() => agregar(articuloBase)} className="group inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5A5F] px-4 py-3 text-sm font-black text-white shadow-[0_12px_28px_rgba(255,90,95,.25)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#E0484D] active:scale-95" style={{ backgroundColor: '#FF5A5F', color: '#FFFFFF' }}>
      <ShoppingBag size={16} className="transition group-hover:-rotate-6" /> Agregar caja
    </button>
    <button type="button" onClick={() => agregar(articuloBase, CAJAS_POR_TARIMA)} className="w-full rounded-xl border border-[#00A699]/25 bg-[#E9F8F5] px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#007A70] transition hover:border-[#00A699]">
      Tarima · 100 cajas · {pesos(producto.precio_mayoreo * CAJAS_POR_TARIMA)}
    </button>
  </div>;
}
