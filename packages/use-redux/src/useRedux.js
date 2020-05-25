import { useState, useEffect, useCallback } from 'react'

export default function useRedux(store, selector, shouldUpdate, shouldSelect) {
  const [selectedState, setSelectedState] = useState(() => selector(store.getState()))

  useEffect(() => {
    const refLastState = { current: shouldSelect ? store.getState() : null }
    const refLastSelected = { current: shouldUpdate ? selectedState : null }
    const refUnsubscribe = {
      current: store.subscribe(() => {
        const currentState = store.getState()
        if (!shouldSelect || shouldSelect(currentState, refLastState.current)) {
          const selected = selector(currentState)
          if (!shouldUpdate || shouldUpdate(selected, refLastSelected.current)) {
            setSelectedState(selected)
          }
          if (shouldUpdate) {
            refLastSelected.current = selected
          }
        }
        if (shouldSelect) {
          refLastState.current = currentState
        }
      })
    }
    return () => {
      refUnsubscribe.current()
    }
  }, [store, selector, shouldUpdate, shouldSelect])

  return [selectedState, store.dispatch]
}

export function useDispatch(store, actionCreator) {
  return useCallback((...args) => store.dispatch(actionCreator(...args)), [store, actionCreator])
}
