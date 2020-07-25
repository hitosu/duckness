import type { EffectTaskWorker } from '../EffectTaskWorker'
import type { ReagentType } from '../../../Reagent'
import type { CancelReagentListener } from '../../ReactorRuntime'

const takeEffect: EffectTaskWorker = function (onDone, effect, effectsRuntime) {
  const reagentTypesToTake: Array<ReagentType> = Array.isArray(effect.payload) ? effect.payload : [effect.payload]

  const unsubscribes: Array<CancelReagentListener> = reagentTypesToTake.map(reagentType =>
    effectsRuntime.takeEvery(reagentType, reagent => {
      unsubscribes.forEach(unsubscribe => unsubscribe())
      unsubscribes.splice(0, unsubscribes.length)
      onDone(reagent)
    })
  )

  return {
    cancel() {
      if (unsubscribes.length) {
        unsubscribes.forEach(unsubscribe => unsubscribe())
        unsubscribes.splice(0, unsubscribes.length)
        // TODO: reject
        return true
      } else {
        return false
      }
    }
  }
}

export default takeEffect
