'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, LockKeyhole, Mail, PackageCheck, ScanLine } from 'lucide-react';
import { crearCliente } from '@/lib/supabase/client';

export default function PaginaIniciarSesion() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const manejarEnvio = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setEnviando(true);
    setError(null);

    const supabase = crearCliente();
    const { error: errorLogin } = await supabase.auth.signInWithPassword({ email, password });

    if (errorLogin) {
      setError('Correo o contraseña incorrectos.');
      setEnviando(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF6EC] px-4 pb-16 pt-28 text-[#2B1B12] md:px-8 md:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(255,90,95,0.16),transparent_28%),radial-gradient(circle_at_86%_22%,rgba(0,166,153,0.14),transparent_28%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <section className="aparecer flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#EBD9C3] bg-white/75 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#FF5A5F] shadow-sm">
            <ScanLine size={14} /> Panel B2B
          </span>
          <h1 className="max-w-2xl font-titulo !font-black text-[clamp(3.4rem,8vw,7rem)] uppercase leading-[0.84]">
            Vuelve a surtir sin empezar de cero.
          </h1>
          <p className="max-w-xl text-base font-semibold leading-7 text-[#6B5546]">
            Entra a tu cuenta para revisar pedidos, direcciones, cupones y reordenar dulces con menos fricción.
          </p>
          <div className="grid max-w-xl gap-3 sm:grid-cols-3">
            {[
              ['Pedidos', 'Historial'],
              ['Escáner', 'Reorden'],
              ['Cupones', 'Ahorro'],
            ].map(([titulo, texto]) => (
              <div key={titulo} className="rounded-lg border border-[#EBD9C3] bg-white/78 p-4 shadow-sm backdrop-blur">
                <strong className="block text-2xl font-black uppercase leading-none">{titulo}</strong>
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6B5546]">{texto}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="aparecer retraso-1 rounded-lg border border-[#EBD9C3] bg-white/86 p-4 shadow-[0_24px_70px_rgba(43,27,18,0.12)] backdrop-blur md:p-6">
          <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-lg bg-[#FFF6EC]">
            <Image src="/gomitas.png" alt="Gomitas enchiladas" fill sizes="(min-width: 1024px) 520px, 100vw" className="blend-multiply object-cover" />
            <div className="absolute inset-x-4 bottom-4 rounded-lg border border-white/70 bg-white/70 p-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#00A699] text-white">
                  <PackageCheck size={18} />
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6B5546]">Cuenta lista</p>
                  <p className="text-lg font-black uppercase leading-none">Reordena en minutos</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={manejarEnvio} className="grid gap-4">
            <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#6B5546]">
              Correo electrónico
              <span className="flex min-h-12 items-center gap-3 rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] px-4 text-[#2B1B12]">
                <Mail size={17} className="text-[#FF5A5F]" />
                <input className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#6B5546]/55" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" />
              </span>
            </label>
            <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#6B5546]">
              Contraseña
              <span className="flex min-h-12 items-center gap-3 rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] px-4 text-[#2B1B12]">
                <LockKeyhole size={17} className="text-[#FF5A5F]" />
                <input className="w-full bg-transparent text-sm font-semibold outline-none" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </span>
            </label>

            {error && <p className="rounded-lg border border-[#D64545]/30 bg-[#D64545]/10 px-4 py-3 text-sm font-bold text-[#D64545]">{error}</p>}

            <button type="submit" disabled={enviando} className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#2B1B12] px-6 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#FF5A5F] disabled:opacity-60">
              {enviando ? 'Entrando...' : 'Iniciar sesión'} <ArrowRight size={16} />
            </button>

            <p className="text-center text-sm font-semibold text-[#6B5546]">
              ¿No tienes cuenta?{' '}
              <Link href="/crear-cuenta" className="font-black text-[#FF5A5F]">
                Créala aquí
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
