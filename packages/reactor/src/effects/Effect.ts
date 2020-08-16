export type EffectType = 'spawn' | 'call' | 'take' | 'takeEvery' | 'put' | 'delay' | 'getContext' | 'setContext'

export interface Effect {
  type: EffectType;
  payload: any;
  args?: any[];
}
export type EffectConstructor = (payload: any, ...args: any[]) => Effect

export function isEffect(effect: Effect): boolean {
  return effect instanceof Object && Boolean(effect.type)
}
export default function effectConstructor(type: EffectType): EffectConstructor {
  return function (payload: any, ...args: any[]): Effect {
    const effect = { type, payload, args }
    return effect
  }
}
