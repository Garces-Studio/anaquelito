import React from 'react';
import { crearCliente } from '@/lib/supabase/server';

export default async function PaginaCatalogo() {
  const supabase = await crearCliente();
  const { data: productos, error } = await supabase
    .from('productos')
    .select('id, nombre, categoria, unidad, precio_mayoreo')
    .eq('activo', true)
    .order('creado_en', { ascending: true });

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Catálogo Mayorista</h2>
        <input
          type="search"
          placeholder="Buscar botanas, dulces, SKUs..."
          style={{
            padding: '0.75rem 1rem',
            width: '300px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            background: 'var(--surface-color)',
            color: 'var(--text-primary)'
          }}
        />
      </header>

      {error && (
        <p style={{ color: 'var(--danger)' }}>
          No se pudo cargar el catálogo: {error.message}
        </p>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {productos?.map((producto) => (
          <div key={producto.id} style={{
            background: 'var(--surface-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-color)'
          }} className="hover-scale">
            <div style={{
              height: '150px',
              background: 'var(--surface-hover)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1rem'
            }}></div>
            <h3 style={{ fontSize: '1.125rem' }}>{producto.nombre}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              Por {producto.unidad} (Mayoreo)
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--brand-primary)' }}>
                ${producto.precio_mayoreo}
              </span>
              <button style={{
                background: 'var(--brand-primary)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 'bold'
              }} className="hover-glow">
                + Carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
