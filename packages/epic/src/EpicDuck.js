import Duck from '@duckness/duck'
import { combineEpics } from 'redux-observable'
import { catchError as rxCatchError } from 'rxjs/operators'

export default function EpicDuck(duckName, appName, duckContext) {
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

  const epics = []
  function addEpic(epic) {
    // add isolated epic
    epics.push((...args) =>
      epic(...args, duck.duckFace).pipe(
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
