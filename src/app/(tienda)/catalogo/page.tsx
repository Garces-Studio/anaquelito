'use client';

import React, { useState, useEffect } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { crearCliente } from '@/lib/supabase/client';
import BotonAgregar from '@/componentes/carrito/BotonAgregar';

// Category metadata
const EMOJI_CATEGORIA: Record<string, string> = {
  frutos_secos: '🥜',
  gomitas: '🍬',
  chocolates: '🍫',
  semillas: '🌻',
  dulces: '🍭',
  fritos: '🥔',
};

const NOMBRE_CATEGORIA: Record<string, string> = {
  frutos_secos: 'Frutos secos',
  gomitas: 'Gomitas',
  chocolates: 'Chocolates',
  semillas: 'Semillas',
  dulces: 'Dulces',
  fritos: 'Fritos',
};

const IMAGENES_PRODUCTOS: Record<string, string> = {
  'Cacahuate Japonés': '/cacahuate.png',
  'Gomitas Surtidas': '/gomitas.png',
  'Chocolate de Mesa': '/chocolate.png',
  'Semillas Enchiladas': '/semillas.png',
  'Palomitas Acarameladas': '/palomitas.png',
  'Papas Fritas Caseras': '/papas.png',
};

export default function PaginaCatalogo() {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('');
  const [busqueda, setBusqueda] = useState<string>('');

  const supabase = crearCliente();

  // Load products dynamically on filter/search change
  useEffect(() => {
    async function cargarProductos() {
      setLoading(true);
      try {
        let query = supabase
          .from('productos')
          .select('id, nombre, categoria, unidad, precio_mayoreo, precio_sugerido_reventa')
          .eq('activo', true)
          .order('creado_en', { ascending: true });

        if (categoriaFiltro) {
          query = query.eq('categoria', categoriaFiltro);
        }
        if (busqueda) {
          query = query.ilike('nombre', `%${busqueda}%`);
        }

        const { data, error: err } = await query;
        if (err) throw err;
        setProductos(data || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    cargarProductos();
  }, [categoriaFiltro, busqueda]);

  return (
    <div className="bg-[#0a0a0a] text-white font-inter antialiased min-h-screen">
      <section id="productos-catalogo" className="px-4 sm:px-6 md:px-10 lg:px-14 py-16 bg-[#0a0a0a] min-h-screen">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          
          {/* Header & Controls */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
            <div>
              <h2 className="text-3xl font-normal uppercase tracking-tight text-white font-anton">
                Catálogo Mayorista
              </h2>
              <p className="text-white/50 text-sm mt-1">
                Directo de distribuidor. Margen visible en cada producto.
              </p>
            </div>
            
            {/* Search Input */}
            <div className="relative flex items-center w-full md:w-80">
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar botanas, dulces..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all placeholder-white/40"
              />
              <Search className="absolute left-3.5 h-4 w-4 text-white/40" />
            </div>
          </header>

          {/* Category Filter Chips */}
          <nav className="flex gap-2 flex-wrap items-center" aria-label="Filtrar por categoría">
            <button 
              onClick={() => setCategoriaFiltro('')} 
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium border transition-all ${
                !categoriaFiltro 
                  ? 'bg-white text-black border-white' 
                  : 'bg-white/5 text-white/70 border-white/10 hover:text-white hover:border-white/30'
              }`}
            >
              Todo
            </button>
            {Object.keys(NOMBRE_CATEGORIA).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaFiltro(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium border transition-all ${
                  categoriaFiltro === cat 
                    ? 'bg-white text-black border-white' 
                    : 'bg-white/5 text-white/70 border-white/10 hover:text-white hover:border-white/30'
                }`}
              >
                {EMOJI_CATEGORIA[cat] ?? '🛒'} {NOMBRE_CATEGORIA[cat]}
              </button>
            ))}
          </nav>

          {/* Error message */}
          {error && (
            <div className="flex flex-col items-center justify-center p-12 text-center text-red-400 bg-red-500/5 rounded-2xl border border-red-500/10">
              <p className="font-semibold text-lg">Error al cargar productos</p>
              <p className="text-sm opacity-80 mt-1">{error}</p>
            </div>
          )}

          {/* Loading spinner */}
          {loading && (
            <div className="flex flex-col items-center justify-center p-20 text-white/40 gap-3">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <p className="text-sm font-medium">Cargando productos...</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && productos.length === 0 && (
            <div className="flex flex-col items-center justify-center p-16 text-center text-white/40 bg-white/[0.02] border border-white/5 rounded-2xl">
              <p className="font-medium">No se encontraron productos con ese filtro.</p>
              <button 
                onClick={() => { setCategoriaFiltro(''); setBusqueda(''); }}
                className="text-xs text-white underline mt-2 hover:text-white/80"
              >
                Limpiar filtros
              </button>
            </div>
          )}

          {/* Grid of Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {productos.map((producto, i) => {
              const margen = producto.precio_sugerido_reventa
                ? Math.round(
                    ((producto.precio_sugerido_reventa - producto.precio_mayoreo) /
                      producto.precio_mayoreo) * 100
                  )
                : null;

              return (
                <article
                  key={producto.id}
                  className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-1 hover:border-white/10 shadow-lg group"
                >
                  <div className="flex flex-col">
                    {/* Visual box (Image or Category emoji) */}
                    <div className="relative h-40 bg-gradient-to-br from-white/5 to-transparent rounded-xl flex items-center justify-center text-4xl mb-4 overflow-hidden shadow-inner">
                      {IMAGENES_PRODUCTOS[producto.nombre] ? (
                        <img 
                          src={IMAGENES_PRODUCTOS[producto.nombre]} 
                          alt={producto.nombre} 
                          className="w-4/5 h-4/5 object-contain transition-transform duration-300 group-hover:scale-105 brightness-110"
                        />
                      ) : (
                        <span className="text-5xl select-none">{EMOJI_CATEGORIA[producto.categoria ?? ''] ?? '🛒'}</span>
                      )}
                    </div>

                    <h3 className="font-semibold text-[15px] sm:text-base text-white uppercase tracking-tight line-clamp-1">
                      {producto.nombre}
                    </h3>
                    <p className="text-xs text-white/40 mt-0.5 mb-4">
                      Por {producto.unidad} · {NOMBRE_CATEGORIA[producto.categoria ?? ''] ?? 'General'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 mt-auto">
                    {/* Prices row */}
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold text-xl text-white font-anton tracking-wide">
                        ${producto.precio_mayoreo} <small className="text-[10px] font-sans font-medium text-white/40 uppercase tracking-wider ml-0.5">mayoreo</small>
                      </span>
                      {margen !== null && (
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/10">
                          le ganas ~{margen}%
                        </span>
                      )}
                    </div>

                    {producto.precio_sugerido_reventa && (
                      <p className="text-[11.5px] text-white/50 leading-none">
                        Sugerido de reventa: <span className="font-medium text-white/70">${producto.precio_sugerido_reventa}</span>
                      </p>
                    )}

                    {/* Add to Cart button */}
                    <div className="mt-1">
                      <BotonAgregar producto={producto} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
