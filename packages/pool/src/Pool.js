import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import { spawn, call, all } from 'redux-saga/effects'

export default function Pool({
  ducks: initDucks = [],
  buildStore = _props => {
    return {}
  },
  buildRootReducer,
  buildRootSaga,
  renderRoot = _props => null
} = {}) {
  const pool = {
    props: {},
    ducks: initDucks || [],
    addDuck(duck) {
      pool.ducks.push(duck)
    },
    errorReporter: console.error,
    setErrorReporter(reporter) {
      pool.errorReporter = reporter
    },
    build(props = pool.props) {
      pool.props = props || {}
      redux.rootReducer = buildRootReducer ? buildRootReducer(pool.ducks) : redux.defaultRootReducer
      const composeEnhancers =
        typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
          ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
          : compose
      const enhancer = composeEnhancers(applyMiddleware(reduxSaga.sagaMiddleware))
      redux.store = createStore(redux.rootReducer, buildStore ? buildStore(pool.props) || {} : {}, enhancer)
      reduxSaga.rootSaga = buildRootSaga ? buildRootSaga(pool.ducks) : reduxSaga.defaultRootSaga
      reduxSaga.sagaMiddleware.run(reduxSaga.rootSaga)
    },
    render(props = pool.props) {
      pool.props = props || {}
      if (null == redux.store) pool.build(pool.props)
      return <Provider store={redux.store}>{renderRoot(pool.props)}</Provider>
    },
    start(props = pool.props, toElement) {
      pool.build(props)
      dom.mount(toElement)
    },
    stop() {
      dom.unmount()
      redux.store = null
    }
  }

  const redux = {
    store: null,
    defaultRootReducer(state, action) {
      return pool.ducks.reduce((state, duck) => {
        try {
          return duck(state, action)
        } catch (error) {
          if ('function' === typeof pool.errorReporter)
            pool.errorReporter('@duckness/pool', duck.duckName, 'reducer', error)
          return state
        }
      }, state)
    }
  }

  const reduxSaga = {
    sagaMiddleware: createSagaMiddleware(),
    *defaultRootSaga() {
      const sagas = pool.ducks.reduce((sagas, duck) => {
        if (duck.rootSaga) {
          duck.errorReporter(pool.errorReporter)
          sagas.push(
            spawn(function* () {
              while (true) {
                try {
                  yield call(duck.rootSaga)
                  break
                } catch (error) {
                  if ('function' === typeof pool.errorReporter)
                    pool.errorReporter('@duckness/pool', duck.duckName, 'saga', error)
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

  const dom = {
    mountedTo: null,
    mount(toElement) {
      if (toElement) {
        if (null != dom.mountedTo && toElement !== dom.mountedTo) {
          dom.unmount()
        }
        dom.mountedTo = toElement
        ReactDOM.render(pool.render(), dom.mountedTo)
      }
    },
    unmount() {
      if (dom.mountedTo) {
        ReactDOM.unmountComponentAtNode(dom.mountedTo)
        dom.mountedTo = null
      }
    }
  }

  return {
    addDuck: pool.addDuck,
    start: pool.start,
    stop: pool.stop,
    build: pool.build,
    render: pool.render,
    mount: dom.mount,
    unmount: dom.unmount,
    errorReporter: pool.setErrorReporter
  }
}
