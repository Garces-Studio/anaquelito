'use client';

export type EventoComercio =
  | 'view_item' | 'add_to_cart' | 'remove_from_cart' | 'view_cart'
  | 'begin_checkout' | 'purchase' | 'whatsapp_click' | 'login' | 'sign_up';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...argumentos: unknown[]) => void;
  }
}

/** Capa neutral: funciona con GA4 cuando se configura y deja los eventos
 * disponibles en dataLayer para no acoplar la tienda a un proveedor. */
export function registrarEvento(nombre: EventoComercio, datos: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  const evento = { event: nombre, ...datos };
  if (window.gtag) window.gtag('event', nombre, datos);
  else {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push(evento);
  }
}
