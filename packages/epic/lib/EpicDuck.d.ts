import { IDuck, IDuckFace, TDuckContext } from '@duckness/duck';
import { Action } from 'redux';
import { Observable } from 'rxjs';
import { Epic, ActionsObservable, StateObservable } from 'redux-observable';
export interface IEpicDuck extends IDuck {
    readonly epic: (epic: IDuckedEpic) => void;
    readonly rootEpic: () => Epic;
    readonly setErrorReporter: (reporter: IErrorReporter) => void;
    readonly reportError: (...args: any[]) => void;
}
export interface IDuckedEpic<Input extends Action = any, Output extends Input = Input, State = any, Dependencies = any> extends Epic {
    (action$: ActionsObservable<Input>, state$: StateObservable<State>, dependencies: Dependencies, duckFace?: IDuckFace): Observable<Output>;
    (action$: ActionsObservable<Input>, state$: StateObservable<State>, duckFace?: IDuckFace): Observable<Output>;
}
export interface IErrorReporter {
    (...args: any[]): void;
}
export default function EpicDuck(duckName: string, poolName: string, duckContext: TDuckContext): IEpicDuck;
