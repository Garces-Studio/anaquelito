import { NextRequest, NextResponse } from 'next/server';
import { crearCliente } from '@/lib/supabase/server';
import { limitarSolicitud } from '@/lib/limites';
import { esObjeto, textoValido } from '@/lib/validacion';

export async function POST(solicitud: NextRequest) {
  if (solicitud.headers.get('origin') !== solicitud.nextUrl.origin) return NextResponse.json({ error: 'Origen no permitido' }, { status: 403 });
  const cuerpo: unknown = await solicitud.json().catch(() => null);
  if (!esObjeto(cuerpo) || !textoValido(cuerpo.email,254) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cuerpo.email)) return NextResponse.json({ error: 'Escribe un correo válido.' }, { status: 400 });
  try {
    const limite = await limitarSolicitud(solicitud, 'recuperacion', 5);
    if (limite) return limite;
    const { error } = await (await crearCliente()).auth.resetPasswordForEmail(cuerpo.email.trim(), { redirectTo: `${solicitud.nextUrl.origin}/auth/recuperar` });
    if (error && error.status && error.status >= 500) return NextResponse.json({ error: 'El correo no pudo enviarse. Intenta más tarde.' }, { status: 503 });
    return NextResponse.json({ ok: true, mensaje: 'Si el correo está registrado, recibirás un enlace para cambiar tu contraseña. Revisa también correo no deseado.' });
  } catch { return NextResponse.json({ error: 'No pudimos conectar. Intenta nuevamente.' }, { status: 503 }); }
}
