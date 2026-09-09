-- Un usuario autenticado representa un solo perfil de negocio. Evita que dos
-- solicitudes simultáneas creen historiales separados para la misma cuenta.
create unique index if not exists clientes_auth_user_unique
  on public.clientes(auth_user_id)
  where auth_user_id is not null;
