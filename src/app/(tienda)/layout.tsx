'use client';

import { usePathname } from 'next/navigation';
import PieDePagina from "@/componentes/PieDePagina";

// Diseño de las páginas de la tienda. El Encabezado ya lo pone el layout raíz
// para TODO el sitio, así que aquí solo se agrega el tema cálido y el pie.
// El catálogo es una experiencia inmersiva a pantalla completa y va sin pie.
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
