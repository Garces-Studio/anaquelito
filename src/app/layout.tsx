import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";

// Tipografía de títulos: display condensada con energía de cartel de mercado
const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

// Tipografía de texto: limpia y muy legible en celular
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anaquelito — Surte tu tiendita con dulces y botanas de alto margen",
  description:
    "Mayoreo de dulces y botanas para tienditas, cafés y emprendedores en CDMX. Precios claros, margen visible en cada producto y reorden escaneando la bolsa vacía.",
};

import { ProveedorCarrito } from "@/componentes/carrito/ContextoCarrito";

// Diseño raíz: solo fuentes y estilos globales. La portada (carrusel) va a
// pantalla completa sin menús; las páginas de la tienda agregan su encabezado
// y pie propios en src/app/(tienda)/layout.tsx.
export default function DisenoPrincipal({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${anton.variable} ${inter.variable}`}>
      <body>
        <ProveedorCarrito>
          {children}
        </ProveedorCarrito>
      </body>
    </html>
  );
}
