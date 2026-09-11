-- El panel administrativo exige AAL2 y las cancelaciones liberan reservas de forma atómica.
begin;

alter table public.pedidos
  add column empresa_envio text,
  add column guia_envio text,
  add column url_rastreo text,
  add column enviado_en timestamptz,
  add column entregado_en timestamptz;

create or replace function public.es_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(auth.jwt()->>'aal','') = 'aal2'
    and exists (select 1 from public.administradores where auth_user_id = auth.uid());
$$;

drop policy if exists "admin consulta auditoria" on public.auditoria_operaciones;
create policy "admin consulta auditoria" on public.auditoria_operaciones
  for select to authenticated using (public.es_admin());

create or replace function public.proteger_estado_pedido() returns trigger language plpgsql set search_path='' as $$
begin
  if new.estado is distinct from old.estado then
    if new.estado in ('confirmado','enviado','entregado') and new.pago_estado <> 'aprobado' then raise exception 'PAGO_NO_APROBADO'; end if;
    if old.estado='entregado' or old.estado='cancelado' or (old.estado='enviado' and new.estado <> 'entregado') then raise exception 'TRANSICION_INVALIDA'; end if;
    if new.estado='enviado' and old.estado <> 'confirmado' then raise exception 'TRANSICION_INVALIDA'; end if;
    if new.estado='entregado' and old.estado <> 'enviado' then raise exception 'TRANSICION_INVALIDA'; end if;
    if new.estado='pendiente' then raise exception 'TRANSICION_INVALIDA'; end if;
    if new.estado='cancelado' and old.inventario_estado='consumido' then raise exception 'REQUIERE_DEVOLUCION'; end if;
    if new.estado='cancelado' and old.inventario_estado='reservado' and new.inventario_estado <> 'liberado' then raise exception 'REQUIERE_CONCILIACION'; end if;
    if new.estado='enviado' then new.enviado_en := coalesce(new.enviado_en,now()); end if;
    if new.estado='entregado' then new.entregado_en := coalesce(new.entregado_en,now()); end if;
  end if;
  return new;
end $$;

create or replace function public.cancelar_pedido_y_liberar_reserva(p_pedido uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare pedido public.pedidos; linea record;
begin
  if not public.es_admin() then raise exception 'SOLO_ADMIN_MFA'; end if;
  select * into pedido from public.pedidos where id=p_pedido for update;
  if not found then raise exception 'PEDIDO_NO_EXISTE'; end if;
  if pedido.estado='cancelado' then return jsonb_build_object('ok',true,'sin_cambios',true); end if;
  if pedido.inventario_estado='consumido' then raise exception 'REQUIERE_DEVOLUCION'; end if;
  if pedido.inventario_estado='reservado' then
    for linea in select * from public.pedido_items where pedido_id=p_pedido and stock_controlado order by producto_id loop
      update public.productos set stock_reservado=stock_reservado-linea.cantidad
      where id=linea.producto_id and stock_reservado >= linea.cantidad;
      if not found then raise exception 'RESERVA_INCONSISTENTE'; end if;
    end loop;
  end if;
  update public.pedidos set estado='cancelado',
    inventario_estado=case when inventario_estado='reservado' then 'liberado' else inventario_estado end,
    actualizado_en=now() where id=p_pedido;
  return jsonb_build_object('ok',true);
end $$;

revoke all on function public.cancelar_pedido_y_liberar_reserva(uuid) from public,anon;
grant execute on function public.cancelar_pedido_y_liberar_reserva(uuid) to authenticated;

commit;
