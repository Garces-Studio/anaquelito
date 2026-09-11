'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Boxes, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, MapPinned, ShieldCheck, Sparkles } from 'lucide-react';
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
    <main className="cuenta-comercial relative min-h-screen overflow-hidden bg-[#FFF6EC] px-4 pb-16 pt-28 text-[#2B1B12] md:px-8 md:pb-24 md:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_10%,rgba(255,90,95,0.18),transparent_30%),radial-gradient(circle_at_94%_16%,rgba(0,166,153,0.16),transparent_28%),linear-gradient(135deg,#FFF6EC_0%,#FFF9F2_52%,#F4ECE2_100%)]" />
      <div className="absolute left-[8%] top-32 h-40 w-40 rounded-full border border-[#FF5A5F]/15" />
      <div className="absolute bottom-14 right-[7%] h-56 w-56 rounded-full border border-[#00A699]/15" />
      <div className="relative mx-auto grid max-w-7xl overflow-hidden rounded-[30px] border border-white/80 bg-white/45 shadow-[0_32px_90px_rgba(43,27,18,0.14)] backdrop-blur-xl lg:min-h-[650px] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="aparecer relative isolate flex min-h-[380px] flex-col overflow-hidden bg-[#381B22] p-7 text-white sm:min-h-[570px] sm:p-10 lg:min-h-full lg:p-12">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_82%_18%,rgba(255,90,95,0.72),transparent_31%),radial-gradient(circle_at_8%_96%,rgba(255,138,61,0.45),transparent_34%),linear-gradient(145deg,#2B1B12_0%,#4A1B29_54%,#7A2535_100%)]" />
          <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:38px_38px]" />
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white backdrop-blur">
            <Sparkles size={14} className="text-[#FFB400]" /> Tu espacio Anaquelito
          </span>
          <h1 className="mt-7 max-w-xl font-titulo !font-black text-[clamp(2.8rem,5vw,5.3rem)] uppercase leading-[0.88] text-white">
            Todo tu negocio, en orden.
          </h1>
          <p className="mt-5 max-w-lg text-base font-semibold leading-7 text-white/72">
            Entra para consultar pedidos, repetir tu surtido y mantener tus datos de entrega siempre listos.
          </p>

          <div className="mt-8 grid max-w-lg gap-3">
            {[
              { Icono: Boxes, titulo: 'Pedidos y recompra', texto: 'Consulta tu historial y vuelve a surtir en menos pasos.', color: '#FFB400' },
              { Icono: MapPinned, titulo: 'Direcciones de entrega', texto: 'Guarda la información de cada sucursal de tu negocio.', color: '#45CBBF' },
              { Icono: ShieldCheck, titulo: 'Cuenta protegida', texto: 'Tus compras y datos sólo aparecen dentro de tu sesión.', color: '#FF7B80' },
            ].map(({ Icono, titulo, texto, color }) => (
              <article key={titulo} className="flex items-start gap-4 rounded-2xl border border-white/14 bg-white/[0.08] p-4 backdrop-blur-sm">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10" style={{ color }}><Icono size={20} /></span>
                <div className="min-w-0"><strong className="block text-sm font-black uppercase tracking-[0.08em] text-white">{titulo}</strong><p className="mt-1 text-sm font-medium leading-5 text-white/62">{texto}</p></div>
              </article>
            ))}
          </div>

          <div className="pointer-events-none absolute -bottom-16 -right-8 hidden h-72 w-56 rotate-6 opacity-30 lg:block">
            <Image src="/productos/gomita-oso.png" alt="" fill sizes="224px" className="object-contain drop-shadow-[0_24px_35px_rgba(0,0,0,.3)]" />
          </div>
        </section>

        <section className="aparecer retraso-1 flex items-center bg-white/88 p-6 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8">
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#00A699]">Acceso para clientes</span>
              <h2 className="mt-3 text-[clamp(2rem,4vw,3rem)] !font-black leading-none text-[#2B1B12]">Bienvenido de nuevo</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#6B5546]">Ingresa con el correo y la contraseña de tu cuenta.</p>
            </div>

          <form onSubmit={manejarEnvio} className="grid gap-5 !rounded-none border-0 bg-transparent p-0 shadow-none">
            <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#6B5546]">
              Correo electrónico
              <span className="flex min-h-14 items-center gap-3 rounded-xl border border-[#EBD9C3] bg-[#FFF8F1] px-4 text-[#2B1B12] transition focus-within:border-[#00A699] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(0,166,153,.09)]">
                <Mail size={17} className="text-[#FF5A5F]" />
                <input className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#6B5546]/55" type="email" autoComplete="email" autoCapitalize="none" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" />
              </span>
            </label>
            <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#6B5546]">
              Contraseña
              <span className="flex min-h-14 items-center gap-3 rounded-xl border border-[#EBD9C3] bg-[#FFF8F1] px-4 text-[#2B1B12] transition focus-within:border-[#00A699] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(0,166,153,.09)]">
                <LockKeyhole size={17} className="text-[#FF5A5F]" />
                <input className="w-full bg-transparent text-sm font-semibold outline-none" type={visible ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={visible} onClick={() => setVisible(!visible)} className="grid min-h-11 min-w-11 place-items-center">{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </span>
            </label>

            {error && <p role="alert" className="rounded-lg border border-[#D64545]/30 bg-[#D64545]/10 px-4 py-3 text-sm font-bold text-[#D64545]">{error}</p>}

            <button type="submit" disabled={enviando} className="group inline-flex min-h-[56px] items-center justify-center gap-2 rounded-xl bg-[#FF5A5F] px-6 py-4 text-[12px] font-black uppercase tracking-[0.14em] text-white shadow-[0_14px_34px_rgba(255,90,95,0.3)] transition hover:-translate-y-0.5 hover:bg-[#E0484D] hover:shadow-[0_18px_42px_rgba(255,90,95,0.38)] disabled:opacity-60" style={{ backgroundColor: '#FF5A5F', color: '#FFFFFF' }}>
              {enviando ? 'Entrando…' : 'Entrar a mi cuenta'} <ArrowRight size={17} className="transition group-hover:translate-x-1" />
            </button>

            <Link href="/recuperar-contrasena" className="inline-flex min-h-11 items-center justify-center text-sm font-bold text-[#007A70] underline underline-offset-4">Olvidé mi contraseña</Link>
            <Link href="/crear-cuenta" className="inline-flex min-h-[54px] items-center justify-center rounded-xl border border-[#EBD9C3] bg-white px-5 text-sm font-black text-[#2B1B12] transition hover:border-[#00A699] hover:bg-[#E9F8F5] hover:text-[#007A70]">Crear una cuenta nueva</Link>
          </form>
          <div className="mt-7 flex items-start gap-3 border-t border-[#EBD9C3] pt-5 text-xs font-semibold leading-5 text-[#6B5546]"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#00A699]" /><p>Tu carrito se conserva aunque todavía no hayas iniciado sesión.</p></div>
          </div>
        </section>
      </div>
    </main>
  );
}
