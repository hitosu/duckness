import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { CounterDuck } from '../CounterPool'

const Counter = React.lazy(() => import('./Counter'))

App.propTypes = {
  onInc: PropTypes.func.isRequired,
  onDec: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onStartTimer: PropTypes.func.isRequired,
  onStartFastTimer: PropTypes.func.isRequired,
  onStopTimer: PropTypes.func.isRequired
}
export function App(props) {
  return (
    <div>
      <Counter />
      &nbsp;&nbsp;&nbsp;
      <button onClick={props.onInc}>&nbsp;+&nbsp;</button>&nbsp;&nbsp;
      <button onClick={props.onDec}>&nbsp;-&nbsp;</button>&nbsp;&nbsp;
      <button onClick={props.onReset}>&nbsp;0&nbsp;</button>&nbsp;&nbsp;
      <button onClick={props.onStartTimer}>&nbsp;&gt;&nbsp;</button>&nbsp;&nbsp;
      <button onClick={props.onStartFastTimer}>&nbsp;&gt;&gt;&gt;&nbsp;</button>&nbsp;&nbsp;
      <button onClick={props.onStopTimer}>&nbsp;||&nbsp;</button>&nbsp;
    </div>
  )
}

export default connect(null, dispatch => {
  return {
    onInc: () => dispatch(CounterDuck.action.increment()),
    onDec: () => dispatch(CounterDuck.action.decrement()),
    onReset: () => dispatch(CounterDuck.action.reset()),
    onStartTimer: () => dispatch(CounterDuck.action.startTimer()),
    onStartFastTimer: () => dispatch(CounterDuck.action.startFastTimer()),
    onStopTimer: () => dispatch(CounterDuck.action.stopTimer())
  }
})(App)
