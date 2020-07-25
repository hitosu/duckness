/* eslint-disable no-console */

import type { Reagent } from '../../Reagent'
import type { ReactorRuntime, ReactionGenerator } from '../ReactorRuntime'
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

  const runtime = {
    put(reagent: Reagent) {
      effectsRuntime.put(reagent)
    },
    addReaction(reactionGenerator: ReactionGenerator) {
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
