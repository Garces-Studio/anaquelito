'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Crown, X, Sparkles, TrendingUp, CheckCircle, Package, Camera, ShoppingBag, Zap } from 'lucide-react';
import Link from 'next/link';
import PieDePagina from '@/componentes/PieDePagina';

const DULCES = [
  { 
    nombre: 'PAPAS CRUJIENTES FUEGO', 
    descripcion: 'Papas fritas con sal de grano y un toque de chile y limón. Crujientes al máximo, listas para activar las ventas de tu negocio.', 
    src: '/papas.png', 
    bg: '#F4845F', 
    panel: '#F79B7F' 
  },
  { 
    nombre: 'MAZAPÁN TRADICIONAL', 
    descripcion: 'El dulce favorito de cacahuate en México. Sabor clásico y textura suave indispensable para cualquier tiendita o dulcería.', 
    src: '/mazapan.png', 
    bg: '#E8C07D', 
    panel: '#EED6AD' 
  },
  { 
    nombre: 'GOMITAS ENCHILADAS', 
    descripcion: 'Gomitas suaves y masticables cubiertas de auténtico chile en polvo. El balance perfecto entre dulce y picante.', 
    src: '/gomitas.png', 
    bg: '#6BBF7A', 
    panel: '#85CC92' 
  },
  { 
    nombre: 'PALETA DE TAMARINDO', 
    descripcion: 'Tradicional paleta de dulce macizo sabor tamarindo con una intensa capa de chile. Un producto irresistible de alta rotación.', 
    src: '/paleta.png', 
    bg: '#E882B4', 
    panel: '#ED9DC4' 
  }
];

const IMAGENES_PRODUCTOS: Record<string, string> = {
  'Cacahuate Japonés': '/cacahuate.png',
  'Gomitas Surtidas': '/gomitas.png',
  'Chocolate de Mesa': '/chocolate.png',
  'Semillas Enchiladas': '/semillas.png',
  'Palomitas Acarameladas': '/palomitas.png',
  'Papas Fritas Caseras': '/papas.png',
};

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

