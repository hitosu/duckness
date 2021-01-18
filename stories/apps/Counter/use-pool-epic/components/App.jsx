import React from 'react'
import { useDispatchAction } from '@duckness/use-pool'

import CounterPool, { CounterDuck } from '../CounterPool'

const Counter = React.lazy(() => import('./Counter'))
const ActionCounter = React.lazy(() => import('./ActionCounter'))

export default function App() {
  const onInc = useDispatchAction(CounterPool, CounterDuck.action.increment, null)
  const onDec = useDispatchAction(CounterPool, CounterDuck.action.decrement, null)
  const onReset = useDispatchAction(CounterPool, CounterDuck.action.reset, null)
  const onStartTimer = useDispatchAction(CounterPool, CounterDuck.action.startTimer, null)
  const onStartFastTimer = useDispatchAction(CounterPool, CounterDuck.action.startFastTimer, null)
  const onStopTimer = useDispatchAction(CounterPool, CounterDuck.action.stopTimer, null)

  return (
    <div>
      <Counter />
      &nbsp;&nbsp;&nbsp;
      <button onClick={onInc}>&nbsp;+&nbsp;</button>&nbsp;&nbsp;
      <button onClick={onDec}>&nbsp;-&nbsp;</button>&nbsp;&nbsp;
      <button onClick={onReset}>&nbsp;0&nbsp;</button>&nbsp;&nbsp;
      <button onClick={onStartTimer}>&nbsp;&gt;&nbsp;</button>&nbsp;&nbsp;
      <button onClick={onStartFastTimer}>&nbsp;&gt;&gt;&gt;&nbsp;</button>&nbsp;&nbsp;
      <button onClick={onStopTimer}>&nbsp;||&nbsp;</button>&nbsp;&nbsp;
      <ActionCounter />
    </div>
  )
}
