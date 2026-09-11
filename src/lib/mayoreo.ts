/** Datos comerciales públicos. Nunca incluir costos de proveedor aquí. */
export type ProductoMayoreo = {
  id: string; slug: string; nombre: string; categoria: string;
  descripcion: string | null; unidad: string | null; sku: string | null;
  marca: string | null; tipo_empaque: string | null; destacado: boolean;
  imagenes: string[];
  piezas_por_caja: number | null; bolsas_por_caja: number | null;
  peso_por_bolsa_g: number | null; peso_total_g: number | null; precio_mayoreo: number | null;
  imagen_url: string | null; stock: number | null;
  cantidad_minima: number | null;
  disponibilidad: 'unconfirmed' | 'in_stock' | 'available_from_supplier' | 'low_stock' | 'out_of_stock';
};
export const SELECCION_INICIAL: ProductoMayoreo[] = [
  ['gomita-pinguino', 'Gomilocas Pingüinos', 'gomitas'],
  ['gomita-diente', 'Gomilocas Dientes', 'gomitas'],
  ['gomita-oso', 'Panditas Clásicos', 'gomitas'],
  ['gomita-lombriz', 'Gomilocas Lombrices', 'gomitas'],
  ['huevito-pinto', 'Gomilocas Huevitos', 'gomitas'],
  ['bubulubu-ice', 'Bubulubu Ice', 'chocolates'],
].map(([slug, nombre, categoria]) => ({
  id: slug, slug, nombre, categoria, descripcion: null,
  sku: null, marca: 'Ricolino', tipo_empaque: slug === 'bubulubu-ice' ? 'caja' : null, destacado: false, imagenes: [`/productos/${slug}.png`],
  unidad: slug === 'bubulubu-ice' ? 'caja' : null,
  piezas_por_caja: slug === 'bubulubu-ice' ? 300 : null,
  bolsas_por_caja: null, peso_por_bolsa_g: null, peso_total_g: null,
  precio_mayoreo: null, imagen_url: `/productos/${slug}.png`, stock: null,
  cantidad_minima: null, disponibilidad: 'unconfirmed',
}));

export function textoDisponibilidad(p: ProductoMayoreo): string {
  if (p.disponibilidad === 'out_of_stock') return 'Agotado';
  if (p.disponibilidad === 'low_stock') return 'Pocas cajas';
  if (p.disponibilidad === 'in_stock') return 'En stock';
  if (p.disponibilidad === 'unconfirmed') return 'Disponibilidad por confirmar';
  return 'Disponible para pedido';
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
export const CAJAS_POR_TARIMA = 100;

/** Convierte una cantidad guardada en cajas a una descripción comercial. */
export function desgloseCajas(cajas: number): string {
  const tarimas = Math.floor(cajas / CAJAS_POR_TARIMA);
  const sueltas = cajas % CAJAS_POR_TARIMA;
  const partes = [];
  if (tarimas) partes.push(`${tarimas} ${tarimas === 1 ? 'tarima' : 'tarimas'}`);
  if (sueltas || !tarimas) partes.push(`${sueltas} ${sueltas === 1 ? 'caja' : 'cajas'}`);
  return partes.join(' + ');
}
export function enlaceWhatsApp(mensaje: string): string | null {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMERO;
  return numero && /^\d{10,15}$/.test(numero) ? `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}` : null;
}
