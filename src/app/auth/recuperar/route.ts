import { NextRequest, NextResponse } from 'next/server';
import { crearCliente } from '@/lib/supabase/server';
export async function GET(solicitud: NextRequest) {
  const code = solicitud.nextUrl.searchParams.get('code');
  if (code) {
    const { error } = await (await crearCliente()).auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL('/restablecer-contrasena', solicitud.url));
  }
  return NextResponse.redirect(new URL('/recuperar-contrasena?error=enlace', solicitud.url));
}
