export default function Reagent(type, payloadBuilder, reagentTransformer) {
  return function reagentConstructor(payload) {
    const reagent = {
      type: type,
      payload: payloadBuilder ? payloadBuilder(payload) : payload
    }
    return reagentTransformer ? reagentTransformer(reagent) : reagent
  }
}
