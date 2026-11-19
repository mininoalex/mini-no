import { useState } from 'react'
import { ScrollView, Text, Pressable } from 'react-native'
import { sessionFormat, type Minutes } from '@mi/engine'
import { colors } from '@mi/ui'

export default function CheckIn() {
  const [minutes, select] = useState<Minutes>(15)
  const plan = sessionFormat(minutes)
  return <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ padding: 24, gap: 16 }}>
    <Text accessibilityRole="header" style={{ color: colors.ink, fontSize: 30 }}>¿Cuánto tiempo tenés hoy?</Text>
    {([15, 30, 45] as const).map(value => <Pressable key={value} accessibilityRole="button"
      accessibilityState={{ selected: value === minutes }} onPress={() => select(value)}
      style={{ minHeight: 48, padding: 14, backgroundColor: value === minutes ? colors.brand : colors.white }}>
      <Text style={{ color: value === minutes ? colors.white : colors.ink }}>{value} minutos</Text>
    </Pressable>)}
    <Text accessibilityLiveRegion="polite" style={{ color: colors.ink }}>{plan.title}. {plan.reason}</Text>
  </ScrollView>
}
