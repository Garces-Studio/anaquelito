'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, CheckCircle2, CreditCard, Minus, PackageOpen, Plus, ShoppingBag, Sparkles, Trash2, Truck, X } from 'lucide-react';
import { usarCarrito } from './ContextoCarrito';
import EnlaceWhatsApp from '@/componentes/EnlaceWhatsApp';
import { registrarEvento } from '@/lib/analitica';
import { CAJAS_POR_TARIMA, desgloseCajas } from '@/lib/mayoreo';

const PAGO_ACTIVO = process.env.NEXT_PUBLIC_CHECKOUT_HABILITADO === 'true';
const NUMERO_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMERO;

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
  const mensajePedido = encodeURIComponent(`Hola, quiero realizar un pedido en Anaquelito:\n\n${articulos.map((a) => `${desgloseCajas(a.cantidad)} de ${a.nombre}`).join('\n')}\n\nTotal estimado: $${subtotal.toFixed(2)}\n\n¿Me confirman disponibilidad y opciones de entrega?`);

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
                Agregado al pedido · {desgloseCajas(totalArticulos)}
              </p>
            </div>
            <button
              type="button"
              onClick={abrirCajon}
              className="shrink-0 rounded-full bg-[#FF5A5F] px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#E0484D]"
              style={{ backgroundColor: '#FF5A5F', color: '#FFFFFF' }}
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
        className={`fixed right-0 top-0 z-[90] flex h-full w-full max-w-[460px] flex-col overflow-hidden bg-[#F8F5F7] text-[#2B1B12] shadow-[-35px_0_100px_rgba(35,19,31,.32)] transition-transform duration-500 ${
          cajonAbierto ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
        aria-label="Tu pedido"
        aria-hidden={!cajonAbierto}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_95%_8%,rgba(255,90,95,.18),transparent_24%),radial-gradient(circle_at_8%_86%,rgba(0,166,153,.12),transparent_28%)]" />
        <header className="relative flex items-center justify-between overflow-hidden border-b border-white/10 bg-[#23131F] px-5 py-5 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_0%,rgba(255,90,95,.58),transparent_34%),linear-gradient(135deg,#21131B,#4B2037)]" />
          <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:34px_34px]" />
          <div className="flex items-center gap-3">
            <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-[#FF5A5F] text-white shadow-[0_10px_24px_rgba(255,90,95,0.35)]">
              <ShoppingBag size={17} />
            </span>
            <div className="relative">
              <p className="mb-1 flex items-center gap-1 text-[9px] font-black uppercase tracking-[.16em] text-[#FFB400]"><Sparkles size={11} /> Carrito Anaquelito</p>
              <h2 className="text-2xl !font-black uppercase leading-none text-white">Tu pedido</h2>
              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/55">
                {desgloseCajas(totalArticulos)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={cerrarCajon}
            className="relative grid h-11 w-11 place-items-center rounded-2xl border border-white/20 bg-white/10 text-white transition hover:rotate-6 hover:border-white/50 hover:bg-white/15"
            style={{ color: '#FFFFFF' }}
            aria-label="Cerrar carrito"
          >
            <X size={18} />
          </button>
        </header>

        <p className="relative border-b border-[#CFE9E5] bg-[#E9F8F5] px-5 py-3 text-sm font-semibold text-[#007A70]"><Truck size={15} className="mr-2 inline" />Envío y cobertura por confirmar.</p>


        {/* Lista de artículos */}
        {articulos.length === 0 ? (
          <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-8 py-10 text-center">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,90,95,.16),rgba(255,180,0,.06)_44%,transparent_70%)]" />
            <span className="relative grid h-20 w-20 place-items-center rounded-[24px] border border-white bg-white shadow-[0_18px_45px_rgba(43,27,18,.12)]">
              <PackageOpen size={32} className="text-[#FF5A5F]" />
            </span>
            <p className="relative mt-5 text-3xl !font-black leading-none">Tu carrito está listo para empezar</p>
            <p className="relative mt-3 max-w-xs text-sm font-semibold leading-6 text-[#6B5546]">
              Agrega dulces del catálogo y aquí verás tu pedido armándose en vivo.
            </p>
            <Link
              href="/catalogo"
              onClick={cerrarCajon}
              className="relative mt-6 inline-flex min-h-[54px] items-center gap-2 rounded-2xl bg-[#FF5A5F] px-7 py-4 text-sm font-black text-white shadow-[0_14px_34px_rgba(255,90,95,.3)] transition duration-300 hover:-translate-y-1 hover:bg-[#E0484D] hover:shadow-[0_20px_44px_rgba(255,90,95,.38)]"
              style={{ backgroundColor: '#FF5A5F', color: '#FFFFFF' }}
            >
              Ir al catálogo <ArrowRight size={15} />
            </Link>
            <p className="relative mt-5 flex items-center gap-2 text-xs font-bold text-[#008D82]"><CheckCircle2 size={15} /> Compra por caja o tarima</p>
          </div>
        ) : (
          <div className="relative flex-1 overflow-y-auto px-4 py-4 scroll-tactil">
            <ul className="grid gap-3">
              {articulos.map((articulo) => (
                <li
                  key={articulo.id}
                  className="flex items-center gap-3 rounded-[22px] border border-white/90 bg-white/90 p-3 shadow-[0_12px_32px_rgba(43,27,18,.07)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#FF5A5F]/25 hover:shadow-[0_18px_40px_rgba(43,27,18,.1)]"
                >
                  <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[linear-gradient(145deg,#FFF8F1,#F0F9F7)] shadow-inner">
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
                      ${articulo.precio_mayoreo} / caja · {desgloseCajas(articulo.cantidad)}
                    </p>
                    {(articulo.piezas_por_caja || articulo.bolsas_por_caja) && <p className="text-[10px] font-bold text-[#6B5546]">{articulo.cantidad * (articulo.piezas_por_caja ?? articulo.bolsas_por_caja ?? 0)} {articulo.piezas_por_caja ? 'piezas' : 'bolsas'} totales</p>}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="inline-flex items-center rounded-xl border border-[#E6D8CD] bg-[#FFF8F1] p-0.5">
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
                      <button type="button" onClick={() => cambiarCantidad(articulo.id, Math.min(10000, articulo.cantidad + CAJAS_POR_TARIMA))} className="rounded-xl border border-[#00A699]/25 bg-[#E9F8F5] px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.08em] text-[#007A70] transition hover:border-[#00A699]">
                        + Tarima
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
          <footer className="relative border-t border-[#E6D8CD] bg-white/90 px-5 py-4 backdrop-blur-xl" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
            <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#FF5A5F,#FFB400,#00A699,#7621B0)]" />
            <div className="mb-4 flex items-baseline justify-between">
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#6B5546]">Subtotal</span>
              <strong className="text-3xl font-black">${subtotal.toFixed(2)}</strong>
            </div>
            {PAGO_ACTIVO ? <Link
              href="/checkout"
              onClick={() => { registrarEvento('begin_checkout', { currency: 'MXN', value: subtotal }); cerrarCajon(); }}
              className="inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5A5F] px-6 py-4 text-sm font-black text-white shadow-[0_14px_32px_rgba(255,90,95,.28)] transition hover:-translate-y-0.5 hover:bg-[#E0484D]"
              style={{ backgroundColor: '#FF5A5F', color: '#FFFFFF' }}
            >
              <CreditCard size={17} /> Ir a pagar <ArrowRight size={16} />
            </Link> : <p className="rounded-xl bg-[#FFF0D5] px-4 py-3 text-center text-sm font-bold text-[#7A5630]">Pago web en preparación</p>}
            {NUMERO_WHATSAPP && <EnlaceWhatsApp href={`https://wa.me/${NUMERO_WHATSAPP}?text=${mensajePedido}`} className="mt-2 inline-flex w-full items-center justify-center rounded-full border border-[#EBD9C3] bg-white px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#2B1B12]">Pedir por WhatsApp</EnlaceWhatsApp>}
            <Link href="/catalogo" onClick={cerrarCajon} className="mt-2 inline-flex w-full items-center justify-center px-6 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6B5546]">Continuar compra</Link>
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
