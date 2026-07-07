'use client';

import { useEffect } from 'react';
import { usarCarrito } from '@/componentes/carrito/ContextoCarrito';

/** Vacía el carrito una sola vez al llegar a la confirmación del pedido. */
export default function LimpiarCarrito() {
  const { vaciar } = usarCarrito();

  useEffect(() => {
    vaciar();
    // Solo debe correr una vez, al montar esta página.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
