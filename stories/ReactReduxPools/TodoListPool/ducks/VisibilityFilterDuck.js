import Duck from '@duckness/duck'
import VisibilityFilters from '../VisibilityFilters'

const VisibilityFilterDuck = Duck('visibility-filter ', 'todo-list-pool')

VisibilityFilterDuck.selector('FilterLinkProps', (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
})

VisibilityFilterDuck.action('setVisibilityFilter', 'SET_VISIBILITY_FILTER', filter => {
  return { filter }
})

VisibilityFilterDuck.reducer('SET_VISIBILITY_FILTER', (state, action, _duckFace) => {
  const { filter = VisibilityFilters.SHOW_ALL } = action.payload
  return {
    ...state,
    visibilityFilter: filter
  }
})

export default VisibilityFilterDuck
