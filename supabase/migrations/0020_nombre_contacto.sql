-- Separa la identidad de la persona del nombre comercial del negocio.
-- Las cuentas existentes quedan con el campo vacío y pueden completarlo
-- desde su Dashboard sin alterar pedidos, direcciones ni datos fiscales.

alter table public.clientes
  add column if not exists nombre_contacto text;

alter table public.clientes
  drop constraint if exists clientes_nombre_contacto_longitud;

alter table public.clientes
  add constraint clientes_nombre_contacto_longitud
  check (nombre_contacto is null or char_length(nombre_contacto) between 2 and 120);

grant update (nombre_contacto)
  on table public.clientes to authenticated;
