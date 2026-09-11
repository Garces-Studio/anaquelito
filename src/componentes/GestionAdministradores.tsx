'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldPlus } from 'lucide-react';

export default function GestionAdministradores() {
  const router = useRouter();
  const [estado, setEstado] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  return <form className="grid gap-3 rounded-lg border border-[#EBD9C3] bg-white/82 p-5 shadow-sm sm:grid-cols-[1fr_auto] sm:items-end" onSubmit={async (e) => {
    e.preventDefault();
    const formulario = e.currentTarget;
    const correo = String(new FormData(formulario).get('correo') ?? '');
    setGuardando(true); setEstado('Asignando permiso…');
    const respuesta = await fetch('/api/admin/administradores', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ correo }) });
    const datos = await respuesta.json();
    setGuardando(false); setEstado(respuesta.ok ? 'Administrador agregado correctamente.' : datos.error);
    if (respuesta.ok) { formulario.reset(); router.refresh(); }
  }}>
    <label className="grid gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#6B5546]">Correo de una cuenta existente
      <input name="correo" type="email" required autoComplete="email" className="min-h-12 rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] px-4 text-sm font-semibold normal-case tracking-normal outline-none focus:border-[#7621B0]" placeholder="persona@negocio.com" />
    </label>
    <button type="submit" disabled={guardando} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#7621B0] px-5 text-[11px] font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#2B1B12] disabled:opacity-50" style={{ color: '#FFFFFF' }}>
      <ShieldPlus size={16} /> {guardando ? 'Asignando…' : 'Hacer administrador'}
    </button>
    {estado && <p role="status" className="text-sm font-bold text-[#6B5546] sm:col-span-2">{estado}</p>}
  </form>;
}
