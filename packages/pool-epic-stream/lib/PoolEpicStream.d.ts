import { Epic } from 'redux-observable';
import { IPoolStream, IDuck, TRefDucks, TRefErrorReporter } from '@duckness/pool';
export default function PoolEpicStream({ buildRootEpic }?: {
    buildRootEpic?: (ducks: IDuck[], { refDucks, refErrorReporter }: {
        refDucks: TRefDucks;
        refErrorReporter: TRefErrorReporter;
    }) => Epic;
}): IPoolStream;
