'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { usarCarrito } from './ContextoCarrito';

/** Enlace al carrito en el encabezado, con contador de artículos. */
export default function EnlaceCarrito() {
  const { totalArticulos } = usarCarrito();

  return (
    <Link href="/carrito" className="enlace-carrito" aria-label="Ver carrito">
      <ShoppingBag size={20} strokeWidth={2} />
      {totalArticulos > 0 && (
        <span className="contador-carrito">{totalArticulos}</span>
      )}
    </Link>
  );
}
