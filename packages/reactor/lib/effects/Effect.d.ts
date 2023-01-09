export type EffectType = 'spawn' | 'call' | 'take' | 'takeEvery' | 'put' | 'delay' | 'getContext' | 'setContext';
export interface Effect {
    type: EffectType;
    payload: any;
    args?: any[];
}
export type EffectConstructor = (payload: any, ...args: any[]) => Effect;
export declare function isEffect(effect: Effect): boolean;
export default function effectConstructor(type: EffectType): EffectConstructor;
