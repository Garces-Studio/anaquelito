-- Ejecutar dentro de BEGIN/ROLLBACK; no crea usuarios persistentes.
do $$
declare usuario uuid:=gen_random_uuid(); otro uuid:=gen_random_uuid(); cliente uuid; ajeno uuid; d1 uuid; d2 uuid; d3 uuid;
begin
  insert into auth.users(id) values(usuario),(otro);
  insert into public.clientes(auth_user_id,nombre_negocio,tipo_negocio) values(usuario,'QA direcciones','tiendita') returning id into cliente;
  insert into public.clientes(auth_user_id,nombre_negocio,tipo_negocio) values(otro,'QA ajeno','tiendita') returning id into ajeno;
  insert into public.direcciones(cliente_id,calle_numero,predeterminada) values(cliente,'Primera',true) returning id into d1;
  insert into public.direcciones(cliente_id,calle_numero) values(cliente,'Segunda') returning id into d2;
  insert into public.direcciones(cliente_id,calle_numero) values(ajeno,'Ajena') returning id into d3;
  perform set_config('request.jwt.claims',json_build_object('sub',usuario,'role','authenticated','aal','aal1')::text,true);
  begin
    perform public.gestionar_direccion(d3,'eliminar');
    raise exception 'FALLO: acceso a direccion ajena';
  exception when others then if SQLERRM <> 'DIRECCION_NO_ENCONTRADA' then raise; end if; end;
  perform public.gestionar_direccion(d2,'principal');
  assert (select count(*) from public.direcciones where cliente_id=cliente and predeterminada)=1,'Principal duplicada';
  assert (select predeterminada from public.direcciones where id=d2),'Principal incorrecta';
  perform public.gestionar_direccion(d2,'editar','{"etiqueta":"Bodega","calle_numero":"Nueva 12","codigo_postal":"01000"}');
  assert (select calle_numero from public.direcciones where id=d2)='Nueva 12','Edicion no guardada';
  perform public.gestionar_direccion(d2,'eliminar');
  assert (select predeterminada from public.direcciones where id=d1),'Sin principal al eliminar';
  assert exists(select 1 from public.direcciones where id=d3),'Direccion ajena eliminada';
  assert not has_function_privilege('anon','public.gestionar_direccion(uuid,text,jsonb)','EXECUTE'),'Funcion publica';
  raise notice 'OK: propiedad de direcciones, edicion, principal unica y eliminacion';
end $$;
