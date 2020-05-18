export default function Duck(duckName, poolName, duckContext) {
  // updatable duck context
  const refDuckContext = {
    current: duckContext
  }

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
  const typedReducers = {}
  const customReducers = []
  const duck = function duckRootReducer(state, action) {
    var actionReducers = typedReducers[action.type]
    var reducedState =
      null == actionReducers || 0 === actionReducers.length
        ? state
        : 1 === actionReducers.length
        ? actionReducers.reducers[0](state, action, duckFace)
        : actionReducers.reducers.reduce((state, reducer) => {
            const reducedState = reducer(state, action, duckFace)
            return null == reducedState ? state : reducedState
          }, state)

    return customReducers.length
      ? customReducers.reduce((state, customReducer) => {
          if (
            (null == customReducer[0] && 0 === action.type.indexOf(`${poolName || ''}/${duckName || ''}/`)) ||
            ('function' === typeof customReducer[0] && customReducer[0](action, duckFace))
          ) {
            const reducedState = customReducer[1](state, action, duckFace)
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
  Object.defineProperty(duck, 'duckContext', {
    value: refDuckContext.current,
    writable: false,
    configurable: true,
    enumerable: true
  })

  // duckFace attributes
  Object.defineProperty(duckFace, 'reduce', { value: duck, writable: false, enumerable: true })
  Object.defineProperty(duckFace, 'duckName', { value: duckName, writable: false, enumerable: true })
  Object.defineProperty(duckFace, 'poolName', { value: poolName, writable: false, enumerable: true })
  Object.defineProperty(duckFace, 'duckContext', {
    value: refDuckContext.current,
    writable: false,
    configurable: true,
    enumerable: true
  })

  // add functionality
  addActionTypes(duck, duckFace, duckName, poolName)
  addActionConstructors(duck, duckFace)
  addSelectors(duck, duckFace)
  addReducers(duck, typedReducers, customReducers)
  addCloning(duck, typedReducers, customReducers)
  addContextUpdate(duck, duckFace, refDuckContext)

  return duck
}

// ---- ACTION TYPES -------------------------------------------------------------------------

function addActionTypes(duck, duckFace, duckName, poolName) {
  const actionTypes = {}
  function mapActionType(actionType) {
    return (
      actionTypes[actionType] ||
      Object.defineProperty(actionTypes, actionType, {
        value: `${poolName || ''}/${duckName || ''}/${actionType}`,
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

function addActionConstructors(duck, duckFace) {
  function actionConstructor(actionName, actionType, payloadBuilder, actionTransformer) {
    const fullActionType = duck.mapActionType(actionType)
    function constructAction(payload) {
      const isError = payload instanceof Error
      const action = {
        type: fullActionType,
        payload: !isError && payloadBuilder ? payloadBuilder(payload, duckFace) : payload,
        error: isError
      }
      return actionTransformer ? actionTransformer(action, duckFace) : action
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

function addSelectors(duck, duckFace) {
  const selectors = {}
  function addSelector(selectorName, selector) {
    if (selectorName && 'function' === typeof selector) {
      const selectorWithContext = function (...args) {
        return selector.apply(this, [...args, duckFace])
      }
      Object.defineProperty(selectorWithContext, 'selectorName', {
        value: selectorName,
        writable: false,
        enumerable: true
      })
      Object.defineProperty(selectorWithContext, 'originalSelector', {
        value: selector,
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

function addReducers(duck, typedReducers, customReducers) {
  function addReducer(actionType, reducer) {
    if ('function' === typeof reducer) {
      if ('string' === typeof actionType) {
        const fullActionType = duck.mapActionType(actionType)
        if (!typedReducers[fullActionType]) {
          typedReducers[fullActionType] = {
            actionType,
            reducers: []
          }
        }
        typedReducers[fullActionType].reducers.push(reducer)
      } else if ('function' === typeof actionType) {
        customReducers.push([actionType, reducer])
      } else if (null == actionType) {
        customReducers.push([null, reducer])
      }
    }
  }
  Object.defineProperty(duck, 'reducer', { value: addReducer, writable: false, enumerable: true })
}

// ---- CLONING --------------------------------------------------------------------------

function addCloning(duck, typedReducers, customReducers) {
  function cloneDuck(duckName, poolName, duckContext) {
    const clonedDuck = Duck(duckName, poolName, duckContext)
    // clone action types
    duck.listActionTypes().forEach(function (actionType) {
      clonedDuck.mapActionType(actionType)
    })

    // clone action constructors
    Object.keys(duck.action).forEach(actionName => {
      const actionConstructor = duck.action[actionName]
      if ('function' === typeof actionConstructor && actionConstructor.actionType) {
        clonedDuck.action(actionName, actionConstructor.actionType)
      }
    })

    // clone selectors
    Object.keys(duck.select).forEach(selectorName => {
      if (duck.select[selectorName].originalSelector) {
        clonedDuck.selector(selectorName, duck.select[selectorName].originalSelector)
      }
    })

    // clone reducers
    Object.keys(typedReducers).forEach(reducerActionType => {
      const actionReducers = typedReducers[reducerActionType]
      if (actionReducers) {
        const { actionType, reducers } = actionReducers
        reducers.forEach(reducer => {
          clonedDuck.reducer(actionType, reducer)
        })
      }
    })
    customReducers.forEach(customReducer => {
      clonedDuck.reducer(customReducer[0], customReducer[1])
    })

    return clonedDuck
  }
  Object.defineProperty(duck, 'clone', { value: cloneDuck, writable: false, enumerable: true })
}

// ---- CONTEXT UPDATE -------------------------------------------------------------------

function addContextUpdate(duck, duckFace, refDuckContext) {
  function updateContext(newDuckContext) {
    refDuckContext.current = newDuckContext
    Object.defineProperty(duck, 'duckContext', {
      value: refDuckContext.current,
      writable: false,
      configurable: true,
      enumerable: true
    })
    Object.defineProperty(duckFace, 'duckContext', {
      value: refDuckContext.current,
      writable: false,
      configurable: true,
      enumerable: true
    })
  }
  Object.defineProperty(duck, 'updateContext', { value: updateContext, writable: false, enumerable: true })
}
