import { NextRequest, NextResponse } from 'next/server';
import { crearCliente } from '@/lib/supabase/server';
import { obtenerSesionAdmin } from '@/lib/supabase/autorizacion';

const ESTADOS_VALIDOS = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'] as const;

/**
 * GET  /api/admin/pedidos  → todos los pedidos con cliente e items.
 * PATCH /api/admin/pedidos → { id, estado } cambia el estado de un pedido.
 *
 * Ambas verifican que la sesión sea de administrador. Además las consultas
 * usan el cliente normal (no service_role), así que las políticas RLS de la
 * migración 0005 son una segunda barrera: sin fila en `administradores`,
 * la base de datos no devuelve nada.
 */
export async function GET() {
  const { user, esAdmin } = await obtenerSesionAdmin();
  if (!user || !esAdmin) {
    return NextResponse.json({ error: 'Solo administradores' }, { status: 403 });
  }

  const supabase = await crearCliente();
  const { data: pedidos, error } = await supabase
    .from('pedidos')
    .select(`
      id, estado, total, metodo_pago, creado_en,
      clientes ( nombre_negocio, telefono, direccion ),
      pedido_items ( cantidad, precio_unitario, productos ( nombre, unidad ) )
    `)
    .order('creado_en', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ pedidos });
}

export async function PATCH(solicitud: NextRequest) {
  const { user, esAdmin } = await obtenerSesionAdmin();
  if (!user || !esAdmin) {
    return NextResponse.json({ error: 'Solo administradores' }, { status: 403 });
  }

  let cuerpo: { id?: string; estado?: string };
  try {
    cuerpo = await solicitud.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo de la solicitud inválido' }, { status: 400 });
  }

  const { id, estado } = cuerpo;
  if (!id || !estado || !ESTADOS_VALIDOS.includes(estado as (typeof ESTADOS_VALIDOS)[number])) {
    return NextResponse.json(
      { error: `Se requiere id y un estado válido (${ESTADOS_VALIDOS.join(', ')})` },
      { status: 400 }
    );
  }

  const supabase = await crearCliente();
  const { error } = await supabase.from('pedidos').update({ estado }).eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
