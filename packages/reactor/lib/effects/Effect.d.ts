export declare type EffectType = 'spawn' | 'call' | 'take' | 'takeEvery' | 'put' | 'delay';
export interface Effect {
    type: EffectType;
    payload: any;
    args?: any[];
}
export declare type EffectConstructor = (payload: any, ...args: any[]) => Effect;
export default function effectConstructor(type: EffectType): EffectConstructor;
