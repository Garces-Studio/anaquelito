'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { crearCliente } from '@/lib/supabase/client';
import { leerRespuesta } from '@/lib/respuesta-json';

const CAMPO = 'min-h-11 rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] px-3 text-sm font-semibold outline-none';
const ETIQUETA = 'grid gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#6B5546]';

export function FormularioPerfil({ cliente }: { cliente: { nombre_negocio: string; tipo_negocio: string; telefono: string | null } }) {
  const router = useRouter();
  const [estado, setEstado] = useState<string | null>(null);
  return <form className="grid gap-4 md:grid-cols-2" onSubmit={async (e) => {
    e.preventDefault(); setEstado('Guardando…');
    const datos = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await leerRespuesta(await fetch('/api/cuenta', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) }));
      setEstado('Datos guardados.'); router.refresh();
    } catch { setEstado('No pudimos guardar tus datos. Revisa la conexión y vuelve a intentarlo.'); }
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
    try {
      await leerRespuesta(await fetch('/api/cuenta', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) }));
      setEstado('Dirección guardada.'); formulario.reset(); router.refresh();
    } catch { setEstado('No pudimos guardar la dirección. Revisa tus datos y la conexión e inténtalo de nuevo.'); }
  }}>
    <label className={ETIQUETA}>Etiqueta<input name="etiqueta" required defaultValue="Sucursal" className={CAMPO} /></label>
    <label className={ETIQUETA}>Código postal<input name="codigo_postal" required minLength={5} className={CAMPO} /></label>
    <label className={`${ETIQUETA} md:col-span-2`}>Calle y número<input name="calle_numero" required className={CAMPO} /></label>
    <label className={ETIQUETA}>Colonia<input name="colonia" className={CAMPO} /></label><label className={ETIQUETA}>Municipio / alcaldía<input name="municipio" className={CAMPO} /></label>
    <label className={ETIQUETA}>Estado<input name="estado" className={CAMPO} /></label>
    <button className="b2b-boton" type="submit">Agregar dirección</button>{estado && <p role="status" className="md:col-span-2">{estado}</p>}
  </form>;
}

export function FormularioAcceso({ correo }: { correo: string }) {
  const [estado, setEstado] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  return <div className="grid gap-6 lg:grid-cols-2">
    <article className="rounded-lg border border-[#EBD9C3] bg-white/78 p-5">
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#6B5546]">Correo de acceso</p>
      <p className="mt-2 break-all text-lg font-black">{correo}</p>
      <p className="mt-3 text-sm font-semibold leading-6 text-[#6B5546]">Este correo identifica tu cuenta y se usa para iniciar sesión.</p>
    </article>
    <form className="grid gap-4 rounded-lg border border-[#EBD9C3] bg-white/78 p-5" onSubmit={async (e) => {
      e.preventDefault();
      const formulario = e.currentTarget;
      const datos = new FormData(formulario);
      const password = String(datos.get('password') ?? '');
      const confirmar = String(datos.get('confirmar') ?? '');
      if (password.length < 10) return setEstado('Usa al menos 10 caracteres.');
      if (password !== confirmar) return setEstado('Las contraseñas no coinciden.');
      setGuardando(true); setEstado('Actualizando…');
      const { error } = await crearCliente().auth.updateUser({ password });
      setGuardando(false);
      setEstado(error ? 'No se pudo actualizar la contraseña.' : 'Contraseña actualizada correctamente.');
      if (!error) formulario.reset();
    }}>
      <h3 className="text-2xl !font-black uppercase leading-none">Cambiar contraseña</h3>
      <label className={ETIQUETA}>Nueva contraseña<input name="password" type="password" required minLength={10} autoComplete="new-password" className={CAMPO} /></label>
      <label className={ETIQUETA}>Confirmar contraseña<input name="confirmar" type="password" required minLength={10} autoComplete="new-password" className={CAMPO} /></label>
      <button className="b2b-boton" type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Actualizar contraseña'}</button>
      {estado && <p role="status" className="text-sm font-bold text-[#6B5546]">{estado}</p>}
    </form>
  </div>;
}
