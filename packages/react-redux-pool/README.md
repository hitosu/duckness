# `@duckness/react-redux-pool` <!-- omit in toc -->

[@duckness/pool](https://github.com/hitosu/duckness/tree/master/packages/pool) + [React-Redux](https://react-redux.js.org/)

[![NPM](https://img.shields.io/npm/v/@duckness/react-redux-pool)](https://www.npmjs.com/package/@duckness/react-redux-pool)
[![License](https://img.shields.io/github/license/hitosu/duckness)](https://github.com/hitosu/duckness/blob/master/LICENSE)
![dependencies](https://img.shields.io/david/hitosu/duckness?path=packages/react-redux-pool)
![dev dependencies](https://img.shields.io/david/dev/hitosu/duckness?path=packages/react-redux-pool)
[![GitHub issues](https://img.shields.io/github/issues/hitosu/duckness)](https://github.com/hitosu/duckness/issues)
![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@duckness/react-redux-pool)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@duckness/react-redux-pool)

# Example

```js
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import Pool from '@duckness/pool'
import ReactReduxPool from '@duckness/react-redux-pool'

import CounterDuck from './ducks/CounterDuck'

const App = React.lazy(() => import('./components/App'))

function RootComponent() {
  return (
    <Suspense fallback="Loading...">
      <App />
    </Suspense>
  )
}

const CounterPool = ReactReduxPool(
  Pool({
    buildStore: ({ initialCounter = 0 } = {}) => {
      return { counter: initialCounter }
    }
  }),
  RootComponent
)
CounterPool.addDuck(CounterDuck)

ReactDOM.render(CounterPool.render(), document.getElementById('counterApp'))
```

# Table of Contents <!-- omit in toc -->

- [Example](#example)
- [API](#api)
  - [Create ReactReduxPool](#create-reactreduxpool)
  - [`.render()`](#render)
  - [Pool methods](#pool-methods)
- [Examples](#examples)
- [@Duckness packages:](#duckness-packages)

# API

## Create ReactReduxPool

```js
const myPool = ReactReduxPool(
  pool, // @duckness/pool to use with React
  renderRootComponent // root component
)
```

## `.render()`

Return root component wrapped in Redux `<Provider>`.
Render will build pool store if store was not built.

```js
myPool.render()
// => <Provider store={pool.store}>{renderRoot(pool.props)}</Provider>
```

## Pool methods

ReactReduxPool forward Pool calls to included Pool

```js
const myPool = Pool()
const myReactReduxPool = ReactReduxPool(myPool, () => null)

myReactReduxPool.addDuck
// => myPool.addDuck
myReactReduxPool.build
// => myPool.build
myReactReduxPool.store
// => myPool.store
myReactReduxPool.errorReporter
// => myPool.errorReporter
```

# Examples

https://github.com/hitosu/duckness/tree/master/stories

# @Duckness packages:

* [@duckness/duck](https://github.com/hitosu/duckness/tree/master/packages/duck) - [Modular Redux Ducks](https://github.com/erikras/ducks-modular-redux) hatchery
* [@duckness/saga](https://github.com/hitosu/duckness/tree/master/packages/saga) - [Redux Saga](https://redux-saga.js.org/) extension for [@duckness/duck](https://github.com/hitosu/duckness/tree/master/packages/duck)
* [@duckness/pool](https://github.com/hitosu/duckness/tree/master/packages/pool) - [@duckness/duck](https://github.com/hitosu/duckness/tree/master/packages/duck) + [@duckness/saga](https://github.com/hitosu/duckness/tree/master/packages/saga) + [Redux](https://redux.js.org/)
* [@duckness/react-redux-pool](https://github.com/hitosu/duckness/tree/master/packages/react-redux-pool) - [@duckness/pool](https://github.com/hitosu/duckness/tree/master/packages/pool) + [React-Redux](https://react-redux.js.org/)
* [@duckness/use-redux](https://github.com/hitosu/duckness/tree/master/packages/use-redux) - [React hook](https://reactjs.org/docs/hooks-intro.html) for [Redux](https://react-redux.js.org/) store
* [@duckness/use-pool](https://github.com/hitosu/duckness/tree/master/packages/use-pool) - [React hook](https://reactjs.org/docs/hooks-intro.html) for [@duckness/pool](https://github.com/hitosu/duckness/tree/master/packages/pool).
* [@duckness/store](https://github.com/hitosu/duckness/tree/master/packages/store) - simple store for [React](https://reactjs.org/) components
* [@duckness/reactor](https://github.com/hitosu/duckness/tree/master/packages/reactor) - reactive data flow builder