# Detalle de producto

## Qué es

La ruta `/productos/[slug]` convierte cada producto del catálogo en una ficha comercial clara para comprar por caja o por tarima.

## Archivos involucrados

- `src/app/(tienda)/productos/[slug]/page.tsx`: consulta el producto, metadatos, ficha y datos estructurados.
- `src/componentes/GaleriaProducto.tsx`: presenta la fotografía principal.
- `src/componentes/carrito/BotonAgregar.tsx`: agrega cajas o tarimas al carrito.

## Estructura

1. Regreso al catálogo.
2. Panel principal con fotografía, marca, disponibilidad, nombre y descripción.
3. Bloque oscuro con precio por caja y equivalencia de la tarima de 100 cajas.
4. Acción de compra o aviso de precio pendiente.
5. Tarjetas de presentación, logística y compra protegida.

## Datos y seguridad

El producto se busca por `slug` entre los registros activos. Si no existe se muestra la página 404. Los metadatos y el JSON-LD usan el mismo registro y solo publican precio cuando es válido.

## Diseño

La ficha comparte el lenguaje visual del catálogo: fondo cálido, luces coral/turquesa, vidrio suave, fotografía con profundidad y un bloque de decisión con contraste alto. Funciona en una columna en móvil y dos en escritorio.

## Pendiente comercial

- Completar descripciones finales y cualquier dato regulatorio aplicable.
- Confirmar precios y existencias.
- Activar cobro y cobertura de entrega.
