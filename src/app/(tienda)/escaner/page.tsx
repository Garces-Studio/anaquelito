'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Barcode,
  Camera,
  Check,
  Clock3,
  PackageCheck,
  ScanLine,
  ShoppingCart,
  Sparkles,
} from 'lucide-react';

const flotantes = [
  { src: '/paleta.png', className: 'left-[5%] top-[16%] hidden w-20 md:block', rotate: -12, delay: 0 },
  { src: '/semillas.png', className: 'right-[6%] top-[18%] hidden w-24 md:block', rotate: 10, delay: 0.5 },
  { src: '/chocolate.png', className: 'bottom-[18%] left-[10%] hidden w-20 lg:block', rotate: 8, delay: 1 },
  { src: '/palomitas.png', className: 'bottom-[12%] right-[9%] hidden w-24 lg:block', rotate: -9, delay: 1.35 },
];

const pasos = [
  {
    icono: ScanLine,
    titulo: 'Escanea la bolsa vacía',
    texto: 'Apunta al UPC del empaque y el sistema identifica el producto exacto del catálogo.',
  },
  {
    icono: ShoppingCart,
    titulo: 'Confirma cantidad',
    texto: 'Repite tu último pedido o ajusta piezas antes de mandarlo directo al carrito.',
  },
  {
    icono: PackageCheck,
    titulo: 'Reordena en segundos',
    texto: 'Menos búsqueda manual, más tiempo atendiendo tu mostrador y vendiendo.',
  },
];

const resultados = [
  { nombre: 'Gomitas Enchiladas', codigo: 'UPC 750-014-839', imagen: '/gomitas.png', precio: '$12.00', estado: 'Encontrado' },
  { nombre: 'Papas Fuego', codigo: 'UPC 750-921-442', imagen: '/papas.png', precio: '$15.00', estado: 'Sugerido' },
];

const aparecer = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};

function BotonPrincipal({ href, children }: { href: string; children: React.ReactNode }) {
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
  rotate,
  delay,
}: {
  src: string;
  className: string;
  rotate: number;
  delay: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -20, 0], rotate: [rotate, rotate + 8, rotate] }}
      transition={{ duration: 6.5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
      className={`absolute rounded-lg border border-[#EBD9C3] bg-white/82 p-2 shadow-[0_18px_50px_rgba(43,27,18,0.12)] backdrop-blur ${className}`}
    >
      <Image src={src} alt="" width={180} height={180} className="blend-multiply" />
    </motion.div>
  );
}

