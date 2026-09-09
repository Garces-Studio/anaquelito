-- Base comercial; no modifica ni reemplaza productos existentes.
-- Aplicar en Supabase después de revisar un respaldo.
begin;
alter table public.productos
  alter column precio_mayoreo drop not null,
  alter column unidad drop not null,
  add column if not exists slug text,
  add column if not exists sku text,
  add column if not exists piezas_por_caja integer check (piezas_por_caja > 0),
  add column if not exists bolsas_por_caja integer check (bolsas_por_caja > 0),
  add column if not exists peso_por_bolsa_g numeric check (peso_por_bolsa_g > 0),
  add column if not exists peso_total_g numeric check (peso_total_g > 0),
  add column if not exists stock integer check (stock >= 0),
  add column if not exists cantidad_minima integer check (cantidad_minima > 0),
  add column if not exists disponibilidad text not null default 'por_confirmar'
    check (disponibilidad in ('por_confirmar', 'disponible', 'agotado')),
  add column if not exists precio_anterior numeric check (precio_anterior > 0);
create unique index if not exists productos_slug_unique on public.productos(slug) where slug is not null;

-- Fuera del esquema público: ni anon ni authenticated pueden leer costos,
-- incluso si alguien escribe select(*) desde el navegador.
create schema if not exists privado;
revoke all on schema privado from public, anon, authenticated;
create table if not exists privado.producto_costos (
  producto_id uuid primary key references public.productos(id) on delete cascade,
  costo_proveedor numeric(12,2) check (costo_proveedor >= 0),
  provisional boolean not null default true,
  actualizado_en timestamptz not null default now()
);
alter table privado.producto_costos enable row level security;
revoke all on privado.producto_costos from public, anon, authenticated;
grant usage on schema privado to service_role;
grant select, insert, update, delete on privado.producto_costos to service_role;

-- Escalas preparadas, vacías: no hay descuentos comerciales inventados.
create table if not exists public.precios_volumen (
  producto_id uuid not null references public.productos(id) on delete cascade,
  minimo_cajas integer not null check (minimo_cajas > 0),
  precio_caja numeric(12,2) not null check (precio_caja > 0),
  primary key(producto_id, minimo_cajas)
);
alter table public.precios_volumen enable row level security;
drop policy if exists "escalas de productos activos" on public.precios_volumen;
drop policy if exists "administracion de escalas" on public.precios_volumen;
create policy "escalas de productos activos" on public.precios_volumen for select
  using (exists(select 1 from public.productos p where p.id = producto_id and p.activo));
create policy "administracion de escalas" on public.precios_volumen for all to authenticated
  using (exists(select 1 from public.administradores a where a.auth_user_id = auth.uid()))
  with check (exists(select 1 from public.administradores a where a.auth_user_id = auth.uid()));
commit;
