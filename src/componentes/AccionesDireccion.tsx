'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { leerRespuesta } from '@/lib/respuesta-json';

type Direccion = { id: string; etiqueta: string; calle_numero: string; colonia: string | null; municipio: string | null; estado: string | null; codigo_postal: string | null; predeterminada: boolean };

export default function AccionesDireccion({ direccion }: { direccion: Direccion }) {
  const router = useRouter();
  const [editar, setEditar] = useState(false);
  const [confirmar, setConfirmar] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState('');
  async function guardar(datos: Record<string, unknown>, eliminar = false) {
    if (guardando) return;
    setGuardando(true); setAviso('');
    try {
      await leerRespuesta(await fetch('/api/direcciones', { method: eliminar ? 'DELETE' : 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...datos, id: direccion.id }) }));
      setEditar(false); setConfirmar(false); setAviso('Dirección actualizada.'); router.refresh();
    } catch (error) { setAviso(error instanceof Error ? error.message : 'Revisa tu conexión e intenta nuevamente.'); }
    finally { setGuardando(false); }
  }
  const boton = 'min-h-11 rounded-xl border border-[#EBD9C3] bg-white px-4 text-xs font-black text-[#007A70] disabled:opacity-50';
  return <div className="mt-4">
    <div className="flex flex-wrap gap-2">
      <button className={boton} disabled={guardando} onClick={() => setEditar(!editar)}>{editar ? 'Cerrar edición' : 'Editar'}</button>
      {!direccion.predeterminada && <button className={boton} disabled={guardando} onClick={() => guardar({ principal: true })}>Usar como principal</button>}
      <button className={boton} disabled={guardando} onClick={() => setConfirmar(!confirmar)}>Eliminar</button>
    </div>
    {confirmar && <div className="mt-3 rounded-xl bg-[#FFF1F1] p-4 text-sm text-[#B73535]"><p>¿Eliminar esta dirección guardada? Los pedidos anteriores conservarán su dirección de entrega.</p><div className="mt-2 flex gap-2"><button className={boton} disabled={guardando} onClick={() => guardar({}, true)}>Sí, eliminar</button><button className={boton} onClick={() => setConfirmar(false)}>Conservar</button></div></div>}
    {editar && <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={e => { e.preventDefault(); void guardar(Object.fromEntries(new FormData(e.currentTarget))); }}>
      {([['etiqueta','Etiqueta'],['calle_numero','Calle y número'],['colonia','Colonia'],['municipio','Municipio / alcaldía'],['estado','Estado'],['codigo_postal','Código postal']] as const).map(([nombre, texto]) => <label key={nombre} className="grid gap-1 text-sm font-bold">{texto}<input name={nombre} defaultValue={direccion[nombre] ?? ''} required={['etiqueta','calle_numero','codigo_postal'].includes(nombre)} pattern={nombre === 'codigo_postal' ? '[0-9]{5}' : undefined} maxLength={nombre === 'codigo_postal' ? 5 : nombre === 'etiqueta' ? 60 : nombre === 'calle_numero' ? 300 : 160} className="min-h-11 rounded-xl border border-[#EBD9C3] bg-white px-3 text-[#2B1B12]" /></label>)}
      <button className={boton} disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar cambios'}</button>
    </form>}
    {aviso && <p role="status" className="mt-3 text-sm font-semibold">{aviso}</p>}
  </div>;
}
