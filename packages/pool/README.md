# `@duckness/pool` <!-- omit in toc -->

[@duckness/duck](https://github.com/hitosu/duckness/tree/master/packages/duck) + [Redux](https://redux.js.org/)

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
    - [`buildStore`](#buildstore)
      - [default `buildStore`](#default-buildstore)
    - [`buildRootReducer`](#buildrootreducer)
      - [default `buildRootReducer`](#default-buildrootreducer)
  - [`.addDuck(duck)`](#addduckduck)
  - [`.preReducer(reducer)`](#prereducerreducer)
  - [`.postReducer(reducer)`](#postreducerreducer)
  - [`.build(props)`](#buildprops)
  - [`.store`](#store)
  - [`.dispatch(...)`](#dispatch)
  - [`.reduce([state,] action)`](#reducestate-action)
  - [`.select(?selector)`](#selectselector)
  - [`.fetch(selector, ?resolver)`](#fetchselector-resolver)
  - [`.trigger(selector, callback, ?resolver)`](#triggerselector-callback-resolver)
  - [`.setErrorReporter(reporterFn)`](#seterrorreporterreporterfn)
  - [`.reportError(error)`](#reporterrorerror)
  - [`.addMiddleware(middleware)`](#addmiddlewaremiddleware)
  - [Pool Streams - Pool plugins](#pool-streams---pool-plugins)
    - [`.addStream(poolStream)`](#addstreampoolstream)
    - [`PoolStream` API](#poolstream-api)
  - [`.ducks`](#ducks)
  - [`.getDuckByName(duckPath)`](#getduckbynameduckpath)
    - [`duckPath`:](#duckpath)
  - [`.middlewares`](#middlewares)
  - [`.streams`](#streams)
  - [`.props`](#props)
- [Examples](#examples)
- [@Duckness packages:](#duckness-packages)

# API

## Create Pool

```js
const myPool = Pool({
  ?poolName: String, // pool name, default is 'pool'
  ?ducks: Array<Duck>, // array of pool ducks
  ?middlewares: Array<Middleware>, // additional middlewares for Redux store
  ?streams: Array<PoolStream>, // pool plugins
  ?buildStore: (props, { refProps, refDucks, refErrorReporter }) => storeState, // build initial store state
  ?buildRootReducer: ({ refDucks, refErrorReporter }) => rootReducer // build custom root reducer from ducks instead of default root reducer
})
```

### `buildStore`

Optional function to build init store state
`(props, { refProps, refDucks, refReducers, refErrorReporter }) => storeState`

* `props` are passed to pool when `pool.build(props)` are called.
* `refProps.current` - props passed to `pool.build(props)` function
* `refDucks.current` - current array of ducks.
* `refReducers.root` - pool root reducer
* `refReducers.pre` - pool pre reducer
* `refReducers.post` - pool post reducer
* `refErrorReporter.current` - current error reporter function.

#### default `buildStore`

If not specified store state will be set to `{}`.

### `buildRootReducer`
Optional function for custom root reducer
`(ducks, { refProps, refDucks, refReducers, refErrorReporter }) => rootReducer`

* `ducks` - array of ducks
* `refProps.current` - props passed to `pool.build(props)` function
* `refDucks.current` - current array of ducks.
* `refReducers.pre` - pool pre reducer
* `refReducers.post` - pool post reducer
* `refErrorReporter.current` - current error reporter function.

#### default `buildRootReducer`

Default root reducer will combine all duck root reducers via
```js
ducks.reduce((state, duck) => {
  return duck(state, action)
}, state)
```
with every duck root reducer wrapped in try/catch returning unmodified state in case of exception inside duck root reducer.

## `.addDuck(duck)`

Add duck to pool.
```js
MyPool.addDuck(myDuck)
```

## `.preReducer(reducer)`

Add pool pre reducer.
Pre reducers will run BEFORE duck reducers and will receive all actions.
Will replace previously set pre reducer.
```js
MyPool.preReducer(function globalPreReducer(state, action) {/* ... */} )
```

## `.postReducer(reducer)`

Add pool post reducer.
Post reducers will run AFTER duck reducers and will receive all actions.
Will replace previously set post reducer.
```js
MyPool.postReducer(function globalPostReducer(state, action) {/* ... */} )
```

## `.build(props)`

Build pool state from some props. `props` will be passed to `buildStore` function.
```js
MyPool.build({ initialCounter: 0 })
```

## `.store`

Reference to built redux store.
```js
MyPool.store.subscribe(/* ... */)
```

## `.dispatch(...)`

1. Dispatches an action (action is a plain object).
```js
const action = { type: 'actionType', payload: {} }
MyPool.dispatch(action)
```

2. Dispatches and action from 'poolName/duckName' duck.
This will first look for a duck by 'duckName' and current 'poolName', then duck's action creator by 'actionName' and call it with 'actionParams' to build action to dispatch.
```js
MyPool.dispatch('duckName', 'actionName', ...actionParams)
```

Example:

```js
const MyDuck = Duck('myDuck', 'myPool')
MyDuck.action('someAction')

const MyPool = Pool({ poolName: 'myPool' })
MyPool.addDuck(MyDuck)
MyPool.dispatch('myDuck', 'someAction', ...actionParams)

// equal to
MyPool.dispatch(MyDuck.action.someAction(...actionParams))
```

3. Dispatches and action from 'customPoolName/duckName' duck.
This will first look for a duck by 'duckName' and 'poolName', then duck's action creator by 'actionName' and call it with 'actionParams' to build action to dispatch.
```js
MyPool.dispatch(['customPoolName', 'duckName'], 'actionName', ...actionParams)
```


## `.reduce([state,] action)`

Reduce state with action. Does not change pool's store. Can be used to look ahead what the state will be after dispatching an action.
```js
MyPool.reduce(action) // reduce pool's store state
MyPool.reduce(state, action) // reduce custom state
```

## `.select(?selector)`

Select something from store. Returns store state if `selector` undefined.
```js
MyPool.select(MyDuck.select.something)
// => selected value
MyPool.select()
// => current store state
```

## `.fetch(selector, ?resolver)`

Returns `Promise`

`function resolver(selected, resolve, prevSelected)`

Fetch value from the store:
- first `selector` is called to produce selected value
- if `resolver` is defined: selected value is passed to resolver with previous selected value (`undefined` for the first run) and `resolve` function that can be used to resolve this `fetch`
- if `resolver` is not defined: selected value will be resolved if it is not `undefined`
- if nothing was resolved: repeat when store is updated (after next action dispatch).

`fetch` will subscribe to store updates (if it was not resolved after first select) and unsubscribe when it is resolved.

```js
// resolves with items when items are loaded into store or are already present
const items = await ListPool.fetch(ItemsDuck.select.items)

// resolves when counter is reset, returning counter value before reset
const counterResetFrom = await MyPool.fetch(
  state => state.counter,
  (selected, resolve, prevSelected) => {
    if (null != prevSelected && 0 !== prevSelected && 0 === selected) {
      resolve(selected)
    }
  }
)
```

## `.trigger(selector, callback, ?resolver)`

Returns clear trigger function.

`function callback(selected)`

`function resolver(selected, resolve, prevSelected)`

Trigger `callback` every time:
- selected value changes (`resolver` is undefined)
- or `resolver` calls `resolve`

`trigger` calls `resolver` first time trigger is set and later on store updates.

To unsubscribe call clear trigger function.

```js
// console.log value for 10 seconds
const clearTrigger = MyPool.trigger(
    MyDuck.select.someValue,
    console.log
  )
setTimeout(clearTrigger, 10000)
```

## `.setErrorReporter(reporterFn)`

Set exception reporter function. Will also overwrite errorReporters set in ducks.
```js
MyPool.setErrorReporter(error => {
  window.Sentry.captureException(error)
})
```

## `.reportError(error)`

Call assigned error reporter
```js
MyPool.reportError(new Error('Clean pool!'))
```

## `.addMiddleware(middleware)`

Add custom Redux middleware (applied on `.build`)

## Pool Streams - Pool plugins

Pool Stream is a Pool plugin that can add middlewares to Redux store. One example is [@duckness/pool-saga-stream](https://github.com/hitosu/duckness/tree/master/packages/pool-saga-stream) that adds [@duckness/saga](https://github.com/hitosu/duckness/tree/master/packages/saga) support to Pool (ducks can have [Redux Sagas](https://redux-saga.js.org/)).

### `.addStream(poolStream)`

Adds Pool Stream to Pool

### `PoolStream` API

```js
{
  // array of middlewares for Redux store
  middlewares({ refDucks, refProps, refReducers, refErrorReporter }) {
    // refDucks.current - current array of ducks
    // refProps.current - props passed to build function
    // refReducers.root - root reducer function
    // refReducers.pre - pool pre reducer function
    // refReducers.post - pool post reducer function
    // refErrorReporter.current - current error reporter function
    // ...
    return [...streamMiddlewares] 
  },
  // called before redux store is built
  beforeBuild({ refDucks, refProps, refReducers, refErrorReporter }) {
    // refDucks.current - current array of ducks
    // refProps.current - props passed to build function
    // refReducers.root - root reducer function
    // refReducers.pre - pool pre reducer function
    // refReducers.post - pool post reducer function
    // refErrorReporter.current - current error reporter function
    // ...
  },
  // called after redux store is built
  afterBuild({ refStore, refDucks, refProps, refReducers, refErrorReporter }) {
    // refStore.current - current Redux store
    // refDucks.current - current array of ducks
    // refProps.current - props passed to build function
    // refReducers.root - root reducer function
    // refReducers.pre - pool pre reducer function
    // refReducers.post - pool post reducer function
    // refErrorReporter.current - current error reporter function
    // ...
  }
}
```

## `.ducks`

Array of added ducks (read only)

## `.getDuckByName(duckPath)`

Find added duck by it's path. Returns `null` if duck is not found.

### `duckPath`:
   * Array: `[poolName, duckName]`
   * String: `duckName` (use current poolName)

## `.middlewares`

Array of added middlewares (read only)

## `.streams`

Array of added streams (read only)

## `.props`

Props used to build pool (read only)

# Examples

https://github.com/hitosu/duckness/tree/master/stories

# @Duckness packages:

* [@duckness/duck](https://github.com/hitosu/duckness/tree/master/packages/duck) - [Modular Redux Ducks](https://github.com/erikras/ducks-modular-redux) hatchery
* [@duckness/saga](https://github.com/hitosu/duckness/tree/master/packages/saga) - [Redux Saga](https://redux-saga.js.org/) extension for [@duckness/duck](https://github.com/hitosu/duckness/tree/master/packages/duck)
* [@duckness/epic](https://github.com/hitosu/duckness/tree/master/packages/epic) - [Redux-Observable](https://redux-observable.js.org/) extension for [@duckness/duck](https://github.com/hitosu/duckness/tree/master/packages/duck)
* [@duckness/pool](https://github.com/hitosu/duckness/tree/master/packages/pool) - [@duckness/duck](https://github.com/hitosu/duckness/tree/master/packages/duck) + [Redux](https://redux.js.org/)
* [@duckness/pool-saga-stream](https://github.com/hitosu/duckness/tree/master/packages/pool-saga-stream) - [@duckness/saga](https://github.com/hitosu/duckness/tree/master/packages/saga) plugin for [@duckness/pool](https://github.com/hitosu/duckness/tree/master/packages/pool)
* [@duckness/pool-epic-stream](https://github.com/hitosu/duckness/tree/master/packages/pool-epic-stream) - [@duckness/epic](https://github.com/hitosu/duckness/tree/master/packages/epic) plugin for [@duckness/pool](https://github.com/hitosu/duckness/tree/master/packages/pool)
* [@duckness/react-redux-pool](https://github.com/hitosu/duckness/tree/master/packages/react-redux-pool) - [@duckness/pool](https://github.com/hitosu/duckness/tree/master/packages/pool) + [React-Redux](https://react-redux.js.org/)
* [@duckness/use-redux](https://github.com/hitosu/duckness/tree/master/packages/use-redux) - [React hook](https://reactjs.org/docs/hooks-intro.html) for [Redux](https://react-redux.js.org/) store
* [@duckness/use-pool](https://github.com/hitosu/duckness/tree/master/packages/use-pool) - [React hook](https://reactjs.org/docs/hooks-intro.html) for [@duckness/pool](https://github.com/hitosu/duckness/tree/master/packages/pool).
* [@duckness/store](https://github.com/hitosu/duckness/tree/master/packages/store) - simple store for [React](https://reactjs.org/) components
* [@duckness/reactor](https://github.com/hitosu/duckness/tree/master/packages/reactor) - reactive data flow builder
