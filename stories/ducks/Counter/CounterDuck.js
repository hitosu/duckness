import SagaDuck from '@duckness/saga'
import { call, put, race, take, takeLatest, delay } from 'redux-saga/effects'

const CounterDuck = SagaDuck('counter', 'counter-pool')

CounterDuck.selector('counter', state => state.counter || 0)
CounterDuck.selector('actionsDispatched', state => state.actionsDispatched || 0)
CounterDuck.selector('lastActionDispatchedAt', state =>
  state.lastActionDispatchedAt ? `${+state.lastActionDispatchedAt}` : ''
)

CounterDuck.action('increment', 'INCREMENT')
CounterDuck.action('decrement', 'DECREMENT')
CounterDuck.action('reset', 'RESET')
CounterDuck.action('startTimer', 'START_TIMER')
CounterDuck.action('startFastTimer', 'START_FAST_TIMER')
CounterDuck.action('stopTimer', 'STOP_TIMER')

CounterDuck.reducer('INCREMENT', (state, _action, duckFace) => {
  return {
    ...state,
    counter: duckFace.select.counter(state) + 1
  }
})

CounterDuck.reducer('DECREMENT', (state, _action, duckFace) => {
  return {
    ...state,
    counter: duckFace.select.counter(state) - 1
  }
})

CounterDuck.reducer('RESET', (state, _action, _duckFace) => {
  return {
    ...state,
    counter: 0
  }
})

CounterDuck.saga(function* (duckFace) {
  while (true) {
    yield race([
      take([duckFace.actionTypes.STOP_TIMER, duckFace.actionTypes.START_FAST_TIMER]),
      call(function* () {
        yield takeLatest(duckFace.actionTypes.START_TIMER, function* () {
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
      take([duckFace.actionTypes.STOP_TIMER, duckFace.actionTypes.START_TIMER]),
      call(function* () {
        yield takeLatest(duckFace.actionTypes.START_FAST_TIMER, function* () {
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
