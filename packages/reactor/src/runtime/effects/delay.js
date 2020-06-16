export default function delayEffect(effect, onComplete, _Reactor) {
  const { payload: delayMs } = effect
  setTimeout(() => {
    onComplete()
  }, delayMs)
}
