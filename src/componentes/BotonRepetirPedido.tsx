'use client';

import { useRouter } from 'next/navigation';
import { RotateCcw } from 'lucide-react';
import { usarCarrito, type ArticuloCarrito } from '@/componentes/carrito/ContextoCarrito';
import { registrarEvento } from '@/lib/analitica';

export default function BotonRepetirPedido({ articulos }: { articulos: ArticuloCarrito[] }) {
  const { cargarPedido } = usarCarrito();
  const router = useRouter();
  if (!articulos.length) return null;
  return <button type="button" onClick={() => {
    cargarPedido(articulos);
    registrarEvento('add_to_cart', { origen: 'repetir_pedido', items: articulos.map((a) => ({ item_id: a.id, item_name: a.nombre, price: a.precio_mayoreo, quantity: a.cantidad })) });
    router.push('/carrito');
  }} className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#EBD9C3] bg-[#FFF6EC] px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.14em] transition hover:border-[#FF5A5F] hover:text-[#FF5A5F]">
    <RotateCcw size={14} /> Repetir pedido
  </button>;
}
