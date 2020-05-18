import React from 'react'
import PropTypes from 'prop-types'
import Todo from './Todo'

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      completed: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  onToggleTodo: PropTypes.func.isRequired
}
export default function TodoList({ todos, onToggleTodo } = {}) {
  return (
    <ul>
      {todos.map(todo => (
        <Todo key={todo.id} {...todo} onClick={() => onToggleTodo(todo.id)} />
      ))}
    </ul>
  )
}
