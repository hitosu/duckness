export type EffectType = 'spawn' | 'call' | 'take' | 'takeEvery' | 'put' | 'delay' | 'getContext' | 'setContext'

export interface Effect {
  type: EffectType;
  payload: any;
  args?: any[];
}
export type EffectConstructor = (payload: any, ...args: any[]) => Effect

const registeredEffects = new WeakMap()
export function isEffect(effect: Effect): boolean {
  return registeredEffects.has(effect)
}
export default function effectConstructor(type: EffectType): EffectConstructor {
  return function (payload: any, ...args: any[]): Effect {
    const effect = { type, payload, args }
    registeredEffects.set(effect, true)
    return effect
  }
}
