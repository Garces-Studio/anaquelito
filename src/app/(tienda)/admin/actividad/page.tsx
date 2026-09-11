import { crearCliente } from '@/lib/supabase/server';

export default async function Actividad() {
  const { data, error } = await (await crearCliente()).from('auditoria_operaciones').select('id,tabla,registro_id,operacion,actor,cambios,creado_en').order('creado_en', { ascending: false }).limit(100);
  return <section><h1 className="!text-3xl !font-black">Actividad del negocio</h1><p className="my-4 text-sm">Últimos 100 cambios de precios, inventario, pedidos y permisos. No se registran contraseñas ni domicilios.</p>
    {error ? <p role="alert">No se pudo consultar la actividad.</p> : !data?.length ? <p>Aún no hay cambios registrados.</p> : <ol className="grid gap-3">{data.map(evento => <li key={evento.id} className="rounded-2xl border bg-white p-5">
      <p className="font-bold">{evento.tabla} · {evento.operacion} · {evento.registro_id.slice(0,8)}</p>
      <p className="mt-1 text-xs">{new Date(evento.creado_en).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })} · {evento.actor ? `Usuario ${evento.actor.slice(0,8)}` : 'Servicio del sistema'}</p>
      <ul className="mt-3 text-sm">{Object.entries(evento.cambios as Record<string, { antes: unknown; despues: unknown }>).map(([campo, valor]) => <li key={campo}>{campo}: {String(valor.antes ?? '—')} → {String(valor.despues ?? '—')}</li>)}</ul>
    </li>)}</ol>}
  </section>;
}
