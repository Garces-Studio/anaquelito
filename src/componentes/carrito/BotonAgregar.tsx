'use client';

import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { usarCarrito } from './ContextoCarrito';

type ProductoAgregable = {
  id: string;
  nombre: string;
  unidad: string;
  precio_mayoreo: number;
  imagen?: string | null;
  imagen_url?: string | null;
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
  };

  if (enCarrito) {
    return (
      <div className="flex w-full items-center justify-between rounded-full border-2 border-[#2B1B12] bg-white p-1 text-[#2B1B12]">
        <button
          type="button"
          onClick={() => cambiarCantidad(producto.id, enCarrito.cantidad - 1)}
          className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-[#FFF6EC] active:scale-90"
          aria-label={`Quitar uno de ${producto.nombre}`}
        >
          <Minus size={16} />
        </button>
        <span className="text-sm font-black uppercase tracking-[0.08em]">
          {enCarrito.cantidad} en pedido
        </span>
        <button
          type="button"
          onClick={() => agregar(articuloBase)}
          className="grid h-10 w-10 place-items-center rounded-full bg-[#2B1B12] text-white transition hover:bg-[#FF5A5F] active:scale-90"
          aria-label={`Agregar uno de ${producto.nombre}`}
        >
          <Plus size={16} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => agregar(articuloBase)}
      className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2B1B12] px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-white transition duration-200 hover:bg-[#FF5A5F] active:scale-95"
    >
      <ShoppingBag size={16} className="transition group-hover:-rotate-6" />
      Agregar
    </button>
  );
}
