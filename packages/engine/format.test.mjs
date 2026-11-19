import test from 'node:test'
import assert from 'node:assert/strict'
import { sessionFormat } from './index.ts'
for (const minutes of [15, 30, 45]) {
  test('Respeta el tiempo elegido: ' + minutes, () => assert.equal(sessionFormat(minutes).minutes, minutes))
}
test('Adapta el regreso tras faltar por tiempo', () => assert.equal(sessionFormat(45, true).minutes, 15))
test('Rechaza duraciones desconocidas', () => assert.throws(() => sessionFormat(0), RangeError))
