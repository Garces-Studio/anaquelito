/** Datos comerciales públicos. Nunca incluir costos de proveedor aquí. */
export type ProductoMayoreo = {
  id: string; slug: string; nombre: string; categoria: string;
  descripcion: string | null; unidad: string | null;
  piezas_por_caja: number | null; bolsas_por_caja: number | null;
  peso_por_bolsa_g: number | null; precio_mayoreo: number | null;
  imagen_url: string | null; stock: number | null;
  cantidad_minima: number | null;
  disponibilidad: 'por_confirmar' | 'disponible' | 'agotado';
};
export const SELECCION_INICIAL: ProductoMayoreo[] = [
  ['gomita-pinguino', 'Gomita Pingüino', 'gomitas'],
  ['gomita-diente', 'Gomita Diente', 'gomitas'],
  ['gomita-oso', 'Gomita Oso', 'gomitas'],
  ['gomita-lombriz', 'Gomita Lombriz', 'gomitas'],
  ['huevito-pinto', 'Huevito Pinto', 'chocolates'],
  ['bubulubu-ice', 'Bubulubu Ice', 'chocolates'],
].map(([slug, nombre, categoria]) => ({
  id: slug, slug, nombre, categoria, descripcion: null,
  unidad: slug === 'bubulubu-ice' ? 'caja' : null,
  piezas_por_caja: slug === 'bubulubu-ice' ? 300 : null,
  bolsas_por_caja: null, peso_por_bolsa_g: null,
  precio_mayoreo: null, imagen_url: null, stock: null,
  cantidad_minima: null, disponibilidad: 'por_confirmar',
}));

export function textoDisponibilidad(p: ProductoMayoreo): string {
  if (p.disponibilidad === 'agotado') return 'Agotado';
  if (p.disponibilidad === 'disponible') {
    return p.stock === null ? 'Disponible' : `${p.stock} ${p.stock === 1 ? 'caja disponible' : 'cajas disponibles'}`;
  }
  return 'Disponibilidad por confirmar';
}
export function presentacion(p: ProductoMayoreo): string {
  if (p.piezas_por_caja) return `Caja con ${p.piezas_por_caja} piezas`;
  if (p.bolsas_por_caja && p.peso_por_bolsa_g) return `Caja con ${p.bolsas_por_caja} bolsas de ${p.peso_por_bolsa_g / 1000} kg`;
  return p.unidad ? `Venta por ${p.unidad}` : 'Presentación por confirmar';
}
export function precioPorContenido(p: ProductoMayoreo): string | null {
  const unidades = p.piezas_por_caja || p.bolsas_por_caja;
  if (!p.precio_mayoreo || !unidades) return null;
  return `${pesos(p.precio_mayoreo / unidades)} por ${p.piezas_por_caja ? 'pieza' : 'bolsa'} para tu negocio`;
}
export const pesos = (valor: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor);
export function enlaceWhatsApp(mensaje: string): string | null {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMERO;
  return numero && /^\d{10,15}$/.test(numero) ? `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}` : null;
}
