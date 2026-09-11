# Crear cuenta

## Qué es

La página `/crear-cuenta` registra clientes mayoristas y deja preparados sus datos para pedidos y entregas futuras.

## Estructura

1. **Datos esenciales:** nombre del negocio, tipo, correo y contraseña.
2. **Datos opcionales:** teléfono y dirección se despliegan sólo si la persona quiere completarlos en ese momento; también se pueden agregar desde el panel.

## Funcionamiento

El formulario valida los tres conceptos obligatorios antes de enviar información a `/api/crear-cuenta`: negocio, correo y contraseña (con su confirmación visual). Después del registro inicia sesión mediante Supabase y dirige al cliente a `/dashboard`. Si la URL contiene un pedido y su token, también se envían para vincular esa compra.

La respuesta se lee primero como texto y solo se interpreta como JSON cuando es válido. Esto evita que una respuesta vacía o interrumpida muestre el error técnico `Unexpected end of JSON input`. La ruta del servidor también captura fallos inesperados y siempre devuelve un mensaje JSON entendible.

## Diseño y accesibilidad

La pantalla usa un panel de beneficios y un formulario luminoso corto. En móvil se ocultan las tarjetas secundarias del panel introductorio para llevar al usuario al formulario más rápido. Los tipos de negocio usan `aria-pressed`; la contraseña puede mostrarse u ocultarse y los errores se anuncian con `role="alert"`.

Cuando falta un dato obligatorio o es incorrecto, la página resalta el campo, desplaza la vista hasta él, coloca ahí el foco y muestra una notificación flotante. Al corregir el campo desaparece su estado de error.

## Regla importante

Desde la etapa de seguridad del 11 de septiembre, la API limita intentos repetidos mediante una ventana persistente en Supabase. Recuperar acceso está disponible desde `/iniciar-sesion`; requiere configurar entrega de correo y redirección de Supabase antes de verificarlo con una cuenta real. Ver `10-seguridad-y-operacion.md`.

Los identificadores de tipo de negocio forman parte del contrato con la base de datos. El texto visible puede cambiar, pero no deben renombrarse `tiendita`, `cafe` o `emprendedor` sin una migración coordinada.
