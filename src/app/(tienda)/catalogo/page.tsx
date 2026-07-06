import Link from 'next/link';
import { crearCliente } from '@/lib/supabase/server';
import BotonAgregar from '@/componentes/carrito/BotonAgregar';

// Emoji ilustrativo por categoría mientras no hay fotografías de producto
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

export default async function PaginaCatalogo({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string }>;
}) {
  const { categoria, q } = await searchParams;
  const supabase = await crearCliente();

  // Categorías disponibles (para los filtros)
  const { data: filasCategorias } = await supabase
    .from('productos')
    .select('categoria')
    .eq('activo', true);
  const categorias = [...new Set(filasCategorias?.map((f) => f.categoria).filter(Boolean))] as string[];

  // Productos, filtrados por categoría y/o búsqueda si aplican
  let consulta = supabase
    .from('productos')
    .select('id, nombre, categoria, unidad, precio_mayoreo, precio_sugerido_reventa')
    .eq('activo', true)
    .order('creado_en', { ascending: true });

  if (categoria) consulta = consulta.eq('categoria', categoria);
  if (q) consulta = consulta.ilike('nombre', `%${q}%`);

  const { data: productos, error } = await consulta;

  return (
    <main className="contenedor" style={{ padding: '2.5rem 1.25rem 4rem' }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem',
      }}>
        <div>
          <h1 className="seccion-titulo aparecer">Catálogo mayorista</h1>
          <p style={{ color: 'var(--tinta-suave)' }} className="aparecer retraso-1">
            Precio de mayoreo + margen estimado. Sin sorpresas.
          </p>
        </div>
        {/* Búsqueda por nombre: se envía como parámetro GET (?q=...) */}
        <form className="buscador aparecer retraso-2" method="get" action="/catalogo">
          {categoria && <input type="hidden" name="categoria" value={categoria} />}
          <input
            type="search"
            name="q"
            defaultValue={q ?? ''}
            placeholder="Buscar botanas, dulces..."
            aria-label="Buscar productos"
          />
        </form>
      </header>

      {/* Filtros por categoría */}
      <nav className="filtros-categorias aparecer retraso-2" aria-label="Filtrar por categoría">
        <Link href="/catalogo" className={`chip ${!categoria ? 'chip-activo' : ''}`}>
          Todo
        </Link>
        {categorias.map((cat) => (
          <Link
            key={cat}
            href={`/catalogo?categoria=${cat}`}
            className={`chip ${categoria === cat ? 'chip-activo' : ''}`}
          >
            {EMOJI_CATEGORIA[cat] ?? '🛒'} {NOMBRE_CATEGORIA[cat] ?? cat}
          </Link>
        ))}
      </nav>

      {error && (
        <p style={{ color: 'var(--peligro)' }}>
          No se pudo cargar el catálogo: {error.message}
        </p>
      )}

      {productos?.length === 0 && (
        <p style={{ color: 'var(--tinta-suave)', padding: '3rem 0', textAlign: 'center' }}>
          No encontramos productos con ese filtro. <Link href="/catalogo" style={{ color: 'var(--coral)', fontWeight: 700 }}>Ver todo el catálogo</Link>
        </p>
      )}

      <div className="rejilla-productos">
        {productos?.map((producto, i) => {
          // Margen estimado: cuánto le gana el negocio si revende al precio sugerido
          const margen = producto.precio_sugerido_reventa
            ? Math.round(
                ((producto.precio_sugerido_reventa - producto.precio_mayoreo) /
                  producto.precio_mayoreo) * 100
              )
            : null;

          return (
            <article
              key={producto.id}
              className={`tarjeta-producto aparecer ${i < 4 ? `retraso-${i + 1}` : ''}`}
            >
              <div className="foto" aria-hidden="true">
                {EMOJI_CATEGORIA[producto.categoria ?? ''] ?? '🛒'}
              </div>
              <h3>{producto.nombre}</h3>
              <p className="unidad">
                Por {producto.unidad} · {NOMBRE_CATEGORIA[producto.categoria ?? ''] ?? 'General'}
              </p>
              <div className="precios">
                <span className="precio-mayoreo">
                  ${producto.precio_mayoreo} <small>mayoreo</small>
                </span>
                {margen !== null && (
                  <span className="etiqueta-margen">le ganas ~{margen}%</span>
                )}
              </div>
              {producto.precio_sugerido_reventa && (
                <p className="sugerido">
                  Sugerido de reventa: ${producto.precio_sugerido_reventa}
                </p>
              )}
              <BotonAgregar
                producto={{
                  id: producto.id,
                  nombre: producto.nombre,
                  unidad: producto.unidad,
                  precio_mayoreo: producto.precio_mayoreo,
                }}
              />
            </article>
          );
        })}
      </div>
    </main>
  );
}
