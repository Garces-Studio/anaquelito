import 'server-only';
import { createHmac } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { crearClienteAdmin } from './supabase/admin';

export async function limitarSolicitud(solicitud: NextRequest, accion: string, maximo = 8) {
  // Vercel sobrescribe este encabezado en su frontera. En local se comparte una ventana.
  const ip = process.env.VERCEL ? solicitud.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ?? 'desconocida' : 'local';
  const clave = createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY!).update(`${accion}:${ip}`).digest('hex');
  const { data, error } = await crearClienteAdmin().rpc('consumir_limite', { p_clave: clave, p_maximo: maximo, p_segundos: 600 });
  if (error) return NextResponse.json({ error: 'El servicio está temporalmente ocupado. Intenta en unos minutos.' }, { status: 503 });
  if (!data) return NextResponse.json({ error: 'Has realizado varios intentos. Espera unos minutos antes de continuar.' }, { status: 429, headers: { 'Retry-After': '600' } });
  return null;
}
