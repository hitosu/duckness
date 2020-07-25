import type { TEffectTaskWorker } from './EffectTaskWorker'
import { TReagentType } from '../../../Reagent'

const takeEffect: TEffectTaskWorker = function (onDone, effect, effectsRuntime) {
  const reagentTypesToTake: Array<TReagentType> = [effect.payload, ...effect.args]

  const unsubscribes: Array<() => void> = reagentTypesToTake.map(reagentType =>
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
        return true
      } else {
        return false
      }
    }
  }
}

export default takeEffect
