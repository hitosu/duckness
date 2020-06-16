export default function stopReaction(reaction, _Reactor, _runtime) {
  reaction.isRunning = false
  if (null != reaction.iterator) {
    reaction.iterator.return()
  }
  reaction.iterator = null
}
