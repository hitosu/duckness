/* eslint-disable no-console */

import type { TReagent } from '../../Reagent'
import type { TReactorRuntime, TReactionGenerator } from '../ReactorRuntime'
import type { TTaskManager, TTaskID } from './TaskManager'
import type { TEffectsRuntime } from './effects/EffectsRuntime'

import TaskManager from './TaskManager'
import { buildEffectsRuntime } from './effects/EffectsRuntime'

export default function LocalRuntime(): TReactorRuntime {
  const state: {
    reactions: Set<TReactionGenerator>,
    taskManager: TTaskManager,
    spawnedReactionIDs: Set<TTaskID>
  } = {
    reactions: new Set(),
    taskManager: TaskManager(),
    spawnedReactionIDs: new Set()
  }

  const effectsRuntime: TEffectsRuntime = buildEffectsRuntime(state)

  const runtime = {
    put(reagent: TReagent) {
      effectsRuntime.put(reagent)
    },
    addReaction(reactionGenerator: TReactionGenerator) {
      state.reactions.add(reactionGenerator)
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
