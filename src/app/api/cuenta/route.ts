import { NextRequest, NextResponse } from 'next/server';
import { crearCliente } from '@/lib/supabase/server';
import { esObjeto, textoValido } from '@/lib/validacion';

async function contexto() {
  const supabase = await crearCliente();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, cliente: null };
  const { data: cliente } = await supabase.from('clientes').select('id').eq('auth_user_id', user.id).maybeSingle();
  return { supabase, cliente };
}

export async function GET() {
  const { supabase, cliente } = await contexto();
  if (!cliente) return NextResponse.json({ error: 'Inicia sesión para usar tus datos guardados.' }, { status: 401 });
  const [{ data: perfil, error: errorPerfil }, { data: direcciones, error: errorDirecciones }] = await Promise.all([
    supabase.from('clientes').select('nombre_contacto,nombre_negocio,telefono,tipo_negocio').eq('id', cliente.id).single(),
    supabase.from('direcciones').select('id,etiqueta,calle_numero,colonia,municipio,estado,codigo_postal,predeterminada').eq('cliente_id', cliente.id).order('predeterminada', { ascending: false }),
  ]);
  if (errorPerfil || errorDirecciones) return NextResponse.json({ error: 'No pudimos cargar tus datos.' }, { status: 503 });
  return NextResponse.json({ perfil, direcciones }, { headers: { 'Cache-Control': 'private, no-store' } });
}

export async function PATCH(solicitud: NextRequest) {
  if (solicitud.headers.get('origin') !== solicitud.nextUrl.origin) return NextResponse.json({ error: 'Origen no permitido' }, { status: 403 });
  const cuerpo: unknown = await solicitud.json().catch(() => null);
  if (!esObjeto(cuerpo) || !textoValido(cuerpo.nombre_contacto, 120, 2) || !textoValido(cuerpo.nombre_negocio, 160) || !textoValido(cuerpo.telefono, 30, 8) || !['tiendita', 'cafe', 'emprendedor'].includes(String(cuerpo.tipo_negocio))) {
    return NextResponse.json({ error: 'Revisa los datos del negocio' }, { status: 400 });
  }
  const { supabase, cliente } = await contexto();
  if (!cliente) return NextResponse.json({ error: 'Sesión no válida' }, { status: 401 });
  const { error } = await supabase.from('clientes').update({ nombre_contacto: cuerpo.nombre_contacto.trim(), nombre_negocio: cuerpo.nombre_negocio.trim(), telefono: cuerpo.telefono.trim(), tipo_negocio: cuerpo.tipo_negocio }).eq('id', cliente.id);
  return error ? NextResponse.json({ error: 'No se pudieron guardar los datos' }, { status: 500 }) : NextResponse.json({ ok: true });
}

export async function POST(solicitud: NextRequest) {
  if (solicitud.headers.get('origin') !== solicitud.nextUrl.origin) return NextResponse.json({ error: 'Origen no permitido' }, { status: 403 });
  const cuerpo: unknown = await solicitud.json().catch(() => null);
  if (!esObjeto(cuerpo) || !textoValido(cuerpo.etiqueta, 60) || !textoValido(cuerpo.calle_numero, 300) || !textoValido(cuerpo.codigo_postal, 10, 5) ||
    (['colonia', 'municipio', 'estado'] as const).some((campo) => cuerpo[campo] !== undefined && !textoValido(cuerpo[campo], 160, 0))) {
    return NextResponse.json({ error: 'Revisa la dirección' }, { status: 400 });
  }
  const { supabase, cliente } = await contexto();
  if (!cliente) return NextResponse.json({ error: 'Sesión no válida' }, { status: 401 });
  const { error } = await supabase.from('direcciones').insert({ cliente_id: cliente.id, etiqueta: cuerpo.etiqueta.trim(), calle_numero: cuerpo.calle_numero.trim(), colonia: String(cuerpo.colonia ?? '').trim() || null, municipio: String(cuerpo.municipio ?? '').trim() || null, estado: String(cuerpo.estado ?? '').trim() || null, codigo_postal: cuerpo.codigo_postal.trim(), predeterminada: false });
  return error ? NextResponse.json({ error: 'No se pudo guardar la dirección' }, { status: 500 }) : NextResponse.json({ ok: true });
}
