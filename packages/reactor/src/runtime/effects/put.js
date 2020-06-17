export default function putEffect(effect, onComplete, Reactor) {
  const { payload: reagent } = effect
  Reactor.put(reagent)
  onComplete(reagent)
}
