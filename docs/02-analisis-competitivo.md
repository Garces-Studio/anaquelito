# Análisis competitivo (resumen ejecutable)

Este documento resume la investigación de mercado hecha antes de empezar a construir. El reporte completo y extenso vive en el historial de chat / documentos externos del usuario; aquí solo queda lo que sirve para tomar decisiones de producto.

## K-Botanas — el competidor principal

- Dulcería/mayorista con matriz en Pachuca, sucursales en Pachuca y Cuautitlán Izcalli. Envíos a todo México.
- Vende desde 1 kg en línea, 100 g en tienda física. Catálogo grande (~300-700 productos según la fuente).
- Modelo híbrido: fabricación propia parcial (línea "K-Gomitas" y otras) + catálogo multimarcas + programa de distribuidores con crédito y zona.
- Membresía gratuita con 12% de descuento permanente, más descuentos adicionales por volumen (confuso: 6-12%, +4% en compras >$5,000, envío gratis desde 27 kg).
- Crédito vía Kueski Pay (externo, no propio): 4 quincenas sin intereses.
- Calculadoras públicas de ahorro (mayorista) y de ganancias (distribuidor) — su marketing vende negocio, no solo producto.

**Debilidades explotables:** UX de plantilla Shopify genérica, navegación sobrecargada, comunicación de descuentos confusa, sin segmentación real por tipo de cliente, sin app propia, crédito dependiente de un tercero, catálogo con inconsistencias (categorías duplicadas/vacías).

## Otros competidores relevantes

| Competidor | Rasgo distintivo |
|---|---|
| Dulces a Granel | Se presenta como la tienda de dulces más grande de México, catálogo enorme |
| Azúcar Dulcerías | Estructura de descuentos clara (5% >$2,500, 9% >$10,000), envío gratis desde $500, buen soporte/FAQs |
| Superdulces | Mayoreo con foco en revendedores/piñaterías/eventos, fuerte estacionalidad |
| Botanas Lily | Fabricante + distribución, 10% descuento >$1,000, relato de "directo de fábrica" |
| Dulcerías Denny | +130 marcas, fuerte en temporadas, presencia física en Guanajuato/Querétaro |
| Súper Dulces | Umbral único y simple: 9% en compras >$10,000 — más fácil de entender que K-Botanas |
| Central en Línea | Referencia de UX: compra por pieza/gramos/kilo con precios unitarios claros |

**Patrón del mercado:** todos compiten con surtido + descuento por volumen + estacionalidad. Casi ninguno tiene una experiencia digital moderna, reorden fácil o contenido educativo serio.

## Análisis en vivo de k-botanas.com (6 de julio de 2026)

Revisión directa de su página de inicio, con lo que encontramos y cómo lo atacamos:

| Lo que hace K-Botanas | Debilidad | Cómo lo atacamos en Anaquelito |
|---|---|---|
| Hero genérico: "SOMOS LA MEJOR BOTANA" | Frase de autoelogio, no le dice nada al cliente | Portada visual de producto + catálogo directo; el mensaje habla del negocio del cliente, no de nosotros |
| 3 rutas de entrada (antojo / negocio / distribuidor) | Bien pensado, pero enterrado en texto largo | Navegación de 2 clics: portada → catálogo con margen visible |
| Membresía 12% + descuentos por volumen encimados | El cliente no sabe cuánto va a pagar | Precio de mayoreo directo + margen estimado en cada tarjeta de producto |
| Descuentos "31-55%" con precios tachados | Táctica de rebaja inflada, genera desconfianza | Precio real sin teatro; la etiqueta "le ganas ~40%" vende más que un tachado |
| Calculadora de ganancias para distribuidores | Buena idea, ejecución intimidante (muchos campos) | Nuestro margen ya viene calculado por producto, sin que el cliente haga nada |
| Proceso de compra en 5 pasos explicados | 5 pasos son muchos | Reorden por escáner: 30 segundos |
| Pagos: PayPal (tarjeta con 24h de procesamiento), transferencia, depósito | 24 horas para procesar una tarjeta es una eternidad | Pasarela moderna con confirmación inmediata (pendiente de elegir) |
| Imágenes rotas (placeholders GIF que no cargan) | Descuido visible que resta confianza | Fotografía de producto cuidada (ya en proceso con los PNG de la portada) |

## Lección de precios

La claridad gana sobre la complejidad. Un solo umbral simple (como Súper Dulces) comunica mejor que una cascada de porcentajes condicionados (como K-Botanas). Ver la estructura propuesta en [03-modelo-de-negocio.md](03-modelo-de-negocio.md).

## Tamaño de mercado (contexto, no un plan de acción)

- Más de 1.1 millones de unidades económicas en "Comercio al por Menor de Abarrotes y Alimentos" (Data México / DENUE).
- eCommerce en México ~941 mil millones de pesos en 2026, 77.2 millones de compradores (AMVO).

## Riesgos de sesgo a vigilar (auditoría honesta)

1. **Sesgo de confirmación:** la ventaja técnica/UX es real, pero la batalla de fondo es logística, márgenes, cobranza y servicio — no diseño. No confundir superioridad técnica con superioridad de negocio.
2. **Optimismo excesivo con el crédito:** dar crédito sin datos claros de margen, cartera vencida y capacidad operativa puede quemar caja. El modelo de crédito debe ser conservador y con reglas escritas — ver [03-modelo-de-negocio.md](03-modelo-de-negocio.md) y [07-legal-y-cumplimiento.md](07-legal-y-cumplimiento.md).
