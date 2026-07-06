import React from 'react';

export default function PaginaEscaner() {
  return (
    <div className="container" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '1rem' }}>Escanear Producto</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Usa la cámara de tu celular para escanear el código de barras (UPC) de la bolsa vacía y agregarlo al carrito.
      </p>

      <div style={{
        maxWidth: '400px',
        margin: '0 auto',
        height: '300px',
        background: '#000',
        borderRadius: 'var(--radius-lg)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{
          position: 'absolute',
          width: '80%',
          height: '2px',
          background: 'rgba(255, 90, 95, 0.8)',
          boxShadow: '0 0 10px rgba(255, 90, 95, 1)',
          animation: 'scan 2s linear infinite'
        }}></div>
        {/* Simulación visual de cámara */}
        <span>[Cámara Activada]</span>
        <style>{`
          @keyframes scan {
            0% { top: 10%; }
            50% { top: 90%; }
            100% { top: 10%; }
          }
        `}</style>
      </div>

      <button style={{
        marginTop: '2rem',
        padding: '1rem 2rem',
        background: 'var(--surface-color)',
        border: '2px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        fontWeight: 'bold',
        fontSize: '1rem'
      }} className="hover-scale">
        Ingresar Código Manualmente
      </button>
    </div>
  );
}
