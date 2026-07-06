import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anaquelito - Mayoreo Inteligente de Botanas",
  description: "Surte tu negocio con los mejores precios de mayoreo, sin salir de tu local. Entregas en 24 horas.",
};

export default function DisenoPrincipal({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${outfit.variable}`}>
        {children}
      </body>
    </html>
  );
}
