import createSagaMiddleware from 'redux-saga'
import { spawn, call, all } from 'redux-saga/effects'

export default function PoolSagaStream({ buildRootSaga } = {}) {
  const sagaMiddleware = createSagaMiddleware()

  function middlewares() {
    return [sagaMiddleware]
  }

  function beforeBuild() {
    // NOP
  }

  function afterBuild({ refDucks, refErrorReporter } = {}) {
    const rootSaga = buildRootSaga
      ? buildRootSaga(refDucks.current, { refDucks, refErrorReporter })
      : function* defaultRootSaga() {
          const sagas = refDucks.current.reduce((sagas, duck) => {
            if (duck.rootSaga) {
              duck.setErrorReporter(refErrorReporter.current)
              sagas.push(
                spawn(function* () {
                  while (true) {
                    try {
                      yield call(duck.rootSaga)
                      break
                    } catch (error) {
                      refErrorReporter.current(
                        error,
                        '@duckness/pool-saga-stream',
                        'saga',
                        duck.poolName,
                        duck.duckName
                      )
                    }
                  }
                })
              )
            }
            return sagas
          }, [])
          yield all(sagas)
        }

    sagaMiddleware.run(rootSaga)
  }

  const PoolSagaStream = {}

  Object.defineProperty(PoolSagaStream, 'middlewares', { value: middlewares, writable: false, enumerable: true })
  Object.defineProperty(PoolSagaStream, 'beforeBuild', { value: beforeBuild, writable: false, enumerable: true })
  Object.defineProperty(PoolSagaStream, 'afterBuild', { value: afterBuild, writable: false, enumerable: true })

  return PoolSagaStream
}
