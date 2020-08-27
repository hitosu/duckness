import { useState, useEffect, useMemo, useCallback, useRef } from 'react'

/*
 * shouldUpdate:
 *   true - always update
 *   function - update if shouldUpdate(nextSelectedState, prevSelectedState)
 *   (default) - update if nextSelectedState !== prevSelectedState
 *
 * shouldSelect:
 *   function - select if shouldSelect(nextStoreState, prevStoreState)
 *   (default) - always select
 */

export default function useRedux(store, selector, shouldUpdate, shouldSelect) {
  const [selectedState, setSelectedState] = useState(() => selector(store.getState()))

  const customShouldSelect = 'function' === typeof shouldSelect
  const refPrevStoreState = useRef(null)
  refPrevStoreState.current = useMemo(() => (customShouldSelect ? store.getState() : null), [store, customShouldSelect])

  const refPrevSelectedState = useRef(null)
  if (true !== shouldUpdate) {
    refPrevSelectedState.current = selectedState
  }

  const refSubscription = useRef(null)
  refSubscription.current = useCallback(
    nextStoreState => {
      if (!customShouldSelect || shouldSelect(nextStoreState, refPrevStoreState.current)) {
        const nextSelectedState = selector(nextStoreState)
        if (
          true === shouldUpdate ||
          ('function' === typeof shouldUpdate && shouldUpdate(nextSelectedState, refPrevSelectedState.current)) ||
          nextSelectedState !== refPrevSelectedState.current
        ) {
          setSelectedState(nextSelectedState)
          if (true !== shouldUpdate) {
            refPrevSelectedState.current = nextSelectedState
          }
        }
      }
      if (customShouldSelect) {
        refPrevStoreState.current = nextStoreState
      }
    },
    [selector, shouldUpdate, shouldSelect, customShouldSelect]
  )

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      refSubscription.current(store.getState())
    })
    return () => {
      unsubscribe()
    }
  }, [store])

  return selectedState
}

export function useDispatchAction(store, actionCreator, payloadTransformer) {
  return useCallback(
    payload =>
      void 0 === payloadTransformer
        ? store.dispatch(actionCreator(payload))
        : 'function' === typeof payloadTransformer
        ? store.dispatch(actionCreator(payloadTransformer(payload)))
        : store.dispatch(actionCreator(payloadTransformer)),
    [store, actionCreator, payloadTransformer]
  )
}

export function useDispatch(store, dispatcher, deps = []) {
  return useCallback((...args) => dispatcher(store.dispatch, ...args), [store, ...deps])
}
