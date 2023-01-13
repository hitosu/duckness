/// <reference types="react" />
import { combineSelectors, TShouldUpdate, TShouldSelect, ISelector, TActionCreator, TPayloadTransformer, TDispatcher } from '@duckness/use-redux';
import { IPool } from '@duckness/pool';
export { TShouldUpdate, TShouldSelect, ISelector, TActionCreator, TPayloadTransformer, TDispatcher };
export default function usePool(pool: IPool, selector: ISelector, shouldUpdate: TShouldUpdate, shouldSelect: TShouldSelect): any;
export declare function useDispatchAction(pool: IPool, actionCreator: TActionCreator, payloadTransformer: TPayloadTransformer): (payload: any) => import("redux").Action<any>;
export declare function useDispatch(pool: IPool, dispatcher: TDispatcher, deps?: any[]): (...args: any[]) => void;
export declare function connect(pool: IPool, selector: ISelector, shouldUpdate: TShouldUpdate, shouldSelect: TShouldSelect, dispatch?: import("@duckness/pool").IPoolDispatch): (Component: import("react").ComponentType<{}>, mapToProps?: (selected: any, props: any, dispatch: import("redux").Dispatch<import("redux").AnyAction>) => any) => {
    (props: any): JSX.Element;
    displayName: string;
};
export { combineSelectors };
