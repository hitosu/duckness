import Duck from '@duckness/duck'
import visibilityFilters from './const/VisibilityFilters'

const VisibilityFilterDuck = Duck('visibility-filter', 'todo-list-pool', { visibilityFilters })

VisibilityFilterDuck.action('setVisibilityFilter', 'SET_VISIBILITY_FILTER', filter => {
  return { filter }
})

VisibilityFilterDuck.reducer('@@INIT', (state, _action, _duckFace) => {
  return {
    ...state,
    visibilityFilter: state.visibilityFilter || visibilityFilters.SHOW_ALL
  }
})

VisibilityFilterDuck.reducer('SET_VISIBILITY_FILTER', (state, action, duckFace) => {
  const { filter = duckFace.duckContext.visibilityFilters.SHOW_ALL } = action.payload
  return {
    ...state,
    visibilityFilter: filter
  }
})

VisibilityFilterDuck.selector('filterIsActive', (state, filter, _duckFace) => state.visibilityFilter === filter)

export default VisibilityFilterDuck
