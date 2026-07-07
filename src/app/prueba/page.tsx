'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Users,
  X,
} from 'lucide-react';
import PieDePagina from '@/componentes/PieDePagina';

const productos = [
  {
    id: 'gomitas-enchiladas',
    nombre: 'Gomitas Enchiladas',
    precio: '$12.00',
    imagen: '/gomitas.png',
    etiqueta: 'Más vendido',
    fondo: 'from-[#FF5A5F]/20 via-[#FFB400]/10 to-transparent',
    acento: '#FF5A5F',
  },
  {
    id: 'papas-crujientes',
    nombre: 'Papas Fuego',
    precio: '$15.00',
    imagen: '/papas.png',
    etiqueta: 'Crujiente',
    fondo: 'from-[#FFB400]/24 via-[#FF8A3D]/12 to-transparent',
    acento: '#FF8A3D',
  },
  {
    id: 'cacahuate-japones',
    nombre: 'Cacahuate Japonés',
    precio: '$10.00',
    imagen: '/cacahuate.png',
    etiqueta: 'Botana top',
    fondo: 'from-[#00A699]/22 via-[#FFB400]/10 to-transparent',
    acento: '#00A699',
  },
  {
    id: 'palomitas-caramelo',
    nombre: 'Palomitas Caramelo',
    precio: '$14.00',
    imagen: '/palomitas.png',
    etiqueta: 'Nuevo lote',
    fondo: 'from-[#7621B0]/18 via-[#E882B4]/12 to-transparent',
    acento: '#7621B0',
  },
];

const socios = ['DULCES SELECTOS', 'K-BOTANAS', 'MERCADITO MX', 'ABARROTES REGIO', 'TIENDITAS PRO', 'ANAQUEL CLUB'];

const reseñas = [
  {
    titulo: 'Venta rápida',
    texto: 'Las gomitas y papas se nos acaban antes del fin de semana. Se ven bien en anaquel y dejan margen claro.',
    nombre: 'Mariana R.',
  },
  {
    titulo: 'Surtido confiable',
    texto: 'Nos ayuda a reponer sin batallar. El producto llega fresco y ya sabemos qué conviene empujar.',
    nombre: 'Luis G.',
  },
  {
    titulo: 'Buen margen',
    texto: 'Los precios están pensados para tienda. Compramos por mezcla y no por cajas imposibles.',
    nombre: 'Dulcería Norte',
  },
];

const beneficios = [
  {
    icono: ShieldCheck,
    titulo: 'Frescura visible',
    texto: 'Lotes rotados, empaque limpio y producto que luce listo para vender desde el primer día.',
  },
  {
    icono: Users,
    titulo: 'Margen real',
    texto: 'Precios pensados para tienditas, cafeterías y revendedores que necesitan utilidad rápida.',
  },
  {
    icono: Truck,
    titulo: 'Reposición fácil',
    texto: 'Entrega ágil y mezcla de productos para que no te quedes sin los sabores que más se mueven.',
  },
];

const promesa = [
  { tipo: 'si', texto: 'Producto fresco y vistoso' },
  { tipo: 'si', texto: 'Pedidos por mezcla inteligente' },
  { tipo: 'si', texto: 'Márgenes claros por pieza' },
  { tipo: 'no', texto: 'Cajas eternas sin rotación' },
  { tipo: 'no', texto: 'Sabores genéricos sin gancho' },
  { tipo: 'no', texto: 'Compras mínimas complicadas' },
];

const aparecer = {
  oculto: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function BotonPrincipal({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group relative inline-flex items-center justify-center rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A5F]">
      <span className="absolute inset-0 rounded-full border-2 border-[#2B1B12] transition-colors duration-300 group-hover:border-[#FF5A5F]" />
      <span className="relative flex items-center gap-3 rounded-full bg-[#2B1B12] px-5 py-2.5 text-[#FFF6EC] transition-colors duration-300 group-hover:bg-[#FF5A5F] sm:px-7 sm:py-3">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0.5">
          <ArrowRight size={13} className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
        </span>
        <span className="text-[11px] font-extrabold uppercase tracking-[0.18em]">{children}</span>
        <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15 transition-transform duration-300 group-hover:-translate-x-0.5">
          <ArrowRight size={13} className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
        </span>
      </span>
    </Link>
  );
}

