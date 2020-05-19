import ReactReduxCounterPool from './apps/Counter/react-redux-pool/CounterPool'
import UsePoolCounterPool, { render as UsePoolCounterPool_render } from './apps/Counter/use-pool/CounterPool'

ReactReduxCounterPool.build()
UsePoolCounterPool.build()

export default {
  title: 'Counter'
}

export const ReactReduxCounterStory = () => ReactReduxCounterPool.render()
ReactReduxCounterStory.story = {
  name: 'react-redux-pool'
}

export const UsePoolCounterStory = () => UsePoolCounterPool_render()
UsePoolCounterStory.story = {
  name: 'use-pool'
}
