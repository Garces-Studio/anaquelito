import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validarCheckout } from '../src/lib/validacion.ts';
const id = '12345678-1234-1234-1234-123456789abc';
const negocio = { nombre_negocio: 'Tienda', telefono: '5512345678', direccion: 'Domicilio de prueba' };
test('rechaza cuerpos JSON que antes provocaban excepciones', () => {
  for (const cuerpo of [null, [], 5, {}, { articulos: {} }, { articulos: [null], negocio }]) assert.ok(validarCheckout(cuerpo));
});
test('rechaza cantidades fraccionarias, infinitas y negativas', () => {
  for (const cantidad of [1.5, Infinity, -1, 0, '2']) assert.ok(validarCheckout({ negocio, articulos: [{ id, cantidad }] }));
});
test('aplica el máximo a IDs repetidos, no solo a cada renglón', () => {
  assert.ok(validarCheckout({ negocio, articulos: [{ id, cantidad: 6000 }, { id, cantidad: 6000 }] }));
});
test('valida límites y formatos de negocio', () => {
  assert.ok(validarCheckout({ negocio: { ...negocio, nombre_negocio: 'x'.repeat(161) }, articulos: [{ id, cantidad: 1 }] }));
  assert.ok(validarCheckout({ negocio: { ...negocio, tipo_negocio: 'administrador' }, articulos: [{ id, cantidad: 1 }] }));
});
test('permite cantidades enteras válidas y no necesita precios del navegador', () => {
  assert.equal(validarCheckout({ negocio, articulos: [{ id, cantidad: 3 }] }), null);
});
