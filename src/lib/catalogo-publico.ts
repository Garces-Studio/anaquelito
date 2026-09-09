import 'server-only';
import { cache } from 'react';
import { SELECCION_INICIAL, type ProductoMayoreo } from './mayoreo';
// Lista explícita. Costos internos en una tabla privada, nunca en productos.
const CAMPOS = 'id,nombre,descripcion,categoria,unidad,precio_mayoreo,imagen_url';
const CAMPOS_MAYOREO = CAMPOS + ',slug,piezas_por_caja,bolsas_por_caja,peso_por_bolsa_g,stock,cantidad_minima,disponibilidad';
export const obtenerCatalogo = cache(async (): Promise<{ productos: ProductoMayoreo[]; disponible: boolean }> => {
  try {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const llave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!base || !llave) throw new Error('Catálogo no configurado');
    const url = new URL('/rest/v1/productos', base);
    url.searchParams.set('select', CAMPOS_MAYOREO);
    url.searchParams.set('activo', 'eq.true');
    url.searchParams.set('order', 'nombre.asc');
    const leer = () => fetch(url, { headers: { apikey: llave }, cache: 'no-store', signal: AbortSignal.timeout(5000) });
    let respuesta = await leer();
    // Compatibilidad durante el despliegue: las columnas se agregan en 0006.
    if (respuesta.status === 400) {
      url.searchParams.set('select', CAMPOS);
      respuesta = await leer();
    }
    if (!respuesta.ok) throw new Error('Catálogo no disponible');
    const filas = await respuesta.json() as Array<Partial<ProductoMayoreo> & { id: string; nombre: string }>;
    return { disponible: true, productos: SELECCION_INICIAL.map((borrador) => {
      const fila = filas.find((p) => p.slug === borrador.slug || p.nombre.toLocaleLowerCase('es') === borrador.nombre.toLocaleLowerCase('es'));
      if (!fila) return borrador;
      return {
        ...borrador,
        ...fila,
        slug: fila.slug || borrador.slug,
        precio_mayoreo: Number(fila.precio_mayoreo) > 0 ? Number(fila.precio_mayoreo) : null,
        stock: fila.stock !== null && fila.stock !== undefined && Number.isSafeInteger(Number(fila.stock)) && Number(fila.stock) >= 0 ? Number(fila.stock) : null,
        cantidad_minima: fila.cantidad_minima !== null && fila.cantidad_minima !== undefined && Number.isSafeInteger(Number(fila.cantidad_minima)) && Number(fila.cantidad_minima) > 0 ? Number(fila.cantidad_minima) : null,
        disponibilidad: fila.disponibilidad ?? borrador.disponibilidad,
      };
    }) };
  } catch {
    return { productos: SELECCION_INICIAL, disponible: false };
  }
});
