import type { EffectTaskWorker } from './EffectTaskWorker'
import type { EffectType } from '../../../effects/Effect'
import type { Reaction, ReactionGenerator, ReactionInstruction } from '../../ReactorRuntime'
import type { TaskID } from '../TaskManager'

import effects from '../effects'

const spawnEffect: EffectTaskWorker = function (
  onDone,
  effect: { type: EffectType, payload: Reaction, args?: any[] },
  effectsRuntime
) {
  let done = false
  let curentInstructionTaskID: TaskID | null = null
  const reactionGenerator: ReactionGenerator = effect.payload(effect.args)

  function advanceReaction(advanceValue?: any) {
    const currentIteration: IteratorResult<ReactionInstruction> = reactionGenerator.next(advanceValue)
    if (currentIteration.done) {
      done = true
      onDone()
    } else {
      const currentInstruction: ReactionInstruction = currentIteration.value
      if ('object' === typeof currentInstruction && currentInstruction.type) {
        if ('spawn' === currentInstruction.type) {
          effectsRuntime.spawn(currentInstruction.payload, ...currentInstruction.args)
        } else if (effects[currentInstruction.type]) {
          curentInstructionTaskID = effectsRuntime.addTask(
            effects[currentInstruction.type],
            (advanceValue: any) => {
              advanceReaction(advanceValue)
            },
            currentInstruction,
            effectsRuntime
          )
          effectsRuntime.runTasksQueue()
        }
      }
    }
  }

  advanceReaction()

  return {
    cancel(cancelValue?: any) {
      if (done) {
        return false
      } else {
        if (null != curentInstructionTaskID) {
          effectsRuntime.cancelTask(curentInstructionTaskID, cancelValue)
          curentInstructionTaskID = null
        }
        reactionGenerator.return(cancelValue)
        done = true
        return true
      }
    }
  }
}

export default spawnEffect
