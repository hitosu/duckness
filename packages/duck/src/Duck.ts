export type TState = any

export type TActionType = string
export type TFullActionType = string
export type TActionPayload = any
export interface IAction {
  type: TActionType
  payload: TActionPayload
  error: boolean
}

// optional builder for action payload
export interface IPayloadBuilder {
  (payload: TActionPayload, duckFace: IDuckFace): TActionPayload
}
// optional transform every built action
export interface IActionTransformer {
  (action: IAction, duckFace: IDuckFace): IAction
}
// map short duck action types to full action types
type TActionTypesMap = { [actionType: TActionType]: TFullActionType }

// select some value from sources (usually one source - state)
export interface ISelector {
  (...sources: any[]): any
}
// selector with added duckFace
export interface IDuckedSelector {
  (...args: [...any[], IDuckFace]): any
  readonly originalSelector: ISelector
  readonly selectorName: string
}
// build duck selector and register it under some name
interface IBuildSelector {
  (selectorName: string | null, selector: ISelector): IDuckedSelector
}
// map selector names to selector
interface ISelectors {
  [selectorName: string]: IDuckedSelector
}

// action constructor build action from payload
export interface IActionConstructor {
  (payload: TActionPayload): IAction
  readonly actionType: TFullActionType
  readonly duckActionType: TActionType
  readonly payloadBuilder: IPayloadBuilder
  readonly actionTransformer: IActionTransformer
  readonly actionName?: string
}
// build and register action constructor
interface IBuildActionConstructor {
  (
    actionNameOrType: string | TActionType | null,
    forActionType?: TActionType | null,
    payloadBuilder?: IPayloadBuilder,
    actionTransformer?: IActionTransformer
  ): IActionConstructor
  [actionName: string]: IActionConstructor
}

type TTypedReducers = { [actionType: TActionType]: { actionType: TActionType; reducers: IReducer[] } }
type TMatchActionType = TActionType | ((action: IAction, duckFace: IDuckFace) => boolean) | null
type TCustomReducers = [TMatchActionType, IReducer][]
interface IAddReducer {
  (actionType: TMatchActionType, reducer: IReducer): void
}

interface ICloneDuck {
  (duckName: string, poolName: string, duckContext: TDuckContext): IDuck
}

export type TDuckContext = any

export interface IReducer {
  (state: TState, action: IAction, duckFace?: IDuckFace): TState
}

export interface IDuck extends IReducer {
  readonly duckFace: IDuckFace
  readonly duckName: string
  readonly poolName: string
  readonly duckContext: any
  readonly actionTypes: TActionTypesMap
  readonly mapActionType: (actionType: TActionType) => TFullActionType
  readonly listActionTypes: () => TActionType[]
  readonly action: IBuildActionConstructor
  readonly selector: IBuildSelector
  readonly select: ISelectors
  readonly reducer: IAddReducer
  readonly clone: ICloneDuck
  readonly updateContext: (newDuckContext: TDuckContext) => void
}

// duck interface added to all reducer, selector and some other calls
export interface IDuckFace {
  readonly reduce: IDuck
  readonly duckName: string
  readonly poolName: string
  readonly duckContext: TDuckContext
  readonly actionTypes: TActionTypesMap
  readonly mapActionType: (actionType: TActionType) => TFullActionType
  readonly listActionTypes: () => TActionType[]
  readonly action: IBuildActionConstructor
  readonly select: ISelectors
}

