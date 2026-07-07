'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, AlertCircle, RefreshCw, ShoppingBag, TrendingUp, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { crearCliente } from '@/lib/supabase/client';
import BotonAgregar from '@/componentes/carrito/BotonAgregar';
import { Magnet, FadeIn } from '@/componentes/interactivos';

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
  'Papas Crujientes Fuego': '/papas.png',
  'Mazapán Tradicional': '/mazapan.png',
  'Gomitas Enchiladas': '/gomitas.png',
  'Paleta de Tamarindo': '/paleta.png',
};

const DETALLES_SIMULADOS: Record<string, { descripcion: string; ingredientes: string; sugerencia: string }> = {
  fritos: {
    descripcion: 'Papas y botanas fritas crujientes elaboradas con ingredientes de alta calidad, ideales para fiestas, reuniones o ventas diarias en tu negocio.',
    ingredientes: 'Papa seleccionada, aceite vegetal, sal yodada, chiles deshidratados, ácido cítrico, glutamato monosódico.',
    sugerencia: 'Manténgase en un lugar seco y fresco, alejado de la luz solar directa.',
  },
  gomitas: {
    descripcion: 'Gomitas masticables suaves y deliciosas con la combinación exacta de sabor dulce y un toque acidito o enchilado que les encanta a todos.',
    ingredientes: 'Azúcares añadidos (jarabe de maíz, azúcar), gelatina, ácido cítrico, saborizantes artificiales, chile en polvo.',
    sugerencia: 'Consumir preferentemente a temperatura ambiente para mantener la textura óptima.',
  },
  dulces: {
    descripcion: 'Dulces clásicos de alta rotación en dulcerías y tienditas. Sabor clásico garantizado con excelente aceptación en el mercado.',
    ingredientes: 'Cacahuate seleccionado, azúcar, sal refinada.',
    sugerencia: 'Cuidado al desembalar debido a la textura clásica y desmoronadiza del dulce tradicional.',
  },
};

