begin;
create function public.gestionar_direccion(p_id uuid,p_accion text,p_datos jsonb default '{}')
returns void language plpgsql security definer set search_path='' as $$
declare cliente uuid; es_principal boolean; siguiente uuid;
begin
  select id into cliente from public.clientes where auth_user_id=auth.uid() for update;
  if cliente is null then raise exception 'SIN_CUENTA'; end if;
  select predeterminada into es_principal from public.direcciones where id=p_id and cliente_id=cliente for update;
  if not found then raise exception 'DIRECCION_NO_ENCONTRADA'; end if;
  if p_accion='principal' then
    update public.direcciones set predeterminada=false where cliente_id=cliente and predeterminada;
    update public.direcciones set predeterminada=true where id=p_id;
  elsif p_accion='editar' then
    if length(btrim(coalesce(p_datos->>'etiqueta',''))) not between 1 and 60
      or length(btrim(coalesce(p_datos->>'calle_numero',''))) not between 1 and 300
      or coalesce(p_datos->>'codigo_postal','') !~ '^[0-9]{5}$'
      or length(coalesce(p_datos->>'colonia',''))>160
      or length(coalesce(p_datos->>'municipio',''))>160
      or length(coalesce(p_datos->>'estado',''))>160 then raise exception 'DATOS_INVALIDOS'; end if;
    update public.direcciones set etiqueta=btrim(p_datos->>'etiqueta'),calle_numero=btrim(p_datos->>'calle_numero'),
      colonia=nullif(btrim(p_datos->>'colonia'),''),municipio=nullif(btrim(p_datos->>'municipio'),''),
      estado=nullif(btrim(p_datos->>'estado'),''),codigo_postal=p_datos->>'codigo_postal' where id=p_id;
  elsif p_accion='eliminar' then
    delete from public.direcciones where id=p_id;
    if es_principal then
      select id into siguiente from public.direcciones where cliente_id=cliente order by creado_en,id limit 1;
      update public.direcciones set predeterminada=(id=siguiente) where cliente_id=cliente;
    end if;
  else raise exception 'ACCION_INVALIDA'; end if;
end $$;
revoke all on function public.gestionar_direccion(uuid,text,jsonb) from public,anon;
grant execute on function public.gestionar_direccion(uuid,text,jsonb) to authenticated;
commit;
