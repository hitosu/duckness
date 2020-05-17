import CounterPool from './src/CounterPool'

CounterPool.build()

export default {
  title: 'CounterPool'
}

export const CounterPoolStorybook = () => CounterPool.render()

CounterPoolStorybook.story = {
  name: 'CounterPool'
}
