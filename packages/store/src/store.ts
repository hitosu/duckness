import { useEffect, useState, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/ban-types
export type TState<S = {}> = S
export type TSelectedValue<R = unknown> = R | null | undefined

export interface ISelector<S, R> {
  (source: TState<S>): TSelectedValue<R>
  (...sources: unknown[]): TSelectedValue<R>
}

export interface IUpdater<S> {
  (currentState: TState<S>): TState<S>
}

export interface IListener<S = unknown, R = unknown> {
  (value: TSelectedValue<R>): void
  selector?: (storeState: TState<S>) => TSelectedValue<R>
  shouldUpdate?: (nextValue: TSelectedValue<R>, prevValue: TSelectedValue<R>) => boolean
  shouldSelect?: (nextStoreState: TState<S>, prevStoreState: TState<S>) => boolean
  prevValue?: TSelectedValue<R>
}

export interface TUseStoreArgs<S = unknown, R = unknown> {
  updateOnMount?: IUpdater<S>
  updateOnUnmount?: IUpdater<S>
  selector?: IListener<S, R>['selector']
  shouldSelect?: IListener<S>['shouldSelect']
  shouldUpdate?: IListener<S, R>['shouldUpdate']
  debounce?: number
}

export interface TAction<S = unknown> {
  (state: TState<S>): TState<S>
  (...args: unknown[]): TState<S>
}

export type CreateStoreArguments<S = unknown> = {
  initState?: TState<S>
  actions?: Record<string, TAction<S>>
  isAsync?: boolean
}

export type CreateStoreReturnType<S = unknown> = Readonly<{
  useStore: <R>({
    updateOnMount,
    updateOnUnmount,
    selector,
    shouldSelect,
    shouldUpdate,
    debounce
  }?: TUseStoreArgs<S, R>) => R
  Consumer: (
    props: TUseStoreArgs & {
      children: (value: TSelectedValue) => React.ReactNode
    }
  ) => React.ReactNode
  actions: {
    [actionName: string]: TAction
  }
  updateStore: (updater: IUpdater<S>) => TState<S>
  getState: {
    (): TState<S>
    <R = unknown>(selector: ISelector<S, R>): TSelectedValue<R>
  }
  subscribe: (listener: IListener) => () => void
  destroy: () => void
}>

export function selectAll(value: TSelectedValue) {
  return value
}

export function always() {
  return true
}

export function whenChanged(a: TSelectedValue, b: TSelectedValue) {
  return a !== b
}

const MAX_EXECUTION_TIME = 1000 / 12

export default function createStore<S>({
  initState = {} as TState<S>,
  actions = {},
  isAsync = false
}: CreateStoreArguments<S> = {}): CreateStoreReturnType<S> {
  const refStore: { current: TState<S> } = {
    current: initState
  }

  const listeners: Set<IListener> = new Set()

  function updateStore(updater: IUpdater<S>) {
    const nextStoreState = updater(refStore.current)
    const queue = [] as [IListener, TSelectedValue][]
    listeners.forEach(function (listener) {
      if (listener.shouldSelect && !listener.shouldSelect(nextStoreState, refStore.current)) {
        return
      }
      const nextValue = listener.selector ? listener.selector(nextStoreState) : nextStoreState
      if (null == listener.shouldUpdate || listener.shouldUpdate(nextValue, listener.prevValue)) {
        if (isAsync) {
          queue.push([listener, nextValue])
        } else {
          listener(nextValue)
        }
        if (null != listener.shouldUpdate) {
          listener.prevValue = nextValue
        }
      }
    })
    if (isAsync && queue.length) {
      requestAnimationFrame(() => {
        executeQueue(queue)
      })
    }
    refStore.current = nextStoreState
    return refStore.current
  }

  function executeQueue(queue: [IListener, TSelectedValue][]) {
    const start = performance.now()
    let next = queue.shift()
    while (next && performance.now() - start < MAX_EXECUTION_TIME) {
      const listener = next[0]
      const nextValue = next[1]
      listener(nextValue)
      next = queue.shift()
    }
    if (queue.length) {
      requestAnimationFrame(function () {
        executeQueue(queue)
      })
    }
  }

  function useStore<R>({
    updateOnMount,
    updateOnUnmount,
    selector,
    shouldSelect,
    shouldUpdate = whenChanged,
    debounce
  }: TUseStoreArgs<S, R> = {}) {
    const [value, setValue] = useState(function () {
      return updateOnMount ? selector(updateStore(updateOnMount)) : selector(refStore.current)
    })

    const debounceDuration = useRef<number>()
    debounceDuration.current = debounce
    const debounceTimer = useRef<ReturnType<typeof setTimeout>>()

    useEffect(function () {
      const listener = function (nextValue: TSelectedValue<R>) {
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current)
        }
        if (null == debounceDuration.current) {
          setValue(nextValue)
        } else {
          debounceTimer.current = setTimeout(function () {
            debounceTimer.current = null
            setValue(nextValue)
          }, debounceDuration.current)
        }
      }
      listener.selector = selector
      listener.shouldSelect = shouldSelect
      listener.shouldUpdate = shouldUpdate
      listeners.add(listener)
      return function () {
        if (updateOnUnmount) {
          updateStore(updateOnUnmount)
        }
        listeners.delete(listener)
      }
    }, [])

    return value
  }

  function Consumer<R>(props: TUseStoreArgs<S, R> & { children: (value: TSelectedValue<R>) => React.ReactNode }) {
    const value = useStore({
      updateOnMount: props.updateOnMount,
      updateOnUnmount: props.updateOnUnmount,
      selector: props.selector,
      shouldSelect: props.shouldSelect,
      shouldUpdate: props.shouldUpdate,
      debounce: props.debounce
    })

    return props.children(value)
  }

  const boundActions: { [actionName: string]: TAction } = {}
  Object.keys(actions).forEach(function (actionName) {
    boundActions[actionName] = function (...args) {
      updateStore(function (store: TState) {
        return actions[actionName].apply(store, args) || store
      })
    }
  })

  function destroy() {
    listeners.clear()
  }

  function subscribe(listener: IListener) {
    listeners.add(listener)
    return function () {
      listeners.delete(listener)
    }
  }

  function getState<R>(selector: ISelector<S, R>) {
    return selector ? selector(refStore.current) : refStore.current
  }

  return Object.freeze({
    useStore,
    Consumer,
    actions: boundActions,
    updateStore,
    getState,
    subscribe,
    destroy
  } as CreateStoreReturnType<S>)
}
