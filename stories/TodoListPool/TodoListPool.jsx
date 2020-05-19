import React, { Suspense } from 'react'
import Pool from '@duckness/pool'
import ReactReduxPool from '@duckness/react-redux-pool'

import TodoDuck from './ducks/TodoDuck'
import VisibilityFilterDuck from './ducks/VisibilityFilterDuck'

const App = React.lazy(() => import('./components/App'))

function RootComponent() {
  return (
    <Suspense fallback="Loading...">
      <App />
    </Suspense>
  )
}

const TodoListPool = ReactReduxPool(
  Pool({
    buildStore: () => {
      return { todos: [] }
    }
  }),
  RootComponent
)
TodoListPool.addDuck(TodoDuck)
TodoListPool.addDuck(VisibilityFilterDuck)

export default TodoListPool