export default function PaginaDetalleDulce() {
  const { id } = useParams();
  const router = useRouter();
  const [producto, setProducto] = useState<any | null>(null);
  const [productosRelacionados, setProductosRelacionados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = crearCliente();

  useEffect(() => {
    async function cargarDetalle() {
      setLoading(true);
      try {
        // Query product details
        const { data: prodData, error: prodErr } = await supabase
          .from('productos')
          .select('*')
          .eq('id', id)
          .single();

        if (prodErr) throw prodErr;
        setProducto(prodData);

        // Fetch related products in the same category
        if (prodData) {
          const { data: relData } = await supabase
            .from('productos')
            .select('id, nombre, categoria, unidad, precio_mayoreo, precio_sugerido_reventa')
            .eq('categoria', prodData.categoria)
            .eq('activo', true)
            .neq('id', prodData.id)
            .limit(4);
          setProductosRelacionados(relData || []);
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      cargarDetalle();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF6EC] flex flex-col items-center justify-center text-[#2B1B12] gap-4 font-kanit">
        <RefreshCw className="h-10 w-10 animate-spin text-[#FF5A5F]" />
        <p className="font-bold text-lg animate-pulse uppercase tracking-wider">Abriendo envoltura...</p>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="min-h-screen bg-[#FFF6EC] flex flex-col items-center justify-center p-6 text-center font-kanit">
        <AlertCircle className="h-16 w-16 text-[#D64545] mb-4" />
        <h1 className="text-2xl font-bold text-[#2B1B12]">No pudimos encontrar el dulce</h1>
        <p className="text-sm text-[#7A6455] mt-2 max-w-md">El producto podría no estar activo o el enlace es incorrecto.</p>
        <button
          onClick={() => router.push('/catalogo')}
          className="mt-6 px-6 py-2.5 bg-[#FF5A5F] text-white font-bold rounded-full hover:bg-[#E0484D] transition-colors"
        >
          Regresar al Catálogo
        </button>
      </div>
    );
  }

  const margen = producto.precio_sugerido_reventa
    ? Math.round(
        ((producto.precio_sugerido_reventa - producto.precio_mayoreo) /
          producto.precio_mayoreo) * 100
      )
    : null;

  const gananciaNeta = producto.precio_sugerido_reventa
    ? (producto.precio_sugerido_reventa - producto.precio_mayoreo).toFixed(2)
    : null;

  const det = DETALLES_SIMULADOS[producto.categoria] || DETALLES_SIMULADOS.dulces;

  return (
    <div className="min-h-screen bg-[#FFF6EC] text-[#2B1B12] font-kanit pb-24 relative selection:bg-[#FF5A5F]/20 selection:text-[#2B1B12]">
      {/* Capa de ruido de fondo */}
      <div className="grain-overlay opacity-[0.1]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 flex flex-col gap-8 relative z-10">
        
        {/* Back Link */}
        <div className="w-full">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#7A6455] hover:text-[#FF5A5F] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </Link>
        </div>

        {/* Main Grid Detail */}
        <main className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start mt-2">
          
          {/* Left Column: Interactive Product Card (5 Cols) */}
          <section className="md:col-span-5 flex flex-col gap-4">
            <FadeIn y={30} delay={0.1}>
              <Magnet padding={120} strength={4}>
                <div className="w-full aspect-square bg-gradient-to-br from-[#FF5A5F]/15 to-[#FFB400]/10 rounded-[40px] p-8 sm:p-12 flex items-center justify-center shadow-xl border border-[#EBD9C3] relative group overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_70%)] pointer-events-none" />
                  
                  {IMAGENES_PRODUCTOS[producto.nombre] ? (
                    <img
                      src={IMAGENES_PRODUCTOS[producto.nombre]}
                      alt={producto.nombre}
                      className="w-5/6 h-5/6 object-contain select-none pointer-events-none drop-shadow-[0_15px_35px_rgba(43,27,18,0.25)] transition-transform duration-500 group-hover:scale-105"
                      draggable={false}
                    />
                  ) : (
                    <span className="text-8xl select-none transition-transform duration-500 group-hover:scale-110 drop-shadow-md">
                      {EMOJI_CATEGORIA[producto.categoria ?? ''] ?? '🍭'}
                    </span>
                  )}
                </div>
              </Magnet>
            </FadeIn>
            
            {/* Quick badges under image */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-white/85 border border-[#EBD9C3] p-3 rounded-2xl flex flex-col justify-center items-center text-center shadow-sm">
                <span className="text-xs uppercase tracking-widest text-[#7A6455]/70 font-semibold">Categoría</span>
                <span className="font-bold text-sm text-[#2B1B12] mt-0.5">
                  {EMOJI_CATEGORIA[producto.categoria] ?? '🍭'} {NOMBRE_CATEGORIA[producto.categoria] ?? 'General'}
                </span>
              </div>
              <div className="bg-white/85 border border-[#EBD9C3] p-3 rounded-2xl flex flex-col justify-center items-center text-center shadow-sm">
                <span className="text-xs uppercase tracking-widest text-[#7A6455]/70 font-semibold">Empaque</span>
                <span className="font-bold text-sm text-[#2B1B12] mt-0.5">
                  Por {producto.unidad}
                </span>
              </div>
            </div>
          </section>

          {/* Right Column: Information Sheet (7 Cols) */}
          <section className="md:col-span-7 flex flex-col gap-6">
            <FadeIn y={30} delay={0.2} className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#FF5A5F] font-bold tracking-widest text-xs uppercase">
                <Sparkles className="h-4 w-4" />
                Producto de Alta Rotación
              </div>
              
              <h1 className="font-anton text-4xl sm:text-5xl lg:text-6xl text-[#2B1B12] uppercase leading-none tracking-wide">
                {producto.nombre}
              </h1>
              
              <p className="text-[#7A6455] text-base leading-relaxed mt-2">
                {det.descripcion}
              </p>
            </FadeIn>

            {/* Financial Card (Invoice Vibe) */}
            <FadeIn y={30} delay={0.3} className="bg-white rounded-[32px] border border-[#EBD9C3] p-6 shadow-md relative overflow-hidden flex flex-col gap-4">
              <div className="absolute top-0 right-0 bg-[#1E9E6A] text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
                Gran Rendimiento
              </div>

              <div className="flex justify-between items-end border-b border-[#EBD9C3]/50 pb-4">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-[#7A6455] font-semibold">Tu Costo de Mayoreo</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="font-anton text-4xl sm:text-5xl text-[#2B1B12] leading-none">
                      ${producto.precio_mayoreo}
                    </span>
                    <span className="text-xs font-semibold text-[#7A6455] uppercase">MXN / {producto.unidad}</span>
                  </div>
                </div>
              </div>

              {producto.precio_sugerido_reventa && (
                <div className="grid grid-cols-2 gap-4 border-b border-[#EBD9C3]/50 pb-4">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-widest text-[#7A6455] font-semibold">Precio de Reventa</span>
                    <span className="font-anton text-2xl text-[#7A6455] mt-1">
                      ${producto.precio_sugerido_reventa}
                    </span>
                  </div>
                  {margen !== null && (
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-widest text-[#7A6455] font-semibold">Margen Neto B2B</span>
                      <span className="font-anton text-2xl text-[#1E9E6A] mt-1 flex items-center gap-1.5">
                        <TrendingUp className="h-5 w-5" />
                        ~{margen}%
                      </span>
                    </div>
                  )}
                </div>
              )}

              {gananciaNeta && (
                <div className="flex items-center gap-2 bg-[#1E9E6A]/5 border border-[#1E9E6A]/20 rounded-xl p-3.5">
                  <CheckCircle className="h-5 w-5 text-[#1E9E6A] shrink-0" />
                  <p className="text-sm font-semibold text-[#2B1B12]">
                    ¡Le ganas <span className="text-[#1E9E6A] font-bold">${gananciaNeta}</span> netos directos a cada unidad que vendas!
                  </p>
                </div>
              )}

              {/* Add to Cart button box */}
              <div className="mt-2 w-full">
                <BotonAgregar producto={producto} />
              </div>
            </FadeIn>

            {/* Ingredients & Storage Info */}
            <FadeIn y={30} delay={0.4} className="flex flex-col gap-4 border-t border-[#EBD9C3]/60 pt-6">
              <div className="flex flex-col gap-1">
                <h4 className="text-sm uppercase tracking-widest text-[#7A6455] font-bold">Ingredientes</h4>
                <p className="text-sm text-[#2B1B12]/80 leading-relaxed font-light">
                  {det.ingredientes}
                </p>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <h4 className="text-sm uppercase tracking-widest text-[#7A6455] font-bold">Conservación</h4>
                <p className="text-sm text-[#2B1B12]/80 leading-relaxed font-light">
                  {det.sugerencia}
                </p>
              </div>
            </FadeIn>

          </section>
        </main>

        {/* Related Products Carousel (Próximamente) */}
        {productosRelacionados.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[#EBD9C3]/60 flex flex-col gap-6">
            <h2 className="font-anton text-2xl uppercase tracking-wide text-[#2B1B12]">
              Dulces Similares Recomendados
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {productosRelacionados.map((rel) => {
                const relMargen = rel.precio_sugerido_reventa
                  ? Math.round(((rel.precio_sugerido_reventa - rel.precio_mayoreo) / rel.precio_mayoreo) * 100)
                  : null;

                return (
                  <Link
                    key={rel.id}
                    href={`/catalogo/${rel.id}`}
                    className="flex flex-col bg-white border border-[#EBD9C3] rounded-2xl p-4 hover:shadow-md transition-shadow group text-[#2B1B12]"
                  >
                    <div className="relative aspect-[4/3] bg-[#FFF6EC] rounded-xl flex items-center justify-center text-4xl mb-3 overflow-hidden">
                      {IMAGENES_PRODUCTOS[rel.nombre] ? (
                        <img
                          src={IMAGENES_PRODUCTOS[rel.nombre]}
                          alt={rel.nombre}
                          className="w-4/5 h-4/5 object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <span>{EMOJI_CATEGORIA[rel.categoria] ?? '🍭'}</span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base uppercase tracking-wide truncate">{rel.nombre}</h3>
                    <div className="flex justify-between items-baseline mt-2">
                      <span className="font-anton text-lg">${rel.precio_mayoreo}</span>
                      {relMargen && (
                        <span className="text-[10px] font-bold text-[#1E9E6A] uppercase">~{relMargen}% Gana.</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
