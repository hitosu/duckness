import type { TaskOnDone, TaskOnCancel } from '../TaskManager';
import type { Effect } from '../../../effects/Effect';
import type { EffectsRuntime } from './EffectsRuntime';
export declare type EffectTaskWorker = (onDone: TaskOnDone, effect: Effect, effectsRuntime: EffectsRuntime) => {
    cancel?: TaskOnCancel;
};
