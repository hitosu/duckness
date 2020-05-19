import CounterPool from './ReactReduxPools/CounterPool/CounterPool'
import TodoListPool from './ReactReduxPools/TodoListPool/TodoListPool'

CounterPool.build()
TodoListPool.build()

export default {
  title: 'React-Redux Pools'
}

export const CounterPoolStorybook = () => CounterPool.render()
CounterPoolStorybook.story = {
  name: 'CounterPool'
}

export const TodoListPoolStorybook = () => TodoListPool.render()
TodoListPoolStorybook.story = {
  name: 'TodoListPool'
}
