'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ScanLine } from 'lucide-react';
import { crearCliente } from '@/lib/supabase/client';
import { registrarEvento } from '@/lib/analitica';

export default function PaginaIniciarSesion() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const manejarEnvio = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setEnviando(true);
    setError(null);

    try {
    const supabase = crearCliente();
    const { error: errorLogin } = await supabase.auth.signInWithPassword({ email, password });

    if (errorLogin) {
      setError('Correo o contraseña incorrectos.');
      setEnviando(false);
      return;
    }

    registrarEvento('login', { method: 'email' });

    router.push('/dashboard');
    router.refresh();
    } catch {
      setError('No pudimos conectar. Intenta de nuevo en un momento.');
      setEnviando(false);
    }
  };

  return (
    <main className="cuenta-comercial relative min-h-screen overflow-hidden bg-[#FFF6EC] px-4 pb-16 pt-28 text-[#2B1B12] md:px-8 md:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(255,90,95,0.16),transparent_28%),radial-gradient(circle_at_86%_22%,rgba(0,166,153,0.14),transparent_28%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <section className="aparecer flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#EBD9C3] bg-white/75 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#FF5A5F] shadow-sm">
            <ScanLine size={14} /> Panel B2B
          </span>
          <h1 className="max-w-2xl font-titulo !font-black text-[clamp(3.4rem,8vw,7rem)] uppercase leading-[0.84]">
            Tu negocio, tus pedidos.
          </h1>
          <p className="max-w-xl text-base font-semibold leading-7 text-[#6B5546]">
            Consulta tus compras y guarda las direcciones de tu negocio en un solo lugar.
          </p>
          <div className="grid max-w-xl gap-3 sm:grid-cols-3">
            {[
              ['Pedidos', 'Historial'],
              ['Direcciones', 'Entrega'],
              ['Cuenta', 'Tu negocio'],
            ].map(([titulo, texto]) => (
              <div key={titulo} className="rounded-lg border border-[#EBD9C3] bg-white/78 p-4 shadow-sm backdrop-blur">
                <strong className="block text-2xl font-black uppercase leading-none">{titulo}</strong>
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6B5546]">{texto}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="aparecer retraso-1 rounded-lg border border-[#EBD9C3] bg-white/86 p-4 shadow-[0_24px_70px_rgba(43,27,18,0.12)] backdrop-blur md:p-6">
          <div className="mb-6"><h2>Bienvenido de nuevo</h2><p className="mt-2 text-[#6B5546]">Ingresa con el correo de tu cuenta.</p></div>

          <form onSubmit={manejarEnvio} className="grid gap-4">
            <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#6B5546]">
              Correo electrónico
              <span className="flex min-h-12 items-center gap-3 rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] px-4 text-[#2B1B12]">
                <Mail size={17} className="text-[#FF5A5F]" />
                <input className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#6B5546]/55" type="email" autoComplete="email" autoCapitalize="none" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" />
              </span>
            </label>
            <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#6B5546]">
              Contraseña
              <span className="flex min-h-12 items-center gap-3 rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] px-4 text-[#2B1B12]">
                <LockKeyhole size={17} className="text-[#FF5A5F]" />
                <input className="w-full bg-transparent text-sm font-semibold outline-none" type={visible ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={visible} onClick={() => setVisible(!visible)} className="grid min-h-11 min-w-11 place-items-center">{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </span>
            </label>

            {error && <p role="alert" className="rounded-lg border border-[#D64545]/30 bg-[#D64545]/10 px-4 py-3 text-sm font-bold text-[#D64545]">{error}</p>}

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
