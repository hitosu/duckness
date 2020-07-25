import type { Reagent } from '../Reagent'
import type { Effect } from '../effects/Effect'

export type ReactionInstruction = Effect
export type ReactionGenerator = Generator<ReactionInstruction>
export type Reaction = (...args: any[]) => ReactionGenerator
export interface ReactorRuntime {
  put(reagent: Reagent): void;
  addReaction(reactionGenerator: ReactionGenerator): void;
  run(...args: any[]): boolean;
  stop(stopValue: any): boolean;
  isRunning(): boolean;
}
