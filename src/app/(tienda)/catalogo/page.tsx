'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowDownAZ,
  ArrowLeft,
  ArrowRight,
  Barcode,
  Grid3X3,
  PackageCheck,
  RefreshCw,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import BotonAgregar from '@/componentes/carrito/BotonAgregar';
import { crearCliente } from '@/lib/supabase/client';

/** Fila real de la tabla `productos` en Supabase. */
type ProductoDB = {
  id: string;
  nombre: string;
  descripcion: string | null;
  categoria: string | null;
  unidad: string;
  precio_mayoreo: number;
  precio_sugerido_reventa: number | null;
  imagen_url: string | null;
};

/** Producto ya listo para pintar (con campos visuales derivados). */
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
};

type Rol = 'center' | 'left' | 'right' | 'back';
type Orden = 'margen' | 'precio' | 'nombre';

const NOMBRE_CATEGORIA: Record<string, string> = {
  frutos_secos: 'Frutos secos',
  gomitas: 'Gomitas',
  chocolates: 'Chocolates',
  semillas: 'Semillas',
  dulces: 'Dulces',
  fritos: 'Fritos',
};

// Imagen de respaldo cuando el producto todavía no tiene `imagen_url` (subida
// desde el panel de admin). Primero por nombre exacto, luego por categoría.
const IMAGEN_POR_NOMBRE: Record<string, string> = {
  'Cacahuate Japonés': '/cacahuate.png',
  'Gomitas Surtidas': '/gomitas.png',
  'Chocolate de Mesa': '/chocolate.png',
  'Semillas Enchiladas': '/semillas.png',
  'Palomitas Acarameladas': '/palomitas.png',
  'Papas Fritas Caseras': '/papas.png',
  'Papas Crujientes Fuego': '/papas.png',
  'Mazapán Tradicional': '/mazapan.png',
  'Gomitas Enchiladas': '/gomitas.png',
  'Paleta de Tamarindo': '/paleta.png',
};
const IMAGEN_POR_CATEGORIA: Record<string, string> = {
  frutos_secos: '/cacahuate.png',
  gomitas: '/gomitas.png',
  chocolates: '/chocolate.png',
  semillas: '/semillas.png',
  dulces: '/paleta.png',
  fritos: '/papas.png',
};

