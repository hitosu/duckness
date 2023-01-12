import { IDuck, TDuckContext } from '@duckness/duck';
import { all } from 'redux-saga/effects';
import { Saga } from 'redux-saga';
export interface ISagaDuck extends IDuck {
    readonly saga: (saga: TSaga) => void;
    readonly rootSaga: () => Generator<ReturnType<typeof all>>;
    readonly setErrorReporter: (reporter: IErrorReporter) => void;
    readonly reportError: (...args: any[]) => void;
}
export type TSaga = Saga;
export interface IErrorReporter {
    (...args: any[]): void;
}
export default function SagaDuck(duckName: string, appName: string, duckContext: TDuckContext): ISagaDuck;
