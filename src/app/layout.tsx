import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Fuente principal y ÚNICA para todo el sitio (títulos y textos):
// Plus Jakarta Sans — moderna, elegante y muy legible. La sirve Next
// directamente (sin CSS externo), así que carga rápido en móvil.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-principal",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Anaquelito -- Tu Aliado Dulcero B2B",
  description:
    "Mayoreo de dulces y botanas para tienditas, cafés y emprendedores en CDMX. Precios claros, margen visible en cada producto y reorden escaneando la bolsa vacía.",
};

// Ajustes de pantalla para móvil (enfoque iPhone): ocupa hasta el borde del
// notch/Dynamic Island (viewportFit cover + safe-areas en globals.css) y pinta
// la barra del navegador del color crema de la marca.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FFF6EC",
};

import { ProveedorCarrito } from "@/componentes/carrito/ContextoCarrito";
import CajonCarrito from "@/componentes/carrito/CajonCarrito";
import Encabezado from "@/componentes/Encabezado";

export default function DisenoPrincipal({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${jakarta.variable}`}>
      <body>
        <ProveedorCarrito>
          <Encabezado />
          {children}
          <CajonCarrito />
        </ProveedorCarrito>
      </body>
    </html>
  );
}
