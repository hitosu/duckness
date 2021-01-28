import { connect, combineSelectors } from '@duckness/use-pool'

import TodoList from '../../components/TodoList'
import TodoListPool, { TodoDuck } from '../TodoListPool'

const { selector, shouldUpdate } = combineSelectors({
  todos: state => TodoDuck.select.visibleTodos(state)
})

const onToggleTodo = id => void TodoListPool.dispatch('todo', 'toggleTodo', id)

export default connect(
  TodoListPool,
  selector,
  shouldUpdate
)(TodoList, (selected, props) => {
  return {
    ...props,
    ...selected,
    onToggleTodo
  }
})
