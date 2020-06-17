export default function stopReaction(reaction) {
  reaction.isRunning = false
  if (null != reaction.iterator) {
    reaction.iterator.return()
  }
  reaction.iterator = null
}
