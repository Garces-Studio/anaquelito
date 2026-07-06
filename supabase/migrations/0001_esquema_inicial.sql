-- Esquema inicial de Anaquelito: productos, clientes, pedidos, códigos de barra y crédito.
-- Ver docs/03-modelo-de-negocio.md para las reglas de negocio detrás de estas tablas.

create extension if not exists "pgcrypto";

-- Clientes B2B (tienditas, cafés, emprendedores)
create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete set null,
  nombre_negocio text not null,
  tipo_negocio text not null default 'tiendita'
    check (tipo_negocio in ('tiendita', 'cafe', 'emprendedor')),
  telefono text,
  direccion text,
  nivel_precio text not null default 'nivel_1'
    check (nivel_precio in ('nivel_1', 'nivel_2', 'nivel_3')),
  creado_en timestamptz not null default now()
);

-- Catálogo de productos
create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  categoria text,
  unidad text not null default 'pieza',
  precio_menudeo numeric(10,2),
  precio_mayoreo numeric(10,2) not null,
  imagen_url text,
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

-- Códigos de barra (UPC) por producto, usados por el escáner de reorden
create table if not exists public.codigos_barra (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references public.productos(id) on delete cascade,
  codigo text not null unique,
  creado_en timestamptz not null default now()
);

-- Pedidos
create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete restrict,
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado')),
  metodo_pago text,
  metodo_envio text,
  total numeric(10,2) not null default 0,
  creado_en timestamptz not null default now()
);

-- Productos dentro de cada pedido
create table if not exists public.pedido_items (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos(id) on delete cascade,
  producto_id uuid not null references public.productos(id) on delete restrict,
  cantidad integer not null check (cantidad > 0),
  precio_unitario numeric(10,2) not null
);

-- Línea de crédito por cliente (ver política de crédito en el manual)
create table if not exists public.lineas_credito (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null unique references public.clientes(id) on delete cascade,
  monto_maximo numeric(10,2) not null default 0,
  saldo_actual numeric(10,2) not null default 0,
  estado text not null default 'inactiva'
    check (estado in ('inactiva', 'activa', 'suspendida')),
  creado_en timestamptz not null default now()
);

create index if not exists idx_codigos_barra_producto on public.codigos_barra(producto_id);
create index if not exists idx_pedidos_cliente on public.pedidos(cliente_id);
create index if not exists idx_pedido_items_pedido on public.pedido_items(pedido_id);

-- Seguridad a nivel de fila (RLS): el catálogo es público para lectura;
-- todo lo demás solo lo puede ver/editar el dueño del negocio o el backend (service role).
alter table public.clientes enable row level security;
alter table public.productos enable row level security;
alter table public.codigos_barra enable row level security;
alter table public.pedidos enable row level security;
alter table public.pedido_items enable row level security;
alter table public.lineas_credito enable row level security;

create policy "catalogo publico de lectura" on public.productos
  for select using (activo = true);

create policy "codigos de barra de lectura publica" on public.codigos_barra
  for select using (true);

create policy "cliente ve y edita su propio registro" on public.clientes
  for select using (auth.uid() = auth_user_id);

create policy "cliente actualiza su propio registro" on public.clientes
  for update using (auth.uid() = auth_user_id);

create policy "cliente ve sus propios pedidos" on public.pedidos
  for select using (
    cliente_id in (select id from public.clientes where auth_user_id = auth.uid())
  );

create policy "cliente crea sus propios pedidos" on public.pedidos
  for insert with check (
    cliente_id in (select id from public.clientes where auth_user_id = auth.uid())
  );

create policy "cliente ve los items de sus pedidos" on public.pedido_items
  for select using (
    pedido_id in (
      select p.id from public.pedidos p
      join public.clientes c on c.id = p.cliente_id
      where c.auth_user_id = auth.uid()
    )
  );

create policy "cliente ve su propia linea de credito" on public.lineas_credito
  for select using (
    cliente_id in (select id from public.clientes where auth_user_id = auth.uid())
  );
