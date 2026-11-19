import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ title: 'MINI-NO' }} />
    </SafeAreaProvider>
  )
}
