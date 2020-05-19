# `@duckness/saga` <!-- omit in toc -->

[Redux Saga](https://redux-saga.js.org/) extension for [@duckness/duck](https://github.com/hitosu/duckness/tree/master/packages/duck)

[![NPM](https://img.shields.io/npm/v/@duckness/saga)](https://www.npmjs.com/package/@duckness/saga)
[![License](https://img.shields.io/github/license/hitosu/duckness)](https://github.com/hitosu/duckness/blob/master/LICENSE)
[![Libraries.io dependency status for latest release, scoped npm package](https://img.shields.io/librariesio/release/npm/@duckness/saga)](https://www.npmjs.com/package/@duckness/saga?activeTab=dependencies)
[![GitHub issues](https://img.shields.io/github/issues/hitosu/duckness)](https://github.com/hitosu/duckness/issues)
[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@duckness/saga)](https://github.com/hitosu/duckness/issues)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@duckness/saga)](https://www.npmjs.com/package/@duckness/saga)

# Example

```js
// counterDuck.js
import SagaDuck from '@duckness/saga'

// Create duck with the name 'counter' for 'counter-app' app
const counterDuck = SagaDuck('counter', 'counter-app')

// add saga
counterDuck.saga(function* watchIncrementAsync(_duckFace) {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync)
})

// root saga
export const rootSaga = counterDuck.rootSaga
```

# Table of Contents <!-- omit in toc -->

- [Example](#example)
- [API](#api)
  - [Saga](#saga)
    - [`.saga(saga)`](#sagasaga)
    - [`.rootSaga`](#rootsaga)
  - [Error reporter](#error-reporter)
    - [`.errorReporter`](#errorreporter)
- [@Duckness packages:](#duckness-packages)

# API

`SagaDuck` extends `duckness` `Duck`

## Saga

### `.saga(saga)`

Adds a new saga to the duck
```js
myDuck.saga(function* mySaga(duckFace) { /*...*/ })
```

### `.rootSaga`

Duck's root saga that handles errors and restarts sagas that throws exceptions.
```js
myDuck.rootSaga
```

## Error reporter

### `.errorReporter`

Set error reporter (default is `console.error`) that reports uncatched saga errors
```js
myDuck.errorReporter(error => {
  window.Sentry.captureException(error)
})
```

# @Duckness packages:

* [@duckness/duck](https://github.com/hitosu/duckness/tree/master/packages/duck) - [Modular Redux Ducks](https://github.com/erikras/ducks-modular-redux) hatchery
* [@duckness/saga](https://github.com/hitosu/duckness/tree/master/packages/saga) - [Redux Saga](https://redux-saga.js.org/) extension for [@duckness/duck](https://github.com/hitosu/duckness/tree/master/packages/duck)
* [@duckness/pool](https://github.com/hitosu/duckness/tree/master/packages/pool) - [@duckness/duck](https://github.com/hitosu/duckness/tree/master/packages/duck) + [@duckness/saga](https://github.com/hitosu/duckness/tree/master/packages/saga) + [Redux](https://redux.js.org/)
* [@duckness/react-redux-pool](https://github.com/hitosu/duckness/tree/master/packages/react-redux-pool) - [@duckness/pool](https://github.com/hitosu/duckness/tree/master/packages/pool) + [React-Redux](https://react-redux.js.org/)
* [@duckness/use-redux](https://github.com/hitosu/duckness/tree/master/packages/use-redux) - [React hook](https://reactjs.org/docs/hooks-intro.html) for [Redux](https://react-redux.js.org/) store
* [@duckness/use-pool](https://github.com/hitosu/duckness/tree/master/packages/use-pool) - [React hook](https://reactjs.org/docs/hooks-intro.html) for [@duckness/pool](https://github.com/hitosu/duckness/tree/master/packages/pool).
* [@duckness/store](https://github.com/hitosu/duckness/tree/master/packages/store) - simple store for [React](https://reactjs.org/) components
* [@duckness/reactor](https://github.com/hitosu/duckness/tree/master/packages/reactor) - reactive data flow builder