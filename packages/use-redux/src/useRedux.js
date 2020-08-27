import { useState, useEffect, useCallback, useRef } from 'react'

/*
 * shouldUpdate:
 *   true - always update
 *   function - update if true == shouldUpdate(nextSelectedState, prevSelectedState, ?storePrevSelectedState(prevSelectedState))
 *   (default) - update if nextSelectedState !== prevSelectedState
 *
 * shouldSelect:
 *   function - select if true == shouldSelect(nextStoreState, prevStoreState)
 *   (default) - always select
 */

export default function useRedux(store, selector, shouldUpdate, shouldSelect) {
  const [{ selectedState }, setSelectedState] = useState(() => {
    return { selectedState: selector(store.getState()) }
  })

  const customShouldSelect = 'function' === typeof shouldSelect
  const customShouldUpdate = 'function' === typeof shouldUpdate

  const refPrevStoreState = useRef(void 0)
  const refPrevSelectedState = useRef(void 0)
  useEffect(() => {
    refPrevStoreState.current = customShouldSelect ? store.getState() : null
    if (customShouldUpdate) {
      let prevSelectedStateUpdated = false
      shouldUpdate(selectedState, refPrevSelectedState.current, prevSelectedState => {
        refPrevSelectedState.current = prevSelectedState
        prevSelectedStateUpdated = true
      })
      if (!prevSelectedStateUpdated) {
        refPrevSelectedState.current = selectedState
      }
    } else if (true !== shouldUpdate) {
      refPrevSelectedState.current = selectedState
    }
  }, [store, selector, shouldUpdate, shouldSelect])

  const refSubscription = useRef(null)
  refSubscription.current = useCallback(
    nextStoreState => {
      if (!customShouldSelect || shouldSelect(nextStoreState, refPrevStoreState.current)) {
        const nextSelectedState = selector(nextStoreState)
        let prevSelectedStateUpdated = false
        if (
          true === shouldUpdate ||
          (customShouldUpdate &&
            shouldUpdate(nextSelectedState, refPrevSelectedState.current, prevSelectedState => {
              refPrevSelectedState.current = prevSelectedState
              prevSelectedStateUpdated = true
            })) ||
          nextSelectedState !== refPrevSelectedState.current
        ) {
          setSelectedState({ selectedState: nextSelectedState })
          if (!prevSelectedStateUpdated && true !== shouldUpdate) {
            refPrevSelectedState.current = nextSelectedState
          }
        }
      }
      if (customShouldSelect) {
        refPrevStoreState.current = nextStoreState
      }
    },
    [selector, shouldUpdate, shouldSelect]
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
