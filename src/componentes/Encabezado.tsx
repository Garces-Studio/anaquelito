'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, X, Menu } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import EnlaceCarrito from './carrito/EnlaceCarrito';
import { crearCliente } from '@/lib/supabase/client';

export default function Encabezado() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [usuario, setUsuario] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const esInicio = pathname === '/';

  // Detectar scroll para hacer el encabezado responsivo y dinámico
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Observar el estado de sesión para mostrar "Iniciar sesión" o "Mi cuenta"
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
      {/* HEADER CONTENEDOR FLOTANTE PREMIUM */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4 w-full flex justify-center pointer-events-none select-none">
        <div
          className={`w-full max-w-4xl rounded-full backdrop-blur-md border px-6 sm:px-8 flex items-center justify-between pointer-events-auto transition-all duration-300 ${
            scrolled 
              ? 'py-2 sm:py-2.5 shadow-[0_16px_36px_rgba(43,27,18,0.16)]' 
              : 'py-3 sm:py-4 shadow-[0_12px_30px_rgba(43,27,18,0.08)]'
          } ${
            esInicio
              ? scrolled 
                ? 'bg-black/75 border-white/20 text-white' 
                : 'bg-black/35 border-white/10 text-white'
              : scrolled
                ? 'bg-[#FFF6EC]/95 border-[#EBD9C3] text-[#2B1B12]'
                : 'bg-[#FFF6EC]/80 border-[#EBD9C3]/70 text-[#2B1B12]'
          }`}
        >
          {/* VISTA MÓVIL */}
          <div className="flex md:hidden items-center justify-between w-full">
            <Link href="/" className="font-extrabold text-[15px] sm:text-[17px] tracking-[0.2em] uppercase hover:opacity-85 transition-opacity">
              ANAQUELITO
            </Link>
            <div className="flex items-center gap-4">
              <EnlaceCarrito />
              <button
                onClick={() => setMenuOpen(true)}
                className="p-1 cursor-pointer transition-transform duration-150 active:scale-90"
                aria-label="Abrir menú"
              >
                <Menu size={22} className="text-current" />
              </button>
            </div>
          </div>

          {/* VISTA ESCRITORIO (DISEÑO PILA SPLIT REFINADO Y SÚPER LEGIBLE) */}
          <div className="hidden md:flex items-center justify-between w-full">
            
            {/* LADO IZQUIERDO: Enlaces de navegación */}
            <nav className="flex gap-2 items-center w-1/3 justify-start" aria-label="Menú principal izquierdo">
              <Link
                href="/catalogo"
                className={`font-extrabold text-[13px] uppercase tracking-widest px-4 py-1.5 rounded-full transition-all duration-200 ${
                  pathname.startsWith('/catalogo')
                    ? esInicio 
                      ? 'bg-white/15 text-white' 
                      : 'bg-[#FF5A5F]/10 text-[#FF5A5F]'
                    : esInicio 
                      ? 'text-white/80 hover:text-white hover:bg-white/10' 
                      : 'text-[#7A6455] hover:text-[#2B1B12] hover:bg-[#2B1B12]/5'
                }`}
              >
                Catálogo
              </Link>
              <Link
                href="/escaner"
                className={`font-extrabold text-[13px] uppercase tracking-widest px-4 py-1.5 rounded-full transition-all duration-200 ${
                  pathname.startsWith('/escaner')
                    ? esInicio 
                      ? 'bg-white/15 text-white' 
                      : 'bg-[#FF5A5F]/10 text-[#FF5A5F]'
                    : esInicio 
                      ? 'text-white/80 hover:text-white hover:bg-white/10' 
                      : 'text-[#7A6455] hover:text-[#2B1B12] hover:bg-[#2B1B12]/5'
                }`}
              >
                Escáner
              </Link>
            </nav>

            {/* CENTRO: Marca / Logotipo con tracking espaciado elegante */}
            <div className="flex justify-center items-center w-1/3">
              <Link href="/" className="font-black text-[17px] tracking-[0.25em] uppercase text-center hover:scale-105 transition-transform duration-300">
                ANAQUELITO
              </Link>
            </div>

            {/* LADO DERECHO: Acciones, Carrito y Registro */}
            <div className="flex gap-4 items-center w-1/3 justify-end">
              {!usuario && (
                <Link
                  href="/crear-cuenta"
                  className={`font-extrabold text-[13px] uppercase tracking-widest px-4 py-1.5 rounded-full transition-all duration-200 ${
                    pathname.startsWith('/crear-cuenta')
                      ? esInicio 
                        ? 'bg-white/15 text-white' 
                        : 'bg-[#FF5A5F]/10 text-[#FF5A5F]'
                      : esInicio 
                        ? 'text-white/80 hover:text-white hover:bg-white/10' 
                        : 'text-[#7A6455] hover:text-[#2B1B12] hover:bg-[#2B1B12]/5'
                  }`}
                >
                  Registrarse
                </Link>
              )}
              <Link
                href={enlaceCuenta.href}
                className={`font-extrabold text-[12px] uppercase tracking-widest border-2 px-5 py-2 rounded-full transition-all duration-250 ${
                  esInicio
                    ? 'border-white/30 bg-white/5 hover:bg-white text-white hover:text-[#2B1B12]'
                    : 'border-[#FF5A5F] text-[#FF5A5F] hover:bg-[#FF5A5F] hover:text-white'
                }`}
              >
                {enlaceCuenta.texto}
              </Link>
              <div className="pl-2 border-l border-current/15 flex items-center">
                <EnlaceCarrito />
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* MENÚ MÓVIL OVERLAY */}
      <div className={`menu-movil-overlay ${menuOpen ? 'activo' : ''}`} style={{ position: 'fixed', zIndex: 999 }}>
        <div className="menu-movil-cabecera">
          <span className="portada-logo font-podium tracking-[0.2em]">ANAQUELITO</span>
          <button onClick={() => setMenuOpen(false)} style={{ color: '#FFFFFF' }} aria-label="Cerrar menú" className="cursor-pointer">
            <X size={28} />
          </button>
        </div>
        <div className="menu-movil-cuerpo">
          <Link
            href="/"
            className="menu-movil-enlace font-extrabold uppercase tracking-wider text-xl"
            style={{ transitionDelay: '100ms' }}
            onClick={() => setMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link
            href="/catalogo"
            className="menu-movil-enlace font-extrabold uppercase tracking-wider text-xl"
            style={{ transitionDelay: '180ms' }}
            onClick={() => setMenuOpen(false)}
          >
            Catálogo
          </Link>
          <Link
            href="/escaner"
            className="menu-movil-enlace font-extrabold uppercase tracking-wider text-xl"
            style={{ transitionDelay: '260ms' }}
            onClick={() => setMenuOpen(false)}
          >
            Escáner
          </Link>
          {!usuario && (
            <Link
              href="/crear-cuenta"
              className="menu-movil-enlace font-extrabold uppercase tracking-wider text-xl"
              style={{ transitionDelay: '320ms' }}
              onClick={() => setMenuOpen(false)}
            >
              Crear cuenta
            </Link>
          )}
          <div className="menu-movil-cta" style={{ transitionDelay: '340ms' }}>
            <Link href={enlaceCuenta.href} className="portada-nav-cta font-bold uppercase tracking-wider text-sm" onClick={() => setMenuOpen(false)}>
              <span>{enlaceCuenta.texto}</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
