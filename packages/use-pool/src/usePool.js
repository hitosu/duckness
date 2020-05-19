import useRedux, { useDispatch as useReduxDispatch } from '@duckness/use-redux'

export default function usePool(pool, selector, shouldUpdate, shouldSelect) {
  return useRedux(pool.store, selector, shouldUpdate, shouldSelect)
}

export function useDispatch(pool, actionCreator) {
  return useReduxDispatch(pool.store, actionCreator)
}
