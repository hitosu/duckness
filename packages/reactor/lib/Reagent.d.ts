export declare type TReagentType = string | symbol;
export interface TReagent {
    type: TReagentType;
    payload: any;
    [key: string]: any;
}
export interface TReagentConstructor {
    (payload: any): TReagent;
    readonly reagentType: TReagentType;
}
export declare type TPayloadBuilder = (payload: any) => any;
export declare type TReagentTransformer = (reagent: TReagent) => TReagent;
export default function Reagent(type: TReagentType, payloadBuilder: TPayloadBuilder, reagentTransformer: TReagentTransformer): TReagentConstructor;
