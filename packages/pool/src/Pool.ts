import { createStore, applyMiddleware, Store, Middleware, Unsubscribe } from 'redux'
import { IDuck, IReducer, IAction, ISelector, TState } from '@duckness/duck'
export { IDuck, IReducer, IAction, ISelector, TState }

export interface IPool {
  readonly addDuck: (duck: IDuck) => void
  readonly addMiddleware: (middleware: Middleware) => void
  readonly addStream: (stream: IPoolStream) => void
  readonly preReducer: (reducer: IReducer) => void
  readonly postReducer: (reducer: IReducer) => void
  readonly build: (props: TPoolProps) => Store
  readonly reportError: IErrorReporter
  readonly setErrorReporter: (reporter: IErrorReporter) => void
  readonly store: Store
  readonly dispatch: IPoolDispatch
  readonly select: ISelector
  readonly fetch: (
    selector?: ISelector,
    resolver?: (selectedValue: any, resolveValue: (value: any) => void, prevSelectedValue: any) => void
  ) => Promise<any>
  readonly trigger: (
    selector?: ISelector,
    callback?: (selectedValue: any) => void,
    resolver?: (selectedValue: any, callback: (selectedValue: any) => void, prevSelectedValue: any) => void
  ) => Unsubscribe
  readonly reduce: IPoolReduce
  readonly ducks: IDuck[]
  readonly getDuckByName: (duckPath: TDuckPath) => IDuck
  readonly middlewares: Middleware[]
  readonly streams: IPoolStream[]
  readonly props: TPoolProps
}
export interface IPoolArgs {
  poolName?: string
  props?: TPoolProps
  ducks?: IDuck[]
  middlewares?: Middleware[]
  streams?: IPoolStream[]
  buildStore?: (
    props: TPoolProps,
    {
      refProps,
      refDucks,
      refReducers,
      refErrorReporter
    }: { refProps: TRefProps; refDucks: TRefDucks; refReducers: TRefReducers; refErrorReporter: TRefErrorReporter }
  ) => any
  buildRootReducer?: (
    ducks: IDuck[],
    {
      refProps,
      refReducers,
      refDucks,
      refErrorReporter
    }: { refProps: TRefProps; refReducers: TRefReducers; refDucks: TRefDucks; refErrorReporter: TRefErrorReporter }
  ) => IReducer
  connectReduxDevtoolsExtension?: boolean
}
export type TPoolProps = { [key: string]: any }

export type TDuckPath = string | [duckPoolName: string, duckName: string]

export interface IPoolDispatch {
  (action: IAction): ReturnType<Store['dispatch']>
  (duckPath: TDuckPath, actionName: string, payload: any): ReturnType<Store['dispatch']>
}
export interface IPoolError extends Error {
  poolName?: string
  actionName?: string
  duckPath?: TDuckPath
  dispatchedAction?: IAction
}

export interface IPoolReduce {
  (action: IAction): TState
  (state: TState, action: IAction): TState
}

export interface IPoolStream {
  readonly beforeBuild?: ({
    refDucks,
    refProps,
    refReducers,
    refErrorReporter
  }: {
    refDucks: TRefDucks
    refProps: TRefProps
    refReducers: TRefReducers
    refErrorReporter: TRefErrorReporter
  }) => void
  readonly middlewares?: ({
    refDucks,
    refProps,
    refReducers,
    refErrorReporter
  }: {
    refDucks: TRefDucks
    refProps: TRefProps
    refReducers: TRefReducers
    refErrorReporter: TRefErrorReporter
  }) => Middleware[]
  readonly afterBuild?: ({
    refStore,
    refDucks,
    refProps,
    refReducers,
    refErrorReporter
  }: {
    refStore: TRefStore
    refDucks: TRefDucks
    refProps: TRefProps
    refReducers: TRefReducers
    refErrorReporter: TRefErrorReporter
  }) => void
}

export interface IErrorReporter {
  (...args: any[]): void
}

export type TRefProps = { current: TPoolProps }
export type TRefDucks = { current: IDuck[]; map: { [poolName: string]: { [duckName: string]: IDuck } } }
export type TRefStore = { current: Store }
export type TRefReducers = { root: IReducer; pre: IReducer; post: IReducer }
export type TRefStreams = { current: IPoolStream[] }
export type TRefMiddlewares = { current: Middleware[] }
export type TRefErrorReporter = { current: IErrorReporter }

// this pool stream will send @@INIT action to every registered duck after build
const initDucksStream: IPoolStream = Object.freeze({
  afterBuild({ refStore, refDucks, refProps }) {
    refDucks.current.forEach(duck => {
      refStore.current.dispatch({ type: duck.mapActionType('@@INIT'), payload: refProps.current })
    })
  }
} as IPoolStream)

