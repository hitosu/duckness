import type { EffectTaskWorker } from '../EffectTaskWorker'
import type { ReagentType } from '../../../Reagent'
import type { Reaction } from '../../ReactorRuntime'

import spawnReaction from '../ReactionRuntime'

const takeEveryEffect: EffectTaskWorker = function (onDone, effect, effectsRuntime) {
  const reagentTypesToTake: Array<ReagentType> = Array.isArray(effect.payload) ? effect.payload : [effect.payload]
  const reaction: Reaction = effect.args[0]
  const reactionArgs: any[] = effect.args.slice(1)

  const unsubscribes: Array<() => void> = reagentTypesToTake.map(reagentType =>
    effectsRuntime.takeEvery(reagentType, reagent => {
      spawnReaction(reaction, [...reactionArgs, reagent], null, effectsRuntime)
    })
  )

  return {
    cancel() {
      if (unsubscribes.length) {
        unsubscribes.forEach(unsubscribe => unsubscribe())
        onDone()
        return true
      } else {
        return false
      }
    }
  }
}

export default takeEveryEffect
