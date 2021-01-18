import React, { Suspense } from 'react'
import Pool from '@duckness/pool'
import PoolEpicStream from '@duckness/pool-epic-stream'

import CounterDuck from '../../../ducks/Counter/CounterEpicDuck'
export { CounterDuck }

const CounterPool = Pool({
  buildStore: ({ initialCounter = 0 } = {}) => {
    return { counter: initialCounter }
  }
})
CounterPool.addDuck(CounterDuck)
CounterPool.addStream(PoolEpicStream())

CounterPool.preReducer(state => ((state.actionsDispatched = CounterDuck.select.actionsDispatched(state) + 1), state))
CounterPool.postReducer(state => ((state.lastActionDispatchedAt = Date.now()), state))

export default CounterPool

const App = React.lazy(() => import('./components/App'))
export function render() {
  return (
    <Suspense fallback="Loading...">
      <App />
    </Suspense>
  )
}
