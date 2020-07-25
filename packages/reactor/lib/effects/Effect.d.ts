export declare type TEffectType = 'spawn' | 'call' | 'take' | 'takeEvery' | 'put' | 'delay';
export interface TEffect {
    type: TEffectType;
    payload: any;
    args?: any[];
}
export declare type TEffectConstructor = (payload: any, ...args: any[]) => TEffect;
export default function effectConstructor(type: TEffectType): TEffectConstructor;
