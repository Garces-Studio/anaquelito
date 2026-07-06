import Link from 'next/link';

/** Pie de página compartido. Las páginas legales son obligatorias antes de
 *  vender en serio (PROFECO) — ver docs/07-legal-y-cumplimiento.md. */
export default function PieDePagina() {
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
              de alto margen. Sin letras chiquitas.
            </p>
          </div>
          <div>
            <h4>Tienda</h4>
            <ul>
              <li><Link href="/catalogo">Catálogo mayorista</Link></li>
              <li><Link href="/escaner">Reordenar con escáner</Link></li>
              <li><Link href="/#precios">Niveles de precio</Link></li>
            </ul>
          </div>
          <div>
            <h4>Para tu negocio</h4>
            <ul>
              <li><Link href="/#segmentos">Soy tiendita</Link></li>
              <li><Link href="/#segmentos">Soy café o fonda</Link></li>
              <li><Link href="/#segmentos">Soy emprendedor</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contacto</h4>
            <ul>
              <li><a href="https://wa.me/">WhatsApp (próximamente)</a></li>
              <li><a href="mailto:hola@anaquelito.mx">hola@anaquelito.mx</a></li>
            </ul>
          </div>
        </div>
        <div className="pie-legal">
          <span>© {new Date().getFullYear()} Anaquelito · CDMX, México</span>
          <span>Términos, privacidad y política de envíos: en preparación</span>
        </div>
      </div>
    </footer>
  );
}
