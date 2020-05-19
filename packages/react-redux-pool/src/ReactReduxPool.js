import React from 'react'
import { Provider } from 'react-redux'

export default function ReactReduxPool(pool, renderRoot = _props => null) {
  function render() {
    if (null == pool.store) pool.build(pool.props)
    return <Provider store={pool.store}>{renderRoot(pool.props)}</Provider>
  }

  const reactReduxPool = {}

  Object.defineProperty(reactReduxPool, 'render', { value: render, writable: false, enumerable: true })

  Object.keys(pool).forEach(poolKey => {
    Object.defineProperty(reactReduxPool, poolKey, {
      get() {
        return pool[poolKey]
      },
      enumerable: true
    })
  })

  return reactReduxPool
}
