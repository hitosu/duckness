# `@duckness/epic` <!-- omit in toc -->

[Redux-Observable](https://redux-observable.js.org/) extension for [@duckness/duck](https://github.com/hitosu/duckness/tree/master/packages/duck)

[![NPM](https://img.shields.io/npm/v/@duckness/epic)](https://www.npmjs.com/package/@duckness/epic)
[![License](https://img.shields.io/github/license/hitosu/duckness)](https://github.com/hitosu/duckness/blob/master/LICENSE)
[![Libraries.io dependency status for latest release, scoped npm package](https://img.shields.io/librariesio/release/npm/@duckness/epic)](https://www.npmjs.com/package/@duckness/epic?activeTab=dependencies)
[![GitHub issues](https://img.shields.io/github/issues/hitosu/duckness)](https://github.com/hitosu/duckness/issues)
[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@duckness/epic)](https://github.com/hitosu/duckness/issues)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@duckness/epic)](https://www.npmjs.com/package/@duckness/epic)

# Example

```js
// counterDuck.js
import EpicDuck from '@duckness/epic'
import { map, delay } from 'rxjs/operators'
import { ofType } from 'redux-observable'

// Create duck with the name 'counter' for 'counter-app' app
const counterDuck = EpicDuck('counter', 'counter-app')
// Add actions
counterDuck.action('increment', 'INCREMENT')
counterDuck.action('incrementAsync', 'INCREMENT_ASYNC')

// add epic
counterDuck.epic(function incrementAsync(action$, state$, duckFace) {
  return action$.pipe(
    ofType(duckFace.actionTypes.INCREMENT_ASYNC),
    delay(1000),
    map(action => duckFace.action.increment(action.payload))
  )
})

// root epic
export const rootEpic = counterDuck.rootEpic
```

# Table of Contents <!-- omit in toc -->

- [Example](#example)
- [API](#api)
  - [Epic](#epic)
    - [`.epic(epic)`](#epicepic)
    - [`.rootEpic`](#rootepic)
  - [Error reporter](#error-reporter)
    - [`.setErrorReporter`](#seterrorreporter)
    - [`.reportError(error)`](#reporterrorerror)
- [@Duckness packages:](#duckness-packages)

# API

`EpicDuck` extends `duckness` `Duck`

## Epic

### `.epic(epic)`

Adds a new epic to the duck
```js
myDuck.epic(function myEpic(action$, state$, duckFace) { /*...*/ })
```

### `.rootEpic`

Duck's root epic with epics isolation (exceptions in one epic will not break other epics).
```js
myDuck.rootEpic
```

## Error reporter

### `.setErrorReporter`

Set error reporter (default is `console.error`) that reports uncatched epic errors
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
