import React, { Component } from 'react'

import TodoListPool from '../TodoListPool'

export default class AddTodo extends Component {
  constructor(props) {
    super(props)
    this.refInput = React.createRef()
    this.onSubmit = this.onSubmit.bind(this)
  }

  onAddTodo(text) {
    TodoListPool.dispatch('todo', 'addTodo', text)
  }

  onSubmit(event) {
    event.preventDefault()
    const input = this.refInput.current
    if (!input || !input.value.trim()) {
      return
    }
    this.onAddTodo(this.refInput.current.value)
    this.refInput.current.value = ''
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input type="text" placeholder="add todo" aria-label="add todo" ref={this.refInput} />
          <button type="submit">Add Todo</button>
        </form>
      </div>
    )
  }
}
