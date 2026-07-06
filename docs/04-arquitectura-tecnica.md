# Arquitectura técnica

## Stack actual

- **Framework:** Next.js 16.2.10 (App Router). Ver `AGENTS.md` en la raíz — esta versión tiene cambios importantes respecto a versiones anteriores de Next.js; antes de tocar convenciones de rutas/archivos, revisar `node_modules/next/dist/docs/`.
- **UI:** React 19.2.4, sin librería de componentes todavía (estilos inline + variables CSS en `globals.css`).
- **Backend/datos:** Supabase (`@supabase/ssr`, `@supabase/supabase-js`). Cliente para browser en `src/lib/supabase/client.ts`, cliente para servidor (cookies) en `src/lib/supabase/server.ts`.
- **Lint:** ESLint 9 + `eslint-config-next`.
- **Tipado:** TypeScript 5.

## Estructura de carpetas (estado actual)

```
src/
  app/
    page.tsx           # Home
    layout.tsx          # Layout raíz, fuente Outfit, metadata
    globals.css          # Variables de marca (colores, radios, sombras)
    catalog/
      page.tsx           # Catálogo B2B (placeholder con productos hardcodeados)
    scanner/
      page.tsx           # Escáner de código de barras (placeholder visual, sin lógica de cámara real)
  lib/
    supabase/
      client.ts           # Cliente Supabase para componentes de cliente
      server.ts           # Cliente Supabase para server components (cookies)
```

## Decisiones técnicas ya tomadas

- **Supabase como backend** (auth + base de datos + probablemente storage para imágenes de producto). No se ha decidido el esquema de tablas todavía.
- **Sin librería de componentes UI todavía** — estilos inline. Esto es aceptable en esta etapa temprana, pero antes de escalar el catálogo real conviene decidir si se migra a Tailwind o similar (evitar seguir escribiendo estilos inline a mano en cada página).

## Decisiones técnicas pendientes

- **[PENDIENTE] Esquema de base de datos:** tablas mínimas necesarias — productos, precios por nivel, clientes, pedidos, líneas de crédito, códigos de barra por producto.
- **[PENDIENTE] Autenticación:** Supabase Auth para clientes B2B (login por negocio) — falta implementar el flujo de "Ingresar" que ya aparece en el botón del home.
- **[PENDIENTE] Escaneo real de cámara:** el placeholder en `src/app/escaner/page.tsx` no tiene lógica de cámara ni lectura de código de barras. Se necesita elegir una librería (ej. lectura vía `BarcodeDetector` API nativa del navegador con fallback a una librería JS como `@zxing/browser`).
- **[PENDIENTE] Pasarela de pago:** Stripe, Mercado Pago o Kueski — depende de la decisión de crédito en [03-modelo-de-negocio.md](03-modelo-de-negocio.md).
- **[PENDIENTE] Hosting/despliegue:** lo natural con Next.js es Vercel, pero confirmar si Supabase + Vercel es el combo final.

## Convenciones del proyecto

- Todo el código, comentarios (cuando los haya) y contenido de cara al usuario va en español.
- Todo lo que se agrega a este manual (`docs/`) también va en español.
- Antes de escribir código nuevo en este Next.js, revisar `AGENTS.md` — esta versión de Next.js puede diferir de lo que el modelo "sabe" por entrenamiento.
