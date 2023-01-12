import Duck, { IDuck, TDuckContext } from '@duckness/duck'
import { spawn, call, all } from 'redux-saga/effects'
import { Saga } from 'redux-saga'

export interface ISagaDuck extends IDuck {
  readonly saga: (saga: TSaga) => void
  readonly rootSaga: () => Generator<ReturnType<typeof all>>
  readonly setErrorReporter: (reporter: IErrorReporter) => void
  readonly reportError: (...args: any[]) => void
}

export type TSaga = Saga

export interface IErrorReporter {
  (...args: any[]): void
}

export default function SagaDuck(duckName: string, appName: string, duckContext: TDuckContext) {
  const duck: ISagaDuck = Duck(duckName, appName, duckContext) as ISagaDuck

  const refErrorReporter = {
    // eslint-disable-next-line no-console
    current: ('undefined' !== typeof console && console.error) || (() => void 0)
  }

  const setErrorReporter: ISagaDuck['setErrorReporter'] = function (reporter) {
    refErrorReporter.current = reporter
  }

  const reportError: ISagaDuck['reportError'] = function (...args) {
    if ('function' === typeof refErrorReporter.current) {
      refErrorReporter.current(...args)
    }
  }

  const sagas: ReturnType<typeof spawn>[] = []
  const addSaga: ISagaDuck['saga'] = function (saga) {
    sagas.push(
      spawn(function* () {
        while (true) {
          try {
            yield call(saga, duck.duckFace)
            break
          } catch (error) {
            try {
              error.poolName = duck.poolName
              error.duckName = duck.duckName
            } catch {
              // skip
            }
            reportError(error, '@duckness/saga', duck.poolName, duck.duckName)
          }
        }
      })
    )
  }

  const rootSaga: ISagaDuck['rootSaga'] = function* () {
    yield all(sagas)
  }

  Object.defineProperty(duck, 'saga', { value: addSaga, writable: false, enumerable: true })
  Object.defineProperty(duck, 'rootSaga', { value: rootSaga, writable: false, enumerable: true })
  Object.defineProperty(duck, 'setErrorReporter', { value: setErrorReporter, writable: false, enumerable: true })
  Object.defineProperty(duck, 'reportError', { value: reportError, writable: false, enumerable: true })

  return duck
}
