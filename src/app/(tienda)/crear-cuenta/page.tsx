'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Building2, Check, Coffee, Eye, EyeOff, Mail, MapPin, PackageCheck, Phone, RefreshCw, ShieldCheck, Sparkles, Store, Zap } from 'lucide-react';
import { crearCliente } from '@/lib/supabase/client';
import { registrarEvento } from '@/lib/analitica';

type TipoNegocio = 'tiendita' | 'cafe' | 'emprendedor';

const tipos = [
  { id: 'tiendita' as const, titulo: 'Tiendita', texto: 'Anaquel, mostrador y reorden frecuente.', Icono: Store },
  { id: 'cafe' as const, titulo: 'Café / fonda', texto: 'Dulce adicional para subir ticket.', Icono: Coffee },
  { id: 'emprendedor' as const, titulo: 'Reventa', texto: 'Producto listo para vender por pieza.', Icono: RefreshCw },
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
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campoError, setCampoError] = useState<string | null>(null);

  const avisarCampo = (campo: string, mensaje: string) => {
    setCampoError(campo);
    setError(mensaje);
    window.requestAnimationFrame(() => {
      const elemento = document.getElementById(campo);
      elemento?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      elemento?.focus({ preventScroll: true });
    });
  };

  const limpiarCampo = (campo: string) => {
    if (campoError === campo) {
      setCampoError(null);
      setError(null);
    }
  };

  const manejarEnvio = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setError(null);
    setCampoError(null);

    if (!nombreNegocio.trim()) return avisarCampo('nombre-negocio', 'Escribe el nombre de tu negocio para continuar.');
    if (telefono.replace(/\D/g, '').length < 8) return avisarCampo('telefono', 'Escribe un teléfono válido de al menos 8 dígitos.');
    if (!calleNumero.trim()) return avisarCampo('calle-numero', 'Escribe la calle y número donde recibirás tus pedidos.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return avisarCampo('correo', 'Escribe un correo electrónico válido.');
    if (password.length < 8) return avisarCampo('password', 'La contraseña debe tener al menos 8 caracteres.');
    if (password !== confirmarPassword) {
      return avisarCampo('confirmar-password', 'Las contraseñas no coinciden. Escríbelas nuevamente.');
    }

    setEnviando(true);
    try {
      const respuesta = await fetch('/api/crear-cuenta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email, password, nombre_negocio: nombreNegocio, tipo_negocio: tipoNegocio,
          telefono, calle_numero: calleNumero, colonia, municipio, estado, codigo_postal: codigoPostal,
          pedido: new URLSearchParams(window.location.search).get('pedido'), token_pedido: new URLSearchParams(window.location.search).get('token'),
        }),
      });

      const contenido = await respuesta.text();
      let datos: { error?: string } = {};
      if (contenido) {
        try { datos = JSON.parse(contenido) as { error?: string }; } catch { datos = {}; }
      }
      if (!respuesta.ok) throw new Error(datos.error ?? 'No pudimos crear la cuenta en este momento. Intenta nuevamente.');

      const supabase = crearCliente();
      const { error: errorLogin } = await supabase.auth.signInWithPassword({ email, password });
      if (errorLogin) throw errorLogin;

      registrarEvento('sign_up', { method: 'email', tipo_negocio: tipoNegocio });

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : '';
      setError(mensaje && !mensaje.includes('Unexpected end of JSON') ? mensaje : 'No pudimos conectar con el registro. Intenta nuevamente en un momento.');
      setEnviando(false);
    }
  };

  const inputClass = 'min-h-14 rounded-2xl border border-[#E6D8CD] bg-[#FFF9F3] px-4 text-sm font-semibold text-[#2B1B12] outline-none transition duration-300 placeholder:text-[#8B7465]/55 focus:border-[#00A699] focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,166,153,.09)]';
  const labelClass = 'grid gap-2 text-sm font-extrabold text-[#503D31]';
  const claseInput = (id: string) => `${inputClass} ${campoError === id ? '!border-[#D64545] !bg-[#FFF1F1] !shadow-[0_0_0_4px_rgba(214,69,69,.1)]' : ''}`;

  return (
    <main className="cuenta-comercial relative min-h-screen overflow-hidden bg-[#F7F3F8] px-4 pb-20 pt-28 text-[#2B1B12] md:px-8 md:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(255,90,95,.23),transparent_28%),radial-gradient(circle_at_92%_14%,rgba(0,166,153,.2),transparent_29%),radial-gradient(circle_at_62%_82%,rgba(118,33,176,.12),transparent_30%),linear-gradient(145deg,#FFF6EC_0%,#F8F5FB_52%,#EEF9F7_100%)]" />
      <div className="absolute left-[6%] top-40 h-44 w-44 animate-pulse rounded-full border border-[#FF5A5F]/20 shadow-[0_0_70px_rgba(255,90,95,.16)]" />
      <div className="absolute right-[4%] top-[30%] h-64 w-64 animate-pulse rounded-full border border-[#00A699]/20 shadow-[0_0_90px_rgba(0,166,153,.15)] [animation-delay:1s]" />

      <div className="relative mx-auto grid max-w-7xl overflow-hidden rounded-[32px] border border-white/80 bg-white/55 shadow-[0_35px_100px_rgba(43,27,18,.14)] backdrop-blur-xl lg:grid-cols-[.78fr_1.22fr]">
        <aside className="aparecer relative isolate overflow-hidden bg-[#23131F] p-7 text-white sm:p-10 lg:sticky lg:top-28 lg:min-h-[860px] lg:p-12">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_85%_16%,rgba(255,90,95,.7),transparent_28%),radial-gradient(circle_at_10%_90%,rgba(118,33,176,.55),transparent_34%),linear-gradient(145deg,#21131B_0%,#432035_52%,#6B2943_100%)]" />
          <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.13)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.13)_1px,transparent_1px)] [background-size:42px_42px]" />
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[.18em] text-white backdrop-blur">
            <Sparkles size={14} className="text-[#FFB400]" /> Tu cuenta mayorista
          </span>
          <h1 className="mt-7 max-w-lg !font-black text-[clamp(2.8rem,5vw,5rem)] leading-[.92] text-white">Tu negocio merece comprar mejor.</h1>
          <p className="mt-6 max-w-md text-base font-semibold leading-7 text-white/70">Crea un espacio para organizar pedidos, guardar entregas y volver a surtir sin empezar desde cero.</p>

          <div className="mt-10 hidden gap-3 sm:grid">
            {[{ Icono: PackageCheck, titulo: 'Pedidos bajo control', texto: 'Historial y recompra en un solo lugar.', color: '#FFB400' }, { Icono: MapPin, titulo: 'Entrega más sencilla', texto: 'Tu dirección queda lista para el próximo pedido.', color: '#45CBBF' }, { Icono: ShieldCheck, titulo: 'Información protegida', texto: 'Tus datos viven dentro de tu cuenta.', color: '#FF7B80' }].map(({ Icono, titulo, texto, color }) => (
              <div key={titulo} className="flex items-start gap-4 rounded-2xl border border-white/15 bg-white/[.08] p-4 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/[.12]">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10" style={{ color }}><Icono size={20} /></span>
                <div><strong className="block text-sm font-black uppercase tracking-[.07em] text-white">{titulo}</strong><p className="mt-1 text-sm font-medium leading-5 text-white/60">{texto}</p></div>
              </div>
            ))}
          </div>
          <Link href="/catalogo" className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-black text-white underline decoration-[#FFB400] decoration-2 underline-offset-8 transition hover:text-[#FFB400] sm:mt-9">Explorar los seis productos <ArrowRight size={18} /></Link>
        </aside>

        <form noValidate onSubmit={manejarEnvio} className="aparecer retraso-1 grid gap-8 !rounded-none border-0 bg-white/90 p-6 shadow-none sm:p-10 lg:p-12">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E6D8CD] pb-6">
            <div><span className="text-[11px] font-black uppercase tracking-[.18em] text-[#00A699]">Registro de cliente</span><h2 className="mt-2 !text-3xl !font-black text-[#2B1B12]">Configura tu cuenta</h2></div>
            <div className="flex items-center gap-2" aria-label="Tres pasos del registro">{['1', '2', '3'].map((paso, i) => <span key={paso} className={`grid h-9 w-9 place-items-center rounded-full text-xs font-black ${i === 0 ? 'bg-[#FF5A5F] text-white shadow-[0_8px_20px_rgba(255,90,95,.3)]' : i === 1 ? 'bg-[#E9F8F5] text-[#007A70]' : 'bg-[#FFF0D5] text-[#8A5D00]'}`}>{paso}</span>)}</div>
          </div>

          <section className="grid gap-5 rounded-[24px] border border-[#E9DED4] bg-white p-5 shadow-[0_14px_40px_rgba(43,27,18,.055)] sm:p-6">
            <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#FF5A5F] text-white shadow-[0_10px_25px_rgba(255,90,95,.28)]"><Building2 size={19} /></span><div><p className="text-[10px] font-black uppercase tracking-[.15em] text-[#FF5A5F]">Paso 1</p><h2 className="!text-2xl !font-black">Tu negocio</h2></div></div>
            <label className={labelClass}>
              Nombre del negocio <span className="sr-only">obligatorio</span>
              <input id="nombre-negocio" aria-invalid={campoError === 'nombre-negocio'} className={claseInput('nombre-negocio')} type="text" required value={nombreNegocio} onChange={(e) => { setNombreNegocio(e.target.value); limpiarCampo('nombre-negocio'); }} placeholder="Ej. Miscelánea Don Beto" />
            </label>
            <div className="grid gap-3 md:grid-cols-3">
              {tipos.map((tipo) => (
                <button
                  key={tipo.id}
                  type="button"
                  aria-pressed={tipoNegocio === tipo.id}
                  onClick={() => setTipoNegocio(tipo.id)}
                  className={`group rounded-2xl border p-4 text-left transition duration-300 ${
                    tipoNegocio === tipo.id ? 'border-[#FF5A5F] bg-[#FF5A5F] text-white shadow-[0_12px_30px_rgba(255,90,95,.25)]' : 'border-[#E6D8CD] bg-[#FFF9F3] text-[#2B1B12] hover:-translate-y-1 hover:border-[#FF5A5F] hover:bg-white'
                  }`}
                  style={tipoNegocio === tipo.id ? { backgroundColor: '#FF5A5F', color: '#FFFFFF' } : undefined}
                >
                  <span className="mb-4 flex items-center justify-between"><tipo.Icono size={19} />
                    {tipoNegocio === tipo.id && <Check size={16} />}
                  </span>
                  <strong className="block text-sm font-black uppercase tracking-[0.1em]">{tipo.titulo}</strong>
                  <span className={tipoNegocio === tipo.id ? 'text-xs font-semibold text-white/75' : 'text-xs font-semibold text-[#6B5546]'}>
                    {tipo.texto}
                  </span>
                </button>
              ))}
            </div>
            <label className={labelClass}>
              Teléfono <span className="sr-only">obligatorio</span>
              <span className={`flex min-h-14 items-center gap-3 rounded-2xl border bg-[#FFF9F3] px-4 transition focus-within:border-[#00A699] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(0,166,153,.09)] ${campoError === 'telefono' ? 'border-[#D64545] bg-[#FFF1F1]' : 'border-[#E6D8CD]'}`}>
                <Phone size={17} className="text-[#FF5A5F]" />
                <input id="telefono" aria-invalid={campoError === 'telefono'} className="min-h-12 w-full bg-transparent text-sm font-semibold outline-none" type="tel" required value={telefono} onChange={(e) => { setTelefono(e.target.value); limpiarCampo('telefono'); }} placeholder="55 1234 5678" />
              </span>
            </label>
          </section>

          <section className="grid gap-5 rounded-[24px] border border-[#DCEDEA] bg-[#FAFFFE] p-5 shadow-[0_14px_40px_rgba(0,166,153,.06)] sm:p-6">
            <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#00A699] text-white shadow-[0_10px_25px_rgba(0,166,153,.23)]"><MapPin size={19} /></span><div><p className="text-[10px] font-black uppercase tracking-[.15em] text-[#008D82]">Paso 2</p><h2 className="!text-2xl !font-black">Entrega</h2></div></div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className={`${labelClass} md:col-span-2`}>
                Calle y número <span className="sr-only">obligatorio</span>
                <input id="calle-numero" aria-invalid={campoError === 'calle-numero'} className={claseInput('calle-numero')} type="text" required value={calleNumero} onChange={(e) => { setCalleNumero(e.target.value); limpiarCampo('calle-numero'); }} placeholder="Av. Siempre Viva 123" />
              </label>
              <label className={labelClass}>Colonia<input className={inputClass} type="text" value={colonia} onChange={(e) => setColonia(e.target.value)} /></label>
              <label className={labelClass}>Municipio/Alcaldía<input className={inputClass} type="text" value={municipio} onChange={(e) => setMunicipio(e.target.value)} /></label>
              <label className={labelClass}>Estado<input className={inputClass} type="text" value={estado} onChange={(e) => setEstado(e.target.value)} /></label>
              <label className={labelClass}>Código postal<input className={inputClass} type="text" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} /></label>
            </div>
          </section>

          <section className="grid gap-5 rounded-[24px] border border-[#E8DDF0] bg-[#FEFBFF] p-5 shadow-[0_14px_40px_rgba(118,33,176,.055)] sm:p-6">
            <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#7621B0] text-white shadow-[0_10px_25px_rgba(118,33,176,.22)]"><Mail size={19} /></span><div><p className="text-[10px] font-black uppercase tracking-[.15em] text-[#7621B0]">Paso 3</p><h2 className="!text-2xl !font-black">Acceso seguro</h2></div></div>
            <label className={labelClass}>Correo electrónico <span className="sr-only">obligatorio</span><input id="correo" aria-invalid={campoError === 'correo'} className={claseInput('correo')} type="email" required value={email} onChange={(e) => { setEmail(e.target.value); limpiarCampo('correo'); }} placeholder="tucorreo@ejemplo.com" /></label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className={labelClass}>Contraseña <span className="sr-only">obligatorio</span><span className="relative"><input id="password" aria-invalid={campoError === 'password'} className={`${claseInput('password')} w-full pr-12`} type={passwordVisible ? 'text' : 'password'} required minLength={8} value={password} onChange={(e) => { setPassword(e.target.value); limpiarCampo('password'); }} placeholder="Mínimo 8 caracteres" /><button type="button" onClick={() => setPasswordVisible(!passwordVisible)} aria-label={passwordVisible ? 'Ocultar contraseñas' : 'Mostrar contraseñas'} className="absolute right-1.5 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-xl text-[#6B5546] hover:bg-[#F0E8F5]">{passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
              <label className={labelClass}>Confirmar contraseña <span className="sr-only">obligatorio</span><input id="confirmar-password" aria-invalid={campoError === 'confirmar-password'} className={claseInput('confirmar-password')} type={passwordVisible ? 'text' : 'password'} required value={confirmarPassword} onChange={(e) => { setConfirmarPassword(e.target.value); limpiarCampo('confirmar-password'); }} /></label>
            </div>
            <p className="flex items-center gap-2 text-xs font-semibold text-[#6B5546]"><ShieldCheck size={16} className="text-[#00A699]" /> Usa al menos ocho caracteres.</p>
          </section>

          <button type="submit" disabled={enviando} className="group inline-flex min-h-[58px] items-center justify-center gap-2 rounded-2xl bg-[#FF5A5F] px-6 py-4 text-base font-black text-white shadow-[0_16px_38px_rgba(255,90,95,.3)] transition duration-300 hover:-translate-y-1 hover:bg-[#E0484D] hover:shadow-[0_22px_48px_rgba(255,90,95,.38)] disabled:opacity-60" style={{ backgroundColor: '#FF5A5F', color: '#FFFFFF' }}>
            <Zap size={18} /> {enviando ? 'Creando tu cuenta…' : 'Crear mi cuenta mayorista'} <ArrowRight size={17} className="transition group-hover:translate-x-1" />
          </button>

          <p className="text-center text-sm font-semibold text-[#6B5546]">
            ¿Ya tienes cuenta? <Link href="/iniciar-sesion" className="font-black text-[#FF5A5F]">Inicia sesión</Link>
          </p>
        </form>
      </div>
      {error && <p role="alert" aria-live="assertive" className="fixed bottom-4 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-start gap-3 rounded-2xl border border-[#D64545]/30 bg-[#FFF1F1] px-5 py-4 text-sm font-bold text-[#B73535] shadow-[0_18px_50px_rgba(43,27,18,.22)]"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#D64545] text-xs text-white">!</span>{error}</p>}
    </main>
  );
}
