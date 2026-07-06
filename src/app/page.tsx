'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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

export default function Inicio() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pre-cargar imágenes
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

  // Estilos según el rol de la tarjeta
  const obtenerEstiloRol = (rol: string) => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      aspectRatio: '0.6 / 1',
      transition: 'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1)',
      willChange: 'transform, filter, opacity',
    };

    switch (rol) {
      case 'center':
        return {
          ...baseStyle,
          left: '50%',
          transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
          opacity: 1,
          filter: 'blur(0px)',
          zIndex: 20,
          height: isMobile ? '60%' : '92%',
          bottom: isMobile ? '22%' : 0,
        };
      case 'left':
        return {
          ...baseStyle,
          left: isMobile ? '20%' : '30%',
          transform: 'translateX(-50%) scale(1)',
          opacity: 0.85,
          filter: 'blur(2px)',
          zIndex: 10,
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
        };
      case 'right':
        return {
          ...baseStyle,
          left: isMobile ? '80%' : '70%',
          transform: 'translateX(-50%) scale(1)',
          opacity: 0.85,
          filter: 'blur(2px)',
          zIndex: 10,
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
        };
      case 'back':
      default:
        return {
          ...baseStyle,
          left: '50%',
          transform: 'translateX(-50%) scale(1)',
          opacity: 1,
          filter: 'blur(4px)',
          zIndex: 5,
          height: isMobile ? '13%' : '22%',
          bottom: isMobile ? '32%' : '12%',
        };
    }
  };

  return (
    <main 
      style={{ 
        backgroundColor: DULCES[activeIndex].bg, 
        transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: 'var(--font-inter), sans-serif',
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      {/* Capa de textura analógica */}
      <div className="grain-overlay" />

      {/* Marca / Encabezado */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '24px', 
          left: isMobile ? '16px' : '32px', 
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span 
          style={{ 
            fontSize: '12px', 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            color: '#FFFFFF', 
            opacity: 0.9, 
            letterSpacing: '0.18em' 
          }}
        >
          ANAQUELITO
        </span>
      </div>

      {/* Texto Fantasma Gigante Detrás */}
      <div 
        className="font-anton"
        style={{ 
          position: 'absolute', 
          insetInline: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          pointerEvents: 'none', 
          userSelect: 'none', 
          zIndex: 2, 
          top: '18%',
          fontSize: 'clamp(90px, 28vw, 380px)',
          fontWeight: 900,
          color: '#FFFFFF',
          opacity: 0.1,
          lineHeight: 1,
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap'
        }}
      >
        DULCES
      </div>

      {/* Carrusel de Productos */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
        {DULCES.map((dulce, indice) => {
          const rol = obtenerRol(indice);
          const estilo = obtenerEstiloRol(rol);
          return (
            <div key={indice} style={estilo}>
              {/* Imagen del dulce */}
              <img 
                src={dulce.src} 
                alt={dulce.nombre} 
                className="blend-multiply"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain', 
                  objectPosition: 'bottom center',
                  pointerEvents: 'none'
                }} 
                draggable={false}
              />
            </div>
          );
        })}
      </div>

      {/* Navegación y Textos (Abajo Izquierda) */}
      <div 
        style={{ 
          position: 'absolute', 
          bottom: isMobile ? '24px' : '80px', 
          left: isMobile ? '16px' : '96px', 
          zIndex: 60,
          maxWidth: '320px' 
        }}
      >
        <p 
          style={{ 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            letterSpacing: '0.02em', 
            fontSize: isMobile ? '16px' : '22px',
            color: '#FFFFFF', 
            opacity: 0.95,
            marginBottom: isMobile ? '8px' : '12px'
          }}
        >
          {DULCES[activeIndex].nombre}
        </p>
        
        {!isMobile && (
          <p 
            style={{ 
              fontSize: '14px', 
              color: '#FFFFFF', 
              opacity: 0.85, 
              lineHeight: 1.6, 
              marginBottom: '20px' 
            }}
          >
            {DULCES[activeIndex].descripcion}
          </p>
        )}

        {/* Botones de navegación */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => navegar('prev')}
            style={{
              width: isMobile ? '48px' : '64px',
              height: isMobile ? '48px' : '64px',
              borderRadius: '50%',
              border: '2px solid #FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              transition: 'transform 150ms, background-color 150ms'
            }}
            className="hover-scale"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ArrowLeft size={24} strokeWidth={2.25} />
          </button>
          
          <button 
            onClick={() => navegar('next')}
            style={{
              width: isMobile ? '48px' : '64px',
              height: isMobile ? '48px' : '64px',
              borderRadius: '50%',
              border: '2px solid #FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              transition: 'transform 150ms, background-color 150ms'
            }}
            className="hover-scale"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ArrowRight size={24} strokeWidth={2.25} />
          </button>
        </div>
      </div>

      {/* Botón Catálogo (Abajo Derecha) */}
      <div 
        style={{ 
          position: 'absolute', 
          bottom: isMobile ? '24px' : '80px', 
          right: isMobile ? '16px' : '40px', 
          zIndex: 60 
        }}
      >
        <Link 
          href="/catalogo" 
          className="font-anton"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontSize: 'clamp(20px, 4vw, 56px)', 
            fontWeight: 400, 
            color: '#FFFFFF', 
            opacity: 0.95, 
            letterSpacing: '-0.02em', 
            lineHeight: 1, 
            textTransform: 'uppercase',
            transition: 'opacity 200ms'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.95'}
        >
          <span>CATÁLOGO</span>
          <ArrowRight 
            style={{ 
              width: isMobile ? '20px' : '32px', 
              height: isMobile ? '20px' : '32px', 
              strokeWidth: 2.25 
            }} 
          />
        </Link>
      </div>
    </main>
  );
}
