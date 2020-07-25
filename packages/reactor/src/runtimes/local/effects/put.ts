import type { EffectTaskWorker } from './EffectTaskWorker'

const putEffect: EffectTaskWorker = function (onDone, _effect, _effectsRuntime) {
  onDone({})
  return {}
}

export default putEffect
