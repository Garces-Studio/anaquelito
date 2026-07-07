'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, RefreshCw, Sparkles, ArrowRight, ArrowDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { crearCliente } from '@/lib/supabase/client';
import BotonAgregar from '@/componentes/carrito/BotonAgregar';
import {
  Magnet,
  AnimatedText,
  FadeIn,
  ContactButton,
  LiveProjectButton,
} from '@/componentes/interactivos';

const EMOJI_CATEGORIA: Record<string, string> = {
  frutos_secos: '🥜',
  gomitas: '🍬',
  chocolates: '🍫',
  semillas: '🌻',
  dulces: '🍭',
  fritos: '🥔',
};

const NOMBRE_CATEGORIA: Record<string, string> = {
  frutos_secos: 'Frutos secos',
  gomitas: 'Gomitas',
  chocolates: 'Chocolates',
  semillas: 'Semillas',
  dulces: 'Dulces',
  fritos: 'Fritos',
};

const IMAGENES_PRODUCTOS: Record<string, string> = {
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

// Candy tiles for the marquee rows
const MARQUEE_CANDIES = [
  { nombre: 'PAPAS FUEGO', src: '/papas.png', bg: '#F4845F' },
  { nombre: 'MAZAPÁN', src: '/mazapan.png', bg: '#E8C07D' },
  { nombre: 'GOMITAS ENCHILADAS', src: '/gomitas.png', bg: '#6BBF7A' },
  { nombre: 'PALETA TAMARINDO', src: '/paleta.png', bg: '#E882B4' },
  { nombre: 'CACAHUATE JAPONÉS', src: '/cacahuate.png', bg: '#E8C07D' },
  { nombre: 'CHOCOLATE DE MESA', src: '/chocolate.png', bg: '#F4845F' },
  { nombre: 'SEMILLAS', src: '/semillas.png', bg: '#6BBF7A' },
  { nombre: 'PALOMITAS', src: '/palomitas.png', bg: '#E882B4' },
  { nombre: 'PAPAS CASERAS', src: '/papas.png', bg: '#F4845F' },
  { nombre: 'GOMITAS SURTIDAS', src: '/gomitas.png', bg: '#6BBF7A' },
];

export default function PaginaCatalogo() {
  const router = useRouter();
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('');
  const [busqueda, setBusqueda] = useState<string>('');
  const [scrollOffset, setScrollOffset] = useState(0);

  const supabase = crearCliente();
  const marqueeSectionRef = useRef<HTMLDivElement>(null);
  const projectsContainerRef = useRef<HTMLDivElement>(null);

  // Setup projects scroll container progress
  const { scrollYProgress: projectsScrollProgress } = useScroll({
    target: projectsContainerRef,
    offset: ['start start', 'end end'],
  });

  // Load products dynamically
  useEffect(() => {
    async function cargarProductos() {
      setLoading(true);
      try {
        let query = supabase
          .from('productos')
          .select('id, nombre, categoria, unidad, precio_mayoreo, precio_sugerido_reventa')
          .eq('activo', true)
          .order('creado_en', { ascending: true });

        if (categoriaFiltro) {
          query = query.eq('categoria', categoriaFiltro);
        }
        if (busqueda) {
          query = query.ilike('nombre', `%${busqueda}%`);
        }

        const { data, error: err } = await query;
        if (err) throw err;
        setProductos(data || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    cargarProductos();
  }, [categoriaFiltro, busqueda]);

  // Find actual product ID by name to navigate on Click
  const obtenerIdPorNombre = (nombre: string) => {
    const prod = productos.find((p) => p.nombre.toLowerCase().includes(nombre.toLowerCase()));
    return prod ? prod.id : '';
  };

  const irADetallePorNombre = (nombre: string) => {
    const id = obtenerIdPorNombre(nombre);
    if (id) {
      router.push(`/catalogo/${id}`);
    } else {
      scrollToSection('pricing');
    }
  };

  // Handle scroll calculation for marquee
  useEffect(() => {
    const handleScroll = () => {
      if (!marqueeSectionRef.current) return;
      const rect = marqueeSectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setScrollOffset(offset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Split images into two rows, tripled for seamless loop
  const fila1 = [...MARQUEE_CANDIES, ...MARQUEE_CANDIES, ...MARQUEE_CANDIES];
  const fila2 = [...MARQUEE_CANDIES.reverse(), ...MARQUEE_CANDIES, ...MARQUEE_CANDIES];

  // Stacking candy highlight cards
  const projects = [
    {
      num: '01',
      category: 'Estrella de Ventas',
      name: 'Papas Crujientes Fuego',
      col1_img1: '/papas.png',
      col1_img2: '/papas.png',
      col2_img: '/papas.png',
      desc: 'Papas fritas artesanales con el picor perfecto.',
      borderColor: 'border-[#F4845F]',
      badgeColor: 'bg-[#F4845F]/10 text-[#F4845F]',
    },
    {
      num: '02',
      category: 'Tradición Indispensable',
      name: 'Mazapán Tradicional',
      col1_img1: '/mazapan.png',
      col1_img2: '/mazapan.png',
      col2_img: '/mazapan.png',
      desc: 'El dulce clásico de cacahuate suave y delicioso.',
      borderColor: 'border-[#E8C07D]',
      badgeColor: 'bg-[#E8C07D]/10 text-[#B3833B]',
    },
    {
      num: '03',
      category: 'Favorito del Cliente',
      name: 'Gomitas Enchiladas',
      col1_img1: '/gomitas.png',
      col1_img2: '/gomitas.png',
      col2_img: '/gomitas.png',
      desc: 'Gomitas cubiertas de auténtico chile en polvo.',
      borderColor: 'border-[#6BBF7A]',
      badgeColor: 'bg-[#6BBF7A]/10 text-[#3B834B]',
    },
  ];

  return (
    <div className="bg-[#FFF6EC] text-[#2B1B12] font-kanit w-full overflow-x-clip min-h-screen relative selection:bg-[#FF5A5F]/20 selection:text-[#2B1B12]">
      {/* Capa de ruido de fondo premium */}
      <div className="grain-overlay opacity-[0.1]" />

      {/* Dynamic Brand Gradients Floating in Background */}
      <div className="absolute top-[10%] left-[-20%] w-[60vw] h-[60vw] bg-[#FF5A5F]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-20%] w-[60vw] h-[60vw] bg-[#FFB400]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* ==================== 1. HERO SECTION ==================== */}
      <section className="h-screen w-full relative flex flex-col justify-between overflow-hidden">
        {/* Local jump navbar */}
        <FadeIn y={-20} className="w-full z-30">
          <nav className="flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8 w-full max-w-7xl mx-auto">
            <span className="font-extrabold tracking-wider text-[#2B1B12] text-lg md:text-2xl select-none cursor-default font-podium">
              ANAQUELITO
            </span>
            <div className="flex gap-4 sm:gap-6 md:gap-10">
              {['about', 'pricing', 'projects', 'contact'].map((item) => {
                let label = '';
                if (item === 'about') label = 'Nosotros';
                else if (item === 'pricing') label = 'Dulces';
                else if (item === 'projects') label = 'Destacados';
                else if (item === 'contact') label = 'Contacto';
                return (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className="text-[#7A6455] font-semibold uppercase tracking-wider text-xs md:text-sm lg:text-[1.1rem] hover:text-[#FF5A5F] transition-colors duration-200 cursor-pointer"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </nav>
        </FadeIn>

        {/* Hero Portrait: Centered Lollipop Icon with Magnet effect */}
        <div className="absolute left-1/2 -translate-x-1/2 z-10 w-[240px] sm:w-[320px] md:w-[380px] lg:w-[460px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-12 pointer-events-auto">
          <FadeIn y={30} delay={0.6}>
            <Magnet padding={150} strength={4}>
              <div className="relative w-full aspect-square flex items-center justify-center bg-gradient-to-br from-[#FF5A5F]/15 to-[#FFB400]/15 rounded-full p-8 md:p-12 shadow-[0_20px_50px_rgba(255,90,95,0.15)] backdrop-blur-sm border border-[#EBD9C3] group">
                <img
                  src="/paleta.png"
                  alt="Dulce Gigante"
                  className="w-5/6 h-5/6 object-contain select-none pointer-events-none drop-shadow-[0_15px_30px_rgba(43,27,18,0.2)] transition-transform duration-500 group-hover:scale-105"
                  draggable={false}
                />
              </div>
            </Magnet>
          </FadeIn>
        </div>

        {/* Massive Hero Heading */}
        <div className="w-full flex-1 flex items-center justify-center z-20 relative pointer-events-none select-none overflow-hidden">
          <FadeIn y={40} delay={0.15} className="w-full text-center">
            <h1 
              style={{
                background: 'linear-gradient(135deg, #FF5A5F 0%, #FFB400 50%, #7621B0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
              className="font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] mt-6 sm:mt-4 md:-mt-5"
            >
              HOLA, SOY DULCE
            </h1>
          </FadeIn>
        </div>

        {/* Bottom Bar info */}
        <div className="w-full z-20 px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 max-w-7xl mx-auto flex justify-between items-end gap-4 relative">
          <FadeIn y={20} delay={0.35}>
            <p className="text-[#7A6455] font-semibold uppercase tracking-wide leading-snug text-left text-[11px] sm:text-xs md:text-sm lg:text-base max-w-[160px] sm:max-w-[220px] md:max-w-[260px] cursor-default select-none opacity-80">
              un distribuidor de dulces impulsado por llevar sabor y margen a tu negocio
            </p>
          </FadeIn>

          <FadeIn y={20} delay={0.5}>
            <ContactButton
              onClick={() => scrollToSection('pricing')}
              label="Ver Dulces"
            />
          </FadeIn>
        </div>
      </section>

      {/* ==================== 2. MARQUEE SECTION ==================== */}
      <section
        ref={marqueeSectionRef}
        className="w-full bg-[#FFF6EC] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden flex flex-col gap-3"
      >
        {/* Row 1 (Scrolls Right) */}
        <div className="w-full will-change-transform overflow-hidden relative py-1 [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]">
          <div
            className="flex gap-3 transition-transform duration-75 ease-out"
            style={{
              transform: `translateX(${scrollOffset - 200}px) translateZ(0)`,
            }}
          >
            {fila1.map((item, index) => {
              const realId = obtenerIdPorNombre(item.nombre);
              const cardContent = (
                <div
                  className="w-[400px] h-[250px] rounded-2xl flex-shrink-0 select-none shadow-[0_8px_30px_rgba(43,27,18,0.06)] border border-[#EBD9C3] bg-white flex items-center justify-between p-6 relative overflow-hidden group cursor-pointer"
                >
                  <div className="flex flex-col justify-between h-full z-10">
                    <span className="text-[#7A6455]/40 text-xs font-bold tracking-widest uppercase">Anaquelito</span>
                    <span className="font-black text-2xl tracking-wide text-[#2B1B12] uppercase">{item.nombre}</span>
                  </div>
                  <img
                    src={item.src}
                    alt={item.nombre}
                    className="w-[180px] h-[180px] object-contain drop-shadow-[0_10px_20px_rgba(43,27,18,0.1)] transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              );

              return realId ? (
                <Link key={`r1-${index}`} href={`/catalogo/${realId}`}>
                  {cardContent}
                </Link>
              ) : (
                <div key={`r1-${index}`}>{cardContent}</div>
              );
            })}
          </div>
        </div>

        {/* Row 2 (Scrolls Left) */}
        <div className="w-full will-change-transform overflow-hidden relative py-1 [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]">
          <div
            className="flex gap-3 transition-transform duration-75 ease-out"
            style={{
              transform: `translateX(${-(scrollOffset - 200)}px) translateZ(0)`,
            }}
          >
            {fila2.map((item, index) => {
              const realId = obtenerIdPorNombre(item.nombre);
              const cardContent = (
                <div
                  className="w-[400px] h-[250px] rounded-2xl flex-shrink-0 select-none shadow-[0_8px_30px_rgba(43,27,18,0.06)] border border-[#EBD9C3] bg-white flex items-center justify-between p-6 relative overflow-hidden group cursor-pointer"
                >
                  <div className="flex flex-col justify-between h-full z-10">
                    <span className="text-[#7A6455]/40 text-xs font-bold tracking-widest uppercase">Anaquelito</span>
                    <span className="font-black text-2xl tracking-wide text-[#2B1B12] uppercase">{item.nombre}</span>
                  </div>
                  <img
                    src={item.src}
                    alt={item.nombre}
                    className="w-[180px] h-[180px] object-contain drop-shadow-[0_10px_20px_rgba(43,27,18,0.1)] transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              );

              return realId ? (
                <Link key={`r2-${index}`} href={`/catalogo/${realId}`}>
                  {cardContent}
                </Link>
              ) : (
                <div key={`r2-${index}`}>{cardContent}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 3. ABOUT SECTION ==================== */}
      <section
        id="about"
        className="min-h-screen w-full relative px-5 sm:px-8 md:px-10 py-20 flex flex-col justify-center items-center gap-10 sm:gap-14 md:gap-16 overflow-hidden"
      >
        {/* Absolute corner decorations */}
        <div className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-10 pointer-events-none select-none">
          <FadeIn x={-80} duration={0.9} delay={0.1}>
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
              alt="3D Moon shape"
              className="w-[120px] sm:w-[160px] md:w-[210px] h-auto animate-[pulse_6s_infinite_ease-in-out]"
              draggable={false}
            />
          </FadeIn>
        </div>

        <div className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] z-10 pointer-events-none select-none">
          <FadeIn x={-80} duration={0.9} delay={0.25}>
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
              alt="3D Abstract shape"
              className="w-[100px] sm:w-[140px] md:w-[180px] h-auto animate-[bounce_8s_infinite_ease-in-out]"
              draggable={false}
            />
          </FadeIn>
        </div>

        <div className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] z-10 pointer-events-none select-none">
          <FadeIn x={80} duration={0.9} delay={0.15}>
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
              alt="3D Block shape"
              className="w-[120px] sm:w-[160px] md:w-[210px] h-auto animate-[pulse_5s_infinite_ease-in-out]"
              draggable={false}
            />
          </FadeIn>
        </div>

        <div className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] z-10 pointer-events-none select-none">
          <FadeIn x={80} duration={0.9} delay={0.3}>
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
              alt="3D Abstract group shape"
              className="w-[130px] sm:w-[170px] md:w-[220px] h-auto animate-[bounce_7s_infinite_ease-in-out]"
              draggable={false}
            />
          </FadeIn>
        </div>

        {/* Heading */}
        <FadeIn y={40} delay={0}>
          <h2 
            style={{
              background: 'linear-gradient(135deg, #FF5A5F 0%, #FFB400 50%, #7621B0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
            className="font-black uppercase leading-none tracking-tight text-center text-[3rem] sm:text-[6rem] md:text-[9rem] lg:text-[10rem]"
          >
            Nosotros
          </h2>
        </FadeIn>

        {/* Animated paragraph */}
        <div className="max-w-[560px] text-center w-full z-20">
          <AnimatedText
            highlightClass="text-[#FF5A5F]"
            text="Con más de cinco años de experiencia en el mercado de dulces, nos enfocamos en el mayoreo, logística rápida y el mejor servicio. Nos encanta trabajar con tienditas y negocios que buscan destacar y ofrecer calidad. ¡Hagamos algo dulce juntos!"
            className="text-[#7A6455] font-semibold leading-relaxed text-base sm:text-lg md:text-xl lg:text-2xl"
          />
        </div>

        {/* Contact button below text block */}
        <FadeIn y={30} delay={0.1} className="z-20 mt-6 sm:mt-10">
          <ContactButton
            onClick={() => scrollToSection('pricing')}
            label="Comprar Dulces"
          />
        </FadeIn>
      </section>

      {/* ==================== 4. SERVICES SECTION ==================== */}
      <section className="bg-white text-[#2B1B12] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-20 border-t border-[#EBD9C3]">
        <div className="max-w-5xl mx-auto w-full">
          <FadeIn className="text-center w-full mb-16 sm:mb-20 md:mb-28">
            <h2 className="font-black uppercase text-center text-[#2B1B12] leading-none tracking-tight text-[3rem] sm:text-[6rem] md:text-[9rem] lg:text-[10rem]">
              Beneficios
            </h2>
          </FadeIn>

          {/* List of 5 services */}
          <div className="flex flex-col border-t border-[#EBD9C3] w-full">
            {[
              {
                num: '01',
                title: 'Mayoreo Directo',
                desc: 'Precios competitivos sin intermediarios, optimizados para maximizar el margen de tu tiendita o negocio.',
              },
              {
                num: '02',
                title: 'Entrega Express',
                desc: 'Envío rápido en menos de 24 horas en CDMX y área metropolitana para que nunca te quedes sin stock.',
              },
              {
                num: '03',
                title: 'Margen Visible',
                desc: 'Calculamos el porcentaje de ganancia sugerido en cada producto directamente en tu pantalla.',
              },
              {
                num: '04',
                title: 'Surtido Premium',
                desc: 'Los dulces y botanas de mayor rotación y las marcas más buscadas por tus clientes en un solo lugar.',
              },
              {
                num: '05',
                title: 'Escáner Inteligente',
                desc: 'Reordena tus productos al instante escaneando la bolsa vacía con la cámara de tu celular.',
              },
            ].map((srv, index) => (
              <FadeIn
                key={srv.num}
                delay={index * 0.1}
                className="flex flex-col md:flex-row items-start md:items-center justify-between py-8 sm:py-10 md:py-12 border-b border-[#EBD9C3] gap-4 md:gap-8"
              >
                {/* Number Left */}
                <div className="font-black leading-none tracking-tighter text-[#2B1B12]/80 text-[3rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[8rem]">
                  {srv.num}
                </div>

                {/* Content Right */}
                <div className="flex flex-col gap-2 md:max-w-2xl">
                  <h3 className="font-semibold uppercase text-xl sm:text-2xl md:text-3xl text-[#2B1B12]">
                    {srv.title}
                  </h3>
                  <p className="font-light leading-relaxed text-[#7A6455] text-sm sm:text-base md:text-lg">
                    {srv.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 5. PROJECTS SECTION ==================== */}
      <section
        id="projects"
        ref={projectsContainerRef}
        className="bg-[#FFF6EC] text-[#2B1B12] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-5 sm:px-8 md:px-10 pt-24 pb-20 relative z-30 overflow-hidden"
      >
        <div className="max-w-5xl mx-auto w-full">
          <FadeIn className="text-center w-full mb-16 sm:mb-20">
            <h2 
              style={{
                background: 'linear-gradient(135deg, #FF5A5F 0%, #FFB400 50%, #7621B0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
              className="font-black uppercase text-center leading-none tracking-tight text-[3rem] sm:text-[6rem] md:text-[9rem] lg:text-[10rem]"
            >
              Destacados
            </h2>
          </FadeIn>

          {/* Sticky-stacking card stack */}
          <div className="flex flex-col gap-24 relative w-full mb-20">
            {projects.map((proj, index) => {
              const targetScale = 1 - (projects.length - 1 - index) * 0.03;
              // Map index range of container progress to scale values
              const scaleRangeStart = index / projects.length;
              const scale = useTransform(
                projectsScrollProgress,
                [scaleRangeStart, 1],
                [1, targetScale]
              );

              return (
                <div
                  key={proj.num}
                  className="h-[80vh] md:h-[85vh] sticky top-24 md:top-32 flex items-center justify-center w-full"
                >
                  <motion.div
                    style={{
                      scale,
                      top: `${index * 28}px`,
                      boxShadow: '0 20px 50px rgba(43,27,18,0.06)',
                    }}
                    className={`w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 ${proj.borderColor} bg-white p-6 sm:p-8 md:p-10 flex flex-col justify-between h-[70vh] sm:h-[75vh]`}
                  >
                    {/* Top Row info */}
                    <div className="flex justify-between items-center w-full border-b border-[#EBD9C3]/50 pb-4">
                      <div className="flex items-center gap-4">
                        <span className="font-black text-3xl sm:text-4xl md:text-5xl text-[#2B1B12] font-anton">
                          {proj.num}
                        </span>
                        <div className="flex flex-col">
                          <span className={`text-[10px] sm:text-xs uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold ${proj.badgeColor}`}>
                            {proj.category}
                          </span>
                          <span className="font-semibold text-sm sm:text-base md:text-lg text-[#2B1B12] uppercase tracking-tight mt-1">
                            {proj.name}
                          </span>
                        </div>
                      </div>
                      
                      {/* Navigate to detail page on button click */}
                      <LiveProjectButton
                        label="Ver Producto"
                        onClick={() => irADetallePorNombre(proj.name)}
                      />
                    </div>

                    {/* Bottom Row grid with Candy Assets */}
                    <div className="flex-1 grid grid-cols-10 gap-4 mt-6 h-full min-h-0">
                      {/* Left stack (40%) */}
                      <div className="col-span-4 flex flex-col gap-4 h-full justify-between">
                        <div className="relative flex-1 rounded-[24px] sm:rounded-[36px] bg-[#FFF6EC] border border-[#EBD9C3] p-3 flex items-center justify-center h-[45%] overflow-hidden shadow-inner">
                          <img
                            src={proj.col1_img1}
                            alt={`${proj.name} 1`}
                            className="max-h-[85%] max-w-[85%] object-contain select-none pointer-events-none drop-shadow-[0_10px_20px_rgba(43,27,18,0.1)] animate-[bounce_8s_infinite_ease-in-out]"
                          />
                        </div>
                        <div className="relative flex-1 rounded-[24px] sm:rounded-[36px] bg-[#FFF6EC] border border-[#EBD9C3] p-3 flex items-center justify-center h-[45%] overflow-hidden shadow-inner">
                          <img
                            src={proj.col1_img2}
                            alt={`${proj.name} 2`}
                            className="max-h-[85%] max-w-[85%] object-contain select-none pointer-events-none drop-shadow-[0_10px_20px_rgba(43,27,18,0.1)] animate-[bounce_6s_infinite_ease-in-out]"
                          />
                        </div>
                      </div>
                      {/* Right tall image (60%) */}
                      <div className="col-span-6 h-full">
                        <div className="relative w-full h-full rounded-[24px] sm:rounded-[36px] bg-gradient-to-br from-[#FFF6EC] to-[#FFEFDD] border border-[#EBD9C3] p-6 flex flex-col justify-between items-center overflow-hidden shadow-md">
                          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_70%)] pointer-events-none" />
                          <div className="text-center">
                            <h4 className="font-anton text-2xl sm:text-3xl text-[#2B1B12] uppercase tracking-wide">{proj.name}</h4>
                            <p className="text-xs text-[#7A6455] uppercase tracking-widest mt-1 font-semibold">{proj.desc}</p>
                          </div>
                          <img
                            src={proj.col2_img}
                            alt={`${proj.name} Main`}
                            className="max-h-[60%] max-w-[80%] object-contain select-none pointer-events-none drop-shadow-[0_20px_40px_rgba(43,27,18,0.15)] animate-[pulse_5s_infinite_ease-in-out] my-auto"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 6. COLORFUL SWEET CANDY SHOP ==================== */}
      <section
        id="pricing"
        className="w-full bg-gradient-to-b from-[#FFF6EC] via-[#FFEFDD] to-[#FFF6EC] text-[#2B1B12] pt-24 pb-32 px-4 sm:px-6 md:px-10 lg:px-14 border-t border-[#EBD9C3] z-40 relative"
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-10 sm:gap-14">
          {/* Header del Catálogo */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-[#EBD9C3]">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#FF5A5F] font-bold tracking-widest text-xs uppercase">
                <Sparkles className="h-4 w-4 animate-pulse" />
                Venta de Mayoreo Directa
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-podium uppercase tracking-tight text-[#2B1B12]">
                Catálogo Dulce
              </h2>
              <p className="text-[#7A6455] text-sm max-w-lg mt-1 font-semibold">
                Directo de distribuidor. Margen visible en cada producto y reorden automatizado escaneando la bolsa vacía.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative flex items-center w-full md:w-80 shrink-0">
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar golosinas..."
                className="w-full pl-12 pr-5 py-3 rounded-full bg-white border border-[#EBD9C3] text-[#2B1B12] text-sm sm:text-base outline-none focus:border-[#FF5A5F] focus:ring-4 focus:ring-[#FF5A5F]/10 transition-all placeholder-[#7A6455]/70"
              />
              <Search className="absolute left-4 h-5 w-5 text-[#7A6455]/70" />
            </div>
          </header>

          {/* Category Filter Chips */}
          <nav
            className="flex gap-2.5 flex-wrap items-center justify-start"
            aria-label="Filtrar por categoría de dulces"
          >
            <button
              onClick={() => setCategoriaFiltro('')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all border cursor-pointer ${
                !categoriaFiltro
                  ? 'bg-gradient-to-r from-[#FF5A5F] to-[#FFB400] text-white border-transparent shadow-lg shadow-[#FF5A5F]/20'
                  : 'bg-white text-[#7A6455] border-[#EBD9C3] hover:border-[#FF5A5F] hover:text-[#FF5A5F]'
              }`}
            >
              🚀 Todo el surtido
            </button>
            {Object.keys(NOMBRE_CATEGORIA).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaFiltro(cat)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all border cursor-pointer ${
                  categoriaFiltro === cat
                    ? 'bg-gradient-to-r from-[#FF5A5F] to-[#FFB400] text-white border-transparent shadow-lg shadow-[#FF5A5F]/20'
                    : 'bg-white text-[#7A6455] border-[#EBD9C3] hover:border-[#FF5A5F] hover:text-[#FF5A5F]'
                }`}
              >
                {EMOJI_CATEGORIA[cat] ?? '🍬'} {NOMBRE_CATEGORIA[cat]}
              </button>
            ))}
          </nav>

          {/* Error message */}
          {error && (
            <div className="flex flex-col items-center justify-center p-12 text-center text-[#D64545] bg-[#D64545]/5 rounded-3xl border border-[#D64545]/20">
              <p className="font-semibold text-lg">Error al sincronizar inventario</p>
              <p className="text-sm opacity-80 mt-1">{error}</p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center p-24 text-[#7A6455] gap-4">
              <RefreshCw className="h-10 w-10 animate-spin text-[#FF5A5F]" />
              <p className="text-sm font-semibold tracking-widest uppercase animate-pulse">
                Abriendo vitrinas...
              </p>
            </div>
          )}

          {/* Empty state */}
          {!loading && productos.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center p-20 text-center text-[#7A6455] bg-white border border-[#EBD9C3] rounded-3xl shadow-sm">
              <span className="text-6xl mb-4 animate-bounce">🍬</span>
              <p className="font-bold text-xl text-[#2B1B12]">No hay existencias con estos filtros</p>
              <button
                onClick={() => {
                  setCategoriaFiltro('');
                  setBusqueda('');
                }}
                className="text-xs text-[#FF5A5F] underline mt-4 hover:text-[#FF5A5F]/85 transition-colors font-medium uppercase tracking-wider cursor-pointer"
              >
                Resetear búsqueda
              </button>
            </div>
          )}

          {/* Grid de Dulces Coloridos */}
          {!loading && productos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {productos.map((producto, i) => {
                const margen = producto.precio_sugerido_reventa
                  ? Math.round(
                      ((producto.precio_sugerido_reventa - producto.precio_mayoreo) /
                        producto.precio_mayoreo) * 100
                    )
                  : null;

                // Unique colorful accents per item index
                const gradients = [
                  'from-[#FF5A5F]/15 to-[#FFB400]/5 border-[#FF5A5F]/20 hover:shadow-[#FF5A5F]/10',
                  'from-[#00A699]/15 to-[#FFB400]/5 border-[#00A699]/20 hover:shadow-[#00A699]/10',
                  'from-[#B600A8]/15 to-[#7621B0]/5 border-[#B600A8]/20 hover:shadow-[#B600A8]/10',
                  'from-[#BE4C00]/15 to-[#FFB400]/5 border-[#BE4C00]/20 hover:shadow-[#BE4C00]/10',
                ];
                const cardTheme = gradients[i % gradients.length];

                return (
                  <article
                    key={producto.id}
                    className={`flex flex-col bg-gradient-to-br ${cardTheme} border rounded-[30px] p-5 bg-white shadow-[0_8px_30px_rgba(43,27,18,0.02)] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(43,27,18,0.06)] hover:-translate-y-1.5 group`}
                  >
                    {/* Contenedor Visual de la Golosina - Enlace a detalle */}
                    <Link href={`/catalogo/${producto.id}`} className="relative h-44 bg-[#FFF6EC] rounded-2xl flex items-center justify-center text-6xl mb-4 overflow-hidden border border-[#EBD9C3]/50 cursor-pointer">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_70%)] pointer-events-none" />

                      {IMAGENES_PRODUCTOS[producto.nombre] ? (
                        <img
                          src={IMAGENES_PRODUCTOS[producto.nombre]}
                          alt={producto.nombre}
                          className="w-4/5 h-4/5 object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_10px_20px_rgba(43,27,18,0.15)]"
                        />
                      ) : (
                        <span className="select-none transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 drop-shadow-md">
                          {EMOJI_CATEGORIA[producto.categoria ?? ''] ?? '🍭'}
                        </span>
                      )}
                    </Link>

                    {/* Información e Identificación */}
                    <div className="flex flex-col flex-1">
                      <div className="mb-4">
                        <Link href={`/catalogo/${producto.id}`} className="hover:text-[#FF5A5F] transition-colors cursor-pointer">
                          <h3 className="font-anton text-lg sm:text-xl text-[#2B1B12] uppercase tracking-wide leading-tight line-clamp-1">
                            {producto.nombre}
                          </h3>
                        </Link>
                        <p className="text-xs font-bold text-[#7A6455]/60 mt-1 uppercase tracking-wider">
                          Por {producto.unidad} <span className="opacity-30 mx-1">•</span> {NOMBRE_CATEGORIA[producto.categoria ?? ''] ?? 'General'}
                        </p>
                      </div>

                      <div className="mt-auto flex flex-col gap-3">
                        {/* Cajón de precios y beneficios */}
                        <div className="bg-[#FFF6EC] rounded-xl p-3 border border-[#EBD9C3] relative overflow-hidden">
                          {margen !== null && (
                            <div className="absolute -top-3 right-2 bg-gradient-to-r from-[#1E9E6A] to-emerald-600 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                              Ganancia ~{margen}%
                            </div>
                          )}

                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="font-anton text-2xl leading-none text-[#2B1B12]">
                              ${producto.precio_mayoreo}
                            </span>
                            <span className="text-[9px] font-bold text-[#7A6455]/50 uppercase tracking-widest">
                              Mayoreo
                            </span>
                          </div>

                          {producto.precio_sugerido_reventa && (
                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#EBD9C3] border-dashed">
                              <span className="text-[10px] font-bold text-[#7A6455]/50 uppercase tracking-widest">
                                Sugerido
                              </span>
                              <span className="text-[12px] font-bold text-[#2B1B12]">
                                ${producto.precio_sugerido_reventa}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Botón de compra / Carrito */}
                        <div className="mt-1">
                          <BotonAgregar producto={producto} />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ==================== FOOTER / CONTACT SECTION ==================== */}
      <footer
        id="contact"
        className="w-full bg-[#FFF6EC] text-[#7A6455] pt-20 pb-10 border-t border-[#EBD9C3] z-40 relative animate-fade-in"
      >
        <div className="max-w-5xl mx-auto px-5 flex flex-col gap-16">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex flex-col gap-3">
              <span className="font-extrabold font-podium tracking-widest text-2xl text-[#2B1B12]">
                ANAQUELITO
              </span>
              <p className="max-w-sm text-sm font-semibold leading-relaxed text-[#7A6455]/85">
                Empoderando comercios locales y tienditas de abarrotes con el mejor surtido mayorista de dulces y botanas en México.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[#2B1B12] font-bold uppercase tracking-wider text-sm">
                Colaboración Directa
              </span>
              <a
                href="mailto:hola@anaquelito.mx"
                className="text-[#FF5A5F] hover:text-[#E0484D] transition-colors text-base font-semibold flex items-center gap-2 group cursor-pointer"
              >
                hola@anaquelito.mx
                <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-[#EBD9C3] text-xs font-semibold tracking-wide gap-4">
            <p>&copy; {new Date().getFullYear()} Anaquelito Mayoreo. Todos los derechos reservados.</p>
            <p className="flex items-center gap-1.5 uppercase font-bold text-[#FF5A5F]">
              Creado con dulzura <Sparkles className="h-3 w-3 animate-pulse" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
