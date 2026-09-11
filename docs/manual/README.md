# Manual técnico de páginas — Anaquelito

Este manual documenta **cómo funciona cada página del sitio** a nivel de código: qué archivo la implementa, qué componentes y datos usa, cómo se comporta en pantalla y qué falta o se puede mejorar. Es el complemento técnico del manual de negocio en [`docs/MANUAL.md`](../MANUAL.md).

Está pensado para que cualquier programador (tú, tu socio, o alguien nuevo) pueda abrir un archivo aquí y entender una pantalla completa sin tener que leer todo el código primero.

**Regla:** cuando se modifique una página de forma importante, se actualiza su archivo correspondiente aquí.

## Índice de páginas

| # | Página | Ruta en el sitio | Archivo | Estado del manual |
|---|---|---|---|---|
| 01 | Home / Portada | `/` | `src/app/page.tsx` | ✅ Documentada |
| 02 | Catálogo | `/catalogo` | `src/app/(tienda)/catalogo/page.tsx` | ✅ Catálogo mayorista profesional documentado |
| 03 | Detalle de producto | `/productos/[slug]` | `src/app/(tienda)/productos/[slug]/page.tsx` | ✅ Ficha comercial profesional documentada |
| 04 | Escáner | `/escaner` | `src/app/(tienda)/escaner/page.tsx` | ⏳ Pendiente |
| 05 | Carrito | `/carrito` | `src/app/(tienda)/carrito/page.tsx` | ✅ Funcional y rediseño premium; activación de pago pendiente |
| 06 | Checkout | `/checkout` | `src/app/(tienda)/checkout/page.tsx` | ✅ Construido, pago desactivado |
| 07 | Confirmación de compra | `/checkout/confirmacion` | `src/app/(tienda)/checkout/confirmacion/page.tsx` | ✅ Verificación segura construida |
| 08 | Crear cuenta | `/crear-cuenta` | `src/app/(tienda)/crear-cuenta/page.tsx` | ✅ Flujo profesional, validación guiada y respuesta segura |
| 09 | Iniciar sesión | `/iniciar-sesion` | `src/app/(tienda)/iniciar-sesion/page.tsx` | ✅ Rediseño profesional verificado en escritorio y móvil |
| 10 | Dashboard / Mi cuenta | `/dashboard` | `src/app/(tienda)/dashboard/page.tsx` | ✅ Pedidos, recompra, datos, direcciones y seguridad |
| 11 | Panel admin | `/admin` | `src/app/(tienda)/admin/page.tsx` | ✅ Resumen operativo |
| 12 | Admin — productos | `/admin/productos` | `src/app/(tienda)/admin/productos/page.tsx` | ✅ Altas, edición, precios, disponibilidad e imágenes |
| 13 | Admin — pedidos | `/admin/pedidos` | `src/app/(tienda)/admin/pedidos/page.tsx` | ✅ Consulta y cambio de estado |
| 14 | Admin — clientes | `/admin/clientes` | `src/app/(tienda)/admin/clientes/page.tsx` | ✅ Clientes, compras, direcciones y permisos admin |

## Piezas compartidas (no son páginas, pero las usan varias)

| Pieza | Archivo | Para qué sirve |
|---|---|---|
| Layout raíz | `src/app/layout.tsx` | Carga la fuente única del sitio (Plus Jakarta Sans), metadatos, viewport móvil y envuelve todo en el `ProveedorCarrito` + `Encabezado` |
| Layout de tienda | `src/app/(tienda)/layout.tsx` | Envuelve las páginas interiores con el tema visual y agrega el pie global; el catálogo conserva su composición inmersiva |
| Encabezado | `src/componentes/Encabezado.tsx` | Barra de navegación global, visible en todas las páginas |
| Pie de página | `src/componentes/PieDePagina.tsx` | Pie nocturno compartido con logo, propuesta mayorista, navegación, soporte y CTA al catálogo |
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
