'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CAMPO = 'min-h-11 rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] px-3 text-sm font-semibold outline-none';
const ETIQUETA = 'grid gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#6B5546]';

export function FormularioPerfil({ cliente }: { cliente: { nombre_negocio: string; tipo_negocio: string; telefono: string | null } }) {
  const router = useRouter();
  const [estado, setEstado] = useState<string | null>(null);
  return <form className="grid gap-4 md:grid-cols-2" onSubmit={async (e) => {
    e.preventDefault(); setEstado('Guardando…');
    const datos = Object.fromEntries(new FormData(e.currentTarget));
    const respuesta = await fetch('/api/cuenta', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) });
    const json = await respuesta.json(); setEstado(respuesta.ok ? 'Datos guardados.' : json.error); if (respuesta.ok) router.refresh();
  }}>
    <label className={`${ETIQUETA} md:col-span-2`}>Nombre del negocio<input name="nombre_negocio" required defaultValue={cliente.nombre_negocio} className={CAMPO} /></label>
    <label className={ETIQUETA}>Tipo de negocio<select name="tipo_negocio" defaultValue={cliente.tipo_negocio} className={CAMPO}><option value="tiendita">Tiendita</option><option value="cafe">Café / fonda</option><option value="emprendedor">Reventa</option></select></label>
    <label className={ETIQUETA}>Teléfono<input name="telefono" type="tel" required minLength={8} defaultValue={cliente.telefono ?? ''} className={CAMPO} /></label>
    <button className="b2b-boton md:col-span-2" type="submit">Guardar datos</button>{estado && <p role="status" className="md:col-span-2">{estado}</p>}
  </form>;
}

export function FormularioDireccion() {
  const router = useRouter();
  const [estado, setEstado] = useState<string | null>(null);
  return <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={async (e) => {
    e.preventDefault(); setEstado('Guardando…');
    const formulario = e.currentTarget; const datos = Object.fromEntries(new FormData(formulario));
    const respuesta = await fetch('/api/cuenta', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) });
    const json = await respuesta.json(); setEstado(respuesta.ok ? 'Dirección guardada.' : json.error); if (respuesta.ok) { formulario.reset(); router.refresh(); }
  }}>
    <label className={ETIQUETA}>Etiqueta<input name="etiqueta" required defaultValue="Sucursal" className={CAMPO} /></label>
    <label className={ETIQUETA}>Código postal<input name="codigo_postal" required minLength={5} className={CAMPO} /></label>
    <label className={`${ETIQUETA} md:col-span-2`}>Calle y número<input name="calle_numero" required className={CAMPO} /></label>
    <label className={ETIQUETA}>Colonia<input name="colonia" className={CAMPO} /></label><label className={ETIQUETA}>Municipio / alcaldía<input name="municipio" className={CAMPO} /></label>
    <label className={ETIQUETA}>Estado<input name="estado" className={CAMPO} /></label>
    <button className="b2b-boton" type="submit">Agregar dirección</button>{estado && <p role="status" className="md:col-span-2">{estado}</p>}
  </form>;
}
