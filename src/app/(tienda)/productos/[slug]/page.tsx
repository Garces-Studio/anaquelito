import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { obtenerCatalogo } from '@/lib/catalogo-publico';
import { CAJAS_POR_TARIMA, pesos, presentacion, precioPorContenido, textoDisponibilidad } from '@/lib/mayoreo';
import { ConsultarProducto } from '@/componentes/CatalogoMayoreo';
import BotonAgregar from '@/componentes/carrito/BotonAgregar';
import EventoProducto from '@/componentes/EventoProducto';
import GaleriaProducto from '@/componentes/GaleriaProducto';
import { ArrowLeft, Boxes, CheckCircle2, PackageCheck, ShieldCheck, Sparkles, Truck } from 'lucide-react';

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

  return <main className="relative min-h-screen overflow-hidden bg-[#F7F3F8] pb-20 pt-28 text-[#2B1B12] md:pt-32" id="contenido">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_7%_9%,rgba(255,90,95,.2),transparent_26%),radial-gradient(circle_at_94%_12%,rgba(0,166,153,.18),transparent_28%),radial-gradient(circle_at_65%_80%,rgba(118,33,176,.09),transparent_30%),linear-gradient(145deg,#FFF6EC,#F8F5FB_55%,#EEF9F7)]" />
    <EventoProducto id={p.id} nombre={p.nombre} precio={p.precio_mayoreo} />
    <section className="relative mx-auto w-[min(1240px,calc(100%-32px))]">
      <nav className="aparecer mb-5 flex flex-wrap items-center gap-2 text-sm font-bold text-[#6B5546]" aria-label="Ruta de navegación"><Link href="/catalogo" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm transition hover:text-[#FF5A5F]"><ArrowLeft size={15} /> Catálogo</Link><span>/</span><span>{p.nombre}</span></nav>

      <div className="aparecer retraso-1 grid overflow-hidden rounded-[32px] border border-white/90 bg-white/74 shadow-[0_32px_90px_rgba(43,27,18,.14)] backdrop-blur-xl lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative isolate min-h-[430px] overflow-hidden bg-[radial-gradient(circle_at_50%_42%,rgba(255,180,0,.2),transparent_36%),linear-gradient(145deg,#FFF8F1,#EEF9F7)] p-5 sm:min-h-[590px] sm:p-8">
          <div className="absolute left-6 top-6 z-10 inline-flex items-center gap-2 rounded-full border border-white bg-white/85 px-4 py-2 text-[10px] font-black uppercase tracking-[.14em] text-[#FF5A5F] shadow-sm backdrop-blur"><Sparkles size={13} /> Selección Anaquelito</div>
          <div className="detalle-galeria h-full"><GaleriaProducto producto={p} /></div>
        </div>

        <div className="flex flex-col p-6 sm:p-9 lg:p-11">
          <div className="flex flex-wrap items-center justify-between gap-3"><span className="rounded-full bg-[#FFF0F0] px-3 py-1.5 text-[10px] font-black uppercase tracking-[.14em] text-[#C83F44]">{p.marca ?? p.categoria}</span><span className={`b2b-disponibilidad b2b-disponibilidad--${p.disponibilidad}`}>{textoDisponibilidad(p)}</span></div>
          <h1 className="mt-6 text-[clamp(2.6rem,5vw,4.8rem)] !font-black leading-[.94]">{p.nombre}</h1>
          <p className="mt-4 text-lg font-bold text-[#6B5546]">{presentacion(p)}</p>
          {p.descripcion && <p className="mt-4 text-sm font-semibold leading-6 text-[#6B5546]">{p.descripcion}</p>}

          <div className="mt-7 rounded-[22px] bg-[#23131F] p-5 text-white shadow-[0_18px_40px_rgba(35,19,31,.18)]">
            <p className="text-[10px] font-black uppercase tracking-[.16em] text-white/55">Precio de mayoreo</p>
            <p className="mt-1 text-4xl font-black text-white">{p.precio_mayoreo ? pesos(p.precio_mayoreo) : 'Por confirmar'}</p>
            <p className="mt-1 text-xs font-bold text-[#FFB400]">por caja</p>
            <div className="mt-4 border-t border-white/12 pt-4 text-sm font-semibold text-white/68"><Boxes size={17} className="mr-2 inline text-[#45CBBF]" />{p.precio_mayoreo ? `Tarima de ${CAJAS_POR_TARIMA} cajas: ${pesos(p.precio_mayoreo * CAJAS_POR_TARIMA)}` : `También disponible por tarima de ${CAJAS_POR_TARIMA} cajas.`}</div>
          </div>

          {precioPorContenido(p) && <p className="mt-4 rounded-xl bg-[#FFF5DE] px-4 py-3 text-sm font-bold text-[#7A5630]">{precioPorContenido(p)}</p>}
          <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#6B5546]"><Truck size={16} className="text-[#00A699]" /> Entrega y envío sujetos a confirmación.</p>
          <div className="mt-6 grid gap-3">{p.precio_mayoreo && p.unidad && p.id !== p.slug && vendible && <BotonAgregar producto={{ ...p, unidad: p.unidad, precio_mayoreo: p.precio_mayoreo }} />}<ConsultarProducto nombre={p.nombre} /></div>
        </div>
      </div>

      <div className="aparecer retraso-2 mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-[22px] border border-white bg-white/82 p-6 shadow-[0_15px_40px_rgba(43,27,18,.07)]"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#FFF0F0] text-[#FF5A5F]"><CheckCircle2 size={20} /></span><h2 className="mt-5 text-xl !font-black">Ideal para</h2><p className="mt-2 text-sm font-semibold leading-6 text-[#6B5546]">Tienditas, dulcerías, reventa y eventos.</p></article>
        <article className="rounded-[22px] border border-white bg-white/82 p-6 shadow-[0_15px_40px_rgba(43,27,18,.07)]"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#E9F8F5] text-[#00A699]"><PackageCheck size={20} /></span><h2 className="mt-5 text-xl !font-black">Contenido de caja</h2><p className="mt-2 text-sm font-semibold leading-6 text-[#6B5546]">{presentacion(p)}{p.peso_total_g ? ` · ${p.peso_total_g / 1000} kg totales` : ''}.</p></article>
        <article className="rounded-[22px] border border-white bg-white/82 p-6 shadow-[0_15px_40px_rgba(43,27,18,.07)]"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F1E8F8] text-[#7621B0]"><ShieldCheck size={20} /></span><h2 className="mt-5 text-xl !font-black">Compra clara</h2><p className="mt-2 text-sm font-semibold leading-6 text-[#6B5546]">Cobertura, costo y fecha se confirman antes de cerrar el pedido.</p></article>
      </div>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaProducto).replace(/</g, '\\u003c') }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMigas).replace(/</g, '\\u003c') }} />
  </main>;
}
