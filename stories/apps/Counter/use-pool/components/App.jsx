import React from 'react'
import { useDispatch } from '@duckness/use-pool'

import CounterPool, { CounterDuck } from '../CounterPool'

const Counter = React.lazy(() => import('./Counter'))

export default function App() {
  const onInc = useDispatch(CounterPool, CounterDuck.action.increment)
  const onDec = useDispatch(CounterPool, CounterDuck.action.decrement)
  const onReset = useDispatch(CounterPool, CounterDuck.action.reset)
  const onStartTimer = useDispatch(CounterPool, CounterDuck.action.startTimer)
  const onStartFastTimer = useDispatch(CounterPool, CounterDuck.action.startFastTimer)
  const onStopTimer = useDispatch(CounterPool, CounterDuck.action.stopTimer)

  return (
    <div>
      <Counter />
      &nbsp;&nbsp;&nbsp;
      <button onClick={onInc}>&nbsp;+&nbsp;</button>&nbsp;&nbsp;
      <button onClick={onDec}>&nbsp;-&nbsp;</button>&nbsp;&nbsp;
      <button onClick={onReset}>&nbsp;0&nbsp;</button>&nbsp;&nbsp;
      <button onClick={onStartTimer}>&nbsp;&gt;&nbsp;</button>&nbsp;&nbsp;
      <button onClick={onStartFastTimer}>&nbsp;&gt;&gt;&gt;&nbsp;</button>&nbsp;&nbsp;
      <button onClick={onStopTimer}>&nbsp;||&nbsp;</button>&nbsp;
    </div>
  )
}
