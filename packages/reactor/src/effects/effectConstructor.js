export default function effectConstructor(type) {
  return function (payload, ...args) {
    return { type, payload, args }
  }
}
