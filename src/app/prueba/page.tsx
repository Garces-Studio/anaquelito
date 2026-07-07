'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CirclePause,
  CirclePlay,
  Menu,
  ShoppingBag,
  Star,
  X,
} from 'lucide-react';
import PieDePagina from '@/componentes/PieDePagina';

const productos = [
  { id: 'gomitas-enchiladas', nombre: 'Gomitas Enchiladas', precio: '$12.00', imagen: '/gomitas.png', etiqueta: 'Best seller' },
  { id: 'papas-crujientes', nombre: 'Papas Fuego', precio: '$15.00', imagen: '/papas.png', etiqueta: 'Best seller' },
  { id: 'cacahuate-japones', nombre: 'Cacahuate Japonés', precio: '$10.00', imagen: '/cacahuate.png', etiqueta: 'Popular' },
  { id: 'palomitas-caramelo', nombre: 'Palomitas Caramelo', precio: '$14.00', imagen: '/palomitas.png', etiqueta: 'Nuevo' },
  { id: 'mazapan-clasico', nombre: 'Mazapán Clásico', precio: '$9.00', imagen: '/mazapan.png', etiqueta: 'Clásico' },
  { id: 'chocolate-mini', nombre: 'Chocolate Mini', precio: '$11.00', imagen: '/chocolate.png', etiqueta: 'Favorito' },
];

const logos = ['DULCERÍA', 'TIENDITAS MX', 'K-BOTANAS', 'MERCADO PRO', 'ANAQUEL CLUB', 'ABARROTES'];

const reseñas = [
  ['Súper vendible', 'Se ve bonito en el anaquel y la gente lo pide por impulso. Las gomitas enchiladas se mueven rapidísimo.', 'Daniela A.'],
  ['Mi básico de tienda', 'Me gusta que puedo mezclar botanas, dulces y clásicos sin cargarme de cajas que tardan semanas.', 'Mike S.'],
  ['Llega fresco', 'La presentación ayuda mucho. Abrimos, acomodamos y el producto ya se siente listo para vender.', 'Carla M.'],
  ['Buen margen', 'Los precios hacen sentido para revender. La utilidad por pieza queda clara desde el pedido.', 'Jared D.'],
];

const promesa = [
  ['si', '3-5 días de alta rotación'],
  ['si', 'Producto fresco y visible'],
  ['no', 'Sin compras mínimas absurdas'],
  ['no', 'Sin sabores genéricos'],
  ['no', 'Sin empaque aburrido'],
];

const aparecer = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0 },
};

function Estrellas({ small = false }: { small?: boolean }) {
  return (
    <span className="flex items-center gap-0.5 text-[#FFB400]">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} size={small ? 12 : 15} fill="currentColor" />
      ))}
    </span>
  );
}

function Boton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center justify-center rounded-full border-2 border-[#2B1B12] p-1 transition-colors hover:border-[#FF5A5F]">
      <span className="flex items-center gap-3 rounded-full bg-[#2B1B12] px-5 py-2.5 text-[#FFF6EC] transition-colors group-hover:bg-[#FF5A5F] sm:px-7">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10">
          <ArrowRight className="-rotate-45 transition-transform group-hover:rotate-0" size={13} />
        </span>
        <span className="text-[11px] font-black uppercase tracking-[0.18em]">{children}</span>
        <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15">
          <ArrowRight className="-rotate-45 transition-transform group-hover:rotate-0" size={13} />
        </span>
      </span>
    </Link>
  );
}

function ProductoFlotante({
  src,
  className,
  delay = 0,
  rotate = 0,
}: {
  src: string;
  className: string;
  delay?: number;
  rotate?: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -22, 0], rotate: [rotate, rotate + 9, rotate] }}
      transition={{ duration: 6.5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
      className={`absolute rounded-lg border border-[#EBD9C3] bg-white/78 p-2 shadow-[0_18px_50px_rgba(43,27,18,0.12)] backdrop-blur ${className}`}
    >
      <Image src={src} alt="" width={180} height={180} className="blend-multiply" />
    </motion.div>
  );
}

