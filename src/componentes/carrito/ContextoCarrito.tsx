'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

/** Un producto dentro del carrito. */
export type ArticuloCarrito = {
  id: string;
  nombre: string;
  unidad: string;
  precio_mayoreo: number;
  cantidad: number;
};

type EstadoCarrito = {
  articulos: ArticuloCarrito[];
  agregar: (articulo: Omit<ArticuloCarrito, 'cantidad'>) => void;
  cambiarCantidad: (id: string, cantidad: number) => void;
  quitar: (id: string) => void;
  vaciar: () => void;
  totalArticulos: number;
  subtotal: number;
};

const ContextoCarrito = createContext<EstadoCarrito | null>(null);

const LLAVE_ALMACEN = 'anaquelito-carrito';

/** Proveedor del carrito: guarda el estado en localStorage para que el
 *  pedido no se pierda si el cliente cierra la pestaña. */
export function ProveedorCarrito({ children }: { children: React.ReactNode }) {
  const [articulos, setArticulos] = useState<ArticuloCarrito[]>([]);
  const [hidratado, setHidratado] = useState(false);

  // Cargar el carrito guardado al abrir la página
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(LLAVE_ALMACEN);
      if (guardado) setArticulos(JSON.parse(guardado));
    } catch {
      // Si el JSON guardado está dañado, se empieza con carrito vacío
    }
    setHidratado(true);
  }, []);

  // Guardar cada cambio (solo después de hidratar, para no pisar lo guardado)
  useEffect(() => {
    if (hidratado) localStorage.setItem(LLAVE_ALMACEN, JSON.stringify(articulos));
  }, [articulos, hidratado]);

  const agregar: EstadoCarrito['agregar'] = (articulo) => {
    setArticulos((previos) => {
      const existente = previos.find((a) => a.id === articulo.id);
      if (existente) {
        return previos.map((a) =>
          a.id === articulo.id ? { ...a, cantidad: a.cantidad + 1 } : a
        );
      }
      return [...previos, { ...articulo, cantidad: 1 }];
    });
  };

  const cambiarCantidad: EstadoCarrito['cambiarCantidad'] = (id, cantidad) => {
    setArticulos((previos) =>
      cantidad <= 0
        ? previos.filter((a) => a.id !== id)
        : previos.map((a) => (a.id === id ? { ...a, cantidad } : a))
    );
  };

  const quitar = (id: string) =>
    setArticulos((previos) => previos.filter((a) => a.id !== id));

  const vaciar = () => setArticulos([]);

  const totalArticulos = articulos.reduce((suma, a) => suma + a.cantidad, 0);
  const subtotal = articulos.reduce(
    (suma, a) => suma + a.cantidad * a.precio_mayoreo,
    0
  );

  return (
    <ContextoCarrito.Provider
      value={{ articulos, agregar, cambiarCantidad, quitar, vaciar, totalArticulos, subtotal }}
    >
      {children}
    </ContextoCarrito.Provider>
  );
}

/** Hook para usar el carrito desde cualquier componente de cliente. */
export function usarCarrito() {
  const contexto = useContext(ContextoCarrito);
  if (!contexto) {
    throw new Error('usarCarrito debe usarse dentro de <ProveedorCarrito>');
  }
  return contexto;
}
