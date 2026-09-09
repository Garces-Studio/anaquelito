import Link from 'next/link';
import { ArrowUpRight, Package, Store, Truck } from 'lucide-react';
import CatalogoMayoreo, { ConsultarProducto } from '@/componentes/CatalogoMayoreo';
import PieDePagina from '@/componentes/PieDePagina';
import { obtenerCatalogo } from '@/lib/catalogo-publico';

export default async function Inicio() {
  const { productos, disponible } = await obtenerCatalogo();
  return <><main className="b2b" id="contenido">
    <section className="b2b-hero b2b-contenedor">
      <div><p className="b2b-ceja">Anaquelito · Del proveedor a tu anaquel</p><h1>Dulces y botanas al mayoreo <em>para tu negocio.</em></h1><p className="b2b-intro">Compra por caja, surte tu tienda y recibe producto listo para vender.</p><div className="b2b-acciones"><Link className="b2b-boton" href="/catalogo">Ver productos <ArrowUpRight size={20} /></Link><ConsultarProducto /></div></div>
      <aside className="b2b-manifiesto"><Package size={64} strokeWidth={1} aria-hidden="true" /><p>Surtimos tu negocio,<br /><em>no tu antojo.</em></p><span>Una selección de mayoreo para tienditas, dulcerías y reventa.</span><Link href="/mayoreo">Conoce cómo comprar →</Link></aside>
    </section>
    <div className="b2b-beneficios"><span><Package size={20} /> Compra por caja</span><span><Store size={20} /> Precios para negocio</span><span><Truck size={20} /> Entregas según cobertura</span></div>
    <section className="b2b-contenedor b2b-seccion" id="productos"><p className="b2b-ceja">Empecemos con lo esencial</p><h2>Selección inicial de mayoreo</h2><p className="b2b-intro">Seis productos para empezar a armar tu surtido. Publicamos precios y presentaciones cuando están confirmados.</p>{!disponible && <p role="status" className="b2b-aviso">Por el momento no podemos consultar precios ni disponibilidad. La selección se muestra para consulta.</p>}<CatalogoMayoreo productos={productos} /></section>
    <section className="b2b-contenedor b2b-seccion"><p className="b2b-ceja">Compra para tu negocio</p><h2>Tu siguiente pedido empieza aquí.</h2><div className="b2b-tres">{[['Tiendita', 'Arma tu surtido para el mostrador y el anaquel.'], ['Dulcería / eventos', 'Compra por caja para fiestas y reventa.'], ['Distribuidor', 'Consulta disponibilidad y condiciones para compras por volumen.']].map(([titulo, texto]) => <article key={titulo}><h3>{titulo}</h3><p>{texto}</p><Link href="/mayoreo">Ver cómo comprar →</Link></article>)}</div></section>
    <section className="b2b-contenedor b2b-seccion" id="como-comprar"><p className="b2b-ceja">Del catálogo a tu negocio</p><h2>¿Cómo comprar?</h2><ol className="b2b-pasos">{['Elige tus cajas', 'Agrega al carrito', 'Confirma entrega o envío', 'Paga cuando esté habilitado', 'Recibe y empieza a vender'].map((paso) => <li key={paso}>{paso}</li>)}</ol><p className="b2b-nota">Los costos y tiempos de entrega se confirman según tu ubicación antes de cerrar la compra.</p></section>
  </main><PieDePagina /></>;
}
