'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import { ENVIO_GRATIS_DESDE, usarCarrito } from './ContextoCarrito';

/** Cajón lateral del carrito (sin modales que bloqueen): se desliza desde la
 *  derecha, deja ver el pedido completo con cantidades editables y muestra
 *  cuánto falta para el envío gratis. Incluye el aviso flotante que aparece
 *  cada vez que se agrega un dulce. */
export default function CajonCarrito() {
  const {
    articulos,
    cambiarCantidad,
    quitar,
    subtotal,
    totalArticulos,
    cajonAbierto,
    abrirCajon,
    cerrarCajon,
    aviso,
    descartarAviso,
  } = usarCarrito();

  // Bloquear el scroll del fondo mientras el cajón está abierto
  useEffect(() => {
    if (!cajonAbierto) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previo;
    };
  }, [cajonAbierto]);

  // Cerrar con la tecla Escape
  useEffect(() => {
    if (!cajonAbierto) return;
    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') cerrarCajon();
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [cajonAbierto, cerrarCajon]);

  const faltaEnvioGratis = Math.max(0, ENVIO_GRATIS_DESDE - subtotal);
  const progresoEnvio = Math.min(100, (subtotal / ENVIO_GRATIS_DESDE) * 100);

  return (
    <>
      {/* ---------- Aviso flotante al agregar ---------- */}
      {aviso && !cajonAbierto && (
        <div
          key={aviso.clave}
          className="aviso-carrito fixed bottom-5 left-1/2 z-[70] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2"
          role="status"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-[#EBD9C3] bg-white/95 p-3 shadow-[0_24px_60px_rgba(43,27,18,0.22)] backdrop-blur-xl">
            <span className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#FFF6EC]">
              {aviso.imagen ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={aviso.imagen} alt="" className="blend-multiply h-10 w-10 object-contain" />
              ) : (
                <ShoppingBag size={20} className="text-[#FF5A5F]" />
              )}
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#1E9E6A] text-white">
                <Check size={12} strokeWidth={3} />
              </span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-[#2B1B12]">{aviso.nombre}</p>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#6B5546]">
                Agregado al pedido · {totalArticulos} art.
              </p>
            </div>
            <button
              type="button"
              onClick={abrirCajon}
              className="shrink-0 rounded-full bg-[#2B1B12] px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#FF5A5F]"
            >
              Ver
            </button>
            <button
              type="button"
              onClick={descartarAviso}
              className="shrink-0 text-[#6B5546] transition hover:text-[#2B1B12]"
              aria-label="Cerrar aviso"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ---------- Fondo oscurecido ---------- */}
      <div
        className={`fixed inset-0 z-[80] bg-[#2B1B12]/45 backdrop-blur-[2px] transition-opacity duration-300 ${
          cajonAbierto ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={cerrarCajon}
        aria-hidden="true"
      />

      {/* ---------- Panel lateral ---------- */}
      <aside
        className={`fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col bg-[#FFF6EC] text-[#2B1B12] shadow-[-30px_0_80px_rgba(43,27,18,0.25)] transition-transform duration-500 ${
          cajonAbierto ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
        aria-label="Tu pedido"
        aria-hidden={!cajonAbierto}
      >
        <header className="flex items-center justify-between border-b border-[#EBD9C3] bg-white/70 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#FF5A5F] text-white shadow-[0_10px_24px_rgba(255,90,95,0.35)]">
              <ShoppingBag size={17} />
            </span>
            <div>
              <h2 className="font-titulo text-2xl !font-black uppercase leading-none">Tu pedido</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6B5546]">
                {totalArticulos} {totalArticulos === 1 ? 'artículo' : 'artículos'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={cerrarCajon}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#EBD9C3] bg-white transition hover:border-[#FF5A5F] hover:text-[#FF5A5F]"
            aria-label="Cerrar carrito"
          >
            <X size={18} />
          </button>
        </header>

        {/* Barra de envío gratis */}
        <div className="border-b border-[#EBD9C3] bg-white/50 px-5 py-3">
          <div className="flex items-center justify-between gap-3 text-[11px] font-black uppercase tracking-[0.1em]">
            <span className="inline-flex items-center gap-1.5 text-[#6B5546]">
              <Truck size={14} className={faltaEnvioGratis === 0 ? 'text-[#1E9E6A]' : 'text-[#FF8A3D]'} />
              {faltaEnvioGratis === 0 ? '¡Envío gratis desbloqueado!' : `Faltan $${faltaEnvioGratis.toFixed(0)} para envío gratis`}
            </span>
            <span className="text-[#2B1B12]">${ENVIO_GRATIS_DESDE}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EBD9C3]/60">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progresoEnvio}%`,
                background:
                  faltaEnvioGratis === 0
                    ? '#1E9E6A'
                    : 'linear-gradient(90deg, #FF5A5F 0%, #FFB400 100%)',
              }}
            />
          </div>
        </div>

        {/* Lista de artículos */}
        {articulos.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-white shadow-sm">
              <ShoppingBag size={26} className="text-[#FF5A5F]" />
            </span>
            <p className="font-titulo text-3xl !font-black uppercase leading-none">Aún está vacío</p>
            <p className="text-sm font-semibold text-[#6B5546]">
              Agrega dulces del catálogo y aquí verás tu pedido armándose en vivo.
            </p>
            <Link
              href="/catalogo"
              onClick={cerrarCajon}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#2B1B12] px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#FF5A5F]"
            >
              Ir al catálogo <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-4 scroll-tactil">
            <ul className="grid gap-3">
              {articulos.map((articulo) => (
                <li
                  key={articulo.id}
                  className="flex items-center gap-3 rounded-2xl border border-[#EBD9C3] bg-white p-3 shadow-[0_10px_28px_rgba(43,27,18,0.05)]"
                >
                  <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#FFF6EC]">
                    {articulo.imagen ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={articulo.imagen} alt={articulo.nombre} className="blend-multiply h-14 w-14 object-contain" />
                    ) : (
                      <ShoppingBag size={22} className="text-[#FF5A5F]" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black uppercase leading-tight">{articulo.nombre}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#6B5546]">
                      ${articulo.precio_mayoreo} / {articulo.unidad}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="inline-flex items-center rounded-full border border-[#EBD9C3] bg-[#FFF6EC] p-0.5">
                        <button
                          type="button"
                          onClick={() => cambiarCantidad(articulo.id, articulo.cantidad - 1)}
                          className="grid h-7 w-7 place-items-center rounded-full transition hover:bg-white"
                          aria-label={`Quitar uno de ${articulo.nombre}`}
                        >
                          <Minus size={13} />
                        </button>
                        <span className="min-w-8 text-center text-xs font-black">{articulo.cantidad}</span>
                        <button
                          type="button"
                          onClick={() => cambiarCantidad(articulo.id, articulo.cantidad + 1)}
                          className="grid h-7 w-7 place-items-center rounded-full transition hover:bg-white"
                          aria-label={`Agregar uno de ${articulo.nombre}`}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => quitar(articulo.id)}
                        className="grid h-7 w-7 place-items-center rounded-full text-[#6B5546] transition hover:bg-[#FFF6EC] hover:text-[#D64545]"
                        aria-label={`Eliminar ${articulo.nombre}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <strong className="shrink-0 text-lg font-black">
                    ${(articulo.cantidad * articulo.precio_mayoreo).toFixed(0)}
                  </strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pie con totales y acciones */}
        {articulos.length > 0 && (
          <footer className="border-t border-[#EBD9C3] bg-white/80 px-5 py-4 backdrop-blur" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
            <div className="mb-4 flex items-baseline justify-between">
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#6B5546]">Subtotal</span>
              <strong className="text-3xl font-black">${subtotal.toFixed(2)}</strong>
            </div>
            <Link
              href="/checkout"
              onClick={cerrarCajon}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2B1B12] px-6 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#FF5A5F]"
            >
              Ir a pagar <ArrowRight size={16} />
            </Link>
            <Link
              href="/carrito"
              onClick={cerrarCajon}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full border border-[#EBD9C3] bg-[#FFF6EC] px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#2B1B12] transition hover:border-[#FF5A5F] hover:text-[#FF5A5F]"
            >
              Ver carrito completo
            </Link>
          </footer>
        )}
      </aside>
    </>
  );
}
