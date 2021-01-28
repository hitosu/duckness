import ReactReduxTodoListPool from './apps/TodoList/react-redux-pool/TodoListPool'
import UsePoolTodoListPool, { render as UsePoolTodoListPool_render } from './apps/TodoList/use-pool/TodoListPool'
import UsePoolConnectTodoListPool, {
  render as UsePoolConnectTodoListPool_render
} from './apps/TodoList/use-pool-connect/TodoListPool'

ReactReduxTodoListPool.build()
UsePoolTodoListPool.build()
UsePoolConnectTodoListPool.build()

export default {
  title: 'Todo List'
}

export const ReactReduxTodoListStory = () => ReactReduxTodoListPool.render()
ReactReduxTodoListStory.storyName = 'react-redux-pool'

export const UsePoolTodoListStory = () => UsePoolTodoListPool_render()
UsePoolTodoListStory.storyName = 'use-pool'

export const UsePoolConnectTodoListStory = () => UsePoolConnectTodoListPool_render()
UsePoolConnectTodoListStory.storyName = 'use-pool-connect'
