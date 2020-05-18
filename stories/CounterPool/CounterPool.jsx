import React, { Suspense } from 'react'
import Pool from '@duckness/pool'

import CounterDuck from './ducks/CounterDuck'

const App = React.lazy(() => import('./components/App'))

function RootComponent() {
  return (
    <Suspense fallback="Loading...">
      <App />
    </Suspense>
  )
}

const CounterPool = Pool({
  buildStore: ({ initialCounter = 0 } = {}) => {
    return { counter: initialCounter }
  },
  renderRoot: RootComponent
})
CounterPool.addDuck(CounterDuck)

export default CounterPool
