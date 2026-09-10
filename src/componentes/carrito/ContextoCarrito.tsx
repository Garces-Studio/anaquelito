'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { registrarEvento } from '@/lib/analitica';

/** Un producto dentro del carrito. */
export type ArticuloCarrito = {
  id: string;
  nombre: string;
  unidad: string;
  precio_mayoreo: number;
  cantidad: number;
  imagen?: string;
  piezas_por_caja?: number | null;
  bolsas_por_caja?: number | null;
};

/** Aviso flotante que se muestra al agregar un dulce. */
export type AvisoCarrito = {
  clave: number;
  nombre: string;
  imagen?: string;
  cantidad: number;
};

/** Sin promoción de envío hasta confirmar cobertura y condiciones comerciales. */
export const ENVIO_GRATIS_DESDE = Number.POSITIVE_INFINITY;

type EstadoCarrito = {
  articulos: ArticuloCarrito[];
  agregar: (articulo: Omit<ArticuloCarrito, 'cantidad'>, cantidad?: number) => void;
  cambiarCantidad: (id: string, cantidad: number) => void;
  quitar: (id: string) => void;
  vaciar: () => void;
  cargarPedido: (articulos: ArticuloCarrito[]) => void;
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
      if (guardado) {
        const datos: unknown = JSON.parse(guardado);
        // Hidratación desde almacenamiento externo; requiere una actualización al montar.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (Array.isArray(datos)) setArticulos(datos.filter((a): a is ArticuloCarrito =>
          a && typeof a.id === 'string' && typeof a.nombre === 'string' &&
          typeof a.unidad === 'string' && Number.isFinite(a.precio_mayoreo) &&
          a.precio_mayoreo > 0 && Number.isSafeInteger(a.cantidad) &&
          a.cantidad > 0 && a.cantidad <= 10000
        ).slice(0, 100));
      }
    } catch {
      // Si el JSON guardado está dañado, se empieza con carrito vacío
    }
    setHidratado(true);
  }, []);

  // Guardar cada cambio (solo después de hidratar, para no pisar lo guardado)
  useEffect(() => {
    if (hidratado) {
      try { localStorage.setItem(LLAVE_ALMACEN, JSON.stringify(articulos)); } catch { /* Navegación privada o almacenamiento lleno: conservar estado en memoria. */ }
    }
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
    if (!Number.isSafeInteger(cantidad) || cantidad < 1 || cantidad > 10000 || !Number.isFinite(articulo.precio_mayoreo) || articulo.precio_mayoreo <= 0) return;
    setArticulos((previos) => {
      const existente = previos.find((a) => a.id === articulo.id);
      if (existente) {
        return previos.map((a) =>
          a.id === articulo.id ? { ...a, ...articulo, cantidad: Math.min(10000, a.cantidad + cantidad) } : a
        );
      }
      return [...previos, { ...articulo, cantidad }];
    });
    mostrarAviso(articulo, cantidad);
    registrarEvento('add_to_cart', { currency: 'MXN', value: articulo.precio_mayoreo * cantidad, items: [{ item_id: articulo.id, item_name: articulo.nombre, price: articulo.precio_mayoreo, quantity: cantidad }] });
  };

  const cambiarCantidad: EstadoCarrito['cambiarCantidad'] = (id, cantidad) => {
    if (!Number.isSafeInteger(cantidad) || cantidad > 10000) return;
    const actual = articulos.find((a) => a.id === id);
    if (actual && cantidad < actual.cantidad) registrarEvento('remove_from_cart', { currency: 'MXN', value: actual.precio_mayoreo * (actual.cantidad - Math.max(0, cantidad)), items: [{ item_id: actual.id, item_name: actual.nombre, price: actual.precio_mayoreo, quantity: actual.cantidad - Math.max(0, cantidad) }] });
    setArticulos((previos) =>
      cantidad <= 0
        ? previos.filter((a) => a.id !== id)
        : previos.map((a) => (a.id === id ? { ...a, cantidad } : a))
    );
  };

  const quitar = (id: string) => {
    const articulo = articulos.find((a) => a.id === id);
    if (articulo) registrarEvento('remove_from_cart', { currency: 'MXN', value: articulo.precio_mayoreo * articulo.cantidad, items: [{ item_id: articulo.id, item_name: articulo.nombre, price: articulo.precio_mayoreo, quantity: articulo.cantidad }] });
    setArticulos((previos) => previos.filter((a) => a.id !== id));
  };

  const vaciar = () => setArticulos([]);
  const cargarPedido = (nuevos: ArticuloCarrito[]) => setArticulos(nuevos.slice(0, 100));

  const abrirCajon = () => {
    setAviso(null);
    setCajonAbierto(true);
    registrarEvento('view_cart', { currency: 'MXN', value: subtotal, items: articulos.map((a) => ({ item_id: a.id, item_name: a.nombre, price: a.precio_mayoreo, quantity: a.cantidad })) });
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
        cargarPedido,
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
export function useCarrito() {
  const contexto = useContext(ContextoCarrito);
  if (!contexto) {
    throw new Error('usarCarrito debe usarse dentro de <ProveedorCarrito>');
  }
  return contexto;
}

export { useCarrito as usarCarrito };
