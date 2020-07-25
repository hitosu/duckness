import type { ReagentListener, CancelReagentListener, Reaction } from '../ReactorRuntime';
import type { TaskID, TaskManager, TaskOnDone } from './TaskManager';
import type { Reagent, ReagentType } from '../../Reagent';
import type { EffectTaskWorker } from './EffectTaskWorker';
import { SpawnedReaction } from './ReactionRuntime';
export interface EffectsRuntime {
    addTask(worker: EffectTaskWorker, onDone: TaskOnDone, ...workerArgs: any[]): TaskID;
    cancelTask(id: TaskID, cancelValue?: any): boolean;
    runTasksQueue(resume?: boolean): void;
    spawnReaction: (reaction: Reaction, ...args: any[]) => SpawnedReaction;
    put: (reagent: Reagent) => void;
    takeEvery: (reagentType: ReagentType, listener: ReagentListener) => CancelReagentListener;
    take: (reagentType: ReagentType, listener: ReagentListener) => CancelReagentListener;
    setContext: (props: {
        [key: string]: any;
    }) => void;
    getContext: (...keys: string[]) => {
        [key: string]: any;
    };
}
export declare function buildEffectsRuntime(reactorState: {
    taskManager: TaskManager;
    spawnedReactions: Set<SpawnedReaction>;
    context: {
        [key: string]: any;
    };
}): EffectsRuntime;
