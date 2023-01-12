import * as React from 'react'
import { Provider } from 'react-redux'
import { IPool, TPoolProps } from '@duckness/pool'

export type IReactReduxPool = {
  render: () => JSX.Element
} & {
  [poolAPIKey in keyof IPool]: IPool[poolAPIKey]
}

export default function ReactReduxPool(pool: IPool, renderRoot: (props: TPoolProps) => JSX.Element = _props => null) {
  const render: IReactReduxPool['render'] = function () {
    if (null == pool.store) pool.build(pool.props)
    return <Provider store={pool.store}>{renderRoot(pool.props)}</Provider>
  }

  const reactReduxPool: IReactReduxPool = {} as IReactReduxPool

  Object.defineProperty(reactReduxPool, 'render', { value: render, writable: false, enumerable: true })

  Object.keys(pool).forEach(poolKey => {
    Object.defineProperty(reactReduxPool, poolKey, {
      get() {
        return pool[poolKey as keyof IPool]
      },
      enumerable: true
    })
  })

  return reactReduxPool
}
