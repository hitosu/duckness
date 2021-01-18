import { createEpicMiddleware, combineEpics } from 'redux-observable'

export default function PoolEpicStream({ buildRootEpic } = {}) {
  const epicMiddleware = createEpicMiddleware()

  function middlewares() {
    return [epicMiddleware]
  }

  function beforeBuild() {
    // NOP
  }

  function afterBuild({ refDucks, refErrorReporter } = {}) {
    const rootEpic = buildRootEpic
      ? buildRootEpic(refDucks.current, { refDucks, refErrorReporter })
      : combineEpics(
          ...refDucks.current.reduce((epics, duck) => {
            if (duck.rootEpic) {
              duck.setErrorReporter(refErrorReporter.current)
              epics.push(duck.rootEpic())
            }
            return epics
          }, [])
        )
    epicMiddleware.run(rootEpic)
  }

  const PoolEpicStream = {}

  Object.defineProperty(PoolEpicStream, 'middlewares', { value: middlewares, writable: false, enumerable: true })
  Object.defineProperty(PoolEpicStream, 'beforeBuild', { value: beforeBuild, writable: false, enumerable: true })
  Object.defineProperty(PoolEpicStream, 'afterBuild', { value: afterBuild, writable: false, enumerable: true })

  return PoolEpicStream
}
