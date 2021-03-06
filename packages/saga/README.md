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
    - [`.setErrorReporter`](#seterrorreporter)
    - [`.reportError(error)`](#reporterrorerror)
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

Duck's root saga with sagas isolation (exceptions in one saga will not break other sagas).
```js
myDuck.rootSaga
```

## Error reporter

### `.setErrorReporter`

Set error reporter (default is `console.error`) that reports uncatched saga errors
```js
myDuck.setErrorReporter(error => {
  window.Sentry.captureException(error)
})
```

### `.reportError(error)`

Call assigned error reporter
```js
myDuck.reportError(new Error('Clean duck!'))
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
