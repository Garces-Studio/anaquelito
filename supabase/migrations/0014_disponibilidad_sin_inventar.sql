-- Corrección para instalaciones donde 0013 ya se aplicó: un estado anterior
-- "por confirmar" no equivale a existencia confirmada con el proveedor.
begin;
alter table public.productos drop constraint if exists productos_disponibilidad_check;
alter table public.productos alter column disponibilidad set default 'unconfirmed';
update public.productos set disponibilidad = 'unconfirmed' where disponibilidad = 'available_from_supplier';
alter table public.productos add constraint productos_disponibilidad_check check (
  disponibilidad in ('unconfirmed', 'in_stock', 'available_from_supplier', 'low_stock', 'out_of_stock')
);
commit;
