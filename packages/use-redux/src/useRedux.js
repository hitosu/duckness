import React, { useState, useEffect, useCallback, useRef } from 'react'

const UNSET_MARKER = {}

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
  const refPrevSelectedState = useRef(UNSET_MARKER)
  useEffect(() => {
    refPrevStoreState.current = customShouldSelect ? store.getState() : null
    if (customShouldUpdate) {
      let prevSelectedStateUpdated = false
      shouldUpdate(
        selectedState,
        UNSET_MARKER === refPrevSelectedState.current ? selectedState : refPrevSelectedState.current,
        prevSelectedState => {
          refPrevSelectedState.current = prevSelectedState
          prevSelectedStateUpdated = true
        }
      )
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
          (!customShouldUpdate && nextSelectedState !== refPrevSelectedState.current)
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

export function combineSelectors(selectorsMap, { selectedStatesEqual } = {}) {
  const selectorKeys = Object.keys(selectorsMap)
  const combinedSelectors = {
    selector: (...state) => {
      const selectedState = {}
      for (let i = 0; i < selectorKeys.length; i++) {
        const selectorKey = selectorKeys[i]
        selectedState[selectorKey] = selectorsMap[selectorKey](...state)
      }
      return selectedState
    },
    shouldUpdate: selectedStatesEqual
      ? (nextSelectedState, prevSelectedState, storePrevSelectedState) => {
          for (let i = 0; i < selectorKeys.length; i++) {
            const selectorKey = selectorKeys[i]
            if (!selectedStatesEqual(selectorKey, nextSelectedState[selectorKey], prevSelectedState[selectorKey])) {
              return true
            }
          }
          if (storePrevSelectedState) {
            storePrevSelectedState(prevSelectedState)
          }
          return false
        }
      : (nextSelectedState, prevSelectedState, storePrevSelectedState) => {
          for (let i = 0; i < selectorKeys.length; i++) {
            const selectorKey = selectorKeys[i]
            if (nextSelectedState[selectorKey] !== prevSelectedState[selectorKey]) {
              return true
            }
          }
          if (storePrevSelectedState) {
            storePrevSelectedState(prevSelectedState)
          }
          return false
        },
    areEqual: (nextSelectedState, prevSelectedState) =>
      !combinedSelectors.shouldUpdate(nextSelectedState, prevSelectedState)
  }
  return combinedSelectors
}

export function connect(store, selector, shouldUpdate, shouldSelect, dispatch = store.dispatch) {
  const emptyObject = {}
  const emptySelector = () => emptyObject

  return function (Component, mapToProps) {
    function ConnectedComponent(props) {
      const refProps = useRef(props)
      refProps.current = props
      const safeSelector = useCallback(
        selector ? state => selector(state, refProps.current) || emptyObject : emptySelector,
        []
      )
      const selected = useRedux(store, safeSelector, shouldUpdate, shouldSelect)
      const connectedProps = (mapToProps ? mapToProps(selected, props, dispatch) : selected) || emptyObject
      return <Component {...props} {...connectedProps} />
    }
    ConnectedComponent.displayName = `connect(${Component.displayName || Component.name || 'Component'})`
    return ConnectedComponent
  }
}
