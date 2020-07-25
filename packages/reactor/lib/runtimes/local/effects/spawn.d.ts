import type { TEffectTaskWorker } from './EffectTaskWorker';
import type { TEffect } from '../../../effects/Effect';
export declare type TReactionInstruction = TEffect;
export declare type TReactionGenerator = Generator<TReactionInstruction>;
export declare type TReaction = (...args: any[]) => TReactionGenerator;
declare const spawnEffect: TEffectTaskWorker;
export default spawnEffect;
