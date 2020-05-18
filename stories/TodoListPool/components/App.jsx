import React from 'react'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
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
