-- Modelo comercial y confirmación segura de pagos para el lanzamiento.
begin;

alter table public.productos
  add column if not exists marca text,
  add column if not exists tipo_empaque text,
  add column if not exists imagenes text[] not null default '{}',
  add column if not exists destacado boolean not null default false,
  add column if not exists actualizado_en timestamptz not null default now();

alter table public.productos drop constraint if exists productos_disponibilidad_check;
update public.productos
set disponibilidad = case disponibilidad
  when 'disponible' then 'in_stock'
  when 'agotado' then 'out_of_stock'
  else 'unconfirmed'
end
where disponibilidad in ('por_confirmar', 'disponible', 'agotado');
alter table public.productos
  alter column disponibilidad set default 'unconfirmed',
  add constraint productos_disponibilidad_check check (
    disponibilidad in ('unconfirmed', 'in_stock', 'available_from_supplier', 'low_stock', 'out_of_stock')
  );

update public.productos set nombre = 'Gomilocas Pingüinos', marca = 'Ricolino' where slug = 'gomita-pinguino';
update public.productos set nombre = 'Gomilocas Dientes', marca = 'Ricolino' where slug = 'gomita-diente';
update public.productos set nombre = 'Panditas Clásicos', marca = 'Ricolino' where slug = 'gomita-oso';
update public.productos set nombre = 'Gomilocas Lombrices', marca = 'Ricolino' where slug = 'gomita-lombriz';
update public.productos set nombre = 'Gomilocas Huevitos', marca = 'Ricolino' where slug = 'huevito-pinto';
update public.productos set nombre = 'Bubulubu Ice', marca = 'Ricolino', tipo_empaque = 'caja' where slug = 'bubulubu-ice';
update public.productos set imagenes = array[imagen_url] where imagen_url is not null and cardinality(imagenes) = 0;

alter table public.pedidos
  add column if not exists pago_estado text not null default 'pendiente'
    check (pago_estado in ('pendiente', 'en_proceso', 'aprobado', 'rechazado', 'cancelado', 'reembolsado')),
  add column if not exists mercadopago_payment_id text,
  add column if not exists token_confirmacion uuid not null default gen_random_uuid(),
  add column if not exists actualizado_en timestamptz not null default now();
create unique index if not exists pedidos_token_confirmacion_unique on public.pedidos(token_confirmacion);
create unique index if not exists pedidos_mercadopago_payment_unique
  on public.pedidos(mercadopago_payment_id) where mercadopago_payment_id is not null;

commit;
