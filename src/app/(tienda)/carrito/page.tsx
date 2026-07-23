'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck } from 'lucide-react';
import { ENVIO_GRATIS_DESDE, usarCarrito } from '@/componentes/carrito/ContextoCarrito';

const NUMERO_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMERO;

export default function PaginaCarrito() {
  const { articulos, cambiarCantidad, quitar, vaciar, subtotal, totalArticulos } = usarCarrito();

  const mensajePedido = encodeURIComponent(
    `¡Hola! Quiero hacer este pedido en Anaquelito:\n\n` +
      articulos
        .map((a) => `• ${a.cantidad} × ${a.nombre} (${a.unidad}) — $${(a.cantidad * a.precio_mayoreo).toFixed(2)}`)
        .join('\n') +
      `\n\nSubtotal: $${subtotal.toFixed(2)}`
  );

  if (articulos.length === 0) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#FFF6EC] px-4 pb-16 pt-28 text-[#2B1B12] md:px-8 md:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,90,95,0.16),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(255,180,0,0.16),transparent_28%)]" />
        <section className="aparecer relative mx-auto grid max-w-5xl gap-8 text-center">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#EBD9C3] bg-white/75 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#FF5A5F] shadow-sm">
            <ShoppingBag size={14} /> Carrito vacío
          </span>
          <h1 className="mx-auto max-w-4xl font-titulo !font-black text-[clamp(3.4rem,9vw,8rem)] uppercase leading-[0.84]">
            Llénalo con dulces de alto margen.
          </h1>
          <p className="mx-auto max-w-xl text-base font-semibold leading-7 text-[#6B5546]">
            Agrega productos del catálogo y arma tu pedido para tienda, café o reventa.
          </p>
          <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-lg border border-[#EBD9C3] bg-white shadow-[0_18px_50px_rgba(43,27,18,0.08)]">
            <Image src="/paleta.png" alt="Paleta" fill sizes="420px" className="blend-multiply object-cover" />
          </div>
          <Link href="/catalogo" className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#2B1B12] px-7 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#FF5A5F]">
            Ir al catálogo <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF6EC] px-4 pb-16 pt-28 text-[#2B1B12] md:px-8 md:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(0,166,153,0.12),transparent_28%),radial-gradient(circle_at_88%_20%,rgba(255,90,95,0.14),transparent_28%)]" />
      <div className="relative mx-auto max-w-7xl">
        <header className="aparecer mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#EBD9C3] bg-white/75 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#FF5A5F] shadow-sm">
              <ShoppingBag size={14} /> Pedido en curso
            </span>
            <h1 className="mt-5 font-titulo !font-black text-[clamp(3.3rem,8vw,7rem)] uppercase leading-[0.84]">Tu carrito</h1>
            <p className="mt-4 max-w-xl text-base font-semibold leading-7 text-[#6B5546]">
              Revisa cantidades, confirma tu subtotal y continúa al pago. El envío se calcula al cerrar tu pedido.
            </p>
          </div>
          <div className="grid gap-3 rounded-lg border border-[#EBD9C3] bg-white/80 p-5 shadow-sm backdrop-blur sm:grid-cols-2 lg:min-w-[360px]">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6B5546]">Artículos</p>
              <strong className="text-4xl font-black">{totalArticulos}</strong>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6B5546]">Subtotal</p>
              <strong className="text-4xl font-black">${subtotal.toFixed(0)}</strong>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
          <section className="aparecer retraso-1 grid gap-3">
            {articulos.map((articulo, index) => (
              <article
                key={articulo.id}
                className="grid gap-4 rounded-lg border border-[#EBD9C3] bg-white/86 p-4 shadow-[0_14px_36px_rgba(43,27,18,0.06)] backdrop-blur md:grid-cols-[1fr_auto] md:items-center"
                style={{ animation: `fade-up 0.55s ease-out ${Math.min(index * 0.06, 0.24)}s both` }}
              >
                <div className="flex items-center gap-4">
                  <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-[#FFF6EC]">
                    {articulo.imagen ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={articulo.imagen} alt={articulo.nombre} className="blend-multiply h-16 w-16 object-contain" />
                    ) : (
                      <ShoppingBag size={26} className="text-[#FF5A5F]" />
                    )}
                  </span>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#FF5A5F]">{articulo.unidad}</p>
                    <h2 className="font-titulo !font-black text-3xl uppercase leading-none">{articulo.nombre}</h2>
                    <p className="mt-2 text-sm font-semibold text-[#6B5546]">${articulo.precio_mayoreo} por {articulo.unidad}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:justify-end">
                  <div className="inline-flex items-center rounded-full border border-[#EBD9C3] bg-[#FFF6EC] p-1">
                    <button type="button" onClick={() => cambiarCantidad(articulo.id, articulo.cantidad - 1)} className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white" aria-label="Quitar uno">
                      <Minus size={15} />
                    </button>
                    <span className="min-w-10 text-center text-sm font-black">{articulo.cantidad}</span>
                    <button type="button" onClick={() => cambiarCantidad(articulo.id, articulo.cantidad + 1)} className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white" aria-label="Agregar uno">
                      <Plus size={15} />
                    </button>
                  </div>
                  <strong className="min-w-24 text-right text-2xl font-black">${(articulo.cantidad * articulo.precio_mayoreo).toFixed(2)}</strong>
                  <button type="button" onClick={() => quitar(articulo.id)} className="grid h-10 w-10 place-items-center rounded-full border border-[#EBD9C3] text-[#6B5546] transition hover:border-[#D64545] hover:text-[#D64545]" aria-label={`Quitar ${articulo.nombre}`}>
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            ))}
          </section>

          <aside className="aparecer retraso-2 sticky top-28 rounded-lg border border-[#EBD9C3] bg-white/90 p-5 shadow-[0_24px_70px_rgba(43,27,18,0.12)] backdrop-blur">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#00A699] text-white"><Truck size={19} /></span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6B5546]">Resumen</p>
                <h2 className="font-titulo !font-black text-3xl uppercase leading-none">Pedido</h2>
              </div>
            </div>
            <div className="mb-5 rounded-lg border border-dashed border-[#EBD9C3] bg-[#FFF6EC] p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.1em] text-[#6B5546]">
                {subtotal >= ENVIO_GRATIS_DESDE
                  ? '¡Envío gratis desbloqueado!'
                  : `Faltan $${(ENVIO_GRATIS_DESDE - subtotal).toFixed(0)} para envío gratis`}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EBD9C3]/70">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, (subtotal / ENVIO_GRATIS_DESDE) * 100)}%`,
                    background:
                      subtotal >= ENVIO_GRATIS_DESDE
                        ? '#1E9E6A'
                        : 'linear-gradient(90deg, #FF5A5F 0%, #FFB400 100%)',
                  }}
                />
              </div>
            </div>
            <div className="grid gap-3 border-y border-[#EBD9C3] py-5">
              <div className="flex justify-between text-sm font-bold text-[#6B5546]"><span>Subtotal</span><strong className="text-[#2B1B12]">${subtotal.toFixed(2)}</strong></div>
              <div className="flex justify-between text-sm font-bold text-[#6B5546]"><span>Envío</span><strong className={subtotal >= ENVIO_GRATIS_DESDE ? 'text-[#1E9E6A]' : 'text-[#2B1B12]'}>{subtotal >= ENVIO_GRATIS_DESDE ? 'Gratis' : 'Por confirmar'}</strong></div>
              <div className="flex justify-between text-sm font-bold text-[#6B5546]"><span>Descuento volumen</span><strong className="text-[#00A699]">Al confirmar</strong></div>
            </div>
            <div className="mt-5 flex items-baseline justify-between">
              <span className="text-sm font-black uppercase tracking-[0.14em] text-[#6B5546]">Total base</span>
              <strong className="text-4xl font-black">${subtotal.toFixed(0)}</strong>
            </div>
            <Link href="/checkout" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2B1B12] px-6 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#FF5A5F]">
              Ir a pagar <ArrowRight size={16} />
            </Link>
            {NUMERO_WHATSAPP && (
              <a href={`https://wa.me/${NUMERO_WHATSAPP}?text=${mensajePedido}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-[#EBD9C3] bg-[#FFF6EC] px-6 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-[#2B1B12]">
                Enviar por WhatsApp
              </a>
            )}
            <button type="button" onClick={vaciar} className="mt-4 w-full text-center text-sm font-black text-[#6B5546] transition hover:text-[#D64545]">
              Vaciar carrito
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
