import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { CounterDuck } from '../CounterPool'

ActionCounter.propTypes = {
  actionsDispatched: PropTypes.number.isRequired,
  lastActionDispatchedAt: PropTypes.string.isRequired
}
export function ActionCounter(props) {
  const { actionsDispatched, lastActionDispatchedAt } = props
  return (
    <span>
      (ACTIONS: {actionsDispatched}, LAST: {lastActionDispatchedAt})
    </span>
  )
}

const ActionCounterPropsSelector = CounterDuck.selector(null, (state, _ownProps, duckFace) => {
  return {
    actionsDispatched: duckFace.select.actionsDispatched(state),
    lastActionDispatchedAt: duckFace.select.lastActionDispatchedAt(state)
  }
})

export default connect(ActionCounterPropsSelector)(ActionCounter)
