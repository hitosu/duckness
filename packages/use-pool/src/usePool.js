import useRedux, {
  useDispatchAction as useReduxDispatchAction,
  useDispatch as useReduxDispatch,
  combineSelectors
} from '@duckness/use-redux'

export default function usePool(pool, selector, shouldUpdate, shouldSelect) {
  return useRedux(pool.store, selector, shouldUpdate, shouldSelect)
}

export function useDispatchAction(pool, actionCreator, payloadTransformer) {
  return useReduxDispatchAction(pool.store, actionCreator, payloadTransformer)
}

export function useDispatch(pool, dispatcher, deps) {
  return useReduxDispatch(pool.store, dispatcher, deps)
}

export { combineSelectors }
