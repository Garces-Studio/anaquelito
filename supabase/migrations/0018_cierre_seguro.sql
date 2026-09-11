begin;
-- Los administradores pueden editar logística, nunca pagos ni reservas directamente.
revoke update on public.pedidos from authenticated;
grant update(estado,empresa_envio,guia_envio,url_rastreo) on public.pedidos to authenticated;

create function public.exigir_conciliacion_cancelacion() returns trigger
language plpgsql set search_path='' as $$
begin
  -- Una respuesta fallida al crear la preferencia no prueba que la pasarela no la creó.
  -- Hasta integrar el cierre verificado, cualquier intento de checkout conserva reserva.
  if new.estado='cancelado' and old.estado is distinct from new.estado
    and (old.clave_checkout is not null or old.preferencia_id is not null or old.url_pago is not null
      or old.mercadopago_payment_id is not null) then
    raise exception 'CONCILIAR_PASARELA';
  end if;
  return new;
end $$;
create trigger exigir_conciliacion_cancelacion before update on public.pedidos
for each row execute function public.exigir_conciliacion_cancelacion();
commit;
