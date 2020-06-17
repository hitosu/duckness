import Reaction from '../../Reaction'

export default function callEffect(effect, onComplete, Reactor, runReaction) {
  const { payload: generator, args } = effect
  const reaction = Reaction(generator)
  reaction.iterator = reaction.generator(...args)
  reaction.isRunning = true
  runReaction(reaction, Reactor, void 0, onComplete)
}
