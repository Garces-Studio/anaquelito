import { createClient } from '@supabase/supabase-js';

/**
 * Cliente con la llave "service_role": puede saltarse la seguridad a nivel
 * de fila (RLS). Solo se usa en código de servidor (API routes), NUNCA
 * en un componente de cliente ni se expone al navegador.
 *
 * Se necesita para el checkout de invitado: un cliente sin cuenta todavía
 * puede generar un pedido, y el registro de "clientes"/"pedidos" se crea
 * desde el servidor a nombre suyo.
 */
export function crearClienteAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
