import type { TEffectTaskWorker } from './EffectTaskWorker'

const callEffect: TEffectTaskWorker = function (onDone, _effect, _effectsRuntime) {
  onDone({})
  return {}
}

export default callEffect
