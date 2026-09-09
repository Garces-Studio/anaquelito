-- El catálogo inicial permite productos cuya presentación comercial aún no se
-- ha confirmado; la interfaz lo muestra explícitamente en lugar de inventarla.
alter table public.productos alter column unidad drop not null;
