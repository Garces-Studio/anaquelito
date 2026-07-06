# Visión y estrategia — Anaquelito

## Qué es Anaquelito

Anaquelito es un proveedor B2B de dulces, botanas y frutos secos al mayoreo, enfocado en tienditas de barrio, cafés/puestos de comida y emprendedores de snacks. No competimos como "otra dulcería en línea": competimos como la forma más simple y rápida de resurtir un negocio pequeño.

**Marca:** Anaquelito (ya definida y en código, no se vuelve a discutir salvo razón de peso).
**Identidad visual:** coral/rojo (`#FF5A5F`) como color primario, amarillo energético (`#FFB400`) como secundario, teal de confianza (`#00A699`) como acento. Tipografía Outfit. Definido en `src/app/globals.css`.
**Propuesta de valor (tal como está en el código hoy):** "El aliado perfecto para surtir tu tiendita" — escanea tus productos sin stock, paga a meses sin intereses, recíbelo en tu puerta mañana mismo.

## Por qué esto le puede ganar a K-Botanas

K-Botanas (y la mayoría de mayoristas de dulces en México) tiene un negocio real y varias fortalezas: catálogo amplio, fabricación propia parcial, cobertura nacional y un modelo de distribuidor con crédito. Pero su ejecución digital es de plantilla genérica: navegación cargada, textos largos sin jerarquía, mensajes de descuento confusos (6%, 12%, 4% adicional...) y un flujo de alta a mayoreo que pasa por WhatsApp manual.

La ventaja de Anaquelito no es "una página más bonita". Es:

1. **Reorden sin fricción.** Escanear el código de barras de la bolsa vacía para repetir el pedido (ya en construcción en `src/app/escaner`). Nadie en la competencia tiene esto.
2. **Precios y crédito legibles.** Niveles simples, no una cascada de porcentajes condicionados.
3. **Segmentación real.** Mensajes y kits distintos para tiendita, café/restaurante y emprendedor — no un catálogo genérico para "todo mundo".
4. **Contenido y cercanía.** Aprovechar la ventaja de creador de contenido para enseñar a los dueños de tienditas a ganar más margen, algo que la competencia casi no hace.

## Lo que NO vamos a hacer (para no dispersarnos)

- No vamos a intentar cubrir 32 estados ni 700+ SKUs desde el día uno. Empezamos con una zona y un catálogo curado de alta rotación.
- No vamos a copiar diseño, copy o estructura de marca de K-Botanas — se aprende del modelo, no se clona.
- No vamos a construir una app nativa antes de validar el flujo web/WhatsApp con clientes reales.
- No vamos a dar crédito abierto sin historial de compra — ver [03-modelo-de-negocio.md](03-modelo-de-negocio.md).
- No vamos a apostar el canal principal a venta escolar (regulación SEP sobre alimentos en planteles la vuelve un canal delicado, no prohibido pero sí secundario).

## Segmentos objetivo (fase 1)

1. **Tienditas de la esquina / minisúper de barrio.**
2. **Cafés, puestos de tacos, loncherías.**
3. **Emprendedores que revenden snacks** (oficinas, escuelas, redes).

Cada uno necesita, eventualmente, su propia landing de entrada ("Soy tiendita", "Soy café", "Soy emprendedor") — ver pendiente en [06-pendientes-y-decisiones.md](06-pendientes-y-decisiones.md).

## Zona de lanzamiento

Pendiente de confirmar con tu socio (dado que él trae el contacto de proveedor). Ver [06-pendientes-y-decisiones.md](06-pendientes-y-decisiones.md).
