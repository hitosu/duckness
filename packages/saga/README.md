# `@duckness/saga`

Saga extension for [Duckness - Modular Redux Ducks hatchery](https://github.com/hitosu/duckness/tree/master/packages/duck).

[![NPM](https://img.shields.io/npm/v/@duckness/saga)](https://www.npmjs.com/package/@duckness/saga)
[![License](https://img.shields.io/github/license/hitosu/duckness)](https://github.com/hitosu/duckness/blob/master/LICENSE)
![dependencies](https://img.shields.io/david/hitosu/duckness?path=packages%2Fsaga)
![dev dependencies](https://img.shields.io/david/dev/hitosu/duckness?path=packages%2Fsaga)
[![GitHub issues](https://img.shields.io/github/issues/hitosu/duckness)](https://github.com/hitosu/duckness/issues)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@duckness/saga)

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

# Table of Contents

- [`@duckness/saga`](#ducknesssaga)
- [Example](#example)
- [Table of Contents](#table-of-contents)
- [API](#api)
  - [Saga](#saga)
    - [`.saga(saga)`](#sagasaga)
    - [`.rootSaga`](#rootsaga)
  - [Error reporter](#error-reporter)
    - [`.errorReporter`](#errorreporter)
- [Additional resources](#additional-resources)

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

# Additional resources

* [@duckness/duck](https://github.com/hitosu/duckness/tree/master/packages/duck) - @duckness/duck - Modular Redux Ducks hatchery
* [@duckness/pool](https://github.com/hitosu/duckness/tree/master/packages/pool) - boilerplate for React-Redux apps based on @duckness/duck and @duckness/saga
