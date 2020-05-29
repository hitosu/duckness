import { createStore, applyMiddleware } from 'redux'

export default function Pool({
  props: initProps = {},
  ducks: initDucks = [],
  middlewares: initMiddlewares = [],
  streams: initStreams = [],
  buildStore = () => {
    return {}
  },
  buildRootReducer
} = {}) {
  const refProps = { current: initProps || {} }
  const refDucks = { current: initDucks || [] }
  const refStreams = { current: initStreams || [] }
  const refMiddlewares = { current: initMiddlewares || [] }
  const refErrorReporter = { current: ('undefined' !== typeof console && console.error) || (() => {}) } // eslint-disable-line no-console

  function addDuck(duck) {
    refDucks.current.push(duck)
  }

  function addMiddleware(middleware) {
    refMiddlewares.current.push(middleware)
  }

  function addStream(stream) {
    refStreams.current.push(stream)
  }

  function setErrorReporter(reporter) {
    refErrorReporter.current = reporter
  }

  function reportError(...args) {
    if ('function' === typeof refErrorReporter.current) {
      refErrorReporter.current(...args)
    }
  }

  const refStore = { current: null }

  function build(props = refProps.current) {
    // save props
    refProps.current = props || {}

    // build root reducer
    const rootReducer = buildRootReducer
      ? buildRootReducer({ refDucks, refErrorReporter })
      : function defaultRootReducer(state, action) {
          return refDucks.current.reduce((state, duck) => {
            try {
              return duck(state, action)
            } catch (error) {
              reportError(error, '@duckness/pool', 'reducer', duck.poolName, duck.duckName)
              return state
            }
          }, state)
        }

    // invoke beforeBuild for each pool stream
    refStreams.current.forEach(stream => {
      if (stream.beforeBuild) stream.beforeBuild({ refDucks, refErrorReporter })
    })

    // compose redux middlewares
    const composeEnhancers =
      typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
        : x => x
    const middlewares = [
      ...refStreams.current.reduce(
        (streamMiddlewares, stream) =>
          stream.middlewares
            ? streamMiddlewares.concat(stream.middlewares({ refDucks, refErrorReporter }) || [])
            : streamMiddlewares,
        []
      ),
      ...refMiddlewares.current
    ]
    const enhancer = composeEnhancers(applyMiddleware(...middlewares))

    // create store
    refStore.current = createStore(
      rootReducer,
      buildStore ? buildStore(refProps.current, { refProps, refDucks, refErrorReporter }) || {} : {},
      enhancer
    )

    // invoke afterBuild for each pool stream
    refStreams.current.forEach(stream => {
      if (stream.afterBuild) stream.afterBuild({ refStore, refDucks, refErrorReporter })
    })

    // run @@INIT actions for each duck after store is built
    refDucks.current.forEach(duck => {
      refStore.current.dispatch({ type: duck.mapActionType('@@INIT'), payload: refProps.current })
    })

    // return redux store
    return refStore.current
  }

  const pool = {}

  Object.defineProperty(pool, 'addDuck', { value: addDuck, writable: false, enumerable: true })
  Object.defineProperty(pool, 'addMiddleware', { value: addMiddleware, writable: false, enumerable: true })
  Object.defineProperty(pool, 'addStream', { value: addStream, writable: false, enumerable: true })
  Object.defineProperty(pool, 'build', { value: build, writable: false, enumerable: true })
  Object.defineProperty(pool, 'reportError', { value: reportError, writable: false, enumerable: true })
  Object.defineProperty(pool, 'setErrorReporter', { value: setErrorReporter, writable: false, enumerable: true })
  Object.defineProperty(pool, 'store', {
    get() {
      return refStore.current
    },
    enumerable: true
  })
  Object.defineProperty(pool, 'ducks', {
    get() {
      return [...(refDucks.current || [])]
    },
    enumerable: true
  })
  Object.defineProperty(pool, 'middlewares', {
    get() {
      return [...(refMiddlewares.current || [])]
    },
    enumerable: true
  })
  Object.defineProperty(pool, 'streams', {
    get() {
      return [...(refStreams.current || [])]
    },
    enumerable: true
  })
  Object.defineProperty(pool, 'props', {
    get() {
      return { ...(refProps.current || {}) }
    },
    enumerable: true
  })

  return pool
}
