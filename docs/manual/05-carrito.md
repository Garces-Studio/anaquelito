# Carrito

## Qué es

La página `/carrito` permite revisar el pedido antes del checkout: cantidades por caja, tarimas de 100 cajas, subtotal y estado de pago.

## Archivo y datos

- Página: `src/app/(tienda)/carrito/page.tsx`.
- Estado: `usarCarrito()` desde `ContextoCarrito`.
- Reglas de tarima: `CAJAS_POR_TARIMA` y `desgloseCajas()` en `src/lib/mayoreo.ts`.

## Estados visuales

- Vacío: explicación breve, producto de marca y acceso al catálogo.
- Con artículos: cabecera oscura luminosa, una tarjeta por producto y resumen fijo en escritorio.
- El control de cantidad modifica cajas; “+ 1 tarima” suma 100 cajas sin cambiar la unidad interna.
- Si el pago web no está habilitado se muestra un aviso honesto, sin simular una compra disponible.

## Seguridad y pendientes

Los precios visibles no son autoridad para el servidor: el checkout vuelve a obtener precios desde la base de datos. Falta activar credenciales y configuración comercial de pago para habilitar el botón final.
