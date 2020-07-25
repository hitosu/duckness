export type TReagentType = string | symbol
export interface TReagent {
  type: TReagentType;
  payload: any;
  [key: string]: any;
}
export interface TReagentConstructor {
  (payload: any): TReagent;
  readonly reagentType: TReagentType;
}
export type TPayloadBuilder = (payload: any) => any
export type TReagentTransformer = (reagent: TReagent) => TReagent

export default function Reagent(
  type: TReagentType,
  payloadBuilder: TPayloadBuilder,
  reagentTransformer: TReagentTransformer
): TReagentConstructor {
  const reagentConstructor: TReagentConstructor = <TReagentConstructor> function reagentConstructor(payload: any) {
    const reagent: TReagent = {
      type: type,
      payload: payloadBuilder ? payloadBuilder(payload) : payload
    }
    return reagentTransformer ? reagentTransformer(reagent) : reagent
  }
  Object.defineProperty(reagentConstructor, 'reagentType', {
    get() {
      return type
    },
    enumerable: true
  })
  return reagentConstructor
}
