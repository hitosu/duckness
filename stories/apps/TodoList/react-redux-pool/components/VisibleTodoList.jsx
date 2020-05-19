import { connect } from 'react-redux'
import TodoList from '../../components/TodoList'
import { TodoDuck } from '../TodoListPool'

export default connect(
  state => {
    return {
      todos: TodoDuck.select.visibleTodos(state)
    }
  },
  dispatch => {
    return {
      onToggleTodo: id => dispatch(TodoDuck.action.toggleTodo(id))
    }
  }
)(TodoList)
