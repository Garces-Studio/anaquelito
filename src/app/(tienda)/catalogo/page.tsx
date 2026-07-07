'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * Catálogo — Hero inmersivo tipo "TOONHUB": un carrusel de figuritas a pantalla
 * completa. Se conservan las imágenes de dulces del proyecto; el resto del diseño
 * es nuevo. Se muestra sin encabezado ni pie (ver (tienda)/layout.tsx).
 *
 * Tipografías: cuerpo en Inter (--font-inter), display en Anton (--font-anton),
 * ambas ya cargadas en el layout raíz.
 */

const IMAGES = [
  { src: '/papas.png', bg: '#F4845F', panel: '#F79B7F' },
  { src: '/mazapan.png', bg: '#E8C07D', panel: '#EED6AD' },
  { src: '/gomitas.png', bg: '#6BBF7A', panel: '#85CC92' },
  { src: '/paleta.png', bg: '#E882B4', panel: '#ED9DC4' },
];

// Ruido analógico (grano) como data URI para la capa superior.
const GRANO =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E\")";

type Rol = 'center' | 'left' | 'right' | 'back';

export default function PaginaCatalogo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar móvil (< 640px) y mantenerlo al redimensionar.
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Precargar las 4 imágenes al montar.
  useEffect(() => {
    IMAGES.forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });
  }, []);

  const navigate = (direccion: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) =>
      direccion === 'next' ? (prev + 1) % 4 : (prev + 3) % 4
    );
    setTimeout(() => setIsAnimating(false), 650);
  };

  // Rol de cada figura según la posición activa.
  const obtenerRol = (indice: number): Rol => {
    if (indice === activeIndex) return 'center';
    if (indice === (activeIndex + 3) % 4) return 'left';
    if (indice === (activeIndex + 1) % 4) return 'right';
    return 'back';
  };

  const estiloPorRol = (rol: Rol): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      aspectRatio: '0.6 / 1',
      transition:
        'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1), background-color 650ms cubic-bezier(0.4,0,0.2,1)',
      willChange: 'transform, filter, opacity',
      // El transform aísla el multiply de la imagen; le damos un fondo del MISMO
      // color de la página para que el multiply funda el blanco de la foto contra
      // ese color y el rectángulo quede invisible (coincide con el fondo).
      backgroundColor: IMAGES[activeIndex].bg,
    };

    switch (rol) {
      case 'center':
        return {
          ...base,
          transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: 20,
          left: '50%',
          height: isMobile ? '60%' : '92%',
          bottom: isMobile ? '22%' : 0,
        };
      case 'left':
        return {
          ...base,
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '20%' : '30%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
        };
      case 'right':
        return {
          ...base,
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '80%' : '70%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
        };
      case 'back':
      default:
        return {
          ...base,
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(4px)',
          opacity: 1,
          zIndex: 5,
          left: '50%',
          height: isMobile ? '13%' : '22%',
          bottom: isMobile ? '32%' : '12%',
        };
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)',
        fontFamily: 'var(--font-inter), sans-serif',
      }}
    >
      <div className="relative w-full" style={{ height: '100vh', overflow: 'hidden' }}>
        {/* 1. Capa de grano */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            opacity: 0.4,
            backgroundImage: GRANO,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* 2. Texto fantasma gigante */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            zIndex: 2,
            top: '18%',
            fontFamily: 'var(--font-anton), sans-serif',
            fontSize: 'clamp(90px, 28vw, 380px)',
            fontWeight: 900,
            color: '#FFFFFF',
            // Se atenúa (marca de agua) para que las fotos de dulces con fondo
            // blanco + multiply se fundan limpio y no dejen recuadro sobre las letras.
            opacity: 0.16,
            lineHeight: 1,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          3D SHAPE
        </div>

        {/* 3. Marca superior izquierda */}
        <Link
          href="/"
          className="absolute top-6 left-4 sm:left-8 text-xs font-semibold uppercase"
          style={{
            zIndex: 60,
            color: '#FFFFFF',
            opacity: 0.9,
            letterSpacing: '0.18em',
          }}
        >
          TOONHUB
        </Link>

        {/* 4. Carrusel de figuras */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {IMAGES.map((item, indice) => (
            <div key={indice} style={estiloPorRol(obtenerRol(indice))}>
              <img
                src={item.src}
                alt=""
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'bottom center',
                  // Las imágenes de dulces son fotos con fondo blanco; multiply lo
                  // funde con el color de fondo (igual que la portada).
                  mixBlendMode: 'multiply',
                  filter: 'contrast(1.05) saturate(1.1)',
                }}
              />
            </div>
          ))}
        </div>

        {/* 5. Texto inferior izquierdo + botones de navegación */}
        <div
          className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24"
          style={{ zIndex: 60, maxWidth: 320 }}
        >
          <p
            className="font-bold uppercase tracking-widest mb-2 sm:mb-3 text-base sm:text-[22px]"
            style={{ color: '#FFFFFF', opacity: 0.95, letterSpacing: '0.02em' }}
          >
            TOONHUB FIGURINES
          </p>
          <p
            className="hidden sm:block text-xs sm:text-sm mb-4 sm:mb-5"
            style={{ color: '#FFFFFF', opacity: 0.85, lineHeight: 1.6 }}
          >
            The artwork is stunning, shipped fully prepared. The finish is a vision,
            the 3D craft is flawless. Many thanks! Wishing you the win. Order now.
          </p>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate('prev')}
              aria-label="Anterior"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-[transform,background-color] duration-150 hover:scale-[1.08] hover:bg-white/[0.12]"
              style={{ backgroundColor: 'transparent', border: '2px solid #FFFFFF', color: '#FFFFFF' }}
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>
            <button
              type="button"
              onClick={() => navigate('next')}
              aria-label="Siguiente"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-[transform,background-color] duration-150 hover:scale-[1.08] hover:bg-white/[0.12]"
              style={{ backgroundColor: 'transparent', border: '2px solid #FFFFFF', color: '#FFFFFF' }}
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* 6. Enlace inferior derecho */}
        <a
          href="#"
          className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10 flex items-center group"
          style={{
            zIndex: 60,
            fontFamily: 'var(--font-anton), sans-serif',
            fontSize: 'clamp(20px, 4vw, 56px)',
            fontWeight: 400,
            color: '#FFFFFF',
            opacity: 0.95,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'opacity 200ms',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.95')}
        >
          DISCOVER IT
          <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={2.25} />
        </a>
      </div>
    </div>
  );
}
