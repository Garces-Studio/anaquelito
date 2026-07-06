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
