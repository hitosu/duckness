import { useState, useEffect, useMemo, useCallback, useRef } from 'react'

/*
 * shouldUpdate:
 *   true - always update
 *   function - shouldUpdate(nextSelectedState, prevSelectedState)
 *   (default) - update if nextSelectedState !== prevSelectedState
 *
 * shouldSelect:
 *   true - always update
 *   function - shouldSelect(nextStoreState, prevStoreState)
 *   (default) - update if nextStoreState !== prevStoreState
 */

export default function useRedux(store, selector, shouldUpdate, shouldSelect) {
  const [selectedState, setSelectedState] = useState(() => selector(store.getState()))

  const refPrevStoreState = useRef(null)
  refPrevStoreState.current = useMemo(() => (true === shouldSelect ? null : store.getState()), [store, shouldSelect])

  const refPrevSelectedState = useRef(null)
  if (true !== shouldUpdate) {
    refPrevSelectedState.current = selectedState
  }

  const refSubscription = useRef(null)
  refSubscription.current = useCallback(
    nextStoreState => {
      if (
        true === shouldSelect ||
        ('function' === typeof shouldSelect && shouldSelect(nextStoreState, refPrevStoreState.current)) ||
        nextStoreState !== refPrevStoreState.current
      ) {
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
      if (true !== shouldSelect) {
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
