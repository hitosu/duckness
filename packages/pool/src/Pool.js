import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { spawn, call, all } from 'redux-saga/effects'

export default function Pool({
  props: initProps = {},
  ducks: initDucks = [],
  buildStore = _props => {
    return {}
  },
  buildRootReducer,
  buildRootSaga,
  middlewares = []
} = {}) {
  const refProps = { current: initProps || {} }
  const refDucks = { current: initDucks || [] }
  const refErrorReporter = { current: ('undefined' !== typeof console && console.error) || (() => {}) } // eslint-disable-line no-console

  function addDuck(duck) {
    refDucks.current.push(duck)
  }

  function setErrorReporter(reporter) {
    refErrorReporter.current = reporter
  }

  function reportError(...args) {
    if ('function' === typeof refErrorReporter.current) {
      refErrorReporter.current(...args)
    }
  }

  const redux = {
    store: null,
    defaultRootReducer(state, action) {
      return refDucks.current.reduce((state, duck) => {
        try {
          return duck(state, action)
        } catch (error) {
          reportError(error, '@duckness/pool', 'reducer', duck.poolName, duck.duckName)
          return state
        }
      }, state)
    }
  }

  const reduxSaga = {
    sagaMiddleware: createSagaMiddleware(),
    *defaultRootSaga() {
      const sagas = refDucks.current.reduce((sagas, duck) => {
        if (duck.rootSaga) {
          duck.errorReporter(refErrorReporter.current)
          sagas.push(
            spawn(function* () {
              while (true) {
                try {
                  yield call(duck.rootSaga)
                  break
                } catch (error) {
                  reportError(error, '@duckness/pool', 'saga', duck.poolName, duck.duckName)
                }
              }
            })
          )
        }
        return sagas
      }, [])
      yield all(sagas)
    }
  }

  function build(props = refProps.current) {
    refProps.current = props || {}
    redux.rootReducer = buildRootReducer ? buildRootReducer(refDucks.current) : redux.defaultRootReducer
    const composeEnhancers =
      typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
        : x => x
    const enhancer = composeEnhancers(applyMiddleware(reduxSaga.sagaMiddleware, ...(middlewares || [])))
    redux.store = createStore(redux.rootReducer, buildStore ? buildStore(refProps.current) || {} : {}, enhancer)
    reduxSaga.rootSaga = buildRootSaga ? buildRootSaga(refDucks.current) : reduxSaga.defaultRootSaga
    reduxSaga.sagaMiddleware.run(reduxSaga.rootSaga)
    // run @@INIT actions for each duck after store is built
    refDucks.current.forEach(duck => {
      redux.store.dispatch({ type: duck.mapActionType('@@INIT'), payload: refProps.current })
    })
    return redux.store
  }

  const pool = {}

  Object.defineProperty(pool, 'addDuck', { value: addDuck, writable: false, enumerable: true })
  Object.defineProperty(pool, 'build', { value: build, writable: false, enumerable: true })
  Object.defineProperty(pool, 'reportError', { value: reportError, writable: false, enumerable: true })
  Object.defineProperty(pool, 'store', {
    get() {
      return redux.store
    },
    enumerable: true
  })
  Object.defineProperty(pool, 'setErrorReporter', { value: setErrorReporter, writable: false, enumerable: true })
  Object.defineProperty(pool, 'ducks', {
    get() {
      return [...(refDucks.current || [])]
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
