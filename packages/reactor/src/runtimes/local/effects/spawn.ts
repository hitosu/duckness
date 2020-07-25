import type { TEffectTaskWorker } from './EffectTaskWorker'
import type { TEffect, TEffectType } from '../../../effects/Effect'

export type TReactionInstruction = TEffect
export type TReactionGenerator = Generator<TReactionInstruction>
export type TReaction = (...args: any[]) => TReactionGenerator

const spawnEffect: TEffectTaskWorker = function (
  onDone,
  effect: { type: TEffectType, payload: TReaction, args?: any[] },
  _effectsRuntime
) {
  const reactionGenerator: TReactionGenerator = effect.payload(effect.args)

  function advanceReaction(advanceValue?: any) {
    const currentIteration: IteratorResult<TReactionInstruction> = reactionGenerator.next(advanceValue)
    if (currentIteration.done) {
      onDone()
    } else {
      const currentInstruction: TReactionInstruction = currentIteration.value
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
