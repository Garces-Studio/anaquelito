-- Migración 0005: administradores + endurecimiento de seguridad.
--
-- 1. Rol de administrador: tabla separada `administradores` (NO una columna en
--    `clientes`) para que un cliente jamás pueda auto-promoverse editando su
--    propia fila. Solo el service_role (o un admin actual desde el panel SQL)
--    puede insertar filas aquí.
-- 2. Función `es_admin()` (security definer) para usarla en políticas RLS sin
--    recursión.
-- 3. Políticas de admin sobre todas las tablas del negocio.
-- 4. Corrección de vulnerabilidad: la política "cliente actualiza su propio
--    registro" permitía a un cliente cambiar CUALQUIER columna de su fila,
--    incluida `nivel_precio` (¡su nivel de descuento!). Se restringe a nivel
--    de columnas con GRANT.
-- 5. Bucket de Storage `productos` para las imágenes del catálogo.

-- ---------- 1. Tabla de administradores ----------
create table if not exists public.administradores (
  auth_user_id uuid primary key references auth.users(id) on delete cascade,
  nota text, -- ej. "dueño", "socio", para saber quién es quién
  creado_en timestamptz not null default now()
);

alter table public.administradores enable row level security;

-- Un usuario solo puede consultar SU PROPIA fila (para saber si es admin).
-- Nadie puede insertar/actualizar/borrar vía API pública: eso queda reservado
-- al service_role (que ignora RLS) o al editor SQL de Supabase.
create policy "usuario consulta si el mismo es admin" on public.administradores
  for select using (auth.uid() = auth_user_id);

-- ---------- 2. Función es_admin() ----------
create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.administradores where auth_user_id = auth.uid()
  );
$$;

-- ---------- 3. Políticas de administrador ----------

-- Productos: el admin ve TODO (incluidos inactivos) y puede crear/editar/borrar.
create policy "admin gestiona productos" on public.productos
  for all using (public.es_admin()) with check (public.es_admin());

-- Pedidos: el admin ve todos y puede actualizar su estado.
create policy "admin ve todos los pedidos" on public.pedidos
  for select using (public.es_admin());
create policy "admin actualiza pedidos" on public.pedidos
  for update using (public.es_admin()) with check (public.es_admin());

-- Items de pedido: lectura completa para el admin.
create policy "admin ve todos los items de pedidos" on public.pedido_items
  for select using (public.es_admin());

-- Clientes y direcciones: el admin necesita ver a quién le envía.
create policy "admin ve todos los clientes" on public.clientes
  for select using (public.es_admin());
create policy "admin ve todas las direcciones" on public.direcciones
  for select using (public.es_admin());

-- Códigos de barra y cupones: gestión completa.
create policy "admin gestiona codigos de barra" on public.codigos_barra
  for all using (public.es_admin()) with check (public.es_admin());
create policy "admin gestiona cupones" on public.cupones
  for all using (public.es_admin()) with check (public.es_admin());

-- Líneas de crédito: lectura (la gestión de crédito se definirá después).
create policy "admin ve lineas de credito" on public.lineas_credito
  for select using (public.es_admin());

-- ---------- 4. FIX de seguridad: nivel_precio inmutable para el cliente ----------
-- Antes: un cliente autenticado podía hacer UPDATE de su propia fila completa,
-- incluyendo nivel_precio (su descuento). Ahora solo puede tocar sus datos de
-- contacto. El service_role no se ve afectado por estos GRANT.
revoke update on table public.clientes from authenticated;
grant update (nombre_negocio, tipo_negocio, telefono, direccion)
  on table public.clientes to authenticated;

-- ---------- 5. Bucket de imágenes de productos ----------
-- Público para LECTURA (las fotos del catálogo se sirven directo por URL).
-- La escritura se hace únicamente desde las rutas API del panel de admin
-- usando el service_role, así que no se agregan políticas de escritura.
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

-- ---------- Cómo nombrar al primer administrador ----------
-- Ejecuta esto en el editor SQL de Supabase con tu correo:
--
--   insert into public.administradores (auth_user_id, nota)
--   select id, 'dueño' from auth.users where email = 'tucorreo@ejemplo.com';
