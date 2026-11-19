import { StyleSheet, Text, View } from "react-native"
import type { GeneratedSession, MovementPattern } from "@mi/engine"
import { colors } from "@mi/ui"

const PATTERN_LABELS: Record<MovementPattern, string> = {
  knee_dominant: "piernas",
  hip_dominant: "cadera",
  horizontal_push: "empuje",
  horizontal_pull: "tirón",
  core: "zona media",
  calf: "pantorrillas",
}

export function SessionPreview({ session }: { session: GeneratedSession }) {
  return (
    <View style={styles.container}>
      <View style={styles.headingRow}>
        <Text style={styles.heading}>Ejercicios propuestos</Text>
        <Text style={styles.draftBadge}>BORRADOR</Text>
      </View>

      {session.exercises.length > 0 ? (
        <View style={styles.list}>
          {session.exercises.map((exercise, index) => (
            <View key={exercise.exerciseId} style={styles.exercise}>
              <Text style={styles.number}>{index + 1}</Text>
              <View style={styles.exerciseCopy}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.pattern}>{PATTERN_LABELS[exercise.pattern]}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.message}>Elegí el equipo que tenés para armar una propuesta.</Text>
      )}

      {session.missingPatterns.length > 0 ? (
        <Text style={styles.message}>
          Faltan variantes compatibles para: {session.missingPatterns.map((pattern) => PATTERN_LABELS[pattern]).join(", ")}.
        </Text>
      ) : null}

      {session.usesDraftExercises ? (
        <Text style={styles.reviewNotice}>
          Esta biblioteca todavía necesita revisión profesional antes de usarse como indicación de entrenamiento.
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EAE4FB",
    borderRadius: 20,
    gap: 14,
    padding: 20,
  },
  headingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  heading: {
    color: colors.ink,
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
  },
  draftBadge: {
    backgroundColor: colors.white,
    borderRadius: 999,
    color: colors.brand,
    fontSize: 11,
    fontWeight: "800",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  list: { gap: 10 },
  exercise: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 14,
    flexDirection: "row",
    gap: 12,
    minHeight: 58,
    padding: 12,
  },
  number: {
    color: colors.brand,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    width: 24,
  },
  exerciseCopy: { flex: 1, gap: 2 },
  exerciseName: { color: colors.ink, fontSize: 16, fontWeight: "700" },
  pattern: { color: "#665C75", fontSize: 13, textTransform: "uppercase" },
  message: { color: "#554B64", fontSize: 15, lineHeight: 21 },
  reviewNotice: { color: colors.ink, fontSize: 14, fontWeight: "700", lineHeight: 20 },
})
