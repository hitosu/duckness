import { connect } from 'react-redux'
import Link from '../components/Link'
import VisibilityFilterDuck from '../ducks/VisibilityFilterDuck'

export default connect(VisibilityFilterDuck.select.FilterLinkProps, (dispatch, ownProps) => {
  return {
    onClick: () => dispatch(VisibilityFilterDuck.action.setVisibilityFilter(ownProps.filter))
  }
})(Link)
