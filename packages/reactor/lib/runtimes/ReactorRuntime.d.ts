import type { TReagent } from '../Reagent';
import type { TEffect } from '../effects/Effect';
export declare type TReactionGeneratorYield = TEffect;
export declare type TReactionGenerator = (...args: any[]) => Generator<TReactionGeneratorYield, any, any>;
export interface TReactorRuntime {
    put(reagent: TReagent): void;
    addReaction(reactionGenerator: TReactionGenerator): void;
    run(...args: any[]): boolean;
    stop(stopValue: any): boolean;
    isRunning(): boolean;
}
