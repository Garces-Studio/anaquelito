import { NextRequest, NextResponse } from 'next/server';
import { Preference } from 'mercadopago';
import { crearClienteAdmin } from '@/lib/supabase/admin';
import { crearClienteMercadoPago } from '@/lib/mercadopago/cliente';

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
  let cuerpo: CuerpoCheckout;
  try {
    cuerpo = await solicitud.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo de la solicitud inválido' }, { status: 400 });
  }

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
    .select('id, nombre, unidad, precio_mayoreo, activo')
    .in('id', [...cantidadPorId.keys()]);

  if (errorProductos) {
    return NextResponse.json({ error: `No se pudieron verificar los productos: ${errorProductos.message}` }, { status: 500 });
  }

  const disponibles = (productosDb ?? []).filter((p) => p.activo);
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

  // 1. Cliente de invitado (sin cuenta todavía; auth_user_id queda vacío)
  const { data: cliente, error: errorCliente } = await supabaseAdmin
    .from('clientes')
    .insert({
      nombre_negocio: negocio.nombre_negocio,
      telefono: negocio.telefono,
      direccion: negocio.direccion,
      tipo_negocio: negocio.tipo_negocio ?? 'tiendita',
    })
    .select('id')
    .single();

  if (errorCliente) {
    return NextResponse.json({ error: `No se pudo registrar el negocio: ${errorCliente.message}` }, { status: 500 });
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
    .select('id')
    .single();

  if (errorPedido) {
    return NextResponse.json({ error: `No se pudo crear el pedido: ${errorPedido.message}` }, { status: 500 });
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
    return NextResponse.json({ error: `No se pudieron guardar los artículos: ${errorItems.message}` }, { status: 500 });
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
          success: `${urlBase}/checkout/confirmacion?pedido=${pedido.id}`,
          failure: `${urlBase}/checkout?error=pago`,
          pending: `${urlBase}/checkout/confirmacion?pedido=${pedido.id}`,
        },
        auto_return: 'approved',
      },
    });

    // Con credenciales de prueba (TEST-...) hay que usar sandbox_init_point
    const esCredencialDePrueba = process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith('TEST-');
    const urlPago = esCredencialDePrueba ? preferencia.sandbox_init_point : preferencia.init_point;

    return NextResponse.json({ urlPago, pedidoId: pedido.id });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: `No se pudo generar el cobro con Mercado Pago: ${mensaje}` },
      { status: 500 }
    );
  }
}
