import ReactReduxTodoListPool from './apps/TodoList/react-redux-pool/TodoListPool'
import UsePoolTodoListPool, { render as UsePoolTodoListPool_render } from './apps/TodoList/use-pool/TodoListPool'

ReactReduxTodoListPool.build()
UsePoolTodoListPool.build()

export default {
  title: 'Todo List'
}

export const ReactReduxTodoListStory = () => ReactReduxTodoListPool.render()
ReactReduxTodoListStory.storyName = 'react-redux-pool'

export const UsePoolTodoListStory = () => UsePoolTodoListPool_render()
UsePoolTodoListStory.storyName = 'use-pool'
