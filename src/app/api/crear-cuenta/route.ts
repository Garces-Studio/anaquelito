import { NextRequest, NextResponse } from 'next/server';
import { crearClienteAdmin } from '@/lib/supabase/admin';
import { esObjeto, textoValido } from '@/lib/validacion';
import { limitarSolicitud } from '@/lib/limites';

type CuerpoCrearCuenta = {
  email: string;
  password: string;
  nombre_contacto: string;
  nombre_negocio: string;
  tipo_negocio: 'tiendita' | 'cafe' | 'emprendedor';
  telefono?: string;
  calle_numero?: string;
  colonia?: string;
  municipio?: string;
  estado?: string;
  codigo_postal?: string;
  pedido?: string | null;
  token_pedido?: string | null;
};

/**
 * Crea la cuenta de un negocio: usuario de autenticación (confirmado de
 * inmediato mientras se configura la entrega de correo) + su registro en
 * `clientes`. Teléfono y dirección se pueden completar después en el panel.
 */
export async function POST(solicitud: NextRequest) {
  if (solicitud.headers.get('origin') !== solicitud.nextUrl.origin) {
    return NextResponse.json({ error: 'Origen no permitido' }, { status: 403 });
  }
  let cuerpo: CuerpoCrearCuenta;
  try {
    cuerpo = await solicitud.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo de la solicitud inválido' }, { status: 400 });
  }

  if (!esObjeto(cuerpo) || !textoValido(cuerpo.email, 254) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cuerpo.email) ||
      !textoValido(cuerpo.password, 128, 8) || !textoValido(cuerpo.nombre_contacto, 120, 2) ||
      !textoValido(cuerpo.nombre_negocio, 160) ||
      (cuerpo.telefono != null && cuerpo.telefono !== '' && !textoValido(cuerpo.telefono, 30, 8)) ||
      (cuerpo.calle_numero != null && cuerpo.calle_numero !== '' && !textoValido(cuerpo.calle_numero, 300)) ||
      !['tiendita', 'cafe', 'emprendedor'].includes(cuerpo.tipo_negocio) ||
      (['colonia', 'municipio', 'estado', 'codigo_postal'] as const).some((clave) => cuerpo[clave] != null && !textoValido(cuerpo[clave], 160, 0))) {
    return NextResponse.json({ error: 'Revisa los datos del formulario' }, { status: 400 });
  }
  const {
    email, password, nombre_contacto, nombre_negocio, tipo_negocio, telefono,
    calle_numero, colonia, municipio, estado, codigo_postal,
  } = cuerpo;

  if (!email || !password || !nombre_contacto || !nombre_negocio) {
    return NextResponse.json({ error: 'Faltan datos obligatorios del formulario' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 });
  }

  try {
    const supabaseAdmin = crearClienteAdmin();
    const limite = await limitarSolicitud(solicitud, 'registro');
    if (limite) return limite;

    // 1. Cuenta de autenticación, confirmada de inmediato
    const { data: usuarioCreado, error: errorUsuario } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nombre_contacto: nombre_contacto.trim() },
    });

    if (errorUsuario) {
      const yaExiste = errorUsuario.message.toLowerCase().includes('already been registered') ||
        errorUsuario.message.toLowerCase().includes('already registered');
      return NextResponse.json(
        { error: yaExiste ? 'No se pudo crear la cuenta. Si ya te registraste, intenta iniciar sesión.' : 'No se pudo crear la cuenta. Revisa tus datos.' },
        { status: 400 }
      );
    }

    const direccionResumen = [calle_numero, colonia, municipio, estado, codigo_postal]
      .filter(Boolean)
      .join(', ');

    // 2. Registro del negocio en la tabla clientes
    const formatoUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    let clientePedido: { cliente_id: string } | null = null;
    if (cuerpo.pedido && cuerpo.token_pedido && formatoUuid.test(cuerpo.pedido) && formatoUuid.test(cuerpo.token_pedido)) {
      const { data } = await supabaseAdmin.from('pedidos').select('cliente_id, clientes!inner(auth_user_id)').eq('id', cuerpo.pedido).eq('token_confirmacion', cuerpo.token_pedido).eq('pago_estado', 'aprobado').is('clientes.auth_user_id', null).maybeSingle();
      clientePedido = data ? { cliente_id: data.cliente_id } : null;
    }

    const datosCliente = {
      auth_user_id: usuarioCreado.user.id,
      nombre_contacto: nombre_contacto.trim(),
      nombre_negocio,
      tipo_negocio,
      telefono: telefono?.trim() || null,
      direccion: direccionResumen || null,
    };
    const resultadoCliente = clientePedido
      ? await supabaseAdmin.from('clientes').update(datosCliente).eq('id', clientePedido.cliente_id).is('auth_user_id', null).select('id').single()
      : await supabaseAdmin.from('clientes').insert(datosCliente).select('id').single();
    const { data: cliente, error: errorCliente } = resultadoCliente;

    if (errorCliente) {
      // Si esto falla, no dejamos un usuario de auth huérfano sin registro de negocio
      await supabaseAdmin.auth.admin.deleteUser(usuarioCreado.user.id);
      return NextResponse.json(
        { error: 'No se pudo registrar el negocio. Intenta nuevamente más tarde.' },
        { status: 500 }
      );
    }

    // 3. La dirección sólo se crea si el cliente decidió completarla ahora.
    if (calle_numero?.trim()) {
      await supabaseAdmin.from('direcciones').insert({
        cliente_id: cliente.id,
        etiqueta: 'Principal',
        calle_numero: calle_numero.trim(),
        colonia: colonia || null,
        municipio: municipio || null,
        estado: estado || null,
        codigo_postal: codigo_postal || null,
        predeterminada: true,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'No pudimos conectar con el servicio de registro. Intenta nuevamente en un momento.' },
      { status: 500 }
    );
  }
}
