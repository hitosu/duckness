import type { ReactionGenerator, ReagentListener, CancelReagentListener } from '../../ReactorRuntime';
import type { TaskID, TaskManager, TaskOnDone } from '../TaskManager';
import type { Reagent, ReagentType } from '../../../Reagent';
import type { EffectTaskWorker } from './EffectTaskWorker';
export interface EffectsRuntime {
    addTask(worker: EffectTaskWorker, onDone: TaskOnDone, ...workerArgs: any[]): TaskID;
    cancelTask(id: TaskID, cancelValue?: any): boolean;
    runTasksQueue(resume?: boolean): void;
    spawn: (reactionGenerator: ReactionGenerator, ...args: any[]) => void;
    put: (reagent: Reagent) => void;
    takeEvery: (reagentType: ReagentType, listener: ReagentListener) => CancelReagentListener;
    take: (reagentType: ReagentType, listener: ReagentListener) => CancelReagentListener;
}
export declare function buildEffectsRuntime(reactorState: {
    taskManager: TaskManager;
    spawnedReactionIDs: Set<TaskID>;
}): EffectsRuntime;