export default function Inicio() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pre-cargar imágenes del carrusel
  useEffect(() => {
    DULCES.forEach((dulce) => {
      const img = new Image();
      img.src = dulce.src;
    });
  }, []);

  const navegar = (direccion: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setActiveIndex((prevIndex) => {
      if (direccion === 'next') {
        return (prevIndex + 1) % 4;
      } else {
        return (prevIndex + 3) % 4;
      }
    });

    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  };

  // Roles de posición del carrusel
  const obtenerRol = (indice: number) => {
    if (indice === activeIndex) return 'center';
    if (indice === (activeIndex + 3) % 4) return 'left';
    if (indice === (activeIndex + 1) % 4) return 'right';
    return 'back';
  };

  // Estilos según el rol de la tarjeta adaptados para el carrusel de dulces
  const obtenerEstiloRol = (rol: string) => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      aspectRatio: '0.6 / 1',
      transition: 'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1)',
      willChange: 'transform, filter, opacity',
    };

    if (isMobile) {
      switch (rol) {
        case 'center':
          return {
            ...baseStyle,
            left: '50%',
            transform: 'translateX(-50%) scale(1.15)',
            opacity: 1,
            filter: 'blur(0px)',
            zIndex: 20,
            height: '62%',
            bottom: '18%',
          };
        case 'left':
          return {
            ...baseStyle,
            left: '15%',
            transform: 'translateX(-50%) scale(0.8)',
            opacity: 0.7,
            filter: 'blur(2px)',
            zIndex: 10,
            height: '32%',
            bottom: '24%',
          };
        case 'right':
          return {
            ...baseStyle,
            left: '85%',
            transform: 'translateX(-50%) scale(0.8)',
            opacity: 0.7,
            filter: 'blur(2px)',
            zIndex: 10,
            height: '32%',
            bottom: '24%',
          };
        case 'back':
        default:
          return {
            ...baseStyle,
            left: '50%',
            transform: 'translateX(-50%) scale(0.7)',
            opacity: 0.4,
            filter: 'blur(4px)',
            zIndex: 5,
            height: '25%',
            bottom: '24%',
          };
      }
    } else {
      switch (rol) {
        case 'center':
          return {
            ...baseStyle,
            left: '50%',
            transform: 'translateX(-50%) scale(1.35)',
            opacity: 1,
            filter: 'blur(0px)',
            zIndex: 20,
            height: '75%',
            bottom: '22%',
          };
        case 'left':
          return {
            ...baseStyle,
            left: '15%',
            transform: 'translateX(-50%) scale(0.9)',
            opacity: 0.8,
            filter: 'blur(2px)',
            zIndex: 10,
            height: '45%',
            bottom: '30%',
          };
        case 'right':
          return {
            ...baseStyle,
            left: '85%',
            transform: 'translateX(-50%) scale(0.9)',
            opacity: 0.8,
            filter: 'blur(2px)',
            zIndex: 10,
            height: '45%',
            bottom: '30%',
          };
        case 'back':
        default:
          return {
            ...baseStyle,
            left: '50%',
            transform: 'translateX(-50%) scale(0.8)',
            opacity: 0.4,
            filter: 'blur(4px)',
            zIndex: 5,
            height: '35%',
            bottom: '32%',
          };
      }
    }
  };

  return (
    <div style={{ height: '100vh', overflowY: 'auto', scrollBehavior: 'smooth' }}>
      {/* SECCIÓN HERO (TOONHUB CAROUSEL STYLE) */}
      <main 
        style={{ 
          position: 'relative',
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: DULCES[activeIndex].bg,
          transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Video de fondo en bucle con blend mode */}
        <video 
          className="video-background"
          autoPlay 
          muted 
          loop 
          playsInline
          style={{
            opacity: 0.15,
            mixBlendMode: 'overlay',
            zIndex: 1
          }}
        >
          <source src="/dulces-loop.mp4" type="video/mp4" />
        </video>

        {/* Superposición con gradiente oscuro para legibilidad */}
        <div 
          className="video-overlay"
          style={{
            background: 'linear-gradient(to right, rgba(10, 8, 6, 0.7) 0%, rgba(10, 8, 6, 0.3) 100%)',
            zIndex: 2,
            pointerEvents: 'none'
          }}
        />

        {/* Capa de grano analógico premium */}
        <div className="grain-overlay" />

        {/* CONTENIDO PRINCIPAL EN CUADRÍCULA SPLIT */}
        <div className="portada-grid">
          {/* Columna Izquierda: Información de Negocio */}
          <div className="portada-col-info">
            
            {/* Tagline */}
            <div className="tagline-hero animate-fade-up">
              <Crown size={14} style={{ opacity: 0.8 }} />
              <span>El aliado de tu tiendita B2B</span>
            </div>

            {/* Título Principal */}
            <h1 className="titulo-hero font-podium animate-fade-up-delay-1">
              <span className="titulo-linea">SURTE.</span>
              <span className="titulo-linea">AHORRA.</span>
              <span className="titulo-linea">CRECE.</span>
            </h1>

            {/* Subtexto */}
            <p className="subtexto-hero animate-fade-up-delay-2">
              Abastece tu tiendita de dulces y botanas de alta rotación directamente desde tu celular. Sin intermediarios, con el margen de ganancia calculado y envío rápido.
            </p>

            {/* Botones de acción */}
            <div className="fila-cta-hero animate-fade-up-delay-3">
              <Link href="/catalogo" className="boton-cta-negro">
                <span>VER CATÁLOGO</span>
                <ArrowUpRight size={14} />
              </Link>
              <Link href="/escaner" className="boton-cta-cristal">
                <span>ESCANEAR PRODUCTO</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Estadísticas */}
            <div className="fila-stats-hero animate-fade-up-delay-4">
              <div className="stat-item">
                <span className="stat-valor">1.1M+</span>
                <span className="stat-etiqueta">Tienditas en México</span>
              </div>
              <div className="stat-item">
                <span className="stat-valor">24 HRS</span>
                <span className="stat-etiqueta">Entrega Promedio</span>
              </div>
              <div className="stat-item">
                <span className="stat-valor">~40%</span>
                <span className="stat-etiqueta">Margen Sugerido</span>
              </div>
            </div>

          </div>

          {/* Columna Derecha: Carrusel Flotante */}
          <div className="portada-col-carrusel animate-fade-in-delay">
            
            {/* Renderizado de Dulces con Efecto 3D */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
              {DULCES.map((dulce, indice) => {
                const rol = obtenerRol(indice);
                const estilo = obtenerEstiloRol(rol);
                return (
                  <div key={indice} style={estilo}>
                    <img 
                      src={dulce.src} 
                      alt={dulce.nombre} 
                      className="blend-multiply"
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain', 
                        objectPosition: 'bottom center',
                        pointerEvents: 'none',
                        filter: rol === 'center' ? 'drop-shadow(0 20px 40px rgba(0,0,0,0.65))' : 'blur(2px)'
                      }} 
                      draggable={false}
                    />
                  </div>
                );
              })}
            </div>

            {/* Controles de carrusel y descripción del producto activo */}
            <div className="controles-carrusel-premium">
              <div className="info-producto-carrusel">
                <span className="nombre-producto-carrusel">
                  {DULCES[activeIndex].nombre}
                </span>
                <span className="desc-producto-carrusel">
                  {DULCES[activeIndex].descripcion}
                </span>
              </div>

              <div className="botones-carrusel-premium">
                <button 
                  onClick={() => navegar('prev')}
                  className="boton-carrusel-premium"
                  aria-label="Anterior"
                >
                  <ArrowLeft size={18} strokeWidth={2.25} />
                </button>
                <button 
                  onClick={() => navegar('next')}
                  className="boton-carrusel-premium"
                  aria-label="Siguiente"
                >
                  <ArrowRight size={18} strokeWidth={2.25} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* SECCIÓN 1: ¿QUÉ ES ANAQUELITO? (SOBRE NOSOTROS & SURTIDO) */}
      <section id="about" className="py-24 px-6 md:px-12 bg-[#FFF6EC] border-t border-[#EBD9C3] relative z-10 font-kanit">
        <div className="max-w-6xl mx-auto flex flex-col gap-16">
          <header className="text-center max-w-2xl mx-auto flex flex-col gap-3">
            <span className="text-[#FF5A5F] text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-1.5">
              <Sparkles className="h-4 w-4 animate-pulse" /> Surtido Mayorista CDMX
            </span>
            <h2 className="text-4xl md:text-5xl font-podium uppercase tracking-tight text-[#2B1B12] leading-none">
              Sabor, Variedad y Márgenes para tu Negocio
            </h2>
            <p className="text-[#7A6455] text-sm md:text-base font-semibold mt-2">
              Surtimos tu tiendita, abarrotes, cafetería o negocio local de forma inteligente. Directo de distribuidor, sin compras mínimas absurdas y con entrega en tu puerta.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                emoji: '🥜',
                title: 'Frutos Secos y Semillas',
                desc: 'Cacahuates japoneses, pepitas, nueces y semillas enchiladas con calidad de selección.',
                bg: 'from-[#FF5A5F]/10 to-transparent border-[#FF5A5F]/20',
              },
              {
                emoji: '🍬',
                title: 'Gomitas y Aciditos',
                desc: 'Gomitas surtidas, lombrices enchiladas y las marcas que tus clientes buscan a diario.',
                bg: 'from-[#00A699]/10 to-transparent border-[#00A699]/20',
              },
              {
                emoji: '🍫',
                title: 'Chocolates Premium',
                desc: 'Chocolates de mesa tradicionales y golosinas dulces perfectas para elevar tus ventas.',
                bg: 'from-[#B600A8]/10 to-transparent border-[#B600A8]/20',
              },
              {
                emoji: '🥔',
                title: 'Botanas y Fritos',
                desc: 'Papas fritas artesanales y fritos crujientes con el picor exacto que genera reventa.',
                bg: 'from-[#BE4C00]/10 to-transparent border-[#BE4C00]/20',
              },
            ].map((cat, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-[32px] border ${cat.bg} p-6 shadow-[0_8px_30px_rgba(43,27,18,0.02)] hover:shadow-[0_20px_40px_rgba(43,27,18,0.06)] hover:-translate-y-1 transition-all duration-300 group`}
              >
                <div className="text-4xl mb-4 group-hover:scale-105 transition-transform duration-300 select-none">
                  {cat.emoji}
                </div>
                <h3 className="font-anton text-lg sm:text-xl text-[#2B1B12] uppercase tracking-wide mb-2">
                  {cat.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#7A6455] leading-relaxed font-light">
                  {cat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: SIMULADOR DE GANANCIAS */}
      <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-[#FFF6EC] to-[#FFEFDD] border-t border-[#EBD9C3] relative z-10 font-kanit">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 flex flex-col gap-6">
            <span className="text-[#1E9E6A] text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 animate-pulse" /> Multiplica tus ganancias
            </span>
            <h2 className="text-4xl md:text-5xl font-podium uppercase tracking-tight text-[#2B1B12] leading-none">
              El Negocio del Dulce es de Alto Margen
            </h2>
            <p className="text-[#7A6455] text-base font-semibold leading-relaxed">
              Mientras que otros productos básicos te dejan del 5% al 10%, las golosinas y botanas te ofrecen márgenes del <span className="text-[#FF5A5F] font-bold">40% al 65%</span> de ganancia neta.
            </p>
            <div className="flex flex-col gap-4 mt-2 font-light">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-[#1E9E6A]" />
                <p className="text-sm">Precios de mayoreo transparentes y publicados.</p>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-[#1E9E6A]" />
                <p className="text-sm">Margen de ganancia calculado de forma automática en cada dulce.</p>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-[#1E9E6A]" />
                <p className="text-sm">Precio sugerido de reventa para asegurar tu competitividad local.</p>
              </div>
            </div>
            <div className="mt-4">
              <Link 
                href="/catalogo" 
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FF5A5F] hover:bg-[#E0484D] text-white font-bold rounded-full transition-colors text-sm uppercase tracking-wider cursor-pointer"
              >
                Explorar Margen en Catálogo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Tarjeta de ejemplo de factura */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-white border border-[#EBD9C3] rounded-[36px] p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col gap-4">
              <div className="absolute top-0 right-0 bg-[#1E9E6A] text-white text-[10px] font-extrabold px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
                Ejemplo de Producto
              </div>
              
              <div className="flex items-center gap-4 border-b border-[#EBD9C3]/50 pb-4">
                <span className="text-4xl bg-[#FFF6EC] p-3 rounded-2xl select-none">🥔</span>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-[#7A6455] font-semibold">Botanas y Fritos</span>
                  <span className="font-anton text-lg sm:text-xl text-[#2B1B12] uppercase tracking-wide">Papas Crujientes Fuego</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-xs uppercase tracking-widest text-[#7A6455] font-semibold">Precio Mayoreo Anaquelito</span>
                <span className="font-anton text-xl text-[#2B1B12]">$15.00 c/u</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#EBD9C3]/50">
                <span className="text-xs uppercase tracking-widest text-[#7A6455] font-semibold">Precio de Reventa Sugerido</span>
                <span className="font-anton text-xl text-[#7A6455]">$25.00 c/u</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs uppercase tracking-widest text-[#7A6455] font-bold">Tu Margen de Ganancia</span>
                <span className="font-anton text-2xl text-[#1E9E6A] uppercase flex items-center gap-1">
                  <TrendingUp className="h-5 w-5" /> ~66%
                </span>
              </div>

              <div className="mt-2 bg-[#1E9E6A]/5 border border-[#1E9E6A]/20 rounded-xl p-3.5 text-center">
                <p className="text-xs sm:text-sm font-semibold text-[#2B1B12]">
                  ¡Le ganas <span className="text-[#1E9E6A] font-bold">+$10.00 pesos</span> libres a cada bolsa que vendas!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: CÓMO FUNCIONA */}
      <section className="py-24 px-6 md:px-12 bg-[#FFF6EC] border-t border-[#EBD9C3] relative z-10 font-kanit">
        <div className="max-w-6xl mx-auto flex flex-col gap-16">
          <header className="text-center max-w-2xl mx-auto flex flex-col gap-3">
            <span className="text-[#FF5A5F] text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-1.5">
              <Zap className="h-4 w-4" /> Abastecimiento Inteligente
            </span>
            <h2 className="text-4xl md:text-5xl font-podium uppercase tracking-tight text-[#2B1B12] leading-none">
              Surtir tu Tiendita Nunca Fue Tan Rápido
            </h2>
            <p className="text-[#7A6455] text-sm md:text-base font-semibold mt-2">
              Diseñamos un flujo ágil pensado para comerciantes ocupados que no pueden perder tiempo viajando a la central de abastos.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: 'Elige tu Pedido',
                desc: 'Entra al catálogo digital, revisa los márgenes sugeridos en tiempo real y llena tu carrito sin mínimos forzosos.',
                icon: <ShoppingBag className="h-6 w-6 text-[#FF5A5F]" />,
              },
              {
                num: '02',
                title: 'Recibe en tu Local',
                desc: 'Procesamos tu pedido y lo entregamos directo a tu negocio en la CDMX en tiempo récord.',
                icon: <Package className="h-6 w-6 text-[#FF5A5F]" />,
              },
              {
                num: '03',
                title: 'Reordena Escaneando',
                desc: 'Cuando se te acabe un dulce, escanea el código de barras de la bolsa vacía con la cámara de tu celular y agrégalo directo al carrito en segundos.',
                icon: <Camera className="h-6 w-6 text-[#FF5A5F]" />,
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[32px] border border-[#EBD9C3] p-8 flex flex-col gap-4 relative overflow-hidden shadow-sm"
              >
                <div className="absolute top-4 right-6 font-anton text-4xl text-[#EBD9C3]/50 select-none">
                  {step.num}
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#FFF6EC] flex items-center justify-center mb-2">
                  {step.icon}
                </div>
                <h3 className="font-anton text-lg sm:text-xl text-[#2B1B12] uppercase tracking-wide">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#7A6455] leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN PIE DE PÁGINA */}
      <div className="tema-tienda" style={{ minHeight: 'auto' }}>
        {/* PIE DE PÁGINA */}
        <PieDePagina />
      </div>
    </div>
  );
}
