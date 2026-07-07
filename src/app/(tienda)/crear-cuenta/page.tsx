'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Building2, Check, Mail, MapPin, Phone, Store } from 'lucide-react';
import { crearCliente } from '@/lib/supabase/client';

type TipoNegocio = 'tiendita' | 'cafe' | 'emprendedor';

const tipos: Array<{ id: TipoNegocio; titulo: string; texto: string }> = [
  { id: 'tiendita', titulo: 'Tiendita', texto: 'Anaquel, mostrador y reorden frecuente.' },
  { id: 'cafe', titulo: 'Café / fonda', texto: 'Dulce adicional para subir ticket.' },
  { id: 'emprendedor', titulo: 'Reventa', texto: 'Mezclas listas para vender por pieza.' },
];

export default function PaginaCrearCuenta() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [nombreNegocio, setNombreNegocio] = useState('');
  const [tipoNegocio, setTipoNegocio] = useState<TipoNegocio>('tiendita');
  const [telefono, setTelefono] = useState('');
  const [calleNumero, setCalleNumero] = useState('');
  const [colonia, setColonia] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [estado, setEstado] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const manejarEnvio = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setError(null);

    if (password !== confirmarPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setEnviando(true);
    try {
      const respuesta = await fetch('/api/crear-cuenta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email, password, nombre_negocio: nombreNegocio, tipo_negocio: tipoNegocio,
          telefono, calle_numero: calleNumero, colonia, municipio, estado, codigo_postal: codigoPostal,
        }),
      });

      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.error ?? 'No se pudo crear la cuenta');

      const supabase = crearCliente();
      const { error: errorLogin } = await supabase.auth.signInWithPassword({ email, password });
      if (errorLogin) throw errorLogin;

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado');
      setEnviando(false);
    }
  };

  const inputClass = 'min-h-12 rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] px-4 text-sm font-semibold text-[#2B1B12] outline-none transition focus:border-[#FF5A5F]';
  const labelClass = 'grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#6B5546]';

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF6EC] px-4 pb-16 pt-28 text-[#2B1B12] md:px-8 md:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(255,180,0,0.18),transparent_28%),radial-gradient(circle_at_84%_22%,rgba(255,90,95,0.14),transparent_28%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <aside className="aparecer lg:sticky lg:top-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#EBD9C3] bg-white/75 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#FF5A5F] shadow-sm">
            <Store size={14} /> Nuevo negocio
          </span>
          <h1 className="mt-5 font-titulo !font-black text-[clamp(3.2rem,7vw,6.5rem)] uppercase leading-[0.84]">
            Crea tu cuenta mayorista.
          </h1>
          <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-[#6B5546]">
            Guarda tus datos, compra más rápido y prepara tu tienda para reordenar por escáner cuando se active la lectura real.
          </p>
          <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-lg border border-[#EBD9C3] bg-white shadow-[0_18px_50px_rgba(43,27,18,0.08)]">
            <Image src="/palomitas.png" alt="Palomitas de caramelo" fill sizes="(min-width: 1024px) 420px, 100vw" className="blend-multiply object-cover" />
          </div>
        </aside>

        <form onSubmit={manejarEnvio} className="aparecer retraso-1 grid gap-5 rounded-lg border border-[#EBD9C3] bg-white/88 p-4 shadow-[0_24px_70px_rgba(43,27,18,0.12)] backdrop-blur md:p-6">
          <section className="grid gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#FF5A5F] text-white"><Building2 size={18} /></span>
              <h2 className="font-titulo !font-black text-3xl uppercase leading-none">Tu negocio</h2>
            </div>
            <label className={labelClass}>
              Nombre del negocio
              <input className={inputClass} type="text" required value={nombreNegocio} onChange={(e) => setNombreNegocio(e.target.value)} placeholder="Ej. Miscelánea Don Beto" />
            </label>
            <div className="grid gap-3 md:grid-cols-3">
              {tipos.map((tipo) => (
                <button
                  key={tipo.id}
                  type="button"
                  onClick={() => setTipoNegocio(tipo.id)}
                  className={`rounded-lg border p-4 text-left transition ${
                    tipoNegocio === tipo.id ? 'border-[#2B1B12] bg-[#2B1B12] text-white' : 'border-[#EBD9C3] bg-[#FFF6EC] text-[#2B1B12] hover:border-[#FF5A5F]'
                  }`}
                >
                  <span className="mb-3 flex items-center justify-between">
                    <strong className="text-sm font-black uppercase tracking-[0.12em]">{tipo.titulo}</strong>
                    {tipoNegocio === tipo.id && <Check size={16} />}
                  </span>
                  <span className={tipoNegocio === tipo.id ? 'text-xs font-semibold text-white/75' : 'text-xs font-semibold text-[#6B5546]'}>
                    {tipo.texto}
                  </span>
                </button>
              ))}
            </div>
            <label className={labelClass}>
              Teléfono
              <span className="flex items-center gap-3 rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] px-4">
                <Phone size={17} className="text-[#FF5A5F]" />
                <input className="min-h-12 w-full bg-transparent text-sm font-semibold outline-none" type="tel" required value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="55 1234 5678" />
              </span>
            </label>
          </section>

          <section className="grid gap-4 border-t border-[#EBD9C3] pt-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#00A699] text-white"><MapPin size={18} /></span>
              <h2 className="font-titulo !font-black text-3xl uppercase leading-none">Entrega</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className={`${labelClass} md:col-span-2`}>
                Calle y número
                <input className={inputClass} type="text" required value={calleNumero} onChange={(e) => setCalleNumero(e.target.value)} placeholder="Av. Siempre Viva 123" />
              </label>
              <label className={labelClass}>Colonia<input className={inputClass} type="text" value={colonia} onChange={(e) => setColonia(e.target.value)} /></label>
              <label className={labelClass}>Municipio/Alcaldía<input className={inputClass} type="text" value={municipio} onChange={(e) => setMunicipio(e.target.value)} /></label>
              <label className={labelClass}>Estado<input className={inputClass} type="text" value={estado} onChange={(e) => setEstado(e.target.value)} /></label>
              <label className={labelClass}>Código postal<input className={inputClass} type="text" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} /></label>
            </div>
          </section>

          <section className="grid gap-4 border-t border-[#EBD9C3] pt-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#FFB400] text-[#2B1B12]"><Mail size={18} /></span>
              <h2 className="font-titulo !font-black text-3xl uppercase leading-none">Acceso</h2>
            </div>
            <label className={labelClass}>Correo electrónico<input className={inputClass} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" /></label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className={labelClass}>Contraseña<input className={inputClass} type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" /></label>
              <label className={labelClass}>Confirmar contraseña<input className={inputClass} type="password" required value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)} /></label>
            </div>
          </section>

          {error && <p className="rounded-lg border border-[#D64545]/30 bg-[#D64545]/10 px-4 py-3 text-sm font-bold text-[#D64545]">{error}</p>}

          <button type="submit" disabled={enviando} className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#2B1B12] px-6 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#FF5A5F] disabled:opacity-60">
            {enviando ? 'Creando cuenta...' : 'Crear cuenta'} <ArrowRight size={16} />
          </button>

          <p className="text-center text-sm font-semibold text-[#6B5546]">
            ¿Ya tienes cuenta? <Link href="/iniciar-sesion" className="font-black text-[#FF5A5F]">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
