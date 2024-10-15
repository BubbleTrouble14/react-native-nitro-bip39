import type { HybridObject } from 'react-native-nitro-modules'

export interface Math extends HybridObject<{ ios: 'c++'; android: 'c++' }> {
  add(a: number, b: number): number
}
