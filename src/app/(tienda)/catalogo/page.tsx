'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, RefreshCw, Sparkles, ArrowRight, ArrowDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
};

// 21 GIF images from motionsites.ai
const GIFS_MARQUESINA = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
];

export default function PaginaCatalogo() {
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
  const fila1 = [...GIFS_MARQUESINA.slice(0, 11), ...GIFS_MARQUESINA.slice(0, 11), ...GIFS_MARQUESINA.slice(0, 11)];
  const fila2 = [...GIFS_MARQUESINA.slice(11), ...GIFS_MARQUESINA.slice(11), ...GIFS_MARQUESINA.slice(11)];

  // Projects data
  const projects = [
    {
      num: '01',
      category: 'Client Project',
      name: 'Nextlevel Studio',
      col1_img1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      col1_img2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      col2_img: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
    },
    {
      num: '02',
      category: 'Personal Work',
      name: 'Aura Brand Identity',
      col1_img1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
      col1_img2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
      col2_img: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
    },
    {
      num: '03',
      category: 'Client Project',
      name: 'Solaris Digital',
      col1_img1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
      col1_img2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
      col2_img: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
    },
  ];

  return (
    <div className="bg-[#0C0C0C] text-white font-kanit w-full overflow-x-clip min-h-screen relative selection:bg-[#B600A8]/30 selection:text-white">
      {/* Capa de ruido de fondo premium */}
      <div className="grain-overlay opacity-[0.15]" />

      {/* ==================== 1. HERO SECTION ==================== */}
      <section className="h-screen w-full relative flex flex-col justify-between overflow-hidden">
        {/* Local jump navbar */}
        <FadeIn y={-20} className="w-full z-30">
          <nav className="flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8 w-full max-w-7xl mx-auto">
            <span className="font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#D7E2EA] to-white/70 text-lg md:text-2xl select-none cursor-default font-podium">
              JACK
            </span>
            <div className="flex gap-4 sm:gap-6 md:gap-10">
              {['about', 'pricing', 'projects', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-[#D7E2EA] font-medium uppercase tracking-wider text-xs md:text-sm lg:text-[1.1rem] hover:opacity-70 transition-opacity duration-200 cursor-pointer"
                >
                  {item === 'pricing' ? 'Candy Shop' : item}
                </button>
              ))}
            </div>
          </nav>
        </FadeIn>

        {/* Hero Portrait (Centered Absolutely behind text) */}
        <div className="absolute left-1/2 -translate-x-1/2 z-10 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 pointer-events-auto">
          <FadeIn y={30} delay={0.6}>
            <Magnet padding={150} strength={3}>
              <img
                src="https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png"
                alt="Portrait of Jack"
                className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_20px_50px_rgba(182,0,168,0.25)] brightness-105"
                draggable={false}
              />
            </Magnet>
          </FadeIn>
        </div>

        {/* Massive Hero Heading */}
        <div className="w-full flex-1 flex items-center justify-center z-20 relative pointer-events-none select-none overflow-hidden">
          <FadeIn y={40} delay={0.15} className="w-full text-center">
            <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] mt-6 sm:mt-4 md:-mt-5">
              Hi, i&apos;m jack
            </h1>
          </FadeIn>
        </div>

        {/* Bottom Bar info */}
        <div className="w-full z-20 px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 max-w-7xl mx-auto flex justify-between items-end gap-4 relative">
          <FadeIn y={20} delay={0.35}>
            <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug text-left text-[11px] sm:text-xs md:text-sm lg:text-base max-w-[160px] sm:max-w-[220px] md:max-w-[260px] cursor-default select-none opacity-80">
              a 3d creator driven by crafting striking and unforgettable projects
            </p>
          </FadeIn>

          <FadeIn y={20} delay={0.5}>
            <ContactButton
              onClick={() => scrollToSection('contact')}
              label="Contact Me"
            />
          </FadeIn>
        </div>
      </section>

      {/* ==================== 2. MARQUEE SECTION ==================== */}
      <section
        ref={marqueeSectionRef}
        className="w-full bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden flex flex-col gap-3"
      >
        {/* Row 1 (Scrolls Right) */}
        <div className="w-full will-change-transform overflow-hidden relative py-1 [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]">
          <div
            className="flex gap-3 transition-transform duration-75 ease-out"
            style={{
              transform: `translateX(${scrollOffset - 200}px) translateZ(0)`,
            }}
          >
            {fila1.map((url, index) => (
              <img
                key={`r1-${index}`}
                src={url}
                alt="Marquee gif item"
                className="w-[420px] h-[270px] rounded-2xl object-cover flex-shrink-0 select-none shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/5"
                loading="lazy"
                draggable={false}
              />
            ))}
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
            {fila2.map((url, index) => (
              <img
                key={`r2-${index}`}
                src={url}
                alt="Marquee gif item"
                className="w-[420px] h-[270px] rounded-2xl object-cover flex-shrink-0 select-none shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/5"
                loading="lazy"
                draggable={false}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 3. ABOUT SECTION ==================== */}
      <section
        id="about"
        className="min-h-screen w-full relative px-5 sm:px-8 md:px-10 py-20 flex flex-col justify-center items-center gap-10 sm:gap-14 md:gap-16 overflow-hidden"
      >
        {/* Absolute corner decorations */}
        {/* Top-left: Moon icon */}
        <div className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-10 pointer-events-none select-none">
          <FadeIn x={-80} duration={0.9} delay={0.1}>
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
              alt="Decorative Moon"
              className="w-[120px] sm:w-[160px] md:w-[210px] h-auto animate-[pulse_6s_infinite_ease-in-out]"
              draggable={false}
            />
          </FadeIn>
        </div>

        {/* Bottom-left: 3D object */}
        <div className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] z-10 pointer-events-none select-none">
          <FadeIn x={-80} duration={0.9} delay={0.25}>
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
              alt="Decorative 3D Object"
              className="w-[100px] sm:w-[140px] md:w-[180px] h-auto animate-[bounce_8s_infinite_ease-in-out]"
              draggable={false}
            />
          </FadeIn>
        </div>

        {/* Top-right: Lego icon */}
        <div className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] z-10 pointer-events-none select-none">
          <FadeIn x={80} duration={0.9} delay={0.15}>
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
              alt="Decorative Lego"
              className="w-[120px] sm:w-[160px] md:w-[210px] h-auto animate-[pulse_5s_infinite_ease-in-out]"
              draggable={false}
            />
          </FadeIn>
        </div>

        {/* Bottom-right: 3D group */}
        <div className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] z-10 pointer-events-none select-none">
          <FadeIn x={80} duration={0.9} delay={0.3}>
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
              alt="Decorative 3D Group"
              className="w-[130px] sm:w-[170px] md:w-[220px] h-auto animate-[bounce_7s_infinite_ease-in-out]"
              draggable={false}
            />
          </FadeIn>
        </div>

        {/* Heading */}
        <FadeIn y={40} delay={0}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center text-[3rem] sm:text-[6rem] md:text-[9rem] lg:text-[10rem]">
            About me
          </h2>
        </FadeIn>

        {/* Animated paragraph */}
        <div className="max-w-[560px] text-center w-full z-20">
          <AnimatedText
            text="With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!"
            className="text-[#D7E2EA] font-medium leading-relaxed text-base sm:text-lg md:text-xl lg:text-2xl"
          />
        </div>

        {/* Contact button below text block */}
        <FadeIn y={30} delay={0.1} className="z-20 mt-6 sm:mt-10">
          <ContactButton
            onClick={() => scrollToSection('pricing')}
            label="Enter Candy Shop"
          />
        </FadeIn>
      </section>

      {/* ==================== 4. SERVICES SECTION ==================== */}
      <section className="bg-white text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-20">
        <div className="max-w-5xl mx-auto w-full">
          <FadeIn className="text-center w-full mb-16 sm:mb-20 md:mb-28">
            <h2 className="font-black uppercase text-center text-[#0C0C0C] leading-none tracking-tight text-[3rem] sm:text-[6rem] md:text-[9rem] lg:text-[10rem]">
              Services
            </h2>
          </FadeIn>

          {/* List of 5 services */}
          <div className="flex flex-col border-t border-[#0C0C0C]/15 w-full">
            {[
              {
                num: '01',
                title: '3D Modeling',
                desc: 'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.',
              },
              {
                num: '02',
                title: 'Rendering',
                desc: 'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.',
              },
              {
                num: '03',
                title: 'Motion Design',
                desc: 'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.',
              },
              {
                num: '04',
                title: 'Branding',
                desc: 'Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.',
              },
              {
                num: '05',
                title: 'Web Design',
                desc: 'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.',
              },
            ].map((srv, index) => (
              <FadeIn
                key={srv.num}
                delay={index * 0.1}
                className="flex flex-col md:flex-row items-start md:items-center justify-between py-8 sm:py-10 md:py-12 border-b border-[#0C0C0C]/15 gap-4 md:gap-8"
              >
                {/* Number Left */}
                <div className="font-black leading-none tracking-tighter text-[#0C0C0C] text-[3rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[8rem]">
                  {srv.num}
                </div>

                {/* Content Right */}
                <div className="flex flex-col gap-2 md:max-w-2xl">
                  <h3 className="font-semibold uppercase text-xl sm:text-2xl md:text-3xl text-[#0C0C0C]">
                    {srv.title}
                  </h3>
                  <p className="font-light leading-relaxed text-[#0C0C0C]/65 text-sm sm:text-base md:text-lg">
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
        className="bg-[#0C0C0C] text-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-5 sm:px-8 md:px-10 pt-24 pb-20 relative z-30 overflow-hidden"
      >
        <div className="max-w-5xl mx-auto w-full">
          <FadeIn className="text-center w-full mb-16 sm:mb-20">
            <h2 className="hero-heading font-black uppercase text-center leading-none tracking-tight text-[3rem] sm:text-[6rem] md:text-[9rem] lg:text-[10rem]">
              Project
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
                      boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
                    }}
                    className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 flex flex-col justify-between h-[70vh] sm:h-[75vh]"
                  >
                    {/* Top Row info */}
                    <div className="flex justify-between items-center w-full border-b border-[#D7E2EA]/10 pb-4">
                      <div className="flex items-center gap-4">
                        <span className="font-black text-3xl sm:text-4xl md:text-5xl text-[#D7E2EA] font-anton">
                          {proj.num}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#D7E2EA]/50 font-medium">
                            {proj.category}
                          </span>
                          <span className="font-semibold text-sm sm:text-base md:text-lg text-white uppercase tracking-tight">
                            {proj.name}
                          </span>
                        </div>
                      </div>
                      <LiveProjectButton label="Live Project" disabled={true} />
                    </div>

                    {/* Bottom Row grid */}
                    <div className="flex-1 grid grid-cols-10 gap-3 md:gap-4 mt-4 h-full min-h-0">
                      {/* Left stack (40%) */}
                      <div className="col-span-4 flex flex-col gap-3 md:gap-4 h-full justify-between">
                        <img
                          src={proj.col1_img1}
                          alt={`${proj.name} render 1`}
                          className="w-full flex-1 rounded-[24px] sm:rounded-[36px] md:rounded-[48px] object-cover h-[45%] shadow-md"
                        />
                        <img
                          src={proj.col1_img2}
                          alt={`${proj.name} render 2`}
                          className="w-full flex-1 rounded-[24px] sm:rounded-[36px] md:rounded-[48px] object-cover h-[45%] shadow-md"
                        />
                      </div>
                      {/* Right tall image (60%) */}
                      <div className="col-span-6 h-full">
                        <img
                          src={proj.col2_img}
                          alt={`${proj.name} tall render`}
                          className="w-full h-full rounded-[24px] sm:rounded-[36px] md:rounded-[48px] object-cover shadow-md"
                        />
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
        className="w-full bg-gradient-to-b from-[#0C0C0C] via-[#150117] to-[#0A000A] text-white pt-24 pb-32 px-4 sm:px-6 md:px-10 lg:px-14 border-t-2 border-[#B600A8]/20 z-40 relative"
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-10 sm:gap-14">
          {/* Header del Catálogo */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-[#B600A8]/20">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#B600A8] font-bold tracking-widest text-xs uppercase">
                <Sparkles className="h-4 w-4 animate-pulse" />
                Venta de Mayoreo Directa
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-podium uppercase tracking-tight text-white">
                Nuestra Selección
              </h2>
              <p className="text-[#D7E2EA]/70 text-sm max-w-lg mt-1 font-light">
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
                className="w-full pl-12 pr-5 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#B600A8] focus:bg-white/[0.08] transition-all placeholder-white/30 focus:ring-4 focus:ring-[#B600A8]/10"
              />
              <Search className="absolute left-4 h-5 w-5 text-white/40" />
            </div>
          </header>

          {/* Category Filter Chips */}
          <nav
            className="flex gap-2.5 flex-wrap items-center justify-start"
            aria-label="Filtrar por categoría de dulces"
          >
            <button
              onClick={() => setCategoriaFiltro('')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all border ${
                !categoriaFiltro
                  ? 'bg-gradient-to-r from-[#B600A8] to-[#7621B0] text-white border-transparent shadow-lg shadow-[#B600A8]/20'
                  : 'bg-white/5 text-[#D7E2EA]/70 border-white/10 hover:text-white hover:border-white/30'
              }`}
            >
              🚀 Todo el surtido
            </button>
            {Object.keys(NOMBRE_CATEGORIA).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaFiltro(cat)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all border ${
                  categoriaFiltro === cat
                    ? 'bg-gradient-to-r from-[#B600A8] to-[#7621B0] text-white border-transparent shadow-lg shadow-[#B600A8]/20'
                    : 'bg-white/5 text-[#D7E2EA]/70 border-white/10 hover:text-white hover:border-[#B600A8]/50'
                }`}
              >
                {EMOJI_CATEGORIA[cat] ?? '🍬'} {NOMBRE_CATEGORIA[cat]}
              </button>
            ))}
          </nav>

          {/* Error message */}
          {error && (
            <div className="flex flex-col items-center justify-center p-12 text-center text-red-400 bg-red-500/5 rounded-3xl border border-red-500/10">
              <p className="font-semibold text-lg">Error al sincronizar inventario</p>
              <p className="text-sm opacity-80 mt-1">{error}</p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center p-24 text-white/40 gap-4">
              <RefreshCw className="h-10 w-10 animate-spin text-[#B600A8]" />
              <p className="text-sm font-semibold tracking-widest uppercase animate-pulse">
                Abriendo vitrinas...
              </p>
            </div>
          )}

          {/* Empty state */}
          {!loading && productos.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center p-20 text-center text-white/40 bg-white/[0.02] border border-white/5 rounded-3xl">
              <span className="text-6xl mb-4 animate-bounce">🍬</span>
              <p className="font-bold text-xl text-white">No hay existencias con estos filtros</p>
              <button
                onClick={() => {
                  setCategoriaFiltro('');
                  setBusqueda('');
                }}
                className="text-xs text-white underline mt-4 hover:text-[#B600A8] transition-colors font-medium uppercase tracking-wider"
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
                  'from-[#FF5A5F]/20 to-[#FFB400]/10 border-[#FF5A5F]/30 hover:shadow-[#FF5A5F]/15',
                  'from-[#00A699]/20 to-[#FFB400]/10 border-[#00A699]/30 hover:shadow-[#00A699]/15',
                  'from-[#B600A8]/20 to-[#7621B0]/10 border-[#B600A8]/30 hover:shadow-[#B600A8]/15',
                  'from-[#BE4C00]/20 to-[#FFB400]/10 border-[#BE4C00]/30 hover:shadow-[#BE4C00]/15',
                ];
                const cardTheme = gradients[i % gradients.length];

                return (
                  <article
                    key={producto.id}
                    className={`flex flex-col bg-gradient-to-br ${cardTheme} border rounded-[30px] p-5 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 group`}
                  >
                    {/* Contenedor Visual de la Golosina */}
                    <div className="relative h-44 bg-black/40 rounded-2xl flex items-center justify-center text-6xl mb-4 overflow-hidden border border-white/5">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_70%)] pointer-events-none" />

                      {IMAGENES_PRODUCTOS[producto.nombre] ? (
                        <img
                          src={IMAGENES_PRODUCTOS[producto.nombre]}
                          alt={producto.nombre}
                          className="w-4/5 h-4/5 object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                        />
                      ) : (
                        <span className="select-none transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 drop-shadow-md">
                          {EMOJI_CATEGORIA[producto.categoria ?? ''] ?? '🍭'}
                        </span>
                      )}
                    </div>

                    {/* Información e Identificación */}
                    <div className="flex flex-col flex-1">
                      <div className="mb-4">
                        <h3 className="font-anton text-lg sm:text-xl text-white uppercase tracking-wide leading-tight line-clamp-1">
                          {producto.nombre}
                        </h3>
                        <p className="text-xs font-semibold text-[#D7E2EA]/50 mt-1 uppercase tracking-wider">
                          Por {producto.unidad} <span className="opacity-30 mx-1">•</span> {NOMBRE_CATEGORIA[producto.categoria ?? ''] ?? 'General'}
                        </p>
                      </div>

                      <div className="mt-auto flex flex-col gap-3">
                        {/* Cajón de precios y beneficios */}
                        <div className="bg-black/60 rounded-xl p-3 border border-white/5 relative overflow-hidden">
                          {margen !== null && (
                            <div className="absolute -top-3 right-2 bg-gradient-to-r from-[#1E9E6A] to-emerald-600 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                              Ganancia ~{margen}%
                            </div>
                          )}

                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="font-anton text-2xl leading-none text-white">
                              ${producto.precio_mayoreo}
                            </span>
                            <span className="text-[9px] font-bold text-[#D7E2EA]/45 uppercase tracking-widest">
                              Mayoreo
                            </span>
                          </div>

                          {producto.precio_sugerido_reventa && (
                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10 border-dashed">
                              <span className="text-[10px] font-bold text-[#D7E2EA]/45 uppercase tracking-widest">
                                Sugerido
                              </span>
                              <span className="text-[12px] font-bold text-[#D7E2EA]">
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
        className="w-full bg-[#070707] text-[#D7E2EA]/60 pt-20 pb-10 border-t border-white/5 z-40 relative"
      >
        <div className="max-w-5xl mx-auto px-5 flex flex-col gap-16">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex flex-col gap-3">
              <span className="font-extrabold font-podium tracking-widest text-2xl text-white">
                JACK &amp; ANAQUELITO
              </span>
              <p className="max-w-sm text-sm font-light leading-relaxed">
                Empowering retailers with top-tier 3D design and wholesale candy supply systems in Mexico.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-white font-semibold uppercase tracking-wider text-sm">
                Colaboración Directa
              </span>
              <a
                href="mailto:hola@anaquelito.mx"
                className="text-white hover:text-[#B600A8] transition-colors text-base font-medium flex items-center gap-2 group"
              >
                hola@anaquelito.mx
                <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs font-light tracking-wide gap-4">
            <p>&copy; {new Date().getFullYear()} Jack &amp; Anaquelito. Todos los derechos reservados.</p>
            <p className="flex items-center gap-1.5 uppercase font-medium text-[#B600A8]">
              Designed with focus <Sparkles className="h-3 w-3" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
