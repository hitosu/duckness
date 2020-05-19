import React from 'react'
import AddTodo from './AddTodo'
import VisibleTodoList from './VisibleTodoList'
import Footer from './Footer'

export default function App() {
  return (
    <div>
      TODO LIST:
      <AddTodo />
      <VisibleTodoList />
      <Footer />
    </div>
  )
}
