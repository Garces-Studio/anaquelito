import React from 'react';
import Link from 'next/link';

export default function Inicio() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ 
        padding: '1.5rem', 
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--surface-color)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            background: 'var(--brand-primary)', 
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.25rem'
          }}>
            A
          </div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--brand-primary)' }}>Anaquelito</h1>
        </div>
        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/catalogo" style={{ padding: '0.5rem 1rem', fontWeight: 600 }}>Catálogo</Link>
          <Link href="/escaner" style={{ padding: '0.5rem 1rem', fontWeight: 600 }}>Escanear</Link>
          <button style={{
            padding: '0.5rem 1.25rem',
            background: 'var(--brand-primary)',
            color: 'white',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            boxShadow: 'var(--shadow-sm)'
          }} className="hover-scale">Ingresar</button>
        </nav>
      </header>

      <section style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        textAlign: 'center',
        padding: '4rem 1.5rem',
        background: 'linear-gradient(135deg, var(--bg-color) 0%, var(--surface-color) 100%)'
      }}>
        <div style={{ maxWidth: '800px' }}>
          <span style={{ 
            display: 'inline-block',
            padding: '0.25rem 0.75rem', 
            background: 'rgba(0, 166, 153, 0.1)', 
            color: 'var(--brand-accent)',
            borderRadius: '20px',
            fontWeight: 600,
            marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}>
            🚀 Entregas en 24h para Negocios
          </span>
          <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            El aliado perfecto para <br/>
            <span style={{ color: 'var(--brand-primary)' }}>surtir tu tiendita.</span>
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Olvídate de perder dinero cerrando tu local. Escanea tus productos sin stock, paga a meses sin intereses y recíbelo en tu puerta mañana mismo.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/catalogo" style={{
              padding: '1rem 2rem',
              background: 'var(--brand-primary)',
              color: 'white',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 700,
              fontSize: '1.125rem',
              boxShadow: 'var(--shadow-md)',
              display: 'inline-block'
            }} className="hover-scale hover-glow">
              Ver Catálogo B2B
            </Link>
            <button style={{ 
              padding: '1rem 2rem', 
              background: 'var(--surface-color)', 
              color: 'var(--text-primary)', 
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 600,
              fontSize: '1.125rem'
            }} className="hover-scale">
              ¿Cómo funciona?
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
