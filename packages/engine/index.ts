export type Minutes = 15 | 30 | 45

export function sessionFormat(minutes: Minutes, missedForTime = false) {
  if (![15, 30, 45].includes(minutes)) throw new RangeError("Duración inválida")
  if (minutes === 15 || missedForTime) {
    return { minutes: 15, title: "Sesión esencial", reason: missedForTime
      ? "La última vez te faltó tiempo. Hoy podés retomar con 15 minutos."
      : "Elegiste 15 minutos. Reservamos ese tiempo para una sesión corta." }
  }
  return { minutes, title: "Sesión habitual", reason: `Hoy disponés de ${minutes} minutos.` }
}
