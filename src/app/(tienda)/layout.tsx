'use client';

import { usePathname } from 'next/navigation';
import PieDePagina from "@/componentes/PieDePagina";

// Diseño de las páginas de la tienda. El Encabezado ya lo pone el layout raíz
// para TODO el sitio, así que aquí solo se agrega el tema cálido y el pie.
// El catálogo conserva su composición inmersiva, pero comparte el pie global.
export default function DisenoTienda({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const esCatalogoInmersivo = pathname === '/catalogo';

  if (esCatalogoInmersivo) {
    return (
      <>
        {children}
        <div className="tema-tienda home-pie">
          <PieDePagina />
        </div>
      </>
    );
  }

  return (
    <div className="tema-tienda">
      {children}
      <PieDePagina />
    </div>
  );
}
