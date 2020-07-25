import type { Reagent } from '../../Reagent'
import type { ReactorRuntime, CancelReagentListener, Reaction } from '../ReactorRuntime'
import type { TaskManager } from './TaskManager'
import type { EffectsRuntime } from './EffectsRuntime'
import type { SpawnedReaction } from './ReactionRuntime'

import buildTaskManager from './TaskManager'
import { buildEffectsRuntime } from './EffectsRuntime'

export default function LocalRuntime(): ReactorRuntime {
  const state: {
    reactions: Set<Reaction>,
    taskManager: TaskManager,
    spawnedReactions: Set<SpawnedReaction>
  } = {
    reactions: new Set(),
    taskManager: buildTaskManager(),
    spawnedReactions: new Set()
  }

  const effectsRuntime: EffectsRuntime = buildEffectsRuntime(state)

  const runtime: ReactorRuntime = {
    put(reagent: Reagent) {
      effectsRuntime.put(reagent)
    },
    addReaction(reaction: Reaction) {
      state.reactions.add(reaction)
    },
    takeEvery(reagentTypes, listener) {
      const unsubscribes: Array<CancelReagentListener> = (Array.isArray(reagentTypes)
        ? reagentTypes
        : [reagentTypes]
      ).map(reagentType => effectsRuntime.takeEvery(reagentType, listener))
      return () => {
        unsubscribes.forEach(unsubscribe => unsubscribe())
        unsubscribes.splice(0, unsubscribes.length)
      }
    },
    run(...args: any[]) {
      if (!runtime.isRunning()) {
        state.taskManager.pauseQueue()
        state.reactions.forEach(reaction => {
          effectsRuntime.spawnReaction(reaction, ...args)
        })
        state.taskManager.resumeQueue()
        state.taskManager.runQueue()
        return true
      } else {
        return false
      }
    },
    stop(stopValue: any) {
      if (runtime.isRunning()) {
        state.taskManager.cancelAll(stopValue)
        return true
      } else {
        return false
      }
    },
    isRunning() {
      return 0 < state.spawnedReactions.size
    }
  }
  return Object.freeze(runtime)
}
