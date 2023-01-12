import createSagaMiddleware from 'redux-saga'
import { spawn, call, all } from 'redux-saga/effects'
import { IPoolStream, IDuck, TRefDucks, TRefErrorReporter } from '@duckness/pool'
import { ISagaDuck, TSaga } from '@duckness/saga'

export default function PoolSagaStream({
  buildRootSaga
}: {
  buildRootSaga?: (
    ducks: IDuck[],
    { refDucks, refErrorReporter }: { refDucks: TRefDucks; refErrorReporter: TRefErrorReporter }
  ) => TSaga
} = {}) {
  const sagaMiddleware = createSagaMiddleware()

  const beforeBuild: IPoolStream['beforeBuild'] = function () {
    // NOP
  }

  const middlewares: IPoolStream['middlewares'] = function () {
    return [sagaMiddleware]
  }

  const afterBuild: IPoolStream['afterBuild'] = function ({ refDucks, refErrorReporter }) {
    const rootSaga = buildRootSaga
      ? buildRootSaga(refDucks.current, { refDucks, refErrorReporter })
      : function* defaultRootSaga() {
          const sagas: TSaga[] = refDucks.current.reduce((sagas, duck: ISagaDuck) => {
            if (duck.rootSaga) {
              if (refErrorReporter.current) {
                duck.setErrorReporter(refErrorReporter.current)
              }
              sagas.push(
                spawn(function* () {
                  while (true) {
                    try {
                      yield call(duck.rootSaga)
                      break
                    } catch (error) {
                      if (refErrorReporter.current) {
                        refErrorReporter.current(
                          error,
                          '@duckness/pool-saga-stream',
                          'saga',
                          duck.poolName,
                          duck.duckName
                        )
                      }
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
