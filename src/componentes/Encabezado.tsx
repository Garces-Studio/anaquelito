'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePanelAccesible } from './usarPanelAccesible';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import EnlaceCarrito from './carrito/EnlaceCarrito';
import { usarCarrito } from './carrito/ContextoCarrito';
import { crearCliente } from '@/lib/supabase/client';

const enlaces = [
  { href: '/', texto: 'Inicio' },
  { href: '/catalogo', texto: 'Productos' },
  { href: '/#como-comprar', texto: 'Cómo comprar' },
];

export default function Encabezado() {
  const [menuOpen, setMenuOpen] = useState(false);
  const panelMenu = useRef<HTMLDivElement>(null);
  const cerrarMenu = useCallback(() => setMenuOpen(false), []);
  usePanelAccesible(menuOpen, panelMenu, cerrarMenu);
  const [usuario, setUsuario] = useState<User | null>(null);
  const [adminUserId, setAdminUserId] = useState<string | null>(null);
  const esAdmin = Boolean(usuario && adminUserId === usuario.id);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { subtotal, totalArticulos } = usarCarrito();

  useEffect(() => {
    const manejarScroll = () => {
      setScrolled(window.scrollY > 18);
    };
    
    window.addEventListener('scroll', manejarScroll, { passive: true });
    return () => window.removeEventListener('scroll', manejarScroll);
  }, []);

  useEffect(() => {
    const supabase = crearCliente();
    supabase.auth.getUser().then(({ data }) => setUsuario(data.user));
    const { data: suscripcion } = supabase.auth.onAuthStateChange((_evento, sesion) => {
      setUsuario(sesion?.user ?? null);
    });
    return () => suscripcion.subscription.unsubscribe();
  }, []);

  // ¿La sesión actual es de un administrador? (RLS solo deja ver la fila propia)
  useEffect(() => {
    if (!usuario) {
      return;
    }
    const supabase = crearCliente();
    supabase
      .from('administradores')
      .select('auth_user_id')
      .eq('auth_user_id', usuario.id)
      .maybeSingle()
      .then(({ data }) => setAdminUserId(data ? usuario.id : null));
  }, [usuario]);

  const enlaceCuenta = usuario
    ? { href: '/dashboard', texto: 'Mi cuenta' }
    : { href: '/iniciar-sesion', texto: 'Entrar' };

  return (
    <>
      <header
        className="fixed left-0 right-0 top-4 z-50 flex w-full justify-center px-4 pointer-events-none"
        style={{
          opacity: 1,
          transform: 'translateY(0)',
          transition: 'opacity 520ms ease, transform 520ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <div
          className={`nav-brillo pointer-events-auto flex w-full max-w-5xl items-center justify-between rounded-full border px-4 py-2.5 backdrop-blur-2xl transition-all duration-300 sm:px-5 ${
            scrolled
              ? 'border-[#EBD9C3] bg-[#FFF6EC]/92 shadow-[0_18px_55px_rgba(43,27,18,0.13)]'
              : 'border-white/65 bg-white/55 shadow-[0_12px_40px_rgba(43,27,18,0.08)]'
          }`}
        >
          <Link href="/" className="logo-encabezado" aria-label="Anaquelito, ir al inicio">
            <Image src="/anaquelito-logo.png" width={600} height={454} sizes="92px" priority alt="Anaquelito" />
          </Link>

          <nav className="hidden items-center gap-2 md:flex" aria-label="Navegación principal">
            {enlaces.map((enlace) => {
              const activo = enlace.href === '/' ? pathname === '/' : enlace.href.startsWith('/#') ? false : pathname.startsWith(enlace.href);
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
            {esAdmin && (
              <Link
                href="/admin"
                className={`rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] transition ${
                  pathname.startsWith('/admin')
                    ? 'bg-[#7621B0] text-white shadow-[0_10px_24px_rgba(118,33,176,0.25)]'
                    : 'text-[#7621B0] hover:bg-[#7621B0]/10'
                }`}
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href={enlaceCuenta.href}
              className="rounded-full border border-[#EBD9C3] bg-white px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#2B1B12] transition hover:border-[#FF5A5F] hover:text-[#FF5A5F]"
              style={{ backgroundColor: '#FFFFFF', color: '#2B1B12' }}
            >
              {enlaceCuenta.texto}
            </Link>
            <span className="flex items-center gap-1 rounded-full border border-[#EBD9C3] bg-white pl-1 text-[#2B1B12]" style={{ backgroundColor: '#FFFFFF', color: '#2B1B12' }}>
              <EnlaceCarrito />
              {totalArticulos > 0 && (
                <span className="pr-3 text-xs font-black tabular-nums text-[#2B1B12]">
                  ${subtotal.toFixed(0)}
                </span>
              )}
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
              aria-expanded={menuOpen}
              aria-controls="menu-principal-movil"
            >
              <Menu size={19} />
            </button>
          </div>
        </div>
      </header>

      <div ref={panelMenu} id="menu-principal-movil" role="dialog" aria-modal={menuOpen || undefined} aria-label="Navegación" aria-hidden={!menuOpen} inert={!menuOpen} className={`fixed inset-0 z-[999] overflow-y-auto bg-[#2B1B12] text-[#FFF6EC] transition duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <Link href="/" onClick={() => setMenuOpen(false)} aria-label="Anaquelito, ir al inicio">
            <Image src="/anaquelito-logo.png" width={600} height={454} sizes="96px" className="h-auto w-24" alt="Anaquelito" />
          </Link>
          <button type="button" onClick={() => setMenuOpen(false)} className="grid h-11 w-11 place-items-center rounded-full border border-white/20" aria-label="Cerrar menú">
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-3 px-5 py-8">
          {[
            ...enlaces,
            ...(esAdmin ? [{ href: '/admin', texto: 'Admin' }] : []),
            { href: enlaceCuenta.href, texto: enlaceCuenta.texto },
          ].map((enlace, index) => (
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
