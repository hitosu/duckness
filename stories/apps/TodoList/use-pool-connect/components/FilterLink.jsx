import { connect, combineSelectors } from '@duckness/use-pool'

import Link from '../../components/Link'
import TodoListPool, { VisibilityFilterDuck } from '../TodoListPool'

const { selector, shouldUpdate } = combineSelectors({
  active: (state, props) => VisibilityFilterDuck.select.filterIsActive(state, props.filter)
})

export default connect(
  TodoListPool,
  selector,
  shouldUpdate
)(Link, (selected, props, dispatch) => {
  return {
    ...selected,
    onClick: () => void dispatch('visibility-filter', 'setVisibilityFilter', props.filter)
  }
})
