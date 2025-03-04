/// <reference types="react" />
export type TState<S = {}> = S;
export type TSelectedValue<R = unknown> = R | null | undefined;
export interface ISelector<S, R> {
    (source: TState<S>): TSelectedValue<R>;
    (...sources: unknown[]): TSelectedValue<R>;
}
export interface IUpdater<S> {
    (currentState: TState<S>): TState<S>;
}
export interface IListener<S = unknown, R = unknown> {
    (value: TSelectedValue<R>): void;
    selector?: (storeState: TState<S>) => TSelectedValue<R>;
    shouldUpdate?: (nextValue: TSelectedValue<R>, prevValue: TSelectedValue<R>) => boolean;
    shouldSelect?: (nextStoreState: TState<S>, prevStoreState: TState<S>) => boolean;
    prevValue?: TSelectedValue<R>;
}
export interface TUseStoreArgs<S = unknown, R = unknown> {
    updateOnMount?: IUpdater<S>;
    updateOnUnmount?: IUpdater<S>;
    selector?: IListener<S, R>['selector'];
    shouldSelect?: IListener<S>['shouldSelect'];
    shouldUpdate?: IListener<S, R>['shouldUpdate'];
    debounce?: number;
}
export interface TAction<S = unknown> {
    (state: TState<S>): TState<S>;
    (...args: unknown[]): TState<S>;
}
export type CreateStoreArguments<S = unknown> = {
    initState?: TState<S>;
    actions?: Record<string, TAction<S>>;
    isAsync?: boolean;
};
export type CreateStoreReturnType<S = unknown> = Readonly<{
    useStore: <R>({ updateOnMount, updateOnUnmount, selector, shouldSelect, shouldUpdate, debounce }?: TUseStoreArgs<S, R>) => R;
    Consumer: (props: TUseStoreArgs & {
        children: (value: TSelectedValue) => React.ReactNode;
    }) => React.ReactNode;
    actions: {
        [actionName: string]: TAction;
    };
    updateStore: (updater: IUpdater<S>) => TState<S>;
    getState: {
        (): TState<S>;
        <R = unknown>(selector: ISelector<S, R>): TSelectedValue<R>;
    };
    subscribe: (listener: IListener) => () => void;
    destroy: () => void;
}>;
export declare function selectAll(value: TSelectedValue): unknown;
export declare function always(): boolean;
export declare function whenChanged(a: TSelectedValue, b: TSelectedValue): boolean;
export default function createStore<S>({ initState, actions, isAsync }?: CreateStoreArguments<S>): CreateStoreReturnType<S>;
