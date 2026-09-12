# Seguridad, pedidos y experiencia móvil

## Correcciones de cierre — estado vigente

- Migración 0018 aplicada con respaldo público privado y pruebas con rollback: los administradores sólo pueden actualizar estado logístico y datos de envío, nunca pagos ni inventario reservado directamente.
- Corrección de la etapa 2: una cancelación NO demuestra que Mercado Pago haya cerrado el cobro. Cualquier pedido con clave de checkout, preferencia, enlace o pago conserva su reserva hasta disponer de conciliación de pasarela. La liberación automática sólo admite pedidos manuales sin intentos de pago. Sigue pendiente implementar y probar el cierre remoto en sandbox.
- El servidor consulta `es_admin()` con el JWT validado por la base para autorizar operaciones; el nivel leído de la sesión sólo informa la interfaz.
- Catálogo: las filas activas reales incluyen productos nuevos; los desactivados no reaparecen como borradores. El borrado administrativo invalida la caché.
- Cuenta: total comprado suma pagos aprobados; recompra usa precios actuales y el historial conserva los nombres comprados. Los fallos de conexión al guardar perfil/dirección muestran mensajes recuperables.
- Los campos opcionales de registro se abren automáticamente si contienen un dato inválido que requiere corrección.
- El resumen administrativo muestra alertas por cobros a revisar, stock agotado o bajo y productos con precio/presentación/disponibilidad pendientes. Se calculan con existencias libres (stock menos reserva); no se inventa un umbral de stock bajo. Son avisos en el panel, no correos.

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

### Direcciones guardadas

El panel del cliente permite editar, eliminar con confirmación y elegir una dirección principal. `PATCH/DELETE /api/direcciones` exige sesión y origen propio. La función `gestionar_direccion` (migración 0019) verifica propiedad y serializa estas operaciones por cliente. Eliminar la principal selecciona otra disponible; los pedidos históricos conservan su dirección original. Las políticas CRUD anteriores permanecen: no se añade un índice global de principal única.

En checkout, «Usar los datos de mi cuenta» carga explícitamente negocio, teléfono y direcciones desde `GET /api/cuenta`, sin caché pública. Se puede elegir una dirección y ajustar los datos antes de enviar. Comprar como invitado sigue disponible cuando se habiliten los cobros. No se activan pagos con este cambio.

`tests/direcciones-transacciones.sql` comprueba propiedad, edición, elección y sustitución de principal, eliminación y restricción anónima dentro de una transacción revertida. La migración 0019 se aplicó con respaldo previo del esquema público.

`tests/pedidos-transacciones.sql` se ejecuta dentro de `BEGIN`/`ROLLBACK`. Verifica repetición del pedido, stock insuficiente, reserva única, envío sin pago, pago repetido, conservación de enviado, pago ajeno rechazado, reembolso, snapshots, límites y permisos de funciones. No envía cobros.

Las pruebas de lectura JSON cubren respuesta vacía, HTML, null, arreglo, error del servidor y éxito. Se verifican compilación de producción y pantallas móviles.

## Pendiente antes de activar cobros

1. Pruebas integrales de Mercado Pago en sandbox, incluyendo reintentos de creación de preferencia tras respuesta incierta, pagos duplicados y reembolsos. El soporte del SDK para una clave no sustituye verificar el comportamiento de la API.
2. Configuración de correo y verificación completa del enlace de recuperación. La confirmación de correo en registro conserva por ahora su política anterior hasta contar con SMTP probado.
3. Correos de pedido y alertas de inventario, una vez configurado el proveedor de correo.
4. Respaldos automáticos completos, restauración en un entorno aislado y auditoría RLS con cuentas reales controladas.
5. Medición de Core Web Vitals en dispositivos reales. Se optimizó código, pero no se afirma una mejora porcentual ni una puntuación de rendimiento todavía.

Los pagos continúan deshabilitados hasta completar estos puntos y confirmar precios, cobertura y credenciales comerciales.

## Etapa 2 implementada el 11 de septiembre de 2026

- Migración `0016_mfa_y_conciliacion.sql`: las políticas administrativas ahora exigen una sesión `aal2`. Una cuenta incluida en `administradores` debe activar TOTP desde `/seguridad-administrador` y escribir el código de seis dígitos antes de abrir `/admin`.
- La cancelación administrativa libera una reserva no cobrada y cambia pedido e inventario en la misma transacción. Un pedido que ya descontó mercancía se bloquea hasta confirmar devolución o reembolso; no se repone automáticamente.
- Los pedidos guardan paquetería, número de guía, enlace HTTPS de rastreo y fechas de envío/entrega. El administrador los captura en Pedidos y el cliente los ve en su panel.
- Migración `0017_eventos_de_pago.sql`: cada intento de Mercado Pago queda registrado con su propio orden temporal. Un rechazo de un intento no puede ocultar la aprobación de otro. Un segundo cobro aprobado o un pago posterior a una cancelación se marca para revisión humana y jamás descuenta inventario dos veces.
- El registro conserva sólo cuatro conceptos esenciales: nombre de la persona, nombre del negocio, correo y contraseña; teléfono y domicilio son opcionales. El acceso permanece exclusivamente por correo para evitar alias duplicados y simplificar recuperación y soporte.
- Antes de cada migración se creó y validó un respaldo privado del esquema público. Las pruebas se ejecutaron dentro de transacciones revertidas y después contra el esquema aplicado; no crearon cuentas reales ni enviaron cobros.

## Pendiente externo antes de activar cobros

1. Configurar SMTP y las URLs permitidas de Supabase, confirmar el correo de registro y probar recuperación con un buzón controlado. El CLI local no tiene una sesión de administración de Supabase, por lo que no se modificó esa configuración externa.
2. Crear la primera cuenta real del dueño, agregarla a `public.administradores` y completar personalmente el QR de doble verificación. Al momento de aplicar esta etapa, Auth no tenía cuentas reales.
3. Probar Mercado Pago con credenciales sandbox: aprobación, rechazo, reintento, reembolso y alerta por cobro adicional. Los cobros siguen apagados.
4. Definir paquetería, costo, cobertura, precios finales y WhatsApp. Los campos de seguimiento existen, pero no se inventaron reglas comerciales.
5. Automatizar respaldos integrales y probar restauración aislada. Los respaldos actuales cubren `public`, no Auth ni Storage.
