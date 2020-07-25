export type TEffectType = 'spawn' | 'call' | 'take' | 'takeEvery' | 'put' | 'delay'

export interface TEffect {
  type: TEffectType;
  payload: any;
  args?: any[];
}
export type TEffectConstructor = (payload: any, ...args: any[]) => TEffect

export default function effectConstructor(type: TEffectType): TEffectConstructor {
  return function (payload: any, ...args: any[]): TEffect {
    return { type, payload, args }
  }
}
