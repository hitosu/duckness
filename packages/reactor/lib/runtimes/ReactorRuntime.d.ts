import type { Reagent, ReagentType } from '../Reagent';
import type { Effect } from '../effects/Effect';
export declare type ReactionInstruction = Effect;
export declare type ReactionGenerator = Generator<ReactionInstruction, any, any>;
export declare type Reaction = (...args: any[]) => ReactionGenerator;
export declare type ReagentListener = (reagent: Reagent) => void;
export declare type CancelReagentListener = () => void;
export interface ReactorRuntime {
    put(reagent: Reagent): void;
    takeEvery(reagentTypes: Array<ReagentType> | ReagentType, listener: ReagentListener): CancelReagentListener;
    addReaction(reaction: Reaction): void;
    run(...args: any[]): boolean;
    stop(stopValue: any): boolean;
    isRunning(): boolean;
}
