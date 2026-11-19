export type AvailableMinutes = 15 | 30 | 45
export type EnergyLevel = "low" | "medium" | "high"
export type MissedReason = "time" | "energy" | "pain" | "other" | null
export type SessionMode = "essential" | "lighter" | "regular"

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
