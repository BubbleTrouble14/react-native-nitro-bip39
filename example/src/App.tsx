import * as React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { bip39 } from 'react-native-nitro-bip39'
import { HybridObjectTestsScreen } from './screens/HybridObjectTestsScreen'

export default function App() {
  React.useEffect(() => {
    const seed = bip39.mnemonicToSeed(
      'zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo vote',
      'TREZOR'
    )
    console.log(Buffer.from(seed).toString('hex'))
  }, [])
  return (
    <SafeAreaProvider>
      <HybridObjectTestsScreen />
    </SafeAreaProvider>
  )
}
