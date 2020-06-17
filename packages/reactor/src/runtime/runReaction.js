import effects from './effects'

export default function runReaction(reaction, Reactor, currentValue, onDone) {
  if (!reaction.isRunning) {
    reaction.iterator = reaction.generator()
    reaction.isRunning = true
  }
  const nextStep = reaction.iterator.next(currentValue)
  if (nextStep.done) {
    if (onDone) {
      onDone(nextStep.value)
    }
  } else {
    const { value: effect } = nextStep
    if ('object' === typeof effect && effect.type) {
      if (effects[effect.type]) {
        effects[effect.type](
          effect,
          payload => {
            runReaction(reaction, Reactor, payload, onDone)
          },
          Reactor,
          runReaction
        )
      } else {
        runReaction(reaction, Reactor, void 0, onDone)
      }
    } else {
      runReaction(reaction, Reactor, void 0, onDone)
    }
  }
}
