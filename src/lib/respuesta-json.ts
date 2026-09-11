export async function leerRespuesta(respuesta: Response): Promise<Record<string, unknown>> {
  const texto = await respuesta.text();
  let datos: unknown;
  try { datos = JSON.parse(texto); } catch { throw new Error('No pudimos completar la solicitud. Revisa tu conexión e intenta de nuevo.'); }
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) throw new Error('El servicio respondió de forma inesperada. Intenta nuevamente.');
  const objeto = datos as Record<string, unknown>;
  if (!respuesta.ok) throw new Error(typeof objeto.error === 'string' ? objeto.error : 'No pudimos completar la solicitud.');
  return objeto;
}
