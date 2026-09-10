import Image from 'next/image';
import Link from 'next/link';
import { Package } from 'lucide-react';
import BotonAgregar from './carrito/BotonAgregar';
import { enlaceWhatsApp, pesos, presentacion, precioPorContenido, textoDisponibilidad, type ProductoMayoreo } from '@/lib/mayoreo';
import EnlaceWhatsApp from './EnlaceWhatsApp';

export function ConsultarProducto({ nombre = 'productos de mayoreo' }: { nombre?: string }) {
  const enlace = enlaceWhatsApp(`Hola, quiero consultar presentación, precio y disponibilidad de ${nombre}. Mi código postal es: `);
  return enlace ? <EnlaceWhatsApp className="b2b-consultar" href={enlace}>Consultar por WhatsApp</EnlaceWhatsApp> : <p className="b2b-nota">Atención por WhatsApp próximamente</p>;
}
export function FotoProducto({ producto, prioridad = false }: { producto: ProductoMayoreo; prioridad?: boolean }) {
  const url = producto.imagen_url;
  const permitida = url && ((url.startsWith('/') && !url.startsWith('//')) || url.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos/`));
  return <div className="b2b-foto">{permitida ? <Image src={url} alt={producto.nombre} fill sizes="(max-width: 640px) 90vw, (max-width: 1000px) 45vw, 360px" priority={prioridad} className="object-contain p-6" /> : <div><Package size={48} strokeWidth={1} aria-hidden="true" /><span>Fotografía próximamente</span></div>}</div>;
}
export default function CatalogoMayoreo({ productos }: { productos: ProductoMayoreo[] }) {
  return <div className="b2b-productos">{productos.map((p) => <article className="b2b-tarjeta" key={p.id}>
    <Link href={`/productos/${p.slug}`} aria-label={`Ver ${p.nombre}`}><FotoProducto producto={p} /></Link>
    <div className="b2b-tarjeta-cuerpo"><span className="b2b-etiqueta">{p.marca ?? p.categoria}</span><h3><Link href={`/productos/${p.slug}`}>{p.nombre}</Link></h3>
      <p>{presentacion(p)}</p><strong className="b2b-precio">{p.precio_mayoreo ? pesos(p.precio_mayoreo) : 'Precio por confirmar'}</strong>
      {precioPorContenido(p) && <p>{precioPorContenido(p)}</p>}
      <p className={`b2b-disponibilidad b2b-disponibilidad--${p.disponibilidad}`}>{textoDisponibilidad(p)}</p>
      {p.cantidad_minima && <p className="b2b-nota">Pedido mínimo: {p.cantidad_minima} {p.cantidad_minima === 1 ? 'caja' : 'cajas'}</p>}
      {p.precio_mayoreo && p.unidad && p.id !== p.slug && ['in_stock', 'available_from_supplier', 'low_stock'].includes(p.disponibilidad) ? <BotonAgregar producto={{ ...p, unidad: p.unidad, precio_mayoreo: p.precio_mayoreo }} /> : <span className="b2b-pendiente">Próximamente disponible para compra</span>}
      <Link className="b2b-consultar" href={`/productos/${p.slug}`}>Ver producto</Link>
      <ConsultarProducto nombre={p.nombre} />
    </div>
  </article>)}</div>;
}
