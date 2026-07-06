import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async headers() {
    return [
      {
        // Cabeceras de seguridad para todas las rutas
        source: "/(.*)",
        headers: [
          // Evita que el sitio se incruste en iframes de otros dominios (clickjacking)
          { key: "X-Frame-Options", value: "DENY" },
          // Evita que el navegador adivine tipos de contenido (MIME sniffing)
          { key: "X-Content-Type-Options", value: "nosniff" },
          // No filtrar la URL completa a sitios externos
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Bloquear APIs sensibles que no usamos (la cámara sí se usará en /escaner)
          { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
