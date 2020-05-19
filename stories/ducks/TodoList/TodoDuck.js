import Duck from '@duckness/duck'
import visibilityFilters from './const/VisibilityFilters'

const TodoDuck = Duck('todo', 'todo-list-pool', { visibilityFilters })

let nextTodoId = 0
TodoDuck.action('addTodo', 'ADD_TODO', text => {
  return { id: nextTodoId++, text }
})

TodoDuck.action('toggleTodo', 'TOGGLE_TODO', id => {
  return { id }
})

TodoDuck.selector('todos', state => state.todos || [])
TodoDuck.selector(
  'visibilityFilter',
  (state, duckFace) => state.visibilityFilter || duckFace.duckContext.visibilityFilters.SHOW_ALL
)
TodoDuck.selector('visibleTodos', (state, duckFace) => {
  const todos = duckFace.select.todos(state)
  const visibilityFilter = duckFace.select.visibilityFilter(state)
  switch (visibilityFilter) {
    case duckFace.duckContext.visibilityFilters.SHOW_ALL:
      return todos
    case duckFace.duckContext.visibilityFilters.SHOW_COMPLETED:
      return todos.filter(t => t.completed)
    case duckFace.duckContext.visibilityFilters.SHOW_ACTIVE:
      return todos.filter(t => !t.completed)
    default:
      throw new Error('Unknown filter: ' + visibilityFilter)
  }
})

TodoDuck.reducer('@@INIT', (state, _action, duckFace) => {
  return {
    ...state,
    todos: duckFace.select.todos(state)
  }
})

TodoDuck.reducer('ADD_TODO', (state, action, duckFace) => {
  const { id, text } = action.payload
  return {
    ...state,
    todos: [
      ...duckFace.select.todos(state),
      {
        id,
        text,
        completed: false
      }
    ]
  }
})

TodoDuck.reducer('TOGGLE_TODO', (state, action, duckFace) => {
  const { id } = action.payload
  return {
    ...state,
    todos: duckFace.select.todos(state).map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
  }
})

export default TodoDuck
