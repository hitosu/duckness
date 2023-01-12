import { Store, Middleware, Unsubscribe } from 'redux';
import { IDuck, IReducer, IAction, ISelector, TState } from '@duckness/duck';
export { IDuck, IReducer, IAction, ISelector, TState };
export interface IPool {
    readonly addDuck: (duck: IDuck) => void;
    readonly addMiddleware: (middleware: Middleware) => void;
    readonly addStream: (stream: IPoolStream) => void;
    readonly preReducer: (reducer: IReducer) => void;
    readonly postReducer: (reducer: IReducer) => void;
    readonly build: (props: TPoolProps) => Store;
    readonly reportError: IErrorReporter;
    readonly setErrorReporter: (reporter: IErrorReporter) => void;
    readonly store: Store;
    readonly dispatch: IPoolDispatch;
    readonly select: ISelector;
    readonly fetch: (selector?: ISelector, resolver?: (selectedValue: any, resolveValue: (value: any) => void, prevSelectedValue: any) => void) => Promise<any>;
    readonly trigger: (selector?: ISelector, callback?: (selectedValue: any) => void, resolver?: (selectedValue: any, callback: (selectedValue: any) => void, prevSelectedValue: any) => void) => Unsubscribe;
    readonly reduce: IPoolReduce;
    readonly ducks: IDuck[];
    readonly getDuckByName: (duckPath: TDuckPath) => IDuck;
    readonly middlewares: Middleware[];
    readonly streams: IPoolStream[];
    readonly props: TPoolProps;
}
export interface IPoolArgs {
    poolName?: string;
    props?: TPoolProps;
    ducks?: IDuck[];
    middlewares?: Middleware[];
    streams?: IPoolStream[];
    buildStore?: (props: TPoolProps, { refProps, refDucks, refReducers, refErrorReporter }: {
        refProps: TRefProps;
        refDucks: TRefDucks;
        refReducers: TRefReducers;
        refErrorReporter: TRefErrorReporter;
    }) => any;
    buildRootReducer?: (ducks: IDuck[], { refProps, refReducers, refDucks, refErrorReporter }: {
        refProps: TRefProps;
        refReducers: TRefReducers;
        refDucks: TRefDucks;
        refErrorReporter: TRefErrorReporter;
    }) => IReducer;
    connectReduxDevtoolsExtension?: boolean;
}
export type TPoolProps = {
    [key: string]: any;
};
export type TDuckPath = string | [duckPoolName: string, duckName: string];
export interface IPoolDispatch {
    (action: IAction): ReturnType<Store['dispatch']>;
    (duckPath: TDuckPath, actionName: string, payload: any): ReturnType<Store['dispatch']>;
}
export interface IPoolError extends Error {
    poolName?: string;
    actionName?: string;
    duckPath?: TDuckPath;
    dispatchedAction?: IAction;
}
export interface IPoolReduce {
    (action: IAction): TState;
    (state: TState, action: IAction): TState;
}
export interface IPoolStream {
    readonly beforeBuild?: ({ refDucks, refProps, refReducers, refErrorReporter }: {
        refDucks: TRefDucks;
        refProps: TRefProps;
        refReducers: TRefReducers;
        refErrorReporter: TRefErrorReporter;
    }) => void;
    readonly middlewares?: ({ refDucks, refProps, refReducers, refErrorReporter }: {
        refDucks: TRefDucks;
        refProps: TRefProps;
        refReducers: TRefReducers;
        refErrorReporter: TRefErrorReporter;
    }) => Middleware[];
    readonly afterBuild?: ({ refStore, refDucks, refProps, refReducers, refErrorReporter }: {
        refStore: TRefStore;
        refDucks: TRefDucks;
        refProps: TRefProps;
        refReducers: TRefReducers;
        refErrorReporter: TRefErrorReporter;
    }) => void;
}
export interface IErrorReporter {
    (...args: any[]): void;
}
export type TRefProps = {
    current: TPoolProps;
};
export type TRefDucks = {
    current: IDuck[];
    map: {
        [poolName: string]: {
            [duckName: string]: IDuck;
        };
    };
};
export type TRefStore = {
    current: Store;
};
export type TRefReducers = {
    root: IReducer;
    pre: IReducer;
    post: IReducer;
};
export type TRefStreams = {
    current: IPoolStream[];
};
export type TRefMiddlewares = {
    current: Middleware[];
};
export type TRefErrorReporter = {
    current: IErrorReporter;
};
export default function Pool({ poolName, props: initProps, ducks: initDucks, middlewares: initMiddlewares, streams: initStreams, buildStore, buildRootReducer, connectReduxDevtoolsExtension }?: IPoolArgs): IPool;
