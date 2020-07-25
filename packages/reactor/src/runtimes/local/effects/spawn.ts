import type { EffectTaskWorker } from './EffectTaskWorker'
import type { EffectType } from '../../../effects/Effect'
import type { Reaction, ReactionGenerator, ReactionInstruction } from '../../ReactorRuntime'

const spawnEffect: EffectTaskWorker = function (
  onDone,
  effect: { type: EffectType, payload: Reaction, args?: any[] },
  _effectsRuntime
) {
  const reactionGenerator: ReactionGenerator = effect.payload(effect.args)

  function advanceReaction(advanceValue?: any) {
    const currentIteration: IteratorResult<ReactionInstruction> = reactionGenerator.next(advanceValue)
    if (currentIteration.done) {
      onDone()
    } else {
      const currentInstruction: ReactionInstruction = currentIteration.value
      console.log('currentInstruction', currentInstruction)
      advanceReaction({})
    }
  }

  advanceReaction()

  return {
    cancel() {
      return true
    }
  }
}

export default spawnEffect
