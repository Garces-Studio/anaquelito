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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://anaquelito.vercel.app"),
  title: "Dulces y botanas al mayoreo para tu negocio | Anaquelito",
  description:
    "Compra dulces por caja para surtir tu tiendita, dulcería o negocio de reventa. Consulta presentaciones, precios y entrega según cobertura en Anaquelito.",
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
import Analitica from "@/componentes/Analitica";

export default function DisenoPrincipal({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${jakarta.variable}`}>
      <body>
        <Analitica />
        <ProveedorCarrito>
          <Encabezado />
          {children}
          <CajonCarrito />
        </ProveedorCarrito>
      </body>
    </html>
  );
}
