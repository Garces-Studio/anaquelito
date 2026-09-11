# Segmentos de negocio

## Qué son

Tres páginas estáticas que explican cómo Anaquelito ayuda a tienditas, cafés/fondas y personas que revenden, sin depender de precios, cobertura o condiciones todavía no confirmadas.

## Archivos y rutas

- `src/app/(tienda)/para/[segmento]/page.tsx`
- `/para/tienditas`, `/para/cafes` y `/para/reventa`
- `src/app/(tienda)/mayoreo/page.tsx` enlaza las tres opciones.
- `src/app/sitemap.ts` publica las rutas para buscadores.

## Funcionamiento

`SEGMENTOS` centraliza el título, descripción, icono y necesidades de cada público. `generateStaticParams` crea las tres rutas durante la compilación; cualquier segmento desconocido devuelve 404. `generateMetadata` entrega título y descripción propios para cada página.

Las páginas reutilizan las clases `b2b` existentes y llevan al catálogo o a la explicación de mayoreo. No consultan Supabase, no muestran precios y no habilitan cobros.