export default function PaginaPrueba() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FFF6EC] font-kanit text-[#2B1B12] selection:bg-[#FF5A5F]/20 selection:text-[#2B1B12]">
      <nav className="sticky top-0 z-50 border-b border-[#EBD9C3] bg-[#FFF6EC]/88 px-4 py-3 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="font-podium text-lg font-black uppercase tracking-[0.2em]">
            ANAQUELITO
          </Link>
          <div className="hidden items-center gap-7 md:flex">
            {['Home 01', 'Catálogo', 'Escáner', 'Contacto'].map((item) => (
              <Link
                href={item === 'Catálogo' ? '/catalogo' : item === 'Escáner' ? '/escaner' : '/'}
                key={item}
                className="text-xs font-black uppercase tracking-[0.16em] text-[#6B5546] transition-colors hover:text-[#FF5A5F]"
              >
                {item}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/carrito" className="hidden h-11 w-11 place-items-center rounded-full border border-[#2B1B12] bg-white/50 md:grid" aria-label="Carrito">
              <ShoppingBag size={17} />
            </Link>
            <Boton href="/catalogo">Comprar</Boton>
            <button className="grid h-11 w-11 place-items-center rounded-full border border-[#2B1B12] bg-white/50 md:hidden" aria-label="Menu">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative overflow-hidden border-b border-[#EBD9C3] px-4 pt-10 md:px-8 md:pt-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,90,95,0.16),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(0,166,153,0.13),transparent_28%),linear-gradient(180deg,#FFF6EC_0%,#FFEFDD_100%)]" />
          <ProductoFlotante src="/paleta.png" className="left-[7%] top-[21%] hidden w-20 md:block lg:w-24" rotate={-14} />
          <ProductoFlotante src="/semillas.png" className="right-[8%] top-[19%] hidden w-20 md:block lg:w-24" delay={0.6} rotate={10} />
          <ProductoFlotante src="/chocolate.png" className="bottom-[20%] left-[14%] hidden w-20 lg:block" delay={1.1} rotate={8} />
          <ProductoFlotante src="/cacahuate.png" className="bottom-[15%] right-[13%] hidden w-20 lg:block" delay={1.6} rotate={-7} />

          <motion.div
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.12 }}
            className="relative z-10 mx-auto flex max-w-7xl flex-col items-center text-center"
          >
            <motion.div variants={aparecer} className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#EBD9C3] bg-white/70 px-4 py-2 shadow-sm">
              <Estrellas />
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#6B5546]">334 reseñas</span>
            </motion.div>

            <motion.h1 variants={aparecer} className="max-w-4xl font-podium text-[clamp(3rem,7.2vw,6.5rem)] uppercase leading-[0.86] tracking-normal">
              Dulces premium, listos para vender
            </motion.h1>

            <motion.p variants={aparecer} className="mt-5 max-w-xl text-base font-semibold leading-7 text-[#6B5546] md:text-lg">
              Selección lenta, empaque limpio y rotación rápida. Botanas y dulces pensados para que tu anaquel se vea irresistible.
            </motion.p>

            <motion.div variants={aparecer} className="mt-8">
              <Boton href="/catalogo">Comprar ahora</Boton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 44, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-7 grid min-h-[340px] w-full place-items-center md:min-h-[440px]"
            >
              <motion.div
                animate={{ rotate: [0, 6, -3, 0], scale: [1, 1.04, 1] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute h-[74%] w-[min(74%,620px)] rounded-full border border-[#EBD9C3] bg-white/45"
              />
              <div className="absolute h-[62%] w-[min(70%,560px)] rounded-full bg-[#FFB400]/18 blur-3xl" />
              <motion.div
                animate={{ y: [0, -16, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-[min(78vw,500px)] drop-shadow-[0_34px_55px_rgba(43,27,18,0.22)]"
              >
                <Image priority src="/gomitas.png" alt="Gomitas enchiladas de Anaquelito" width={1024} height={1024} className="blend-multiply" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 18, 0], rotate: [-8, -2, -8] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-[14%] left-[8%] w-24 rounded-lg border border-[#EBD9C3] bg-white/88 p-2 shadow-[0_22px_50px_rgba(43,27,18,0.16)] md:left-[19%] md:w-32"
              >
                <Image src="/papas.png" alt="" width={220} height={220} className="blend-multiply" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [8, 14, 8] }}
                transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="absolute right-[6%] top-[18%] w-24 rounded-lg border border-[#EBD9C3] bg-white/88 p-2 shadow-[0_22px_50px_rgba(43,27,18,0.16)] md:right-[18%] md:w-32"
              >
                <Image src="/palomitas.png" alt="" width={220} height={220} className="blend-multiply" />
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <section className="border-b border-[#EBD9C3] bg-[#2B1B12] py-8 text-[#FFF6EC]">
          <div className="mx-auto flex max-w-7xl items-center gap-8 overflow-hidden px-4 md:px-8">
            <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.22em] text-white/45">As seen in</span>
            <div className="flex min-w-max animate-marquee-left items-center gap-12">
              {[...logos, ...logos].map((logo, index) => (
                <span key={`${logo}-${index}`} className="font-podium text-2xl uppercase tracking-[0.14em] text-white/58">
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden border-b border-[#EBD9C3] bg-white px-4 py-20 md:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
              className="mx-auto max-w-5xl text-center font-podium text-[clamp(3rem,9vw,8rem)] uppercase leading-[0.86] tracking-normal"
            >
              Dulces sin ningún compromiso.
            </motion.h2>

            <div className="mt-14 grid gap-5 lg:grid-cols-12 lg:items-end">
              <motion.div
                initial={{ opacity: 0, y: 38 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.65 }}
                className="relative aspect-[4/5] overflow-hidden rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] lg:col-span-4"
              >
                <Image src="/papas.png" alt="Papas crujientes" fill sizes="(min-width:1024px) 33vw, 100vw" className="blend-multiply object-cover" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 52 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.65, delay: 0.1 }}
                className="relative aspect-[4/5] overflow-hidden rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] lg:col-span-4 lg:translate-y-12"
              >
                <video className="h-full w-full object-cover" src="/dulces-loop.mp4" autoPlay muted loop playsInline />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 38 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.65, delay: 0.2 }}
                className="flex flex-col gap-6 lg:col-span-4"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#EBD9C3] bg-[#FFF6EC]">
                  <Image src="/cacahuate.png" alt="Cacahuate japonés" fill sizes="(min-width:1024px) 33vw, 100vw" className="blend-multiply object-cover" />
                </div>
                <div>
                  <h3 className="font-podium text-3xl uppercase leading-none tracking-normal">Botanas hechas para rotar</h3>
                  <p className="mt-4 text-base font-medium leading-7 text-[#6B5546]">
                    Seleccionamos sabores que se explican solos: enchilado, crujiente, dulce y clásico. Nada se siente de relleno.
                  </p>
                  <Link href="/catalogo" className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em]">
                    Saber más <ArrowUpRight size={15} />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#EBD9C3] bg-[#FFF6EC] px-4 py-20 md:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <h2 className="font-podium text-[clamp(3rem,7vw,6.5rem)] uppercase leading-[0.86] tracking-normal">The sweet lineup</h2>
              <Boton href="/catalogo">View all</Boton>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {productos.map((producto, index) => (
                <motion.div
                  key={producto.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-70px' }}
                  transition={{ duration: 0.55, delay: index * 0.05 }}
                >
                  <Link href={`/catalogo/${producto.id}`} className="group block rounded-lg border border-[#EBD9C3] bg-white p-4 shadow-[0_16px_42px_rgba(43,27,18,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_58px_rgba(43,27,18,0.10)]">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[#FFF6EC] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#6B5546]">{producto.etiqueta}</span>
                      <span className="font-podium text-xl">{producto.precio}</span>
                    </div>
                    <div className="relative my-5 grid aspect-[1.12] place-items-center overflow-hidden rounded-lg bg-[#FFF6EC]">
                      <motion.div whileHover={{ scale: 1.08, rotate: 2 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }} className="relative w-[82%]">
                        <Image src={producto.imagen} alt={producto.nombre} width={1024} height={1024} className="blend-multiply" />
                      </motion.div>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#EBD9C3] pt-4">
                      <h3 className="font-podium text-2xl uppercase leading-none tracking-normal">{producto.nombre}</h3>
                      <span className="grid h-10 w-10 place-items-center rounded-full border border-[#2B1B12] transition-colors group-hover:bg-[#2B1B12] group-hover:text-white">
                        <ArrowRight size={15} className="-rotate-45 transition-transform group-hover:rotate-0" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#EBD9C3] bg-white px-4 py-20 md:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.75 }}
              className="relative overflow-hidden rounded-lg border border-[#EBD9C3] bg-[#2B1B12] lg:col-span-7"
            >
              <video className="aspect-video w-full object-cover opacity-90" src="/dulces-loop.mp4" autoPlay muted loop playsInline />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
                <span className="font-podium text-3xl uppercase leading-none">Reviews are in</span>
                <div className="flex gap-2">
                  <CirclePause size={34} />
                  <CirclePlay size={34} />
                </div>
              </div>
            </motion.div>
            <div className="lg:col-span-5">
              <h2 className="font-podium text-[clamp(3rem,7vw,6rem)] uppercase leading-[0.86] tracking-normal">Las tiendas ya lo piden</h2>
              <div className="mt-8 grid gap-4">
                {reseñas.slice(0, 2).map(([titulo, texto, nombre]) => (
                  <article key={titulo} className="rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] p-5">
                    <Estrellas small />
                    <h3 className="mt-4 font-podium text-2xl uppercase leading-none tracking-normal">{titulo}</h3>
                    <p className="mt-3 text-sm font-medium leading-6 text-[#6B5546]">"{texto}"</p>
                    <p className="mt-4 text-xs font-black uppercase tracking-[0.16em]">{nombre}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-[#EBD9C3] bg-[#2B1B12] px-4 py-20 text-[#FFF6EC] md:px-8 lg:py-28">
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_30%,#FF5A5F_0,transparent_28%),radial-gradient(circle_at_82%_68%,#00A699_0,transparent_30%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <h2 className="font-podium text-[clamp(3rem,8vw,7rem)] uppercase leading-[0.86] tracking-normal">Hecho para vender todos los días</h2>
              <p className="mt-6 max-w-xl text-base font-medium leading-7 text-white/68">
                Dulces y botanas con presentación fuerte, margen claro y rotación rápida para negocios que no pueden pausar la venta.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {promesa.map(([tipo, texto]) => (
                <div key={texto} className="flex items-center gap-3 rounded-lg border border-white/12 bg-white/[0.06] p-4 backdrop-blur">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${tipo === 'si' ? 'bg-[#00A699]' : 'bg-[#FF5A5F]'}`}>
                    {tipo === 'si' ? <Check size={17} /> : <X size={17} />}
                  </span>
                  <span className="text-sm font-black uppercase tracking-[0.1em]">{texto}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#EBD9C3] bg-[#FFF6EC] px-4 py-20 md:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <h2 className="font-podium text-[clamp(3rem,7vw,6rem)] uppercase leading-[0.86] tracking-normal">
                Nuestro viaje empieza en el anaquel
              </h2>
              <p className="mt-6 max-w-xl text-base font-medium leading-7 text-[#6B5546]">
                Anaquelito nació para que las tiendas puedan surtir con mejor presentación, menos fricción y productos que se antojan desde lejos.
              </p>
              <div className="mt-8">
                <Boton href="/catalogo">Surtir ahora</Boton>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-[#EBD9C3] bg-white">
                <Image src="/mazapan.png" alt="Mazapán" fill sizes="(min-width:1024px) 25vw, 50vw" className="blend-multiply object-cover" />
              </div>
              <div className="relative mt-0 aspect-[4/5] overflow-hidden rounded-lg border border-[#EBD9C3] bg-white sm:mt-12">
                <Image src="/chocolate.png" alt="Chocolate" fill sizes="(min-width:1024px) 25vw, 50vw" className="blend-multiply object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-white py-5">
          <div className="flex w-max animate-marquee-right gap-5">
            {[...productos, ...productos].map((producto, index) => (
              <div key={`${producto.id}-${index}`} className="relative h-40 w-52 overflow-hidden rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] md:h-56 md:w-72">
                <Image src={producto.imagen} alt="" fill sizes="300px" className="blend-multiply object-cover" />
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="tema-tienda" style={{ minHeight: 'auto' }}>
        <PieDePagina />
      </div>
    </div>
  );
}
