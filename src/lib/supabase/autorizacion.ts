import type { User } from '@supabase/supabase-js';
import { crearCliente } from '@/lib/supabase/server';

export type SesionAdmin = {
  user: User | null;
  esAdmin: boolean;
  perteneceAAdministradores: boolean;
  nivelAutenticacion: 'aal1' | 'aal2' | null;
};

/**
 * Devuelve el usuario de la sesión actual y si es administrador.
 *
 * "Ser admin" = tener fila en `public.administradores` (ver migración 0005).
 * La consulta pasa por RLS: cada usuario solo puede ver su propia fila, así
 * que no filtra información de otros administradores.
 *
 * Uso en páginas/rutas de servidor:
 *   const { user, esAdmin } = await obtenerSesionAdmin();
 *   if (!user) redirect('/iniciar-sesion');
 *   if (!esAdmin) redirect('/dashboard');
 */
export async function obtenerSesionAdmin(): Promise<SesionAdmin> {
  const supabase = await crearCliente();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, esAdmin: false, perteneceAAdministradores: false, nivelAutenticacion: null };

  const { data } = await supabase
    .from('administradores')
    .select('auth_user_id')
    .eq('auth_user_id', user.id)
    .maybeSingle();

  const { data: nivel } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  const nivelAutenticacion = nivel?.currentLevel === 'aal2' ? 'aal2' : nivel?.currentLevel === 'aal1' ? 'aal1' : null;
  const perteneceAAdministradores = Boolean(data);

  return {
    user,
    perteneceAAdministradores,
    nivelAutenticacion,
    esAdmin: perteneceAAdministradores && nivelAutenticacion === 'aal2',
  };
}
