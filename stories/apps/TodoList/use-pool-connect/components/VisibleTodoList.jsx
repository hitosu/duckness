import { connect, combineSelectors } from '@duckness/use-pool'

import TodoList from '../../components/TodoList'
import TodoListPool, { TodoDuck } from '../TodoListPool'

const { selector, shouldUpdate } = combineSelectors({
  todos: state => TodoDuck.select.visibleTodos(state)
})

export default connect(
  TodoListPool,
  selector,
  shouldUpdate
)(TodoList, (selected, _props, dispatch) => {
  return {
    ...selected,
    onToggleTodo: id => void dispatch('todo', 'toggleTodo', id)
  }
})
