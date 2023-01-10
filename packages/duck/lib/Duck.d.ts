export type TState = any;
export type TActionType = string;
export type TFullActionType = string;
export type TActionPayload = any;
export interface IAction {
    type: TActionType;
    payload: TActionPayload;
    error: boolean;
}
export interface IPayloadBuilder {
    (payload: TActionPayload, duckFace: IDuckFace): TActionPayload;
}
export interface IActionTransformer {
    (action: IAction, duckFace: IDuckFace): IAction;
}
type TActionTypesMap = {
    [actionType: TActionType]: TFullActionType;
};
export interface ISelector {
    (...sources: any[]): any;
}
export interface IDuckedSelector {
    (...args: [...any[], IDuckFace]): any;
    readonly originalSelector: ISelector;
    readonly selectorName: string;
}
interface IBuildSelector {
    (selectorName: string | null, selector: ISelector): IDuckedSelector;
}
interface ISelectors {
    [selectorName: string]: IDuckedSelector;
}
export interface IActionConstructor {
    (payload: TActionPayload): IAction;
    readonly actionType: TFullActionType;
    readonly duckActionType: TActionType;
    readonly payloadBuilder: IPayloadBuilder;
    readonly actionTransformer: IActionTransformer;
    readonly actionName?: string;
}
interface IBuildActionConstructor {
    (actionNameOrType: string | TActionType | null, forActionType?: TActionType | null, payloadBuilder?: IPayloadBuilder, actionTransformer?: IActionTransformer): IActionConstructor;
    [actionName: string]: IActionConstructor;
}
type TMatchActionType = TActionType | ((action: IAction, duckFace: IDuckFace) => boolean) | null;
interface IAddReducer {
    (actionType: TMatchActionType, reducer: IReducer): void;
}
interface ICloneDuck {
    (duckName: string, poolName: string, duckContext: TDuckContext): IDuck;
}
export type TDuckContext = any;
export interface IReducer {
    (state: TState, action: IAction, duckFace?: IDuckFace): TState;
}
export interface IDuck extends IReducer {
    readonly duckFace: IDuckFace;
    readonly duckName: string;
    readonly poolName: string;
    readonly duckContext: any;
    readonly actionTypes: TActionTypesMap;
    readonly mapActionType: (actionType: TActionType) => TFullActionType;
    readonly listActionTypes: () => TActionType[];
    readonly action: IBuildActionConstructor;
    readonly selector: IBuildSelector;
    readonly select: ISelectors;
    readonly reducer: IAddReducer;
    readonly clone: ICloneDuck;
    readonly updateContext: (newDuckContext: TDuckContext) => void;
}
export interface IDuckFace {
    readonly reduce: IDuck;
    readonly duckName: string;
    readonly poolName: string;
    readonly duckContext: TDuckContext;
    readonly actionTypes: TActionTypesMap;
    readonly mapActionType: (actionType: TActionType) => TFullActionType;
    readonly listActionTypes: () => TActionType[];
    readonly action: IBuildActionConstructor;
    readonly select: ISelectors;
}
export default function Duck(duckName: string, poolName: string, duckContext: TDuckContext): IDuck;
export {};
