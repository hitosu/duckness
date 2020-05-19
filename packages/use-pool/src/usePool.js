import useRedux from '@duckness/use-redux'

export default function usePool(pool, selector, shouldUpdate, shouldSelect) {
  return useRedux(pool.store, selector, shouldUpdate, shouldSelect)
}