// Colores de marca que se reparten entre los productos (para el carrusel y los
// halos de cada tarjeta), de modo que el catálogo se vea colorido sin depender
// de datos de color en la base.
const PALETA = [
  { bg: '#F4845F', panel: '#F79B7F' },
  { bg: '#6BBF7A', panel: '#85CC92' },
  { bg: '#E882B4', panel: '#ED9DC4' },
  { bg: '#6EB5FF', panel: '#8DC4FF' },
  { bg: '#E8C07D', panel: '#EED6AD' },
  { bg: '#B99CE8', panel: '#CBB4F0' },
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

/** Convierte una fila de la base en un producto listo para pintar. */
function aProductoCatalogo(fila: ProductoDB, indice: number): ProductoCatalogo {
  const categoria = fila.categoria ?? 'dulces';
  const imagen =
    fila.imagen_url ||
    IMAGEN_POR_NOMBRE[fila.nombre] ||
    IMAGEN_POR_CATEGORIA[categoria] ||
    '/paleta.png';
  const reventa = fila.precio_sugerido_reventa ?? fila.precio_mayoreo;
  const margenPct = Math.round(((reventa - fila.precio_mayoreo) / fila.precio_mayoreo) * 100);
  const color = PALETA[indice % PALETA.length];

  return {
    id: fila.id,
    nombre: fila.nombre,
    descripcion: fila.descripcion ?? 'Producto de mayoreo listo para vender en tu negocio.',
    categoria,
    categoriaLabel: NOMBRE_CATEGORIA[categoria] ?? 'General',
    unidad: fila.unidad,
    precio_mayoreo: Number(fila.precio_mayoreo),
    precio_sugerido_reventa: Number(reventa),
    imagen,
    bg: color.bg,
    panel: color.panel,
    etiqueta: margenPct >= 45 ? 'Top margen' : margenPct >= 25 ? 'Buen margen' : 'Catálogo',
  };
}

function margen(producto: ProductoCatalogo) {
  return Math.round(((producto.precio_sugerido_reventa - producto.precio_mayoreo) / producto.precio_mayoreo) * 100);
}

function ganancia(producto: ProductoCatalogo) {
  return producto.precio_sugerido_reventa - producto.precio_mayoreo;
}

/** Tarjeta fantasma mientras carga el catálogo (se siente más rápido). */
function TarjetaEsqueleto() {
  return (
    <div className="rounded-lg border border-[#EBD9C3] bg-white p-4 shadow-sm">
      <div className="flex justify-between gap-3">
        <span className="h-6 w-24 rounded-full bg-[#EBD9C3]/60" />
        <span className="h-6 w-14 rounded-full bg-[#EBD9C3]/60" />
      </div>
      <div className="my-5 aspect-square rounded-lg bg-[#FFF6EC]" />
      <div className="h-4 w-20 rounded bg-[#EBD9C3]/60" />
      <div className="mt-3 h-6 w-3/4 rounded bg-[#EBD9C3]/60" />
      <div className="mt-3 h-10 w-full rounded bg-[#EBD9C3]/40" />
      <div className="mt-4 h-11 w-full rounded-full bg-[#EBD9C3]/60" />
    </div>
  );
}

export default function PaginaCatalogo() {
  const [productos, setProductos] = useState<ProductoCatalogo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [categoria, setCategoria] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState<Orden>('margen');

  // Cargar el catálogo real desde Supabase (RLS deja ver solo los activos).
  useEffect(() => {
    let cancelado = false;
    async function cargar() {
      setCargando(true);
      setErrorCarga(null);
      try {
        const supabase = crearCliente();
        const { data, error } = await supabase
          .from('productos')
          .select('id, nombre, descripcion, categoria, unidad, precio_mayoreo, precio_sugerido_reventa, imagen_url')
          .eq('activo', true)
          .order('creado_en', { ascending: true });
        if (error) throw error;
        if (!cancelado) {
          setProductos((data as ProductoDB[]).map(aProductoCatalogo));
        }
      } catch (e) {
        if (!cancelado) setErrorCarga(e instanceof Error ? e.message : 'No se pudo cargar el catálogo');
      } finally {
        if (!cancelado) setCargando(false);
      }
    }
    cargar();
    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Precargar las imágenes del carrusel cuando ya hay productos.
  useEffect(() => {
    productos.forEach((item) => {
      const img = new window.Image();
      img.src = item.imagen;
    });
  }, [productos]);

  const total = productos.length;

  const navigate = (direccion: 'next' | 'prev') => {
    if (isAnimating || total === 0) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (direccion === 'next' ? (prev + 1) % total : (prev + total - 1) % total));
    setTimeout(() => setIsAnimating(false), 650);
  };

  const obtenerRol = (indice: number): Rol => {
    if (indice === activeIndex) return 'center';
    if (indice === (activeIndex + total - 1) % total) return 'left';
    if (indice === (activeIndex + 1) % total) return 'right';
    return 'back';
  };

  const estiloPorRol = (rol: Rol): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      aspectRatio: '0.86 / 1',
      transition:
        'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1), background-color 650ms cubic-bezier(0.4,0,0.2,1)',
      willChange: 'transform, filter, opacity',
      backgroundColor: productos[activeIndex]?.bg ?? '#F4845F',
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
    const filtrados = productos.filter((producto) => {
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
      return margen(b) - margen(a);
    });
  }, [busqueda, categoria, orden, productos]);

  const activo = productos[activeIndex];
  const totalInversion = productos.reduce((suma, producto) => suma + producto.precio_mayoreo, 0);
  const totalReventa = productos.reduce((suma, producto) => suma + producto.precio_sugerido_reventa, 0);

  return (
    <div className="min-h-screen overflow-hidden bg-[#FFF6EC] text-[#2B1B12]">
      {/* ==================== HERO CARRUSEL ==================== */}
      {activo ? (
        <section
          className="relative w-full overflow-hidden"
          style={{
            backgroundColor: activo.bg,
            transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <div className="relative min-h-screen w-full overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ zIndex: 50, opacity: 0.38, backgroundImage: GRANO, backgroundSize: '200px 200px', backgroundRepeat: 'repeat' }}
            />

            <div
              className="pointer-events-none absolute inset-x-0 flex select-none items-center justify-center"
              style={{
                zIndex: 2,
                top: '16%',
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

            <div className="pointer-events-none absolute left-[8%] top-[18%] z-[4] hidden h-20 w-20 rounded-lg border border-white/35 bg-white/18 shadow-[0_20px_60px_rgba(43,27,18,0.18)] backdrop-blur md:block" style={{ animation: 'flotar-dulce 7s ease-in-out infinite' }} />
            <div className="pointer-events-none absolute right-[10%] top-[24%] z-[4] hidden h-14 w-14 rounded-full border border-white/35 bg-white/16 shadow-[0_18px_50px_rgba(43,27,18,0.14)] backdrop-blur md:block" style={{ animation: 'flotar-dulce 8s ease-in-out 0.8s infinite reverse' }} />

            <div className="absolute inset-0" style={{ zIndex: 3 }}>
              {productos.map((item, indice) => (
                <div key={item.id} style={estiloPorRol(obtenerRol(indice))}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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

            <div className="absolute bottom-5 left-4 aparecer sm:bottom-16 sm:left-10 lg:left-20" style={{ zIndex: 60, maxWidth: 390 }}>
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
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white text-white transition duration-150 hover:scale-[1.08] hover:bg-white/[0.12] active:scale-95 sm:h-16 sm:w-16"
                >
                  <ArrowLeft size={26} strokeWidth={2.25} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('next')}
                  aria-label="Producto siguiente"
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white text-white transition duration-150 hover:scale-[1.08] hover:bg-white/[0.12] active:scale-95 sm:h-16 sm:w-16"
                >
                  <ArrowRight size={26} strokeWidth={2.25} />
                </button>
              </div>
            </div>

            <a
              href="#catalogo-completo"
              className="group absolute bottom-6 right-4 flex items-center text-right text-2xl font-black uppercase leading-none text-white transition hover:translate-x-1 hover:opacity-100 sm:bottom-16 sm:right-10 sm:text-5xl"
              style={{ zIndex: 60, opacity: 0.96 }}
            >
              Ver catálogo
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 sm:h-8 sm:w-8" strokeWidth={2.25} />
            </a>
          </div>
        </section>
      ) : (
        // Hero compacto mientras carga o si no hay productos.
        <section className="relative grid min-h-[70vh] place-items-center overflow-hidden bg-[#F4845F] px-6 text-center">
          <div className="pointer-events-none absolute inset-0" style={{ opacity: 0.38, backgroundImage: GRANO, backgroundSize: '200px 200px' }} />
          <div className="relative z-10 flex flex-col items-center gap-5 text-white">
            {cargando ? (
              <>
                <RefreshCw className="h-10 w-10 animate-spin" />
                <p className="text-sm font-black uppercase tracking-[0.18em]">Abriendo el catálogo…</p>
              </>
            ) : (
              <>
                <ShoppingBag className="h-12 w-12" />
                <h1 className="max-w-md text-4xl font-black uppercase leading-[0.9] sm:text-6xl">Catálogo en preparación</h1>
                <p className="max-w-sm text-sm font-semibold text-white/85">
                  {errorCarga ? errorCarga : 'Todavía no hay productos activos. En cuanto se agreguen desde el panel, aparecerán aquí.'}
                </p>
              </>
            )}
          </div>
        </section>
      )}

      {/* ==================== MARQUEE ==================== */}
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

      {/* ==================== CATÁLOGO COMPLETO ==================== */}
      <section id="catalogo-completo" className="relative bg-[#FFF6EC] px-4 py-16 md:px-8 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(255,90,95,0.12),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(0,166,153,0.12),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="aparecer">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#FF5A5F]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#FF5A5F]">
                <Sparkles size={14} /> Catálogo B2B
              </span>
              <h2 className="mt-5 text-[clamp(3rem,8vw,7rem)] font-black uppercase leading-[0.86] tracking-normal">
                Todo el surtido listo para vender.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                [`${total}`, 'Productos'],
                [`$${totalInversion}`, 'Inversión mix'],
                [`$${totalReventa}`, 'Reventa sugerida'],
              ].map(([dato, texto], index) => (
                <div
                  key={texto}
                  className="aparecer rounded-lg border border-[#EBD9C3] bg-white/75 p-5 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(43,27,18,0.1)]"
                  style={{ animationDelay: `${0.1 + index * 0.07}s` }}
                >
                  <strong className="block text-4xl font-black leading-none">{dato}</strong>
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6B5546]">{texto}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sticky top-0 z-30 mt-10 rounded-lg border border-[#EBD9C3] bg-white/82 p-3 shadow-[0_18px_50px_rgba(43,27,18,0.08)] backdrop-blur-xl aparecer retraso-2">
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

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scroll-tactil">
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

          {/* Estado de carga: esqueletos */}
          {cargando && (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <TarjetaEsqueleto key={i} />
              ))}
            </div>
          )}

          {/* Grid de productos reales */}
          {!cargando && (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {productosFiltrados.map((producto, index) => (
                <article
                  key={producto.id}
                  className="group relative overflow-hidden rounded-lg border border-[#EBD9C3] bg-white p-4 shadow-[0_18px_45px_rgba(43,27,18,0.06)] transition duration-500 hover:-translate-y-2 hover:rotate-[0.25deg] hover:shadow-[0_28px_65px_rgba(43,27,18,0.12)]"
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

                  <Link href={`/catalogo/${producto.id}`} className="relative my-5 grid aspect-square place-items-center overflow-hidden rounded-lg bg-[#FFF6EC]" aria-label={`Ver ${producto.nombre}`}>
                    <div className="absolute h-44 w-44 rounded-full blur-2xl" style={{ backgroundColor: `${producto.panel}55` }} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      loading="lazy"
                      className="blend-multiply relative w-[88%] transition duration-500 group-hover:scale-105 group-hover:rotate-2"
                    />
                  </Link>

                  <div className="relative">
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#FF5A5F]">{producto.categoriaLabel}</p>
                    <Link href={`/catalogo/${producto.id}`}>
                      <h3 className="min-h-[3rem] text-2xl font-black uppercase leading-none tracking-normal transition-colors group-hover:text-[#FF5A5F]">{producto.nombre}</h3>
                    </Link>
                    <p className="mt-3 min-h-[3.75rem] text-sm font-semibold leading-5 text-[#6B5546] line-clamp-3">{producto.descripcion}</p>

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
                      <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#6B5546]">Reventa</span>
                      <span className="text-xs font-black text-[#2B1B12]">${producto.precio_sugerido_reventa}</span>
                    </div>

                    <div className="mt-4">
                      <BotonAgregar producto={producto} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!cargando && productos.length > 0 && productosFiltrados.length === 0 && (
            <div className="mt-10 rounded-lg border border-dashed border-[#EBD9C3] bg-white/75 p-10 text-center">
              <p className="text-2xl font-black uppercase">No encontramos ese dulce</p>
              <p className="mt-2 text-sm font-semibold text-[#6B5546]">Prueba con otra categoría o borra la búsqueda.</p>
            </div>
          )}

          {!cargando && productos.length === 0 && (
            <div className="mt-10 rounded-lg border border-dashed border-[#EBD9C3] bg-white/75 p-10 text-center">
              <p className="text-2xl font-black uppercase">Catálogo vacío</p>
              <p className="mt-2 text-sm font-semibold text-[#6B5546]">
                {errorCarga ? errorCarga : 'Agrega productos desde el panel de administrador para que aparezcan aquí.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ==================== KITS ==================== */}
      <section className="border-t border-[#EBD9C3] bg-white px-4 py-16 md:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end aparecer">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#FF5A5F]">Kits sugeridos</span>
              <h2 className="mt-3 text-[clamp(2.8rem,7vw,6rem)] font-black uppercase leading-[0.86]">Compra por objetivo</h2>
            </div>
            <Link href="/escaner" className="inline-flex items-center gap-2 rounded-full border-2 border-[#2B1B12] px-5 py-3 text-[11px] font-black uppercase tracking-[0.16em] transition hover:bg-[#2B1B12] hover:text-white">
              Escanear reorden <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {KITS.map((kit, index) => (
              <article
                key={kit.nombre}
                className="aparecer rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] p-6 shadow-[0_14px_34px_rgba(43,27,18,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#FF5A5F] hover:bg-white hover:shadow-[0_24px_56px_rgba(43,27,18,0.1)]"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
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
