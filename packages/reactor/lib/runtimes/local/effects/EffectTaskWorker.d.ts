import type { TTaskOnDone, TTaskOnCancel } from '../TaskManager';
import type { TEffect } from '../../../effects/Effect';
import type { TEffectsRuntime } from './EffectsRuntime';
export declare type TEffectTaskWorker = (onDone: TTaskOnDone, effect: TEffect, effectsRuntime: TEffectsRuntime) => {
    cancel?: TTaskOnCancel;
};
