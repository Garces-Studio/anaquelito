import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Boxes, Package, Sparkles } from 'lucide-react';
import BotonAgregar from './carrito/BotonAgregar';
import { CAJAS_POR_TARIMA, enlaceWhatsApp, pesos, presentacion, precioPorContenido, textoDisponibilidad, type ProductoMayoreo } from '@/lib/mayoreo';
import EnlaceWhatsApp from './EnlaceWhatsApp';

export function ConsultarProducto({ nombre = 'productos de mayoreo' }: { nombre?: string }) {
  const enlace = enlaceWhatsApp(`Hola, quiero consultar presentación, precio y disponibilidad de ${nombre}. Mi código postal es: `);
  return enlace ? <EnlaceWhatsApp className="b2b-consultar" href={enlace}>Consultar por WhatsApp</EnlaceWhatsApp> : <p className="b2b-nota">Atención por WhatsApp próximamente</p>;
}
export function FotoProducto({ producto, prioridad = false }: { producto: ProductoMayoreo; prioridad?: boolean }) {
  const url = producto.imagen_url;
  const permitida = url && ((url.startsWith('/') && !url.startsWith('//')) || url.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos/`));
  return <div className="b2b-foto catalogo-foto">{permitida ? <Image src={url} alt={producto.nombre} fill sizes="(max-width: 640px) 90vw, (max-width: 1000px) 45vw, 360px" priority={prioridad} className="object-contain p-6 drop-shadow-[0_22px_26px_rgba(43,27,18,.18)] transition duration-500 group-hover:scale-[1.06] group-hover:-rotate-1" /> : <div><Package size={48} strokeWidth={1} aria-hidden="true" /><span>Fotografía próximamente</span></div>}</div>;
}
export default function CatalogoMayoreo({ productos }: { productos: ProductoMayoreo[] }) {
  const acentos = ['#FF5A5F', '#00A699', '#7621B0', '#FF8A3D', '#E83E8C', '#078EE8'];
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{productos.map((p, indice) => <article className="group relative overflow-hidden rounded-[26px] border border-white/90 bg-white/88 shadow-[0_18px_48px_rgba(43,27,18,.08)] backdrop-blur transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_65px_rgba(43,27,18,.14)]" key={p.id}>
    <div className="absolute inset-x-0 top-0 z-10 h-1.5" style={{ background: `linear-gradient(90deg, ${acentos[indice % acentos.length]}, #FFB400)` }} />
    <Link href={`/productos/${p.slug}`} aria-label={`Ver ${p.nombre}`} className="block p-3 pb-0"><FotoProducto producto={p} prioridad={indice < 3} /></Link>
    <div className="flex min-h-[390px] flex-col gap-3 p-6">
      <div className="flex items-center justify-between gap-3"><span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0F0] px-3 py-1.5 text-[10px] font-black uppercase tracking-[.12em] text-[#C83F44]"><Sparkles size={12} /> {p.marca ?? p.categoria}</span><span className={`b2b-disponibilidad b2b-disponibilidad--${p.disponibilidad}`}>{textoDisponibilidad(p)}</span></div>
      <h3 className="mt-1 text-2xl !font-black leading-tight"><Link href={`/productos/${p.slug}`}>{p.nombre}</Link></h3>
      <p className="text-sm font-semibold text-[#6B5546]">{presentacion(p)}</p>
      <div className="mt-1 rounded-2xl bg-[#FFF8F1] p-4"><p className="text-[10px] font-black uppercase tracking-[.14em] text-[#8B7465]">Precio por caja</p><strong className="mt-1 block text-3xl font-black text-[#2B1B12]">{p.precio_mayoreo ? pesos(p.precio_mayoreo) : 'Por confirmar'}</strong>{precioPorContenido(p) && <p className="mt-1 text-xs font-semibold text-[#6B5546]">{precioPorContenido(p)}</p>}</div>
      <div className="flex items-start gap-2 text-xs font-semibold text-[#6B5546]"><Boxes size={16} className="mt-0.5 shrink-0 text-[#00A699]" /><p>{p.cantidad_minima ? `Pedido mínimo: ${p.cantidad_minima} ${p.cantidad_minima === 1 ? 'caja' : 'cajas'}. ` : ''}Tarima disponible con {CAJAS_POR_TARIMA} cajas.</p></div>
      <div className="mt-auto grid gap-2 pt-2">{p.precio_mayoreo && p.unidad && p.id !== p.slug && ['in_stock', 'available_from_supplier', 'low_stock'].includes(p.disponibilidad) ? <BotonAgregar producto={{ ...p, unidad: p.unidad, precio_mayoreo: p.precio_mayoreo }} /> : <span className="rounded-2xl bg-[#F4EEE8] px-4 py-3 text-center text-xs font-bold text-[#6B5546]">Próximamente disponible para compra</span>}
        <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#E6D8CD] bg-white text-sm font-black text-[#2B1B12] transition hover:border-[#00A699] hover:bg-[#E9F8F5] hover:text-[#007A70]" href={`/productos/${p.slug}`}>Ver detalles <ArrowUpRight size={16} /></Link>
        <ConsultarProducto nombre={p.nombre} />
      </div>
    </div>
  </article>)}</div>;
}
