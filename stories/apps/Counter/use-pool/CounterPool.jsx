import React, { Suspense } from 'react'
import Pool from '@duckness/pool'

import CounterDuck from '../../../ducks/Counter/CounterDuck'
export { CounterDuck }

const CounterPool = Pool({
  buildStore: ({ initialCounter = 0 } = {}) => {
    return { counter: initialCounter }
  }
})
CounterPool.addDuck(CounterDuck)

export default CounterPool

const App = React.lazy(() => import('./components/App'))
export function render() {
  return (
    <Suspense fallback="Loading...">
      <App />
    </Suspense>
  )
}
