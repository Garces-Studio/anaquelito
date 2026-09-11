'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Boxes, Camera, CheckCircle2, Crown, PackageCheck, PartyPopper, Sparkles, Store, TrendingUp, Truck } from 'lucide-react';

const ESCENAS = [
  { nombre: 'Gomilocas Pingüinos', descripcion: 'Bolsa de gomitas Ricolino para mostrador, dulcería, eventos y reventa.', src: '/productos/gomita-pinguino.png', color: '#eb168a' },
  { nombre: 'Gomilocas Dientes', descripcion: 'Una presentación llamativa para darle variedad y color a tu anaquel.', src: '/productos/gomita-diente.png', color: '#08aeda' },
  { nombre: 'Panditas Clásicos', descripcion: 'El formato de un kilogramo de una gomita reconocida por el consumidor.', src: '/productos/gomita-oso.png', color: '#20a83a' },
  { nombre: 'Gomilocas Lombrices', descripcion: 'Surtido de figuras y sabores en una presentación pensada para reventa.', src: '/productos/gomita-lombriz.png', color: '#a40ab7' },
  { nombre: 'Gomilocas Huevitos', descripcion: 'Gomitas en forma de huevito para complementar un surtido más divertido.', src: '/productos/huevito-pinto.png', color: '#ed1688' },
  { nombre: 'Bubulubu Ice', descripcion: 'Caja de 300 piezas para negocios que quieren comprar por volumen.', src: '/productos/bubulubu-ice.png', color: '#078ee8' },
];

