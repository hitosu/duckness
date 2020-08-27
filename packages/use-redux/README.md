# `@duckness/use-redux` <!-- omit in toc -->

[React hook](https://reactjs.org/docs/hooks-intro.html) for [Redux](https://react-redux.js.org/) store

[![NPM](https://img.shields.io/npm/v/@duckness/use-redux)](https://www.npmjs.com/package/@duckness/use-redux)
[![License](https://img.shields.io/github/license/hitosu/duckness)](https://github.com/hitosu/duckness/blob/master/LICENSE)
[![Libraries.io dependency status for latest release, scoped npm package](https://img.shields.io/librariesio/release/npm/@duckness/use-redux)](https://www.npmjs.com/package/@duckness/use-redux?activeTab=dependencies)
[![GitHub issues](https://img.shields.io/github/issues/hitosu/duckness)](https://github.com/hitosu/duckness/issues)
[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@duckness/use-redux)](https://github.com/hitosu/duckness/issues)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@duckness/use-redux)](https://www.npmjs.com/package/@duckness/use-redux)

# Example

```js
import React from 'react'
import useRedux from '@duckness/use-redux'

const counterSelector = (state => state.counter || 0)

export default function Counter() {
  const counter = useRedux(store, counterSelector)
  return <span>[ {counter} ]</span>
}
```

# Table of Contents <!-- omit in toc -->

- [Example](#example)
- [`useRedux`](#useredux)
  - [`store`](#store)
  - [`selector`](#selector)
  - [`shouldSelect`](#shouldselect)
  - [`shouldUpdate`](#shouldupdate)
- [`useDispatchAction`](#usedispatchaction)
  - [`actionCreator`](#actioncreator)
  - [`payloadTransformer`](#payloadtransformer)
- [`useDispatch`](#usedispatch)
- [@Duckness packages:](#duckness-packages)


# `useRedux`

```js
const selectedState = useRedux(store, selector, shouldUpdate?, shouldSelect?)
```

## `store`

Redux store to subscribe to.

## `selector`

Select relevant data from store state.

```js
function selector(state) {
  // ... calculate selectedState from state
  return selectedState
}
```

## `shouldSelect`

Optional select filter. This optimization helps to avoid expensive calculations in `selector`.

`selector` will be called on every redux store update if:
1. `shouldSelect` is not specified or `null`
2. `'function' === typeof shouldSelect` and `true == shouldSelect(nextStoreState, prevStoreState)`

## `shouldUpdate`

Optional selectedState update filter.

`useRedux` will update after every redux store update and `selector` call if:
1. `true === shouldUpdate`
2. `'function' === typeof shouldUpdate` and `true == shouldUpdate(nextSelectedState, prevSelectedState)`
3. `shouldUpdate` is not specified or `null` and `nextSelectedState !== prevSelectedState`

# `useDispatchAction`

Binds actionCreator to `store.dispatch`.

```js
const onAction = useDispatchAction(store, actionCreator, payloadTransformer?)
// ...
onAction(payload)
// => dispatch action with payload
```

## `actionCreator`

```js
function myAction(payload) {
  type: 'MY_ACTION',
  payload: payload
}
```

## `payloadTransformer`

Optional payload transformer.

1. `undefined === payloadTransformer` - use supplied payload.
```js
const onAction = useDispatchAction(store, myAction)
onAction('PAYLOAD')
// => dispatch { type: 'MY_ACTION', payload: 'PAYLOAD' }
```

2. `'function' === typeof payloadTransformer` - transform payload.
```js
const onAction = useDispatchAction(store, myAction, str => str.toLowerCase())
onAction('PAYLOAD')
// => dispatch { type: 'MY_ACTION', payload: 'payload' }
```

3. any other values for `payloadTransformer` - use `payloadTransformer` as payload. 
```js
const onAction = useDispatchAction(store, myAction, null)
onAction('PAYLOAD')
// => dispatch { type: 'MY_ACTION', payload: null }
```

Third option is useful when using `useDispatchAction` as a callback for DOM events.
```js
function increment(amount) {
  return { type: 'INC', payload: null == amount ? 1 : amount }
}

const onInc = useDispatchAction(store, increment, null)

// <button onClick={onInc}>INC</button>

// onInc will be called with { payload: null } instead of { payload: event }
```

# `useDispatch`

```js
useDispatch(store, dispatcher, deps)
```

Example:

```js
const onMultiAction = useDispatch(store, (dispatch, amount) => {
  for (let i = 0; i < amount; i++) {
    dispatch( actionCreator(i) )
  }
}, [actionCreator])
// ...
onMultiAction(10)
// => dispatch 10 actions
```

```js
function SetStatusButton({ status = 'ready' } = {}) {
  const onClick = useDispatch(
    store,
    dispatch => {
      dispatch(actionSetStatus(status))
    },
    [status]
  )

  return <button onClick={onClick}>{status}</button>
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
