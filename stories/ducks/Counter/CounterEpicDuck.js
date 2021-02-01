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

CounterEpicDuck.action('increment')
CounterEpicDuck.action('decrement')
CounterEpicDuck.action('reset')
CounterEpicDuck.action('startTimer')
CounterEpicDuck.action('startFastTimer')
CounterEpicDuck.action('stopTimer')

CounterEpicDuck.reducer('increment', (state, _action, duckFace) => {
  return {
    ...state,
    counter: duckFace.select.counter(state) + 1
  }
})

CounterEpicDuck.reducer('decrement', (state, _action, duckFace) => {
  return {
    ...state,
    counter: duckFace.select.counter(state) - 1
  }
})

CounterEpicDuck.reducer('reset', (state, _action, _duckFace) => {
  return {
    ...state,
    counter: 0
  }
})

CounterEpicDuck.epic((action$, _state$, duckFace) => {
  return action$.pipe(
    ofType(duckFace.action.startTimer.actionType),
    mergeMap(_action => {
      return interval(1000).pipe(
        takeUntil(
          action$.pipe(
            ofType(
              duckFace.action.stopTimer.actionType,
              duckFace.action.startFastTimer.actionType,
              duckFace.action.startTimer.actionType
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
    ofType(duckFace.action.startFastTimer.actionType),
    mergeMap(_action => {
      return interval(100).pipe(
        takeUntil(
          action$.pipe(
            ofType(
              duckFace.action.stopTimer.actionType,
              duckFace.action.startTimer.actionType,
              duckFace.action.startTimer.actionType
            )
          )
        ),
        map(_ => duckFace.action.increment())
      )
    })
  )
})

export default CounterEpicDuck
