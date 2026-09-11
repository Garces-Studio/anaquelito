import test from 'node:test';
import assert from 'node:assert/strict';
import { leerRespuesta } from '../src/lib/respuesta-json.ts';
test('respuestas vacías y HTML dan un mensaje entendible', async () => {
  for (const body of ['', '<html>503</html>', 'null', '[]']) {
    await assert.rejects(leerRespuesta(new Response(body, { status: 503 })), /solicitud|servicio/i);
  }
});
test('conserva errores válidos del servidor y lee respuestas correctas', async () => {
  await assert.rejects(leerRespuesta(new Response('{"error":"Revisa tu carrito"}', { status: 409 })), /Revisa tu carrito/);
  assert.deepEqual(await leerRespuesta(new Response('{"ok":true}')), { ok: true });
});
