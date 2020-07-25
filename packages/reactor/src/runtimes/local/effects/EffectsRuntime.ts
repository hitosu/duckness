import type { TReactionGenerator } from '../../ReactorRuntime'
import type { TTaskID, TTaskManager } from '../TaskManager'
import type { TEffect } from '../../../effects/Effect'
import type { TReagent, TReagentType } from '../../../Reagent'

import { spawn as spawnEffect } from '../../../effects'
import spawn from './spawn'

export type TReagentListener = (reagent: TReagent) => void
export interface TEffectsRuntime {
  spawn: (reactionGenerator: TReactionGenerator, ...args: any[]) => void;
  put: (reagent: TReagent) => void;
  takeEvery: (reagentType: TReagentType, listener: TReagentListener) => () => void;
  take: (reagentType: TReagentType, listener: TReagentListener) => () => void;
}

export function buildEffectsRuntime(reactorState: {
  taskManager: TTaskManager,
  spawnedReactionIDs: Set<TTaskID>
}): TEffectsRuntime {
  const reagentListeners: Map<TReagentType, Set<TReagentListener>> = new Map()

  const effectsRuntime: TEffectsRuntime = {
    spawn(reactionGenerator, ...args) {
      const effect: TEffect = spawnEffect(reactionGenerator, ...args)
      const spawnedTaskID: TTaskID = reactorState.taskManager.add(
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
        const listeners: Set<TReagentListener> = new Set()
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
