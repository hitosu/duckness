import type { TEffectTaskWorker } from './EffectTaskWorker'

const delayEffect: TEffectTaskWorker = function (onDone, _effect, _effectsRuntime) {
  onDone({})
  return {}
}

export default delayEffect
