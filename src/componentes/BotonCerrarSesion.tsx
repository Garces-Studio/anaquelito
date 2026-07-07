'use client';

import { useRouter } from 'next/navigation';
import { crearCliente } from '@/lib/supabase/client';

export default function BotonCerrarSesion() {
  const router = useRouter();

  const cerrarSesion = async () => {
    const supabase = crearCliente();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <button onClick={cerrarSesion} className="boton boton-secundario">
      Cerrar sesión
    </button>
  );
}
