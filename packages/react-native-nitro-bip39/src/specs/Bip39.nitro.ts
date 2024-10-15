import type { HybridObject } from 'react-native-nitro-modules'

export type WordLists =
  | 'chinese_simplified'
  | 'chinese_traditional'
  | 'czech'
  | 'english'
  | 'french'
  | 'italian'
  | 'japanese'
  | 'korean'
  | 'portuguese'
  | 'spanish'

export type WordCount = 12 | 15 | 18 | 21 | 24

export interface Bip39
  extends HybridObject<{ ios: 'c++'; android: 'c++' }> {
  getDefaultWordlist(): WordLists
  setDefaultWordlist(value: WordLists): void
  generateMnemonic(
    wordCount?: WordCount,
    rng?: ArrayBuffer,
    wordlist?: WordLists
  ): string
  validateMnemonic(mnemonic: string, wordlist?: WordLists): boolean
  mnemonicToSeed(mnemonic: string, password?: string): ArrayBuffer
  mnemonicToSeedHex(mnemonic: string, password?: string): string
  mnemonicToEntropy(mnemonic: string, wordlist?: WordLists): string
  entropyToMnemonic(entropy: ArrayBuffer, wordlist?: WordLists): string
}
