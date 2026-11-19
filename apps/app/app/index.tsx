import { useState, type ReactNode } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import {
  recommendSession,
  type AvailableMinutes,
  type EnergyLevel,
  type MissedReason,
} from "@mi/engine"
import { colors } from "@mi/ui"
import { ChoiceButton } from "../components/ChoiceButton"

const TIME_OPTIONS: AvailableMinutes[] = [15, 30, 45]
const ENERGY_OPTIONS: { value: EnergyLevel; label: string }[] = [
  { value: "low", label: "Baja" },
  { value: "medium", label: "Normal" },
  { value: "high", label: "Alta" },
]
const MISSED_OPTIONS: { value: MissedReason; label: string }[] = [
  { value: null, label: "No falté" },
  { value: "time", label: "Me faltó tiempo" },
  { value: "energy", label: "Me faltó energía" },
  { value: "pain", label: "Tuve una molestia" },
  { value: "other", label: "Otro motivo" },
]

export default function CheckInScreen() {
  const [availableMinutes, setAvailableMinutes] = useState<AvailableMinutes>(15)
  const [energy, setEnergy] = useState<EnergyLevel>("medium")
  const [missedReason, setMissedReason] = useState<MissedReason>(null)
  const recommendation = recommendSession({ availableMinutes, energy, missedReason })

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.eyebrow}>MINI-NO</Text>
          <Text accessibilityRole="header" style={styles.title}>¿Cómo viene tu día?</Text>
          <Text style={styles.subtitle}>Tres respuestas alcanzan para adaptar la sesión de hoy.</Text>
        </View>

        <Question title="¿Cuánto tiempo tenés?">
          <View style={styles.row}>
            {TIME_OPTIONS.map((minutes) => (
              <View key={minutes} style={styles.flexChoice}>
                <ChoiceButton
                  label={`${minutes} min`}
                  selected={availableMinutes === minutes}
                  onPress={() => setAvailableMinutes(minutes)}
                />
              </View>
            ))}
          </View>
        </Question>

        <Question title="¿Cómo está tu energía?">
          <View style={styles.row}>
            {ENERGY_OPTIONS.map((option) => (
              <View key={option.value} style={styles.flexChoice}>
                <ChoiceButton
                  label={option.label}
                  selected={energy === option.value}
                  onPress={() => setEnergy(option.value)}
                />
              </View>
            ))}
          </View>
        </Question>

        <Question title="Si faltaste, ¿qué pasó?">
          <View style={styles.stack}>
            {MISSED_OPTIONS.map((option) => (
              <ChoiceButton
                key={option.value ?? "none"}
                label={option.label}
                selected={missedReason === option.value}
                onPress={() => setMissedReason(option.value)}
              />
            ))}
          </View>
        </Question>

        <View accessibilityLiveRegion="polite" style={styles.recommendation}>
          <Text style={styles.recommendationLabel}>Tu propuesta de hoy</Text>
          <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
          <Text style={styles.recommendationMeta}>{recommendation.minutes} minutos</Text>
          <Text style={styles.recommendationReason}>{recommendation.reason}</Text>
          {recommendation.requiresPainReview ? (
            <Text style={styles.careMessage}>
              Si la molestia se repite, pausá ese movimiento y consultá a un profesional.
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function Question({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.question}>
      <Text style={styles.questionTitle}>{title}</Text>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 },
  content: {
    gap: 24,
    marginHorizontal: "auto",
    maxWidth: 680,
    padding: 24,
    width: "100%",
  },
  intro: { gap: 8 },
  eyebrow: { color: colors.brand, fontSize: 14, fontWeight: "800", letterSpacing: 1.4 },
  title: { color: colors.ink, fontSize: 32, fontWeight: "800" },
  subtitle: { color: "#5B526A", fontSize: 17, lineHeight: 24 },
  question: { gap: 12 },
  questionTitle: { color: colors.ink, fontSize: 19, fontWeight: "700" },
  row: { flexDirection: "row", gap: 10 },
  flexChoice: { flex: 1 },
  stack: { gap: 10 },
  recommendation: {
    backgroundColor: colors.white,
    borderColor: "#DED5F5",
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
    padding: 20,
  },
  recommendationLabel: {
    color: colors.progress,
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  recommendationTitle: { color: colors.ink, fontSize: 24, fontWeight: "800" },
  recommendationMeta: { color: colors.brand, fontSize: 17, fontWeight: "700" },
  recommendationReason: { color: "#4F465E", fontSize: 16, lineHeight: 23 },
  careMessage: { color: colors.ink, fontSize: 15, fontWeight: "700", lineHeight: 22 },
})
