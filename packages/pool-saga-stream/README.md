# `@duckness/pool` <!-- omit in toc -->

[@duckness/duck](https://github.com/hitosu/duckness/tree/master/packages/duck) + [@duckness/saga](https://github.com/hitosu/duckness/tree/master/packages/saga) + [Redux](https://redux.js.org/)

[![NPM](https://img.shields.io/npm/v/@duckness/pool)](https://www.npmjs.com/package/@duckness/pool)
[![License](https://img.shields.io/github/license/hitosu/duckness)](https://github.com/hitosu/duckness/blob/master/LICENSE)
[![Libraries.io dependency status for latest release, scoped npm package](https://img.shields.io/librariesio/release/npm/@duckness/pool)](https://www.npmjs.com/package/@duckness/pool?activeTab=dependencies)
[![GitHub issues](https://img.shields.io/github/issues/hitosu/duckness)](https://github.com/hitosu/duckness/issues)
[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@duckness/pool)](https://github.com/hitosu/duckness/issues)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@duckness/pool)](https://www.npmjs.com/package/@duckness/pool)

# Example

```js
import Pool from '@duckness/pool'
import CounterDuck from './ducks/CounterDuck'

const CounterPool = Pool({
  buildStore: ({ initialCounter = 0 } = {}) => {
    return { counter: initialCounter }
  }
})
CounterPool.addDuck(CounterDuck)

CounterPool.build({initialCounter: 0})
CounterPool.store
// => [redux store]
```

# Table of Contents <!-- omit in toc -->

- [Example](#example)
- [API](#api)
  - [Create Pool](#create-pool)
    - [default `buildStore`](#default-buildstore)
    - [default `buildRootReducer`](#default-buildrootreducer)
    - [default `buildRootSaga`](#default-buildrootsaga)
  - [`.addDuck(duck)`](#addduckduck)
  - [`.build(props)`](#buildprops)
  - [`.store`](#store)
  - [`.errorReporter(reporterFn)`](#errorreporterreporterfn)
- [Examples](#examples)
- [@Duckness packages:](#duckness-packages)

# API

## Create Pool

```js
const myPool = Pool({
  ?ducks: Array<Duck>, // array of pool ducks
  ?buildStore: props => store, // build initial store state
  ?buildRootReducer: ducks => rootReducer, // build custom root reducer from ducks instead of default root reducer
  ?buildRootSaga: ducks => rootSaga*, // build custom root saga from ducks instead of default root saga
  ?middlewares: Array // additional redux middlewares
})
```

### default `buildStore`

If not specified store will be set to `{}`.

### default `buildRootReducer`

Default root reducer will combine all duck root reducers via
```js
ducks.reduce((state, duck) => {
  return duck(state, action)
}, state)
```
with every duck root reducer wrapped in try/catch returning unmodified state in case of exception inside duck root reducer.

### default `buildRootSaga`

Default root saga will combine all duck root sagas (if exists) wrapped in try/catch restarting duck root saga in case of exception.

## `.addDuck(duck)`

Add duck to pool
```js
myPool.addDuck(myDuck)
```

## `.build(props)`

Build pool state from some props. `props` will be passed to `buildStore` function.
```js
myPool.build({ initialCounter: 0 })
```

## `.store`

Reference to built redux store
```js
myPool.store.subscribe(/* ... */)
```


## `.errorReporter(reporterFn)`

Set exception reporter function. Will also overwrite all added [SagaDuck](https://github.com/hitosu/duckness/tree/master/packages/saga) errorReporters.
```js
myPool.errorReporter(error => {
  window.Sentry.captureException(error)
})
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
