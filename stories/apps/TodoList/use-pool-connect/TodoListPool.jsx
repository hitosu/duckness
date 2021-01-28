import React, { Suspense } from 'react'
import Pool from '@duckness/pool'

import TodoDuck from '../../../ducks/TodoList/TodoDuck'
import VisibilityFilterDuck from '../../../ducks/TodoList/VisibilityFilterDuck'
export { TodoDuck, VisibilityFilterDuck }

const TodoListPool = Pool({ poolName: 'todo-list-pool' })
TodoListPool.addDuck(TodoDuck)
TodoListPool.addDuck(VisibilityFilterDuck)

export default TodoListPool

const App = React.lazy(() => import('./components/App'))
export function render() {
  return (
    <Suspense fallback="Loading...">
      <App />
    </Suspense>
  )
}