export default function HomeExperiencia() {
  const [activo, setActivo] = useState(0);
  const [moviendo, setMoviendo] = useState(false);
  const superficie = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const raiz = superficie.current;
    if (!raiz) return;
    const media = matchMedia('(min-width: 769px) and (prefers-reduced-motion: no-preference)');
    const actualizarVideo = () => {
      const elemento = video.current;
      if (!elemento) return;
      const visible = elemento.parentElement?.dataset.visible === 'true' && !document.hidden;
      if (media.matches && visible) {
        if (!elemento.getAttribute('src')) elemento.src = '/dulces-loop.mp4';
        void elemento.play().catch(() => undefined);
      } else elemento.pause();
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { (entry.target as HTMLElement).dataset.visible = String(entry.isIntersecting); });
      actualizarVideo();
    });
    raiz.querySelectorAll('section').forEach(section => observer.observe(section));
    document.addEventListener('visibilitychange', actualizarVideo);
    media.addEventListener('change', actualizarVideo);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', actualizarVideo); media.removeEventListener('change', actualizarVideo); };
  }, []);

  const navegar = (paso: number) => {
    if (moviendo) return;
    setMoviendo(true);
    setActivo((actual) => (actual + paso + ESCENAS.length) % ESCENAS.length);
    window.setTimeout(() => setMoviendo(false), 650);
  };

  const rol = (indice: number) => {
    const distancia = (indice - activo + ESCENAS.length) % ESCENAS.length;
    if (distancia === 0) return 'centro';
    if (distancia === 1) return 'derecha';
    if (distancia === ESCENAS.length - 1) return 'izquierda';
    return 'fondo';
  };

  return (
    <main ref={superficie} id="contenido" className="home-vivo">
      <section className="home-hero" style={{ '--color-escena': ESCENAS[activo].color } as CSSProperties}>
        <video ref={video} className="video-background" preload="none" muted loop playsInline aria-hidden="true" />
        <div className="home-hero-sombra" />
        <div className="grain-overlay" />
        <div className="portada-grid">
          <div className="portada-col-info">
            <p className="tagline-hero animate-fade-up"><Crown size={15} /> El aliado de tu negocio</p>
            <h1 className="titulo-hero animate-fade-up-delay-1"><span className="titulo-linea">SURTE.</span><span className="titulo-linea home-titulo-color">VENDE.</span><span className="titulo-linea">CRECE.</span></h1>
            <p className="subtexto-hero animate-fade-up-delay-2">Dulces y botanas al mayoreo para tienditas, dulcerías, eventos y personas que quieren revender sin complicarse.</p>
            <div className="fila-cta-hero animate-fade-up-delay-3">
              <Link href="/catalogo" className="home-cta-principal">Ver productos <ArrowUpRight size={17} /></Link>
              <Link href="/#como-comprar" className="boton-cta-cristal">Cómo comprar <ArrowRight size={17} /></Link>
            </div>
            <div className="home-promesas animate-fade-up-delay-4">
              <span><Boxes size={18} /> Compra por caja</span><span><Store size={18} /> Pensado para negocio</span><span><Truck size={18} /> Entrega por confirmar</span>
            </div>
          </div>

          <div className="portada-col-carrusel animate-fade-in-delay" aria-roledescription="carrusel" aria-label="Ventajas de Anaquelito">
            <div className="home-halo" />
            {ESCENAS.map((escena, indice) => (
              <div className={`home-producto home-producto--${rol(indice)}`} key={escena.nombre} aria-hidden={indice !== activo}>
                <Image src={escena.src} alt="" fill sizes="(max-width: 768px) 60vw, 32vw" priority={indice === 0} />
              </div>
            ))}
            <div className="controles-carrusel-premium" aria-live="polite">
              <div className="info-producto-carrusel"><strong className="nombre-producto-carrusel">{ESCENAS[activo].nombre}</strong><span className="desc-producto-carrusel">{ESCENAS[activo].descripcion}</span></div>
              <div className="botones-carrusel-premium"><button type="button" onClick={() => navegar(-1)} className="boton-carrusel-premium" aria-label="Anterior"><ArrowLeft size={18} /></button><button type="button" onClick={() => navegar(1)} className="boton-carrusel-premium" aria-label="Siguiente"><ArrowRight size={18} /></button></div>
            </div>
          </div>
        </div>
        <a href="#por-que" className="home-bajar">Descubre Anaquelito <span>↓</span></a>
      </section>

      <section id="por-que" className="home-seccion home-intro">
        <div className="home-contenedor home-intro-grid">
          <div><p className="home-ceja"><Sparkles size={16} /> Del proveedor a tu anaquel</p><h2>No necesitas un catálogo infinito. Necesitas producto que se venda.</h2></div>
          <div className="home-intro-copy"><p>Anaquelito nace para hacer más fácil el resurtido de negocios pequeños: una selección concreta, información clara y una compra que puedas resolver desde el celular.</p><Link href="/#como-comprar">Conoce nuestra forma de vender <ArrowUpRight size={18} /></Link></div>
        </div>
        <div className="home-marquesina"><div>GOMITAS · DULCES · BOTANAS · MAYOREO · REVENTA · TIENDITAS · GOMITAS · DULCES · BOTANAS · MAYOREO · REVENTA · TIENDITAS ·</div></div>
      </section>

      <section className="home-seccion home-ruta" id="como-comprar">
        <div className="home-contenedor"><p className="home-ceja"><TrendingUp size={16} /> Compra con intención</p><h2>Todo lo importante, en su lugar.</h2>
          <div className="home-ruta-grid">
            <Link href="/catalogo" className="home-ruta-card home-ruta-card--coral"><span>01</span><Store size={35} /><h3>Productos</h3><p>Encuentra tu siguiente surtido con presentación, disponibilidad y precio en un solo lugar.</p><b>Ir al catálogo →</b></Link>
            <Link href="/mayoreo" className="home-ruta-card home-ruta-card--amarillo"><span>02</span><PackageCheck size={35} /><h3>Cómo comprar</h3><p>1. Elige productos. 2. Agrega las cajas. 3. Confirma entrega y pago. 4. Recibe tu pedido.</p><b>Ver cómo funciona →</b></Link>
            <Link href="/catalogo" className="home-ruta-card home-ruta-card--teal"><span>03</span><PartyPopper size={35} /><h3>Eventos</h3><p>Compra por volumen para fiestas, mesas de dulces y ocasiones especiales, sujeto a disponibilidad.</p><b>Ver productos →</b></Link>
          </div>
        </div>
      </section>

      <section className="home-seccion home-historia">
        <div className="home-contenedor home-historia-grid">
          <div className="home-historia-numero">3</div>
          <div><p className="home-ceja"><Camera size={16} /> Una compra sencilla</p><h2>Elige. Confirma. Recibe.</h2><p>El catálogo te ayuda a decidir; la sección de mayoreo explica las condiciones; y tu cuenta conservará tus pedidos para que resurtir sea cada vez más rápido.</p></div>
          <ul><li><CheckCircle2 /> Datos reales, sin inventar precios</li><li><CheckCircle2 /> Atención antes de cerrar el pedido</li><li><CheckCircle2 /> Experiencia diseñada para celular</li></ul>
        </div>
      </section>

      <section className="home-cierre"><div className="grain-overlay" /><div className="home-contenedor"><p>Tu negocio no puede esperar.</p><h2>Que no se quede vacío<br />tu anaquel.</h2><Link href="/catalogo">Explorar productos <ArrowUpRight /></Link></div></section>
    </main>
  );
}
