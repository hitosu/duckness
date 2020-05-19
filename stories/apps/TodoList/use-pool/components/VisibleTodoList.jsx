import React from 'react'
import usePool, { useDispatch } from '@duckness/use-pool'

import TodoList from '../../components/TodoList'
import TodoListPool, { TodoDuck } from '../TodoListPool'

export default function VisibleTodoList() {
  const [todos] = usePool(TodoListPool, TodoDuck.select.visibleTodos)
  const onToggleTodo = useDispatch(TodoListPool, TodoDuck.action.toggleTodo)

  return <TodoList todos={todos} onToggleTodo={onToggleTodo} />
}
