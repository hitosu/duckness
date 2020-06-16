import takeEffect from './effects/take'
import putEffect from './effects/put'

export default function runReaction(reaction, Reactor, runtime, currentValue) {
  if (!reaction.isRunning) {
    reaction.iterator = reaction.generator()
    reaction.isRunning = true
  }
  const nextStep = reaction.iterator.next(currentValue)
  if (!nextStep.done) {
    const { value: effect } = nextStep
    if ('object' === typeof effect && effect.type) {
      switch (effect.type) {
        case 'take': {
          takeEffect(
            effect,
            payload => {
              runReaction(reaction, Reactor, runtime, payload)
            },
            Reactor
          )
          break
        }
        case 'put': {
          putEffect(
            effect,
            payload => {
              runReaction(reaction, Reactor, runtime, payload)
            },
            Reactor
          )
          break
        }
        default: {
          runReaction(reaction, Reactor, runtime, void 0)
        }
      }
    } else {
      runReaction(reaction, Reactor, runtime, void 0)
    }
  }
}
