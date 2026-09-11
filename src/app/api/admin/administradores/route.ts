import { NextRequest, NextResponse } from 'next/server';
import { obtenerSesionAdmin } from '@/lib/supabase/autorizacion';
import { crearClienteAdmin } from '@/lib/supabase/admin';
import { esObjeto, textoValido } from '@/lib/validacion';

/** Un administrador existente puede promover una cuenta ya registrada.
 * La service role permanece exclusivamente en el servidor. */
export async function POST(solicitud: NextRequest) {
  if (solicitud.headers.get('origin') !== solicitud.nextUrl.origin) {
    return NextResponse.json({ error: 'Origen no permitido' }, { status: 403 });
  }
  const { user, esAdmin } = await obtenerSesionAdmin();
  if (!user || !esAdmin) return NextResponse.json({ error: 'Solo administradores' }, { status: 403 });

  const cuerpo: unknown = await solicitud.json().catch(() => null);
  if (!esObjeto(cuerpo) || !textoValido(cuerpo.correo, 254, 5) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cuerpo.correo)) {
    return NextResponse.json({ error: 'Escribe un correo válido' }, { status: 400 });
  }
  const correo = cuerpo.correo.trim().toLowerCase();

  const admin = crearClienteAdmin();
  const { data, error: errorUsuarios } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (errorUsuarios) return NextResponse.json({ error: 'No se pudieron consultar las cuentas' }, { status: 500 });
  const cuenta = data.users.find((u) => u.email?.toLowerCase() === correo);
  if (!cuenta) return NextResponse.json({ error: 'Ese correo todavía no tiene una cuenta en Anaquelito' }, { status: 404 });

  const { error } = await admin.from('administradores').upsert({ auth_user_id: cuenta.id, nota: 'Administrador asignado desde el panel' });
  return error
    ? NextResponse.json({ error: 'No se pudo asignar el permiso' }, { status: 500 })
    : NextResponse.json({ ok: true });
}
