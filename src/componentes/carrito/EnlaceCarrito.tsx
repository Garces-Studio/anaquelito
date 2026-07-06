'use client';

import Link from 'next/link';
import { usarCarrito } from './ContextoCarrito';

/** Enlace al carrito en el encabezado, con contador de artículos. */
export default function EnlaceCarrito() {
  const { totalArticulos } = usarCarrito();

  return (
    <Link href="/carrito" className="enlace-carrito" aria-label="Ver carrito">
      🛒
      {totalArticulos > 0 && (
        <span className="contador-carrito">{totalArticulos}</span>
      )}
    </Link>
  );
}
