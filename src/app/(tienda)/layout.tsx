import Encabezado from "@/componentes/Encabezado";
import PieDePagina from "@/componentes/PieDePagina";
import { ProveedorCarrito } from "@/componentes/carrito/ContextoCarrito";

// Diseño de las páginas de la tienda (catálogo, escáner, carrito, etc.):
// encabezado fijo, pie de página, tema cálido "mercado moderno" y el
// carrito compartido entre todas las páginas.
// La portada carrusel NO pasa por aquí — vive a pantalla completa.
export default function DisenoTienda({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProveedorCarrito>
      <div className="tema-tienda">
        <Encabezado />
        {children}
        <PieDePagina />
      </div>
    </ProveedorCarrito>
  );
}
