import ReactReduxCounterPool from './apps/Counter/react-redux-pool/CounterPool'
import UsePoolCounterPool, { render as UsePoolCounterPool_render } from './apps/Counter/use-pool/CounterPool'
import UsePoolEpicCounterPool, {
  render as UsePoolEpicCounterPool_render
} from './apps/Counter/use-pool-epic/CounterPool'

ReactReduxCounterPool.build()
UsePoolCounterPool.build()
UsePoolEpicCounterPool.build()

export default {
  title: 'Counter'
}

export const ReactReduxCounterStory = () => ReactReduxCounterPool.render()
ReactReduxCounterStory.storyName = 'react-redux-pool'

export const UsePoolCounterStory = () => UsePoolCounterPool_render()
UsePoolCounterStory.storyName = 'use-pool'

export const UsePoolEpicCounterStory = () => UsePoolEpicCounterPool_render()
UsePoolEpicCounterStory.storyName = 'use-pool-epic'
