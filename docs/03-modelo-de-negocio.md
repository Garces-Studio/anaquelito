# Modelo de negocio

Este documento define las reglas de negocio que la app tiene que reflejar. Todo lo marcado como **[PENDIENTE DE DEFINIR]** debe decidirse con tu socio antes de programarlo — no se inventa en el código.

## Segmentos y kits

- Tiendita de barrio / minisúper.
- Café, puesto de tacos, lonchería.
- Emprendedor de reventa (oficinas, escuelas, redes).

Cada segmento debería tener, a futuro, un kit de entrada con precio cerrado y margen sugerido (ej. "Kit Tiendita Básico: inviertes $X, vendiendo al precio sugerido ganas $Y"). **[PENDIENTE: definir productos y precios de los primeros 2-3 kits.]**

## Estructura de precios (propuesta, simple a propósito)

En vez de copiar la cascada confusa de K-Botanas, usar niveles claros:

- **Nivel 1 — Compra pequeña:** sin descuento.
- **Nivel 2 — Compra media:** 5% de descuento.
- **Nivel 3 — Compra grande:** 8-10% de descuento.
- **Envío gratis** a partir de un monto alcanzable para una tiendita promedio (no solo grandes distribuidores).

**[PENDIENTE: fijar los montos exactos de cada nivel y el umbral de envío gratis, según costos reales de envío y margen.]**

## Crédito

Regla de oro: **el crédito se gana, no se regala.** El riesgo de "pensamiento mágico" con el crédito es real — ver [02-analisis-competitivo.md](02-analisis-competitivo.md).

- Modelo operativo: el cliente pide, Anaquelito pide al proveedor con la línea de crédito que trae el socio, recibe producto, distribuye y cobra al cliente en plazos cortos (semanal/quincenal).
- Al inicio: crédito solo para clientes recurrentes con historial de compra; el resto paga contra entrega.
- Se necesita un panel simple (aunque sea manual al inicio) de quién debe, cuánto y cuándo.

**[PENDIENTE: definir monto máximo de línea de crédito inicial, plazo, y criterio exacto de "cliente recurrente" (¿cuántas compras? ¿en qué periodo?).]**

## Métodos de pago

Tarjeta, transferencia, depósito. Evaluar integración con Kueski Pay o Mercado Pago para meses sin intereses en vez de depender 100% de crédito propio para tickets chicos.

**[PENDIENTE: elegir pasarela de pago — ver decisión técnica relacionada en 04-arquitectura-tecnica.md.]**

## Flujo de pedido (objetivo a construir)

1. Cliente entra al sitio (o escanea código de barras para reordenar).
2. Selecciona productos / usa el carrito prellenado del reorden.
3. Elige método de envío (con estimador por código postal desde el checkout, no por mensaje manual).
4. Elige método de pago.
5. Confirmación.
6. Preparación y entrega.
7. Cobranza (si aplica crédito).

## Diferenciador operativo: reorden por escaneo

Ya en construcción (`src/app/escaner`). El cliente escanea el código de barras UPC de la bolsa/empaque vacío y el sistema lo agrega directo al carrito para reordenar. Esto ataca directamente la fricción del "flujo WhatsApp manual" que tiene K-Botanas.

**[PENDIENTE: decidir si el escaneo requiere una base de datos propia de UPCs de productos vendidos, o si se apoya en una API externa de códigos de barras.]**
