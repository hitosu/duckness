import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { CounterDuck } from '../CounterPool'

Counter.propTypes = {
  counter: PropTypes.number.isRequired
}
export function Counter(props) {
  return <span>[ {props.counter} ]</span>
}

const CounterPropsSelector = CounterDuck.selector(null, (state, _ownProps, duckFace) => {
  return {
    counter: duckFace.select.counter(state)
  }
})

export default connect(CounterPropsSelector)(Counter)
