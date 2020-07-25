import type { TEffectTaskWorker } from './EffectTaskWorker'

const putEffect: TEffectTaskWorker = function (onDone, _effect, _effectsRuntime) {
  onDone({})
  return {}
}

export default putEffect
