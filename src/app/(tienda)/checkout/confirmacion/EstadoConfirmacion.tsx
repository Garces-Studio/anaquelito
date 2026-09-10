'use client';

import { useEffect, useRef } from 'react';
import { usarCarrito } from '@/componentes/carrito/ContextoCarrito';
import { registrarEvento } from '@/lib/analitica';

export default function EstadoConfirmacion({ aprobado, pedidoId, total }: { aprobado: boolean; pedidoId: string; total: number }) {
  const { vaciar } = usarCarrito();
  const registrado = useRef(false);
  useEffect(() => {
    if (!aprobado || registrado.current) return;
    registrado.current = true;
    vaciar();
    registrarEvento('purchase', { transaction_id: pedidoId, currency: 'MXN', value: total });
  }, [aprobado, pedidoId, total, vaciar]);
  return null;
}
