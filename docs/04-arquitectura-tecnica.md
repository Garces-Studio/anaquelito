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
    page.tsx             # Portada: carrusel de productos a pantalla completa (sin menús)
    layout.tsx           # Layout raíz: solo fuentes (Anton + Inter) y estilos globales
    globals.css          # 1) estilos de la portada  2) tema ".tema-tienda" para páginas interiores
    (tienda)/            # Grupo de ruta: páginas con encabezado + pie + tema cálido
      layout.tsx         # Envuelve con Encabezado, PieDePagina y .tema-tienda
      catalogo/
        page.tsx         # Catálogo con datos reales, filtros por categoría, búsqueda y margen visible
      escaner/
        page.tsx         # Escáner (vista previa honesta; cámara real pendiente)
  componentes/
    Encabezado.tsx       # Barra de navegación compartida
    PieDePagina.tsx      # Pie de página compartido
  lib/
    supabase/
      client.ts          # Cliente Supabase para componentes de cliente (crearCliente)
      server.ts          # Cliente Supabase para server components (crearCliente, usa cookies)
public/                  # Fotografías de producto (papas, mazapán, gomitas, paleta)
supabase/
  migrations/
    0001_esquema_inicial.sql          # Tablas + RLS
    0002_productos_de_ejemplo.sql     # Datos de prueba
    0003_margen_sugerido_y_seguridad.sql  # precio_sugerido_reventa + políticas RLS faltantes
```

## Diseño

- **Portada**: carrusel a pantalla completa con fotos reales de producto y fondo que cambia de color. No tiene menú: un solo llamado a la acción (CATÁLOGO).
- **Páginas interiores**: tema "mercado moderno" (`.tema-tienda` en `globals.css`) — papel cálido, tinta café, modo oscuro café tostado, tipografía Anton para títulos e Inter para texto.
- **Regla de oro del catálogo**: todo producto muestra su margen estimado ("le ganas ~X%"). Es el diferenciador frente a la competencia y no se quita sin decisión de los dos socios.

## Seguridad

- **RLS en todas las tablas** (ver migraciones 0001 y 0003).
- **Cabeceras HTTP** en `next.config.ts`: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` (cámara solo para el propio sitio, por el escáner).
- **Secretos**: solo en `.env.local` (ignorado por git). La llave que va al navegador es la pública (`anon`); la contraseña de la base de datos jamás se usa en el frontend.

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
