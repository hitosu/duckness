import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect, combineSelectors } from '@duckness/use-pool'

import CounterPool, { CounterDuck } from '../CounterPool'

export class ActionCounter extends Component {
  render() {
    const { actionsDispatched, lastActionDispatchedAt } = this.props
    return (
      <span>
        (ACTIONS: {actionsDispatched}, LAST: {lastActionDispatchedAt})
      </span>
    )
  }
}
ActionCounter.propTypes = {
  actionsDispatched: PropTypes.number.isRequired,
  lastActionDispatchedAt: PropTypes.string.isRequired
}

const { selector, shouldUpdate } = combineSelectors({
  actionsDispatched: CounterDuck.select.actionsDispatched,
  lastActionDispatchedAt: CounterDuck.select.lastActionDispatchedAt
})
export default connect(CounterPool, selector, shouldUpdate)(ActionCounter)
