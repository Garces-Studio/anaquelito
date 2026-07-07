'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Crown, X, Search } from 'lucide-react';
import Link from 'next/link';
import { crearCliente } from '@/lib/supabase/client';
import BotonAgregar from '@/componentes/carrito/BotonAgregar';
import EnlaceCarrito from '@/componentes/carrito/EnlaceCarrito';
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
  const [menuOpen, setMenuOpen] = useState(false);

  // Estados del catálogo
  const [productos, setProductos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('');
  const [busqueda, setBusqueda] = useState<string>('');

  const supabase = crearCliente();

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

  // Cargar productos desde Supabase
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

  const desplazarACatalogo = (e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.getElementById('catalogo-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
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

        {/* NAVBAR SUPERIOR */}
        <nav className="portada-nav animate-fade-in">
          <Link href="/" className="portada-logo font-podium">
            ANAQUELITO
          </Link>
          
          {/* Enlaces centrales */}
          <div className="portada-menu-links">
            <Link href="/" className="portada-menu-link">Inicio</Link>
            <a href="#catalogo-section" onClick={desplazarACatalogo} className="portada-menu-link">Catálogo</a>
            <Link href="/escaner" className="portada-menu-link">Escáner</Link>
          </div>

          {/* Enlace Carrito e Ingresar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <EnlaceCarrito />
            <Link href="/catalogo" className="portada-nav-cta">
              <span>Ingresar</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Hamburguesa (móvil) */}
          <button 
            className="portada-hamburger" 
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <span />
            <span />
            <span />
          </button>
        </nav>

        {/* MENÚ MÓVIL OVERLAY */}
        <div className={`menu-movil-overlay ${menuOpen ? 'activo' : ''}`}>
          <div className="menu-movil-cabecera">
            <span className="portada-logo font-podium">ANAQUELITO</span>
            <button onClick={() => setMenuOpen(false)} style={{ color: '#FFFFFF' }} aria-label="Cerrar menú">
              <X size={28} />
            </button>
          </div>
          <div className="menu-movil-cuerpo">
            <Link 
              href="/" 
              className="menu-movil-enlace font-podium"
              style={{ transitionDelay: '100ms' }}
              onClick={() => setMenuOpen(false)}
            >
              Inicio
            </Link>
            <a 
              href="#catalogo-section" 
              className="menu-movil-enlace font-podium"
              style={{ transitionDelay: '180ms' }}
              onClick={(e) => { setMenuOpen(false); desplazarACatalogo(e); }}
            >
              Catálogo
            </a>
            <Link 
              href="/escaner" 
              className="menu-movil-enlace font-podium"
              style={{ transitionDelay: '260ms' }}
              onClick={() => setMenuOpen(false)}
            >
              Escáner
            </Link>
            <div className="menu-movil-cta" style={{ transitionDelay: '340ms' }}>
              <Link href="/catalogo" className="portada-nav-cta" onClick={() => setMenuOpen(false)}>
                <span>Ingresar al negocio</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
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
            top: isMobile ? '38%' : '18%',
            fontSize: 'clamp(90px, 28vw, 380px)',
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: 0.06,
            lineHeight: 1,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap'
          }}
        >
          MAYOREO
        </div>

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
              <a href="#catalogo-section" onClick={desplazarACatalogo} className="boton-cta-negro">
                <span>VER CATÁLOGO</span>
                <ArrowUpRight size={14} />
              </a>
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

      {/* SECCIÓN CATÁLOGO (MERCADO MODERNO STYLE) */}
      <div className="tema-tienda" id="catalogo-section" style={{ minHeight: 'auto' }}>
        <section className="contenedor seccion">
          <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}>
            <div>
              <h2 className="seccion-titulo">Catálogo mayorista en vivo</h2>
              <p style={{ color: 'var(--tinta-suave)', marginTop: '0.2rem' }}>
                Precio directo de distribuidor + margen de ganancia sugerido para reventa.
              </p>
            </div>
            
            {/* Buscador reactivo */}
            <div className="buscador" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar dulces, papas, chocolates..."
                style={{
                  padding: '0.75rem 1.25rem 0.75rem 2.6rem',
                  borderRadius: '999px',
                  border: '1.5px solid var(--borde)',
                  outline: 'none',
                  fontSize: '0.95rem',
                  width: '280px',
                  backgroundColor: 'var(--papel)',
                  color: 'var(--tinta)'
                }}
              />
              <Search size={18} style={{ position: 'absolute', left: '0.95rem', color: 'var(--tinta-suave)' }} />
            </div>
          </header>

          {/* Filtros por categorías */}
          <nav className="filtros-categorias" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }} aria-label="Filtrar por categoría">
            <button 
              onClick={() => setCategoriaFiltro('')} 
              className={`chip ${!categoriaFiltro ? 'chip-activo' : ''}`}
            >
              Todo
            </button>
            {['gomitas', 'chocolates', 'frutos_secos', 'semillas', 'dulces', 'fritos'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaFiltro(cat)}
                className={`chip ${categoriaFiltro === cat ? 'chip-activo' : ''}`}
              >
                {EMOJI_CATEGORIA[cat] ?? '🛒'} {NOMBRE_CATEGORIA[cat] ?? cat}
              </button>
            ))}
          </nav>

          {error && (
            <p style={{ color: 'var(--peligro)', padding: '2rem 0', textAlign: 'center' }}>
              No se pudo cargar el catálogo: {error}
            </p>
          )}

          {loading && (
            <p style={{ color: 'var(--tinta-suave)', padding: '4rem 0', textAlign: 'center' }}>
              Cargando catálogo de productos...
            </p>
          )}

          {!loading && productos.length === 0 && (
            <p style={{ color: 'var(--tinta-suave)', padding: '4rem 0', textAlign: 'center' }}>
              No encontramos productos con ese filtro.
            </p>
          )}

          {/* Rejilla de tarjetas de producto */}
          <div className="rejilla-productos">
            {productos.map((producto, i) => {
              const margen = producto.precio_sugerido_reventa
                ? Math.round(
                    ((producto.precio_sugerido_reventa - producto.precio_mayoreo) /
                      producto.precio_mayoreo) * 100
                  )
                : null;

              return (
                <article
                  key={producto.id}
                  className={`tarjeta-producto aparecer ${i < 4 ? `retraso-${i + 1}` : ''}`}
                >
                  <div className="foto" aria-hidden="true" style={{ overflow: 'hidden' }}>
                    {IMAGENES_PRODUCTOS[producto.nombre] ? (
                      <img 
                        src={IMAGENES_PRODUCTOS[producto.nombre]} 
                        alt={producto.nombre} 
                        style={{ 
                          width: '85%', 
                          height: '85%', 
                          objectFit: 'contain',
                          transition: 'transform var(--suave)'
                        }}
                        className="foto-producto-img"
                      />
                    ) : (
                      EMOJI_CATEGORIA[producto.categoria ?? ''] ?? '🛒'
                    )}
                  </div>
                  <h3>{producto.nombre}</h3>
                  <p className="unidad">
                    Por {producto.unidad} · {NOMBRE_CATEGORIA[producto.categoria ?? ''] ?? 'General'}
                  </p>
                  <div className="precios">
                    <span className="precio-mayoreo">
                      ${producto.precio_mayoreo} <small>mayoreo</small>
                    </span>
                    {margen !== null && (
                      <span className="etiqueta-margen">le ganas ~{margen}%</span>
                    )}
                  </div>
                  {producto.precio_sugerido_reventa && (
                    <p className="sugerido" style={{ marginBottom: '1.2rem' }}>
                      Sugerido de reventa: ${producto.precio_sugerido_reventa}
                    </p>
                  )}
                  <BotonAgregar producto={producto} />
                </article>
              );
            })}
          </div>
        </section>

        {/* PIE DE PÁGINA */}
        <PieDePagina />
      </div>
    </div>
  );
}
