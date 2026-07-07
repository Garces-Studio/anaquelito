'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Menu } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import EnlaceCarrito from './carrito/EnlaceCarrito';
import { crearCliente } from '@/lib/supabase/client';

export default function Encabezado() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [usuario, setUsuario] = useState<User | null>(null);
  
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [oculto, setOculto] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const pathname = usePathname();

  // Animación inicial al montar
  useEffect(() => {
    setMounted(true);
  }, []);

  // Detectar scroll para ajustar opacidad y ocultar/mostrar al bajar/subir
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Fondo transparente o difuminado si pasamos 20px
      setScrolled(currentScrollY > 20);
      
      // Lógica de "Smart Header": se oculta al bajar (para no estorbar), baja al subir
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setOculto(true);
      } else if (currentScrollY < lastScrollY) {
        setOculto(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Autenticación
  useEffect(() => {
    const supabase = crearCliente();
    supabase.auth.getUser().then(({ data }) => setUsuario(data.user));
    const { data: suscripcion } = supabase.auth.onAuthStateChange((_evento, sesion) => {
      setUsuario(sesion?.user ?? null);
    });
    return () => suscripcion.subscription.unsubscribe();
  }, []);

  const enlaceCuenta = usuario
    ? { href: '/dashboard', texto: 'Mi cuenta' }
    : { href: '/iniciar-sesion', texto: 'Iniciar sesión' };

  return (
    <>
      {/* HEADER CONTENEDOR FLOTANTE PREMIUM CON ANIMACIÓN DE ENTRADA Y SCROLL */}
      <header 
        className="fixed top-4 left-0 right-0 z-50 px-4 w-full flex justify-center pointer-events-none select-none"
        style={{
          opacity: mounted && !oculto ? 1 : 0,
          transform: mounted && !oculto ? 'translateY(0)' : 'translateY(-120px)',
          transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
        }}
      >
        <div
          className={`w-full max-w-4xl rounded-full backdrop-blur-xl border px-6 sm:px-8 flex items-center justify-between pointer-events-auto transition-all duration-300 ${
            scrolled 
              ? 'py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.15)] bg-black/60 border-white/10 text-white' 
              : 'py-4 shadow-[0_12px_30px_rgba(0,0,0,0.08)] bg-black/30 border-white/15 text-white'
          }`}
        >
          {/* VISTA MÓVIL */}
          <div className="flex md:hidden items-center justify-between w-full">
            <Link href="/" className="font-titulo font-black text-base tracking-[0.2em] uppercase hover:text-[#FF8A3D] transition-colors duration-200">
              ANAQUELITO
            </Link>
            <div className="flex items-center gap-4">
              {usuario && <EnlaceCarrito />}
              <button
                onClick={() => setMenuOpen(true)}
                className="p-1 cursor-pointer transition-transform duration-150 active:scale-90 text-white hover:text-[#FFB400]"
                aria-label="Abrir menú"
              >
                <Menu size={22} className="text-current" />
              </button>
            </div>
          </div>

          {/* VISTA ESCRITORIO (DISEÑO UNIFICADO PREMIUM, FUENTE PODIUM SHARP) */}
          <div className="hidden md:flex items-center justify-between w-full">
            
            {/* LADO IZQUIERDO: Enlaces de navegación */}
            <nav className="flex gap-8 items-center w-1/3 justify-start font-titulo" aria-label="Menú principal izquierdo">
              <Link
                href="/catalogo"
                className={`font-black text-sm uppercase tracking-wider transition-colors duration-200 ${
                  pathname.startsWith('/catalogo') ? 'text-[#FF5A5F]' : 'text-white/90 hover:text-[#FF5A5F]'
                }`}
              >
                Catálogo
              </Link>
              <Link
                href="/escaner"
                className={`font-black text-sm uppercase tracking-wider transition-colors duration-200 ${
                  pathname.startsWith('/escaner') ? 'text-[#00A699]' : 'text-white/90 hover:text-[#00A699]'
                }`}
              >
                Escáner
              </Link>
            </nav>

            {/* CENTRO: Marca / Logotipo */}
            <div className="flex justify-center items-center w-1/3">
              <Link href="/" className="font-titulo font-black text-lg tracking-[0.25em] uppercase text-center hover:text-[#FF8A3D] hover:scale-105 transition-all duration-300">
                ANAQUELITO
              </Link>
            </div>

            {/* LADO DERECHO: Iniciar sesión / Mi cuenta y Carrito */}
            <div className="flex gap-5 items-center w-1/3 justify-end font-titulo">
              <Link
                href={enlaceCuenta.href}
                className="px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.15em] bg-[#FF5A5F] hover:bg-[#E0484D] hover:scale-105 text-white shadow-[0_0_15px_rgba(255,90,95,0.4)] transition-all duration-300 whitespace-nowrap"
              >
                {enlaceCuenta.texto}
              </Link>
              {usuario && (
                <div className="pl-3 border-l border-white/20 flex items-center">
                  <EnlaceCarrito />
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* MENÚ MÓVIL OVERLAY */}
      <div className={`menu-movil-overlay ${menuOpen ? 'activo' : ''}`} style={{ position: 'fixed', zIndex: 999 }}>
        <div className="menu-movil-cabecera">
          <span className="portada-logo font-titulo font-black tracking-[0.2em] uppercase text-[#FF8A3D]">ANAQUELITO</span>
          <button onClick={() => setMenuOpen(false)} style={{ color: '#FFFFFF' }} aria-label="Cerrar menú" className="cursor-pointer hover:scale-110 transition-transform">
            <X size={28} />
          </button>
        </div>
        <div className="menu-movil-cuerpo font-titulo">
          <Link
            href="/"
            className="menu-movil-enlace font-black uppercase tracking-wider text-xl hover:text-[#FF8A3D]"
            style={{ transitionDelay: '100ms' }}
            onClick={() => setMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link
            href="/catalogo"
            className="menu-movil-enlace font-black uppercase tracking-wider text-xl hover:text-[#FF5A5F]"
            style={{ transitionDelay: '180ms' }}
            onClick={() => setMenuOpen(false)}
          >
            Catálogo
          </Link>
          <Link
            href="/escaner"
            className="menu-movil-enlace font-black uppercase tracking-wider text-xl hover:text-[#00A699]"
            style={{ transitionDelay: '260ms' }}
            onClick={() => setMenuOpen(false)}
          >
            Escáner
          </Link>
          <div className="menu-movil-cta" style={{ transitionDelay: '320ms' }}>
            <Link 
              href={enlaceCuenta.href} 
              className="px-8 py-4 rounded-full font-black uppercase tracking-[0.15em] text-sm bg-[#FF5A5F] text-white shadow-[0_0_20px_rgba(255,90,95,0.5)] hover:scale-105 transition-transform" 
              onClick={() => setMenuOpen(false)}
            >
              <span>{enlaceCuenta.texto}</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