export default function Duck(duckName: string, poolName: string, duckContext: TDuckContext) {
  // updatable duck context
  const refDuckContext = {
    current: duckContext
  }

  // DUCK FACE is interface to duck received by selectors and reducers
  const duckFace: IDuckFace = {} as IDuckFace

  // Duck is root reducer
  const typedReducers: TTypedReducers = {}
  const customReducers: TCustomReducers = []
  const duck: IDuck = function duckRootReducer(state, action) {
    const actionReducers = typedReducers[action.type]
    const reducedState =
      null == actionReducers || 0 === actionReducers.reducers.length
        ? state
        : 1 === actionReducers.reducers.length
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
  } as IDuck

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

function addActionTypes(duck: IDuck, duckFace: IDuckFace, duckName: string, poolName: string) {
  const actionTypes: TActionTypesMap = {}
  function mapActionType(actionType: TActionType): TFullActionType {
    const fullActionType: TFullActionType = `${poolName || ''}/${duckName || ''}/${actionType}`
    return '@@' === actionType.substring(0, 2) // do not store hidden types in dictionary
      ? fullActionType
      : actionTypes[actionType] ||
          Object.defineProperty(actionTypes, actionType, {
            value: fullActionType,
            writable: false,
            enumerable: true
          })[actionType]
  }
  function listActionTypes() {
    return Object.keys(actionTypes)
  }

  Object.defineProperty(duck, 'actionTypes', { value: actionTypes, writable: false, enumerable: true })
  Object.defineProperty(duck, 'mapActionType', { value: mapActionType, writable: false, enumerable: true })
  Object.defineProperty(duck, 'listActionTypes', { value: listActionTypes, writable: false, enumerable: true })

  Object.defineProperty(duckFace, 'actionTypes', { value: actionTypes, writable: false, enumerable: true })
  Object.defineProperty(duckFace, 'mapActionType', { value: mapActionType, writable: false, enumerable: true })
  Object.defineProperty(duckFace, 'listActionTypes', { value: listActionTypes, writable: false, enumerable: true })
}

// ---- ACTION CONSTRUCTORS -------------------------------------------------------------------------

function addActionConstructors(duck: IDuck, duckFace: IDuckFace) {
  const buildActionConstructor: IBuildActionConstructor = function (
    actionNameOrType,
    forActionType,
    payloadBuilder,
    actionTransformer
  ) {
    const actionType = forActionType || actionNameOrType
    if ('string' !== typeof actionType || !actionType) {
      throw new Error('@duckness/duck.action: - actionType must be a non empty String')
    }
    const fullActionType = duck.mapActionType(actionType)
    const actionConstructor: IActionConstructor = function (payload: TActionPayload) {
      const isError = payload instanceof Error
      const action = {
        type: fullActionType,
        payload: !isError && payloadBuilder ? payloadBuilder(payload, duckFace) : payload,
        error: isError
      }
      return actionTransformer ? actionTransformer(action, duckFace) : action
    } as IActionConstructor
    Object.defineProperty(actionConstructor, 'actionType', { value: fullActionType, writable: false, enumerable: true })
    Object.defineProperty(actionConstructor, 'duckActionType', { value: actionType, writable: false, enumerable: true })
    Object.defineProperty(actionConstructor, 'payloadBuilder', {
      value: payloadBuilder,
      writable: false,
      enumerable: true
    })
    Object.defineProperty(actionConstructor, 'actionTransformer', {
      value: actionTransformer,
      writable: false,
      enumerable: true
    })

    if (actionNameOrType && 'string' === typeof actionNameOrType) {
      Object.defineProperty(actionConstructor, 'actionName', {
        value: actionNameOrType,
        writable: false,
        enumerable: true
      })
      Object.defineProperty(buildActionConstructor, actionNameOrType, {
        value: actionConstructor,
        writable: false,
        enumerable: true
      })
    }
    return actionConstructor
  } as IBuildActionConstructor

  Object.defineProperty(duck, 'action', { value: buildActionConstructor, writable: false, enumerable: true })

  Object.defineProperty(duckFace, 'action', { value: buildActionConstructor, writable: false, enumerable: true })
}

// ---- SELECTORS -------------------------------------------------------------------------

function addSelectors(duck: IDuck, duckFace: IDuckFace) {
  const selectors: ISelectors = {}
  const buildSelector: IBuildSelector = function (selectorName, selector) {
    if ('function' === typeof selector) {
      const duckedSelector: IDuckedSelector = function (...args) {
        return selector.apply(this, [...args, duckFace])
      } as IDuckedSelector
      Object.defineProperty(duckedSelector, 'originalSelector', {
        value: selector,
        writable: false,
        enumerable: true
      })
      if (selectorName) {
        Object.defineProperty(duckedSelector, 'selectorName', {
          value: selectorName,
          writable: false,
          enumerable: true
        })
        Object.defineProperty(selectors, selectorName, {
          value: duckedSelector,
          writable: false,
          enumerable: true
        })
      }
      return duckedSelector
    } else {
      throw new Error('@duckness/duck.selector: - selector must be a Function')
    }
  }
  Object.defineProperty(duck, 'selector', { value: buildSelector, writable: false, enumerable: true })
  Object.defineProperty(duck, 'select', { value: selectors, writable: false, enumerable: true })

  Object.defineProperty(duckFace, 'select', { value: selectors, writable: false, enumerable: true })
}

// ---- REDUCERS -------------------------------------------------------------------------

function addReducers(duck: IDuck, typedReducers: TTypedReducers, customReducers: TCustomReducers) {
  const addReducer: IAddReducer = function (actionType, reducer) {
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
      } else {
        throw new Error('@duckness/duck.reducer: actionType must be a String, null or Function')
      }
      return reducer
    } else {
      throw new Error('@duckness/duck.reducer: reducer must be a Function')
    }
  }
  Object.defineProperty(duck, 'reducer', { value: addReducer, writable: false, enumerable: true })
}

// ---- CLONING --------------------------------------------------------------------------

function addCloning(duck: IDuck, typedReducers: TTypedReducers, customReducers: TCustomReducers) {
  const cloneDuck: ICloneDuck = function (duckName, poolName, duckContext) {
    const clonedDuck: IDuck = Duck(duckName, poolName, duckContext)
    // clone action types
    duck.listActionTypes().forEach(function (actionType) {
      clonedDuck.mapActionType(actionType)
    })

    // clone action constructors
    Object.keys(duck.action).forEach(actionName => {
      const actionConstructor = duck.action[actionName]
      if ('function' === typeof actionConstructor && actionConstructor.actionType) {
        clonedDuck.action(actionName, actionConstructor.duckActionType)
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

function addContextUpdate(duck: IDuck, duckFace: IDuckFace, refDuckContext: { current: TDuckContext }) {
  function updateContext(newDuckContext: TDuckContext) {
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
