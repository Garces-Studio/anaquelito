import { NextRequest, NextResponse } from 'next/server';
import { Preference } from 'mercadopago';
import { crearClienteAdmin } from '@/lib/supabase/admin';
import { crearCliente as crearClienteServidor } from '@/lib/supabase/server';
import { crearClienteMercadoPago } from '@/lib/mercadopago/cliente';
import { validarCheckout } from '@/lib/validacion';

type ArticuloRecibido = {
  id: string;
  cantidad: number;
  // El navegador puede mandar nombre/precio, pero NO se confía en ellos:
  // los datos reales siempre se leen de la base de datos (ver abajo).
  nombre?: string;
  unidad?: string;
  precio_mayoreo?: number;
};

type CuerpoCheckout = {
  articulos: ArticuloRecibido[];
  negocio: {
    nombre_negocio: string;
    telefono: string;
    direccion: string;
    tipo_negocio: 'tiendita' | 'cafe' | 'emprendedor';
  };
};

/**
 * Crea un pedido (checkout de invitado, sin requerir cuenta todavía) y
 * una preferencia de pago de Mercado Pago para cobrarlo.
 *
 * Usa la llave service_role de Supabase porque el cliente todavía no
 * tiene sesión — el registro se crea desde el servidor a su nombre.
 */
