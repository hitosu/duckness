import * as React from 'react'
import { Store, Action } from 'redux'

export type TSelectedState = any
export type TStoreState = any
export interface ISelector {
  (...sources: any[]): any
}
export type TActionCreator = (payload: any) => Action
export type TPayloadTransformer = ((Action: any) => Action) | any
export type TDispatcher = (dispatch: Store['dispatch'], ...args: any[]) => void

/*
 * shouldUpdate:
 *   true - always update
 *   function - update if true == shouldUpdate(nextSelectedState, prevSelectedState, ?storePrevSelectedState(prevSelectedState))
 *   (default) - update if nextSelectedState !== prevSelectedState
 *
 */
export type TShouldUpdate =
  | boolean
  | ((
      nextSelectedState: TSelectedState,
      prevSelectedState: TSelectedState,
      storePrevSelectedState?: (prevSelectedState: TSelectedState) => void
    ) => boolean)

/*
 * shouldSelect:
 *   function - select if true == shouldSelect(nextStoreState, prevStoreState)
 *   (default) - always select
 */
export type TShouldSelect = (nextStoreState: TStoreState, prevStoreState: TStoreState) => boolean

const UNSET_MARKER = {}

export default function useRedux(
  store: Store,
  selector: ISelector,
  shouldUpdate: TShouldUpdate,
  shouldSelect: TShouldSelect
) {
  const [{ selectedState }, setSelectedState] = React.useState(() => {
    return { selectedState: selector(store.getState()) }
  })

  const customShouldSelect = 'function' === typeof shouldSelect
  const customShouldUpdate = 'function' === typeof shouldUpdate

  const refPrevStoreState = React.useRef<TStoreState>(void 0)
  const refPrevSelectedState = React.useRef<TSelectedState>(UNSET_MARKER)
  React.useEffect(() => {
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

  const refSubscription = React.useRef<(nextStoreState: TStoreState) => void>(null)
  refSubscription.current = React.useCallback(
    (nextStoreState: TStoreState) => {
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

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      refSubscription.current(store.getState())
    })
    return () => {
      unsubscribe()
    }
  }, [store])

  return selectedState
}

export function useDispatchAction(
  store: Store,
  actionCreator: TActionCreator,
  payloadTransformer?: TPayloadTransformer
) {
  return React.useCallback(
    payload =>
      void 0 === payloadTransformer
        ? store.dispatch(actionCreator(payload))
        : 'function' === typeof payloadTransformer
        ? store.dispatch(actionCreator(payloadTransformer(payload)))
        : store.dispatch(actionCreator(payloadTransformer)),
    [store, actionCreator, payloadTransformer]
  )
}

export function useDispatch(store: Store, dispatcher: TDispatcher, deps: any[] = []) {
  return React.useCallback((...args) => dispatcher(store.dispatch, ...args), [store, ...deps])
}

export function combineSelectors(
  selectorsMap: { [key: string]: ISelector },
  {
    selectedStatesEqual
  }: {
    selectedStatesEqual?: (
      selectorKey: string,
      nextSelectedState: TSelectedState,
      prevSelectedState: TSelectedState
    ) => boolean
  } = {}
) {
  const selectorKeys = Object.keys(selectorsMap)
  const combinedSelectors: {
    selector: ISelector
    shouldUpdate: Exclude<TShouldUpdate, boolean>
    areEqual: (nextSelectedState: TSelectedState, prevSelectedState: TSelectedState) => boolean
  } = {
    selector: (...sources) => {
      const selectedState: { [key: string]: TSelectedState } = {}
      for (let i = 0; i < selectorKeys.length; i++) {
        const selectorKey = selectorKeys[i]
        selectedState[selectorKey] = selectorsMap[selectorKey](...sources)
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

export function connect(
  store: Store,
  selector: ISelector,
  shouldUpdate: TShouldUpdate,
  shouldSelect: TShouldSelect,
  dispatch = store.dispatch
) {
  const emptyObject = {}
  const emptySelector = () => emptyObject

  return function (
    Component: React.ComponentType,
    mapToProps?: (selected: TSelectedState, props: any, dispatch: typeof store.dispatch) => any
  ) {
    function ConnectedComponent(props: any) {
      const refProps = React.useRef<any>(props)
      refProps.current = props
      const safeSelector = React.useCallback(
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
