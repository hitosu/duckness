import type { EffectTaskWorker } from './EffectTaskWorker'
import { ReagentType } from '../../../Reagent'

//TODO: implement through call

const takeEveryEffect: EffectTaskWorker = function (onDone, effect, effectsRuntime) {
  const reagentTypesToTake: Array<ReagentType> = [effect.payload, ...effect.args]

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

export default takeEveryEffect
