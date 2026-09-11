# Crear cuenta

## Qué es

La página `/crear-cuenta` registra clientes mayoristas y deja preparados sus datos para pedidos y entregas futuras.

## Estructura

1. **Tu negocio:** nombre, teléfono y tipo (`tiendita`, `cafe` o `emprendedor`).
2. **Entrega:** calle, colonia, municipio, estado y código postal.
3. **Acceso seguro:** correo, contraseña y confirmación.

## Funcionamiento

El formulario valida los campos obligatorios antes de enviar información a `/api/crear-cuenta`. Después del registro inicia sesión mediante Supabase y dirige al cliente a `/dashboard`. Si la URL contiene un pedido y su token, también se envían para vincular esa compra.

La respuesta se lee primero como texto y solo se interpreta como JSON cuando es válido. Esto evita que una respuesta vacía o interrumpida muestre el error técnico `Unexpected end of JSON input`. La ruta del servidor también captura fallos inesperados y siempre devuelve un mensaje JSON entendible.

## Diseño y accesibilidad

La pantalla usa un panel de beneficios y un formulario luminoso de tres pasos. En móvil se ocultan las tarjetas secundarias del panel introductorio para llevar al usuario al formulario más rápido. Los tipos de negocio usan `aria-pressed`; la contraseña puede mostrarse u ocultarse y los errores se anuncian con `role="alert"`.

Cuando falta un dato obligatorio o es incorrecto, la página resalta el campo, desplaza la vista hasta él, coloca ahí el foco y muestra una notificación flotante. Al corregir el campo desaparece su estado de error.

## Regla importante

Los identificadores de tipo de negocio forman parte del contrato con la base de datos. El texto visible puede cambiar, pero no deben renombrarse `tiendita`, `cafe` o `emprendedor` sin una migración coordinada.
