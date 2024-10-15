// TODO: Export all HybridObjects here
import { NitroModules } from 'react-native-nitro-modules'
import type { Math } from './specs/Math.nitro'
import type { Bip39 } from './specs/Bip39.nitro'

export * from './specs/Math.nitro'
export * from './specs/Bip39.nitro'

export const MathModule = NitroModules.createHybridObject<Math>('Math')
export const bip39 = NitroModules.createHybridObject<Bip39>('Bip39')
