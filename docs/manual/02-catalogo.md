# Catálogo

## Qué es

La página `/catalogo` es el escaparate mayorista de Anaquelito. Explica rápidamente la modalidad de compra y presenta los seis productos activos con búsqueda, precio y acciones de compra.

## Archivos involucrados

- `src/app/(tienda)/catalogo/page.tsx`: obtiene los productos y construye la portada comercial.
- `src/componentes/CatalogoMayoreo.tsx`: búsqueda, resultados y tarjetas.
- `src/componentes/carrito/BotonAgregar.tsx`: compra por caja o por tarima de 100 cajas.
- `src/componentes/PieDePagina.tsx`: cierre comercial y navegación global.

## Estructura

1. Hero iluminado con la propuesta “Productos que sí merecen espacio en tu anaquel”.
2. Resumen de compra por caja, tarimas de 100 y entrega por confirmar.
3. Buscador por nombre, marca o categoría.
4. Cuadrícula de productos con fotografía, disponibilidad, presentación, precio y acceso a la ficha.
5. Footer nocturno con CTA para seguir explorando.

## Datos y comportamiento

La página intenta leer productos activos desde Supabase. Si la consulta falla, usa el catálogo local de respaldo para no dejar el escaparate vacío. La búsqueda se ejecuta en el navegador y actualiza el número de resultados. Mientras los precios no estén confirmados, la interfaz lo indica sin inventar importes.

## Diseño y accesibilidad

El catálogo usa fondo cálido, un hero ciruela con luces coral y turquesa, tarjetas claras y contraste alto en los botones. Las animaciones son decorativas y respetan las reglas globales de movimiento reducido.

## Pendiente comercial

- Confirmar precios finales por caja.
- Confirmar disponibilidad y cobertura de entrega.
- Definir si habrá descuento adicional por tarima.
- Activar el método de pago elegido.
