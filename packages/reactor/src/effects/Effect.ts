export type EffectType = 'spawn' | 'call' | 'take' | 'takeEvery' | 'put' | 'delay'

export interface Effect {
  type: EffectType;
  payload: any;
  args?: any[];
}
export type EffectConstructor = (payload: any, ...args: any[]) => Effect

export default function effectConstructor(type: EffectType): EffectConstructor {
  return function (payload: any, ...args: any[]): Effect {
    return { type, payload, args }
  }
}
