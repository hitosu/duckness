import EpicDuck from '@duckness/epic'
import { interval } from 'rxjs'
import { map, mergeMap, takeUntil } from 'rxjs/operators'
import { ofType } from 'redux-observable'

const CounterEpicDuck = EpicDuck('counter', 'counter-pool')

CounterEpicDuck.selector('counter', state => state.counter || 0)
CounterEpicDuck.selector('actionsDispatched', state => state.actionsDispatched || 0)
CounterEpicDuck.selector('lastActionDispatchedAt', state =>
  state.lastActionDispatchedAt ? `${+state.lastActionDispatchedAt}` : ''
)

CounterEpicDuck.action('increment', 'INCREMENT')
CounterEpicDuck.action('decrement', 'DECREMENT')
CounterEpicDuck.action('reset', 'RESET')
CounterEpicDuck.action('startTimer', 'START_TIMER')
CounterEpicDuck.action('startFastTimer', 'START_FAST_TIMER')
CounterEpicDuck.action('stopTimer', 'STOP_TIMER')

CounterEpicDuck.reducer('INCREMENT', (state, _action, duckFace) => {
  return {
    ...state,
    counter: duckFace.select.counter(state) + 1
  }
})

CounterEpicDuck.reducer('DECREMENT', (state, _action, duckFace) => {
  return {
    ...state,
    counter: duckFace.select.counter(state) - 1
  }
})

CounterEpicDuck.reducer('RESET', (state, _action, _duckFace) => {
  return {
    ...state,
    counter: 0
  }
})

CounterEpicDuck.epic((action$, _state$, duckFace) => {
  return action$.pipe(
    ofType(duckFace.actionTypes.START_TIMER),
    mergeMap(_action => {
      return interval(1000).pipe(
        takeUntil(
          action$.pipe(
            ofType(
              duckFace.actionTypes.STOP_TIMER,
              duckFace.actionTypes.START_FAST_TIMER,
              duckFace.actionTypes.START_TIMER
            )
          )
        ),
        map(_ => duckFace.action.increment())
      )
    })
  )
})

CounterEpicDuck.epic((action$, _state$, duckFace) => {
  return action$.pipe(
    ofType(duckFace.actionTypes.START_FAST_TIMER),
    mergeMap(_action => {
      return interval(100).pipe(
        takeUntil(
          action$.pipe(
            ofType(duckFace.actionTypes.STOP_TIMER, duckFace.actionTypes.START_TIMER, duckFace.actionTypes.START_TIMER)
          )
        ),
        map(_ => duckFace.action.increment())
      )
    })
  )
})

export default CounterEpicDuck
