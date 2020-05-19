import React from 'react'
import PropTypes from 'prop-types'

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
}
export default function Todo({ onClick, completed, text } = {}) {
  return (
    <li
      onClick={onClick}
      style={{
        textDecoration: completed ? 'line-through' : 'none',
        cursor: 'pointer',
        fontSize: '1.2em',
        margin: '0.25em 0 0 0'
      }}
    >
      {text}
    </li>
  )
}
