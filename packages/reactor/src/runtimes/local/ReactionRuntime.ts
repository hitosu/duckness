import type { Reaction, ReactionGenerator, ReactionInstruction } from '../ReactorRuntime'
import type { EffectsRuntime } from './EffectsRuntime'
import type { TaskID, TaskOnDone, TaskOnCancel } from './TaskManager'

import effects from './effects'
import { isEffect } from '../../effects/Effect'

export interface SpawnedReaction {
  cancel: TaskOnCancel;
  curentInstructionTaskID: () => TaskID | null;
}

export default function spawnReaction(
  reaction: Reaction,
  reactionArgs: any[],
  onDone: TaskOnDone | null,
  effectsRuntime: EffectsRuntime
): SpawnedReaction {
  const state: {
    done: boolean,
    curentInstructionTaskID: TaskID | null
  } = {
    done: false,
    curentInstructionTaskID: null
  }

  const reactionGenerator: ReactionGenerator = reaction(...reactionArgs)

  function advanceReaction(advanceValue?: any) {
    const currentIteration: IteratorResult<ReactionInstruction> = reactionGenerator.next(advanceValue)
    if (currentIteration.done) {
      state.done = true
      if (onDone) {
        onDone(currentIteration.value)
      }
    } else {
      const currentInstruction: ReactionInstruction = currentIteration.value
      if (isEffect(currentInstruction)) {
        if (effects[currentInstruction.type]) {
          state.curentInstructionTaskID = effectsRuntime.addTask(
            effects[currentInstruction.type],
            (advanceValue: any) => {
              advanceReaction(advanceValue)
            },
            currentInstruction,
            effectsRuntime
          )
          effectsRuntime.runTasksQueue()
        }
      } else {
        Promise.resolve(currentInstruction).then(value => advanceReaction(value))
      }
    }
  }

  advanceReaction()

  return {
    cancel(cancelValue?: any) {
      if (state.done) {
        return false
      } else {
        if (null != state.curentInstructionTaskID) {
          effectsRuntime.cancelTask(state.curentInstructionTaskID, cancelValue)
          state.curentInstructionTaskID = null
        }
        reactionGenerator.return(cancelValue)
        state.done = true
        return true
      }
    },
    curentInstructionTaskID() {
      return state.curentInstructionTaskID
    }
  }
}
