-- Solo el servidor debe crear pedidos y fijar precios/estados.
-- Las políticas anteriores permitían insertar directamente un pedido
-- "confirmado" o artículos con un precio elegido por el comprador.
begin;
drop policy if exists "cliente crea sus propios pedidos" on public.pedidos;
drop policy if exists "cliente agrega items a sus pedidos pendientes" on public.pedido_items;
drop policy if exists "cliente registra su propio negocio" on public.clientes;
-- Crear cuentas ya ocurre en la API de servidor con service_role.
-- Se conservan lectura del propietario y actualización de estado para admin.
commit;
