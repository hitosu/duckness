# `@duckness/store` <!-- omit in toc -->

Simple store for [React](https://reactjs.org/) components. Intended to store data that should not be stored in global store (i.e. redux) or do not need reducers/sagas.

[![NPM](https://img.shields.io/npm/v/@duckness/store)](https://www.npmjs.com/package/@duckness/store)
[![License](https://img.shields.io/github/license/hitosu/duckness)](https://github.com/hitosu/duckness/blob/master/LICENSE)
[![Libraries.io dependency status for latest release, scoped npm package](https://img.shields.io/librariesio/release/npm/@duckness/store)](https://www.npmjs.com/package/@duckness/store?activeTab=dependencies)
[![GitHub issues](https://img.shields.io/github/issues/hitosu/duckness)](https://github.com/hitosu/duckness/issues)
[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@duckness/store)](https://github.com/hitosu/duckness/issues)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@duckness/store)](https://www.npmjs.com/package/@duckness/store)

# Example

```js
import createStore from '@duckness/store'
import React from 'react'

// Create a store with initial state and actions
const counterStore = createStore({
  initState: { count: 0 },
  actions: {
    increment: (amount = 1) => state => ({
      ...state,
      count: state.count + amount
    }),
    
    decrement: (amount = 1) => state => ({
      ...state,
      count: state.count - amount
    }),
    
    reset: () => state => ({
      ...state,
      count: 0
    })
  }
})

// Usage with hooks in components
function CounterComponent() {
  // Select just what you need from the store
  const count = counterStore.useStore({
    selector: state => state.count
  })
  
  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={() => counterStore.actions.increment()}>+1</button>
      <button onClick={() => counterStore.actions.increment(5)}>+5</button>
      <button onClick={() => counterStore.actions.decrement()}>-1</button>
      <button onClick={() => counterStore.actions.reset()}>Reset</button>
    </div>
  )
}

// Or use Consumer component
function CounterWithConsumer() {
  return (
    <counterStore.Consumer selector={state => state.count}>
      {count => (
        <div>
          <h2>Counter: {count}</h2>
          <button onClick={() => counterStore.actions.increment()}>+1</button>
          <button onClick={() => counterStore.actions.decrement()}>-1</button>
        </div>
      )}
    </counterStore.Consumer>
  )
}

// Direct store manipulation
function incrementAsync() {
  setTimeout(() => {
    counterStore.updateStore(state => ({
      ...state,
      count: state.count + 1
    }))
  }, 1000)
}
```

# Table of Contents <!-- omit in toc -->

- [Example](#example)
- [API](#api)
  - [Creating a store](#creating-a-store)
  - [Store interface](#store-interface)
  - [useStore hook](#usestore-hook)
  - [Consumer component](#consumer-component)
  - [Selectors](#selectors)
  - [Exported Helper functions](#exported-helper-functions)
- [@Duckness packages:](#duckness-packages)

# API

## Creating a store

Creates a new store with optional initial state and actions:

```js
const store = createStore({
  initState: {}, // optional initial state, defaults to {}
  actions: {}    // optional action creators, defaults to {}
})
```

## Store interface

The store object provides the following methods:

- `useStore(options)`: React hook to use store state in components
- `Consumer`: React component for consuming store state
- `actions`: Object containing bound action creators
- `updateStore(updater)`: Update store state using an updater function
- `getState(selector)`: Get current state or part of it using a selector
- `subscribe(listener)`: Subscribe to store changes
- `destroy()`: Clear all listeners from the store

## useStore hook

```js
const value = store.useStore({
  updateOnMount: (state) => state,              // Optional updater to run when component mounts
  updateOnUnmount: (state) => state,            // Optional updater to run when component unmounts
  selector: (state) => value,                   // Function to select part of the store state
  shouldSelect: function(prevState, nextState), // Control when selector runs based on store state changes
  shouldUpdate: function(prevValue, nextValue), // Control when component updates based on selected value changes (default: whenChanged)
  debounce: milliseconds,                       // Debounce updates by specified milliseconds (default: no debounce)
  async: boolean                                // Process updates asynchronously (default: false)
})
```

Example:
```js
const username = userStore.useStore({
  selector: state => state.user.name,
  debounce: 300 // only update component 300ms after last state change
})
```

## Consumer component
Same props as in `useStore`

```jsx
<store.Consumer
  selector={state => state.user}
  debounce={300}
  async={false}
>
  {user => (
    <div>Hello, {user.name}!</div>
  )}
</store.Consumer>
```

## Selectors

Selectors extract parts of the store state:

```js
// Get the full state
const state = store.getState()

// Use selector function
const username = store.getState(state => state.user?.name)
```

## Exported Helper functions

- `selectAll(value)`: Returns the entire value (identity function)
- `always()`: Always returns true
- `whenChanged(a, b)`: Returns true if a !== b

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
