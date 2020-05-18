import { useEffect, useState } from 'react'

export function selectAll(value) {
  return value
}

export function always() {
  return true
}

export function whenChanged(a, b) {
  return a !== b
}

export default function createStore({ initState = {}, actions = {} } = {}) {
  const refStore = {
    current: initState
  }

  const listeners = new Set()

  function updateStore(updater) {
    const nextStore = updater(refStore.current)
    listeners.forEach(function (listener) {
      if (listener.shouldSelect && !listener.shouldSelect(nextStore, refStore.current)) {
        return
      }
      const nextValue = listener.selector ? listener.selector(nextStore) : nextStore
      if (null == listener.shouldUpdate || listener.shouldUpdate(nextValue, listener.prevValue)) {
        listener(nextValue)
        if (null != listener.shouldUpdate) {
          listener.prevValue = nextValue
        }
      }
    })
    refStore.current = nextStore
    return refStore.current
  }

  function useStore({ updateOnMount, updateOnUnmount, selector, shouldSelect, shouldUpdate = whenChanged } = {}) {
    const [value, setValue] = useState(function () {
      return selector(updateOnMount ? updateStore(updateOnMount) : refStore.current)
    })

    useEffect(function () {
      const listener = function (nextValue) {
        setValue(nextValue)
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

  function Consumer(props) {
    const value = useStore({
      updateOnMount: props.updateOnMount,
      updateOnUnmount: props.updateOnUnmount,
      selector: props.selector,
      shouldSelect: props.shouldSelect,
      shouldUpdate: props.shouldUpdate
    })

    return props.children(value)
  }

  const boundActions = {}
  Object.keys(actions).forEach(function (actionName) {
    boundActions[actionName] = function (...args) {
      updateStore(function (store) {
        return actions[actionName].apply(store, args) || store
      })
    }
  })

  function destroy() {
    listeners.clear()
  }

  function subscribe(listener) {
    listeners.add(listener)
    return function () {
      listeners.delete(listener)
    }
  }

  return Object.freeze({
    useStore,
    Consumer,
    actions: boundActions,
    updateStore,
    subscribe,
    destroy
  })
}
