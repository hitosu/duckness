import type { ReagentListener, CancelReagentListener, Reaction } from '../ReactorRuntime'
import type { TaskID, TaskManager, TaskOnDone } from './TaskManager'
import type { Reagent, ReagentType } from '../../Reagent'
import type { EffectTaskWorker } from './EffectTaskWorker'

import spawnReaction, { SpawnedReaction } from './ReactionRuntime'

export interface EffectsRuntime {
  addTask(worker: EffectTaskWorker, onDone: TaskOnDone, ...workerArgs: any[]): TaskID;
  cancelTask(id: TaskID, cancelValue?: any): boolean;
  runTasksQueue(resume?: boolean): void;
  spawnReaction: (reaction: Reaction, ...args: any[]) => SpawnedReaction;
  put: (reagent: Reagent) => void;
  takeEvery: (reagentType: ReagentType, listener: ReagentListener) => CancelReagentListener;
  take: (reagentType: ReagentType, listener: ReagentListener) => CancelReagentListener;
}

export function buildEffectsRuntime(reactorState: {
  taskManager: TaskManager,
  spawnedReactions: Set<SpawnedReaction>
}): EffectsRuntime {
  const reagentListeners: Map<ReagentType, Set<ReagentListener>> = new Map()

  const effectsRuntime: EffectsRuntime = {
    addTask(worker, onDone, ...workerArgs) {
      return reactorState.taskManager.add(worker, onDone, ...workerArgs)
    },
    cancelTask(id: TaskID, cancelValue?: any) {
      return reactorState.taskManager.cancel(id, cancelValue)
    },
    runTasksQueue(resume) {
      reactorState.taskManager.runQueue(resume)
    },
    spawnReaction(reaction, ...args) {
      const spawnedReaction: SpawnedReaction = spawnReaction(
        reaction,
        args,
        () => {
          reactorState.spawnedReactions.delete(spawnedReaction)
        },
        effectsRuntime
      )
      reactorState.spawnedReactions.add(spawnedReaction)
      reactorState.taskManager.runQueue()
      return spawnedReaction
    },
    put(reagent) {
      if (reagentListeners.has(reagent.type)) {
        reagentListeners.get(reagent.type).forEach(listener => {
          listener(reagent)
        })
      }
    },
    takeEvery(reagentType, listener) {
      if (reagentListeners.has(reagentType)) {
        const listeners = reagentListeners.get(reagentType)
        listeners.add(listener)
      } else {
        const listeners: Set<ReagentListener> = new Set()
        listeners.add(listener)
        reagentListeners.set(reagentType, listeners)
      }
      // unsubscribe
      return () => {
        if (reagentListeners.has(reagentType)) {
          const listeners = reagentListeners.get(reagentType)
          listeners.delete(listener)
          if (0 == listeners.size) {
            reagentListeners.delete(reagentType)
          }
        }
      }
    },
    take(reagentType, listener) {
      const stopTaking = effectsRuntime.takeEvery(reagentType, reagent => {
        stopTaking()
        listener(reagent)
      })
      return stopTaking
    }
  }
  return effectsRuntime
}
