-- Productos de ejemplo para probar el catálogo con datos reales.
-- Reemplazar/ampliar cuando se defina el catálogo curado real (ver docs/06-pendientes-y-decisiones.md).

insert into public.productos (nombre, descripcion, categoria, unidad, precio_menudeo, precio_mayoreo, activo)
values
  ('Cacahuate Japonés', 'Bolsa de cacahuate japonés a granel', 'frutos_secos', 'kg', 90.00, 75.00, true),
  ('Gomitas Surtidas', 'Mezcla de gomitas de sabores surtidos', 'gomitas', 'kg', 110.00, 92.00, true),
  ('Chocolate de Mesa', 'Chocolate en tableta para reventa', 'chocolates', 'caja', 180.00, 150.00, true),
  ('Semillas Enchiladas', 'Mix de semillas enchiladas', 'semillas', 'kg', 95.00, 80.00, true),
  ('Palomitas Acarameladas', 'Bolsa de palomitas acarameladas', 'dulces', 'caja', 130.00, 108.00, true),
  ('Papas Fritas Caseras', 'Papas fritas estilo casero, bolsa grande', 'fritos', 'caja', 140.00, 115.00, true)
on conflict do nothing;
