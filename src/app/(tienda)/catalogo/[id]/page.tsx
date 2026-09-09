import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { obtenerCatalogo } from '@/lib/catalogo-publico';
import { pesos, presentacion, precioPorContenido, textoDisponibilidad } from '@/lib/mayoreo';
import { ConsultarProducto, FotoProducto } from '@/componentes/CatalogoMayoreo';
import BotonAgregar from '@/componentes/carrito/BotonAgregar';
type Props = { params: Promise<{ id: string }> };
async function buscar(id: string) { return (await obtenerCatalogo()).productos.find((p) => p.slug === id || p.id === id); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await buscar((await params).id);
  return { title: p ? `${p.nombre} al mayoreo | Anaquelito` : 'Producto no encontrado', description: p ? `Consulta ${p.nombre} para tu negocio. ${presentacion(p)}.` : undefined };
}
export default async function Detalle({ params }: Props) {
  const p = await buscar((await params).id);
  if (!p) notFound();
  const schema = { '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: presentacion(p), ...(p.imagen_url ? { image: p.imagen_url } : {}), ...(p.precio_mayoreo ? { offers: { '@type': 'Offer', priceCurrency: 'MXN', price: p.precio_mayoreo, availability: p.disponibilidad === 'agotado' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock' } } : {}) };
  return <main className="b2b b2b-interior" id="contenido"><section className="b2b-contenedor b2b-seccion"><nav aria-label="Ruta de navegación"><Link href="/">Inicio</Link> / <Link href="/catalogo">Productos</Link> / {p.nombre}</nav><div className="b2b-detalle"><FotoProducto producto={p} prioridad /><div><p className="b2b-ceja">Selección inicial de mayoreo</p><h1>{p.nombre}</h1><p className="b2b-intro">{presentacion(p)}</p>{p.descripcion && <p>{p.descripcion}</p>}<p className="b2b-precio">{p.precio_mayoreo ? pesos(p.precio_mayoreo) : 'Precio por confirmar'}</p>{precioPorContenido(p) && <p>{precioPorContenido(p)}</p>}<p className={`b2b-disponibilidad b2b-disponibilidad--${p.disponibilidad}`}>{textoDisponibilidad(p)}</p><p className="b2b-nota">Entrega y envío sujetos a confirmación.</p>{p.precio_mayoreo && p.unidad && p.id !== p.slug && p.disponibilidad !== 'agotado' && <BotonAgregar producto={{ ...p, unidad: p.unidad, precio_mayoreo: p.precio_mayoreo }} />}<ConsultarProducto nombre={p.nombre} /></div></div><div className="b2b-tres"><article><h2>Ideal para</h2><p>Tienditas, dulcerías, reventa, eventos y distribución.</p></article><article><h2>¿Por qué comprar por caja?</h2><p>Compara el costo por pieza o bolsa y concentra tu surtido en menos pedidos.</p></article><article><h2>Información del producto</h2><p>Consulta ingredientes, alérgenos y conservación en el empaque del fabricante antes de comprar.</p></article></div></section><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} /></main>;
}
