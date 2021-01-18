# `@duckness/pool-epic-stream` <!-- omit in toc -->

[@duckness/epic](https://github.com/hitosu/duckness/tree/master/packages/epic) plugin for [@duckness/pool](https://github.com/hitosu/duckness/tree/master/packages/pool)

[![NPM](https://img.shields.io/npm/v/@duckness/pool-epic-stream)](https://www.npmjs.com/package/@duckness/pool-epic-stream)
[![License](https://img.shields.io/github/license/hitosu/duckness)](https://github.com/hitosu/duckness/blob/master/LICENSE)
[![Libraries.io dependency status for latest release, scoped npm package](https://img.shields.io/librariesio/release/npm/@duckness/pool-epic-stream)](https://www.npmjs.com/package/@duckness/pool-epic-stream?activeTab=dependencies)
[![GitHub issues](https://img.shields.io/github/issues/hitosu/duckness)](https://github.com/hitosu/duckness/issues)
[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@duckness/pool-epic-stream)](https://github.com/hitosu/duckness/issues)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@duckness/pool-epic-stream)](https://www.npmjs.com/package/@duckness/pool-epic-stream)

# Example

```js
import Pool from '@duckness/pool'
import PoolEpicStream from '@duckness/pool-epic-stream'
import CounterEpicDuck from './ducks/CounterEpicDuck'

const CounterPool = Pool({
  buildStore: ({ initialCounter = 0 } = {}) => {
    return { counter: initialCounter }
  }
})
CounterPool.addDuck(CounterEpicDuck)
CounterPool.addStream(PoolEpicStream())

CounterPool.build({initialCounter: 0})
CounterPool.store
// => [redux store]
```

# Table of Contents <!-- omit in toc -->

- [Example](#example)
- [API](#api)
  - [Create Pool Epic Stream](#create-pool-epic-stream)
    - [`buildRootEpic`](#buildrootepic)
      - [default `buildRootEpic`](#default-buildrootepic)
  - [Use Pool Epic Stream](#use-pool-epic-stream)
- [Examples](#examples)
- [@Duckness packages:](#duckness-packages)

# API

## Create Pool Epic Stream

```js
PoolEpicStream({
  // build custom root epic from ducks instead of default root epic
  ?buildRootEpic: (ducks, { refDucks, refErrorReporter }) => rootEpic
})
```

### `buildRootEpic`
Optional function for custom root epic
`(ducks, { refDucks, refErrorReporter }) => rootEpic`

* `ducks` are array of ducks
* `refDucks.current` will hold current array of ducks.
* `refErrorReporter.current` will hold current error reporter function.

#### default `buildRootEpic`

Default root epic will combine all duck root epics (if exists).

## Use Pool Epic Stream

```js
pool.addStream(PoolEpicStream())
```

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
