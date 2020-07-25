import type { Reaction } from '../ReactorRuntime';
import type { EffectsRuntime } from './EffectsRuntime';
import type { TaskID, TaskOnDone, TaskOnCancel } from './TaskManager';
export interface SpawnedReaction {
    cancel: TaskOnCancel;
    curentInstructionTaskID: () => TaskID | null;
}
export default function spawnReaction(reaction: Reaction, reactionArgs: any[], onDone: TaskOnDone | null, effectsRuntime: EffectsRuntime): SpawnedReaction;
