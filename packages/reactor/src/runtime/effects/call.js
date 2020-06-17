import Reaction from '../../Reaction'

export default function callEffect(effect, onComplete, Reactor) {
  const { payload: generator, args } = effect
  const reaction = Reaction(generator)
  reaction.run(...args)
  Reactor.runReaction(reaction, void 0, onComplete)
}
