/// <reference types="react" />
import { IPool, TPoolProps } from '@duckness/pool';
export type IReactReduxPool = {
    render: () => JSX.Element;
} & {
    [poolAPIKey in keyof IPool]: IPool[poolAPIKey];
};
export default function ReactReduxPool(pool: IPool, renderRoot?: (props: TPoolProps) => JSX.Element): IReactReduxPool;
