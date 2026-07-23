# 01 — Home / Portada

## 1. Qué es

La página de entrada del sitio (`/`). Es una landing de venta: un carrusel a pantalla completa con los productos estrella, seguido de tres secciones de contenido (qué es Anaquelito, simulador de margen de ganancia, cómo funciona el proceso de compra) y el pie de página. No tiene barra lateral ni menú dentro del propio componente — la navegación superior la pone el layout raíz (`Encabezado`), que es global a todo el sitio.

Es la única página que **no** vive dentro del grupo de ruta `(tienda)`, así que no hereda el layout de tienda (`.tema-tienda`) — tiene su propio fondo y tipografía de carrusel.

## 2. Archivo(s) involucrados

- `src/app/page.tsx` — toda la página (componente `Inicio`), es un Client Component (`'use client'`).
- `src/app/layout.tsx` — layout raíz: fuente Plus Jakarta Sans, `ProveedorCarrito`, `Encabezado`.
- `src/app/globals.css` — clases usadas por el hero: `.portada-grid`, `.portada-col-info`, `.portada-col-carrusel`, `.tagline-hero`, `.titulo-hero`, `.subtexto-hero`, `.fila-cta-hero`, `.fila-stats-hero`, `.controles-carrusel-premium`, `.grain-overlay`, `.video-overlay`, `.animate-fade-*`.
- `src/componentes/PieDePagina.tsx` — se importa y se renderiza al final, envuelto en un `div.tema-tienda` solo para que el pie tome el tema cálido de las páginas interiores aunque el resto del Home no lo use.
- Assets públicos: `/dulces-loop.mp4` (video de fondo del hero) y `/papas.png`, `/mazapan.png`, `/gomitas.png`, `/paleta.png` (imágenes del carrusel, en `public/`).

## 3. Estructura del contenido (de arriba a abajo)

1. **Hero / carrusel (`<main>`, pantalla completa, `100vh`)**
   - Video de fondo en loop (`mixBlendMode: overlay`, opacidad 0.15) + degradado oscuro + capa de grano analógico (`.grain-overlay`) para look premium.
   - Columna izquierda: tagline, título en 3 líneas ("SURTE. AHORRA. CRECE."), subtexto, dos botones (`Ver catálogo` → `/catalogo`, `Escanear producto` → `/escaner`) y una fila de 3 estadísticas fijas (1.1M+ tienditas, 24 hrs de entrega, ~40% margen).
   - Columna derecha: carrusel 3D de 4 productos (`DULCES`), con controles de flecha izquierda/derecha y el nombre + descripción del producto activo.
   - El color de fondo del `<main>` cambia según el producto activo (`DULCES[activeIndex].bg`), con transición suave.
2. **Sección "¿Qué es Anaquelito?"** — 4 tarjetas de categoría (frutos secos, gomitas, chocolates, fritos) en grid responsive, con Tailwind.
3. **Sección "Simulador de ganancias"** — texto de argumento de venta (margen 40%-65%) a la izquierda y una tarjeta de "factura de ejemplo" a la derecha mostrando precio mayoreo vs. reventa sugerida.
4. **Sección "Cómo funciona"** — 3 pasos numerados (Elige tu pedido → Recibe en tu local → Reordena escaneando) con iconos de `lucide-react`.
5. **Pie de página** — `<PieDePagina />`.

## 4. Estado y lógica

Todo el estado vive en el propio componente `Inicio`, no hay fetch a Supabase en esta página — los datos del carrusel (`DULCES`) están hardcodeados como constante al inicio del archivo.

