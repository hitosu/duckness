export default function Reaction(reactionGenerator) {
  return {
    isRunning: false,
    generator: reactionGenerator,
    iterator: null
  }
}
