import { createEpicMiddleware, combineEpics, Epic } from 'redux-observable'
import { IPoolStream, IDuck, TRefDucks, TRefErrorReporter } from '@duckness/pool'
import { IEpicDuck } from '@duckness/epic'

export default function PoolEpicStream({
  buildRootEpic
}: {
  buildRootEpic?: (
    ducks: IDuck[],
    { refDucks, refErrorReporter }: { refDucks: TRefDucks; refErrorReporter: TRefErrorReporter }
  ) => Epic
} = {}) {
  const epicMiddleware = createEpicMiddleware()

  const beforeBuild: IPoolStream['beforeBuild'] = function () {
    // NOP
  }

  const middlewares: IPoolStream['middlewares'] = function () {
    return [epicMiddleware]
  }

  const afterBuild: IPoolStream['afterBuild'] = function ({ refDucks, refErrorReporter }) {
    const rootEpic = buildRootEpic
      ? buildRootEpic(refDucks.current, { refDucks, refErrorReporter })
      : combineEpics(
          ...refDucks.current.reduce((epics, duck: IEpicDuck) => {
            if (duck.rootEpic) {
              duck.setErrorReporter(refErrorReporter.current)
              epics.push(duck.rootEpic())
            }
            return epics
          }, [])
        )
    epicMiddleware.run(rootEpic)
  }

  const PoolEpicStream: IPoolStream = {} as IPoolStream

  Object.defineProperty(PoolEpicStream, 'middlewares', { value: middlewares, writable: false, enumerable: true })
  Object.defineProperty(PoolEpicStream, 'beforeBuild', { value: beforeBuild, writable: false, enumerable: true })
  Object.defineProperty(PoolEpicStream, 'afterBuild', { value: afterBuild, writable: false, enumerable: true })

  return PoolEpicStream
}
