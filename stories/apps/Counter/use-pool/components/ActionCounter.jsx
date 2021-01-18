import React from 'react'
import usePool, { combineSelectors } from '@duckness/use-pool'

import CounterPool, { CounterDuck } from '../CounterPool'

const { selector: actionCounterSelector, shouldUpdate: shouldUpdateActionCounter } = combineSelectors({
  actionsDispatched: CounterDuck.select.actionsDispatched,
  lastActionDispatchedAt: CounterDuck.select.lastActionDispatchedAt
})

export default function ActionCounter() {
  const { actionsDispatched, lastActionDispatchedAt } = usePool(
    CounterPool,
    actionCounterSelector,
    shouldUpdateActionCounter
  )
  return (
    <span>
      (ACTIONS: {actionsDispatched}, LAST: {lastActionDispatchedAt})
    </span>
  )
}
