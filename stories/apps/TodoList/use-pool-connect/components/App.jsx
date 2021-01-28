import React, { Component } from 'react'
import AddTodo from './AddTodo'
import VisibleTodoList from './VisibleTodoList'
import Footer from './Footer'

export default class App extends Component {
  render() {
    return (
      <div>
        TODO LIST:
        <AddTodo />
        <VisibleTodoList />
        <Footer />
      </div>
    )
  }
}
