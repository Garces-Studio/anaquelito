import Link from 'next/link';
import { enlaceWhatsApp } from '@/lib/mayoreo';

/** Pie de página compartido. Las páginas legales son obligatorias antes de
 *  vender en serio (PROFECO) — ver docs/07-legal-y-cumplimiento.md. */
export default function PieDePagina() {
  const whatsapp = enlaceWhatsApp('Hola, quiero consultar productos de mayoreo.');
  return (
    <footer className="pie">
      <div className="contenedor">
        <div className="pie-interior">
          <div style={{ maxWidth: '280px' }}>
            <Link href="/" className="marca" style={{ marginBottom: '0.75rem' }}>
              <span className="marca-logo">A</span>
              Anaquelito
            </Link>
            <p style={{ color: 'var(--tinta-suave)', fontSize: '0.92rem', marginTop: '0.75rem' }}>
              Surtimos tu tiendita, café o punto de venta con dulces y botanas
              por caja. Consulta presentación, precio y entrega.
            </p>
          </div>
          <div>
            <h4>Tienda</h4>
            <ul>
              <li><Link href="/catalogo">Catálogo mayorista</Link></li>
              <li><Link href="/mayoreo">Cómo funciona el mayoreo</Link></li>
              <li><Link href="/#como-comprar">Cómo comprar</Link></li>
            </ul>
          </div>
          <div>
            <h4>Categorías</h4>
            <ul>
              <li><Link href="/catalogo?categoria=gomitas">Gomitas</Link></li>
              <li><Link href="/catalogo?categoria=chocolates">Chocolates</Link></li>
              <li><Link href="/mayoreo#preguntas">Preguntas frecuentes</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contacto</h4>
            <ul>
              <li>{whatsapp ? <a href={whatsapp}>Atención por WhatsApp</a> : 'WhatsApp próximamente'}</li>
              <li><a href="mailto:hola@anaquelito.mx">hola@anaquelito.mx</a></li>
            </ul>
          </div>
        </div>
        <div className="pie-legal">
          <span>© {new Date().getFullYear()} Anaquelito · México</span>
          <span className="pie-legal-enlaces"><Link href="/legal/terminos">Términos</Link><Link href="/legal/privacidad">Privacidad</Link><Link href="/legal/envios">Envíos</Link><Link href="/legal/devoluciones">Cambios y devoluciones</Link><Link href="/legal/facturacion">Facturación</Link></span>
        </div>
      </div>
    </footer>
  );
}
