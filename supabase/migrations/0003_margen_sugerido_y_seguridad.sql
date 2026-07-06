-- Migración 0003: precio sugerido de reventa (diferenciador clave) y correcciones de seguridad.
--
-- 1. El catálogo debe mostrar cuánto le gana la tiendita a cada producto
--    ("inviertes $75, lo revendes en $105"). Ningún competidor muestra esto.
-- 2. Correcciones de RLS detectadas en revisión de seguridad:
--    - La tabla `clientes` no tenía política de INSERT: un negocio nuevo
--      no podía registrarse.
--    - La tabla `pedido_items` no tenía política de INSERT: un cliente podía
--      crear el pedido pero no agregarle productos.

-- Diferenciador: precio sugerido de reventa por producto
alter table public.productos
  add column if not exists precio_sugerido_reventa numeric(10,2);

comment on column public.productos.precio_sugerido_reventa is
  'Precio al que se sugiere que el negocio revenda el producto. Sirve para mostrar el margen estimado en el catálogo.';

-- Seguridad: permitir que un usuario autenticado registre SU PROPIO negocio
-- (el auth_user_id debe ser el suyo; no puede crear registros a nombre de otros).
create policy "cliente registra su propio negocio" on public.clientes
  for insert with check (auth.uid() = auth_user_id);

-- Seguridad: permitir agregar artículos solo a pedidos propios que sigan pendientes
-- (una vez confirmado el pedido, ya no se le pueden meter artículos).
create policy "cliente agrega items a sus pedidos pendientes" on public.pedido_items
  for insert with check (
    pedido_id in (
      select p.id from public.pedidos p
      join public.clientes c on c.id = p.cliente_id
      where c.auth_user_id = auth.uid()
        and p.estado = 'pendiente'
    )
  );

-- Precios sugeridos de reventa para los productos de ejemplo
update public.productos set precio_sugerido_reventa = 105.00 where nombre = 'Cacahuate Japonés';
update public.productos set precio_sugerido_reventa = 130.00 where nombre = 'Gomitas Surtidas';
update public.productos set precio_sugerido_reventa = 210.00 where nombre = 'Chocolate de Mesa';
update public.productos set precio_sugerido_reventa = 112.00 where nombre = 'Semillas Enchiladas';
update public.productos set precio_sugerido_reventa = 150.00 where nombre = 'Palomitas Acarameladas';
update public.productos set precio_sugerido_reventa = 160.00 where nombre = 'Papas Fritas Caseras';
