import React, { Suspense } from 'react'
import Pool from '@duckness/pool'
import ReactReduxPool from '@duckness/react-redux-pool'
import PoolSagaStream from '@duckness/pool-saga-stream'

import CounterDuck from '../../../ducks/Counter/CounterDuck'
export { CounterDuck }

const App = React.lazy(() => import('./components/App'))

function RootComponent() {
  return (
    <Suspense fallback="Loading...">
      <App />
    </Suspense>
  )
}

const CounterPool = ReactReduxPool(
  Pool({
    buildStore: ({ initialCounter = 0 } = {}) => {
      return { counter: initialCounter }
    }
  }),
  RootComponent
)
CounterPool.addDuck(CounterDuck)
CounterPool.addStream(PoolSagaStream())

CounterPool.preReducer(state => ((state.actionsDispatched = CounterDuck.select.actionsDispatched(state) + 1), state))
CounterPool.postReducer(state => ((state.lastActionDispatchedAt = Date.now()), state))

export default CounterPool
