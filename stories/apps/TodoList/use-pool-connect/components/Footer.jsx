import React, { Component } from 'react'
import FilterLink from './FilterLink'
import { VisibilityFilterDuck } from '../TodoListPool'

export default class Footer extends Component {
  render() {
    const visibilityFilters = VisibilityFilterDuck.duckContext.visibilityFilters
    return (
      <div>
        <span>Show: </span>
        <FilterLink filter={visibilityFilters.SHOW_ALL}>All</FilterLink>
        <FilterLink filter={visibilityFilters.SHOW_ACTIVE}>Active</FilterLink>
        <FilterLink filter={visibilityFilters.SHOW_COMPLETED}>Completed</FilterLink>
      </div>
    )
  }
}
