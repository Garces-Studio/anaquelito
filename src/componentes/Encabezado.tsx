import Link from 'next/link';

/** Barra de navegación fija que comparten todas las páginas. */
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
          <Link href="/#como-funciona">Cómo funciona</Link>
          <Link href="/catalogo" className="boton boton-primario">
            Surtir mi negocio
          </Link>
        </nav>
      </div>
    </header>
  );
}
