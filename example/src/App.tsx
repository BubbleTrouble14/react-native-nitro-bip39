import * as React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { MathModule } from 'react-native-nitro-bip39'

export default function App() {
  React.useEffect(() => {
    console.log(MathModule.add(2, 4))
  }, [])
  return (
    <SafeAreaProvider>{/* <HybridObjectTestsScreen /> */}</SafeAreaProvider>
  )
}
