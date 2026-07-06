'use client';

import { useState } from 'react';
import { usarCarrito } from './ContextoCarrito';

/** Botón "+ Agregar al carrito" de las tarjetas de producto.
 *  Da confirmación visual breve al agregar. */
export default function BotonAgregar({
  producto,
}: {
  producto: { id: string; nombre: string; unidad: string; precio_mayoreo: number };
}) {
  const { agregar } = usarCarrito();
  const [agregado, setAgregado] = useState(false);

  const manejarClick = () => {
    agregar(producto);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1200);
  };

  return (
    <button
      className="boton boton-primario"
      onClick={manejarClick}
      style={agregado ? { background: 'var(--exito)' } : undefined}
    >
      {agregado ? '✓ Agregado' : '+ Agregar al carrito'}
    </button>
  );
}
