-- Cada intento de pago conserva su propio reloj; un cobro adicional se marca para revisión.
begin;

alter table public.pedidos
  add column pago_requiere_revision boolean not null default false,
  add column pago_id_adicional text;

create table public.eventos_pago (
  pedido_id uuid not null references public.pedidos(id) on delete cascade,
  pago_id text not null,
  estado text not null check (estado in ('pendiente','en_proceso','aprobado','rechazado','cancelado','reembolsado')),
  monto numeric(12,2) not null,
  actualizado_en timestamptz not null,
  recibido_en timestamptz not null default now(),
  primary key (pedido_id,pago_id)
);
alter table public.eventos_pago enable row level security;
create policy "admin consulta eventos de pago" on public.eventos_pago
  for select to authenticated using (public.es_admin());

create or replace function public.aplicar_pago_verificado(p_pedido uuid,p_pago text,p_estado text,p_total numeric,p_fecha timestamptz)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare pedido public.pedidos; linea record; filas integer;
begin
  select * into pedido from public.pedidos where id=p_pedido for update;
  if not found or pedido.total <> p_total then raise exception 'PAGO_NO_COINCIDE'; end if;
  if p_estado not in ('pendiente','en_proceso','aprobado','rechazado','cancelado','reembolsado') then raise exception 'ESTADO_INVALIDO'; end if;

  insert into public.eventos_pago(pedido_id,pago_id,estado,monto,actualizado_en)
  values(p_pedido,p_pago,p_estado,p_total,p_fecha)
  on conflict(pedido_id,pago_id) do update set estado=excluded.estado,monto=excluded.monto,
    actualizado_en=excluded.actualizado_en,recibido_en=now()
  where excluded.actualizado_en >= public.eventos_pago.actualizado_en;
  get diagnostics filas = row_count;
  if filas=0 then return jsonb_build_object('ignorado',true,'motivo','evento_anterior'); end if;

  if pedido.pago_estado='reembolsado' then return jsonb_build_object('ignorado',true,'motivo','pago_finalizado'); end if;

  if pedido.pago_estado='aprobado' then
    if pedido.mercadopago_payment_id is distinct from p_pago then
      if p_estado='aprobado' then
        update public.pedidos set pago_requiere_revision=true,pago_id_adicional=p_pago,actualizado_en=now() where id=p_pedido;
        return jsonb_build_object('ok',true,'requiere_revision',true);
      end if;
      return jsonb_build_object('ignorado',true,'motivo','otro_intento');
    end if;
    if p_estado='reembolsado' then
      update public.pedidos set pago_estado='reembolsado',pago_actualizado_en=p_fecha,actualizado_en=now() where id=p_pedido;
    end if;
    return jsonb_build_object('ok',true);
  end if;

  if p_estado='aprobado' then
    if pedido.estado='cancelado' then
      update public.pedidos set pago_estado='aprobado',mercadopago_payment_id=p_pago,pago_actualizado_en=p_fecha,
        pago_requiere_revision=true,pago_id_adicional=p_pago,actualizado_en=now() where id=p_pedido;
      return jsonb_build_object('ok',true,'requiere_revision',true);
    end if;
    if pedido.inventario_estado='reservado' then
      for linea in select * from public.pedido_items where pedido_id=p_pedido and stock_controlado order by producto_id loop
        update public.productos set stock=stock-linea.cantidad,stock_reservado=stock_reservado-linea.cantidad
        where id=linea.producto_id and stock_reservado >= linea.cantidad and stock >= linea.cantidad;
        if not found then raise exception 'INVENTARIO_INCONSISTENTE'; end if;
      end loop;
    end if;
    update public.pedidos set pago_estado='aprobado',mercadopago_payment_id=p_pago,pago_actualizado_en=p_fecha,
      estado=case when estado='pendiente' then 'confirmado' else estado end,
      inventario_estado=case when inventario_estado='reservado' then 'consumido' else inventario_estado end,
      actualizado_en=now() where id=p_pedido;
    return jsonb_build_object('ok',true);
  end if;

  if pedido.pago_actualizado_en is null or p_fecha >= pedido.pago_actualizado_en then
    update public.pedidos set pago_estado=p_estado,mercadopago_payment_id=p_pago,pago_actualizado_en=p_fecha,
      actualizado_en=now() where id=p_pedido;
  end if;
  return jsonb_build_object('ok',true);
end $$;

revoke all on table public.eventos_pago from public,anon;
revoke insert,update,delete,truncate,references,trigger on table public.eventos_pago from authenticated;
grant select on table public.eventos_pago to authenticated;
revoke all on function public.aplicar_pago_verificado(uuid,text,text,numeric,timestamptz) from public,anon,authenticated;
grant execute on function public.aplicar_pago_verificado(uuid,text,text,numeric,timestamptz) to service_role;

commit;
