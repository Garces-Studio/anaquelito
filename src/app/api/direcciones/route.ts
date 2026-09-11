import { NextRequest, NextResponse } from 'next/server';
import { crearCliente } from '@/lib/supabase/server';
import { esObjeto, textoValido } from '@/lib/validacion';

async function modificar(solicitud: NextRequest, borrar: boolean) {
  if (solicitud.headers.get('origin') !== solicitud.nextUrl.origin) return NextResponse.json({ error: 'Origen no permitido' }, { status: 403 });
  const cuerpo: unknown = await solicitud.json().catch(() => null);
  if (!esObjeto(cuerpo) || typeof cuerpo.id !== 'string' || !/^[0-9a-f-]{36}$/i.test(cuerpo.id)) return NextResponse.json({ error: 'Selecciona una dirección válida.' }, { status: 400 });
  const supabase = await crearCliente();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Inicia sesión para guardar tu dirección.' }, { status: 401 });
  const { data: cliente } = await supabase.from('clientes').select('id').eq('auth_user_id', user.id).maybeSingle();
  if (!cliente) return NextResponse.json({ error: 'No encontramos tu cuenta.' }, { status: 403 });
  if (!borrar && cuerpo.principal !== true && (!textoValido(cuerpo.etiqueta, 60) || !textoValido(cuerpo.calle_numero, 300) || typeof cuerpo.codigo_postal !== 'string' || !/^\d{5}$/.test(cuerpo.codigo_postal) || ['colonia', 'municipio', 'estado'].some(k => !textoValido(cuerpo[k] ?? '', 160, 0)))) return NextResponse.json({ error: 'Completa etiqueta, calle y código postal de cinco dígitos.' }, { status: 400 });
  const { error } = await supabase.rpc('gestionar_direccion', {
    p_id: cuerpo.id, p_accion: borrar ? 'eliminar' : cuerpo.principal === true ? 'principal' : 'editar',
    p_datos: borrar || cuerpo.principal === true ? {} : cuerpo,
  });
  if (error) return NextResponse.json({ error: 'No se pudo actualizar esa dirección. Revisa que todavía exista en tu cuenta.' }, { status: 409 });
  return NextResponse.json({ ok: true });
}

export const PATCH = (solicitud: NextRequest) => modificar(solicitud, false);
export const DELETE = (solicitud: NextRequest) => modificar(solicitud, true);
