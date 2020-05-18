# `@duckness/pool`

Duckness Pool - boilerplate for React-Redux apps based on [Duckness - Modular Redux Ducks hatchery](https://github.com/hitosu/duckness/tree/master/packages/duck)

[![NPM](https://img.shields.io/npm/v/@duckness/pool)](https://www.npmjs.com/package/@duckness/pool)
[![License](https://img.shields.io/github/license/hitosu/duckness)](https://github.com/hitosu/duckness/blob/master/LICENSE)
![dependencies](https://img.shields.io/david/hitosu/duckness?path=packages%2Fpool)
![dev dependencies](https://img.shields.io/david/dev/hitosu/duckness?path=packages%2Fpool)
[![GitHub issues](https://img.shields.io/github/issues/hitosu/duckness)](https://github.com/hitosu/duckness/issues)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@duckness/pool)

# Example

```js
import Pool from '@duckness/pool'
import CounterDuck from './ducks/CounterDuck'

const CounterPool = Pool({
  buildStore: ({ initialCounter = 0 } = {}) => {
    return { counter: initialCounter }
  },
  renderRoot: () => (
    <Suspense fallback="Loading...">
      <App />
    </Suspense>
  )
})
CounterPool.addDuck(CounterDuck)

CounterPool.build({initialCounter: 0})
CounterPool.mount(document.getElementById('counterApp'))
```

# Table of Contents

- [`@duckness/pool`](#ducknesspool)
- [Example](#example)
- [Table of Contents](#table-of-contents)
- [API](#api)
  - [Create Pool](#create-pool)
    - [default `buildStore`](#default-buildstore)
    - [default `buildRootReducer`](#default-buildrootreducer)
    - [default `buildRootSaga`](#default-buildrootsaga)
  - [`.addDuck(duck)`](#addduckduck)
  - [`.build(props)`](#buildprops)
  - [`.mount(toElement)`](#mounttoelement)
  - [`.unmount()`](#unmount)
  - [`.render(?props)`](#renderprops)
  - [`.start(props, element)`](#startprops-element)
  - [`.stop()`](#stop)
  - [`.errorReporter(reporterFn)`](#errorreporterreporterfn)
- [Examples](#examples)
- [Additional resources](#additional-resources)

# API

## Create Pool

```js
const myPool = Pool({
  ?ducks: Array<Duck>, // array of pool ducks
  ?buildStore: props => store, // build initial store state
  ?buildRootReducer: ducks => rootReducer, // build custom root reducer from ducks instead of default root reducer
  ?buildRootSaga: ducks => rootSaga*, // build custom root saga from ducks instead of default root saga
  renderRoot: props => <AppRoot />, // render pool's root component
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

## `.mount(toElement)`

Mount pool to DOM element.
```js
myPool.mount(document.getElementById('my-pool-div'))
```

## `.unmount()`

Unmount pool from mounted DOM element.
```js
myPool.unmount()
```

## `.render(?props)`

Return root component wrapped in Redux `<Provider>`. Useful for testing.
Render will build pool store with supplied props if store was not built.
```js
myPool.build({ /*...*/ })
myPool.render()
// => <Provider store={store}>{renderRoot(props)}</Provider>
```

## `.start(props, element)`

`Build` store with `props` and `mount` pool to `element`.
```js
myPool.start({ initialCounter: 0 }, document.getElementById('my-pool-div'))
```

## `.stop()`

`Unmount` pool and remove Redux store.
```js
myPool.stop()
```

## `.errorReporter(reporterFn)`

Set exception reporter function. Will also overwrite all added SagaDuck errorReporters.
```js
myPool.errorReporter(error => {
  window.Raven.captureException(error)
})
```

# Examples

https://github.com/hitosu/duckness/tree/master/stories

# Additional resources

* [@duckness/duck](https://github.com/hitosu/duckness/tree/master/packages/duck) - @duckness/duck - Modular Redux Ducks hatchery
* [@duckness/saga](https://github.com/hitosu/duckness/tree/master/packages/saga) - Saga extension for @duckness/duck
