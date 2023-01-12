import Duck, { IDuck, IDuckFace, TDuckContext } from '@duckness/duck'
import { Action } from 'redux'
import { Observable } from 'rxjs'
import { combineEpics, Epic, ActionsObservable, StateObservable } from 'redux-observable'
import { catchError as rxCatchError } from 'rxjs/operators'

export interface IEpicDuck extends IDuck {
  // add epic
  epic: (epic: IDuckedEpic) => void
  // root epic for this duck
  rootEpic: Epic
  // set error reporter for isolated epics
  setErrorReporter: (reporter: IErrorReporter) => void
  // report error to configured error reporter
  reportError: (...args: any[]) => void
}

export interface IDuckedEpic<Input extends Action = any, Output extends Input = Input, State = any, Dependencies = any>
  extends Epic {
  (
    action$: ActionsObservable<Input>,
    state$: StateObservable<State>,
    dependencies: Dependencies,
    duckFace?: IDuckFace
  ): Observable<Output>
  (action$: ActionsObservable<Input>, state$: StateObservable<State>, duckFace?: IDuckFace): Observable<Output>
}

export interface IErrorReporter {
  (...args: any[]): void
}

export default function EpicDuck(duckName: string, poolName: string, duckContext: TDuckContext) {
  const duck: IEpicDuck = Duck(duckName, poolName, duckContext) as IEpicDuck

  const refErrorReporter = {
    current: ('undefined' !== typeof console && console.error) || (() => void 0) // eslint-disable-line no-console
  }

  function setErrorReporter(reporter: IErrorReporter) {
    refErrorReporter.current = reporter
  }

  function reportError(...args: any[]) {
    if ('function' === typeof refErrorReporter.current) {
      refErrorReporter.current(...args)
    }
  }

  const epics: Epic[] = []
  function addEpic(epic: IDuckedEpic) {
    // add isolated epic
    epics.push((action$, state$, dependencies) =>
      (dependencies ? epic(action$, state$, dependencies, duck.duckFace) : epic(action$, state$, duck.duckFace)).pipe(
        rxCatchError((error, source) => {
          try {
            error.poolName = duck.poolName
            error.duckName = duck.duckName
          } catch {
            // skip
          }
          reportError(error, '@duckness/epic', duck.poolName, duck.duckName)
          return source
        })
      )
    )
  }

  function rootEpic() {
    return combineEpics(...epics)
  }

  Object.defineProperty(duck, 'epic', { value: addEpic, writable: false, enumerable: true })
  Object.defineProperty(duck, 'rootEpic', { value: rootEpic, writable: false, enumerable: true })
  Object.defineProperty(duck, 'setErrorReporter', { value: setErrorReporter, writable: false, enumerable: true })
  Object.defineProperty(duck, 'reportError', { value: reportError, writable: false, enumerable: true })

  return duck
}
