'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, X } from 'lucide-react';
import EnlaceCarrito from './carrito/EnlaceCarrito';

export default function Encabezado() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const esInicio = pathname === '/';

  return (
    <>
      {/* NAVBAR SUPERIOR */}
      <nav 
        className="portada-nav animate-fade-in" 
        style={esInicio 
          ? { position: 'absolute', background: 'transparent', borderBottom: 'none' } 
          : { position: 'sticky', background: 'rgba(10, 8, 6, 0.85)', borderBottom: '1px solid rgba(255,255,255,0.1)', top: 0 }
        }
      >
        <Link href="/" className="portada-logo font-podium">
          ANAQUELITO
        </Link>
        
        {/* Enlaces centrales */}
        <div className="portada-menu-links">
          <Link href="/" className="portada-menu-link">Inicio</Link>
          <Link href="/catalogo" className="portada-menu-link">Catálogo</Link>
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
          <div className="menu-movil-cta" style={{ transitionDelay: '340ms' }}>
            <Link href="/catalogo" className="portada-nav-cta" onClick={() => setMenuOpen(false)}>
              <span>Ingresar al negocio</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
