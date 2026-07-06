import Link from 'next/link';
import EnlaceCarrito from './carrito/EnlaceCarrito';

/** Barra de navegación fija que comparten las páginas de la tienda. */
export default function Encabezado() {
  return (
    <header className="encabezado">
      <div className="encabezado-interior">
        <Link href="/" className="marca">
          <span className="marca-logo">A</span>
          Anaquelito
        </Link>
        <nav className="navegacion">
          <Link href="/catalogo">Catálogo</Link>
          <Link href="/escaner">Escanear</Link>
          <EnlaceCarrito />
          <Link href="/catalogo" className="boton boton-primario">
            Surtir mi negocio
          </Link>
        </nav>
      </div>
    </header>
  );
}