- `activeIndex` (`useState<number>`) — índice del producto activo en el carrusel (0 a 3).
- `isAnimating` (`useState<boolean>`) — bloquea clicks repetidos mientras dura la transición (650ms) para no romper la animación.
- `isMobile` (`useState<boolean>`) — se recalcula en un `useEffect` con listener de `resize` (`window.innerWidth < 768`); se usa para servir un set de estilos distinto al carrusel en móvil vs. escritorio (tamaños y posiciones distintas, ver `obtenerEstiloRol`).
- Un segundo `useEffect` precarga las 4 imágenes del carrusel con `new Image()` al montar, para que no haya parpadeo al navegar.
- `navegar('next' | 'prev')` — avanza/retrocede el índice de forma circular (`% 4`) y arma el flag `isAnimating` con un `setTimeout` de 650ms (debe coincidir con la duración de transición en CSS, es un valor mágico compartido entre JS y CSS — si se cambia la duración de transición hay que cambiar los dos lugares).
- `obtenerRol(indice)` — traduce el índice a un rol visual (`center`, `left`, `right`, `back`) relativo al `activeIndex`, para que las tarjetas del carrusel roten visualmente.
- `obtenerEstiloRol(rol)` — devuelve el objeto de estilos inline (posición, escala, blur, opacidad) según el rol y si es móvil o no.

**Nota:** los objetos `IMAGENES_PRODUCTOS`, `EMOJI_CATEGORIA` y `NOMBRE_CATEGORIA` están declarados en este archivo (líneas 39-64) pero **no se usan en ningún lugar del componente** — parecen residuo de una versión anterior de la página o preparación para algo que no se conectó. Candidatos a limpieza (ver sección 7).

## 5. Estilos

Mezcla deliberada de dos sistemas:

- **Hero (carrusel):** estilos inline en JSX + clases custom definidas a mano en `globals.css` (`.portada-grid`, `.controles-carrusel-premium`, etc.). Se hizo así porque las animaciones y el posicionamiento 3D del carrusel necesitan cálculos dinámicos (posición según rol) que no son prácticos en clases utilitarias estáticas.
- **Secciones de contenido (about, simulador, cómo funciona):** Tailwind CSS 4 puro (`bg-[#FFF6EC]`, `grid grid-cols-1 sm:grid-cols-2`, etc.), con colores hardcodeados en hex directamente en las clases en vez de tokens de tema.
- Toda la tipografía usa una sola fuente real (Plus Jakarta Sans, cargada en `layout.tsx`) — las variables `--font-podium`, `--font-anton`, `--font-kanit`, etc. en `globals.css` son alias que apuntan todas a `--font-principal`; son nombres heredados de un diseño anterior con varias fuentes que ya no existen como archivos separados, solo quedaron los nombres de clase.

## 6. Enlaces salientes

- `Ver catálogo` → `/catalogo`
- `Escanear producto` → `/escaner`
- `Explorar margen en catálogo` (sección simulador) → `/catalogo`

## 7. Pendientes / ideas de mejora

- **Código muerto:** `IMAGENES_PRODUCTOS`, `EMOJI_CATEGORIA` y `NOMBRE_CATEGORIA` no se usan en este archivo — o se conectan a algo (ej. mostrar categorías reales) o se eliminan.
- **Video de fondo:** no tiene `poster` ni manejo de fallback si `/dulces-loop.mp4` no carga (conexiones lentas en móvil, que es el público objetivo del negocio). Vale la pena revisar peso del archivo de video.
- **Accesibilidad:** los botones de flecha del carrusel sí tienen `aria-label`, pero el carrusel no es navegable por teclado (flechas del teclado) ni anuncia el cambio de producto a lectores de pantalla (`aria-live`).
- **Duplicación de estilo por rol:** `obtenerEstiloRol` repite casi toda la estructura entre móvil y escritorio con solo los números distintos — se podría simplificar a una tabla de valores por rol/dispositivo en vez de dos `switch` completos.
- **Estadísticas fijas:** "1.1M+ tienditas", "24 hrs", "~40% margen" están hardcodeadas en el JSX; si cambian con el tiempo, hoy requieren tocar código en vez de un dato centralizado.
- **Datos del carrusel hardcodeados:** `DULCES` no viene de Supabase — si el catálogo real cambia de producto estrella, hay que editar este archivo a mano en vez de que salga de la base de datos real que ya usa el catálogo (`/catalogo`).
