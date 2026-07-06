# Pendientes y decisiones

Lista viva. Cuando algo se resuelve, se mueve a la bitácora ([05-bitacora-de-avance.md](05-bitacora-de-avance.md)) y se borra de aquí.

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
