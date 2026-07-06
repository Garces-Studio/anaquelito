import Encabezado from "@/componentes/Encabezado";
import PieDePagina from "@/componentes/PieDePagina";

// Diseño de las páginas de la tienda (catálogo, escáner, etc.):
// encabezado fijo, pie de página y el tema cálido "mercado moderno".
// La portada carrusel NO pasa por aquí — vive a pantalla completa.
export default function DisenoTienda({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="tema-tienda">
      <Encabezado />
      {children}
      <PieDePagina />
    </div>
  );
}
