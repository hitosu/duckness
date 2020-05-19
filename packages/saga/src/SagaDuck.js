import Duck from '@duckness/duck'
import { spawn, call, all } from 'redux-saga/effects'

export default function SagaDuck(duckName, appName, duckContext) {
  const duck = Duck(duckName, appName, duckContext)

  const refErrorReporter = {
    current: ('undefined' !== typeof console && console.error) || (() => {}) // eslint-disable-line no-console
  }

  function setErrorReporter(reporter) {
    refErrorReporter.current = reporter
  }

  function reportError(...args) {
    if ('function' === typeof refErrorReporter.current) {
      refErrorReporter.current(...args)
    }
  }

  const sagas = []
  function addSaga(saga) {
    sagas.push(
      spawn(function* () {
        while (true) {
          try {
            yield call(saga, duck.duckFace)
            break
          } catch (error) {
            reportError(error, '@duckness/saga', duck.poolName, duck.duckName)
          }
        }
      })
    )
  }

  function* rootSaga() {
    yield all(sagas)
  }

  Object.defineProperty(duck, 'saga', { value: addSaga, writable: false, enumerable: true })
  Object.defineProperty(duck, 'rootSaga', { value: rootSaga, writable: false, enumerable: true })
  Object.defineProperty(duck, 'errorReporter', { value: setErrorReporter, writable: false, enumerable: true })
  Object.defineProperty(duck, 'reportError', { value: reportError, writable: false, enumerable: true })

  return duck
}
