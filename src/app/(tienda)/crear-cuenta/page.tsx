'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { crearCliente } from '@/lib/supabase/client';

type TipoNegocio = 'tiendita' | 'cafe' | 'emprendedor';

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

      // La cuenta ya quedó creada y confirmada en el servidor; ahora
      // iniciamos sesión desde el navegador para guardar la sesión real.
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

  return (
    <main className="contenedor" style={{ padding: '3rem 1.25rem 4rem', maxWidth: '640px' }}>
      <h1 className="seccion-titulo aparecer">Crea tu cuenta</h1>
      <p className="seccion-bajada aparecer retraso-1">
        Guarda tus direcciones y consulta tus pedidos desde tu propio panel.
      </p>

      <form onSubmit={manejarEnvio} className="formulario-checkout aparecer retraso-2">
        <label>
          Nombre del negocio
          <input type="text" required value={nombreNegocio} onChange={(e) => setNombreNegocio(e.target.value)} placeholder="Ej. Miscelánea Don Beto" />
        </label>

        <label>
          Tipo de negocio
          <select value={tipoNegocio} onChange={(e) => setTipoNegocio(e.target.value as TipoNegocio)}>
            <option value="tiendita">Tiendita / minisúper</option>
            <option value="cafe">Café / fonda</option>
            <option value="emprendedor">Emprendedor / reventa</option>
          </select>
        </label>

        <label>
          Teléfono de contacto
          <input type="tel" required value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="55 1234 5678" />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <label style={{ gridColumn: '1 / -1' }}>
            Calle y número
            <input type="text" required value={calleNumero} onChange={(e) => setCalleNumero(e.target.value)} placeholder="Av. Siempre Viva 123" />
          </label>
          <label>
            Colonia
            <input type="text" value={colonia} onChange={(e) => setColonia(e.target.value)} />
          </label>
          <label>
            Municipio/Alcaldía
            <input type="text" value={municipio} onChange={(e) => setMunicipio(e.target.value)} />
          </label>
          <label>
            Estado
            <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} />
          </label>
          <label>
            Código postal
            <input type="text" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} />
          </label>
        </div>

        <label>
          Correo electrónico
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <label>
            Contraseña
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" />
          </label>
          <label>
            Confirmar contraseña
            <input type="password" required value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)} />
          </label>
        </div>

        {error && <p className="error-checkout">{error}</p>}

        <button type="submit" className="boton boton-primario" disabled={enviando} style={{ width: '100%' }}>
          {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--tinta-suave)' }}>
          ¿Ya tienes cuenta? <Link href="/iniciar-sesion" style={{ color: 'var(--coral)', fontWeight: 700 }}>Inicia sesión</Link>
        </p>
      </form>
    </main>
  );
}
