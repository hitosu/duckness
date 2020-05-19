import React, { Suspense } from 'react'
import Pool from '@duckness/pool'
import ReactReduxPool from '@duckness/react-redux-pool'

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

export default CounterPool
