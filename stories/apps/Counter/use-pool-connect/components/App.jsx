import React, { Component } from 'react'

import CounterPool from '../CounterPool'

const Counter = React.lazy(() => import('./Counter'))
const ActionCounter = React.lazy(() => import('./ActionCounter'))

export default class App extends Component {
  onInc() {
    CounterPool.dispatch('counter', 'increment')
  }

  onDec() {
    CounterPool.dispatch('counter', 'decrement')
  }

  onReset() {
    CounterPool.dispatch('counter', 'reset')
  }

  onStartTimer() {
    CounterPool.dispatch('counter', 'startTimer')
  }

  onStartFastTimer() {
    CounterPool.dispatch('counter', 'startFastTimer')
  }

  onStopTimer() {
    CounterPool.dispatch('counter', 'stopTimer')
  }

  render() {
    return (
      <div>
        <Counter>Counter: </Counter>
        &nbsp;&nbsp;&nbsp;
        <button onClick={this.onInc}>&nbsp;+&nbsp;</button>&nbsp;&nbsp;
        <button onClick={this.onDec}>&nbsp;-&nbsp;</button>&nbsp;&nbsp;
        <button onClick={this.onReset}>&nbsp;0&nbsp;</button>&nbsp;&nbsp;
        <button onClick={this.onStartTimer}>&nbsp;&gt;&nbsp;</button>&nbsp;&nbsp;
        <button onClick={this.onStartFastTimer}>&nbsp;&gt;&gt;&gt;&nbsp;</button>&nbsp;&nbsp;
        <button onClick={this.onStopTimer}>&nbsp;||&nbsp;</button>&nbsp;&nbsp;
        <ActionCounter />
      </div>
    )
  }
}
