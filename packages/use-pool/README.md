# `@duckness/use-pool` <!-- omit in toc -->

[React hook](https://reactjs.org/docs/hooks-intro.html) for [@duckness/pool](https://github.com/hitosu/duckness/tree/master/packages/pool).

[![NPM](https://img.shields.io/npm/v/@duckness/use-pool)](https://www.npmjs.com/package/@duckness/use-pool)
[![License](https://img.shields.io/github/license/hitosu/duckness)](https://github.com/hitosu/duckness/blob/master/LICENSE)
[![Libraries.io dependency status for latest release, scoped npm package](https://img.shields.io/librariesio/release/npm/@duckness/use-pool)](https://www.npmjs.com/package/@duckness/use-pool?activeTab=dependencies)
[![GitHub issues](https://img.shields.io/github/issues/hitosu/duckness)](https://github.com/hitosu/duckness/issues)
[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@duckness/use-pool)](https://github.com/hitosu/duckness/issues)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@duckness/use-pool)](https://www.npmjs.com/package/@duckness/use-pool)

# Example

```js
import React from 'react'
import usePool from '@duckness/use-pool'

import CounterPool from './CounterPool'
import CounterDuck from './CounterDuck'

export default function Counter() {
  const [counter] = usePool(CounterPool, CounterDuck.select.counter)
  return <span>[ {counter} ]</span>
}
```

# Table of Contents <!-- omit in toc -->

- [Example](#example)
- [Shortcut to `@duckness/use-redux`](#shortcut-to-ducknessuse-redux)
- [@Duckness packages:](#duckness-packages)

# Shortcut to `@duckness/use-redux`

`@duckness/use-pool` is a shortcut to [@duckness/use-redux](https://github.com/hitosu/duckness/blob/master/packages/use-redux).

See [@duckness/use-redux documentation](https://github.com/hitosu/duckness/blob/master/packages/use-redux/README.md) for details.

```js
import useRedux, {
  useDispatchAction as useReduxDispatchAction,
  useDispatch as useReduxDispatch
} from '@duckness/use-redux'

export default function usePool(pool, selector, shouldUpdate, shouldSelect) {
  return useRedux(pool.store, selector, shouldUpdate, shouldSelect)
}

export function useDispatchAction(pool, actionCreator, payloadTransformer) {
  return useReduxDispatchAction(pool.store, actionCreator, payloadTransformer)
}

export function useDispatch(pool, dispatcher, deps) {
  return useReduxDispatch(pool.store, dispatcher, deps)
}
```

# @Duckness packages:

* [@duckness/duck](https://github.com/hitosu/duckness/tree/master/packages/duck) - [Modular Redux Ducks](https://github.com/erikras/ducks-modular-redux) hatchery
* [@duckness/saga](https://github.com/hitosu/duckness/tree/master/packages/saga) - [Redux Saga](https://redux-saga.js.org/) extension for [@duckness/duck](https://github.com/hitosu/duckness/tree/master/packages/duck)
* [@duckness/pool](https://github.com/hitosu/duckness/tree/master/packages/pool) - [@duckness/duck](https://github.com/hitosu/duckness/tree/master/packages/duck) + [Redux](https://redux.js.org/)
* [@duckness/pool-saga-stream](https://github.com/hitosu/duckness/tree/master/packages/pool-saga-stream) - [@duckness/saga](https://github.com/hitosu/duckness/tree/master/packages/saga) plugin for [@duckness/pool](https://github.com/hitosu/duckness/tree/master/packages/pool)
* [@duckness/react-redux-pool](https://github.com/hitosu/duckness/tree/master/packages/react-redux-pool) - [@duckness/pool](https://github.com/hitosu/duckness/tree/master/packages/pool) + [React-Redux](https://react-redux.js.org/)
* [@duckness/use-redux](https://github.com/hitosu/duckness/tree/master/packages/use-redux) - [React hook](https://reactjs.org/docs/hooks-intro.html) for [Redux](https://react-redux.js.org/) store
* [@duckness/use-pool](https://github.com/hitosu/duckness/tree/master/packages/use-pool) - [React hook](https://reactjs.org/docs/hooks-intro.html) for [@duckness/pool](https://github.com/hitosu/duckness/tree/master/packages/pool).
* [@duckness/store](https://github.com/hitosu/duckness/tree/master/packages/store) - simple store for [React](https://reactjs.org/) components
* [@duckness/reactor](https://github.com/hitosu/duckness/tree/master/packages/reactor) - reactive data flow builder
