import type { Metadata } from 'next';
import Link from 'next/link';
import { Boxes, ClipboardCheck, PackageCheck, Store, Truck } from 'lucide-react';
import { ConsultarProducto } from '@/componentes/CatalogoMayoreo';

export const metadata: Metadata = {
  title: 'Compra dulces por caja para tu negocio | Anaquelito',
  description: 'Cómo comprar dulces al mayoreo para tienditas, dulcerías, eventos y distribución. Consulta presentación, entrega y condiciones por volumen.',
};

const preguntas = [
  ['¿Hay precios por volumen?', 'La estructura ya permite configurar escalas por producto. Las publicaremos cuando estén confirmadas; no aplicamos descuentos ficticios.'],
  ['¿Dónde entregan?', 'La cobertura, costo y plazo se confirman con tu código postal antes de cerrar la compra.'],
  ['¿Puedo pedir por WhatsApp?', 'Cuando esté configurado el número del negocio podrás enviar el resumen del carrito para cotizar. La compra web y la cotización serán caminos complementarios.'],
  ['¿Hay crédito o facturación?', 'Consulta los requisitos con el negocio. No ofrecemos crédito automático ni facturación sin confirmación previa.'],
  ['¿Qué incluye cada caja?', 'La ficha muestra únicamente el contenido confirmado. Si aparece pendiente, consúltalo antes de comprar.'],
];

export default function Mayoreo() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: preguntas.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })),
  };

  return <main className="b2b b2b-interior" id="contenido">
    <section className="b2b-contenedor b2b-seccion b2b-mayoreo-hero">
      <div><p className="b2b-ceja">Del proveedor a tu anaquel</p><h1>Mayoreo pensado para negocios que necesitan surtirse.</h1><p className="b2b-intro">Compra dulces por caja para tu tiendita, dulcería, evento o negocio de reventa. Cada dato se publica sólo cuando está confirmado.</p><div className="b2b-acciones"><Link className="b2b-boton" href="/catalogo">Ver productos</Link><ConsultarProducto /></div></div>
      <aside className="b2b-resumen-mayoreo"><Boxes size={44} aria-hidden="true" /><strong>Surtimos tu negocio,<br />no tu antojo.</strong><p>Empieza con una selección concreta y solicita condiciones comerciales cuando necesites más volumen.</p></aside>
    </section>

    <section className="b2b-contenedor b2b-seccion"><p className="b2b-ceja">¿Para quién es?</p><h2>Compra para tu forma de vender.</h2><div className="b2b-tres"><article><Store size={28} aria-hidden="true" /><h3>Tiendita</h3><p>Producto para surtir mostrador y anaquel.</p></article><article><PackageCheck size={28} aria-hidden="true" /><h3>Dulcería y eventos</h3><p>Presentaciones por caja para fiestas y reventa.</p></article><article><Boxes size={28} aria-hidden="true" /><h3>Distribución</h3><p>Consulta disponibilidad y condiciones para pedidos de mayor volumen.</p></article></div></section>

    <section className="b2b-franja"><div className="b2b-contenedor"><p className="b2b-ceja">Proceso de pedido</p><h2>De la selección a la entrega.</h2><ol className="b2b-pasos">{['Elige tus cajas', 'Revisa presentación y precio', 'Confirma cobertura', 'Paga cuando esté habilitado', 'Recibe tu surtido'].map((paso) => <li key={paso}>{paso}</li>)}</ol><div className="b2b-cobertura"><Truck size={24} aria-hidden="true" /><p><strong>Entrega según cobertura.</strong> El costo y plazo se confirman con tu código postal; no prometemos cobertura nacional sin validarla.</p></div></div></section>

    <section className="b2b-contenedor b2b-seccion"><p className="b2b-ceja">Precios por volumen</p><h2>Una base lista para crecer contigo.</h2><div className="b2b-dos"><article><ClipboardCheck size={28} aria-hidden="true" /><h3>Escalas configurables</h3><p>El sistema puede manejar precios desde cierta cantidad de cajas sin dejar descuentos escritos directamente en la página.</p></article><article><Boxes size={28} aria-hidden="true" /><h3>Arma tu surtido</h3><p>La promoción para combinar cajas queda contemplada para una siguiente etapa. Todavía no se ofrece ningún descuento no confirmado.</p></article></div></section>

    <section className="b2b-contenedor b2b-seccion" id="preguntas"><p className="b2b-ceja">Preguntas frecuentes</p><h2>Lo que necesitas saber.</h2>{preguntas.map(([q, a]) => <details className="b2b-faq" key={q}><summary>{q}</summary><p>{a}</p></details>)}<div className="b2b-acciones"><Link className="b2b-boton" href="/catalogo">Empezar mi pedido</Link><ConsultarProducto /></div></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
  </main>;
}
