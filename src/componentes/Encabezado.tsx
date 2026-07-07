'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ScanLine, X } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import EnlaceCarrito from './carrito/EnlaceCarrito';
import { crearCliente } from '@/lib/supabase/client';

const enlaces = [
  { href: '/catalogo', texto: 'Catálogo' },
  { href: '/escaner', texto: 'Escáner' },
];

export default function Encabezado() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [usuario, setUsuario] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [oculto, setOculto] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const manejarScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 18);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setOculto(true);
      } else if (currentScrollY < lastScrollY) {
        setOculto(false);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    manejarScroll();
    window.addEventListener('scroll', manejarScroll, { passive: true });
    return () => window.removeEventListener('scroll', manejarScroll);
  }, [lastScrollY]);

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
    : { href: '/iniciar-sesion', texto: 'Entrar' };

  return (
    <>
      <header
        className="fixed left-0 right-0 top-4 z-50 flex w-full justify-center px-4 pointer-events-none"
        style={{
          opacity: mounted && !oculto ? 1 : 0,
          transform: mounted && !oculto ? 'translateY(0)' : 'translateY(-120px)',
          transition: 'opacity 520ms ease, transform 520ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <div
          className={`pointer-events-auto flex w-full max-w-5xl items-center justify-between rounded-full border px-4 py-2.5 backdrop-blur-2xl transition-all duration-300 sm:px-5 ${
            scrolled
              ? 'border-[#EBD9C3] bg-[#FFF6EC]/92 shadow-[0_18px_55px_rgba(43,27,18,0.13)]'
              : 'border-white/65 bg-white/55 shadow-[0_12px_40px_rgba(43,27,18,0.08)]'
          }`}
        >
          <Link href="/" className="flex items-center gap-2 rounded-full pr-2" style={{ color: '#2B1B12' }}>
            <span className="grid h-9 w-9 place-items-center rounded-full shadow-[0_10px_24px_rgba(255,90,95,0.28)]" style={{ backgroundColor: '#FF5A5F', color: '#FFFFFF' }}>
              <ScanLine size={17} />
            </span>
            <span className="font-titulo text-sm font-black uppercase tracking-[0.2em] sm:text-base">Anaquelito</span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex" aria-label="Navegación principal">
            {enlaces.map((enlace) => {
              const activo = pathname.startsWith(enlace.href);
              return (
                <Link
                  key={enlace.href}
                  href={enlace.href}
                  className={`rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] transition ${
                    activo
                      ? 'bg-[#2B1B12] text-white shadow-[0_10px_24px_rgba(43,27,18,0.14)]'
                      : 'text-[#6B5546] hover:bg-[#FFEFDD] hover:text-[#2B1B12]'
                  }`}
                  style={activo ? { backgroundColor: '#2B1B12', color: '#FFFFFF' } : { color: '#6B5546' }}
                >
                  {enlace.texto}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href={enlaceCuenta.href}
              className="rounded-full border border-[#EBD9C3] bg-white px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#2B1B12] transition hover:border-[#FF5A5F] hover:text-[#FF5A5F]"
              style={{ backgroundColor: '#FFFFFF', color: '#2B1B12' }}
            >
              {enlaceCuenta.texto}
            </Link>
            <span className="grid h-10 w-10 place-items-center rounded-full border border-[#EBD9C3] bg-white text-[#2B1B12]" style={{ backgroundColor: '#FFFFFF', color: '#2B1B12' }}>
              <EnlaceCarrito />
            </span>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-[#EBD9C3] bg-white text-[#2B1B12]" style={{ backgroundColor: '#FFFFFF', color: '#2B1B12' }}>
              <EnlaceCarrito />
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full bg-[#2B1B12] text-white"
              style={{ backgroundColor: '#2B1B12', color: '#FFFFFF' }}
              aria-label="Abrir menú"
            >
              <Menu size={19} />
            </button>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-[999] bg-[#2B1B12] text-[#FFF6EC] transition duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <span className="font-titulo text-lg font-black uppercase tracking-[0.22em] text-[#FFB400]">Anaquelito</span>
          <button type="button" onClick={() => setMenuOpen(false)} className="grid h-11 w-11 place-items-center rounded-full border border-white/20" aria-label="Cerrar menú">
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-3 px-5 py-8">
          {[{ href: '/', texto: 'Inicio' }, ...enlaces, { href: enlaceCuenta.href, texto: enlaceCuenta.texto }].map((enlace, index) => (
            <Link
              key={`${enlace.href}-${enlace.texto}`}
              href={enlace.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-5 py-5 text-3xl font-black uppercase leading-none tracking-normal transition hover:bg-white/[0.08]"
              style={{ transitionDelay: `${index * 45}ms` }}
            >
              {enlace.texto}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
