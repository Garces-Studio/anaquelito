'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    <main className="contenedor" style={{ padding: '4rem 1.25rem', maxWidth: '440px' }}>
      <h1 className="seccion-titulo aparecer">Inicia sesión</h1>
      <p className="seccion-bajada aparecer retraso-1">
        Consulta tus pedidos, direcciones y cupones.
      </p>

      <form onSubmit={manejarEnvio} className="formulario-checkout aparecer retraso-2">
        <label>
          Correo electrónico
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" />
        </label>
        <label>
          Contraseña
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        {error && <p className="error-checkout">{error}</p>}

        <button type="submit" className="boton boton-primario" disabled={enviando} style={{ width: '100%' }}>
          {enviando ? 'Entrando…' : 'Iniciar sesión'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--tinta-suave)' }}>
          ¿No tienes cuenta? <Link href="/crear-cuenta" style={{ color: 'var(--coral)', fontWeight: 700 }}>Créala aquí</Link>
        </p>
      </form>
    </main>
  );
}
