import type { ReactionGenerator } from '../../ReactorRuntime';
import type { TaskID, TaskManager } from '../TaskManager';
import type { Reagent, ReagentType } from '../../../Reagent';
export declare type ReagentListener = (reagent: Reagent) => void;
export interface EffectsRuntime {
    spawn: (reactionGenerator: ReactionGenerator, ...args: any[]) => void;
    put: (reagent: Reagent) => void;
    takeEvery: (reagentType: ReagentType, listener: ReagentListener) => () => void;
    take: (reagentType: ReagentType, listener: ReagentListener) => () => void;
}
export declare function buildEffectsRuntime(reactorState: {
    taskManager: TaskManager;
    spawnedReactionIDs: Set<TaskID>;
}): EffectsRuntime;
