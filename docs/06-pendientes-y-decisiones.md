# Pendientes y decisiones

Lista viva. Cuando algo se resuelve, se mueve a la bitácora ([05-bitacora-de-avance.md](05-bitacora-de-avance.md)) y se borra de aquí.

## Para activar YA (rápidas)

- [ ] **🔴 URGENTE — Revocar dos tokens de GitHub.** El original que quedó expuesto (empezaba `ghp_UxdU...`) y, por precaución, el más reciente (`ghp_xTrC...`) que también estuvo brevemente en texto plano en `.git/config`. Ambos ya se quitaron de los archivos, pero siguen activos en GitHub hasta que los revoques manualmente: [github.com/settings/tokens](https://github.com/settings/tokens) → busca cada uno → Delete/Revoke.
- [x] ~~Llave `service_role` de Supabase~~ — ya la pasó Mauricio (2026-07-07), guardada en `.env.local`.
- [ ] **Mercado Pago sigue en pausa a propósito.** El flujo y webhook ya existen. Para activarlo faltan `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_WEBHOOK_SECRET`, configurar la URL de webhook y habilitar `CHECKOUT_HABILITADO=true` + `NEXT_PUBLIC_CHECKOUT_HABILITADO=true` en Vercel.
- [ ] **Número de WhatsApp del negocio**: confirmado como pendiente por Mauricio (2026-07-06, "por el momento no"). Cuando se tenga, configurarlo como `NEXT_PUBLIC_WHATSAPP_NUMERO` (formato internacional sin signos, ej. `5215512345678`) en `.env.local` y en Vercel. Con eso el botón "Enviar pedido por WhatsApp" del carrito queda funcionando y ya se pueden recibir pedidos reales.
- [x] ~~Licencia de la tipografía PODIUM Sharp~~ — ya no se carga la fuente DEMO ni un CDN de terceros. El sitio usa Plus Jakarta Sans mediante `next/font`.
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
- [x] Webhook firmado de Mercado Pago construido para validar origen, consultar el pago y comprobar referencia, moneda y total antes de confirmar.
- [ ] Evaluar si se necesita una librería de componentes UI antes de que el catálogo crezca (hoy todo es estilo inline).
- [ ] **Distribución/envío**: falta decidir con el socio qué paquetería(s) usar y cómo se calcula el costo de envío. Por ahora el checkout dice "el envío se confirma por separado".
- [ ] **URGENTE antes de que la página desplegada funcione:** configurar en Vercel (Project Settings → Environment Variables) las dos variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` (los valores están en el `.env.local` local). Sin esto, el catálogo en producción no puede leer la base de datos.

## Construcción pendiente (frontend/producto)

### Iteración de claridad de compra — implementada en código

- [x] Navegación superior simplificada a Inicio, Productos, Cómo comprar, Ingresar/Mi cuenta y Carrito; enlaces informativos y legales en el pie.
- [x] Escáner, crédito, membresías, puntos, distribuidores y portal B2B avanzado retirados temporalmente del recorrido comercial. Permanecen documentados como arquitectura futura.
- Completar por producto las presentaciones comerciales reales (tipo de empaque, bolsas o piezas por caja, peso y mínimo) y, cuando se definan, precios de venta. El frontend ya calcula costo por pieza o bolsa desde los datos; no se deben escribir esos valores a mano en tarjetas.
- [x] Modelo técnico de disponibilidad separado en `in_stock`, `available_from_supplier`, `low_stock` y `out_of_stock`. Falta que el negocio capture el estado real de cada producto.
- Mantener compra como invitado y carrito persistente; activar WhatsApp y Mercado Pago Checkout Pro únicamente al confirmar teléfono, precios, envío y credenciales del negocio.
- [x] Capa de analítica preparada para vista de producto, agregar/eliminar carrito, checkout, compra confirmada por webhook, WhatsApp, inicio de sesión y registro. Falta configurar `NEXT_PUBLIC_GA_ID` para enviar a GA4.

- [x] URLs canónicas `/productos/[slug]`, redirección desde las URLs antiguas, metadata social, Product/Offer/BreadcrumbList/Organization, sitemap y robots.
- [x] Panel de cliente reducido a pedidos, datos personales y direcciones, con recompra real hacia el carrito.
- [x] Webhook firmado de Mercado Pago y confirmación por token opaco; el retorno de la pasarela no marca pagos como aprobados.

- [ ] Landings específicas por segmento ("Soy tiendita", "Soy café/restaurante", "Soy emprendedor").
- [x] Carrito persistente, drawer, checkout de invitado y creación de pedido construidos. Activación comercial pendiente de datos y credenciales.
- [ ] Escáner de código de barras funcional (hoy es solo una animación visual).
- [x] Cuenta básica: historial, recompra, datos personales y direcciones. Estado de cuenta/crédito queda fuera de V1.
- [x] Panel simple para alta y edición de productos.
- [x] Venta por caja y por tarima de 100 cajas; carrito y pedidos desglosan ambas presentaciones sin duplicar productos.
- [x] Panel administrativo completo para resumen, pedidos, productos y clientes; los administradores existentes pueden promover otra cuenta registrada por correo.
- [ ] Nombrar al primer administrador: registrar primero la cuenta del dueño y agregar su `auth_user_id` en `public.administradores` desde Supabase. Después, los siguientes permisos se asignan desde `/admin/clientes`.
- [ ] Página de "cómo funciona el crédito" con condiciones sin ambigüedad.
- [ ] Plan mínimo de contenido (blog/redes) para los primeros 90 días.
- [x] Reemplazar los 6 productos de ejemplo por el catálogo inicial acordado (Pingüino, Diente, Oso, Lombriz, Huevito Pinto y Bubulubu Ice). Las muestras anteriores se conservaron inactivas.
