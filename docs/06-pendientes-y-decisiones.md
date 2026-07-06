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

- [ ] Esquema de base de datos en Supabase (productos, precios por nivel, clientes, pedidos, códigos de barra).
- [ ] Flujo de autenticación (Supabase Auth) para el botón "Ingresar" del home.
- [ ] Librería/estrategia real de lectura de código de barras para el escáner.
- [ ] Pasarela de pago a integrar (Stripe / Mercado Pago / Kueski).
- [ ] Evaluar si se necesita una librería de componentes UI antes de que el catálogo crezca (hoy todo es estilo inline).

## Construcción pendiente (frontend/producto)

- [ ] Landings específicas por segmento ("Soy tiendita", "Soy café/restaurante", "Soy emprendedor").
- [ ] Catálogo conectado a datos reales (hoy son 6 productos hardcodeados).
- [ ] Carrito y checkout completo.
- [ ] Portal de cliente B2B (historial de pedidos, reorden, estado de cuenta).
- [ ] Página de "cómo funciona el crédito" con condiciones sin ambigüedad.
- [ ] Plan mínimo de contenido (blog/redes) para los primeros 90 días.

## Preguntas abiertas para ti (Mauricio)

- [ ] ¿Confirmamos que solo se trabajará este proyecto conmigo (Claude Code) para evitar conflictos con Antigravity/Codex, o van a dividir tareas explícitamente entre herramientas? (ver recomendación en el chat — evitar tocar los mismos archivos desde dos asistentes distintos sin sincronizar).
