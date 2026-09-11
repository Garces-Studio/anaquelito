-- Pedidos y existencias se modifican bajo bloqueo; sólo el servidor llama estas funciones.
begin;
alter table public.productos add column stock_reservado integer not null default 0 check (stock_reservado >= 0);
alter table public.productos add constraint stock_cubre_reservas check (stock_reservado=0 or stock >= stock_reservado and stock is not null);
alter table public.pedidos
  add column clave_checkout uuid unique,
  add column huella_checkout text,
  add column datos_entrega jsonb,
  add column url_pago text,
  add column preferencia_id text,
  add column pago_actualizado_en timestamptz,
  add column inventario_estado text not null default 'sin_reserva' check (inventario_estado in ('sin_reserva','reservado','consumido','liberado'));
alter table public.pedido_items
  add column nombre_producto text,
  add column presentacion text,
  add column stock_controlado boolean not null default false;

create table public.auditoria_operaciones (
  id bigint generated always as identity primary key,
  tabla text not null, registro_id text not null, operacion text not null,
  actor uuid, cambios jsonb not null, creado_en timestamptz not null default now()
);
alter table public.auditoria_operaciones enable row level security;
create policy "admin consulta auditoria" on public.auditoria_operaciones for select to authenticated
using (exists(select 1 from public.administradores where auth_user_id = auth.uid()));
create index auditoria_fecha on public.auditoria_operaciones(creado_en desc);

create function public.auditar_operacion() returns trigger language plpgsql security definer set search_path = '' as $$
declare antes jsonb; despues jsonb; cambios jsonb := '{}'; k text;
begin
  antes := case when TG_OP = 'INSERT' then '{}'::jsonb else to_jsonb(old) end;
  despues := case when TG_OP = 'DELETE' then '{}'::jsonb else to_jsonb(new) end;
  -- No registrar domicilios, tokens ni otra información personal.
  foreach k in array array['precio_mayoreo','stock','stock_reservado','disponibilidad','activo','estado','pago_estado','auth_user_id'] loop
    if (antes->k) is distinct from (despues->k) then
      cambios := cambios || jsonb_build_object(k,jsonb_build_object('antes',antes->k,'despues',despues->k));
    end if;
  end loop;
  if cambios <> '{}' then
    insert into public.auditoria_operaciones(tabla,registro_id,operacion,actor,cambios)
    values(TG_TABLE_NAME,coalesce(despues->>'id',antes->>'id',despues->>'auth_user_id',antes->>'auth_user_id'),TG_OP,auth.uid(),cambios);
  end if;
  return coalesce(new,old);
end $$;
create trigger auditar_productos after insert or update or delete on public.productos for each row execute function public.auditar_operacion();
create trigger auditar_pedidos after insert or update on public.pedidos for each row execute function public.auditar_operacion();
create trigger auditar_administradores after insert or delete on public.administradores for each row execute function public.auditar_operacion();

create function public.proteger_estado_pedido() returns trigger language plpgsql set search_path='' as $$
begin
  if new.estado is distinct from old.estado then
    if new.estado in ('confirmado','enviado','entregado') and new.pago_estado <> 'aprobado' then raise exception 'PAGO_NO_APROBADO'; end if;
    if old.estado='entregado' or old.estado='cancelado' or (old.estado='enviado' and new.estado <> 'entregado') then raise exception 'TRANSICION_INVALIDA'; end if;
    if new.estado='enviado' and old.estado <> 'confirmado' then raise exception 'TRANSICION_INVALIDA'; end if;
    if new.estado='entregado' and old.estado <> 'enviado' then raise exception 'TRANSICION_INVALIDA'; end if;
    if new.estado='pendiente' then raise exception 'TRANSICION_INVALIDA'; end if;
    if new.estado='cancelado' and old.inventario_estado in ('reservado','consumido') then raise exception 'REQUIERE_CONCILIACION'; end if;
  end if;
  return new;
end $$;
create trigger proteger_estado_pedido before update on public.pedidos for each row execute function public.proteger_estado_pedido();

