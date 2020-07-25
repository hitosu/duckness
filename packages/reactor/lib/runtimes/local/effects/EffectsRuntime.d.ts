import type { TReactionGenerator } from '../../ReactorRuntime';
import type { TTaskID, TTaskManager } from '../TaskManager';
import type { TReagent, TReagentType } from '../../../Reagent';
export declare type TReagentListener = (reagent: TReagent) => void;
export interface TEffectsRuntime {
    spawn: (reactionGenerator: TReactionGenerator, ...args: any[]) => void;
    put: (reagent: TReagent) => void;
    takeEvery: (reagentType: TReagentType, listener: TReagentListener) => () => void;
    take: (reagentType: TReagentType, listener: TReagentListener) => () => void;
}
export declare function buildEffectsRuntime(reactorState: {
    taskManager: TTaskManager;
    spawnedReactionIDs: Set<TTaskID>;
}): TEffectsRuntime;
