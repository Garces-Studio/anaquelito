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
    escaner/
      page.tsx           # Escáner de código de barras (placeholder visual, sin lógica de cámara real)
  lib/
    supabase/
      client.ts           # Cliente Supabase para componentes de cliente (crearCliente)
      server.ts           # Cliente Supabase para server components (crearCliente, usa cookies)
supabase/
  migrations/
    0001_esquema_inicial.sql   # Tablas: clientes, productos, codigos_barra, pedidos, pedido_items, lineas_credito + RLS
    0002_productos_de_ejemplo.sql
```

## Base de datos (Supabase) — ya conectada

- Proyecto real: `hdyvbsowyotiojlukkbl` (`https://hdyvbsowyotiojlukkbl.supabase.co`).
- Conexión desde herramientas locales/CLI usa el **Session pooler** (`aws-0-us-east-1.pooler.supabase.com:5432`), no la conexión directa — la conexión directa de Supabase es IPv6 únicamente y puede fallar en redes sin soporte IPv6.
- 6 tablas creadas con seguridad a nivel de fila (RLS) activada: `clientes`, `productos`, `codigos_barra`, `pedidos`, `pedido_items`, `lineas_credito`. El catálogo (`productos`, `codigos_barra`) es de lectura pública; todo lo demás requiere que el usuario autenticado sea el dueño del registro.
- Las migraciones viven en `supabase/migrations/` y se pueden volver a aplicar con `psql <connection-string> -f supabase/migrations/archivo.sql`.
- Credenciales reales en `.env.local` (no se sube a git): URL pública, llave `anon`/`publishable`, y `SUPABASE_DB_URL` (solo para scripts locales, nunca se usa en el navegador).

## Decisiones técnicas ya tomadas

- **Supabase como backend** (auth + base de datos + probablemente storage para imágenes de producto). No se ha decidido el esquema de tablas todavía.
- **Sin librería de componentes UI todavía** — estilos inline. Esto es aceptable en esta etapa temprana, pero antes de escalar el catálogo real conviene decidir si se migra a Tailwind o similar (evitar seguir escribiendo estilos inline a mano en cada página).

## Decisiones técnicas pendientes

- **[PENDIENTE] Autenticación:** Supabase Auth para clientes B2B (login por negocio) — falta implementar el flujo de "Ingresar" que ya aparece en el botón del home, y conectarlo con la tabla `clientes`.
- **[PENDIENTE] Escaneo real de cámara:** el placeholder en `src/app/escaner/page.tsx` no tiene lógica de cámara ni lectura de código de barras. Se necesita elegir una librería (ej. lectura vía `BarcodeDetector` API nativa del navegador con fallback a una librería JS como `@zxing/browser`), y conectarla con la tabla `codigos_barra`.
- **[PENDIENTE] Carrito y checkout:** falta toda la lógica de armar un pedido (`pedidos` + `pedido_items`) desde el catálogo y el escáner.
- **[PENDIENTE] Pasarela de pago:** Stripe, Mercado Pago o Kueski — depende de la decisión de crédito en [03-modelo-de-negocio.md](03-modelo-de-negocio.md).
- **[PENDIENTE] Variables de entorno en Vercel:** el proyecto ya está desplegado en Vercel, pero falta confirmar que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` estén configuradas ahí también (en local ya funcionan vía `.env.local`).
- **[PENDIENTE] Panel de administración del catálogo:** hoy los productos solo se pueden agregar con SQL directo; hace falta una pantalla simple para que el socio no técnico pueda dar de alta productos sin tocar código.

## Convenciones del proyecto

- Todo el código, comentarios (cuando los haya) y contenido de cara al usuario va en español.
- Todo lo que se agrega a este manual (`docs/`) también va en español.
- Antes de escribir código nuevo en este Next.js, revisar `AGENTS.md` — esta versión de Next.js puede diferir de lo que el modelo "sabe" por entrenamiento.
