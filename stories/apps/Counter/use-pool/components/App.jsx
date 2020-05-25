import React, { useCallback } from 'react'
import { useDispatch } from '@duckness/use-pool'

import CounterPool, { CounterDuck } from '../CounterPool'

const Counter = React.lazy(() => import('./Counter'))

export default function App() {
  const increment = useDispatch(CounterPool, CounterDuck.action.increment)
  const onInc = useCallback(() => {
    increment()
  }, [increment])
  const decrement = useDispatch(CounterPool, CounterDuck.action.decrement)
  const onDec = useCallback(() => {
    decrement()
  }, [decrement])
  const reset = useDispatch(CounterPool, CounterDuck.action.reset)
  const onReset = useCallback(() => {
    reset()
  }, [reset])
  const startTimer = useDispatch(CounterPool, CounterDuck.action.startTimer)
  const onStartTimer = useCallback(() => {
    startTimer()
  }, [startTimer])
  const startFastTimer = useDispatch(CounterPool, CounterDuck.action.startFastTimer)
  const onStartFastTimer = useCallback(() => {
    startFastTimer()
  }, [startFastTimer])
  const stopTimer = useDispatch(CounterPool, CounterDuck.action.stopTimer)
  const onStopTimer = useCallback(() => {
    stopTimer()
  }, [stopTimer])

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
