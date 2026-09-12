import Link from 'next/link';
import Image from 'next/image';
import { Mail, PackageCheck, Truck } from 'lucide-react';
import { enlaceWhatsApp } from '@/lib/mayoreo';

/** Pie de página compartido. Las páginas legales son obligatorias antes de
 *  vender en serio (PROFECO) — ver docs/07-legal-y-cumplimiento.md. */
export default function PieDePagina() {
  const whatsapp = enlaceWhatsApp('Hola, quiero consultar productos de mayoreo.');
  const correo = process.env.NEXT_PUBLIC_CORREO_NEGOCIO?.trim();
  return (
    <footer className="pie pie-nuevo">
      <div className="pie-nuevo-luz pie-nuevo-luz--coral" />
      <div className="pie-nuevo-luz pie-nuevo-luz--teal" />
      <div className="contenedor pie-nuevo-contenido">
        <div className="pie-interior pie-nuevo-grid">
          <div className="pie-nuevo-marca">
            <Link href="/" aria-label="Anaquelito, ir al inicio"><Image src="/anaquelito-logo.png" width={600} height={454} sizes="120px" alt="Anaquelito" /></Link>
            <p>Surtimos tu tiendita, café o punto de venta con dulces y botanas por caja, con información clara para comprar mejor.</p>
            <div className="pie-nuevo-sellos"><span><PackageCheck size={15} /> Mayoreo</span><span><Truck size={15} /> Entrega por confirmar</span></div>
          </div>
          <div className="pie-nuevo-columna">
            <h4>Tienda</h4>
            <ul>
              <li><Link href="/catalogo">Catálogo mayorista</Link></li>
              <li><Link href="/mayoreo">Cómo funciona el mayoreo</Link></li>
              <li><Link href="/#como-comprar">Cómo comprar</Link></li>
            </ul>
          </div>
          <div className="pie-nuevo-columna">
            <h4>Anaquelito</h4>
            <ul>
              <li><Link href="/#por-que">Nosotros</Link></li>
              <li><Link href="/catalogo">Productos</Link></li>
              <li><Link href="/mayoreo#preguntas">Preguntas frecuentes</Link></li>
            </ul>
          </div>
          <div className="pie-nuevo-columna">
            <h4>Contacto</h4>
            <ul>
              <li>{whatsapp ? <a href={whatsapp}>Atención por WhatsApp</a> : 'WhatsApp próximamente'}</li>
              <li>{correo ? <a className="pie-nuevo-correo" href={`mailto:${correo}`}><Mail size={14} /> {correo}</a> : 'Correo próximamente'}</li>
            </ul>
          </div>
        </div>
        <div className="pie-legal pie-nuevo-legal">
          <span>© {new Date().getFullYear()} Anaquelito · México</span>
          <span className="pie-legal-enlaces"><Link href="/legal/terminos">Términos</Link><Link href="/legal/privacidad">Privacidad</Link><Link href="/legal/envios">Envíos</Link><Link href="/legal/devoluciones">Cambios y devoluciones</Link><Link href="/legal/facturacion">Facturación</Link></span>
        </div>
      </div>
    </footer>
  );
}
