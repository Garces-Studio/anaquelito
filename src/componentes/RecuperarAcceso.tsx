'use client';
import { useState } from 'react';
import Link from 'next/link';
import { KeyRound } from 'lucide-react';
import { crearCliente } from '@/lib/supabase/client';
import { leerRespuesta } from '@/lib/respuesta-json';

export default function RecuperarAcceso({ restablecer = false }: { restablecer?: boolean }) {
  const [ocupado, setOcupado] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [listo, setListo] = useState(false);
  return <main style={{ color: '#2B1B12' }} className="cuenta-comercial min-h-screen bg-[#F7F3F8] px-4 pb-20 pt-32">
    <section className="mx-auto max-w-lg rounded-[28px] border border-white bg-white p-6 shadow-xl sm:p-10">
      <KeyRound className="mb-5 text-[#00A699]" size={32} />
      <h1 className="!text-3xl !font-black">{restablecer ? 'Tu nueva contraseña' : 'Recupera tu acceso'}</h1>
      <p className="my-5 text-sm leading-6 text-[#6B5546]">{restablecer ? 'Elige una contraseña de al menos 10 caracteres.' : 'Te enviaremos un enlace al correo de tu cuenta. Si el anterior venció, solicita uno nuevo.'}</p>
      {!listo && <form className="grid gap-5" onSubmit={async (e) => {
        e.preventDefault(); if (ocupado) return;
        const datos = new FormData(e.currentTarget); setOcupado(true); setMensaje('');
        try {
          if (restablecer) {
            const password = String(datos.get('password'));
            if (password !== datos.get('confirmar')) throw new Error('Las contraseñas no coinciden.');
            const supabase = crearCliente();
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw new Error('El enlace venció o la contraseña no pudo cambiarse. Solicita un enlace nuevo.');
            await supabase.auth.signOut();
            setMensaje('Contraseña actualizada. Ya puedes iniciar sesión.');
          } else {
            const resultado = await leerRespuesta(await fetch('/api/recuperar-acceso', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: datos.get('email') }) }));
            setMensaje(String(resultado.mensaje));
          }
          setListo(true);
        } catch (err) { setMensaje(err instanceof Error ? err.message : 'No pudimos completar la solicitud.'); }
        finally { setOcupado(false); }
      }}>
        {restablecer ? <><label className="grid gap-2 font-bold">Nueva contraseña<input className="min-h-12 rounded-xl border p-3" name="password" type="password" required minLength={10} maxLength={128} autoComplete="new-password" /></label><label className="grid gap-2 font-bold">Confirmar contraseña<input className="min-h-12 rounded-xl border p-3" name="confirmar" type="password" required minLength={10} maxLength={128} autoComplete="new-password" /></label></> : <label className="grid gap-2 font-bold">Correo electrónico<input className="min-h-12 rounded-xl border p-3" name="email" type="email" required maxLength={254} autoComplete="email" /></label>}
        <button disabled={ocupado} className="min-h-12 rounded-xl px-4 font-bold disabled:opacity-60" style={{ background: '#FF5A5F', color: 'white' }}>{ocupado ? 'Procesando…' : restablecer ? 'Guardar contraseña' : 'Enviar enlace'}</button>
      </form>}
      {mensaje && <p role={listo ? 'status' : 'alert'} className="mt-5 rounded-xl bg-[#E9F8F5] p-4 text-sm font-semibold">{mensaje}</p>}
      <Link className="mt-6 inline-flex min-h-11 items-center font-bold text-[#007A70]" href="/iniciar-sesion">Volver a iniciar sesión</Link>
      {restablecer && <Link className="block py-3 text-sm underline" href="/recuperar-contrasena">Solicitar otro enlace</Link>}
    </section>
  </main>;
}