export default function PaginaEscaner() {
  return (
    <main className="overflow-hidden bg-[#FFF6EC] text-[#2B1B12]">
      <section className="relative min-h-[calc(100vh-84px)] overflow-hidden border-b border-[#EBD9C3] px-4 pb-16 pt-28 md:px-8 md:pb-20 md:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(255,90,95,0.16),transparent_25%),radial-gradient(circle_at_86%_18%,rgba(0,166,153,0.14),transparent_28%),linear-gradient(180deg,#FFF6EC_0%,#FFEFDD_100%)]" />
        {flotantes.map((item) => (
          <ProductoFlotante key={item.src} {...item} />
        ))}

        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.1 }}
          className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center"
        >
          <div className="flex flex-col items-start">
            <motion.div variants={aparecer} className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#EBD9C3] bg-white/75 px-4 py-2 shadow-sm">
              <Camera size={15} className="text-[#FF5A5F]" />
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#6B5546]">Resurtido en 30 segundos</span>
            </motion.div>

            <motion.h1 variants={aparecer} className="max-w-4xl font-podium text-[clamp(3.4rem,8.8vw,8rem)] uppercase leading-[0.84] tracking-normal">
              Se acabó. Escanéalo. Repónlo.
            </motion.h1>

            <motion.p variants={aparecer} className="mt-6 max-w-xl text-base font-semibold leading-7 text-[#6B5546] md:text-lg">
              Apunta la cámara al código de barras de la bolsa vacía y el producto entra directo a tu carrito con tu precio de mayoreo.
            </motion.p>

            <motion.div variants={aparecer} className="mt-8 flex flex-wrap items-center gap-4">
              <BotonPrincipal href="/catalogo">Mientras tanto, ver catálogo</BotonPrincipal>
              <button type="button" className="inline-flex items-center gap-2 rounded-full border border-[#2B1B12] bg-white/55 px-5 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#2B1B12] shadow-sm transition hover:bg-white">
                <Barcode size={16} />
                Ingresar código
              </button>
            </motion.div>

            <motion.div variants={aparecer} className="mt-8 grid w-full max-w-xl gap-3 sm:grid-cols-3">
              {[
                ['UPC', 'Lectura'],
                ['30s', 'Reorden'],
                ['0', 'Búsquedas'],
              ].map(([dato, texto]) => (
                <div key={texto} className="rounded-lg border border-[#EBD9C3] bg-white/70 p-4 shadow-sm backdrop-blur">
                  <strong className="block font-podium text-3xl leading-none">{dato}</strong>
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6B5546]">{texto}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 38, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[620px]"
          >
            <div className="absolute inset-8 rounded-full bg-[#FFB400]/18 blur-3xl" />
            <div className="relative rounded-lg border border-[#EBD9C3] bg-white/86 p-4 shadow-[0_30px_70px_rgba(43,27,18,0.14)] backdrop-blur md:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF5A5F]">Vista previa</p>
                  <h2 className="font-podium text-3xl uppercase leading-none tracking-normal md:text-4xl">Cámara lista</h2>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#00A699]/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#007A70]">
                  <span className="h-2 w-2 rounded-full bg-[#00A699]" />
                  Próximamente
                </span>
              </div>

              <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-[#EBD9C3] bg-[#1C120D] sm:aspect-[5/4]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,90,95,0.22),transparent_32%),linear-gradient(135deg,rgba(255,246,236,0.08),rgba(0,166,153,0.12))]" />
                <motion.div
                  animate={{ y: ['12%', '82%', '12%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-[9%] z-20 h-[2px] w-[82%] bg-[#FF5A5F] shadow-[0_0_24px_#FF5A5F]"
                />
                <div className="absolute inset-6 rounded-lg border border-dashed border-white/35" />
                <div className="absolute left-1/2 top-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    animate={{ scale: [1, 1.035, 1], rotate: [-1, 1, -1] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative"
                  >
                    <Image src="/gomitas.png" alt="Producto dentro del escáner" width={1024} height={1024} className="blend-multiply drop-shadow-[0_24px_35px_rgba(0,0,0,0.34)]" />
                  </motion.div>
                </div>
                <div className="absolute inset-x-4 bottom-4 rounded-lg border border-white/10 bg-white/10 p-3 text-white backdrop-blur-md">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/70">Buscando UPC</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#FFB400]">
                      <Clock3 size={13} /> 00:30
                    </span>
                  </div>
                  <div className="mt-3 flex h-12 items-end gap-1">
                    {Array.from({ length: 34 }).map((_, index) => (
                      <span
                        key={index}
                        className="block w-full rounded-full bg-white/85"
                        style={{ height: `${index % 5 === 0 ? 44 : index % 3 === 0 ? 30 : 18}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -12, 0], rotate: [-3, 1, -3] }}
              transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-5 left-2 hidden w-44 rounded-lg border border-[#EBD9C3] bg-white p-3 shadow-[0_22px_45px_rgba(43,27,18,0.14)] sm:block"
            >
              <div className="flex items-center gap-3">
                <Image src="/papas.png" alt="" width={58} height={58} className="blend-multiply rounded" />
                <div>
                  <p className="font-podium text-lg uppercase leading-none">Producto</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#00A699]">Detectado</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section className="border-b border-[#EBD9C3] bg-[#2B1B12] py-7 text-[#FFF6EC]">
        <div className="flex w-max animate-marquee-left items-center gap-10 whitespace-nowrap px-6">
          {['ESCANEA', 'CONFIRMA', 'REORDENA', 'SIN BUSCAR', 'SIN WHATSAPP MANUAL', 'MARGEN CLARO', 'ESCANEA', 'CONFIRMA', 'REORDENA'].map((item, index) => (
            <span key={`${item}-${index}`} className="font-podium text-2xl uppercase tracking-[0.14em] text-white/65">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="border-b border-[#EBD9C3] bg-white px-4 py-20 md:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FF5A5F]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#FF5A5F]">
              <Sparkles size={14} /> Flujo de reorden
            </span>
            <h2 className="mt-5 font-podium text-[clamp(3rem,8vw,7rem)] uppercase leading-[0.86] tracking-normal">
              Del empaque vacío al carrito lleno.
            </h2>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {pasos.map((paso, index) => {
              const Icono = paso.icono;
              return (
                <motion.article
                  key={paso.titulo}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-70px' }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className="rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] p-6 shadow-[0_14px_34px_rgba(43,27,18,0.05)]"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-lg border border-[#EBD9C3] bg-white text-[#FF5A5F]">
                      <Icono size={25} />
                    </span>
                    <span className="font-podium text-5xl leading-none text-[#2B1B12]/10">0{index + 1}</span>
                  </div>
                  <h3 className="font-podium text-3xl uppercase leading-none tracking-normal">{paso.titulo}</h3>
                  <p className="mt-4 text-sm font-medium leading-6 text-[#6B5546]">{paso.texto}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-[#EBD9C3] bg-[#FFF6EC] px-4 py-20 md:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#FF5A5F]">Resultado esperado</span>
            <h2 className="mt-4 font-podium text-[clamp(3rem,7vw,6rem)] uppercase leading-[0.86] tracking-normal">
              Tu carrito se arma sin buscar producto por producto
            </h2>
            <p className="mt-6 max-w-xl text-base font-semibold leading-7 text-[#6B5546]">
              Cuando activemos la lectura real, el escáner consultará los códigos del catálogo y agregará el producto correcto al carrito. Por ahora esta pantalla muestra el flujo final de forma clara.
            </p>
          </div>

          <div className="grid gap-4">
            {resultados.map((producto, index) => (
              <motion.div
                key={producto.nombre}
                initial={{ opacity: 0, x: 36 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="rounded-lg border border-[#EBD9C3] bg-white p-4 shadow-[0_18px_45px_rgba(43,27,18,0.06)]"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#FFF6EC]">
                    <Image src={producto.imagen} alt={producto.nombre} fill sizes="96px" className="blend-multiply object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#00A699]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#007A70]">
                        {producto.estado}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#6B5546]">{producto.codigo}</span>
                    </div>
                    <h3 className="font-podium text-3xl uppercase leading-none tracking-normal">{producto.nombre}</h3>
                  </div>
                  <div className="hidden text-right sm:block">
                    <strong className="font-podium text-3xl leading-none">{producto.precio}</strong>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#6B5546]">Mayoreo</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="rounded-lg border border-dashed border-[#FF5A5F]/45 bg-white/60 p-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#00A699] text-white">
                  <Check size={16} />
                </span>
                <p className="text-sm font-semibold leading-6 text-[#6B5546]">
                  La lectura real de cámara se conectará en la siguiente etapa. Esta vista deja listo el flujo visual para escanear, confirmar y reordenar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
