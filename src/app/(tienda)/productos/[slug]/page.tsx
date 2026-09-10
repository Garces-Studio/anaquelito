import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { obtenerCatalogo } from '@/lib/catalogo-publico';
import { pesos, presentacion, precioPorContenido, textoDisponibilidad } from '@/lib/mayoreo';
import { ConsultarProducto } from '@/componentes/CatalogoMayoreo';
import BotonAgregar from '@/componentes/carrito/BotonAgregar';
import EventoProducto from '@/componentes/EventoProducto';
import GaleriaProducto from '@/componentes/GaleriaProducto';

type Props = { params: Promise<{ slug: string }> };
const sitio = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://anaquelito.vercel.app';
async function buscar(slug: string) { return (await obtenerCatalogo()).productos.find((p) => p.slug === slug || p.id === slug); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await buscar((await params).slug);
  if (!p) return { title: 'Producto no encontrado' };
  const title = `${p.nombre} al mayoreo | Anaquelito`;
  const description = `Compra ${p.nombre} por caja para tu negocio. Consulta presentación, contenido, disponibilidad y precio de mayoreo.`;
  const url = `/productos/${p.slug}`;
  return {
    title, description, alternates: { canonical: url },
    openGraph: { title, description, type: 'website', url, images: p.imagen_url ? [{ url: p.imagen_url, alt: p.nombre }] : undefined },
    twitter: { card: 'summary_large_image', title, description, images: p.imagen_url ? [p.imagen_url] : undefined },
  };
}

export default async function Detalle({ params }: Props) {
  const p = await buscar((await params).slug);
  if (!p) notFound();
  const url = `${sitio}/productos/${p.slug}`;
  const vendible = ['in_stock', 'available_from_supplier', 'low_stock'].includes(p.disponibilidad);
  const disponibilidad = p.disponibilidad === 'out_of_stock'
    ? 'https://schema.org/OutOfStock'
    : p.disponibilidad === 'low_stock' ? 'https://schema.org/LimitedAvailability' : 'https://schema.org/InStock';
  const schemaProducto = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre,
    sku: p.sku ?? undefined, brand: p.marca ? { '@type': 'Brand', name: p.marca } : undefined,
    description: p.descripcion ?? `Compra ${p.nombre} al mayoreo. ${presentacion(p)}.`,
    image: p.imagenes.length ? p.imagenes.map((imagen) => imagen.startsWith('http') ? imagen : `${sitio}${imagen}`) : undefined,
    url,
    ...(p.precio_mayoreo && vendible ? { offers: { '@type': 'Offer', url, priceCurrency: 'MXN', price: p.precio_mayoreo, availability: disponibilidad, itemCondition: 'https://schema.org/NewCondition' } } : {}),
  };
  const schemaMigas = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: sitio },
    { '@type': 'ListItem', position: 2, name: 'Productos', item: `${sitio}/catalogo` },
    { '@type': 'ListItem', position: 3, name: p.nombre, item: url },
  ] };

  return <main className="b2b b2b-interior" id="contenido">
    <EventoProducto id={p.id} nombre={p.nombre} precio={p.precio_mayoreo} />
    <section className="b2b-contenedor b2b-seccion">
      <nav aria-label="Ruta de navegación"><Link href="/">Inicio</Link> / <Link href="/catalogo">Productos</Link> / {p.nombre}</nav>
      <div className="b2b-detalle"><GaleriaProducto producto={p} /><div><p className="b2b-ceja">Selección inicial de mayoreo</p><h1>{p.nombre}</h1><p className="b2b-intro">{presentacion(p)}</p>{p.descripcion && <p>{p.descripcion}</p>}<p className="b2b-precio">{p.precio_mayoreo ? `${pesos(p.precio_mayoreo)} por caja` : 'Precio por confirmar'}</p>{precioPorContenido(p) && <p>{precioPorContenido(p)}</p>}<p className={`b2b-disponibilidad b2b-disponibilidad--${p.disponibilidad}`}>{textoDisponibilidad(p)}</p><p className="b2b-nota">Entrega y envío sujetos a confirmación.</p>{p.precio_mayoreo && p.unidad && p.id !== p.slug && vendible && <BotonAgregar producto={{ ...p, unidad: p.unidad, precio_mayoreo: p.precio_mayoreo }} />}<ConsultarProducto nombre={p.nombre} /></div></div>
      <div className="b2b-tres"><article><h2>Ideal para</h2><p>Tienditas, dulcerías, reventa y eventos.</p></article><article><h2>Contenido de caja</h2><p>{presentacion(p)}{p.peso_total_g ? ` · ${p.peso_total_g / 1000} kg totales` : ''}.</p></article><article><h2>Información de envío</h2><p>Cobertura, costo y fecha se confirman antes de cerrar el pedido.</p></article></div>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaProducto).replace(/</g, '\\u003c') }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMigas).replace(/</g, '\\u003c') }} />
  </main>;
}
