import { NextResponse, type NextRequest } from 'next/server';
import { actualizarSesion } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/') && !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    if (request.headers.get('origin') !== request.nextUrl.origin) {
      return NextResponse.json({ error: 'Origen no permitido' }, { status: 403 });
    }
    const limite = request.nextUrl.pathname.endsWith('/imagen') ? 5 * 1024 * 1024 : 64 * 1024;
    if (Number(request.headers.get('content-length') ?? 0) > limite) {
      return NextResponse.json({ error: 'Solicitud demasiado grande' }, { status: 413 });
    }
  }
  // Visitantes sin cookies de sesión no necesitan una llamada de autenticación.
  // Las páginas y APIs privadas siguen comprobando usuario y RLS.
  if (!request.cookies.getAll().some(({ name }) => name.startsWith('sb-'))) return NextResponse.next();
  return actualizarSesion(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)',
  ],
};
