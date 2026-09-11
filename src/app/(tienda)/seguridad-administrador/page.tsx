import { redirect } from 'next/navigation';
import { obtenerSesionAdmin } from '@/lib/supabase/autorizacion';
import SeguridadAdministrador from '@/componentes/SeguridadAdministrador';

export default async function PaginaSeguridadAdministrador() {
  const { user, esAdmin, perteneceAAdministradores } = await obtenerSesionAdmin();
  if (!user) redirect('/iniciar-sesion');
  if (!perteneceAAdministradores) redirect('/dashboard');
  if (esAdmin) redirect('/admin');

  return <SeguridadAdministrador correo={user.email ?? ''} />;
}
