import type { EffectTaskWorker } from './EffectTaskWorker'

const delayEffect: EffectTaskWorker = function (onDone, _effect, _effectsRuntime) {
  onDone({})
  return {}
}

export default delayEffect
