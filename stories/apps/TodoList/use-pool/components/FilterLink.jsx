import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import usePool, { useDispatch } from '@duckness/use-pool'

import Link from '../../components/Link'
import TodoListPool, { VisibilityFilterDuck } from '../TodoListPool'

FilterLink.propTypes = {
  filter: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}
export function FilterLink({ filter, children } = {}) {
  const filterIsActive = useCallback(state => VisibilityFilterDuck.select.filterIsActive(state, filter), [filter])

  const active = usePool(TodoListPool, filterIsActive)

  const onClick = useDispatch(
    TodoListPool,
    dispatch => {
      dispatch(VisibilityFilterDuck.action.setVisibilityFilter(filter))
    },
    [filter]
  )

  return (
    <Link active={active} onClick={onClick}>
      {children}
    </Link>
  )
}

export default React.memo(FilterLink, (prevProps, nextProps) => prevProps.filter === nextProps.filter)
