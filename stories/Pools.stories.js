import CounterPool from './CounterPool/CounterPool'
import TodoListPool from './TodoListPool/TodoListPool'

CounterPool.build()
TodoListPool.build()

export default {
  title: 'Pools'
}

export const CounterPoolStorybook = () => CounterPool.render()
CounterPoolStorybook.story = {
  name: 'CounterPool'
}

export const TodoListPoolStorybook = () => TodoListPool.render()
TodoListPoolStorybook.story = {
  name: 'TodoListPool'
}
