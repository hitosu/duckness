# `@duckness/duck` <!-- omit in toc -->

[Modular Redux Ducks](https://github.com/erikras/ducks-modular-redux) hatchery.

[![NPM](https://img.shields.io/npm/v/@duckness/duck)](https://www.npmjs.com/package/@duckness/duck)
[![License](https://img.shields.io/github/license/hitosu/duckness)](https://github.com/hitosu/duckness/blob/master/LICENSE)
[![Libraries.io dependency status for latest release, scoped npm package](https://img.shields.io/librariesio/release/npm/@duckness/duck)](https://www.npmjs.com/package/@duckness/duck?activeTab=dependencies)
[![GitHub issues](https://img.shields.io/github/issues/hitosu/duckness)](https://github.com/hitosu/duckness/issues)
[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@duckness/duck)](https://github.com/hitosu/duckness/issues)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@duckness/duck)](https://www.npmjs.com/package/@duckness/duck)

# Example

```js
// counterDuck.js
import Duck from '@duckness/duck'

// Create duck with the name 'counter' for 'counter-app'
const counterDuck = Duck('counter', 'counter-app')

// Export action creators
counterDuck.action('incrementCounter', 'INCREMENT')
//  counterDuck.action.incrementCounter will build actions with type 'counter-app/counter/INCREMENT'
counterDuck.action('decrementCounter', 'DECREMENT')
//  counterDuck.action.decrementCounter will build actions with type 'counter-app/counter/DECREMENT'

// Add selector
counterDuck.selector('counter', state => (state.counter || 0))

// Add reducers
counterDuck.reducer('INCREMENT', (state, _action, duckFace) => {
  // duckness adds duckFace to every reducer
  // duckFace is an interface to duck with access to selectors, action types and root reducer
  return {
    ...state,
    counter: duckFace.select.counter(state) + 1
  }
})
counterDuck.reducer('DECREMENT', (state, _action, duckFace) => {
  return {
    ...state,
    counter: duckFace.select.counter(state) - 1
  }
})

// Duck itself is a root reducer
export default counterDuck
```

# Table of Contents <!-- omit in toc -->

- [Example](#example)
- [API](#api)
  - [Create Duck](#create-duck)
    - [`.duckName`](#duckname)
    - [`.poolName`](#poolname)
  - [Actions](#actions)
    - [`.mapActionType(actionType)`](#mapactiontypeactiontype)
    - [`.action(actionName, actionType, payloadBuilder?, actionTransformer?)`](#actionactionname-actiontype-payloadbuilder-actiontransformer)
    - [`.action[]`](#action)
    - [`.listActionTypes()`](#listactiontypes)
    - [`.actionTypes[]`](#actiontypes)
  - [Selectors](#selectors)
    - [`.selector(selectorName, selector)`](#selectorselectorname-selector)
    - [`.select[]`](#select)
  - [Reducers](#reducers)
    - [`.reducer(actionType, reducer)`](#reduceractiontype-reducer)
    - [`.reducer(null, reducer)`](#reducernull-reducer)
    - [`.reducer(withActions(action, duckFace), reducer)`](#reducerwithactionsaction-duckface-reducer)
  - [Root reducer](#root-reducer)
  - [duckFace](#duckface)
    - [`duckFace.actionTypes[]`](#duckfaceactiontypes)
    - [`duckFace.action[]`](#duckfaceaction)
    - [`duckFace.mapActionType(actionType)`](#duckfacemapactiontypeactiontype)
    - [`duckFace.listActionTypes()`](#duckfacelistactiontypes)
    - [`duckFace.select[]`](#duckfaceselect)
    - [`duckFace.reduce(state, action)`](#duckfacereducestate-action)
    - [`duck.duckFace`](#duckduckface)
  - [Context](#context)
    - [Create Duck with context](#create-duck-with-context)
    - [`duck.updateContext`](#duckupdatecontext)
  - [Clone duck](#clone-duck)
- [@Duckness packages:](#duckness-packages)

# API

## Create Duck

Create a new duck with duckName and poolName (poolName is a namespace for ducks)
```js
import Duck from '@duckness/duck'

const myDuck = Duck('duck-name', 'pool-name')
```

### `.duckName`
```js
const myDuck = Duck('duck-name', 'pool-name')
myDuck.duckName
// => 'duck-name'
```

### `.poolName`
```js
const myDuck = Duck('duck-name', 'pool-name')
myDuck.poolName
// => 'pool-name'
```

## Actions

### `.mapActionType(actionType)`

Maps short action type to long action type
```js
myDuck.mapActionType('ACTION_TYPE')
// => 'pool-name/duck-name/ACTION_TYPE'
```

### `.action(actionName, actionType, payloadBuilder?, actionTransformer?)`

Build action creator and register it under actionName (if actionName present)
```js
const eatFish = myDuck.action('eatAllTheFish', 'EAT_FISH')
eatFish({ amount: 10 })
// => { type: 'pool-name/duck-name/EAT_FISH', payload: { amount: 10 } }
myDuck.action.eatAllTheFish({ amount: 9000 })
// => { type: 'pool-name/duck-name/EAT_FISH', payload: { amount: 9000 } }
```

Optional `payloadBuilder` could be specified to customize payloads
```js
const eatFish = myDuck.action(null, 'EAT_FISH', payload => {
  return { amount: payload }
})
eatFish(10)
// => { type: 'pool-name/duck-name/EAT_FISH', payload: { amount: 10 } }
```

Optional `actionTransformer` could be specified to customize action
```js
const eatFish = myDuck.action(null, 'EAT_FISH', null, action => {
  return { ...action, wellFed: true }
})
eatFish({ amount: 10 })
// => { type: 'pool-name/duck-name/EAT_FISH', payload: { amount: 10 }, wellFed: true }
```

If `Error` object is passed to action creator `payloadBuilder` will be skipped and `action.error` will be `true`
```js
const eatFish = myDuck.action(null, 'EAT_FISH')
eatFish(new Error('no more fish'))
// => { type: 'pool-name/duck-name/EAT_FISH', payload: Error('no more fish'), error: true }
```

### `.action[]`

Calls registered action creator by its name
```js
const eatFish = myDuck.action('eatAllTheFish', 'EAT_FISH')
myDuck.action.eatAllTheFish({ amount: 9000 })
// => { type: 'pool-name/duck-name/EAT_FISH', payload: { amount: 9000 } }
```

### `.listActionTypes()`

Returns all known short action types. Type is known if `.mapActionType` or `.action` was called with it.

```js
myDuck.listActionTypes()
// => ['EAT_FISH', 'QUACK']
```

### `.actionTypes[]`

Is an object that maps known short action types to long action types
```js
myDuck.actionTypes.EAT_FISH
// => 'pool-name/duck-name/EAT_FISH'
```

## Selectors

### `.selector(selectorName, selector)`

Registers selector under selectorName
```js
myDuck.selector('counter', (state, _duckFace) => (state.counter || 0))
```

### `.select[]`

Calls registered selector
```js
const state = { counter: 10 }
myDuck.select.counter(state)
// => 10
```

## Reducers

### `.reducer(actionType, reducer)`

Registers reducer for specific action type

```js
myDuck.reducer('EAT_FISH', (state, action, _duckFace) => {
  return {
    ...state,
    fishEaten: state.fishEaten + action.payload.amount
  }
})
```

### `.reducer(null, reducer)`

Registers wildcard reducer for all duck action types (ones that starts with 'pool-name/duck-name/')
```js
myDuck.reducer(null, (state, action, _duckFace) => {
  return {
    ...state,
    updated: (state.updated || 0) + 1
  }
})
```

### `.reducer(withActions(action, duckFace), reducer)`

Registers reducer with action filter
```js
myDuck.reducer((action, _duckFace) => action.error, (state, action, _duckFace) => {
  return {
    ...state,
    errors: (state.errors || 0) + 1
  }
})
```

## Root reducer

Duck itself is a root reducer for all registered reducers
```js
myDuck( state, duckAction(payload) )
// => reduced state
```

## duckFace

duckFace is an interface to duck that is added as a last argument to each registered selectors and reducers
```js
myDuck.selector('counter', (some, selector, args, duckFace) => {
  // ...
}
myDuck.reducer('EAT_FISH', (state, action, duckFace) => {
  // ...
}
```

### `duckFace.actionTypes[]`

Is an object that maps known short action types to long action types
```js
duckFace.actionTypes.EAT_FISH
// => 'pool-name/duck-name/EAT_FISH'
```

### `duckFace.action[]`

Calls registered action creator by its name
```js
dispatch(duckFace.action.eatFish())
```

### `duckFace.mapActionType(actionType)`

Maps short action type to long action type
```js
duckFace.mapActionType('ACTION_TYPE')
// => 'pool-name/duck-name/ACTION_TYPE'
```

### `duckFace.listActionTypes()`

Returns all known short action types. Type is known if `.mapActionType` or `.action` was called with it.

```js
duckFace.listActionTypes()
// => ['EAT_FISH', 'QUACK']
```

### `duckFace.select[]`

Calls registered selector
```js
const state = { counter: 10 }
duckFace.select.counter(state)
// => 10
```

### `duckFace.reduce(state, action)`

Calls duck root reducer
```js
const prepareFish = myDuck.action(null, 'PREPARE_FISH')
myDuck.reducer('EAT_FISH', (state, action, duckFace) => {
  const preparedState = duckFace.reduce(state, prepareFish())
  return {
    ...preparedState,
    // ...
  }
})
```

### `duck.duckFace`

duckFace can also be accessed from the duck itself by `duck.duckFace` name.

## Context

### Create Duck with context
Duck can be created with `duckContext` that will be accessible for selectors and reducers through `duckFace`
```js
const themeDuck = Duck('theme', 'my-app', { highlightColor: 'blue' })
themeDuck.duckFace.duckContext.highlightColor
// => 'blue'
```

### `duck.updateContext`
Duck context can be replaced with `duck.updateContext(newContext)`
```js
themeDuck.updateContext({ highlightColor: 'red' })
```

## Clone duck

Duck can be cloned by calling `.clone(duckName, moduleName, duckContext)`.

Cloned duck will contain selectors, reducers and known action types copied from original duck with
all action types adjusted to `duckName` and `moduleName`.

`duckContext` will be replaced.

Cloned duck can be expanded further.
```js
const baseDuck = Duck('base', 'my-app')
baseDuck.reducer('BASE_ACTION', /* ... */)

const extendedDuck = baseDuck.clone('extended', 'my-app')
extendedDuck.reducer('ANOTHER_ACTION', /* ... */)
```

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
