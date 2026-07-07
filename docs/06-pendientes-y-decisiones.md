# Pendientes y decisiones

Lista viva. Cuando algo se resuelve, se mueve a la bitácora ([05-bitacora-de-avance.md](05-bitacora-de-avance.md)) y se borra de aquí.

## Para activar YA (rápidas)

- [ ] **Número de WhatsApp del negocio**: confirmado como pendiente por Mauricio (2026-07-06, "por el momento no"). Cuando se tenga, configurarlo como `NEXT_PUBLIC_WHATSAPP_NUMERO` (formato internacional sin signos, ej. `5215512345678`) en `.env.local` y en Vercel. Con eso el botón "Enviar pedido por WhatsApp" del carrito queda funcionando y ya se pueden recibir pedidos reales.
- [ ] **Licencia de la tipografía PODIUM Sharp**: la versión importada en `globals.css` es un "DEMO" servido por un CDN de terceros (onlinewebfonts.com). Antes de lanzar hay que comprar la licencia comercial y servir la fuente desde nuestro propio proyecto, o elegir una fuente libre equivalente. Usar una fuente demo en un negocio real es una violación de licencia.
- [ ] **⚠️ Revisar el video de fondo de la portada por posible infracción de propiedad intelectual.** Parece mostrar una Tortuga Ninja (personaje registrado de Paramount/Nickelodeon). Si no hay licencia explícita para ese clip, hay que reemplazarlo antes de mostrar el sitio a nadie fuera del equipo — el riesgo no es de diseño, es legal (derechos de autor/marca).

## Decisiones de negocio (necesitan a tu socio)

- [ ] Zona geográfica de lanzamiento (¿CDMX? ¿qué alcaldías/municipios primero?).
- [ ] Catálogo inicial curado: qué productos, con qué proveedor, costo por unidad, precio sugerido, margen.
- [ ] Montos exactos de los niveles de descuento (Nivel 1/2/3) y umbral de envío gratis.
- [ ] Política de crédito: monto máximo inicial, plazos, criterio de "cliente recurrente", proceso de cobranza.
- [ ] Definición del primer kit por segmento (Kit Tiendita, Kit Café) con precio y margen cerrado.
- [ ] Documento de sociedad: reparto de responsabilidades, decisiones, capital, salida — ver [07-legal-y-cumplimiento.md](07-legal-y-cumplimiento.md).

## Decisiones técnicas

- [ ] Flujo de autenticación (Supabase Auth) para el botón "Ingresar" del home, conectado a la tabla `clientes`.
- [ ] Librería/estrategia real de lectura de código de barras para el escáner (`BarcodeDetector` nativo vs `@zxing/browser`).
- [ ] Pasarela de pago a integrar (Stripe / Mercado Pago / Kueski).
- [ ] Evaluar si se necesita una librería de componentes UI antes de que el catálogo crezca (hoy todo es estilo inline).
- [ ] **URGENTE antes de que la página desplegada funcione:** configurar en Vercel (Project Settings → Environment Variables) las dos variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` (los valores están en el `.env.local` local). Sin esto, el catálogo en producción no puede leer la base de datos.

## Construcción pendiente (frontend/producto)

- [ ] Landings específicas por segmento ("Soy tiendita", "Soy café/restaurante", "Soy emprendedor").
- [ ] Carrito y checkout completo (tablas `pedidos`/`pedido_items` ya existen, falta la lógica y la UI).
- [ ] Escáner de código de barras funcional (hoy es solo una animación visual).
- [ ] Portal de cliente B2B (historial de pedidos, reorden, estado de cuenta).
- [ ] Panel simple para dar de alta productos sin tocar SQL directamente.
- [ ] Página de "cómo funciona el crédito" con condiciones sin ambigüedad.
- [ ] Plan mínimo de contenido (blog/redes) para los primeros 90 días.
- [ ] Reemplazar los 6 productos de ejemplo por el catálogo curado real, una vez definido.
