import type { Reagent, ReagentType } from '../Reagent'
import type { Effect } from '../effects/Effect'

export type ReactionInstruction = Effect
export type ReactionGenerator = Generator<ReactionInstruction, any, any>
export type Reaction = (...args: any[]) => ReactionGenerator
export type ReagentListener = (reagent: Reagent) => void
export type CancelReagentListener = () => void

export interface ReactorRuntime {
  put(reagent: Reagent): void;
  takeEvery(reagentTypes: Array<ReagentType> | ReagentType, listener: ReagentListener): CancelReagentListener;
  addReaction(reactionGenerator: ReactionGenerator): void;
  run(...args: any[]): boolean;
  stop(stopValue: any): boolean;
  isRunning(): boolean;
}
