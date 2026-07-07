import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refresca la sesión de Supabase en cada solicitud. Sin esto, la sesión
 * del usuario puede expirar de forma inconsistente entre páginas.
 */
export async function actualizarSesion(request: NextRequest) {
  let respuesta = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesAEstablecer) {
          cookiesAEstablecer.forEach(({ name, value }) => request.cookies.set(name, value));
          respuesta = NextResponse.next({ request });
          cookiesAEstablecer.forEach(({ name, value, options }) =>
            respuesta.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Necesario: refresca el token si expiró, antes de que la página lo use.
  await supabase.auth.getUser();

  return respuesta;
}
