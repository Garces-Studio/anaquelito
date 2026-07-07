import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

// Fuente principal y única para todo el sitio: ultra moderna, súper legible y geométrica
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Anaquelito -- Tu Aliado Dulcero B2B",
  description:
    "Mayoreo de dulces y botanas para tienditas, cafés y emprendedores en CDMX. Precios claros, margen visible en cada producto y reorden escaneando la bolsa vacía.",
};

import { ProveedorCarrito } from "@/componentes/carrito/ContextoCarrito";

export default function DisenoPrincipal({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfit.variable}`}>
      <body>
        <ProveedorCarrito>
          {children}
        </ProveedorCarrito>
      </body>
    </html>
  );
}
