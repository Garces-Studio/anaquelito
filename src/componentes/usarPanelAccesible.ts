'use client';

import { useEffect, type RefObject } from 'react';

/** Conserva el foco dentro del panel abierto y lo devuelve al disparador. */
export function usePanelAccesible(abierto: boolean, panel: RefObject<HTMLElement | null>, cerrar: () => void) {
  useEffect(() => {
    if (!abierto || !panel.current) return;
    const anterior = document.activeElement as HTMLElement | null;
    const superficie = panel.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const controles = () => Array.from(superficie.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex="0"]')).filter(e => e.getClientRects().length > 0);
    controles()[0]?.focus();
    const teclado = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') { evento.preventDefault(); cerrar(); }
      if (evento.key !== 'Tab') return;
      const elementos = controles();
      const primero = elementos[0];
      const ultimo = elementos.at(-1);
      if (!primero) { evento.preventDefault(); return; }
      if (evento.shiftKey && document.activeElement === primero) { evento.preventDefault(); ultimo?.focus(); }
      else if (!evento.shiftKey && document.activeElement === ultimo) { evento.preventDefault(); primero.focus(); }
    };
    superficie.addEventListener('keydown', teclado);
    return () => {
      superficie.removeEventListener('keydown', teclado);
      document.body.style.overflow = overflow;
      anterior?.focus();
    };
  }, [abierto, panel, cerrar]);
}
