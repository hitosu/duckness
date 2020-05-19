import React from 'react'
import PropTypes from 'prop-types'

Link.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired
}
export default function Link({ active, children, onClick } = {}) {
  return (
    <button
      onClick={onClick}
      disabled={active}
      style={{
        marginLeft: '4px',
        color: active ? '#1EA7FD' : null
      }}
    >
      {children}
    </button>
  )
}