export async function POST(solicitud: NextRequest) {
  // Mientras no estén listos webhook, envío y cierre transaccional, no crear
  // clientes/pedidos huérfanos ni intentar cobrar con credenciales ausentes.
  if (process.env.CHECKOUT_HABILITADO !== 'true' || !process.env.MERCADOPAGO_ACCESS_TOKEN?.trim() || !process.env.MERCADOPAGO_WEBHOOK_SECRET?.trim()) {
    return NextResponse.json({ error: 'El pago web aún no está habilitado. Conservamos tu carrito para continuar después o cotizar por WhatsApp.' }, { status: 503 });
  }
  if (solicitud.headers.get('origin') !== solicitud.nextUrl.origin) {
    return NextResponse.json({ error: 'Origen no permitido' }, { status: 403 });
  }
  let cuerpo: CuerpoCheckout;
  try {
    cuerpo = await solicitud.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo de la solicitud inválido' }, { status: 400 });
  }

  const errorValidacion = validarCheckout(cuerpo);
  if (errorValidacion) return NextResponse.json({ error: errorValidacion }, { status: 400 });

  const { articulos, negocio } = cuerpo;

  if (!articulos?.length) {
    return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
  }
  if (!negocio?.nombre_negocio || !negocio?.telefono || !negocio?.direccion) {
    return NextResponse.json(
      { error: 'Faltan datos del negocio (nombre, teléfono o dirección)' },
      { status: 400 }
    );
  }

  const supabaseAdmin = crearClienteAdmin();

  // 0. SEGURIDAD: los precios NUNCA vienen del navegador. Se buscan los
  //    productos en la base de datos y se cobra con el precio real; si algún
  //    id no existe o está inactivo, se rechaza el pedido completo.
  const cantidadPorId = new Map<string, number>();
  for (const articulo of articulos) {
    const cantidad = Math.floor(Number(articulo.cantidad));
    if (!articulo.id || !Number.isFinite(cantidad) || cantidad <= 0 || cantidad > 10000) {
      return NextResponse.json({ error: 'Artículo con cantidad inválida' }, { status: 400 });
    }
    cantidadPorId.set(articulo.id, (cantidadPorId.get(articulo.id) ?? 0) + cantidad);
  }

  const { data: productosDb, error: errorProductos } = await supabaseAdmin
    .from('productos')
    .select('id, nombre, unidad, precio_mayoreo, activo, disponibilidad, stock, cantidad_minima')
    .in('id', [...cantidadPorId.keys()]);

  if (errorProductos) {
    return NextResponse.json({ error: 'No se pudieron verificar los productos' }, { status: 503 });
  }

  const estadosVendibles = new Set(['in_stock', 'available_from_supplier', 'low_stock']);
  const disponibles = (productosDb ?? []).filter((p) => p.activo && estadosVendibles.has(p.disponibilidad) && Number(p.precio_mayoreo) > 0 && p.unidad);
  if (disponibles.length !== cantidadPorId.size) {
    return NextResponse.json(
      { error: 'Uno o más productos del carrito ya no están disponibles. Actualiza tu carrito.' },
      { status: 409 }
    );
  }

  const lineas = disponibles.map((producto) => ({
    id: producto.id,
    nombre: producto.nombre,
    cantidad: cantidadPorId.get(producto.id)!,
    precio_unitario: Number(producto.precio_mayoreo),
  }));

  for (const producto of disponibles) {
    const cantidad = cantidadPorId.get(producto.id)!;
    if (producto.cantidad_minima && cantidad < producto.cantidad_minima) {
      return NextResponse.json({ error: `${producto.nombre} requiere un mínimo de ${producto.cantidad_minima} cajas.` }, { status: 409 });
    }
    if ((producto.disponibilidad === 'in_stock' || producto.disponibilidad === 'low_stock') && producto.stock !== null && cantidad > producto.stock) {
      return NextResponse.json({ error: `Solo hay ${producto.stock} cajas disponibles de ${producto.nombre}.` }, { status: 409 });
    }
  }

  // 1. Asociar el pedido con la cuenta actual para que aparezca en su historial.
  // El checkout de invitado sigue disponible y crea un perfil sin auth_user_id.
  const supabaseSesion = await crearClienteServidor();
  const { data: { user } } = await supabaseSesion.auth.getUser();
  let consultaCliente = supabaseAdmin.from('clientes').select('id');
  if (user) consultaCliente = consultaCliente.eq('auth_user_id', user.id);
  const existente = user ? await consultaCliente.maybeSingle() : { data: null, error: null };
  let cliente = existente.data;
  let errorCliente = existente.error;
  if (!cliente && !errorCliente) {
    const creado = await supabaseAdmin.from('clientes').insert({
      auth_user_id: user?.id ?? null,
      nombre_negocio: negocio.nombre_negocio,
      telefono: negocio.telefono,
      direccion: negocio.direccion,
      tipo_negocio: negocio.tipo_negocio ?? 'tiendita',
    }).select('id').single();
    cliente = creado.data;
    errorCliente = creado.error;
  } else if (cliente && user) {
    await supabaseAdmin.from('clientes').update({ nombre_negocio: negocio.nombre_negocio, telefono: negocio.telefono, direccion: negocio.direccion, tipo_negocio: negocio.tipo_negocio }).eq('id', cliente.id);
  }

  if (errorCliente || !cliente) {
    return NextResponse.json({ error: 'No se pudo registrar el negocio' }, { status: 500 });
  }

  const total = lineas.reduce((suma, linea) => suma + linea.cantidad * linea.precio_unitario, 0);

  // 2. Pedido
  const { data: pedido, error: errorPedido } = await supabaseAdmin
    .from('pedidos')
    .insert({
      cliente_id: cliente.id,
      estado: 'pendiente',
      metodo_pago: 'mercadopago',
      total,
    })
    .select('id, token_confirmacion')
    .single();

  if (errorPedido) {
    return NextResponse.json({ error: 'No se pudo crear el pedido' }, { status: 500 });
  }

  // 3. Artículos del pedido (con los precios verificados de la base de datos)
  const { error: errorItems } = await supabaseAdmin.from('pedido_items').insert(
    lineas.map((linea) => ({
      pedido_id: pedido.id,
      producto_id: linea.id,
      cantidad: linea.cantidad,
      precio_unitario: linea.precio_unitario,
    }))
  );

  if (errorItems) {
    await supabaseAdmin.from('pedidos').update({ estado: 'cancelado' }).eq('id', pedido.id);
    return NextResponse.json({ error: 'No se pudieron guardar los artículos' }, { status: 500 });
  }

  // 4. Preferencia de pago en Mercado Pago
  const urlBase = solicitud.nextUrl.origin;
  const mercadoPago = new Preference(crearClienteMercadoPago());

  try {
    const preferencia = await mercadoPago.create({
      body: {
        items: lineas.map((linea) => ({
          id: linea.id,
          title: linea.nombre,
          quantity: linea.cantidad,
          unit_price: linea.precio_unitario,
          currency_id: 'MXN',
        })),
        external_reference: pedido.id,
        back_urls: {
          success: `${urlBase}/checkout/confirmacion?pedido=${pedido.id}&token=${pedido.token_confirmacion}`,
          failure: `${urlBase}/checkout?error=pago`,
          pending: `${urlBase}/checkout/confirmacion?pedido=${pedido.id}&token=${pedido.token_confirmacion}`,
        },
        auto_return: 'approved',
        notification_url: `${urlBase}/api/mercadopago/webhook`,
      },
    });

    // Con credenciales de prueba (TEST-...) hay que usar sandbox_init_point
    const esCredencialDePrueba = process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith('TEST-');
    const urlPago = esCredencialDePrueba ? preferencia.sandbox_init_point : preferencia.init_point;

    return NextResponse.json({ urlPago, pedidoId: pedido.id });
  } catch {
    await supabaseAdmin.from('pedidos').update({ estado: 'cancelado' }).eq('id', pedido.id);
    return NextResponse.json(
      { error: 'No se pudo generar el cobro. Contacta al negocio antes de volver a intentarlo.' },
      { status: 500 }
    );
  }
}
