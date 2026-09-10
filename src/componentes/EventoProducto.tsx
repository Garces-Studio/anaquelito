'use client';

import { useEffect } from 'react';
import { registrarEvento } from '@/lib/analitica';

export default function EventoProducto({ id, nombre, precio }: { id: string; nombre: string; precio: number | null }) {
  useEffect(() => {
    registrarEvento('view_item', {
      currency: 'MXN', value: precio ?? undefined,
      items: [{ item_id: id, item_name: nombre, price: precio ?? undefined }],
    });
  }, [id, nombre, precio]);
  return null;
}
