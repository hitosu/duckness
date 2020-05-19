import React, { Suspense } from 'react'
import Pool from '@duckness/pool'
import ReactReduxPool from '@duckness/react-redux-pool'

import TodoDuck from '../../../ducks/TodoList/TodoDuck'
import VisibilityFilterDuck from '../../../ducks/TodoList/VisibilityFilterDuck'
export { TodoDuck, VisibilityFilterDuck }

const TodoListPool = ReactReduxPool(Pool(), RootComponent)
TodoListPool.addDuck(TodoDuck)
TodoListPool.addDuck(VisibilityFilterDuck)

export default TodoListPool

const App = React.lazy(() => import('./components/App'))
function RootComponent() {
  return (
    <Suspense fallback="Loading...">
      <App />
    </Suspense>
  )
}
