import { NextRequest, NextResponse } from 'next/server';
import { crearClienteAdmin } from '@/lib/supabase/admin';
import { obtenerSesionAdmin } from '@/lib/supabase/autorizacion';

const TIPOS_PERMITIDOS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};
const TAMANO_MAXIMO = 4 * 1024 * 1024; // 4 MB

/**
 * POST /api/admin/productos/imagen — sube una imagen de producto al bucket
 * público `productos` y devuelve su URL. Multipart con el campo `archivo`.
 *
 * Se usa el service_role SOLO después de confirmar que la sesión es de un
 * administrador; el bucket no tiene políticas de escritura públicas.
 */
export async function POST(solicitud: NextRequest) {
  const { user, esAdmin } = await obtenerSesionAdmin();
  if (!user || !esAdmin) {
    return NextResponse.json({ error: 'Solo administradores' }, { status: 403 });
  }

  let formulario: FormData;
  try {
    formulario = await solicitud.formData();
  } catch {
    return NextResponse.json({ error: 'Se esperaba un formulario multipart' }, { status: 400 });
  }

  const archivo = formulario.get('archivo');
  if (!(archivo instanceof File)) {
    return NextResponse.json({ error: 'Falta el archivo (campo "archivo")' }, { status: 400 });
  }

  const extension = TIPOS_PERMITIDOS[archivo.type];
  if (!extension) {
    return NextResponse.json(
      { error: 'Formato no permitido. Usa PNG, JPG o WebP.' },
      { status: 400 }
    );
  }
  if (archivo.size > TAMANO_MAXIMO) {
    return NextResponse.json({ error: 'La imagen no debe pasar de 4 MB' }, { status: 400 });
  }

  const supabaseAdmin = crearClienteAdmin();
  const ruta = `catalogo/${crypto.randomUUID()}.${extension}`;

  const { error: errorSubida } = await supabaseAdmin.storage
    .from('productos')
    .upload(ruta, archivo, { contentType: archivo.type, upsert: false });

  if (errorSubida) {
    return NextResponse.json(
      { error: `No se pudo subir la imagen: ${errorSubida.message}` },
      { status: 500 }
    );
  }

  const { data } = supabaseAdmin.storage.from('productos').getPublicUrl(ruta);
  return NextResponse.json({ ok: true, url: data.publicUrl });
}
