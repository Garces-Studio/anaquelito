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
  const pathname = usePathname();
  const esInicio = pathname === '/';

  // Se observa el estado de sesión para mostrar "Iniciar sesión" o "Mi cuenta"
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
      {/* HEADER CONTENEDOR FLOTANTE */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4 w-full flex justify-center pointer-events-none select-none">
        <div
          className={`w-full max-w-4xl rounded-full backdrop-blur-md border px-6 py-2.5 sm:py-3.5 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 pointer-events-auto ${
            esInicio
              ? 'bg-white/10 border-white/20 text-white'
              : 'bg-[#FFF6EC]/85 border-[#EBD9C3] text-[#2B1B12]'
          }`}
        >
          {/* VISTA MÓVIL */}
          <div className="flex md:hidden items-center justify-between w-full">
            <Link href="/" className="font-podium text-base tracking-widest font-black uppercase hover:opacity-80 transition-opacity">
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

          {/* VISTA ESCRITORIO (DISEÑO PILA SPLIT DE LA IMAGEN) */}
          <div className="hidden md:flex items-center justify-between w-full">
            {/* LADO IZQUIERDO: Enlaces de navegación */}
            <nav className="flex gap-8 justify-start items-center w-1/3" aria-label="Menú principal izquierdo">
              <Link
                href="/catalogo"
                className={`font-bold text-[11px] uppercase tracking-widest transition-colors duration-200 ${
                  esInicio ? 'text-white/80 hover:text-white' : 'text-[#7A6455] hover:text-[#FF5A5F]'
                }`}
              >
                Catálogo
              </Link>
              <Link
                href="/escaner"
                className={`font-bold text-[11px] uppercase tracking-widest transition-colors duration-200 ${
                  esInicio ? 'text-white/80 hover:text-white' : 'text-[#7A6455] hover:text-[#FF5A5F]'
                }`}
              >
                Escáner
              </Link>
            </nav>

            {/* CENTRO: Marca / Logotipo */}
            <div className="flex justify-center items-center w-1/3">
              <Link href="/" className="font-podium text-xl tracking-widest font-black uppercase text-center hover:scale-105 transition-transform duration-300">
                ANAQUELITO
              </Link>
            </div>

            {/* LADO DERECHO: Carrito, Registro e Inicio de sesión */}
            <div className="flex gap-6 justify-end items-center w-1/3">
              {!usuario && (
                <Link
                  href="/crear-cuenta"
                  className={`font-bold text-[11px] uppercase tracking-widest transition-colors duration-200 ${
                    esInicio ? 'text-white/80 hover:text-white' : 'text-[#7A6455] hover:text-[#FF5A5F]'
                  }`}
                >
                  Registrarse
                </Link>
              )}
              <Link
                href={enlaceCuenta.href}
                className={`font-bold text-[10px] uppercase tracking-widest border-2 px-5 py-2 rounded-full transition-all duration-250 ${
                  esInicio
                    ? 'border-white/20 bg-white/5 hover:bg-white text-white hover:text-[#2B1B12]'
                    : 'border-[#FF5A5F] text-[#FF5A5F] hover:bg-[#FF5A5F] hover:text-white'
                }`}
              >
                {enlaceCuenta.texto}
              </Link>
              <EnlaceCarrito />
            </div>
          </div>
        </div>
      </header>

      {/* MENÚ MÓVIL OVERLAY */}
      <div className={`menu-movil-overlay ${menuOpen ? 'activo' : ''}`} style={{ position: 'fixed', zIndex: 999 }}>
        <div className="menu-movil-cabecera">
          <span className="portada-logo font-podium">ANAQUELITO</span>
          <button onClick={() => setMenuOpen(false)} style={{ color: '#FFFFFF' }} aria-label="Cerrar menú" className="cursor-pointer">
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
          <Link
            href="/catalogo"
            className="menu-movil-enlace font-podium"
            style={{ transitionDelay: '180ms' }}
            onClick={() => setMenuOpen(false)}
          >
            Catálogo
          </Link>
          <Link
            href="/escaner"
            className="menu-movil-enlace font-podium"
            style={{ transitionDelay: '260ms' }}
            onClick={() => setMenuOpen(false)}
          >
            Escáner
          </Link>
          {!usuario && (
            <Link
              href="/crear-cuenta"
              className="menu-movil-enlace font-podium"
              style={{ transitionDelay: '320ms' }}
              onClick={() => setMenuOpen(false)}
            >
              Crear cuenta
            </Link>
          )}
          <div className="menu-movil-cta" style={{ transitionDelay: '340ms' }}>
            <Link href={enlaceCuenta.href} className="portada-nav-cta" onClick={() => setMenuOpen(false)}>
              <span>{enlaceCuenta.texto}</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
