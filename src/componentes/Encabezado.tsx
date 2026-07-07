'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, X } from 'lucide-react';
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
  const colorTexto = esInicio ? '#FFFFFF' : '#2B1B12';
  const colorEnlaceSuave = esInicio ? 'rgba(255, 255, 255, 0.8)' : '#7A6455';

  return (
    <>
      {/* NAVBAR SUPERIOR */}
      <nav
        className="portada-nav animate-fade-in"
        style={esInicio
          ? { position: 'absolute', background: 'transparent', borderBottom: 'none' }
          : { position: 'sticky', background: '#FFF6EC', borderBottom: '1px solid #EBD9C3', top: 0 }
        }
      >
        <Link href="/" className="portada-logo font-podium" style={{ color: colorTexto }}>
          ANAQUELITO
        </Link>

        {/* Enlaces centrales */}
        <div className="portada-menu-links">
          <Link href="/" className="portada-menu-link" style={{ color: colorEnlaceSuave }}>Inicio</Link>
          <Link href="/catalogo" className="portada-menu-link" style={{ color: colorEnlaceSuave }}>Catálogo</Link>
          <Link href="/escaner" className="portada-menu-link" style={{ color: colorEnlaceSuave }}>Escáner</Link>
        </div>

        {/* Enlace Carrito y cuenta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <EnlaceCarrito />
          {!usuario && (
            <Link href="/crear-cuenta" className="portada-menu-link" style={{ color: colorEnlaceSuave }}>Crear cuenta</Link>
          )}
          <Link 
            href={enlaceCuenta.href} 
            className="portada-nav-cta"
            style={esInicio 
              ? { color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.25)' } 
              : { color: '#FF5A5F', borderColor: '#FF5A5F', background: 'white' }
            }
          >
            <span>{enlaceCuenta.texto}</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Hamburguesa (móvil) */}
        <button
          className="portada-hamburger"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
        >
          <span style={{ backgroundColor: colorTexto }} />
          <span style={{ backgroundColor: colorTexto }} />
          <span style={{ backgroundColor: colorTexto }} />
        </button>
      </nav>

      {/* MENÚ MÓVIL OVERLAY */}
      <div className={`menu-movil-overlay ${menuOpen ? 'activo' : ''}`} style={{ position: 'fixed', zIndex: 999 }}>
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
