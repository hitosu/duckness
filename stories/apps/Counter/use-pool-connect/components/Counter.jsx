import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect, combineSelectors } from '@duckness/use-pool'

import CounterPool, { CounterDuck } from '../CounterPool'

export class Counter extends Component {
  render() {
    const { counter, children } = this.props
    return (
      <span>
        {children}[ {counter} ]
      </span>
    )
  }
}
Counter.propTypes = {
  counter: PropTypes.number.isRequired,
  children: PropTypes.any
}

const { selector, shouldUpdate } = combineSelectors({
  counter: CounterDuck.select.counter
})
export default connect(CounterPool, selector, shouldUpdate)(Counter)
