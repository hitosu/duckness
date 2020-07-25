import type { EffectTaskWorker } from '../EffectTaskWorker'
import type { EffectType } from '../../../effects/Effect'
import type { Reaction } from '../../ReactorRuntime'

import spawnReaction from '../ReactionRuntime'

const spawnEffect: EffectTaskWorker = function (
  onDone,
  effect: { type: EffectType, payload: Reaction, args?: any[] },
  effectsRuntime
) {
  const spawnedReaction = spawnReaction(effect.payload, effect.args, null, effectsRuntime)
  onDone()
  return {
    cancel: spawnedReaction.cancel
  }
}

export default spawnEffect
