'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Star, ArrowRight, ShieldCheck, Sparkles, Truck, Users } from 'lucide-react';
import PieDePagina from '@/componentes/PieDePagina';

const DULCES_DEMO = [
  {
    id: 'papas-crujientes',
    nombre: 'Papas Fuego',
    precio: '$15.00',
    emoji: '🥔',
    colorSplash: 'from-[#FF5A5F]/20 to-transparent',
    borderColor: 'hover:border-[#FF5A5F]/30',
    badge: 'Más Vendido',
  },
  {
    id: 'gomitas-enchiladas',
    nombre: 'Gomitas Enchiladas',
    precio: '$12.00',
    emoji: '🍬',
    colorSplash: 'from-[#00A699]/20 to-transparent',
    borderColor: 'hover:border-[#00A699]/30',
    badge: 'Favorito',
  },
  {
    id: 'cacahuate-japones',
    nombre: 'Cacahuate Japonés',
    precio: '$10.00',
    emoji: '🥜',
    colorSplash: 'from-[#BE4C00]/20 to-transparent',
    borderColor: 'hover:border-[#BE4C00]/30',
    badge: 'Popular',
  },
  {
    id: 'gummy-mix',
    nombre: 'Tropical Gummy',
    precio: '$14.00',
    emoji: '🍍',
    colorSplash: 'from-[#B600A8]/20 to-transparent',
    borderColor: 'hover:border-[#B600A8]/30',
    badge: 'Nuevo',
  },
];

