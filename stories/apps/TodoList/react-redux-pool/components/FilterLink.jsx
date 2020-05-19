import { connect } from 'react-redux'
import Link from '../../components/Link'
import { VisibilityFilterDuck } from '../TodoListPool'

export default connect(
  (state, ownProps) => {
    return {
      active: ownProps.filter === state.visibilityFilter
    }
  },
  (dispatch, ownProps) => {
    return {
      onClick: () => dispatch(VisibilityFilterDuck.action.setVisibilityFilter(ownProps.filter))
    }
  }
)(Link)
