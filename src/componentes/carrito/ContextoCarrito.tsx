'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

/** Un producto dentro del carrito. */
export type ArticuloCarrito = {
  id: string;
  nombre: string;
  unidad: string;
  precio_mayoreo: number;
  cantidad: number;
  imagen?: string;
};

/** Aviso flotante que se muestra al agregar un dulce. */
export type AvisoCarrito = {
  clave: number;
  nombre: string;
  imagen?: string;
  cantidad: number;
};

/** Monto a partir del cual el envío es gratis (regla comercial provisional). */
export const ENVIO_GRATIS_DESDE = 1500;

type EstadoCarrito = {
  articulos: ArticuloCarrito[];
  agregar: (articulo: Omit<ArticuloCarrito, 'cantidad'>, cantidad?: number) => void;
  cambiarCantidad: (id: string, cantidad: number) => void;
  quitar: (id: string) => void;
  vaciar: () => void;
  totalArticulos: number;
  subtotal: number;
  cajonAbierto: boolean;
  abrirCajon: () => void;
  cerrarCajon: () => void;
  aviso: AvisoCarrito | null;
  descartarAviso: () => void;
};

const ContextoCarrito = createContext<EstadoCarrito | null>(null);

const LLAVE_ALMACEN = 'anaquelito-carrito';

/** Proveedor del carrito: guarda el estado en localStorage para que el
 *  pedido no se pierda si el cliente cierra la pestaña. También controla
 *  el cajón lateral y los avisos al agregar productos. */
export function ProveedorCarrito({ children }: { children: React.ReactNode }) {
  const [articulos, setArticulos] = useState<ArticuloCarrito[]>([]);
  const [hidratado, setHidratado] = useState(false);
  const [cajonAbierto, setCajonAbierto] = useState(false);
  const [aviso, setAviso] = useState<AvisoCarrito | null>(null);
  const temporizadorAviso = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    return () => {
      if (temporizadorAviso.current) clearTimeout(temporizadorAviso.current);
    };
  }, []);

  const mostrarAviso = (articulo: Omit<ArticuloCarrito, 'cantidad'>, cantidad: number) => {
    if (temporizadorAviso.current) clearTimeout(temporizadorAviso.current);
    setAviso({ clave: Date.now(), nombre: articulo.nombre, imagen: articulo.imagen, cantidad });
    temporizadorAviso.current = setTimeout(() => setAviso(null), 3200);
  };

  const agregar: EstadoCarrito['agregar'] = (articulo, cantidad = 1) => {
    setArticulos((previos) => {
      const existente = previos.find((a) => a.id === articulo.id);
      if (existente) {
        return previos.map((a) =>
          a.id === articulo.id ? { ...a, ...articulo, cantidad: a.cantidad + cantidad } : a
        );
      }
      return [...previos, { ...articulo, cantidad }];
    });
    mostrarAviso(articulo, cantidad);
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

  const abrirCajon = () => {
    setAviso(null);
    setCajonAbierto(true);
  };
  const cerrarCajon = () => setCajonAbierto(false);
  const descartarAviso = () => setAviso(null);

  const totalArticulos = articulos.reduce((suma, a) => suma + a.cantidad, 0);
  const subtotal = articulos.reduce(
    (suma, a) => suma + a.cantidad * a.precio_mayoreo,
    0
  );

  return (
    <ContextoCarrito.Provider
      value={{
        articulos,
        agregar,
        cambiarCantidad,
        quitar,
        vaciar,
        totalArticulos,
        subtotal,
        cajonAbierto,
        abrirCajon,
        cerrarCajon,
        aviso,
        descartarAviso,
      }}
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
