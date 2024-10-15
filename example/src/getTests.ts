import { bip39 } from 'react-native-nitro-bip39'
import type { State } from './Testers'
import { it } from './Testers'
import { stringify } from './utils'
///@ts-ignore
import vectors from './vectors.json'
///@ts-ignore
import vectors1 from './vectors1.json'

type TestResult =
  | {
      status: 'successful'
      result: string
    }
  | {
      status: 'failed'
      message: string
    }

export interface TestRunner {
  name: string
  run: () => Promise<TestResult>
}

function createTest<T>(
  name: string,
  run: () => State<T> | Promise<State<T>>
): TestRunner {
  return {
    name: name,
    run: async (): Promise<TestResult> => {
      try {
        console.log(`⏳ Test "${name}" started...`)
        const state = await run()
        console.log(`✅ Test "${name}" passed!`)
        return {
          status: 'successful',
          result: stringify(state.result ?? state.errorThrown ?? '(void)'),
        }
      } catch (e) {
        console.log(`❌ Test "${name}" failed! ${e}`)
        return {
          status: 'failed',
          message: stringify(e),
        }
      }
    },
  }
}

function hexStringToArrayBuffer(hexString: string): ArrayBuffer {
  if (hexString.length % 2 !== 0) {
    throw new Error(
      'Must have an even number of hex digits to convert to bytes'
    )
  }
  const numBytes = hexString.length / 2
  const byteArray = new Uint8Array(numBytes)
  for (let i = 0; i < numBytes; i++) {
    byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16)
  }
  return byteArray.buffer
}

