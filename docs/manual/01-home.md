# 01 — Home / Portada

> Actualización vigente (2026-09-11): el Home conserva íntegros su video, grano, color dinámico, entradas y carrusel 3D con las seis imágenes definitivas. La composición de productos y su tarjeta se elevó dentro del halo para corregir su centro visual. El recorrido público se limita a Inicio, Productos, Cómo comprar, cuenta y carrito. La tarjeta que promovía el escáner ahora atiende Eventos y dirige al catálogo; el escáner continúa construido pero queda fuera del lanzamiento. No se publican precios, mínimos, tiempos ni cobertura hasta confirmarlos.

## 1. Qué es

La página de entrada del sitio (`/`). Es una landing de venta: un carrusel a pantalla completa con los productos estrella, seguido de tres secciones de contenido (qué es Anaquelito, simulador de margen de ganancia, cómo funciona el proceso de compra) y el pie de página. No tiene barra lateral ni menú dentro del propio componente — la navegación superior la pone el layout raíz (`Encabezado`), que es global a todo el sitio.

Es la única página que **no** vive dentro del grupo de ruta `(tienda)`, así que no hereda el layout de tienda (`.tema-tienda`) — tiene su propio fondo y tipografía de carrusel.

## 2. Archivo(s) involucrados

- `src/app/page.tsx` — ensambla la portada, el pie y el schema Organization.
- `src/componentes/HomeExperiencia.tsx` — experiencia interactiva del Home y carrusel.
- `src/app/layout.tsx` — layout raíz: fuente Plus Jakarta Sans, `ProveedorCarrito`, `Encabezado`.
- `src/app/globals.css` — clases usadas por el hero: `.portada-grid`, `.portada-col-info`, `.portada-col-carrusel`, `.tagline-hero`, `.titulo-hero`, `.subtexto-hero`, `.fila-cta-hero`, `.fila-stats-hero`, `.controles-carrusel-premium`, `.grain-overlay`, `.video-overlay`, `.animate-fade-*`.
- `src/componentes/PieDePagina.tsx` — se importa y se renderiza al final, envuelto en un `div.tema-tienda` solo para que el pie tome el tema cálido de las páginas interiores aunque el resto del Home no lo use.
- Assets públicos: `/dulces-loop.mp4`, `/anaquelito-logo.png` y las seis imágenes transparentes de `public/productos/`.

## 3. Estructura del contenido (de arriba a abajo)

1. **Hero / carrusel (`<main>`, pantalla completa, `100vh`)**
   - Video de fondo en loop (`mixBlendMode: overlay`, opacidad 0.15) + degradado oscuro + capa de grano analógico (`.grain-overlay`) para look premium.
   - Columna izquierda: propuesta de valor, botones a Productos y Cómo comprar y promesas verificables sin estadísticas inventadas.
   - Columna derecha: carrusel 3D de 6 productos (`ESCENAS`), con controles de flecha izquierda/derecha y el nombre + descripción del producto activo.
   - El color de fondo del `<main>` cambia según el producto activo (`DULCES[activeIndex].bg`), con transición suave.
2. **Sección "¿Qué es Anaquelito?"** — 4 tarjetas de categoría (frutos secos, gomitas, chocolates, fritos) en grid responsive, con Tailwind.
3. **Sección de recorridos** — Productos, Cómo comprar y Eventos; todos llevan a funciones disponibles de V1.
4. **Sección de proceso** — resume una compra clara sin asegurar datos comerciales pendientes.
5. **Pie de página** — `<PieDePagina />`.

## 4. Estado y lógica

Todo el estado vive en `HomeExperiencia`, no hay fetch a Supabase en esta página — los datos del carrusel (`ESCENAS`) están definidos como constante al inicio del archivo.

- `activo` (`useState<number>`) — índice del producto activo entre las seis escenas.
- `moviendo` (`useState<boolean>`) — bloquea activaciones repetidas durante la transición de 650 ms.
- `navegar(paso)` — avanza o retrocede circularmente y funciona con los botones y con las flechas izquierda/derecha del teclado.
- `rol(indice)` — asigna `centro`, `izquierda`, `derecha` o `fondo`; CSS controla posición, escala, desenfoque y opacidad.
- Un `IntersectionObserver` pausa efectos fuera de pantalla. El video solo recibe su archivo y se reproduce en escritorio, cuando el Home es visible y el usuario no pidió reducir movimiento.

## 5. Estilos

Mezcla deliberada de dos sistemas:

- **Hero (carrusel):** estilos inline en JSX + clases custom definidas a mano en `globals.css` (`.portada-grid`, `.controles-carrusel-premium`, etc.). Se hizo así porque las animaciones y el posicionamiento 3D del carrusel necesitan cálculos dinámicos (posición según rol) que no son prácticos en clases utilitarias estáticas.
- **Secciones de contenido (about, simulador, cómo funciona):** Tailwind CSS 4 puro (`bg-[#FFF6EC]`, `grid grid-cols-1 sm:grid-cols-2`, etc.), con colores hardcodeados en hex directamente en las clases en vez de tokens de tema.
- Toda la tipografía usa una sola fuente real (Plus Jakarta Sans, cargada en `layout.tsx`) — las variables `--font-podium`, `--font-anton`, `--font-kanit`, etc. en `globals.css` son alias que apuntan todas a `--font-principal`; son nombres heredados de un diseño anterior con varias fuentes que ya no existen como archivos separados, solo quedaron los nombres de clase.

## 6. Enlaces salientes

- `Ver catálogo` → `/catalogo`
- `Cómo comprar` → `/#como-comprar` y `/mayoreo`
- `Eventos` → `/catalogo`

## 7. Pendientes / ideas de mejora

> Ajuste de cierre (2026-09-11): el Home agrega `PieDePagina` dentro de `.tema-tienda.home-pie`. Este contenedor debe conservar `min-height: 0` y el footer `margin-top: 0`; de otra forma hereda la altura mínima general de `.tema-tienda` y aparece un bloque café vacío después del contenido legal.

- **Código muerto:** `IMAGENES_PRODUCTOS`, `EMOJI_CATEGORIA` y `NOMBRE_CATEGORIA` no se usan en este archivo — o se conectan a algo (ej. mostrar categorías reales) o se eliminan.
- **Video de fondo:** no tiene `poster` ni manejo de fallback si `/dulces-loop.mp4` no carga (conexiones lentas en móvil, que es el público objetivo del negocio). Vale la pena revisar peso del archivo de video.
- [x] **Accesibilidad del carrusel:** tiene nombre accesible, foco visible, navegación con flechas del teclado, botones etiquetados y una región `aria-live` que anuncia el producto activo.
- **Duplicación de estilo por rol:** `obtenerEstiloRol` repite casi toda la estructura entre móvil y escritorio con solo los números distintos — se podría simplificar a una tabla de valores por rol/dispositivo en vez de dos `switch` completos.
- **Estadísticas fijas:** "1.1M+ tienditas", "24 hrs", "~40% margen" están hardcodeadas en el JSX; si cambian con el tiempo, hoy requieren tocar código en vez de un dato centralizado.
- **Datos del carrusel hardcodeados:** `DULCES` no viene de Supabase — si el catálogo real cambia de producto estrella, hay que editar este archivo a mano en vez de que salga de la base de datos real que ya usa el catálogo (`/catalogo`).
