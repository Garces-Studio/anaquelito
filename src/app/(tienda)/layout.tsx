'use client';

import { usePathname } from 'next/navigation';
import PieDePagina from "@/componentes/PieDePagina";

// Diseño de las páginas de la tienda. El catálogo es una experiencia inmersiva
// a pantalla completa (carrusel TOONHUB) y se muestra SIN encabezado, pie ni
// tema; las demás páginas sí llevan el chrome cálido compartido.
// La portada carrusel NO pasa por aquí — vive a pantalla completa aparte.
export default function DisenoTienda({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const esCatalogoInmersivo = pathname === '/catalogo';

  if (esCatalogoInmersivo) {
    return <>{children}</>;
  }

  return (
    <div className="tema-tienda">
      {children}
      <PieDePagina />
    </div>
  );
}
