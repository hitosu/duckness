import type { ReactionGenerator } from '../../ReactorRuntime'
import type { TaskID, TaskManager } from '../TaskManager'
import type { Effect } from '../../../effects/Effect'
import type { Reagent, ReagentType } from '../../../Reagent'

import { spawn as spawnEffect } from '../../../effects'
import spawn from './spawn'

export type ReagentListener = (reagent: Reagent) => void
export interface EffectsRuntime {
  spawn: (reactionGenerator: ReactionGenerator, ...args: any[]) => void;
  put: (reagent: Reagent) => void;
  takeEvery: (reagentType: ReagentType, listener: ReagentListener) => () => void;
  take: (reagentType: ReagentType, listener: ReagentListener) => () => void;
}

export function buildEffectsRuntime(reactorState: {
  taskManager: TaskManager,
  spawnedReactionIDs: Set<TaskID>
}): EffectsRuntime {
  const reagentListeners: Map<ReagentType, Set<ReagentListener>> = new Map()

  const effectsRuntime: EffectsRuntime = {
    spawn(reactionGenerator, ...args) {
      const effect: Effect = spawnEffect(reactionGenerator, ...args)
      const spawnedTaskID: TaskID = reactorState.taskManager.add(
        spawn,
        () => {
          reactorState.spawnedReactionIDs.delete(spawnedTaskID)
        },
        effect,
        effectsRuntime
      )
      reactorState.spawnedReactionIDs.add(spawnedTaskID)
      reactorState.taskManager.runQueue()
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
