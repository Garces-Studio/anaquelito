import 'server-only';
import { cache } from 'react';
import { SELECCION_INICIAL, type ProductoMayoreo } from './mayoreo';
// Lista explícita. Costos internos en una tabla privada, nunca en productos.
const CAMPOS = 'id,nombre,descripcion,categoria,unidad,precio_mayoreo,imagen_url';
const CAMPOS_MAYOREO = CAMPOS + ',slug,sku,marca,tipo_empaque,imagenes,destacado,piezas_por_caja,bolsas_por_caja,peso_por_bolsa_g,peso_total_g,stock,cantidad_minima,disponibilidad';
export const obtenerCatalogo = cache(async (): Promise<{ productos: ProductoMayoreo[]; disponible: boolean }> => {
  try {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const llave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!base || !llave) throw new Error('Catálogo no configurado');
    const url = new URL('/rest/v1/productos', base);
    url.searchParams.set('select', CAMPOS_MAYOREO);
    url.searchParams.set('activo', 'eq.true');
    url.searchParams.set('order', 'nombre.asc');
    const leer = () => fetch(url, { headers: { apikey: llave }, next: { revalidate: 60, tags: ['catalogo'] }, signal: AbortSignal.timeout(5000) });
    let respuesta = await leer();
    // Compatibilidad durante el despliegue: las columnas se agregan en 0006.
    if (respuesta.status === 400) {
      url.searchParams.set('select', CAMPOS);
      respuesta = await leer();
    }
    if (!respuesta.ok) throw new Error('Catálogo no disponible');
    const filas = await respuesta.json() as Array<Partial<ProductoMayoreo> & { id: string; nombre: string }>;
    return { disponible: true, productos: filas.map((fila) => {
      const borrador = SELECCION_INICIAL.find((p) => p.slug === fila.slug || p.nombre.toLocaleLowerCase('es') === fila.nombre.toLocaleLowerCase('es')) ?? {
        id: fila.id, slug: fila.slug || fila.id, nombre: fila.nombre, categoria: 'dulces',
        descripcion: null, unidad: null, sku: null, marca: null, tipo_empaque: null, destacado: false,
        imagenes: [], piezas_por_caja: null, bolsas_por_caja: null, peso_por_bolsa_g: null,
        peso_total_g: null, precio_mayoreo: null, imagen_url: null, stock: null,
        cantidad_minima: null, disponibilidad: 'unconfirmed' as const,
      };
      return {
        ...borrador,
        ...fila,
        slug: fila.slug || borrador.slug,
        imagen_url: fila.imagen_url || borrador.imagen_url,
        imagenes: Array.isArray(fila.imagenes) && fila.imagenes.length ? fila.imagenes.filter((imagen): imagen is string => typeof imagen === 'string') : borrador.imagenes,
        precio_mayoreo: Number(fila.precio_mayoreo) > 0 ? Number(fila.precio_mayoreo) : null,
        stock: fila.stock !== null && fila.stock !== undefined && Number.isSafeInteger(Number(fila.stock)) && Number(fila.stock) >= 0 ? Number(fila.stock) : null,
        cantidad_minima: fila.cantidad_minima !== null && fila.cantidad_minima !== undefined && Number.isSafeInteger(Number(fila.cantidad_minima)) && Number(fila.cantidad_minima) > 0 ? Number(fila.cantidad_minima) : null,
        disponibilidad: normalizarDisponibilidad(fila.disponibilidad),
      };
    }) };
  } catch {
    return { productos: SELECCION_INICIAL, disponible: false };
  }
});

function normalizarDisponibilidad(valor: unknown): ProductoMayoreo['disponibilidad'] {
  if (valor === 'unconfirmed' || valor === 'in_stock' || valor === 'available_from_supplier' || valor === 'low_stock' || valor === 'out_of_stock') return valor;
  if (valor === 'disponible') return 'in_stock';
  if (valor === 'agotado') return 'out_of_stock';
  return 'unconfirmed';
}
