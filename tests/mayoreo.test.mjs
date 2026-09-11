import test from 'node:test';
import assert from 'node:assert/strict';
import { CAJAS_POR_TARIMA, desgloseCajas } from '../src/lib/mayoreo.ts';

test('una tarima comercial equivale a 100 cajas', () => {
  assert.equal(CAJAS_POR_TARIMA, 100);
  assert.equal(desgloseCajas(100), '1 tarima');
  assert.equal(desgloseCajas(200), '2 tarimas');
});

test('desglosa correctamente tarimas y cajas sueltas', () => {
  assert.equal(desgloseCajas(1), '1 caja');
  assert.equal(desgloseCajas(27), '27 cajas');
  assert.equal(desgloseCajas(103), '1 tarima + 3 cajas');
});
