import { useEffect, useState, useRef } from 'react'

export type TState = unknown
export type TValue = unknown
export interface ISelector {
  (...sources: unknown[]): unknown
}
export interface IUpdater {
  (currentState: TState): TState
}
export interface IListener {
  (value: TValue): void
  selector?: (storeState: TState) => TValue
  shouldUpdate?: (nextValue: TValue, prevValue: TValue) => boolean
  shouldSelect?: (nextStoreState: TState, prevStoreState: TState) => boolean
  async?: boolean
  prevValue?: TValue
}
export type TUseStoreArgs = {
  updateOnMount?: IUpdater
  updateOnUnmount?: IUpdater
  selector?: IListener['selector']
  shouldSelect?: IListener['shouldSelect']
  shouldUpdate?: IListener['shouldUpdate']
  debounce?: number
  async?: boolean
}
export type TAction = (...args: unknown[]) => TState

export function selectAll(value: TValue) {
  return value
}

export function always() {
  return true
}

export function whenChanged(a: TValue, b: TValue) {
  return a !== b
}

export default function createStore({
  initState = {},
  actions = {}
}: { initState?: TState; actions?: { [actionName: string]: TAction } } = {}) {
  const refStore = {
    current: initState
  }

  const listeners = new Set<IListener>()
  const asyncListeners = new Set<IListener>()
  let isRunningAsyncListeners = false
  let asyncListenersProcessingTime = 0
  function runAsyncListeners() {
    if (!isRunningAsyncListeners) {
      isRunningAsyncListeners = true
      requestAnimationFrame(function () {
        let listener: IListener = null
        while ((listener = asyncListeners.values().next().value)) {
          const start = performance.now()
          try {
            const nextValue = listener.selector ? listener.selector(refStore.current) : refStore.current
            if (null == listener.shouldUpdate || listener.shouldUpdate(nextValue, listener.prevValue)) {
              listener(nextValue)
            }
            if (null != listener.shouldUpdate) {
              listener.prevValue = nextValue
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error)
          }
          asyncListeners.delete(listener)
          const end = performance.now()
          asyncListenersProcessingTime += end - start
          if (asyncListenersProcessingTime > 14) {
            asyncListenersProcessingTime = 0
            isRunningAsyncListeners = false
            runAsyncListeners()
            break
          }
        }
        asyncListenersProcessingTime = 0
        isRunningAsyncListeners = false
      })
    }
  }

  function updateStore(updater: IUpdater) {
    const nextStoreState = updater(refStore.current)
    listeners.forEach(function (listener) {
      try {
        if (listener.shouldSelect && !listener.shouldSelect(nextStoreState, refStore.current)) {
          return
        }
        if (listener.async) {
          asyncListeners.add(listener)
          runAsyncListeners()
        } else {
          const nextValue = listener.selector ? listener.selector(nextStoreState) : nextStoreState
          if (null == listener.shouldUpdate || listener.shouldUpdate(nextValue, listener.prevValue)) {
            listener(nextValue)
          }
          if (null != listener.shouldUpdate) {
            listener.prevValue = nextValue
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    })
    refStore.current = nextStoreState
    return refStore.current
  }

  function useStore({
    updateOnMount,
    updateOnUnmount,
    selector,
    shouldSelect,
    shouldUpdate = whenChanged,
    async = false,
    debounce
  }: TUseStoreArgs = {}) {
    const [value, setValue] = useState(function () {
      return selector(updateOnMount ? updateStore(updateOnMount) : refStore.current)
    })

    const debounceDuration = useRef<number>()
    debounceDuration.current = debounce
    const debounceTimer = useRef<ReturnType<typeof setTimeout>>()

    useEffect(function () {
      const listener = function (nextValue: TValue) {
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
      listener.async = async
      listeners.add(listener)
      return function () {
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current)
          debounceTimer.current = null
        }
        if (updateOnUnmount) updateStore(updateOnUnmount)
        listeners.delete(listener)
        asyncListeners.delete(listener)
      }
    }, [])

    return value
  }

  function Consumer(props: TUseStoreArgs & { children: (value: TValue) => React.ReactNode }) {
    const value = useStore({
      updateOnMount: props.updateOnMount,
      updateOnUnmount: props.updateOnUnmount,
      selector: props.selector,
      shouldSelect: props.shouldSelect,
      shouldUpdate: props.shouldUpdate,
      debounce: props.debounce,
      async: props.async
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

  function getState(selector: ISelector) {
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
  })
}