function Estrellas() {
  return (
    <span className="flex gap-0.5 text-[#FFB400]">
      {Array.from({ length: 5 }).map((_, indice) => (
        <Star key={indice} size={14} fill="currentColor" />
      ))}
    </span>
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
            {['Catálogo', 'Escáner', 'Dashboard'].map((item) => (
              <Link
                key={item}
                href={item === 'Catálogo' ? '/catalogo' : item === 'Escáner' ? '/escaner' : '/dashboard'}
                className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7A6455] transition-colors hover:text-[#FF5A5F]"
              >
                {item}
              </Link>
            ))}
          </div>
          <BotonPrincipal href="/catalogo">Comprar</BotonPrincipal>
        </div>
      </nav>

      <main>
        <section className="relative min-h-[calc(100vh-73px)] overflow-hidden border-b border-[#EBD9C3] px-4 pb-10 pt-10 md:px-8 md:pt-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,90,95,0.16),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(0,166,153,0.14),transparent_26%),radial-gradient(circle_at_50%_86%,rgba(118,33,176,0.12),transparent_32%)]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#FFF6EC] to-transparent" />

          <motion.div
            animate={{ y: [0, -24, 0], rotate: [-7, 6, -7] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-[5%] top-[22%] hidden w-24 md:block"
          >
            <Image src="/paleta.png" alt="" width={220} height={220} className="blend-multiply" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 22, 0], rotate: [8, -5, 8] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            className="absolute right-[7%] top-[18%] hidden w-28 md:block"
          >
            <Image src="/semillas.png" alt="" width={240} height={240} className="blend-multiply" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -18, 0], rotate: [4, -8, 4] }}
            transition={{ duration: 6.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            className="absolute bottom-[18%] right-[13%] hidden w-24 lg:block"
          >
            <Image src="/chocolate.png" alt="" width={220} height={220} className="blend-multiply" />
          </motion.div>

          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_0.95fr]">
            <motion.div initial="oculto" animate="visible" transition={{ staggerChildren: 0.1 }} className="flex flex-col items-start gap-6 pt-4 lg:pt-0">
              <motion.div variants={aparecer} className="inline-flex items-center gap-2 rounded-full border border-[#EBD9C3] bg-white/70 px-3 py-2 shadow-sm">
                <Estrellas />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7A6455]">
                  +1,200 tienditas surtidas
                </span>
              </motion.div>
              <motion.h1 variants={aparecer} className="max-w-4xl font-podium text-[clamp(3rem,7.6vw,7.2rem)] uppercase leading-[0.88] tracking-normal">
                Dulces con margen, antojo y movimiento
              </motion.h1>
              <motion.p variants={aparecer} className="max-w-xl text-base font-semibold leading-7 text-[#7A6455] md:text-lg">
                Surtido mayorista de botanas, gomitas y clásicos mexicanos para llenar anaqueles con producto que se ve premium y se vende diario.
              </motion.p>
              <motion.div variants={aparecer} className="flex flex-wrap items-center gap-4">
                <BotonPrincipal href="/catalogo">Surtir mi negocio</BotonPrincipal>
                <Link href="/escaner" className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#2B1B12] transition-colors hover:text-[#FF5A5F]">
                  Reordenar por escáner <ArrowUpRight size={15} />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto grid min-h-[430px] w-full max-w-[560px] place-items-center md:min-h-[560px]"
            >
              <div className="absolute h-[72%] w-[72%] rounded-full bg-[#FFB400]/18 blur-3xl" />
              <motion.div
                animate={{ rotate: [0, 7, -4, 0], scale: [1, 1.04, 1] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute h-[78%] w-[78%] rounded-full border border-[#EBD9C3] bg-white/45"
              />
              <motion.div
                animate={{ y: [0, -18, 0] }}
                transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-[82%] drop-shadow-[0_34px_45px_rgba(43,27,18,0.18)]"
              >
                <Image priority src="/gomitas.png" alt="Gomitas enchiladas de Dulces" width={1024} height={1024} className="blend-multiply" />
              </motion.div>
              {productos.slice(1).map((producto, indice) => (
                <motion.div
                  key={producto.id}
                  animate={{ y: [0, indice % 2 ? 16 : -16, 0], rotate: [0, indice % 2 ? -8 : 8, 0] }}
                  transition={{ duration: 6 + indice, repeat: Infinity, ease: 'easeInOut', delay: indice * 0.3 }}
                  className={[
                    'absolute hidden w-24 rounded-lg border border-[#EBD9C3] bg-white/82 p-2 shadow-[0_18px_35px_rgba(43,27,18,0.10)] backdrop-blur md:block',
                    indice === 0 ? 'bottom-[14%] left-[4%]' : indice === 1 ? 'right-[2%] top-[18%]' : 'bottom-[8%] right-[9%]',
                  ].join(' ')}
                >
                  <Image src={producto.imagen} alt="" width={180} height={180} className="blend-multiply" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="overflow-hidden border-b border-[#EBD9C3] bg-[#2B1B12] py-7 text-[#FFF6EC]">
          <div className="flex w-max animate-marquee-left items-center gap-10 whitespace-nowrap px-6">
            {[...socios, ...socios].map((socio, indice) => (
              <span key={`${socio}-${indice}`} className="font-podium text-xl uppercase tracking-[0.14em] opacity-70">
                {socio}
              </span>
            ))}
          </div>
        </section>

        <section className="border-b border-[#EBD9C3] bg-white px-4 py-20 md:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.65 }}
              className="grid gap-3 sm:grid-cols-2 lg:col-span-7"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-[#EBD9C3] bg-[#FFF6EC]">
                <Image src="/papas.png" alt="Papas de Dulces" fill sizes="(min-width: 1024px) 32vw, 50vw" className="blend-multiply object-cover" />
              </div>
              <div className="relative mt-0 aspect-[4/5] overflow-hidden rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] sm:mt-12">
                <video className="h-full w-full object-cover" src="/dulces-loop.mp4" autoPlay muted loop playsInline />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.65, delay: 0.12 }}
              className="flex flex-col gap-6 lg:col-span-5"
            >
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#FF5A5F]/10 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FF5A5F]">
                <Sparkles size={14} /> Selección para anaquel
              </span>
              <h2 className="font-podium text-4xl uppercase leading-none tracking-normal md:text-6xl">
                Sabor de dulcería, presentación de marca grande
              </h2>
              <p className="text-base font-medium leading-7 text-[#7A6455]">
                Cada familia de producto está pensada para rotar: enchilado, crujiente, dulce y clásico. Todo llega listo para acomodarse, fotografiarse y venderse sin perder frescura.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ['24h', 'Reposición'],
                  ['40-65%', 'Margen'],
                  ['8+', 'Familias'],
                ].map(([dato, texto]) => (
                  <div key={texto} className="rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] p-4">
                    <strong className="block font-podium text-3xl leading-none">{dato}</strong>
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#7A6455]">{texto}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-b border-[#EBD9C3] bg-[#FFF6EC] px-4 py-20 md:px-8 lg:py-28">
          <div className="mx-auto flex max-w-7xl flex-col gap-12">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#FF5A5F]">Lineup destacado</span>
                <h2 className="mt-3 font-podium text-4xl uppercase leading-none tracking-normal md:text-6xl">Productos que jalan mirada</h2>
              </div>
              <BotonPrincipal href="/catalogo">Ver catálogo</BotonPrincipal>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {productos.map((producto, indice) => (
                <motion.div
                  key={producto.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.55, delay: indice * 0.06 }}
                >
                  <Link href={`/catalogo/${producto.id}`} className="group flex h-full flex-col gap-5 overflow-hidden rounded-lg border border-[#EBD9C3] bg-white p-4 shadow-[0_15px_36px_rgba(43,27,18,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(43,27,18,0.10)]">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border border-[#EBD9C3] bg-[#FFF6EC] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#7A6455]">
                        {producto.etiqueta}
                      </span>
                      <strong className="font-podium text-xl">{producto.precio}</strong>
                    </div>
                    <div className="relative grid aspect-square place-items-center overflow-hidden rounded-lg bg-[#FFF6EC]">
                      <div className={`absolute h-48 w-48 rounded-full bg-gradient-to-tr ${producto.fondo} blur-2xl transition-transform duration-500 group-hover:scale-125`} />
                      <motion.div whileHover={{ rotate: 3, scale: 1.08 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }} className="relative w-[86%]">
                        <Image src={producto.imagen} alt={producto.nombre} width={1024} height={1024} className="blend-multiply" />
                      </motion.div>
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t border-[#EBD9C3] pt-4">
                      <h3 className="max-w-[12rem] font-podium text-xl uppercase leading-none tracking-normal">{producto.nombre}</h3>
                      <span className="grid h-9 w-9 place-items-center rounded-full border border-[#EBD9C3] bg-[#FFF6EC] transition-colors group-hover:border-[#FF5A5F] group-hover:bg-[#FF5A5F] group-hover:text-white">
                        <ArrowRight size={14} className="-rotate-45 transition-transform group-hover:rotate-0" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-[#EBD9C3] bg-[#2B1B12] px-4 py-20 text-[#FFF6EC] md:px-8 lg:py-28">
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_25%_30%,#FF5A5F_0,transparent_30%),radial-gradient(circle_at_80%_60%,#00A699_0,transparent_26%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="flex flex-col gap-6">
              <span className="w-fit rounded-full border border-white/15 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/70">
                La promesa Dulces
              </span>
              <h2 className="font-podium text-4xl uppercase leading-none tracking-normal md:text-6xl">
                Menos compra pesada, más producto que rota
              </h2>
              <p className="max-w-xl text-base font-medium leading-7 text-white/68">
                Un surtido que cuida lo que más importa en tienda: frescura, margen visible y reposición sin fricción.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {promesa.map((item) => (
                <div key={item.texto} className="flex items-center gap-3 rounded-lg border border-white/12 bg-white/[0.06] p-4 backdrop-blur">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${item.tipo === 'si' ? 'bg-[#00A699] text-white' : 'bg-[#FF5A5F] text-white'}`}>
                    {item.tipo === 'si' ? <Check size={17} /> : <X size={17} />}
                  </span>
                  <span className="text-sm font-extrabold uppercase tracking-[0.1em]">{item.texto}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#EBD9C3] bg-white px-4 py-20 md:px-8 lg:py-28">
          <div className="mx-auto flex max-w-7xl flex-col gap-12">
            <header className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#FF5A5F]">Respaldo para vender</span>
              <h2 className="mt-3 font-podium text-4xl uppercase leading-none tracking-normal md:text-6xl">Todo se siente listo para anaquel</h2>
            </header>
            <div className="grid gap-4 md:grid-cols-3">
              {beneficios.map((beneficio, indice) => {
                const Icono = beneficio.icono;
                return (
                  <motion.article
                    key={beneficio.titulo}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.55, delay: indice * 0.07 }}
                    className="rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] p-6"
                  >
                    <div className="mb-5 grid h-12 w-12 place-items-center rounded-lg border border-[#EBD9C3] bg-white text-[#FF5A5F]">
                      <Icono size={24} />
                    </div>
                    <h3 className="font-podium text-2xl uppercase leading-none tracking-normal">{beneficio.titulo}</h3>
                    <p className="mt-4 text-sm font-medium leading-6 text-[#7A6455]">{beneficio.texto}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="overflow-hidden border-b border-[#EBD9C3] bg-[#FFF6EC] px-4 py-20 md:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="sticky top-24 flex flex-col gap-5">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#00A699]/10 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#007A70]">
                <PackageCheck size={14} /> Prueba social
              </span>
              <h2 className="font-podium text-4xl uppercase leading-none tracking-normal md:text-6xl">Lo que dicen las tiendas</h2>
              <p className="text-base font-medium leading-7 text-[#7A6455]">
                Tienditas, cafeterías y revendedores que buscan producto rico, fácil de explicar y con utilidad clara por pieza.
              </p>
            </div>
            <div className="grid gap-4">
              {reseñas.map((reseña, indice) => (
                <motion.article
                  key={reseña.titulo}
                  initial={{ opacity: 0, x: 36 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, delay: indice * 0.08 }}
                  className="rounded-lg border border-[#EBD9C3] bg-white p-6 shadow-[0_15px_36px_rgba(43,27,18,0.04)]"
                >
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <Estrellas />
                    <span className="rounded-full bg-[#00A699]/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#007A70]">
                      Verificado
                    </span>
                  </div>
                  <h3 className="font-podium text-2xl uppercase leading-none tracking-normal">{reseña.titulo}</h3>
                  <p className="mt-4 text-base font-medium leading-7 text-[#7A6455]">"{reseña.texto}"</p>
                  <p className="mt-5 text-sm font-extrabold uppercase tracking-[0.15em] text-[#2B1B12]">{reseña.nombre}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div className="tema-tienda" style={{ minHeight: 'auto' }}>
        <PieDePagina />
      </div>
    </div>
  );
}
