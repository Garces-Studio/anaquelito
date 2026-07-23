# Manual técnico de páginas — Anaquelito

Este manual documenta **cómo funciona cada página del sitio** a nivel de código: qué archivo la implementa, qué componentes y datos usa, cómo se comporta en pantalla y qué falta o se puede mejorar. Es el complemento técnico del manual de negocio en [`docs/MANUAL.md`](../MANUAL.md).

Está pensado para que cualquier programador (tú, tu socio, o alguien nuevo) pueda abrir un archivo aquí y entender una pantalla completa sin tener que leer todo el código primero.

**Regla:** cuando se modifique una página de forma importante, se actualiza su archivo correspondiente aquí.

## Índice de páginas

| # | Página | Ruta en el sitio | Archivo | Estado del manual |
|---|---|---|---|---|
| 01 | Home / Portada | `/` | `src/app/page.tsx` | ✅ Documentada |
| 02 | Catálogo | `/catalogo` | `src/app/(tienda)/catalogo/page.tsx` | ⏳ Pendiente |
| 03 | Detalle de producto | `/catalogo/[id]` | `src/app/(tienda)/catalogo/[id]/page.tsx` | ⏳ Pendiente |
| 04 | Escáner | `/escaner` | `src/app/(tienda)/escaner/page.tsx` | ⏳ Pendiente |
| 05 | Carrito | `/carrito` | `src/app/(tienda)/carrito/page.tsx` | ⏳ Pendiente |
| 06 | Checkout | `/checkout` | `src/app/(tienda)/checkout/page.tsx` | ⏳ Pendiente |
| 07 | Confirmación de compra | `/checkout/confirmacion` | `src/app/(tienda)/checkout/confirmacion/page.tsx` | ⏳ Pendiente |
| 08 | Crear cuenta | `/crear-cuenta` | `src/app/(tienda)/crear-cuenta/page.tsx` | ⏳ Pendiente |
| 09 | Iniciar sesión | `/iniciar-sesion` | `src/app/(tienda)/iniciar-sesion/page.tsx` | ⏳ Pendiente |
| 10 | Dashboard / Mi cuenta | `/dashboard` | `src/app/(tienda)/dashboard/page.tsx` | ⏳ Pendiente |
| 11 | Panel admin | `/admin` | `src/app/(tienda)/admin/page.tsx` | ⏳ Pendiente |
| 12 | Admin — productos | `/admin/productos` | `src/app/(tienda)/admin/productos/page.tsx` | ⏳ Pendiente |
| 13 | Admin — pedidos | `/admin/pedidos` | `src/app/(tienda)/admin/pedidos/page.tsx` | ⏳ Pendiente |

## Piezas compartidas (no son páginas, pero las usan varias)

| Pieza | Archivo | Para qué sirve |
|---|---|---|
| Layout raíz | `src/app/layout.tsx` | Carga la fuente única del sitio (Plus Jakarta Sans), metadatos, viewport móvil y envuelve todo en el `ProveedorCarrito` + `Encabezado` |
| Layout de tienda | `src/app/(tienda)/layout.tsx` | Envuelve las páginas interiores (todo menos Home) con el tema visual `.tema-tienda` y el pie de página |
| Encabezado | `src/componentes/Encabezado.tsx` | Barra de navegación global, visible en todas las páginas |
| Pie de página | `src/componentes/PieDePagina.tsx` | Pie de página compartido |
| Carrito (contexto) | `src/componentes/carrito/ContextoCarrito.tsx` | Estado global del carrito de compra (React Context), disponible en todo el sitio |
| Estilos globales | `src/app/globals.css` | Variables de fuente, tema de colores, clases custom de la portada y el tema `.tema-tienda` |

## Convención de cada archivo de este manual

Cada archivo de página sigue esta estructura:

1. **Qué es** — una frase de qué hace la página y a quién le sirve.
2. **Archivo(s) involucrados** — rutas exactas.
3. **Estructura del contenido** — secciones/bloques visuales de arriba a abajo.
4. **Estado y lógica** — qué `useState`/`useEffect` o datos externos usa y por qué.
5. **Estilos** — de dónde vienen (Tailwind, clases custom, inline) y dónde tocar si hay que cambiar algo visual.
6. **Enlaces salientes** — a qué otras páginas lleva y con qué botones.
7. **Pendientes / ideas de mejora** — observaciones técnicas honestas, no solo descripción.
