import { Pressable, StyleSheet, Text } from "react-native"
import { colors } from "@mi/ui"

interface ChoiceButtonProps {
  label: string
  selected: boolean
  onPress: () => void
}

export function ChoiceButton({ label, selected, onPress }: ChoiceButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        selected ? styles.selectedButton : styles.unselectedButton,
        pressed ? styles.pressedButton : null,
      ]}
    >
      <Text style={[styles.label, selected ? styles.selectedLabel : styles.unselectedLabel]}>
        {label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectedButton: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  unselectedButton: {
    backgroundColor: colors.white,
    borderColor: "#D8CFF3",
  },
  pressedButton: {
    opacity: 0.78,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
  },
  selectedLabel: {
    color: colors.white,
  },
  unselectedLabel: {
    color: colors.ink,
  },
})
