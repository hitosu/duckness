/// <reference types="react" />
export type TState = unknown;
export type TValue = unknown;
export interface ISelector {
    (...sources: unknown[]): unknown;
}
export interface IUpdater {
    (currentState: TState): TState;
}
export interface IListener {
    (value: TValue): void;
    selector?: (storeState: TState) => TValue;
    shouldUpdate?: (nextValue: TValue, prevValue: TValue) => boolean;
    shouldSelect?: (nextStoreState: TState, prevStoreState: TState) => boolean;
    async?: boolean;
    prevValue?: TValue;
}
export type TUseStoreArgs = {
    updateOnMount?: IUpdater;
    updateOnUnmount?: IUpdater;
    selector?: IListener['selector'];
    shouldSelect?: IListener['shouldSelect'];
    shouldUpdate?: IListener['shouldUpdate'];
    debounce?: number;
    async?: boolean;
};
export type TAction = (...args: unknown[]) => TState;
export declare function selectAll(value: TValue): unknown;
export declare function always(): boolean;
export declare function whenChanged(a: TValue, b: TValue): boolean;
export default function createStore({ initState, actions }?: {
    initState?: TState;
    actions?: {
        [actionName: string]: TAction;
    };
}): Readonly<{
    useStore: ({ updateOnMount, updateOnUnmount, selector, shouldSelect, shouldUpdate, async, debounce }?: TUseStoreArgs) => unknown;
    Consumer: (props: TUseStoreArgs & {
        children: (value: TValue) => React.ReactNode;
    }) => import("react").ReactNode;
    actions: {
        [actionName: string]: TAction;
    };
    updateStore: (updater: IUpdater) => unknown;
    getState: (selector: ISelector) => unknown;
    subscribe: (listener: IListener) => () => void;
    destroy: () => void;
}>;
