'use client';

import React, { useState } from 'react';
import { MapPin, ShoppingBag, Ticket } from 'lucide-react';

const ICONOS = { pedidos: ShoppingBag, direcciones: MapPin, cupones: Ticket } as const;

export type PestanaPanel = {
  id: keyof typeof ICONOS;
  titulo: string;
  conteo: number;
  contenido: React.ReactNode;
};

/** Pestañas del panel del cliente: pedidos, direcciones y cupones en un solo
 *  bloque, sin recargar la página y con transición suave entre secciones. */
export default function PestanasPanel({ pestanas }: { pestanas: PestanaPanel[] }) {
  const [activa, setActiva] = useState(pestanas[0]?.id);
  const pestanaActiva = pestanas.find((p) => p.id === activa) ?? pestanas[0];

  return (
    <section className="mt-16">
      <div
        className="sticky top-24 z-20 mb-6 flex gap-2 overflow-x-auto rounded-full border border-[#EBD9C3] bg-white/85 p-1.5 shadow-[0_14px_40px_rgba(43,27,18,0.08)] backdrop-blur-xl scroll-tactil"
        role="tablist"
        aria-label="Secciones de tu cuenta"
      >
        {pestanas.map((pestana) => {
          const Icono = ICONOS[pestana.id];
          const esActiva = pestana.id === activa;
          return (
            <button
              key={pestana.id}
              type="button"
              role="tab"
              aria-selected={esActiva}
              onClick={() => setActiva(pestana.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-3 text-[11px] font-black uppercase tracking-[0.14em] transition-all duration-300 ${
                esActiva
                  ? 'bg-[#2B1B12] text-white shadow-[0_10px_26px_rgba(43,27,18,0.2)]'
                  : 'text-[#6B5546] hover:bg-[#FFEFDD] hover:text-[#2B1B12]'
              }`}
            >
              <Icono size={15} />
              {pestana.titulo}
              <span
                className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] ${
                  esActiva ? 'bg-[#FF5A5F] text-white' : 'bg-[#FFF6EC] text-[#6B5546]'
                }`}
              >
                {pestana.conteo}
              </span>
            </button>
          );
        })}
      </div>

      <div key={pestanaActiva?.id} className="aparecer" role="tabpanel">
        {pestanaActiva?.contenido}
      </div>
    </section>
  );
}
