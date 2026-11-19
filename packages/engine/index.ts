export type AvailableMinutes = 15 | 30 | 45
export type EnergyLevel = "low" | "medium" | "high"
export type MissedReason = "time" | "energy" | "pain" | "other" | null
export type SessionMode = "essential" | "lighter" | "regular"
export type TrainingLevel = 1 | 2 | 3
export type MovementPattern =
  | "knee_dominant"
  | "hip_dominant"
  | "horizontal_push"
  | "horizontal_pull"
  | "core"
  | "calf"
export type Equipment = "none" | "chair" | "wall" | "mat" | "backpack" | "band" | "dumbbells"
export type LimitationTag =
  | "knee_discomfort"
  | "shoulder_discomfort"
  | "wrist_discomfort"
  | "back_discomfort"
  | "needs_balance_support"

export interface DailyCheckIn {
  availableMinutes: AvailableMinutes
  energy: EnergyLevel
  missedReason: MissedReason
}

export interface SessionRecommendation {
  minutes: AvailableMinutes
  mode: SessionMode
  title: string
  reason: string
  requiresPainReview: boolean
}

export interface Exercise {
  id: string
  name: string
  pattern: MovementPattern
  equipment: Equipment[]
  level: TrainingLevel
  progressionChain: string
  progressionOrder: number
  avoidWhen: LimitationTag[]
  reviewStatus: "draft" | "reviewed"
}

export interface TrainingProfile {
  equipment: Equipment[]
  limitations: LimitationTag[]
  level: TrainingLevel
}

export interface PlannedExercise {
  exerciseId: string
  name: string
  pattern: MovementPattern
}

export interface GeneratedSession {
  exercises: PlannedExercise[]
  missingPatterns: MovementPattern[]
  minutes: AvailableMinutes
  mode: SessionMode
  usesDraftExercises: boolean
}

const AVAILABLE_MINUTES = new Set<number>([15, 30, 45])

export function recommendSession(checkIn: DailyCheckIn): SessionRecommendation {
  if (!AVAILABLE_MINUTES.has(checkIn.availableMinutes)) {
    throw new RangeError("Duración inválida")
  }

  if (checkIn.missedReason === "pain") {
    return {
      minutes: 15,
      mode: "lighter",
      title: "Revisemos antes de entrenar",
      reason: "Marcaste una molestia. Hoy evitamos esa zona y revisamos una variante más cómoda.",
      requiresPainReview: true,
    }
  }

  if (checkIn.availableMinutes === 15 || checkIn.missedReason === "time") {
    return {
      minutes: 15,
      mode: "essential",
      title: "Sesión esencial",
      reason: checkIn.missedReason === "time"
        ? "La última vez te faltó tiempo. Hoy podés retomar con una sesión de 15 minutos."
        : "Elegiste 15 minutos. Armamos una sesión corta para sostener la constancia.",
      requiresPainReview: false,
    }
  }

  if (checkIn.energy === "low" || checkIn.missedReason === "energy") {
    return {
      minutes: checkIn.availableMinutes,
      mode: "lighter",
      title: "Sesión más liviana",
      reason: "Hoy tenés poca energía. Conservamos el tiempo y bajamos la exigencia.",
      requiresPainReview: false,
    }
  }

  return {
    minutes: checkIn.availableMinutes,
    mode: "regular",
    title: "Sesión habitual",
    reason: `Hoy disponés de ${checkIn.availableMinutes} minutos y energía para tu sesión habitual.`,
    requiresPainReview: false,
  }
}

export function sessionFormat(availableMinutes: AvailableMinutes, missedForTime = false) {
  return recommendSession({
    availableMinutes,
    energy: "medium",
    missedReason: missedForTime ? "time" : null,
  })
}

const PATTERNS_BY_DURATION: Record<AvailableMinutes, MovementPattern[]> = {
  15: ["knee_dominant", "horizontal_push", "horizontal_pull"],
  30: ["knee_dominant", "hip_dominant", "horizontal_push", "horizontal_pull", "core"],
  45: ["knee_dominant", "hip_dominant", "horizontal_push", "horizontal_pull", "core", "calf"],
}

