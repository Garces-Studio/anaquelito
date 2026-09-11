'use client';

import { useEffect, useState } from 'react';
import { KeyRound, LoaderCircle, ShieldCheck, Smartphone } from 'lucide-react';
import { crearCliente } from '@/lib/supabase/client';

type Factor = { id: string; status: string; factor_type: string };

export default function SeguridadAdministrador({ correo }: { correo: string }) {
  const [factor, setFactor] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [secreto, setSecreto] = useState<string | null>(null);
  const [codigo, setCodigo] = useState('');
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargar = async () => {
      const supabase = crearCliente();
      const { data, error: errorFactores } = await supabase.auth.mfa.listFactors();
      if (errorFactores) setError('No pudimos revisar la seguridad de tu cuenta. Actualiza la página.');
      const verificado = (data?.totp ?? []).find((item: Factor) => item.status === 'verified');
      setFactor(verificado?.id ?? null);
      setCargando(false);
    };
    void cargar();
  }, []);

  const preparar = async () => {
    setProcesando(true);
    setError(null);
    const supabase = crearCliente();
    const { data: existentes } = await supabase.auth.mfa.listFactors();
    for (const item of (existentes?.all ?? []) as Factor[]) {
      if (item.factor_type === 'totp' && item.status === 'unverified') {
        await supabase.auth.mfa.unenroll({ factorId: item.id });
      }
    }
    const { data, error: errorAlta } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Anaquelito administrador',
      issuer: 'Anaquelito',
    });
    if (errorAlta || !data || data.type !== 'totp') {
      setError('No pudimos generar el código de seguridad. Intenta nuevamente.');
    } else {
      setFactor(data.id);
      setQr(data.totp.qr_code);
      setSecreto(data.totp.secret);
    }
    setProcesando(false);
  };

  const verificar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (!factor || !/^\d{6}$/.test(codigo)) {
      setError('Escribe el código de seis dígitos de tu aplicación.');
      return;
    }
    setProcesando(true);
    setError(null);
    const { error: errorVerificacion } = await crearCliente().auth.mfa.challengeAndVerify({ factorId: factor, code: codigo });
    if (errorVerificacion) {
      setError('El código no es válido o ya venció. Espera el siguiente e inténtalo otra vez.');
      setProcesando(false);
      return;
    }
    window.location.assign('/admin');
  };

  return (
    <main className="pagina-colorida min-h-screen px-4 pb-24 pt-28 text-[#2B1B12] md:px-8 md:pt-36">
      <section className="mx-auto max-w-3xl overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-[0_30px_90px_rgba(43,27,18,.14)] backdrop-blur">
        <header className="bg-[linear-gradient(135deg,#23131F,#5B2340)] p-7 text-white sm:p-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[.16em]"><ShieldCheck size={15} /> Protección del panel</span>
          <h1 className="mt-5 !text-4xl !font-black text-white sm:!text-5xl">Confirma que eres tú</h1>
          <p className="mt-4 max-w-xl text-sm font-semibold leading-6 text-white/75">Los precios, clientes y pedidos necesitan una segunda llave además de tu contraseña. Cuenta: {correo}</p>
        </header>

        <div className="grid gap-6 p-6 sm:p-10">
          {cargando ? <p className="flex items-center gap-3 font-bold text-[#6B5546]"><LoaderCircle className="animate-spin" /> Revisando protección…</p> : !factor ? (
            <div className="grid gap-5">
              <div className="flex gap-4 rounded-2xl bg-[#E9F8F5] p-5"><Smartphone className="mt-1 shrink-0 text-[#007A70]" /><p className="text-sm font-semibold leading-6">Usa una aplicación como Google Authenticator, Microsoft Authenticator o 1Password. El código cambia cada 30 segundos.</p></div>
              <button type="button" onClick={preparar} disabled={procesando} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#FF5A5F] px-6 font-black text-white shadow-lg disabled:opacity-60"><KeyRound size={18} /> {procesando ? 'Preparando…' : 'Activar doble verificación'}</button>
            </div>
          ) : (
            <form onSubmit={verificar} className="grid gap-5">
              {qr && <div className="grid justify-items-center gap-4 rounded-2xl border border-[#EBD9C3] bg-[#FFF9F3] p-5 text-center"><img src={qr} alt="Código QR para configurar el autenticador" className="h-52 w-52 rounded-xl bg-white p-2" /><p className="max-w-md text-sm font-semibold text-[#6B5546]">Escanea este QR. Si no puedes, agrega manualmente esta clave:</p>{secreto && <code className="break-all rounded-xl bg-white px-4 py-3 text-xs font-black text-[#2B1B12]">{secreto}</code>}</div>}
              {!qr && <div className="rounded-2xl bg-[#FFF0D5] p-5 text-sm font-bold text-[#6B4A00]">Abre tu aplicación de autenticación y escribe el código actual.</div>}
              <label className="grid gap-2 text-sm font-black">Código de seis dígitos<input autoFocus inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={codigo} onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))} className="min-h-16 rounded-2xl border border-[#E6D8CD] bg-white px-5 text-center text-2xl font-black tracking-[.35em] outline-none focus:border-[#00A699] focus:ring-4 focus:ring-[#00A699]/10" placeholder="000000" /></label>
              <button disabled={procesando} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#00A699] px-6 font-black text-white shadow-lg disabled:opacity-60"><ShieldCheck size={18} /> {procesando ? 'Verificando…' : 'Verificar y entrar al panel'}</button>
            </form>
          )}
          {error && <p role="alert" className="rounded-2xl border border-[#D64545]/25 bg-[#FFF1F1] p-4 text-sm font-bold text-[#B73535]">{error}</p>}
        </div>
      </section>
    </main>
  );
}
