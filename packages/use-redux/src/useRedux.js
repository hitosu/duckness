import { useState, useEffect } from 'react'

export default function useRedux(store, selector, shouldUpdate, shouldSelect) {
  const [state, setState] = useState(() => selector(store.getState()))

  useEffect(() => {
    const refLastState = { current: shouldSelect ? state : null }
    const refLastSelected = { current: shouldUpdate ? selector(state) : null }
    const refUnsubscribe = {
      current: store.subscribe(() => {
        const currentState = store.getState()
        if (!shouldSelect || shouldSelect(currentState, refLastState.current)) {
          const selected = selector(currentState)
          if (!shouldUpdate || shouldUpdate(selected, refLastSelected.current)) {
            setState(selected)
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

  return [state, store.dispatch]
}
