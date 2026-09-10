'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Package } from 'lucide-react';
import type { ProductoMayoreo } from '@/lib/mayoreo';

function imagenPermitida(url: string) {
  return (url.startsWith('/') && !url.startsWith('//')) || url.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos/`);
}

/** Galería preparada para varias fotografías; con el catálogo actual conserva
 * exactamente la presentación de una sola imagen. */
export default function GaleriaProducto({ producto }: { producto: ProductoMayoreo }) {
  const imagenes = [...new Set([producto.imagen_url, ...producto.imagenes].filter((url): url is string => Boolean(url)).filter(imagenPermitida))];
  const [activa, setActiva] = useState(imagenes[0]);
  return <div>
    <div className="b2b-foto">{activa ? <Image src={activa} alt={producto.nombre} fill sizes="(max-width: 760px) 90vw, 48vw" priority className="object-contain p-6" /> : <div><Package size={48} aria-hidden="true" /><span>Fotografía próximamente</span></div>}</div>
    {imagenes.length > 1 && <div className="mt-3 flex gap-2" aria-label="Imágenes del producto">{imagenes.map((imagen, indice) => <button key={imagen} type="button" onClick={() => setActiva(imagen)} aria-pressed={activa === imagen} aria-label={`Ver imagen ${indice + 1}`} className="relative h-16 w-16 overflow-hidden rounded-lg border border-[#EBD9C3] bg-white"><Image src={imagen} alt="" fill sizes="64px" className="object-contain p-1" /></button>)}</div>}
  </div>;
}
