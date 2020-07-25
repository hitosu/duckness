import type { EffectTaskWorker } from '../EffectTaskWorker'

const delayEffect: EffectTaskWorker = function (onDone, effect, _effectsRuntime) {
  const delayTime = effect.payload

  let timerID = setTimeout(() => {
    onDone()
  }, delayTime)

  return {
    cancel() {
      if (null != timerID) {
        clearTimeout(timerID)
        timerID = null
        return true
      } else {
        return false
      }
    }
  }
}

export default delayEffect
