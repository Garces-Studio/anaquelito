-- Ejecutar dentro de una transacción y finalizar con ROLLBACK.
do $$
declare producto uuid := gen_random_uuid(); clave uuid := gen_random_uuid(); pedido jsonb; otro jsonb; n integer; negocio jsonb := '{"nombre_negocio":"Prueba transaccional","telefono":"5555555555","direccion":"Dirección de prueba","tipo_negocio":"tiendita"}';
begin
  insert into public.productos(id,nombre,unidad,precio_mayoreo,stock,disponibilidad) values(producto,'PRUEBA NO PUBLICAR','Caja',10,3,'in_stock');
  pedido := public.crear_pedido_atomico(clave,'huella',null,negocio,jsonb_build_array(jsonb_build_object('id',producto,'cantidad',2)));
  otro := public.crear_pedido_atomico(clave,'huella',null,negocio,jsonb_build_array(jsonb_build_object('id',producto,'cantidad',2)));
  assert pedido->>'id'=otro->>'id', 'Pedido duplicado';
  select stock_reservado into n from public.productos where id=producto; assert n=2,'Reserva duplicada';
  begin
    perform public.crear_pedido_atomico(gen_random_uuid(),'otra',null,negocio,jsonb_build_array(jsonb_build_object('id',producto,'cantidad',2)));
    raise exception 'FALLO: sobreventa permitida';
  exception when others then if SQLERRM <> 'STOCK_INSUFICIENTE' then raise; end if; end;
  begin
    update public.pedidos set estado='enviado' where id=(pedido->>'id')::uuid;
    raise exception 'FALLO: envio sin pago permitido';
  exception when others then if SQLERRM <> 'PAGO_NO_APROBADO' then raise; end if; end;
  perform public.aplicar_pago_verificado((pedido->>'id')::uuid,'test-pago','aprobado',20,now());
  update public.pedidos set estado='enviado' where id=(pedido->>'id')::uuid;
  perform public.aplicar_pago_verificado((pedido->>'id')::uuid,'test-pago','aprobado',20,now());
  select stock into n from public.productos where id=producto; assert n=1,'Descuento duplicado';
  assert (select estado from public.pedidos where id=(pedido->>'id')::uuid)='enviado','Envio degradado';
  perform public.aplicar_pago_verificado((pedido->>'id')::uuid,'otro-pago','rechazado',20,now());
  assert (select pago_estado from public.pedidos where id=(pedido->>'id')::uuid)='aprobado','Pago degradado';
  perform public.aplicar_pago_verificado((pedido->>'id')::uuid,'test-pago','reembolsado',20,now());
  assert (select pago_estado from public.pedidos where id=(pedido->>'id')::uuid)='reembolsado','Reembolso ignorado';
  assert (select datos_entrega->>'direccion' from public.pedidos where id=(pedido->>'id')::uuid)='Dirección de prueba','Snapshot perdido';
  assert public.consumir_limite('prueba-limite',1,600),'Primera solicitud rechazada';
  assert not public.consumir_limite('prueba-limite',1,600),'Limite ignorado';
  assert not has_function_privilege('anon','public.crear_pedido_atomico(uuid,text,uuid,jsonb,jsonb)','execute'),'RPC publica';
  assert not has_function_privilege('authenticated','public.aplicar_pago_verificado(uuid,text,text,numeric,timestamptz)','execute'),'RPC publica';
  raise notice 'OK: reservas, repeticion, existencias, estados, reembolso, snapshot, limites y permisos';
end $$;

do $$
declare producto uuid := gen_random_uuid(); pedido jsonb; n integer;
begin
  insert into public.productos(id,nombre,unidad,precio_mayoreo,stock,disponibilidad)
    values(producto,'PRUEBA EVENTOS PAGO','Caja',15,5,'in_stock');
  pedido := public.crear_pedido_atomico(gen_random_uuid(),'eventos-pago',null,
    '{"nombre_negocio":"Prueba","telefono":"5555555555","direccion":"Prueba","tipo_negocio":"tiendita"}',
    jsonb_build_array(jsonb_build_object('id',producto,'cantidad',2)));
  perform public.aplicar_pago_verificado((pedido->>'id')::uuid,'intento-rechazado','rechazado',30,now());
  perform public.aplicar_pago_verificado((pedido->>'id')::uuid,'intento-aprobado','aprobado',30,now()-interval '1 minute');
  assert (select pago_estado from public.pedidos where id=(pedido->>'id')::uuid)='aprobado','Un rechazo posterior ocultó un pago aprobado';
  perform public.aplicar_pago_verificado((pedido->>'id')::uuid,'segundo-aprobado','aprobado',30,now());
  assert (select pago_requiere_revision from public.pedidos where id=(pedido->>'id')::uuid),'El cobro adicional no pidió revisión';
  select stock into n from public.productos where id=producto;
  assert n=3,'El cobro adicional descontó inventario dos veces';
  assert (select count(*) from public.eventos_pago where pedido_id=(pedido->>'id')::uuid)=3,'Se perdieron intentos de pago';
  raise notice 'OK: eventos tardios y cobro adicional sin doble descuento';
end $$;

do $$
declare administrador uuid := gen_random_uuid(); producto uuid := gen_random_uuid(); pedido jsonb;
begin
  insert into auth.users(id,aud,role,email,created_at,updated_at,raw_app_meta_data,raw_user_meta_data)
    values(administrador,'authenticated','authenticated','prueba-seguridad@invalid.example',now(),now(),'{}','{}');
  insert into public.administradores(auth_user_id,nota) values(administrador,'Prueba transaccional');
  perform set_config('request.jwt.claims',json_build_object('sub',administrador,'role','authenticated','aal','aal1')::text,true);
  assert not public.es_admin(),'Un administrador con sólo contraseña obtuvo acceso';
  perform set_config('request.jwt.claims',json_build_object('sub',administrador,'role','authenticated','aal','aal2')::text,true);
  assert public.es_admin(),'La doble verificación no habilitó al administrador';
  insert into public.productos(id,nombre,unidad,precio_mayoreo,stock,disponibilidad)
    values(producto,'PRUEBA CANCELACION','Caja',10,5,'in_stock');
  pedido := public.crear_pedido_atomico(gen_random_uuid(),'reserva-cancelable',null,
    '{"nombre_negocio":"Prueba","telefono":"5555555555","direccion":"Prueba","tipo_negocio":"tiendita"}',
    jsonb_build_array(jsonb_build_object('id',producto,'cantidad',2)));
  perform public.cancelar_pedido_y_liberar_reserva((pedido->>'id')::uuid);
  assert (select stock_reservado from public.productos where id=producto)=0,'La cancelación no liberó la reserva';
  assert (select inventario_estado from public.pedidos where id=(pedido->>'id')::uuid)='liberado','Inventario sin conciliar';
  raise notice 'OK: MFA administrativa y cancelacion conciliada';
end $$;
