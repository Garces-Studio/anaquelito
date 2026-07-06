# Bitácora de avance

Registro cronológico de lo que se ha construido. Agregar una entrada nueva (fecha + resumen) cada vez que se cierre un bloque de trabajo relevante — no hace falta registrar cada commit, sí cada hito.

## 2026-07-06

- Se crea la carpeta `docs/` con el manual del proyecto (este documento y sus hermanos), consolidando la investigación de mercado y el estado técnico existente hasta ahora.
- Estado del código al momento de escribir esto (heredado de sesiones previas, no creado hoy):
  - Proyecto Next.js 16 llamado **Anaquelito**, con identidad de marca ya definida (colores coral/amarillo/teal, tipografía Outfit).
  - Home (`src/app/page.tsx`) con hero y propuesta de valor.
  - Catálogo placeholder (`src/app/catalogo/page.tsx`) con productos hardcodeados, sin datos reales.
  - Escáner placeholder (`src/app/escaner/page.tsx`) — UI de "cámara activada" simulada, sin lógica real de lectura de código de barras.
  - Cliente y servidor de Supabase configurados (`src/lib/supabase/`), sin esquema de base de datos definido todavía ni uso real en las páginas.
- Sin commits nuevos de código en esta sesión; solo documentación.

## 2026-07-06 (continuación)

- **Nombre de marca decidido:** el proyecto se llama **Anaquelito** (antes "KrujiBox" era solo nombre de trabajo). Se actualizó en todo el código (`layout.tsx`, `page.tsx`, `package.json`) y en todos los documentos de `docs/`.
- Se limpiaron archivos de plantilla sin uso: SVGs de ejemplo en `public/` y `src/app/page.module.css` (no se usaban en ningún lado).
- Se renombraron las rutas del inglés al español: `src/app/catalog` → `src/app/catalogo`, `src/app/scanner` → `src/app/escaner`.
- Se conectó la navegación del home (`page.tsx`) a `/catalogo` y `/escaner` con `next/link` (antes eran botones sin destino).
- README traducido y simplificado para que el socio no técnico lo entienda.
- Se decidió trabajar únicamente con Claude Code de aquí en adelante (se dejan de usar Antigravity/Codex en paralelo) para evitar conflictos de edición simultánea, que sí llegaron a ocurrir en esta misma sesión.
- Se conecta el repositorio local a GitHub: `github.com/Garces-Studio/anaquelito`.

## 2026-07-06 (base de datos real)

- **Supabase conectado de verdad.** Proyecto real: `hdyvbsowyotiojlukkbl`. Se usó el connection string del **Session pooler** (`aws-0-us-east-1.pooler.supabase.com:5432`) porque la conexión directa de Supabase es solo IPv6 y esta red no tenía ruta IPv6.
- Se creó la primera migración real (`supabase/migrations/0001_esquema_inicial.sql`) con 6 tablas: `clientes`, `productos`, `codigos_barra`, `pedidos`, `pedido_items`, `lineas_credito`. Todas con seguridad a nivel de fila (RLS): el catálogo es de lectura pública, todo lo demás solo lo ve el dueño del registro.
- Se agregaron productos de ejemplo (`supabase/migrations/0002_productos_de_ejemplo.sql`) para poder probar el catálogo con datos reales.
- Se conectó `src/app/catalogo/page.tsx` a Supabase de verdad (antes tenía 6 productos inventados a mano). Ya lee de la tabla `productos` en vivo.
- `.env.local` configurado con la URL y la llave pública (`anon`/`publishable`) reales del proyecto. La contraseña de la base de datos vive solo en `.env.local` (no se sube a git).
- Se hizo una reinstalación limpia de `node_modules` porque había quedado corrupta (un paquete con configuración inválida rompía `next lint`); ahora el servidor de desarrollo levanta sin problema.
- Se agregó `.claude/launch.json` para poder levantar el servidor de desarrollo desde las herramientas de previsualización.
- Se corrigió una advertencia de Next.js sobre "múltiples lockfiles" fijando `turbopack.root` en `next.config.ts`.
- Probado en navegador real: home → navega a catálogo → catálogo muestra productos reales de la base de datos (Cacahuate Japonés $75, Gomitas Surtidas $92, etc.).
- Pendiente todavía: autenticación de clientes, flujo de pedido/carrito completo, escáner de código de barras funcional, y despliegue confirmado en Vercel con las variables de entorno de Supabase configuradas ahí también.
