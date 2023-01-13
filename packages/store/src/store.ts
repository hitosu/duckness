import { useEffect, useState, useRef } from 'react'

export type TState = any
export type TValue = any
export interface ISelector {
  (...sources: any[]): any
}
export interface IUpdater {
  (currentState: TState): TState
}
export interface IListener {
  (value: TValue): void
  selector?: (storeState: TState) => TValue
  shouldUpdate?: (nextValue: TValue, prevValue: TValue) => boolean
  shouldSelect?: (nextStoreState: TState, prevStoreState: TState) => boolean
  prevValue?: TValue
}
export type TUseStoreArgs = {
  updateOnMount?: IUpdater
  updateOnUnmount?: IUpdater
  selector?: IListener['selector']
  shouldSelect?: IListener['shouldSelect']
  shouldUpdate?: IListener['shouldUpdate']
  debounce?: number
}
export type TAction = (...args: any[]) => TState

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

  const listeners: Set<IListener> = new Set()

  function updateStore(updater: IUpdater) {
    const nextStoreState = updater(refStore.current)
    listeners.forEach(function (listener) {
      if (listener.shouldSelect && !listener.shouldSelect(nextStoreState, refStore.current)) {
        return
      }
      const nextValue = listener.selector ? listener.selector(nextStoreState) : nextStoreState
      if (null == listener.shouldUpdate || listener.shouldUpdate(nextValue, listener.prevValue)) {
        listener(nextValue)
        if (null != listener.shouldUpdate) {
          listener.prevValue = nextValue
        }
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
      listeners.add(listener)
      return function () {
        if (updateOnUnmount) updateStore(updateOnUnmount)
        listeners.delete(listener)
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
