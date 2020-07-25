import type { EffectTaskWorker } from '../EffectTaskWorker'

const getContextEffect: EffectTaskWorker = function (onDone, effect, effectsRuntime) {
  const keys = Array.isArray(effect.payload) ? effect.payload : [effect.payload]
  onDone(effectsRuntime.getContext(...keys))
  return {}
}

export default getContextEffect
