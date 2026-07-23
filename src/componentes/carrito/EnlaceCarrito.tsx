'use client';

import { ShoppingBag } from 'lucide-react';
import { usarCarrito } from './ContextoCarrito';

/** Botón del carrito en el encabezado: abre el cajón lateral (sin cambiar de
 *  página) y muestra el contador con una animación "pop" cada vez que cambia. */
export default function EnlaceCarrito() {
  const { totalArticulos, abrirCajon } = usarCarrito();

  return (
    <button
      type="button"
      onClick={abrirCajon}
      className="enlace-carrito"
      aria-label={`Abrir carrito (${totalArticulos} artículos)`}
    >
      <ShoppingBag size={20} strokeWidth={2} />
      {totalArticulos > 0 && (
        <span key={totalArticulos} className="contador-carrito contador-pop">
          {totalArticulos}
        </span>
      )}
    </button>
  );
}
