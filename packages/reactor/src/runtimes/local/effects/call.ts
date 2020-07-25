import type { EffectTaskWorker } from './EffectTaskWorker'

const callEffect: EffectTaskWorker = function (onDone, _effect, _effectsRuntime) {
  onDone({})
  return {}
}

export default callEffect
