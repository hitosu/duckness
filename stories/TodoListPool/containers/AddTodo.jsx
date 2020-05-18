import React, { useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import TodoDuck from '../ducks/TodoDuck'

AddTodo.propTypes = {
  onAddTodo: PropTypes.func.isRequired
}
function AddTodo({ onAddTodo } = {}) {
  const refInput = useRef()

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

export default connect(null, dispatch => {
  return {
    onAddTodo: text => dispatch(TodoDuck.action.addTodo(text))
  }
})(AddTodo)
