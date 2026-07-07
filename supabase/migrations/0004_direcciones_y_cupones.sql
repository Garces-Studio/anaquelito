-- Migración 0004: direcciones de entrega y cupones, para el dashboard de cliente.

-- Un negocio puede guardar varias direcciones (tienda principal, bodega, etc.)
create table if not exists public.direcciones (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  etiqueta text not null default 'Principal',
  calle_numero text not null,
  colonia text,
  municipio text,
  estado text,
  codigo_postal text,
  predeterminada boolean not null default false,
  creado_en timestamptz not null default now()
);

create index if not exists idx_direcciones_cliente on public.direcciones(cliente_id);

alter table public.direcciones enable row level security;

create policy "cliente ve sus propias direcciones" on public.direcciones
  for select using (
    cliente_id in (select id from public.clientes where auth_user_id = auth.uid())
  );

create policy "cliente crea sus propias direcciones" on public.direcciones
  for insert with check (
    cliente_id in (select id from public.clientes where auth_user_id = auth.uid())
  );

create policy "cliente actualiza sus propias direcciones" on public.direcciones
  for update using (
    cliente_id in (select id from public.clientes where auth_user_id = auth.uid())
  );

create policy "cliente borra sus propias direcciones" on public.direcciones
  for delete using (
    cliente_id in (select id from public.clientes where auth_user_id = auth.uid())
  );

-- Cupones de descuento. Por ahora no hay ninguno cargado (ver
-- docs/06-pendientes-y-decisiones.md: falta definir la política de precios
-- y descuentos con el socio) — la tabla existe para que el dashboard pueda
-- mostrarlos honestamente en cuanto se definan, sin inventar nada mientras tanto.
create table if not exists public.cupones (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  descripcion text,
  descuento_porcentaje numeric(5,2) not null check (descuento_porcentaje > 0 and descuento_porcentaje <= 100),
  activo boolean not null default true,
  valido_hasta date,
  creado_en timestamptz not null default now()
);

alter table public.cupones enable row level security;

create policy "cupones activos son publicos" on public.cupones
  for select using (activo = true and (valido_hasta is null or valido_hasta >= current_date));
