import useRedux, {
  useDispatchAction as useReduxDispatchAction,
  useDispatch as useReduxDispatch
} from '@duckness/use-redux'

export default function usePool(pool, selector, shouldUpdate, shouldSelect) {
  return useRedux(pool.store, selector, shouldUpdate, shouldSelect)
}

export function useDispatch(pool, dispatcher) {
  return useReduxDispatch(pool.store, dispatcher)
}

export function useDispatchAction(pool, actionCreator, payloadTransformer) {
  return useReduxDispatchAction(pool.store, actionCreator, payloadTransformer)
}
