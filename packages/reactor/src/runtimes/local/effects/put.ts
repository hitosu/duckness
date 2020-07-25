import type { EffectTaskWorker } from '../EffectTaskWorker'

const putEffect: EffectTaskWorker = function (onDone, effect, effectsRuntime) {
  const { payload: reagent } = effect
  effectsRuntime.put(reagent)
  onDone(reagent)
  return {}
}

export default putEffect
