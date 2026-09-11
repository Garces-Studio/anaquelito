import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Boxes, CheckCircle2, Coffee, RefreshCw, Store } from 'lucide-react';
import { notFound } from 'next/navigation';

const SEGMENTOS = {
  tienditas: {
    nombre: 'Tienditas',
    titulo: 'Surtido por caja para mantener tu anaquel en movimiento.',
    descripcion: 'Explora una selección concreta de dulces para mostrador y reventa, con la información comercial reunida en cada ficha.',
    Icono: Store,
    necesidades: ['Reordenar productos sin recorrer un catálogo interminable', 'Consultar presentación y disponibilidad antes de decidir', 'Conservar pedidos para que el siguiente resurtido sea más rápido'],
  },
  cafes: {
    nombre: 'Cafés y fondas',
    titulo: 'Una selección para mostrador y venta complementaria.',
    descripcion: 'Encuentra presentaciones por caja para complementar tu oferta. Tú eliges los productos; Anaquelito mantiene clara la forma de compra.',
    Icono: Coffee,
    necesidades: ['Agregar opciones empacadas a tu mostrador', 'Revisar el contenido de cada presentación', 'Confirmar entrega de acuerdo con tu ubicación'],
  },
  reventa: {
    nombre: 'Personas que revenden',
    titulo: 'Presentaciones por caja para construir tu propia oferta.',
    descripcion: 'Compara productos y arma un surtido de acuerdo con tu manera de vender, sin publicar márgenes ni ganancias que todavía no estén confirmados.',
    Icono: RefreshCw,
    necesidades: ['Identificar piezas o bolsas incluidas por caja', 'Preparar pedidos por volumen desde el celular', 'Volver a comprar a partir del historial de tu cuenta'],
  },
} as const;

type Segmento = keyof typeof SEGMENTOS;
const esSegmento = (valor: string): valor is Segmento => valor in SEGMENTOS;

export function generateStaticParams() {
  return Object.keys(SEGMENTOS).map((segmento) => ({ segmento }));
}

export async function generateMetadata({ params }: { params: Promise<{ segmento: string }> }): Promise<Metadata> {
  const { segmento } = await params;
  if (!esSegmento(segmento)) return {};
  const datos = SEGMENTOS[segmento];
  return { title: `Dulces al mayoreo para ${datos.nombre.toLowerCase()} | Anaquelito`, description: datos.descripcion };
}

export default async function PaginaSegmento({ params }: { params: Promise<{ segmento: string }> }) {
  const { segmento } = await params;
  if (!esSegmento(segmento)) notFound();
  const datos = SEGMENTOS[segmento];
  const Icono = datos.Icono;

  return <main className="b2b b2b-interior" id="contenido">
    <section className="b2b-contenedor b2b-seccion b2b-mayoreo-hero">
      <div><p className="b2b-ceja">Anaquelito para {datos.nombre}</p><h1>{datos.titulo}</h1><p className="b2b-intro">{datos.descripcion}</p><div className="b2b-acciones"><Link className="b2b-boton" href="/catalogo">Explorar productos <ArrowRight size={18} /></Link><Link className="b2b-consultar" href="/mayoreo">Conocer cómo funciona el mayoreo</Link></div></div>
      <aside className="b2b-resumen-mayoreo"><Icono size={44} aria-hidden="true" /><strong>Compra para tu forma de vender.</strong><p>Los precios, la presentación y la disponibilidad se mostrarán únicamente cuando estén confirmados.</p></aside>
    </section>

    <section className="b2b-franja"><div className="b2b-contenedor b2b-seccion"><p className="b2b-ceja">Lo que podrás resolver</p><h2>Información útil antes de comprar.</h2><div className="b2b-tres">{datos.necesidades.map((necesidad) => <article key={necesidad}><CheckCircle2 size={28} aria-hidden="true" /><h3>{necesidad}</h3></article>)}</div></div></section>

    <section className="b2b-contenedor b2b-seccion"><p className="b2b-ceja">Tu recorrido</p><h2>Elige, confirma y recibe.</h2><div className="b2b-dos"><article><Boxes size={28} aria-hidden="true" /><h3>Arma tu surtido</h3><p>Agrega cajas o tarimas desde el catálogo y revisa tu pedido antes de continuar.</p></article><article><CheckCircle2 size={28} aria-hidden="true" /><h3>Confirma los detalles</h3><p>La cobertura, el costo de entrega y el pago se presentarán cuando el negocio termine de definirlos.</p></article></div><div className="b2b-acciones"><Link className="b2b-boton" href="/catalogo">Ver catálogo <ArrowRight size={18} /></Link></div></section>
  </main>;
}
