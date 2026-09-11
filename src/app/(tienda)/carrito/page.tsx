'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2, CreditCard, LockKeyhole, Minus, Plus, ShoppingBag, Sparkles, Trash2, Truck } from 'lucide-react';
import { usarCarrito } from '@/componentes/carrito/ContextoCarrito';
import { registrarEvento } from '@/lib/analitica';
import EnlaceWhatsApp from '@/componentes/EnlaceWhatsApp';
import { CAJAS_POR_TARIMA, desgloseCajas } from '@/lib/mayoreo';

const NUMERO_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMERO;
const PAGO_ACTIVO = process.env.NEXT_PUBLIC_CHECKOUT_HABILITADO === 'true';

export default function PaginaCarrito() {
  const { articulos, cambiarCantidad, quitar, vaciar, subtotal, totalArticulos } = usarCarrito();
  const vistaRegistrada = useRef(false);

  useEffect(() => {
    if (articulos.length && !vistaRegistrada.current) {
      vistaRegistrada.current = true;
      registrarEvento('view_cart', { currency: 'MXN', value: subtotal, items: articulos.map((a) => ({ item_id: a.id, item_name: a.nombre, price: a.precio_mayoreo, quantity: a.cantidad })) });
    }
  }, [articulos, subtotal]);

  const mensajePedido = encodeURIComponent(
    `¡Hola! Quiero hacer este pedido en Anaquelito:\n\n` +
      articulos
        .map((a) => `• ${desgloseCajas(a.cantidad)} de ${a.nombre} — $${(a.cantidad * a.precio_mayoreo).toFixed(2)}`)
        .join('\n') +
      `\n\nSubtotal estimado: ${subtotal.toFixed(2)}\nQuedo atento a disponibilidad y envío.`
  );

  if (articulos.length === 0) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#F7F3F8] px-4 pb-20 pt-28 text-[#2B1B12] md:px-8 md:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(255,90,95,.24),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(0,166,153,.2),transparent_30%),linear-gradient(145deg,#FFF6EC,#F8F5FB_55%,#EEF9F7)]" />
        <section className="aparecer relative mx-auto grid max-w-5xl gap-7 overflow-hidden rounded-[32px] border border-white/80 bg-white/65 px-6 py-12 text-center shadow-[0_32px_90px_rgba(43,27,18,.13)] backdrop-blur-xl sm:px-10">
          <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#FF5A5F]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#00A699]/15 blur-3xl" />
          <span className="relative mx-auto inline-flex items-center gap-2 rounded-full border border-[#FF5A5F]/20 bg-[#FFF0F0] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#FF5A5F] shadow-sm">
            <ShoppingBag size={14} /> Carrito vacío
          </span>
          <h1 className="relative mx-auto max-w-4xl !font-black text-[clamp(2.8rem,8vw,6rem)] leading-[.95]">
            Arma el surtido de tu negocio.
          </h1>
          <p className="relative mx-auto max-w-xl text-base font-semibold leading-7 text-[#6B5546]">
            Agrega productos del catálogo y arma tu pedido para tienda, café o reventa.
          </p>
          <div className="relative mx-auto aspect-[16/10] w-full max-w-md overflow-hidden rounded-[26px] border border-white bg-[linear-gradient(145deg,#FFF0D5,#FFE6E7)] shadow-[0_22px_55px_rgba(255,90,95,.16)]">
            <Image src="/productos/gomita-oso.png" alt="Panditas clásicos" fill sizes="420px" className="object-contain p-6 drop-shadow-[0_18px_24px_rgba(43,27,18,.2)]" />
          </div>
          <Link href="/catalogo" className="relative mx-auto inline-flex min-h-[56px] items-center gap-2 rounded-2xl bg-[#FF5A5F] px-7 py-4 text-sm font-black text-white shadow-[0_14px_32px_rgba(255,90,95,.28)] transition hover:-translate-y-1 hover:bg-[#E0484D]" style={{ color: '#FFFFFF' }}>
            Ir al catálogo <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F3F8] px-4 pb-20 pt-28 text-[#2B1B12] md:px-8 md:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(255,90,95,.2),transparent_27%),radial-gradient(circle_at_92%_15%,rgba(0,166,153,.18),transparent_28%),radial-gradient(circle_at_72%_82%,rgba(118,33,176,.1),transparent_30%),linear-gradient(145deg,#FFF6EC,#F8F5FB_54%,#EEF9F7)]" />
      <div className="absolute left-[5%] top-44 h-40 w-40 animate-pulse rounded-full border border-[#FF5A5F]/20 shadow-[0_0_70px_rgba(255,90,95,.14)]" />
      <div className="relative mx-auto max-w-7xl">
        <header className="aparecer relative mb-8 grid gap-7 overflow-hidden rounded-[30px] bg-[#23131F] p-7 text-white shadow-[0_28px_75px_rgba(43,27,18,.22)] sm:p-9 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(255,90,95,.62),transparent_30%),radial-gradient(circle_at_5%_100%,rgba(0,166,153,.36),transparent_28%),linear-gradient(145deg,#21131B,#4A2037_62%,#6E2941)]" />
          <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:40px_40px]" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white backdrop-blur">
              <Sparkles size={14} className="text-[#FFB400]" /> Pedido en curso
            </span>
            <h1 className="mt-5 !font-black text-[clamp(2.8rem,7vw,5.8rem)] leading-[.92] text-white">Tu carrito</h1>
            <p className="mt-4 max-w-xl text-base font-semibold leading-7 text-white/68">
              Revisa cantidades, confirma tu subtotal y continúa al pago. El envío se calcula al cerrar tu pedido.
            </p>
          </div>
          <div className="relative grid gap-3 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md sm:grid-cols-2 lg:min-w-[360px]">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/55">Cajas totales</p>
              <strong className="text-4xl font-black text-white">{totalArticulos}</strong>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/55">Subtotal</p>
              <strong className="text-4xl font-black text-[#FFB400]">${subtotal.toFixed(0)}</strong>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
          <section className="aparecer retraso-1 grid gap-3">
            {articulos.map((articulo, index) => (
              <article
                key={articulo.id}
                className="group grid gap-5 rounded-[24px] border border-white/90 bg-white/88 p-4 shadow-[0_16px_42px_rgba(43,27,18,.07)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#FF5A5F]/30 hover:shadow-[0_24px_55px_rgba(43,27,18,.11)] sm:p-5 md:grid-cols-[1fr_auto] md:items-center"
                style={{ animation: `fade-up 0.55s ease-out ${Math.min(index * 0.06, 0.24)}s both` }}
              >
                <div className="flex items-center gap-4">
                  <span className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-[20px] bg-[linear-gradient(145deg,#FFF8F1,#F2F9F7)] shadow-inner">
                    {articulo.imagen ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={articulo.imagen} alt={articulo.nombre} className="blend-multiply h-16 w-16 object-contain" />
                    ) : (
                      <ShoppingBag size={26} className="text-[#FF5A5F]" />
                    )}
                  </span>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#FF5A5F]">Presentación · {articulo.unidad}</p>
                    <h2 className="!text-2xl !font-black leading-tight">{articulo.nombre}</h2>
                    <p className="mt-2 text-sm font-semibold text-[#6B5546]">${articulo.precio_mayoreo} por caja · {desgloseCajas(articulo.cantidad)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:justify-end">
                  <div className="inline-flex items-center rounded-2xl border border-[#E6D8CD] bg-[#FFF8F1] p-1 shadow-inner">
                    <button type="button" onClick={() => cambiarCantidad(articulo.id, articulo.cantidad - 1)} className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white" aria-label="Quitar uno">
                      <Minus size={15} />
                    </button>
                    <span className="min-w-10 text-center text-sm font-black">{articulo.cantidad}</span>
                    <button type="button" onClick={() => cambiarCantidad(articulo.id, articulo.cantidad + 1)} className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white" aria-label="Agregar uno">
                      <Plus size={15} />
                    </button>
                  </div>
                  <button type="button" onClick={() => cambiarCantidad(articulo.id, Math.min(10000, articulo.cantidad + CAJAS_POR_TARIMA))} className="rounded-xl border border-[#00A699]/25 bg-[#E9F8F5] px-3 py-2.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#007A70] transition hover:-translate-y-0.5 hover:border-[#00A699]">
                    + 1 tarima
                  </button>
                  <strong className="min-w-24 text-right text-2xl font-black">${(articulo.cantidad * articulo.precio_mayoreo).toFixed(2)}</strong>
                  <button type="button" onClick={() => quitar(articulo.id)} className="grid h-10 w-10 place-items-center rounded-full border border-[#EBD9C3] text-[#6B5546] transition hover:border-[#D64545] hover:text-[#D64545]" aria-label={`Quitar ${articulo.nombre}`}>
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            ))}
          </section>

          <aside className="aparecer retraso-2 sticky top-28 overflow-hidden rounded-[26px] border border-white/90 bg-white/92 p-6 shadow-[0_28px_75px_rgba(43,27,18,.14)] backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#FF5A5F,#FFB400,#00A699,#7621B0)]" />
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#00A699] text-white shadow-[0_10px_24px_rgba(0,166,153,.24)]"><Truck size={20} /></span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6B5546]">Resumen</p>
                <h2 className="!text-3xl !font-black leading-none">Tu resumen</h2>
              </div>
            </div>
            <p className="mb-5 text-sm text-[#6B5546]">Confirma cobertura y costo de envío antes de cerrar tu compra.</p>
            <div className="grid gap-3 rounded-2xl bg-[#FFF8F1] p-4">
              <div className="flex justify-between text-sm font-bold text-[#6B5546]"><span>Subtotal</span><strong className="text-[#2B1B12]">${subtotal.toFixed(2)}</strong></div>
              <div className="flex justify-between text-sm font-bold text-[#6B5546]"><span>Envío</span><strong className="text-[#2B1B12]">Por confirmar</strong></div>
              <div className="flex justify-between text-sm font-bold text-[#6B5546]"><span>Descuento volumen</span><strong className="text-[#2B1B12]">No aplicado</strong></div>
            </div>
            <div className="mt-5 flex items-baseline justify-between">
              <span className="text-sm font-black uppercase tracking-[0.14em] text-[#6B5546]">Total base</span>
              <strong className="text-4xl font-black">${subtotal.toFixed(0)}</strong>
            </div>
            {PAGO_ACTIVO ? <Link href="/checkout" onClick={() => registrarEvento('begin_checkout', { currency: 'MXN', value: subtotal })} className="mt-5 inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5A5F] px-6 py-4 text-sm font-black text-white shadow-[0_14px_32px_rgba(255,90,95,.28)] transition hover:-translate-y-1 hover:bg-[#E0484D]" style={{ color: '#FFFFFF' }}>
              <CreditCard size={18} /> Ir a pagar <ArrowRight size={16} />
            </Link> : <div className="mt-5 rounded-2xl border border-[#F0D6A0] bg-[#FFF5DE] px-4 py-4 text-center"><CreditCard size={19} className="mx-auto mb-2 text-[#A06A00]" /><p className="text-sm font-black text-[#7A5630]">Pago web en preparación</p><p className="mt-1 text-xs font-semibold text-[#8B7465]">Pronto podrás cerrar tu compra desde aquí.</p></div>}
            {NUMERO_WHATSAPP && (
              <EnlaceWhatsApp href={`https://wa.me/${NUMERO_WHATSAPP}?text=${mensajePedido}`} className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-[#EBD9C3] bg-[#FFF6EC] px-6 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-[#2B1B12]">
                Finalizar pedido por WhatsApp
              </EnlaceWhatsApp>
            )}
            <button type="button" onClick={vaciar} className="mt-4 w-full text-center text-sm font-black text-[#6B5546] transition hover:text-[#D64545]">
              Vaciar carrito
            </button>
            <div className="mt-5 grid gap-2 border-t border-[#E6D8CD] pt-5 text-xs font-semibold text-[#6B5546]"><p className="flex items-center gap-2"><LockKeyhole size={15} className="text-[#00A699]" /> Compra y datos protegidos</p><p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-[#00A699]" /> Cantidades editables antes de pagar</p></div>
          </aside>
        </div>
      </div>
    </main>
  );
}
