import useRedux, { useDispatchAction as useReduxDispatchAction } from '@duckness/use-redux'

export default function usePool(pool, selector, shouldUpdate, shouldSelect) {
  return useRedux(pool.store, selector, shouldUpdate, shouldSelect)
}

export function useDispatchAction(pool, actionCreator, payloadTransformer) {
  return useReduxDispatchAction(pool.store, actionCreator, payloadTransformer)
}
