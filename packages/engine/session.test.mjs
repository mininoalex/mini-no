import test from "node:test"
import assert from "node:assert/strict"
import { generateSession, recommendSession, sessionFormat, validateExerciseCatalog } from "./index.ts"

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

const catalog = [
  {
    id: "chair-squat",
    name: "Sentarse y pararse de una silla",
    pattern: "knee_dominant",
    equipment: ["chair"],
    level: 1,
    progressionChain: "squat",
    progressionOrder: 1,
    avoidWhen: [],
    reviewStatus: "reviewed",
  },
  {
    id: "wall-push-up",
    name: "Flexión contra la pared",
    pattern: "horizontal_push",
    equipment: ["wall"],
    level: 1,
    progressionChain: "push-up",
    progressionOrder: 1,
    avoidWhen: ["wrist_discomfort"],
    reviewStatus: "reviewed",
  },
]

test("genera una sesión solo con ejercicios compatibles", () => {
  const recommendation = recommendSession(checkIn({ availableMinutes: 15 }))
  const session = generateSession(recommendation, {
    equipment: ["chair", "wall"],
    limitations: [],
    level: 1,
  }, catalog)

  assert.deepEqual(session.exercises.map((exercise) => exercise.exerciseId), ["chair-squat", "wall-push-up"])
  assert.deepEqual(session.missingPatterns, ["horizontal_pull"])
})

test("filtra un ejercicio cuando coincide con una limitación", () => {
  const recommendation = recommendSession(checkIn({ availableMinutes: 15 }))
  const session = generateSession(recommendation, {
    equipment: ["chair", "wall"],
    limitations: ["wrist_discomfort"],
    level: 1,
  }, catalog)

  assert.deepEqual(session.exercises.map((exercise) => exercise.exerciseId), ["chair-squat"])
})

test("no usa borradores salvo que se habiliten explícitamente", () => {
  const draftCatalog = [{ ...catalog[0], id: "draft", reviewStatus: "draft" }]
  const recommendation = recommendSession(checkIn({ availableMinutes: 15 }))
  const profile = { equipment: ["chair"], limitations: [], level: 1 }

  assert.equal(generateSession(recommendation, profile, draftCatalog).exercises.length, 0)
  assert.equal(generateSession(recommendation, profile, draftCatalog, true).usesDraftExercises, true)
})

test("detecta identificadores repetidos en el catálogo", () => {
  assert.deepEqual(validateExerciseCatalog([catalog[0], catalog[0]]), ["Ejercicio 2: id repetido chair-squat"])
})
