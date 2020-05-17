export default function Duck(duckName, poolName, duckContext) {
  // DUCK FACE is interface to duck received by selectors and reducers
  const duckFace = {
    /*
    actionTypes
    select
    action
    reduce
    duckName
    poolName
    duckContext
    */
  }

  // Duck is root reducer
  const reducers = {}
  const customReducers = []
  const duck = function duckRootReducer(state, action) {
    var actionReducers = reducers[action.type]
    var reducedState =
      null == actionReducers || 0 === actionReducers.length
        ? state
        : 1 === actionReducers.length
        ? actionReducers[0](state, action, duckFace, duckContext)
        : actionReducers.reduce((state, reducer) => {
            const reducedState = reducer(state, action, duckFace, duckContext)
            return null == reducedState ? state : reducedState
          }, state)

    return customReducers.length
      ? customReducers.reduce((state, customReducer) => {
          if (customReducer[0](action, duckContext)) {
            const reducedState = customReducer[1](state, action, duckFace, duckContext)
            return null == reducedState ? state : reducedState
          } else {
            return state
          }
        }, reducedState)
      : reducedState
  }

  // Duck attributes
  Object.defineProperty(duck, 'duckFace', { value: duckFace, writable: false, enumerable: true })
  Object.defineProperty(duck, 'duckName', { value: duckName, writable: false, enumerable: true })
  Object.defineProperty(duck, 'poolName', { value: poolName, writable: false, enumerable: true })
  Object.defineProperty(duck, 'duckContext', { value: duckContext, writable: false, enumerable: true })

  // duckFace attributes
  Object.defineProperty(duckFace, 'reduce', { value: duck, writable: false, enumerable: true })
  Object.defineProperty(duckFace, 'duckName', { value: duckName, writable: false, enumerable: true })
  Object.defineProperty(duckFace, 'poolName', { value: poolName, writable: false, enumerable: true })
  Object.defineProperty(duckFace, 'duckContext', { value: duckContext, writable: false, enumerable: true })

  // add functionality
  addActionTypes(duck, duckFace, duckName, poolName, duckContext)
  addActionConstructors(duck, duckFace, duckName, poolName, duckContext)
  addSelectors(duck, duckFace, duckName, poolName, duckContext)
  addReducers(duck, duckFace, duckName, poolName, duckContext, reducers, customReducers)

  return duck
}

// ---- ACTION TYPES -------------------------------------------------------------------------

function addActionTypes(duck, duckFace, duckName, poolName /*, duckContext*/) {
  const actionTypes = {}
  function mapActionType(actionType) {
    return (
      actionTypes[actionType] ||
      Object.defineProperty(actionTypes, actionType, {
        value: (poolName || '') + '/' + (duckName || '') + '/' + actionType,
        writable: false,
        enumerable: true
      })[actionType]
    )
  }
  function listActionTypes() {
    return Object.keys(actionTypes)
  }

  Object.defineProperty(duck, 'actionTypes', { value: actionTypes, writable: false, enumerable: true })
  Object.defineProperty(duck, 'mapActionType', { value: mapActionType, writable: false, enumerable: true })
  Object.defineProperty(duck, 'listActionTypes', { value: listActionTypes, writable: false, enumerable: true })

  Object.defineProperty(duckFace, 'actionTypes', { value: actionTypes, writable: false, enumerable: true })
}

// ---- ACTION CONSTRUCTORS -------------------------------------------------------------------------

function addActionConstructors(duck, duckFace, _duckName, _poolName, duckContext) {
  function actionConstructor(actionName, actionType, payloadBuilder, actionTransformer) {
    const fullActionType = duck.mapActionType(actionType)
    function constructAction(payload) {
      const isError = payload instanceof Error
      const action = {
        type: fullActionType,
        payload: !isError && payloadBuilder ? payloadBuilder(payload, duckContext) : payload,
        error: isError
      }
      return actionTransformer ? actionTransformer(action, duckContext) : action
    }
    Object.defineProperty(constructAction, 'actionType', { value: actionType, writable: false, enumerable: true })
    Object.defineProperty(constructAction, 'payloadBuilder', {
      value: payloadBuilder,
      writable: false,
      enumerable: true
    })
    Object.defineProperty(constructAction, 'actionTransformer', {
      value: actionTransformer,
      writable: false,
      enumerable: true
    })

    if (actionName) {
      Object.defineProperty(constructAction, 'actionName', { value: actionName, writable: false, enumerable: true })
      Object.defineProperty(actionConstructor, actionName, {
        value: constructAction,
        writable: false,
        enumerable: true
      })
    }
    return constructAction
  }

  Object.defineProperty(duck, 'action', { value: actionConstructor, writable: false, enumerable: true })

  Object.defineProperty(duckFace, 'action', { value: actionConstructor, writable: false, enumerable: true })
}

// ---- SELECTORS -------------------------------------------------------------------------

function addSelectors(duck, duckFace, _duckName, _poolName, duckContext) {
  const selectors = {}
  function addSelector(selectorName, selector) {
    if (selectorName && 'function' === typeof selector) {
      const selectorWithContext = function (...args) {
        return selector.apply(this, [...args, duckFace, duckContext])
      }
      Object.defineProperty(selectorWithContext, 'selectorName', {
        value: selectorName,
        writable: false,
        enumerable: true
      })
      Object.defineProperty(selectors, selectorName, {
        value: selectorWithContext,
        writable: false,
        enumerable: true
      })
    }
  }
  Object.defineProperty(duck, 'selector', { value: addSelector, writable: false, enumerable: true })
  Object.defineProperty(duck, 'select', { value: selectors, writable: false, enumerable: true })

  Object.defineProperty(duckFace, 'select', { value: selectors, writable: false, enumerable: true })
}

// ---- REDUCERS -------------------------------------------------------------------------

function addReducers(duck, _duckFace, _duckName, _poolName, _duckContext, reducers, customReducers) {
  function addReducer(actionType, reducer) {
    if ('function' === typeof reducer) {
      if ('string' === typeof actionType) {
        const fullActionType = duck.mapActionType(actionType)
        if (!reducers[fullActionType]) {
          reducers[fullActionType] = []
        }
        reducers[fullActionType].push(reducer)
      } else if ('function' === typeof actionType) {
        customReducers.push([actionType, reducer])
      } else if (null == actionType) {
        customReducers.push([() => true, reducer])
      }
    }
  }
  Object.defineProperty(duck, 'reducer', { value: addReducer, writable: false, enumerable: true })
}
