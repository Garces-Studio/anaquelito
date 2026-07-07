'use client';

import React, { useState, useEffect } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { crearCliente } from '@/lib/supabase/client';
import BotonAgregar from '@/componentes/carrito/BotonAgregar';

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
    <div className="contenedor py-10 sm:py-16 min-h-screen animate-fade-in flex flex-col gap-10">
      
      {/* Header Centralizado y Limpio */}
      <header className="text-center max-w-3xl mx-auto flex flex-col gap-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-podium uppercase tracking-tight text-[#2B1B12]">
          Catálogo Mayorista
        </h1>
        <p className="text-[#7A6455] text-base sm:text-lg leading-relaxed">
          Surtido directo de distribuidor. Sin intermediarios, sin membresías y con el margen de ganancia de reventa claro en cada producto.
        </p>
      </header>

      {/* Controles: Búsqueda y Filtros */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-6 bg-[#FFFFFF] p-4 sm:p-6 rounded-3xl shadow-sm border border-[#EBD9C3]">
        {/* Filtros */}
        <nav className="flex gap-2 flex-wrap items-center justify-center md:justify-start w-full md:w-auto" aria-label="Filtrar por categoría">
          <button 
            onClick={() => setCategoriaFiltro('')} 
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all border ${
              !categoriaFiltro 
                ? 'bg-[#FF5A5F] text-white border-[#FF5A5F] shadow-md' 
                : 'bg-[#FFF6EC] text-[#7A6455] border-[#EBD9C3] hover:border-[#FF5A5F] hover:text-[#FF5A5F]'
            }`}
          >
            Todos
          </button>
          {Object.keys(NOMBRE_CATEGORIA).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaFiltro(cat)}
              className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all border ${
                categoriaFiltro === cat 
                  ? 'bg-[#FF5A5F] text-white border-[#FF5A5F] shadow-md' 
                  : 'bg-[#FFF6EC] text-[#7A6455] border-[#EBD9C3] hover:border-[#FF5A5F] hover:text-[#FF5A5F]'
              }`}
            >
              {EMOJI_CATEGORIA[cat] ?? '🛒'} {NOMBRE_CATEGORIA[cat]}
            </button>
          ))}
        </nav>

        {/* Búsqueda */}
        <div className="relative w-full md:w-80 shrink-0">
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full pl-12 pr-5 py-3 rounded-full bg-[#FFF6EC] border border-[#EBD9C3] text-[#2B1B12] text-sm sm:text-base outline-none focus:border-[#FF5A5F] focus:ring-4 focus:ring-[#FF5A5F]/10 transition-all placeholder-[#7A6455]/70"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7A6455]/70" />
        </div>
      </section>

      {/* Estados: Error, Carga, Vacío */}
      {error && (
        <div className="flex flex-col items-center justify-center p-12 text-center text-[#D64545] bg-[#D64545]/5 rounded-3xl border border-[#D64545]/20">
          <p className="font-bold text-lg">Hubo un problema</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center p-24 text-[#7A6455] gap-4">
          <RefreshCw className="h-10 w-10 animate-spin text-[#FF5A5F]" />
          <p className="font-semibold text-lg animate-pulse">Abriendo cajas...</p>
        </div>
      )}

      {!loading && productos.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center p-20 text-center text-[#7A6455] bg-[#FFFFFF] border border-[#EBD9C3] rounded-3xl shadow-sm">
          <span className="text-6xl mb-4">📭</span>
          <p className="font-semibold text-xl text-[#2B1B12]">No encontramos dulces aquí</p>
          <p className="text-sm mt-2 max-w-md">Intenta cambiar los filtros o buscar con otras palabras.</p>
          <button 
            onClick={() => { setCategoriaFiltro(''); setBusqueda(''); }}
            className="mt-6 px-6 py-2.5 bg-[#FFF6EC] text-[#FF5A5F] font-bold rounded-full border border-[#FF5A5F]/20 hover:bg-[#FF5A5F]/10 transition-colors"
          >
            Limpiar búsqueda
          </button>
        </div>
      )}

      {/* Grid de Productos (Mercado Moderno Premium) */}
      {!loading && productos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
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
                className={`flex flex-col bg-[#FFFFFF] border border-[#EBD9C3] rounded-[24px] p-5 shadow-[0_8px_24px_rgba(43,27,18,0.04)] hover:shadow-[0_20px_40px_rgba(43,27,18,0.08)] transition-all duration-300 hover:-translate-y-1.5 group ${i < 6 ? `aparecer retraso-${(i % 4) + 1}` : 'aparecer'}`}
              >
                {/* Imagen del Producto */}
                <div className="relative h-48 bg-gradient-to-br from-[#FFF6EC] to-[#FFEFDD] rounded-2xl flex items-center justify-center text-6xl mb-5 overflow-hidden border border-[#EBD9C3]/50">
                  {/* Decoración de fondo */}
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_70%)] mix-blend-overlay pointer-events-none" />
                  
                  {IMAGENES_PRODUCTOS[producto.nombre] ? (
                    <img
                      src={IMAGENES_PRODUCTOS[producto.nombre]}
                      alt={producto.nombre}
                      className="w-4/5 h-4/5 object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-xl"
                    />
                  ) : (
                    <span className="select-none transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 drop-shadow-md">
                      {EMOJI_CATEGORIA[producto.categoria ?? ''] ?? '🛒'}
                    </span>
                  )}
                </div>

                {/* Información del Producto */}
                <div className="flex flex-col flex-1">
                  <div className="mb-4">
                    <h3 className="font-anton text-xl text-[#2B1B12] uppercase tracking-wide leading-tight line-clamp-2">
                      {producto.nombre}
                    </h3>
                    <p className="text-sm font-medium text-[#7A6455] mt-1">
                      Por {producto.unidad} <span className="opacity-50 mx-1">•</span> {NOMBRE_CATEGORIA[producto.categoria ?? ''] ?? 'General'}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-col gap-4">
                    {/* Precios */}
                    <div className="bg-[#FFF6EC] rounded-xl p-3 border border-[#EBD9C3]/60 relative">
                      {/* Margen Badge */}
                      {margen !== null && (
                        <div className="absolute -top-3 right-3 bg-[#1E9E6A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                          Le ganas ~{margen}%
                        </div>
                      )}
                      
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-anton text-[28px] leading-none text-[#2B1B12]">
                          ${producto.precio_mayoreo}
                        </span>
                        <span className="text-[10px] font-bold text-[#7A6455] uppercase tracking-widest">
                          Mayoreo
                        </span>
                      </div>

                      {producto.precio_sugerido_reventa && (
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#EBD9C3] border-dashed">
                          <span className="text-[11px] font-semibold text-[#7A6455] uppercase tracking-wide">
                            Reventa Sugerida
                          </span>
                          <span className="text-[13px] font-bold text-[#2B1B12]">
                            ${producto.precio_sugerido_reventa}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Botón Agregar */}
                    <div className="mt-1">
                      <BotonAgregar producto={producto} />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
