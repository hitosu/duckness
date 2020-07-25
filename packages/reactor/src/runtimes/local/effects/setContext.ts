import type { EffectTaskWorker } from '../EffectTaskWorker'

const setContextEffect: EffectTaskWorker = function (onDone, effect, effectsRuntime) {
  const context = effect.payload || {}
  effectsRuntime.setContext(context)
  onDone()
  return {}
}

export default setContextEffect
