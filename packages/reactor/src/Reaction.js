export default function Reaction(reactionGenerator, name) {
  const state = {
    isRunning: false,
    generator: reactionGenerator,
    iterator: null,
    name
  }

  const Reaction = {}

  function stop(stopValue) {
    if (state.isRunning) {
      state.isRunning = false
      if (null != state.iterator) {
        state.iterator.return(stopValue)
        state.iterator = null
      }
      return true
    } else {
      return false
    }
  }

  function run(...args) {
    if (!state.isRunning) {
      state.isRunning = true
      if (null != state.iterator) {
        stop()
        state.isRunning = true
      }
      state.iterator = state.generator(...args)
    }
  }

  function next(value) {
    if (state.isRunning && null != state.iterator) {
      return state.iterator.next(value)
    } else {
      throw new Error(`@duckness/reactor Reaction.next : reaction "${name ? name : ''}" is not running`)
    }
  }

  Object.defineProperty(Reaction, 'run', { value: run, writable: false, enumerable: true })
  Object.defineProperty(Reaction, 'stop', { value: stop, writable: false, enumerable: true })
  Object.defineProperty(Reaction, 'next', { value: next, writable: false, enumerable: true })
  Object.defineProperty(Reaction, 'isRunning', {
    get() {
      return state.isRunning
    },
    enumerable: true
  })
  Object.defineProperty(Reaction, 'name', {
    get() {
      return state.name
    },
    enumerable: true
  })

  return Reaction
}
