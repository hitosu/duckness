import React from 'react'
import usePool from '@duckness/use-pool'

import CounterPool, { CounterDuck } from '../CounterPool'

export default function Counter() {
  const [counter] = usePool(CounterPool, CounterDuck.select.counter, shouldUpdateCounter)
  return <span>[ {counter} ]</span>
}

function shouldUpdateCounter(nextValue, prevValue) {
  return nextValue !== prevValue
}
