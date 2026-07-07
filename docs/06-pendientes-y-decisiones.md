# Pendientes y decisiones

Lista viva. Cuando algo se resuelve, se mueve a la bitácora ([05-bitacora-de-avance.md](05-bitacora-de-avance.md)) y se borra de aquí.

## Para activar YA (rápidas)

- [ ] **🔴 URGENTE — Revocar un token de GitHub expuesto.** Se encontró `[TOKEN-YA-REVOCADO-VER-BITACORA]` guardado en texto plano en `.git/config`. Ya se quitó del archivo, pero el token en sí sigue activo en GitHub hasta que lo revoques manualmente: [github.com/settings/tokens](https://github.com/settings/tokens) → busca ese token → Delete/Revoke.
- [x] ~~Llave `service_role` de Supabase~~ — ya la pasó Mauricio (2026-07-07), guardada en `.env.local`.
- [ ] **Mercado Pago sigue en pausa a propósito.** Mauricio pidió explícitamente no activarlo todavía (2026-07-07). El código ya existe en `src/app/api/checkout/route.ts`; falta solo `MERCADOPAGO_ACCESS_TOKEN` cuando decidan seguir con esto.
- [ ] **Número de WhatsApp del negocio**: confirmado como pendiente por Mauricio (2026-07-06, "por el momento no"). Cuando se tenga, configurarlo como `NEXT_PUBLIC_WHATSAPP_NUMERO` (formato internacional sin signos, ej. `5215512345678`) en `.env.local` y en Vercel. Con eso el botón "Enviar pedido por WhatsApp" del carrito queda funcionando y ya se pueden recibir pedidos reales.
- [ ] **Licencia de la tipografía PODIUM Sharp**: la versión importada en `globals.css` es un "DEMO" servido por un CDN de terceros (onlinewebfonts.com). Antes de lanzar hay que comprar la licencia comercial y servir la fuente desde nuestro propio proyecto, o elegir una fuente libre equivalente. Usar una fuente demo en un negocio real es una violación de licencia.
- [x] ~~Video de fondo de la portada con posible personaje con copyright~~ — ya se reemplazó por `public/dulces-loop.mp4` (video propio). Resuelto.

## Decisiones de negocio (necesitan a tu socio)

- [ ] Zona geográfica de lanzamiento (¿CDMX? ¿qué alcaldías/municipios primero?).
- [ ] Catálogo inicial curado: qué productos, con qué proveedor, costo por unidad, precio sugerido, margen.
- [ ] Montos exactos de los niveles de descuento (Nivel 1/2/3) y umbral de envío gratis.
- [ ] Política de crédito: monto máximo inicial, plazos, criterio de "cliente recurrente", proceso de cobranza.
- [ ] Definición del primer kit por segmento (Kit Tiendita, Kit Café) con precio y margen cerrado.
- [ ] Documento de sociedad: reparto de responsabilidades, decisiones, capital, salida — ver [07-legal-y-cumplimiento.md](07-legal-y-cumplimiento.md).

## Decisiones técnicas

- [ ] Flujo de autenticación (Supabase Auth) para el botón "Ingresar" del home, conectado a la tabla `clientes`. Una vez que exista, el checkout debería usar la sesión real en vez del checkout de invitado.
- [ ] Librería/estrategia real de lectura de código de barras para el escáner (`BarcodeDetector` nativo vs `@zxing/browser`).
- [x] Pasarela de pago: se eligió **Mercado Pago** como prioridad (Stripe queda para después). Integración construida en `src/app/api/checkout/route.ts`, falta activar con credenciales reales.
- [ ] Webhook de Mercado Pago para actualizar el estado del pedido automáticamente cuando se confirme el pago (hoy el pedido queda en "pendiente" hasta revisarlo a mano).
- [ ] Evaluar si se necesita una librería de componentes UI antes de que el catálogo crezca (hoy todo es estilo inline).
- [ ] **Distribución/envío**: falta decidir con el socio qué paquetería(s) usar y cómo se calcula el costo de envío. Por ahora el checkout dice "el envío se confirma por separado".
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