export default function PaginaPrueba() {
  return (
    <div className="min-h-screen bg-[#FFF6EC] text-[#2B1B12] font-kanit selection:bg-[#FF5A5F]/20 selection:text-[#FF5A5F] overflow-x-hidden">
      
      {/* 1. NAVEGACIÓN ESTILO WEBFLOW */}
      <nav className="w-full bg-[#FFF6EC]/90 backdrop-blur-md border-b border-[#EBD9C3] sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-podium text-xl tracking-widest font-black uppercase">
          ANAQUELITO
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="/catalogo" className="text-sm font-semibold uppercase tracking-wider hover:text-[#FF5A5F] transition-colors">
            Catálogo
          </Link>
          <Link href="/escaner" className="text-sm font-semibold uppercase tracking-wider hover:text-[#FF5A5F] transition-colors">
            Escáner
          </Link>
          <Link href="/" className="text-sm font-semibold uppercase tracking-wider hover:text-[#FF5A5F] transition-colors">
            Inicio
          </Link>
        </div>

        {/* Botón con doble círculo animado (Webflow Button replica) */}
        <Link href="/catalogo" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-1 focus:outline-none">
          <span className="absolute inset-0 rounded-full border-2 border-[#2B1B12] group-hover:border-[#FF5A5F] transition-colors duration-300"></span>
          <div className="relative flex items-center gap-3 bg-[#2B1B12] text-[#FFF6EC] group-hover:bg-[#FF5A5F] px-5 py-2 rounded-full transition-colors duration-300">
            {/* Círculo de Flecha Izquierda */}
            <div className="w-5 h-5 rounded-full bg-[#FFF6EC]/10 flex items-center justify-center transform -translate-x-1 group-hover:translate-x-0 transition-transform duration-300">
              <ArrowRight size={10} className="text-white transform -rotate-45 group-hover:rotate-0 transition-transform" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest">Comprar Ahora</span>
            {/* Círculo de Flecha Derecha */}
            <div className="w-5 h-5 rounded-full bg-[#FFF6EC]/20 flex items-center justify-center transform translate-x-1 group-hover:translate-x-0 transition-transform duration-300">
              <ArrowRight size={10} className="text-white transform -rotate-45 group-hover:rotate-0 transition-transform" />
            </div>
          </div>
        </Link>
      </nav>

      {/* 2. HERO SECTION CON ELEMENTOS FLOTANTES */}
      <section className="relative pt-16 pb-24 px-6 md:px-12 overflow-hidden border-b border-[#EBD9C3]">
        {/* Candy Elements Flotantes en Background */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <motion.div 
            animate={{ y: [0, -25, 0], rotate: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[8%] text-5xl opacity-20"
          >
            🍬
          </motion.div>
          <motion.div 
            animate={{ y: [0, 30, 0], rotate: [0, -20, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[25%] left-[12%] text-4xl opacity-25"
          >
            🥜
          </motion.div>
          <motion.div 
            animate={{ y: [0, -35, 0], rotate: [0, 25, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[15%] right-[10%] text-5xl opacity-20"
          >
            🥔
          </motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-[20%] right-[15%] text-4xl opacity-25"
          >
            🍫
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-8 relative z-10">
          {/* Badge Calificaciones */}
          <div className="flex items-center gap-2 bg-white/60 border border-[#EBD9C3] px-4 py-2 rounded-full shadow-sm animate-fade-up">
            <div className="flex gap-0.5 text-[#FFB400]">
              {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A6455]">
              +1,200 Tienditas Satisfechas
            </span>
          </div>

          {/* Heading Principal Split */}
          <div className="max-w-3xl flex flex-col gap-4">
            <h1 className="text-5xl md:text-7xl font-podium uppercase tracking-tight leading-none text-[#2B1B12]">
              Dulces de Calidad, Márgenes Reales
            </h1>
            <p className="text-base md:text-lg text-[#7A6455] font-semibold max-w-xl mx-auto leading-relaxed">
              Surtido premium empaquetado para mantener la máxima frescura. Sin mínimos complicados y con entrega directa en 24 horas.
            </p>
          </div>

          {/* Botón Principal Doble Círculo */}
          <Link href="/catalogo" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-1.5 focus:outline-none mt-2">
            <span className="absolute inset-0 rounded-full border-2 border-[#2B1B12] group-hover:border-[#FF5A5F] transition-colors duration-300"></span>
            <div className="relative flex items-center gap-4 bg-[#2B1B12] text-[#FFF6EC] group-hover:bg-[#FF5A5F] px-8 py-3.5 rounded-full transition-colors duration-300">
              <div className="w-6 h-6 rounded-full bg-[#FFF6EC]/10 flex items-center justify-center transform -translate-x-1.5 group-hover:translate-x-0 transition-transform duration-300">
                <ArrowRight size={12} className="text-white transform -rotate-45 group-hover:rotate-0 transition-transform" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Surtir Mi Negocio</span>
              <div className="w-6 h-6 rounded-full bg-[#FFF6EC]/20 flex items-center justify-center transform translate-x-1.5 group-hover:translate-x-0 transition-transform duration-300">
                <ArrowRight size={12} className="text-white transform -rotate-45 group-hover:rotate-0 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Mockup de Bolsa con Splash Detrás (Replicando la lata y splash del Webflow) */}
          <div className="relative w-full max-w-lg h-[350px] md:h-[450px] mt-12 flex justify-center items-center">
            {/* Splash animado de fondo */}
            <div className="absolute w-[280px] h-[280px] md:w-[380px] md:h-[380px] rounded-full bg-gradient-to-tr from-[#FF5A5F]/20 to-[#E8C07D]/10 filter blur-3xl -z-10 animate-pulse"></div>
            
            {/* Splash circular vector */}
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute w-[320px] h-[320px] md:w-[420px] md:h-[420px] text-[#FFEFDD] fill-current -z-10 transform scale-90 md:scale-100 opacity-60">
              <path d="M42.2,-61C53.7,-53.4,61.3,-39.8,66.4,-25.1C71.5,-10.5,74,5.1,70.9,19.8C67.8,34.5,59.1,48.2,46.9,57.1C34.7,66,19,70.2,3.1,66C-12.8,61.7,-28.9,49.1,-41.8,37.2C-54.6,25.3,-64.2,14.1,-68.8,-0.1C-73.4,-14.3,-73,-31.6,-63.9,-43.3C-54.9,-55.1,-37.2,-61.3,-21.2,-65.3C-5.1,-69.3,9.4,-71.1,42.2,-61Z" transform="translate(100 100)" />
            </svg>

            {/* Mockup de dulce central */}
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="text-9xl md:text-[11rem] select-none filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.15)] cursor-grab active:cursor-grabbing"
            >
              🍿
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. LOGOS MARQUEE (AS SEEN IN) */}
      <section className="bg-[#2B1B12] text-[#FFF6EC] py-8 overflow-hidden border-b border-[#EBD9C3]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-12 px-6">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFF6EC]/40 whitespace-nowrap">
            Nuestros Socios
          </span>
          <div className="flex gap-12 overflow-x-auto no-scrollbar py-2 select-none opacity-50 w-full justify-around font-anton text-lg tracking-widest">
            <span>DULCES SELECTOS</span>
            <span>K-BOTANAS</span>
            <span>ABARROTES EL REGIO</span>
            <span>TIENDITAS MX</span>
          </div>
        </div>
      </section>

      {/* 4. INTRO LIFESTYLE GRID */}
      <section className="py-24 px-6 md:px-12 bg-white border-b border-[#EBD9C3]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Columna Izquierda: Tarjetas de imágenes con superposición y estilo Webflow */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 relative">
            <div className="rounded-[28px] overflow-hidden aspect-[4/5] bg-[#FFF6EC] border border-[#EBD9C3] flex items-center justify-center text-7xl shadow-md">
              🍬
            </div>
            <div className="rounded-[28px] overflow-hidden aspect-[4/5] bg-[#FFF6EC] border border-[#EBD9C3] flex items-center justify-center text-7xl mt-8 shadow-md">
              🥜
            </div>
          </div>

          {/* Columna Derecha: Copiado del estilo del texto del intro de Webflow */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <h2 className="text-xs font-bold tracking-widest text-[#FF5A5F] uppercase">
              Selección Exclusiva
            </h2>
            <h3 className="text-3xl md:text-5xl font-podium uppercase tracking-tight text-[#2B1B12] leading-tight">
              Sabor Artesanal Hecho Para Vender Diariamente
            </h3>
            <p className="text-[#7A6455] text-sm md:text-base leading-relaxed">
              Seleccionamos cada grano de cacahuate, cada lote de gomitas y cada papa artesanal para garantizar un crujido inigualable y la frescura que tus clientes merecen. Todo empaquetado de manera impecable para que luzca increíble en tus repisas.
            </p>
            <div>
              <Link href="/catalogo" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-1 focus:outline-none">
                <span className="absolute inset-0 rounded-full border-2 border-[#2B1B12] group-hover:border-[#FF5A5F] transition-colors duration-300"></span>
                <div className="relative flex items-center gap-3 bg-[#2B1B12] text-[#FFF6EC] group-hover:bg-[#FF5A5F] px-6 py-2.5 rounded-full transition-colors duration-300">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Saber Más</span>
                  <ArrowUpRight size={12} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LINEUP DE PRODUCTOS ESTILO COFFEE SPLASH REPLICA */}
      <section className="py-24 px-6 md:px-12 bg-[#FFF6EC] border-b border-[#EBD9C3]">
        <div className="max-w-6xl mx-auto flex flex-col gap-16">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-xs font-bold tracking-widest text-[#FF5A5F] uppercase">Catálogo Premium</h2>
              <h3 className="text-4xl md:text-5xl font-podium uppercase tracking-tight text-[#2B1B12]">El Lineup Destacado</h3>
            </div>
            <div>
              <Link href="/catalogo" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-1 focus:outline-none">
                <span className="absolute inset-0 rounded-full border-2 border-[#2B1B12] group-hover:border-[#FF5A5F] transition-colors duration-300"></span>
                <div className="relative flex items-center gap-3 bg-[#2B1B12] text-[#FFF6EC] group-hover:bg-[#FF5A5F] px-6 py-2.5 rounded-full transition-colors duration-300">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Ver Catálogo</span>
                  <ArrowRight size={12} />
                </div>
              </Link>
            </div>
          </header>

          {/* Grid de Productos con Efecto de Splash y Shadow en Hover */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DULCES_DEMO.map((dulce, idx) => (
              <Link 
                href={`/catalogo/${dulce.id}`} 
                key={idx} 
                className={`group bg-white border border-[#EBD9C3] rounded-[32px] overflow-hidden p-6 flex flex-col gap-6 shadow-[0_10px_35px_rgba(43,27,18,0.02)] transition-all duration-300 ${dulce.borderColor} hover:shadow-[0_25px_50px_rgba(43,27,18,0.06)]`}
              >
                {/* Cabecera del producto (Badge & Precio) */}
                <div className="flex justify-between items-center">
                  <span className="bg-[#FFF6EC] border border-[#EBD9C3] text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider text-[#7A6455]">
                    {dulce.badge}
                  </span>
                  <span className="font-anton text-base text-[#2B1B12]">
                    {dulce.precio}
                  </span>
                </div>

                {/* Contenedor del Splash y Emoji (Replicando la lata en el splash) */}
                <div className="relative w-full h-44 flex justify-center items-center overflow-hidden rounded-2xl bg-gradient-to-b from-transparent to-[#FFF6EC]/35">
                  {/* Gradiente Splash de fondo en hover */}
                  <div className={`absolute w-32 h-32 rounded-full bg-gradient-to-tr ${dulce.colorSplash} filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  {/* Vector splash animado en hover */}
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute w-32 h-32 text-[#FFF6EC] fill-current transform scale-0 group-hover:scale-100 transition-transform duration-350 ease-out z-0">
                    <path d="M44,-58C55.2,-49,61.3,-33.5,63.1,-18.2C64.9,-2.9,62.3,12.3,55.4,25.2C48.6,38,37.3,48.5,23.9,54.8C10.5,61.1,-5,63.1,-20.3,59.3C-35.6,55.5,-50.7,45.8,-59.7,32.3C-68.8,18.8,-71.7,1.6,-67.6,-13.7C-63.5,-29,-52.3,-42.4,-39.2,-51.2C-26.1,-60.1,-13,-64.3,1.3,-66C15.7,-67.7,32.7,-67,44,-58Z" transform="translate(100 100)" />
                  </svg>

                  <span className="text-7xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 z-10 select-none">
                    {dulce.emoji}
                  </span>
                </div>

                {/* Detalle inferior */}
                <div className="flex justify-between items-center border-t border-[#EBD9C3]/50 pt-4">
                  <h4 className="font-anton text-lg text-[#2B1B12] uppercase tracking-wide">
                    {dulce.nombre}
                  </h4>
                  <div className="w-8 h-8 rounded-full bg-[#FFF6EC] border border-[#EBD9C3] flex items-center justify-center group-hover:bg-[#FF5A5F] group-hover:border-[#FF5A5F] group-hover:text-white transition-colors duration-200">
                    <ArrowRight size={12} className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-200" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. COMPROMISO Y FILOSOFÍA ESTILO WEBFLOW */}
      <section className="py-24 px-6 md:px-12 bg-white border-b border-[#EBD9C3]">
        <div className="max-w-6xl mx-auto flex flex-col gap-16">
          <header className="text-center max-w-2xl mx-auto flex flex-col gap-3">
            <h2 className="text-xs font-bold tracking-widest text-[#FF5A5F] uppercase">Estándares de Calidad</h2>
            <h3 className="text-4xl md:text-5xl font-podium uppercase tracking-tight text-[#2B1B12] leading-none">
              Nuestra Promesa al Comerciante
            </h3>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Frescura Garantizada',
                desc: 'Todo producto se almacena bajo control de temperatura y humedad, garantizando que llegue crujiente y con fecha de caducidad óptima.',
                icon: <ShieldCheck size={28} className="text-[#FF5A5F]" />,
              },
              {
                title: 'Márgenes del 40% al 65%',
                desc: 'Nuestros precios directos de distribuidor eliminan intermediarios, asegurando que tu negocio obtenga ganancias insuperables.',
                icon: <Users size={28} className="text-[#FF5A5F]" />,
              },
              {
                title: 'Entrega Rápida en 24h',
                desc: 'Entregamos tu pedido en tu local al día siguiente para que nunca te quedes sin stock ni pierdas una sola venta.',
                icon: <Truck size={28} className="text-[#FF5A5F]" />,
              },
            ].map((prop, idx) => (
              <div key={idx} className="bg-[#FFF6EC] border border-[#EBD9C3] rounded-[32px] p-8 flex flex-col gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-[#EBD9C3] mb-2 shadow-sm">
                  {prop.icon}
                </div>
                <h4 className="font-anton text-lg sm:text-xl text-[#2B1B12] uppercase tracking-wide">
                  {prop.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#7A6455] leading-relaxed font-light">
                  {prop.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <div className="tema-tienda" style={{ minHeight: 'auto' }}>
        <PieDePagina />
      </div>
    </div>
  );
}
