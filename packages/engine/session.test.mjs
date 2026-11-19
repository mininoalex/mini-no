import test from "node:test"
import assert from "node:assert/strict"
import { recommendSession, sessionFormat } from "./index.ts"

const checkIn = (overrides = {}) => ({
  availableMinutes: 30,
  energy: "medium",
  missedReason: null,
  ...overrides,
})

test("recomienda una sesión habitual cuando no hace falta adaptar", () => {
  const result = recommendSession(checkIn())
  assert.equal(result.mode, "regular")
  assert.equal(result.minutes, 30)
  assert.equal(result.requiresPainReview, false)
})

test("prioriza una revisión cuando la persona informa una molestia", () => {
  const result = recommendSession(checkIn({ missedReason: "pain", energy: "high", availableMinutes: 45 }))
  assert.equal(result.mode, "lighter")
  assert.equal(result.minutes, 15)
  assert.equal(result.requiresPainReview, true)
})

test("ofrece una sesión esencial cuando solo hay 15 minutos", () => {
  const result = recommendSession(checkIn({ availableMinutes: 15 }))
  assert.equal(result.mode, "essential")
  assert.equal(result.minutes, 15)
})

test("ofrece una sesión esencial después de faltar por tiempo", () => {
  const result = recommendSession(checkIn({ availableMinutes: 45, missedReason: "time" }))
  assert.equal(result.mode, "essential")
  assert.equal(result.minutes, 15)
})

test("conserva la duración y baja la exigencia cuando hay poca energía", () => {
  const result = recommendSession(checkIn({ availableMinutes: 45, energy: "low" }))
  assert.equal(result.mode, "lighter")
  assert.equal(result.minutes, 45)
})

test("rechaza una duración desconocida", () => {
  assert.throws(() => recommendSession(checkIn({ availableMinutes: 20 })), RangeError)
})

test("mantiene compatibilidad con la función de la primera tanda", () => {
  assert.equal(sessionFormat(30).mode, "regular")
  assert.equal(sessionFormat(45, true).mode, "essential")
})