create function public.crear_pedido_atomico(p_clave uuid,p_huella text,p_usuario uuid,p_negocio jsonb,p_articulos jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare pedido public.pedidos; producto public.productos; linea record; cliente uuid; total numeric := 0; controlado boolean;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_clave::text,0));
  select * into pedido from public.pedidos where clave_checkout=p_clave;
  if found then
    if pedido.huella_checkout is distinct from p_huella then raise exception 'CHECKOUT_DISTINTO'; end if;
    return to_jsonb(pedido);
  end if;
  if jsonb_typeof(p_articulos) <> 'array' or jsonb_array_length(p_articulos) not between 1 and 100 then raise exception 'CARRITO_INVALIDO'; end if;
  -- Orden de locks estable para evitar interbloqueos entre carritos.
  for linea in select (a->>'id')::uuid id, sum((a->>'cantidad')::numeric) cantidad
    from jsonb_array_elements(p_articulos) a group by 1 order by 1 loop
    if linea.cantidad <> trunc(linea.cantidad) or linea.cantidad not between 1 and 10000 then raise exception 'CANTIDAD_INVALIDA'; end if;
    select * into producto from public.productos where id=linea.id for update;
    if not found or not producto.activo or producto.precio_mayoreo is null or producto.precio_mayoreo <= 0 or producto.unidad is null
      or producto.disponibilidad not in ('in_stock','low_stock','available_from_supplier') then raise exception 'PRODUCTO_NO_DISPONIBLE'; end if;
    if linea.cantidad < coalesce(producto.cantidad_minima,1) then raise exception 'MINIMO_NO_CUMPLIDO'; end if;
    if producto.disponibilidad in ('in_stock','low_stock') and (producto.stock is null or producto.stock-producto.stock_reservado < linea.cantidad) then raise exception 'STOCK_INSUFICIENTE'; end if;
    total := total + producto.precio_mayoreo * linea.cantidad;
  end loop;
  if p_usuario is not null then select id into cliente from public.clientes where auth_user_id=p_usuario; end if;
  if cliente is null then
    insert into public.clientes(auth_user_id,nombre_negocio,tipo_negocio,telefono,direccion)
    values(p_usuario,p_negocio->>'nombre_negocio',coalesce(p_negocio->>'tipo_negocio','tiendita'),p_negocio->>'telefono',p_negocio->>'direccion') returning id into cliente;
  end if;
  insert into public.pedidos(cliente_id,total,metodo_pago,clave_checkout,huella_checkout,datos_entrega,inventario_estado)
  values(cliente,total,'mercadopago',p_clave,p_huella,p_negocio,'reservado') returning * into pedido;
  for linea in select (a->>'id')::uuid id, sum((a->>'cantidad')::integer)::integer cantidad
    from jsonb_array_elements(p_articulos) a group by 1 order by 1 loop
    select * into producto from public.productos where id=linea.id;
    controlado := producto.disponibilidad in ('in_stock','low_stock');
    insert into public.pedido_items(pedido_id,producto_id,cantidad,precio_unitario,nombre_producto,presentacion,stock_controlado)
    values(pedido.id,producto.id,linea.cantidad,producto.precio_mayoreo,producto.nombre,producto.unidad,controlado);
    if controlado then update public.productos set stock_reservado=stock_reservado+linea.cantidad where id=producto.id; end if;
  end loop;
  return to_jsonb(pedido);
end $$;

create function public.aplicar_pago_verificado(p_pedido uuid,p_pago text,p_estado text,p_total numeric,p_fecha timestamptz)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare pedido public.pedidos; linea record;
begin
  select * into pedido from public.pedidos where id=p_pedido for update;
  if not found or pedido.total <> p_total then raise exception 'PAGO_NO_COINCIDE'; end if;
  if p_estado not in ('pendiente','en_proceso','aprobado','rechazado','cancelado','reembolsado') then raise exception 'ESTADO_INVALIDO'; end if;
  if pedido.pago_actualizado_en is not null and p_fecha < pedido.pago_actualizado_en then return jsonb_build_object('ignorado',true); end if;
  if pedido.pago_estado in ('aprobado','reembolsado') then
    if pedido.mercadopago_payment_id is distinct from p_pago or p_estado not in ('aprobado','reembolsado') or pedido.pago_estado='reembolsado' then return jsonb_build_object('ignorado',true); end if;
  end if;
  -- Un intento rechazado no libera existencias: la misma preferencia permite reintentar.
  if p_estado='aprobado' and pedido.inventario_estado='reservado' then
    for linea in select * from public.pedido_items where pedido_id=p_pedido and stock_controlado order by producto_id loop
      update public.productos set stock=stock-linea.cantidad,stock_reservado=stock_reservado-linea.cantidad where id=linea.producto_id;
    end loop;
  end if;
  update public.pedidos set pago_estado=p_estado,mercadopago_payment_id=p_pago,pago_actualizado_en=p_fecha,
    estado=case when p_estado='aprobado' and estado='pendiente' then 'confirmado' else estado end,
    inventario_estado=case when p_estado='aprobado' and inventario_estado='reservado' then 'consumido' else inventario_estado end,
    actualizado_en=now() where id=p_pedido;
  -- Los reembolsos no reponen mercancía automáticamente: primero se verifica su devolución.
  return jsonb_build_object('ok',true);
end $$;

-- Ventanas persistentes: funcionan entre instancias de Vercel sin guardar IPs en claro.
create table public.limites_solicitudes(clave text primary key, ventana timestamptz not null, intentos integer not null);
alter table public.limites_solicitudes enable row level security;
create function public.consumir_limite(p_clave text,p_maximo integer,p_segundos integer) returns boolean
language plpgsql security definer set search_path='' as $$
declare usados integer;
begin
  delete from public.limites_solicitudes where ventana < now()-interval '1 day';
  insert into public.limites_solicitudes values(p_clave,now(),1)
  on conflict(clave) do update set
    intentos=case when limites_solicitudes.ventana < now()-make_interval(secs=>p_segundos) then 1 else limites_solicitudes.intentos+1 end,
    ventana=case when limites_solicitudes.ventana < now()-make_interval(secs=>p_segundos) then now() else limites_solicitudes.ventana end
  returning intentos into usados;
  return usados <= p_maximo;
end $$;

revoke all on function public.crear_pedido_atomico(uuid,text,uuid,jsonb,jsonb) from public,anon,authenticated;
revoke all on function public.aplicar_pago_verificado(uuid,text,text,numeric,timestamptz) from public,anon,authenticated;
revoke all on function public.consumir_limite(text,integer,integer) from public,anon,authenticated;
grant execute on function public.crear_pedido_atomico(uuid,text,uuid,jsonb,jsonb),public.aplicar_pago_verificado(uuid,text,text,numeric,timestamptz),public.consumir_limite(text,integer,integer) to service_role;
commit;