export function generateSession(
  recommendation: SessionRecommendation,
  profile: TrainingProfile,
  catalog: Exercise[],
  includeDrafts = false,
): GeneratedSession {
  const equipment = new Set<Equipment>(["none", ...profile.equipment])
  const limitations = new Set(profile.limitations)
  const eligibleExercises = catalog.filter((exercise) => {
    const hasEquipment = exercise.equipment.every((item) => equipment.has(item))
    const matchesLevel = exercise.level <= profile.level
    const isAllowed = exercise.avoidWhen.every((item) => !limitations.has(item))
    const hasRequiredReview = includeDrafts || exercise.reviewStatus === "reviewed"
    return hasEquipment && matchesLevel && isAllowed && hasRequiredReview
  })

  const desiredPatterns = PATTERNS_BY_DURATION[recommendation.minutes]
  const exercises: PlannedExercise[] = []
  const missingPatterns: MovementPattern[] = []

  for (const pattern of desiredPatterns) {
    const selected = eligibleExercises.find((exercise) => exercise.pattern === pattern)
    if (!selected) {
      missingPatterns.push(pattern)
      continue
    }
    exercises.push({ exerciseId: selected.id, name: selected.name, pattern: selected.pattern })
  }

  return {
    exercises,
    missingPatterns,
    minutes: recommendation.minutes,
    mode: recommendation.mode,
    usesDraftExercises: exercises.some((planned) => (
      catalog.find((exercise) => exercise.id === planned.exerciseId)?.reviewStatus === "draft"
    )),
  }
}

export function validateExerciseCatalog(value: unknown): string[] {
  if (!Array.isArray(value)) return ["El catálogo debe ser una lista"]

  const errors: string[] = []
  const ids = new Set<string>()
  const validPatterns = new Set<MovementPattern>(PATTERNS_BY_DURATION[45])
  const validEquipment = new Set<Equipment>(["none", "chair", "wall", "mat", "backpack", "band", "dumbbells"])
  const validLimitations = new Set<LimitationTag>([
    "knee_discomfort",
    "shoulder_discomfort",
    "wrist_discomfort",
    "back_discomfort",
    "needs_balance_support",
  ])

  value.forEach((entry, index) => {
    if (!entry || typeof entry !== "object") {
      errors.push(`Ejercicio ${index + 1}: formato inválido`)
      return
    }

    const exercise = entry as Partial<Exercise>
    if (!exercise.id || typeof exercise.id !== "string") errors.push(`Ejercicio ${index + 1}: falta id`)
    if (exercise.id && ids.has(exercise.id)) errors.push(`Ejercicio ${index + 1}: id repetido ${exercise.id}`)
    if (exercise.id) ids.add(exercise.id)
    if (!exercise.name || typeof exercise.name !== "string") errors.push(`Ejercicio ${index + 1}: falta nombre`)
    if (!exercise.pattern || !validPatterns.has(exercise.pattern)) errors.push(`Ejercicio ${index + 1}: patrón inválido`)
    if (!Array.isArray(exercise.equipment) || exercise.equipment.some((item) => !validEquipment.has(item))) {
      errors.push(`Ejercicio ${index + 1}: equipamiento inválido`)
    }
    if (![1, 2, 3].includes(exercise.level ?? 0)) errors.push(`Ejercicio ${index + 1}: nivel inválido`)
    if (!exercise.progressionChain) errors.push(`Ejercicio ${index + 1}: falta cadena de progresión`)
    if (typeof exercise.progressionOrder !== "number" || !Number.isInteger(exercise.progressionOrder)) {
      errors.push(`Ejercicio ${index + 1}: orden inválido`)
    }
    if (!Array.isArray(exercise.avoidWhen) || exercise.avoidWhen.some((item) => !validLimitations.has(item))) {
      errors.push(`Ejercicio ${index + 1}: filtros inválidos`)
    }
    if (!exercise.reviewStatus || !["draft", "reviewed"].includes(exercise.reviewStatus)) {
      errors.push(`Ejercicio ${index + 1}: estado de revisión inválido`)
    }
  })

  return errors
}
