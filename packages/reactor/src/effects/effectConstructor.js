export default function effectConstructor(type) {
  return function (payload) {
    return { type, payload }
  }
}
