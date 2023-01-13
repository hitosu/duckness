import * as React from 'react';
import { Store, Action } from 'redux';
export type TSelectedState = any;
export type TStoreState = any;
export interface ISelector {
    (...sources: any[]): any;
}
export type TActionCreator = (payload: any) => Action;
export type TPayloadTransformer = ((Action: any) => Action) | any;
export type TDispatcher = (dispatch: Store['dispatch'], ...args: any[]) => void;
export type TShouldUpdate = boolean | ((nextSelectedState: TSelectedState, prevSelectedState: TSelectedState, storePrevSelectedState?: (prevSelectedState: TSelectedState) => void) => boolean);
export type TShouldSelect = (nextStoreState: TStoreState, prevStoreState: TStoreState) => boolean;
export default function useRedux(store: Store, selector: ISelector, shouldUpdate: TShouldUpdate, shouldSelect: TShouldSelect): any;
export declare function useDispatchAction(store: Store, actionCreator: TActionCreator, payloadTransformer?: TPayloadTransformer): (payload: any) => Action<any>;
export declare function useDispatch(store: Store, dispatcher: TDispatcher, deps?: any[]): (...args: any[]) => void;
export declare function combineSelectors(selectorsMap: {
    [key: string]: ISelector;
}, { selectedStatesEqual }?: {
    selectedStatesEqual?: (selectorKey: string, nextSelectedState: TSelectedState, prevSelectedState: TSelectedState) => boolean;
}): {
    selector: ISelector;
    shouldUpdate: Exclude<TShouldUpdate, boolean>;
    areEqual: (nextSelectedState: TSelectedState, prevSelectedState: TSelectedState) => boolean;
};
export declare function connect(store: Store, selector: ISelector, shouldUpdate: TShouldUpdate, shouldSelect: TShouldSelect, dispatch?: import("redux").Dispatch<import("redux").AnyAction>): (Component: React.ComponentType, mapToProps?: (selected: TSelectedState, props: any, dispatch: import("redux").Dispatch<import("redux").AnyAction>) => any) => {
    (props: any): JSX.Element;
    displayName: string;
};
