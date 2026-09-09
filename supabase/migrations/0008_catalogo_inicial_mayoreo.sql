-- Catálogo inicial solicitado para Anaquelito.
-- No publica precios ni costos no confirmados. Los productos de ejemplo
-- previos se conservan en la base, pero dejan de aparecer en el catálogo.
begin;

update public.productos
set activo = false
where nombre in (
  'Cacahuate Japonés',
  'Gomitas Surtidas',
  'Chocolate de Mesa',
  'Semillas Enchiladas',
  'Palomitas Acarameladas',
  'Papas Fritas Caseras'
);

with productos_iniciales(slug, nombre, categoria, unidad, piezas_por_caja) as (
  values
    ('gomita-pinguino', 'Gomita Pingüino', 'gomitas', null::text, null::integer),
    ('gomita-diente', 'Gomita Diente', 'gomitas', null::text, null::integer),
    ('gomita-oso', 'Gomita Oso', 'gomitas', null::text, null::integer),
    ('gomita-lombriz', 'Gomita Lombriz', 'gomitas', null::text, null::integer),
    ('huevito-pinto', 'Huevito Pinto', 'chocolates', null::text, null::integer),
    ('bubulubu-ice', 'Bubulubu Ice', 'chocolates', 'caja', 300)
)
insert into public.productos (
  slug, nombre, categoria, unidad, piezas_por_caja,
  precio_mayoreo, precio_menudeo, activo
)
select slug, nombre, categoria, unidad, piezas_por_caja, null, null, true
from productos_iniciales d
where not exists (select 1 from public.productos p where p.slug = d.slug);

update public.productos p
set nombre = d.nombre,
    categoria = d.categoria,
    unidad = d.unidad,
    piezas_por_caja = d.piezas_por_caja,
    precio_mayoreo = null,
    precio_menudeo = null,
    activo = true
from (values
  ('gomita-pinguino', 'Gomita Pingüino', 'gomitas', null::text, null::integer),
  ('gomita-diente', 'Gomita Diente', 'gomitas', null::text, null::integer),
  ('gomita-oso', 'Gomita Oso', 'gomitas', null::text, null::integer),
  ('gomita-lombriz', 'Gomita Lombriz', 'gomitas', null::text, null::integer),
  ('huevito-pinto', 'Huevito Pinto', 'chocolates', null::text, null::integer),
  ('bubulubu-ice', 'Bubulubu Ice', 'chocolates', 'caja', 300)
) as d(slug, nombre, categoria, unidad, piezas_por_caja)
where p.slug = d.slug;

insert into privado.producto_costos (producto_id, costo_proveedor, provisional)
select id, 670.00, true
from public.productos
where slug = 'bubulubu-ice'
on conflict (producto_id) do update
set costo_proveedor = excluded.costo_proveedor,
    provisional = excluded.provisional,
    actualizado_en = now();

commit;
