import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import CounterDuck from '../ducks/CounterDuck'

Counter.propTypes = {
  counter: PropTypes.number.isRequired
}
function Counter(props) {
  return <span>[ {props.counter} ]</span>
}

export default connect(CounterDuck.select.CounterProps)(Counter)
