export default function takeEffect(effect, onComplete, Reactor) {
  const { payload: reagentType } = effect
  Reactor.take(reagentType, reagent => {
    onComplete(reagent)
  })
}
