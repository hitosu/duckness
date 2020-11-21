import { useEffect, useState, useRef } from 'react'

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

  function useStore({
    updateOnMount,
    updateOnUnmount,
    selector,
    shouldSelect,
    shouldUpdate = whenChanged,
    debounce
  } = {}) {
    const [value, setValue] = useState(function () {
      return selector(updateOnMount ? updateStore(updateOnMount) : refStore.current)
    })

    const debounceDuration = useRef()
    debounceDuration.current = debounce
    const debounceTimer = useRef()

    useEffect(function () {
      const listener = function (nextValue) {
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

  function Consumer(props) {
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

  function getState(selector) {
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
