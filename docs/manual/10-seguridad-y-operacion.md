# Seguridad, pedidos y experiencia móvil — etapa 1

## Implementado el 11 de septiembre de 2026

- Migración `0015_pedidos_atomicos.sql` aplicada a Supabase tras pruebas con rollback y respaldo del esquema público (estructura y datos). El respaldo es local, privado y no está en Git; no sustituye un respaldo integral de Auth, Storage ni una prueba de restauración.
- Creación atómica de pedido, líneas, copia de dirección/presentación y reserva de stock. Bloqueos por producto en orden estable; RPC accesibles sólo con service role.
- Clave persistente por intento de checkout y huella calculada en servidor; el navegador no fija los precios. Reutilización de preferencia guardada y clave de idempotencia enviada al SDK de Mercado Pago.
- Aplicación de pagos bajo bloqueo del pedido: descuentos de inventario únicos, notificaciones anteriores ignoradas, estados logísticos preservados y reembolsos del pago correcto registrados.
- Registro administrativo de cambios en precios, stock, pedidos y permisos. Los eventos desde service role se identifican como servicio del sistema; no atribuirlos a una persona concreta. Pantalla `/admin/actividad` con los últimos 100 eventos.
- Límites persistentes de registro, recuperación y checkout. IP procesada con HMAC, sin guardarla en claro. La disponibilidad depende de la RPC; si no responde, la operación falla cerrada.
- `/recuperar-contrasena`, callback PKCE `/auth/recuperar` y `/restablecer-contrasena`. La entrega real requiere SMTP y la URL de redirección autorizada en Supabase. No se enviaron correos reales durante las pruebas.
- Accesos móviles Productos/Carrito/Mi cuenta, catálogo compacto, campos táctiles, menor desenfoque y video del Home sin descargar en móvil. Efectos pausados fuera de pantalla y video pausado al ocultar pestaña.
- Catálogo público con caché de 60 segundos; precios y existencias vuelven a validarse al crear el pedido. Las ediciones administrativas invalidan caché; cambios directos en Supabase pueden tardar hasta su siguiente revalidación.

## Verificación

`tests/pedidos-transacciones.sql` se ejecuta dentro de `BEGIN`/`ROLLBACK`. Verifica repetición del pedido, stock insuficiente, reserva única, envío sin pago, pago repetido, conservación de enviado, pago ajeno rechazado, reembolso, snapshots, límites y permisos de funciones. No envía cobros.

Las pruebas de lectura JSON cubren respuesta vacía, HTML, null, arreglo, error del servidor y éxito. Se verifican compilación de producción y pantallas móviles.

## Pendiente antes de activar cobros

1. Conciliación y liberación de reservas abandonadas. No se liberan con un temporizador: un pago pendiente podría aprobarse después. La cancelación administrativa de pedidos con reserva queda bloqueada hasta confirmar el cierre en la pasarela y devolver la reserva en una operación controlada.
2. Pruebas integrales de Mercado Pago en sandbox, incluyendo reintentos de creación de preferencia tras respuesta incierta, pagos duplicados y reembolsos. El soporte del SDK para una clave no sustituye verificar el comportamiento de la API.
3. Configuración de correo y verificación completa del enlace de recuperación. Confirmación de correo en registro y MFA administrativo aún pendientes; el registro conserva por ahora su política anterior de confirmación automática.
4. Registro más corto, selector compacto Caja/Tarima, seguimiento de envío, correos de pedido y alertas de inventario.
5. Respaldos automáticos completos, restauración en un entorno aislado y auditoría RLS con cuentas de prueba.
6. Medición de Core Web Vitals en dispositivos reales. Se optimizó código, pero no se afirma una mejora porcentual ni una puntuación de rendimiento todavía.

Los pagos continúan deshabilitados hasta completar estos puntos y confirmar precios, cobertura y credenciales comerciales.
