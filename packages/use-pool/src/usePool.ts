import useRedux, {
  useDispatchAction as useReduxDispatchAction,
  useDispatch as useReduxDispatch,
  connect as useReduxConnect,
  combineSelectors,
  TShouldUpdate,
  TShouldSelect,
  ISelector,
  TActionCreator,
  TPayloadTransformer,
  TDispatcher
} from '@duckness/use-redux'
import { IPool } from '@duckness/pool'

export { TShouldUpdate, TShouldSelect, ISelector, TActionCreator, TPayloadTransformer, TDispatcher }

export default function usePool(
  pool: IPool,
  selector: ISelector,
  shouldUpdate: TShouldUpdate,
  shouldSelect: TShouldSelect
) {
  return useRedux(pool.store, selector, shouldUpdate, shouldSelect)
}

export function useDispatchAction(pool: IPool, actionCreator: TActionCreator, payloadTransformer: TPayloadTransformer) {
  return useReduxDispatchAction(pool.store, actionCreator, payloadTransformer)
}

export function useDispatch(pool: IPool, dispatcher: TDispatcher, deps: any[] = []) {
  return useReduxDispatch(pool.store, dispatcher, deps)
}

export function connect(
  pool: IPool,
  selector: ISelector,
  shouldUpdate: TShouldUpdate,
  shouldSelect: TShouldSelect,
  dispatch = pool.dispatch
) {
  return useReduxConnect(pool.store, selector, shouldUpdate, shouldSelect, dispatch)
}

export { combineSelectors }