export function getTests(): TestRunner[] {
  return [
    createTest('throws for empty entropy', () =>
      it(() => bip39.entropyToMnemonic(new ArrayBuffer(0))).didThrow()
    ),
    createTest("throws for entropy that's not a multiple of 4 bytes", () =>
      it(() =>
        bip39.entropyToMnemonic(hexStringToArrayBuffer('000000'))
      ).didThrow()
    ),
    createTest('throws for entropy that is larger than 1024 bits', () =>
      it(() => {
        const largeEntropy = new Array(1028 + 1).join('00')
        return bip39.entropyToMnemonic(hexStringToArrayBuffer(largeEntropy))
      }).didThrow()
    ),
    // Additional tests can be added here
    createTest('generates a valid mnemonic', () =>
      it(() => {
        const mnemonic = bip39.generateMnemonic()
        return bip39.validateMnemonic(mnemonic)
      })
        .didNotThrow()
        .equals(true)
    ),
    createTest('converts mnemonic to seed', () =>
      it(() => {
        const mnemonic = bip39.generateMnemonic()
        const seed = bip39.mnemonicToSeed(mnemonic)
        return seed instanceof ArrayBuffer
      })
        .didNotThrow()
        .equals(true)
    ),
    createTest('converts mnemonic to entropy and back', () =>
      it(() => {
        const mnemonic = bip39.generateMnemonic()
        const entropy = bip39.mnemonicToEntropy(mnemonic)
        const backToMnemonic = bip39.entropyToMnemonic(
          hexStringToArrayBuffer(entropy)
        )
        return mnemonic === backToMnemonic
      })
        .didNotThrow()
        .equals(true)
    ),
    // Validate Mnemonic tests
    createTest('fails for a mnemonic that is too short', () =>
      it(() => bip39.validateMnemonic('sleep kitten')).equals(false)
    ),
    createTest('fails for a mnemonic that is too short (repeated words)', () =>
      it(() =>
        bip39.validateMnemonic('sleep kitten sleep kitten sleep kitten')
      ).equals(false)
    ),
    createTest('fails for a mnemonic that is too long', () =>
      it(() => bip39.validateMnemonic('abandon '.repeat(2048))).equals(false)
    ),
    createTest('fails if mnemonic words are not in the word list', () =>
      it(() =>
        bip39.validateMnemonic(
          'turtle front uncle idea crush write shrug there lottery flower risky shell'
        )
      ).equals(false)
    ),
    createTest('fails for invalid checksum', () =>
      it(() =>
        bip39.validateMnemonic(
          'sleep kitten sleep kitten sleep kitten sleep kitten sleep kitten sleep kitten'
        )
      ).equals(false)
    ),

    // UTF8 Passwords tests
    ...vectors.japanese
      .map((v, index) => {
        const [, vmnemonic, vseedHex] = v as [string, string, string]
        const password = '㍍ガバヴァぱばぐゞちぢ十人十色'
        const normalizedPassword = 'メートルガバヴァぱばぐゞちぢ十人十色'
        return [
          createTest(
            `mnemonicToSeedHex normalizes passwords for Japanese vector ${index}`,
            () =>
              it(() => bip39.mnemonicToSeedHex(vmnemonic, password)).equals(
                vseedHex
              )
          ),
          createTest(
            `mnemonicToSeedHex leaves normalized passwords as-is for Japanese vector ${index}`,
            () =>
              it(() =>
                bip39.mnemonicToSeedHex(vmnemonic, normalizedPassword)
              ).equals(vseedHex)
          ),
        ]
      })
      .flat(),

    // Vectors Long tests
    ...Object.entries(vectors1).flatMap(([wordlist, vectors]) =>
      vectors.flatMap((v, i) => {
        const [ventropy, vmnemonic, vseedHex] = v as [string, string, string]
        return [
          createTest(
            `mnemonicToEntropy returns correct entropy for ${wordlist} vector ${i}`,
            () =>
              it(() =>
                bip39.mnemonicToEntropy(vmnemonic, wordlist as any)
              ).equals(ventropy)
          ),
          createTest(
            `mnemonicToSeedHex returns correct seed hex for ${wordlist} vector ${i}`,
            () =>
              it(() => bip39.mnemonicToSeedHex(vmnemonic, 'TREZOR')).equals(
                vseedHex
              )
          ),
          createTest(
            `mnemonicToSeed returns correct seed buffer for ${wordlist} vector ${i}`,
            () =>
              it(() => {
                const seed = bip39.mnemonicToSeed(vmnemonic, 'TREZOR')
                return Buffer.from(seed).toString('hex')
              }).equals(vseedHex)
          ),
          createTest(
            `entropyToMnemonic returns correct mnemonic for ${wordlist} vector ${i}`,
            () =>
              it(() =>
                bip39.entropyToMnemonic(
                  hexStringToArrayBuffer(ventropy),
                  wordlist as any
                )
              ).equals(vmnemonic)
          ),
          createTest(
            `generateMnemonic returns RNG entropy unmodified for ${wordlist} vector ${i}`,
            () =>
              it(() =>
                bip39.generateMnemonic(
                  undefined,
                  hexStringToArrayBuffer(ventropy),
                  wordlist as any
                )
              ).equals(vmnemonic)
          ),
          createTest(
            `validateMnemonic returns true for valid mnemonic in ${wordlist} vector ${i}`,
            () =>
              it(() =>
                bip39.validateMnemonic(vmnemonic, wordlist as any)
              ).equals(true)
          ),
        ]
      })
    ),

    // Vectors Short tests
    ...vectors.english.map((v, i) => {
      const [ventropy, vmnemonic, vseedHex] = v as [string, string, string]
      return createTest(`English vector ${i} tests`, () =>
        it(() => {
          const entropy = bip39.mnemonicToEntropy(vmnemonic)
          const seedHex = bip39.mnemonicToSeedHex(vmnemonic, 'TREZOR')
          const seed = bip39.mnemonicToSeed(vmnemonic, 'TREZOR')
          const generatedMnemonic = bip39.entropyToMnemonic(
            hexStringToArrayBuffer(ventropy)
          )
          const isValid = bip39.validateMnemonic(vmnemonic)
          return (
            entropy === ventropy &&
            seedHex === vseedHex &&
            Buffer.from(seed).toString('hex') === vseedHex &&
            generatedMnemonic === vmnemonic &&
            isValid === true
          )
        }).equals(true)
      )
    }),

    ...vectors.japanese.map((v, i) => {
      const [ventropy, vmnemonic, vseedHex] = v as [string, string, string]
      return createTest(`Japanese vector ${i} tests`, () =>
        it(() => {
          const entropy = bip39.mnemonicToEntropy(vmnemonic, 'japanese')
          const seedHex = bip39.mnemonicToSeedHex(
            vmnemonic,
            '㍍ガバヴァぱばぐゞちぢ十人十色'
          )
          const seed = bip39.mnemonicToSeed(
            vmnemonic,
            '㍍ガバヴァぱばぐゞちぢ十人十色'
          )
          const generatedMnemonic = bip39.entropyToMnemonic(
            hexStringToArrayBuffer(ventropy),
            'japanese'
          )
          const isValid = bip39.validateMnemonic(vmnemonic, 'japanese')
          return (
            entropy === ventropy &&
            seedHex === vseedHex &&
            Buffer.from(seed).toString('hex') === vseedHex &&
            generatedMnemonic === vmnemonic &&
            isValid === true
          )
        }).equals(true)
      )
    }),
    // Wordlist tests
    createTest('setDefaultWordlist changes default wordlist', () =>
      it(() => {
        const english = bip39.getDefaultWordlist()
        if (english !== 'english') return false

        bip39.setDefaultWordlist('italian')
        const italian = bip39.getDefaultWordlist()
        if (italian !== 'italian') return false

        const phraseItalian = bip39.entropyToMnemonic(
          hexStringToArrayBuffer('00000000000000000000000000000000')
        )
        if (!phraseItalian.startsWith('abaco')) return false

        bip39.setDefaultWordlist('english')
        const phraseEnglish = bip39.entropyToMnemonic(
          hexStringToArrayBuffer('00000000000000000000000000000000')
        )
        if (!phraseEnglish.startsWith('abandon')) return false

        return true
      })
        .didNotThrow()
        .equals(true)
    ),

    createTest('setDefaultWordlist throws on unknown wordlist', () =>
      it(() => {
        const english = bip39.getDefaultWordlist()
        if (english !== 'english')
          throw new Error('Initial wordlist is not English')

        //@ts-ignore
        bip39.setDefaultWordlist('abcdefghijklmnop')
      }).didThrow()
    ),
  ]
}
