import SagaDuck from '@duckness/saga'
import { call, put, race, take, takeLatest, delay } from 'redux-saga/effects'

const CounterDuck = SagaDuck('counter', 'counter-pool')

CounterDuck.selector('counter', state => state.counter || 0)
CounterDuck.selector('actionsDispatched', state => state.actionsDispatched || 0)
CounterDuck.selector('lastActionDispatchedAt', state =>
  state.lastActionDispatchedAt ? `${+state.lastActionDispatchedAt}` : ''
)

CounterDuck.action('increment')
CounterDuck.action('decrement')
CounterDuck.action('reset')
CounterDuck.action('startTimer')
CounterDuck.action('startFastTimer')
CounterDuck.action('stopTimer')

CounterDuck.reducer('increment', (state, _action, duckFace) => {
  return {
    ...state,
    counter: duckFace.select.counter(state) + 1
  }
})

CounterDuck.reducer('decrement', (state, _action, duckFace) => {
  return {
    ...state,
    counter: duckFace.select.counter(state) - 1
  }
})

CounterDuck.reducer('reset', (state, _action, _duckFace) => {
  return {
    ...state,
    counter: 0
  }
})

CounterDuck.saga(function* (duckFace) {
  while (true) {
    yield race([
      take([duckFace.action.stopTimer.actionType, duckFace.action.startFastTimer.actionType]),
      call(function* () {
        yield takeLatest(duckFace.action.startTimer.actionType, function* () {
          while (true) {
            yield delay(1000)
            yield put(duckFace.action.increment())
          }
        })
      })
    ])
  }
})

CounterDuck.saga(function* (duckFace) {
  while (true) {
    yield race([
      take([duckFace.action.stopTimer.actionType, duckFace.action.startTimer.actionType]),
      call(function* () {
        yield takeLatest(duckFace.action.startFastTimer.actionType, function* () {
          while (true) {
            yield delay(100)
            yield put(duckFace.action.increment())
          }
        })
      })
    ])
  }
})

export default CounterDuck