function mapDuck(map: { [poolName: string]: { [duckName: string]: IDuck } } = {}, duck: IDuck) {
  const { poolName, duckName } = duck
  if (null != poolName && null != duckName) {
    if (null == map[poolName]) {
      map[poolName] = {}
    }
    map[poolName][duckName] = duck
  }
  return map
}

// POOL
export default function Pool({
  poolName = 'pool',
  props: initProps = {},
  ducks: initDucks = [],
  middlewares: initMiddlewares = [],
  streams: initStreams = [],
  buildStore = () => {
    return {}
  },
  buildRootReducer,
  connectReduxDevtoolsExtension = true
}: IPoolArgs = {}) {
  const refProps: TRefProps = { current: initProps || {} }
  const refDucks: TRefDucks = {
    current: initDucks || [],
    map: (initDucks || []).reduce((map, duck) => mapDuck(map, duck), {})
  }
  const refStreams: TRefStreams = { current: (initStreams || []).concat([initDucksStream]) }
  const refMiddlewares: TRefMiddlewares = { current: initMiddlewares || [] }
  const refErrorReporter: TRefErrorReporter = {
    // eslint-disable-next-line no-console
    current: ('undefined' !== typeof console && console.error) || (() => void 0)
  }

  const addDuck: IPool['addDuck'] = function (duck) {
    refDucks.current.push(duck)
    refDucks.map = mapDuck(refDucks.map, duck)
  }

  const addMiddleware: IPool['addMiddleware'] = function (middleware) {
    refMiddlewares.current.push(middleware)
  }

  const addStream: IPool['addStream'] = function (stream) {
    refStreams.current.unshift(stream)
  }

  const setErrorReporter: IPool['setErrorReporter'] = function (reporter) {
    refErrorReporter.current = reporter
  }

  const reportError: IErrorReporter = function (...args) {
    if ('function' === typeof refErrorReporter.current) {
      refErrorReporter.current(...args)
    }
  }

  const refStore: TRefStore = { current: null }

  const getDuckByName: IPool['getDuckByName'] = function (duckPath) {
    if ('string' === typeof duckPath || Array.isArray(duckPath)) {
      const [duckPoolName, duckName] = 'string' === typeof duckPath ? [poolName, duckPath] : [duckPath[0], duckPath[1]]
      return refDucks.map[duckPoolName] ? refDucks.map[duckPoolName][duckName] : null
    } else {
      return null
    }
  }
  const getDispatchActionFromDispatchArgs: (args: IArguments) => IAction = function (args) {
    // dispatch(action)
    // dispatch(duckName, actionName, payload)
    // dispatch([poolName, duckName], actionName, payload)
    if (1 === args.length) {
      return args[0]
    } else if (args.length > 1) {
      const [duckPath, actionName, payload] = [args[0], args[1], args[2]]
      const duck = getDuckByName(duckPath)
      if (null == duck) {
        const error: IPoolError = new Error(
          `Received action '${actionName}' dispatch but duck '${duckPath}' is not found`
        )
        error.actionName = actionName
        error.duckPath = duckPath
        reportError(error, '@duckness/pool', 'dispatch')
        return null
      } else {
        const actionCreator = duck.action[actionName]
        if (null == actionCreator) {
          const error: IPoolError = new Error(
            `Received action dispatch but action '${actionName}' for duck '${duckPath}' is not found`
          )
          error.actionName = actionName
          error.duckPath = duckPath
          reportError(error, '@duckness/pool', 'dispatch')
          return null
        } else {
          return actionCreator(payload)
        }
      }
    } else {
      return null
    }
  }
  const dispatch: IPool['dispatch'] = function () {
    // eslint-disable-next-line prefer-rest-params
    const action = getDispatchActionFromDispatchArgs(arguments)
    if (null == action) {
      const error: IPoolError = new Error('Received action dispatch without action')
      error.poolName = poolName
      reportError(error, '@duckness/pool', 'dispatch')
    } else {
      if (refStore.current) {
        return refStore.current.dispatch(action)
      } else {
        const error: IPoolError = new Error('Received action dispatch but pool is not built yet')
        error.dispatchedAction = action
        error.poolName = poolName
        reportError(error, '@duckness/pool', 'dispatch', action)
      }
    }
    return void 0
  } as IPool['dispatch']

  const refReducers: TRefReducers = { root: null, pre: null, post: null }
  const reduce: IPool['reduce'] = function (stateOrAction: TState | IAction, andAction?: IAction) {
    if (void 0 === andAction && !refStore.current) {
      const error: IPoolError = new Error('Reducing state but pool is not built yet')
      error.dispatchedAction = stateOrAction as IAction
      error.poolName = poolName
      reportError(error, '@duckness/pool', 'reduce', stateOrAction)
      return stateOrAction
    }
    const state = void 0 === andAction ? refStore.current.getState() : stateOrAction
    const action: IAction = void 0 === andAction ? (stateOrAction as IAction) : andAction
    if (refReducers.root) {
      return refReducers.root(state, action)
    } else {
      const error: IPoolError = new Error('Reducing state but pool is not built yet')
      error.dispatchedAction = action
      error.poolName = poolName
      reportError(error, '@duckness/pool', 'reduce', action)
      return state
    }
  }

  const select: IPool['select'] = function (selector) {
    if (refStore.current) {
      return 'function' === typeof selector ? selector(refStore.current.getState()) : refStore.current.getState()
    } else {
      return void 0
    }
  }

  const fetch: IPool['fetch'] = function (selector, resolver) {
    return new Promise((resolve, reject) => {
      if (refStore.current) {
        let prevSelectedValue: any = void 0
        let resolved = false
        let unsubscribe: Unsubscribe = void 0
        const resolveValue = (value: unknown) => {
          if (unsubscribe) {
            unsubscribe()
          }
          resolved = true
          resolve(value)
        }
        const tryResolve = (currentState: TState) => {
          const selectedValue = 'function' === typeof selector ? selector(currentState) : currentState
          if ('function' === typeof resolver) {
            resolver(selectedValue, resolveValue, prevSelectedValue)
            prevSelectedValue = selectedValue
          } else if (void 0 !== selectedValue) {
            resolveValue(selectedValue)
          }
        }
        tryResolve(refStore.current.getState())
        if (!resolved) {
          unsubscribe = refStore.current.subscribe(() => {
            tryResolve(refStore.current.getState())
          })
        }
      } else {
        const error: IPoolError = new Error('Fetching state but pool is not built yet')
        error.poolName = poolName
        reportError(error, '@duckness/pool', 'fetch')
        reject(error)
      }
    })
  }

  const trigger: IPool['trigger'] = function (selector, callback, resolver) {
    if (refStore.current) {
      let prevSelectedValue: any = void 0
      const tryResolve = (currentState: TState) => {
        const selectedValue = 'function' === typeof selector ? selector(currentState) : currentState
        if ('function' === typeof resolver) {
          resolver(selectedValue, callback, prevSelectedValue)
          prevSelectedValue = selectedValue
        } else if (prevSelectedValue !== selectedValue) {
          callback(selectedValue)
        }
      }
      tryResolve(refStore.current.getState())
      return refStore.current.subscribe(() => {
        tryResolve(refStore.current.getState())
      })
    } else {
      const error: IPoolError = new Error('Fetching state but pool is not built yet')
      error.poolName = poolName
      reportError(error, '@duckness/pool', 'trigger')
      return void 0
    }
  }

  const setPreReducer: IPool['preReducer'] = function (reducer) {
    refReducers.pre = (state, action) => {
      try {
        return reducer(state, action)
      } catch (error) {
        try {
          error.dispatchedAction = action
          error.poolName = poolName
        } catch {
          // skip
        }
        reportError(error, '@duckness/pool', 'pre reducer')
        return state
      }
    }
  }
  const setPostReducer: IPool['postReducer'] = function (reducer) {
    refReducers.post = (state, action) => {
      try {
        return reducer(state, action)
      } catch (error) {
        try {
          error.dispatchedAction = action
          error.poolName = poolName
        } catch {
          // skip
        }
        reportError(error, '@duckness/pool', 'post reducer')
        return state
      }
    }
  }

  const build: IPool['build'] = function (props = refProps.current) {
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
                error.poolName = poolName
                error.duckPoolName = duck.poolName
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
      connectReduxDevtoolsExtension &&
      typeof window === 'object' &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
        : (x: any) => x
    const middlewares = refStreams.current
      .reduce(
        (streamMiddlewares, stream) =>
          stream.middlewares
            ? streamMiddlewares.concat(stream.middlewares({ refDucks, refProps, refReducers, refErrorReporter }) || [])
            : streamMiddlewares,
        []
      )
      .concat(refMiddlewares.current || [])

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

  const pool: IPool = {} as IPool

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
  Object.defineProperty(pool, 'select', { value: select, writable: false, enumerable: true })
  Object.defineProperty(pool, 'fetch', { value: fetch, writable: false, enumerable: true })
  Object.defineProperty(pool, 'trigger', { value: trigger, writable: false, enumerable: true })
  Object.defineProperty(pool, 'reduce', { value: reduce, writable: false, enumerable: true })
  Object.defineProperty(pool, 'ducks', {
    get() {
      return (refDucks.current || []).slice()
    },
    enumerable: true
  })
  Object.defineProperty(pool, 'getDuckByName', { value: getDuckByName, writable: false, enumerable: true })
  Object.defineProperty(pool, 'middlewares', {
    get() {
      return (refMiddlewares.current || []).slice()
    },
    enumerable: true
  })
  Object.defineProperty(pool, 'streams', {
    get() {
      return (refStreams.current || []).slice()
    },
    enumerable: true
  })
  Object.defineProperty(pool, 'props', {
    get() {
      return Object.assign({}, refProps.current || {})
    },
    enumerable: true
  })

  return pool
}
