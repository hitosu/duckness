import { createStore, applyMiddleware } from 'redux'

// this pool stream will send @@INIT action to every registered duck after build
const initDucksStream = Object.freeze({
  afterBuild({ refStore, refDucks, refProps } = {}) {
    refDucks.current.forEach(duck => {
      refStore.current.dispatch({ type: duck.mapActionType('@@INIT'), payload: refProps.current })
    })
  }
})

// POOL
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
  const refStreams = { current: [...(initStreams || []), initDucksStream] }
  const refMiddlewares = { current: initMiddlewares || [] }
  const refErrorReporter = { current: ('undefined' !== typeof console && console.error) || (() => {}) } // eslint-disable-line no-console

  function addDuck(duck) {
    refDucks.current.push(duck)
  }

  function addMiddleware(middleware) {
    refMiddlewares.current.push(middleware)
  }

  function addStream(stream) {
    refStreams.current.unshift(stream)
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
  function dispatch(action) {
    if (refStore.current) {
      refStore.current.dispatch(action)
    } else {
      const error = new Error('Received action dispatch but pool is not built yet')
      error.dispatchedAction = action
      reportError(error, '@duckness/pool', 'dispatch', action)
    }
  }

  const refReducers = { root: null, pre: null, post: null }
  function reduce(stateOrAction, andAction) {
    if (void 0 === andAction && !refStore.current) {
      const error = new Error('Reducing state but pool is not built yet')
      error.dispatchedAction = stateOrAction
      reportError(error, '@duckness/pool', 'reduce', stateOrAction)
      return stateOrAction
    }
    const state = void 0 === andAction ? refStore.current.getState() : stateOrAction
    const action = void 0 === andAction ? stateOrAction : andAction
    if (refReducers.root) {
      return refReducers.root(state, action)
    } else {
      const error = new Error('Reducing state but pool is not built yet')
      error.dispatchedAction = action
      reportError(error, '@duckness/pool', 'reduce', action)
      return state
    }
  }

  function setPreReducer(reducer) {
    refReducers.pre = (state, action) => {
      try {
        return reducer(state, action)
      } catch (error) {
        try {
          error.dispatchedAction = action
        } catch {
          // skip
        }
        reportError(error, '@duckness/pool', 'pre reducer')
        return state
      }
    }
  }
  function setPostReducer(reducer) {
    refReducers.post = (state, action) => {
      try {
        return reducer(state, action)
      } catch (error) {
        try {
          error.dispatchedAction = action
        } catch {
          // skip
        }
        reportError(error, '@duckness/pool', 'post reducer')
        return state
      }
    }
  }

  function build(props = refProps.current) {
    // save props
    refProps.current = props || {}

    // build root reducer
    refReducers.root = buildRootReducer
      ? buildRootReducer(refDucks.current, { refProps, refReducers, refDucks, refErrorReporter })
      : function defaultRootReducer(state, action) {
          // pre reducer
          const preState = refReducers.pre ? refReducers.pre(state, action) : state
          // duck reducers
          const ducksReducedState = refDucks.current.reduce((state, duck) => {
            try {
              return duck(state, action)
            } catch (error) {
              try {
                error.poolName = duck.poolName
                error.duckName = duck.duckName
                error.dispatchedAction = action
              } catch {
                // skip
              }
              reportError(error, '@duckness/pool', 'reducer', duck.poolName, duck.duckName)
              return state
            }
          }, preState)
          // post reducer
          return refReducers.post ? refReducers.post(ducksReducedState, action) : ducksReducedState
        }

    // invoke beforeBuild for each pool stream
    refStreams.current.forEach(stream => {
      if (stream.beforeBuild) stream.beforeBuild({ refDucks, refProps, refReducers, refErrorReporter })
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
            ? streamMiddlewares.concat(stream.middlewares({ refDucks, refProps, refReducers, refErrorReporter }) || [])
            : streamMiddlewares,
        []
      ),
      ...refMiddlewares.current
    ]
    const enhancer = composeEnhancers(applyMiddleware(...middlewares))

    // create store
    refStore.current = createStore(
      refReducers.root,
      buildStore ? buildStore(refProps.current, { refProps, refDucks, refReducers, refErrorReporter }) || {} : {},
      enhancer
    )

    // invoke afterBuild for each pool stream
    refStreams.current.forEach(stream => {
      if (stream.afterBuild) stream.afterBuild({ refStore, refDucks, refProps, refReducers, refErrorReporter })
    })

    // return redux store
    return refStore.current
  }

  const pool = {}

  Object.defineProperty(pool, 'addDuck', { value: addDuck, writable: false, enumerable: true })
  Object.defineProperty(pool, 'addMiddleware', { value: addMiddleware, writable: false, enumerable: true })
  Object.defineProperty(pool, 'addStream', { value: addStream, writable: false, enumerable: true })
  Object.defineProperty(pool, 'preReducer', { value: setPreReducer, writable: false, enumerable: true })
  Object.defineProperty(pool, 'postReducer', { value: setPostReducer, writable: false, enumerable: true })
  Object.defineProperty(pool, 'build', { value: build, writable: false, enumerable: true })
  Object.defineProperty(pool, 'reportError', { value: reportError, writable: false, enumerable: true })
  Object.defineProperty(pool, 'setErrorReporter', { value: setErrorReporter, writable: false, enumerable: true })
  Object.defineProperty(pool, 'store', {
    get() {
      return refStore.current
    },
    enumerable: true
  })
  Object.defineProperty(pool, 'dispatch', { value: dispatch, writable: false, enumerable: true })
  Object.defineProperty(pool, 'reduce', { value: reduce, writable: false, enumerable: true })
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
