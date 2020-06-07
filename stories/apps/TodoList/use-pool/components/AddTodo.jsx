import React, { useRef, useCallback } from 'react'
import { useDispatchAction } from '@duckness/use-pool'

import TodoListPool, { TodoDuck } from '../TodoListPool'

export default function AddTodo() {
  const refInput = useRef()

  const onAddTodo = useDispatchAction(TodoListPool, TodoDuck.action.addTodo)

  const onSubmit = useCallback(
    event => {
      event.preventDefault()
      const input = refInput.current
      if (!input || !input.value.trim()) {
        return
      }
      onAddTodo(refInput.current.value)
      refInput.current.value = ''
    },
    [refInput.current]
  )

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="add todo" ref={refInput} />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  )
}
