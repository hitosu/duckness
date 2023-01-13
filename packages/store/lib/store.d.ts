/// <reference types="react" />
export type TState = any;
export type TValue = any;
export interface ISelector {
    (...sources: any[]): any;
}
export interface IUpdater {
    (currentState: TState): TState;
}
export interface IListener {
    (value: TValue): void;
    selector?: (storeState: TState) => TValue;
    shouldUpdate?: (nextValue: TValue, prevValue: TValue) => boolean;
    shouldSelect?: (nextStoreState: TState, prevStoreState: TState) => boolean;
    prevValue?: TValue;
}
export type TUseStoreArgs = {
    updateOnMount?: IUpdater;
    updateOnUnmount?: IUpdater;
    selector?: IListener['selector'];
    shouldSelect?: IListener['shouldSelect'];
    shouldUpdate?: IListener['shouldUpdate'];
    debounce?: number;
};
export type TAction = (...args: any[]) => TState;
export declare function selectAll(value: TValue): any;
export declare function always(): boolean;
export declare function whenChanged(a: TValue, b: TValue): boolean;
export default function createStore({ initState, actions }?: {
    initState?: TState;
    actions?: {
        [actionName: string]: TAction;
    };
}): Readonly<{
    useStore: ({ updateOnMount, updateOnUnmount, selector, shouldSelect, shouldUpdate, debounce }?: TUseStoreArgs) => any;
    Consumer: (props: TUseStoreArgs & {
        children: (value: TValue) => React.ReactNode;
    }) => import("react").ReactNode;
    actions: {
        [actionName: string]: TAction;
    };
    updateStore: (updater: IUpdater) => any;
    getState: (selector: ISelector) => any;
    subscribe: (listener: IListener) => () => void;
    destroy: () => void;
}>;
