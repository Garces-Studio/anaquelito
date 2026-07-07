'use client';

import React, { useEffect, useMemo, useState } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import {
  ArrowDownAZ,
  ArrowLeft,
  ArrowRight,
  Barcode,
  Check,
  Grid3X3,
  PackageCheck,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { usarCarrito } from '@/componentes/carrito/ContextoCarrito';

type ProductoCatalogo = {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  categoriaLabel: string;
  unidad: string;
  precio_mayoreo: number;
  precio_sugerido_reventa: number;
  imagen: string;
  bg: string;
  panel: string;
  etiqueta: string;
  rotacion: string;
};

type Rol = 'center' | 'left' | 'right' | 'back';
type Orden = 'margen' | 'precio' | 'nombre' | 'rotacion';

const PRODUCTOS: ProductoCatalogo[] = [
  {
    id: 'papas-fuego',
    nombre: 'Papas Fuego',
    descripcion: 'Papas crujientes con sazón enchilado para venta por impulso.',
    categoria: 'fritos',
    categoriaLabel: 'Fritos',
    unidad: 'caja',
    precio_mayoreo: 115,
    precio_sugerido_reventa: 160,
    imagen: '/papas.png',
    bg: '#F4845F',
    panel: '#F79B7F',
    etiqueta: 'Alta rotación',
    rotacion: '24-48h',
  },
  {
    id: 'gomitas-enchiladas',
    nombre: 'Gomitas Enchiladas',
    descripcion: 'Gomitas con chile, dulces y ácidas; perfectas para mostrador.',
    categoria: 'gomitas',
    categoriaLabel: 'Gomitas',
    unidad: 'kg',
    precio_mayoreo: 92,
    precio_sugerido_reventa: 130,
    imagen: '/gomitas.png',
    bg: '#6BBF7A',
    panel: '#85CC92',
    etiqueta: 'Best seller',
    rotacion: 'Diaria',
  },
  {
    id: 'paleta-mango',
    nombre: 'Paleta Mango',
    descripcion: 'Paleta vistosa para cajas mixtas, niños y punto de caja.',
    categoria: 'dulces',
    categoriaLabel: 'Dulces',
    unidad: 'paquete',
    precio_mayoreo: 68,
    precio_sugerido_reventa: 98,
    imagen: '/paleta.png',
    bg: '#E882B4',
    panel: '#ED9DC4',
    etiqueta: 'Impulso',
    rotacion: 'Fin de semana',
  },
  {
    id: 'mazapan-clasico',
    nombre: 'Mazapán Clásico',
    descripcion: 'Clásico mexicano para reventa rápida en tienditas y cafés.',
    categoria: 'dulces',
    categoriaLabel: 'Dulces',
    unidad: 'caja',
    precio_mayoreo: 84,
    precio_sugerido_reventa: 120,
    imagen: '/mazapan.png',
    bg: '#E8C07D',
    panel: '#EED6AD',
    etiqueta: 'Clásico',
    rotacion: 'Semanal',
  },
  {
    id: 'cacahuate-japones',
    nombre: 'Cacahuate Japonés',
    descripcion: 'Botana salada de alta recompra para barra, tienda y oficina.',
    categoria: 'frutos_secos',
    categoriaLabel: 'Frutos secos',
    unidad: 'kg',
    precio_mayoreo: 75,
    precio_sugerido_reventa: 105,
    imagen: '/cacahuate.png',
    bg: '#C57B45',
    panel: '#D79968',
    etiqueta: 'Botana top',
    rotacion: 'Diaria',
  },
  {
    id: 'semillas-enchiladas',
    nombre: 'Semillas Enchiladas',
    descripcion: 'Mix enchilado con buen margen para clientes botaneros.',
    categoria: 'semillas',
    categoriaLabel: 'Semillas',
    unidad: 'kg',
    precio_mayoreo: 80,
    precio_sugerido_reventa: 112,
    imagen: '/semillas.png',
    bg: '#00A699',
    panel: '#36BDB2',
    etiqueta: 'Ligero',
    rotacion: 'Semanal',
  },
  {
    id: 'palomitas-caramelo',
    nombre: 'Palomitas Caramelo',
    descripcion: 'Dulce, voluminoso y visible; ideal para anaqueles de antojo.',
    categoria: 'dulces',
    categoriaLabel: 'Dulces',
    unidad: 'caja',
    precio_mayoreo: 108,
    precio_sugerido_reventa: 150,
    imagen: '/palomitas.png',
    bg: '#6EB5FF',
    panel: '#8DC4FF',
    etiqueta: 'Nuevo lote',
    rotacion: '48h',
  },
  {
    id: 'chocolate-mesa',
    nombre: 'Chocolate de Mesa',
    descripcion: 'Chocolate en tableta para reventa, cafeterías y cocina dulce.',
    categoria: 'chocolates',
    categoriaLabel: 'Chocolates',
    unidad: 'caja',
    precio_mayoreo: 150,
    precio_sugerido_reventa: 210,
    imagen: '/chocolate.png',
    bg: '#7621B0',
    panel: '#9651C5',
    etiqueta: 'Premium',
    rotacion: 'Temporada',
  },
];

const CATEGORIAS = [
  { id: 'todos', label: 'Todos', icono: Grid3X3 },
  { id: 'gomitas', label: 'Gomitas', icono: Sparkles },
  { id: 'fritos', label: 'Fritos', icono: PackageCheck },
  { id: 'dulces', label: 'Dulces', icono: ShoppingBag },
  { id: 'frutos_secos', label: 'Frutos secos', icono: TrendingUp },
  { id: 'semillas', label: 'Semillas', icono: Barcode },
  { id: 'chocolates', label: 'Chocolates', icono: SlidersHorizontal },
];

const KITS = [
  {
    nombre: 'Kit Tiendita Rápida',
    texto: 'Gomitas, papas, paletas y mazapán para llenar mostrador con productos de alta rotación.',
    inversion: '$359',
    ganancia: '$509',
  },
  {
    nombre: 'Kit Botana Salada',
    texto: 'Cacahuate, semillas, papas y palomitas para clientes que compran por antojo.',
    inversion: '$378',
    ganancia: '$527',
  },
  {
    nombre: 'Kit Café Dulcero',
    texto: 'Chocolate, mazapán, palomitas y paletas para ticket adicional junto a bebidas.',
    inversion: '$410',
    ganancia: '$578',
  },
];

const GRANO =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E\")";

function margen(producto: ProductoCatalogo) {
  return Math.round(((producto.precio_sugerido_reventa - producto.precio_mayoreo) / producto.precio_mayoreo) * 100);
}

function ganancia(producto: ProductoCatalogo) {
  return producto.precio_sugerido_reventa - producto.precio_mayoreo;
}

function BotonAgregarCatalogo({ producto }: { producto: ProductoCatalogo }) {
  const { agregar } = usarCarrito();
  const [agregado, setAgregado] = useState(false);

  const manejarClick = () => {
    agregar({
      id: producto.id,
      nombre: producto.nombre,
      unidad: producto.unidad,
      precio_mayoreo: producto.precio_mayoreo,
    });
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={manejarClick}
      className={`group inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-white transition duration-200 ${
        agregado ? 'bg-[#00A699]' : 'bg-[#2B1B12] hover:bg-[#FF5A5F]'
      }`}
    >
      {agregado ? <Check size={16} /> : <ShoppingBag size={16} />}
      {agregado ? 'Agregado' : 'Agregar'}
    </button>
  );
}

export default function PaginaCatalogo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [categoria, setCategoria] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState<Orden>('margen');

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    PRODUCTOS.forEach((item) => {
      const img = new window.Image();
      img.src = item.imagen;
    });
  }, []);

  const navigate = (direccion: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (direccion === 'next' ? (prev + 1) % PRODUCTOS.length : (prev + PRODUCTOS.length - 1) % PRODUCTOS.length));
    setTimeout(() => setIsAnimating(false), 650);
  };

  const obtenerRol = (indice: number): Rol => {
    if (indice === activeIndex) return 'center';
    if (indice === (activeIndex + PRODUCTOS.length - 1) % PRODUCTOS.length) return 'left';
    if (indice === (activeIndex + 1) % PRODUCTOS.length) return 'right';
    return 'back';
  };

  const estiloPorRol = (rol: Rol): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      aspectRatio: '0.86 / 1',
      transition:
        'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1), background-color 650ms cubic-bezier(0.4,0,0.2,1)',
      willChange: 'transform, filter, opacity',
      backgroundColor: PRODUCTOS[activeIndex].bg,
    };

    switch (rol) {
      case 'center':
        return {
          ...base,
          transform: `translateX(-50%) scale(${isMobile ? 1.2 : 1.55})`,
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: 20,
          left: '50%',
          height: isMobile ? '58%' : '82%',
          bottom: isMobile ? '23%' : '2%',
        };
      case 'left':
        return {
          ...base,
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.75,
          zIndex: 10,
          left: isMobile ? '17%' : '28%',
          height: isMobile ? '16%' : '26%',
          bottom: isMobile ? '33%' : '13%',
        };
      case 'right':
        return {
          ...base,
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.75,
          zIndex: 10,
          left: isMobile ? '83%' : '72%',
          height: isMobile ? '16%' : '26%',
          bottom: isMobile ? '33%' : '13%',
        };
      case 'back':
      default:
        return {
          ...base,
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(5px)',
          opacity: 0,
          zIndex: 5,
          left: '50%',
          height: isMobile ? '12%' : '20%',
          bottom: isMobile ? '33%' : '13%',
        };
    }
  };

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    const filtrados = PRODUCTOS.filter((producto) => {
      const coincideCategoria = categoria === 'todos' || producto.categoria === categoria;
      const coincideBusqueda =
        !texto ||
        producto.nombre.toLowerCase().includes(texto) ||
        producto.descripcion.toLowerCase().includes(texto) ||
        producto.categoriaLabel.toLowerCase().includes(texto);
      return coincideCategoria && coincideBusqueda;
    });

    return [...filtrados].sort((a, b) => {
      if (orden === 'precio') return a.precio_mayoreo - b.precio_mayoreo;
      if (orden === 'nombre') return a.nombre.localeCompare(b.nombre, 'es');
      if (orden === 'rotacion') return a.rotacion.localeCompare(b.rotacion, 'es');
      return margen(b) - margen(a);
    });
  }, [busqueda, categoria, orden]);

  const activo = PRODUCTOS[activeIndex];
  const totalInversion = PRODUCTOS.reduce((suma, producto) => suma + producto.precio_mayoreo, 0);
  const totalReventa = PRODUCTOS.reduce((suma, producto) => suma + producto.precio_sugerido_reventa, 0);

  return (
    <div className="min-h-screen overflow-hidden bg-[#FFF6EC] text-[#2B1B12]">
      <section
        className="relative w-full overflow-hidden"
        style={{
          backgroundColor: activo.bg,
          transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)',
          fontFamily: 'var(--font-plus-jakarta), var(--font-inter), sans-serif',
        }}
      >
        <div className="relative min-h-screen w-full overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              zIndex: 50,
              opacity: 0.38,
              backgroundImage: GRANO,
              backgroundSize: '200px 200px',
              backgroundRepeat: 'repeat',
            }}
          />

          <div
            className="pointer-events-none absolute inset-x-0 flex select-none items-center justify-center"
            style={{
              zIndex: 2,
              top: '16%',
              fontFamily: 'var(--font-plus-jakarta), sans-serif',
              fontSize: 'clamp(84px, 24vw, 330px)',
              fontWeight: 900,
              color: '#FFFFFF',
              opacity: 0.18,
              lineHeight: 1,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            DULCES
          </div>



          <div className="absolute inset-0" style={{ zIndex: 3 }}>
            {PRODUCTOS.map((item, indice) => (
              <div key={item.id} style={estiloPorRol(obtenerRol(indice))}>
                <img
                  src={item.imagen}
                  alt=""
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                    mixBlendMode: 'multiply',
                    filter: 'contrast(1.06) saturate(1.12)',
                  }}
                />
              </div>
            ))}
          </div>

          <div className="absolute bottom-5 left-4 sm:bottom-16 sm:left-10 lg:left-20" style={{ zIndex: 60, maxWidth: 390 }}>
            <p className="mb-2 text-base font-black uppercase tracking-[0.14em] text-white sm:text-[22px]">
              {activo.categoriaLabel} / {activo.etiqueta}
            </p>
            <h1 className="max-w-[18rem] text-4xl font-black uppercase leading-[0.88] text-white sm:max-w-md sm:text-6xl">
              {activo.nombre}
            </h1>
            <p className="mt-4 hidden text-sm font-semibold leading-6 text-white/86 sm:block">
              {activo.descripcion} Compra a ${activo.precio_mayoreo} y revende sugerido a ${activo.precio_sugerido_reventa}.
            </p>

            <div className="mt-5 flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => navigate('prev')}
                aria-label="Producto anterior"
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white text-white transition duration-150 hover:scale-[1.08] hover:bg-white/[0.12] sm:h-16 sm:w-16"
              >
                <ArrowLeft size={26} strokeWidth={2.25} />
              </button>
              <button
                type="button"
                onClick={() => navigate('next')}
                aria-label="Producto siguiente"
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white text-white transition duration-150 hover:scale-[1.08] hover:bg-white/[0.12] sm:h-16 sm:w-16"
              >
                <ArrowRight size={26} strokeWidth={2.25} />
              </button>
            </div>
          </div>

          <a
            href="#catalogo-completo"
            className="group absolute bottom-6 right-4 flex items-center text-right text-2xl font-black uppercase leading-none text-white transition hover:opacity-100 sm:bottom-16 sm:right-10 sm:text-5xl"
            style={{ zIndex: 60, opacity: 0.96 }}
          >
            Ver catálogo
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 sm:h-8 sm:w-8" strokeWidth={2.25} />
          </a>
        </div>
      </section>

      <section className="border-y border-[#EBD9C3] bg-[#2B1B12] py-7 text-[#FFF6EC]">
        <div className="flex w-max animate-marquee-left items-center gap-10 whitespace-nowrap px-6">
          {['MARGEN CLARO', 'ALTA ROTACIÓN', 'REORDEN POR ESCÁNER', 'PRECIO MAYOREO', 'KITS PARA TIENDA', 'DULCES CON GANANCIA', 'MARGEN CLARO', 'ALTA ROTACIÓN'].map(
            (item, index) => (
              <span key={`${item}-${index}`} className="text-2xl font-black uppercase tracking-[0.14em] text-white/65">
                {item}
              </span>
            ),
          )}
        </div>
      </section>

      <section id="catalogo-completo" className="relative bg-[#FFF6EC] px-4 py-16 md:px-8 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(255,90,95,0.12),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(0,166,153,0.12),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#FF5A5F]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#FF5A5F]">
                <Sparkles size={14} /> Catálogo B2B
              </span>
              <h2 className="mt-5 text-[clamp(3rem,8vw,7rem)] font-black uppercase leading-[0.86] tracking-normal">
                Todo el surtido listo para vender.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                [`${PRODUCTOS.length}`, 'Productos'],
                [`$${totalInversion}`, 'Inversión mix'],
                [`$${totalReventa}`, 'Reventa sugerida'],
              ].map(([dato, texto]) => (
                <div key={texto} className="rounded-lg border border-[#EBD9C3] bg-white/75 p-5 shadow-sm backdrop-blur">
                  <strong className="block text-4xl font-black leading-none">{dato}</strong>
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6B5546]">{texto}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sticky top-0 z-30 mt-10 rounded-lg border border-[#EBD9C3] bg-white/82 p-3 shadow-[0_18px_50px_rgba(43,27,18,0.08)] backdrop-blur-xl">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
              <label className="flex min-h-12 items-center gap-3 rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] px-4">
                <Search size={18} className="text-[#FF5A5F]" />
                <input
                  value={busqueda}
                  onChange={(evento) => setBusqueda(evento.target.value)}
                  placeholder="Buscar gomitas, papas, chocolate..."
                  className="w-full bg-transparent text-sm font-semibold text-[#2B1B12] outline-none placeholder:text-[#6B5546]/60"
                />
              </label>
              <label className="flex min-h-12 items-center gap-3 rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] px-4">
                <ArrowDownAZ size={18} className="text-[#00A699]" />
                <select
                  value={orden}
                  onChange={(evento) => setOrden(evento.target.value as Orden)}
                  className="bg-transparent text-sm font-black uppercase tracking-[0.08em] text-[#2B1B12] outline-none"
                >
                  <option value="margen">Mayor margen</option>
                  <option value="precio">Menor precio</option>
                  <option value="nombre">Nombre A-Z</option>
                  <option value="rotacion">Rotación</option>
                </select>
              </label>
              <Link
                href="/escaner"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#2B1B12] px-5 text-[11px] font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#FF5A5F]"
                style={{ color: '#FFFFFF' }}
              >
                <Barcode size={16} /> Reordenar
              </Link>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {CATEGORIAS.map((item) => {
                const Icono = item.icono;
                const activoCategoria = categoria === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategoria(item.id)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] transition ${
                      activoCategoria
                        ? 'border-[#2B1B12] bg-[#2B1B12] text-white'
                        : 'border-[#EBD9C3] bg-white text-[#6B5546] hover:border-[#FF5A5F] hover:text-[#FF5A5F]'
                    }`}
                  >
                    <Icono size={14} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {productosFiltrados.map((producto, index) => (
              <article
                key={producto.id}
                className="group relative overflow-hidden rounded-lg border border-[#EBD9C3] bg-white p-4 shadow-[0_18px_45px_rgba(43,27,18,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_65px_rgba(43,27,18,0.12)]"
                style={{ animation: `fade-up 0.65s ease-out ${Math.min(index * 0.04, 0.24)}s both` }}
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full opacity-25 blur-2xl transition-transform duration-500 group-hover:scale-125" style={{ backgroundColor: producto.bg }} />
                <div className="relative flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#FFF6EC] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#6B5546]">
                    {producto.etiqueta}
                  </span>
                  <span className="rounded-full bg-[#00A699]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#007A70]">
                    +{margen(producto)}%
                  </span>
                </div>

                <div className="relative my-5 grid aspect-square place-items-center overflow-hidden rounded-lg bg-[#FFF6EC]">
                  <div className="absolute h-44 w-44 rounded-full blur-2xl" style={{ backgroundColor: `${producto.panel}55` }} />
                  <NextImage
                    src={producto.imagen}
                    alt={producto.nombre}
                    width={700}
                    height={700}
                    className="blend-multiply relative w-[88%] transition duration-500 group-hover:scale-105 group-hover:rotate-2"
                  />
                </div>

                <div className="relative">
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#FF5A5F]">{producto.categoriaLabel}</p>
                  <h3 className="min-h-[3rem] text-2xl font-black uppercase leading-none tracking-normal">{producto.nombre}</h3>
                  <p className="mt-3 min-h-[3.75rem] text-sm font-semibold leading-5 text-[#6B5546]">{producto.descripcion}</p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#6B5546]">Mayoreo</p>
                      <strong className="text-2xl font-black leading-none">${producto.precio_mayoreo}</strong>
                      <span className="block text-[10px] font-bold text-[#6B5546]">/{producto.unidad}</span>
                    </div>
                    <div className="rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#6B5546]">Ganancia</p>
                      <strong className="text-2xl font-black leading-none">${ganancia(producto)}</strong>
                      <span className="block text-[10px] font-bold text-[#6B5546]">sugerida</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-lg border border-dashed border-[#EBD9C3] bg-white px-3 py-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#6B5546]">Rotación</span>
                    <span className="text-xs font-black text-[#2B1B12]">{producto.rotacion}</span>
                  </div>

                  <div className="mt-4">
                    <BotonAgregarCatalogo producto={producto} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {productosFiltrados.length === 0 && (
            <div className="mt-10 rounded-lg border border-dashed border-[#EBD9C3] bg-white/75 p-10 text-center">
              <p className="text-2xl font-black uppercase">No encontramos ese dulce</p>
              <p className="mt-2 text-sm font-semibold text-[#6B5546]">Prueba con otra categoría o borra la búsqueda.</p>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-[#EBD9C3] bg-white px-4 py-16 md:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#FF5A5F]">Kits sugeridos</span>
              <h2 className="mt-3 text-[clamp(2.8rem,7vw,6rem)] font-black uppercase leading-[0.86]">Compra por objetivo</h2>
            </div>
            <Link href="/escaner" className="inline-flex items-center gap-2 rounded-full border-2 border-[#2B1B12] px-5 py-3 text-[11px] font-black uppercase tracking-[0.16em] transition hover:bg-[#2B1B12] hover:text-white">
              Escanear reorden <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {KITS.map((kit) => (
              <article key={kit.nombre} className="rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] p-6 shadow-[0_14px_34px_rgba(43,27,18,0.05)]">
                <h3 className="text-3xl font-black uppercase leading-none">{kit.nombre}</h3>
                <p className="mt-4 text-sm font-semibold leading-6 text-[#6B5546]">{kit.texto}</p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#6B5546]">Inversión</p>
                    <strong className="text-3xl font-black">{kit.inversion}</strong>
                  </div>
                  <div className="rounded-lg bg-white p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#6B5546]">Reventa</p>
                    <strong className="text-3xl font-black text-[#00A699]">{kit.ganancia}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
