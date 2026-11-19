import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { generateSession, recommendSession, validateExerciseCatalog } from "../engine/index.ts"

async function readCatalog() {
  const source = await readFile(new URL("./catalog.json", import.meta.url), "utf8")
  return JSON.parse(source)
}

test("el catálogo completo respeta el contrato", async () => {
  const catalog = await readCatalog()

  assert.deepEqual(validateExerciseCatalog(catalog), [])
})

test("arma una sesión hogareña de 30 minutos con cobertura completa", async () => {
  const catalog = await readCatalog()
  const recommendation = recommendSession({ availableMinutes: 30, energy: "medium", missedReason: null })
  const session = generateSession(recommendation, {
    equipment: ["chair", "wall", "mat", "backpack"],
    limitations: [],
    level: 1,
  }, catalog, true)

  assert.equal(session.exercises.length, 5)
  assert.deepEqual(session.missingPatterns, [])
  assert.equal(session.usesDraftExercises, true)
})
