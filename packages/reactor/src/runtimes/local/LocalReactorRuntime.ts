import type { Reagent } from '../../Reagent'
import type { ReactorRuntime, ReactionGenerator, CancelReagentListener } from '../ReactorRuntime'
import type { TaskManager, TaskID } from './TaskManager'
import type { EffectsRuntime } from './effects/EffectsRuntime'

import buildTaskManager from './TaskManager'
import { buildEffectsRuntime } from './effects/EffectsRuntime'

export default function LocalRuntime(): ReactorRuntime {
  const state: {
    reactions: Set<ReactionGenerator>,
    taskManager: TaskManager,
    spawnedReactionIDs: Set<TaskID>
  } = {
    reactions: new Set(),
    taskManager: buildTaskManager(),
    spawnedReactionIDs: new Set()
  }

  const effectsRuntime: EffectsRuntime = buildEffectsRuntime(state)

  const runtime: ReactorRuntime = {
    put(reagent: Reagent) {
      effectsRuntime.put(reagent)
    },
    addReaction(reactionGenerator: ReactionGenerator) {
      state.reactions.add(reactionGenerator)
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
        state.reactions.forEach(reactionGenerator => {
          effectsRuntime.spawn(reactionGenerator, ...args)
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
      return 0 < state.spawnedReactionIDs.size
    }
  }
  return Object.freeze(runtime)
}
