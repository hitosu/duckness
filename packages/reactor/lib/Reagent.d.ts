export type ReagentType = string | symbol;
export interface Reagent {
    type: ReagentType;
    payload: any;
    [key: string]: any;
}
export interface ReagentConstructor {
    (payload: any): Reagent;
    readonly reagentType: ReagentType;
}
export type ReagentPayloadBuilder = (payload: any) => any;
export type ReagentTransformer = (reagent: Reagent) => Reagent;
export default function Reagent(type: ReagentType, payloadBuilder: ReagentPayloadBuilder, reagentTransformer: ReagentTransformer): ReagentConstructor;
