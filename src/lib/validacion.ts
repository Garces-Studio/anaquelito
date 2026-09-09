export function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}
export function textoValido(valor: unknown, maximo: number, minimo = 1): valor is string {
  return typeof valor === 'string' && valor.trim().length >= minimo && valor.length <= maximo;
}
export function validarCheckout(cuerpo: unknown): string | null {
  if (!esObjeto(cuerpo) || !Array.isArray(cuerpo.articulos) || !cuerpo.articulos.length || cuerpo.articulos.length > 100) return 'Carrito inválido';
  const negocio = cuerpo.negocio;
  if (!esObjeto(negocio) || !textoValido(negocio.nombre_negocio, 160) || !textoValido(negocio.telefono, 30, 8) || !textoValido(negocio.direccion, 600)) return 'Revisa los datos del negocio';
  if (negocio.tipo_negocio !== undefined && !['tiendita', 'cafe', 'emprendedor'].includes(String(negocio.tipo_negocio))) return 'Tipo de negocio inválido';
  const cantidades = new Map<string, number>();
  for (const a of cuerpo.articulos) {
    if (!esObjeto(a) || typeof a.id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(a.id) || typeof a.cantidad !== 'number' || !Number.isSafeInteger(a.cantidad) || a.cantidad < 1) return 'Artículo inválido';
    const total = (cantidades.get(a.id) ?? 0) + a.cantidad;
    if (total > 10000) return 'Cantidad máxima excedida';
    cantidades.set(a.id, total);
  }
  return null;
}
