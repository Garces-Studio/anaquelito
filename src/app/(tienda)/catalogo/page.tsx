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
      {/* SECCIÓN ELIMINADA: aquí había un hero de plantilla de portafolio
          ("Max Reed", ajeno al proyecto) pegado por error — ver bitácora. */}
      <section className="relative px-4 sm:px-6 md:px-10 lg:px-14 py-6 sm:py-8 md:py-10 lg:h-screen lg:max-h-[960px] flex flex-col justify-between gap-6 overflow-hidden">
        {/* Grano analógico premium */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-repeat bg-[size:200px_200px]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`
        }} />

        {/* Top Header Row */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10 w-full">
          <div className="max-w-3xl flex flex-col gap-2">
            <h1 className="text-[28px] sm:text-3xl md:text-4xl lg:text-[44px] leading-[1.15] font-normal tracking-tight text-white">
              Hi, I'm Max Reed!
            </h1>
            <p className="text-sm md:text-[15px] leading-[1.6] text-white/60 max-w-2xl font-normal">
              A London-based independent creator shaping sharp visual systems, web-ready products, and story-first campaigns. With a decade of craft behind me, I help ideas move with focus and intention.
            </p>
          </div>
          <button 
            onClick={desplazarACatalogo}
            className="liquid-glass rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.98] border border-white/10 shrink-0 self-start sm:self-center"
          >
            Let's Team Up Today
          </button>
        </header>

        {/* Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:flex-1 w-full my-auto z-10">
          
          {/* Column 1 - Background Video & Timeline */}
          <div className="relative rounded-2xl bg-black overflow-hidden flex flex-col justify-between p-5 md:p-6 min-h-[300px] lg:h-full border border-white/5 group shadow-2xl">
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 z-0 transition-transform duration-700 group-hover:scale-105">
              <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260507_150203_44a5bd32-516a-47ce-a077-8acbf9aa8991.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 z-0 pointer-events-none" />
            
            {/* Label */}
            <div className="flex justify-center items-center gap-2 relative z-10 w-full">
              <Sparkle className="h-3 w-3 text-white/70" strokeWidth={1.5} />
              <span className="uppercase tracking-[0.22em] text-[11px] text-white/70 font-medium">BACKGROUND</span>
              <Sparkle className="h-3 w-3 text-white/70" strokeWidth={1.5} />
            </div>
            
            {/* Career Timeline */}
            <div className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-x-2 gap-y-3.5 relative z-10 w-full text-[11.5px] sm:text-xs text-white/80 font-medium font-mono">
              {/* Row 1 */}
              <span className="text-white/60">2023-Now</span>
              <Sparkle className="h-3 w-3 text-white/50 mx-auto" strokeWidth={1.5} />
              <span className="font-sans text-white/90">Freelance Creative</span>
              <span className="text-right text-white/40 font-sans">Solo Studio</span>
              
              {/* Row 2 */}
              <span className="text-white/60">2020-2023</span>
              <Sparkle className="h-3 w-3 text-white/50 mx-auto" strokeWidth={1.5} />
              <span className="font-sans text-white/90">Head of Brand Design</span>
              <span className="text-right text-white/40 font-sans">Rove Studio</span>
              
              {/* Row 3 */}
              <span className="text-white/60">2017-2020</span>
              <Sparkle className="h-3 w-3 text-white/50 mx-auto" strokeWidth={1.5} />
              <span className="font-sans text-white/90">Visual Stylist</span>
              <span className="text-right text-white/40 font-sans">Ember Works</span>
            </div>
          </div>

          {/* Column 2 - Client Voice & 10M+ Raised */}
          <div className="grid grid-rows-[auto_1fr] gap-4 md:gap-5 lg:h-full">
            
            {/* Top - Client Voice Card */}
            <div className="relative rounded-2xl bg-[#324444] p-5 md:p-6 overflow-hidden noise-overlay flex flex-col justify-between gap-4 border border-white/10 shadow-2xl">
              <div className="flex justify-start items-center gap-2 relative z-10">
                <Sparkle className="h-3 w-3 text-white/70" strokeWidth={1.5} />
                <span className="uppercase tracking-[0.22em] text-[11px] text-white/70 font-semibold">CLIENT VOICE</span>
              </div>
              <p className="text-[13px] sm:text-[13.5px] leading-[1.6] text-white/85 italic relative z-10 font-normal">
                "Max reshaped our image with a degree of finesse and vision that surpassed what we'd hoped for. The process felt graceful, and the outcomes speak for themselves."
              </p>
              <div className="text-xs text-white/60 relative z-10 font-normal">
                <strong className="text-white font-medium">Elena Brooks</strong>, Creative Director — Halcyon
              </div>
            </div>

            {/* Bottom - 10M+ Card */}
            <div className="relative rounded-2xl bg-black overflow-hidden flex flex-col justify-center items-center p-6 border border-white/5 group shadow-2xl min-h-[160px]">
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 z-0 transition-transform duration-700 group-hover:scale-105">
                <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260507_154543_d5b83fc1-9cea-44f3-b5e8-8f325935211a.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/30 z-0" />
              <div className="relative z-10 flex flex-col justify-center items-center text-center">
                <span className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-light tracking-tight text-white drop-shadow-md leading-none">10M+</span>
                <span className="text-xs sm:text-sm text-white/85 mt-2 tracking-wide font-normal">Raised for startups</span>
              </div>
            </div>
          </div>

          {/* Column 3 - Daily Software & Reach Me */}
          <div className="grid grid-rows-[1fr_auto] lg:grid-rows-[auto_1fr] gap-4 md:gap-5 lg:h-full">
            
            {/* Top - Daily Software Card */}
            <div className="relative rounded-2xl bg-black overflow-hidden flex flex-col justify-between p-5 md:p-6 border border-white/5 group shadow-2xl min-h-[220px]">
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 z-0 transition-transform duration-700 group-hover:scale-105">
                <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260507_153148_d7a3e1dd-e5d0-4ce6-8306-00d7522ecc44.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/40 z-0" />
              
              <div className="flex justify-center items-center gap-2 relative z-10 w-full">
                <Sparkle className="h-3 w-3 text-white/70" strokeWidth={1.5} />
                <span className="uppercase tracking-[0.22em] text-[11px] text-white/70 font-semibold">DAILY SOFTWARE</span>
                <Sparkle className="h-3 w-3 text-white/70" strokeWidth={1.5} />
              </div>

              {/* Scrolling marquees */}
              <div className="overflow-hidden w-full relative z-10 mt-6 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] flex flex-col gap-3">
                {/* Row 1 (scrolls left) */}
                <div className="flex gap-3 animate-marquee-left whitespace-nowrap w-max">
                  {row1Duplicated.map((iconName, index) => {
                    const IconComp = getIconComponent(iconName);
                    return (
                      <div key={`r1-${index}`} className="liquid-glass h-14 w-14 md:h-16 md:w-16 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10">
                        <IconComp className="h-6 w-6 text-white" strokeWidth={1.5} />
                      </div>
                    );
                  })}
                </div>
                {/* Row 2 (scrolls right) */}
                <div className="flex gap-3 animate-marquee-right whitespace-nowrap w-max">
                  {row2Duplicated.map((iconName, index) => {
                    const IconComp = getIconComponent(iconName);
                    return (
                      <div key={`r2-${index}`} className="liquid-glass h-14 w-14 md:h-16 md:w-16 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10">
                        <IconComp className="h-6 w-6 text-white" strokeWidth={1.5} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom - Reach Me Card */}
            <div className="relative rounded-2xl bg-[#324444] p-5 md:p-6 overflow-hidden noise-overlay flex flex-col justify-between gap-5 border border-white/10 shadow-2xl">
              <div className="flex justify-between items-center w-full relative z-10">
                <div className="flex items-center gap-2">
                  <Sparkle className="h-3 w-3 text-white/70" strokeWidth={1.5} />
                  <span className="uppercase tracking-[0.22em] text-[11px] text-white/70 font-semibold">REACH ME</span>
                </div>
                <a 
                  href="mailto:hi@maxreed.com" 
                  className="h-9 w-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all hover:scale-105 border border-white/10"
                >
                  <ArrowUpRight className="h-4 w-4 text-white" strokeWidth={1.5} />
                </a>
              </div>
              <div className="relative z-10 flex flex-col gap-1">
                <a href="mailto:hi@maxreed.com" className="text-[17px] sm:text-[19px] font-normal tracking-tight text-white hover:text-white/80 transition-colors">
                  hi@maxreed.com
                </a>
                <a href="tel:+442078163" className="text-[14px] sm:text-[15px] text-white/50 font-mono tracking-tight hover:text-white/75 transition-colors">
                  +44 207 81 63
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN CATÁLOGO DE PRODUCTOS (MATCHING DARK THEME) */}
      <section id="productos-catalogo" className="border-t border-white/10 px-4 sm:px-6 md:px-10 lg:px-14 py-16 bg-[#0a0a0a] min-h-screen">
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
