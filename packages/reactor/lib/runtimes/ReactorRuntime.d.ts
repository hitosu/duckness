import type { Reagent } from '../Reagent';
import type { Effect } from '../effects/Effect';
export declare type ReactionInstruction = Effect;
export declare type ReactionGenerator = Generator<ReactionInstruction>;
export declare type Reaction = (...args: any[]) => ReactionGenerator;
export interface ReactorRuntime {
    put(reagent: Reagent): void;
    addReaction(reactionGenerator: ReactionGenerator): void;
    run(...args: any[]): boolean;
    stop(stopValue: any): boolean;
    isRunning(): boolean;
}
