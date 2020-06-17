import runReactorReaction from './runtime/runReaction'
import stopReactorReaction from './runtime/stopReaction'
import Reaction from './Reaction'

export default function Reactor() {
  const state = {
    isRunning: false,
    reactions: new Set(),
    subscriptions: new Map()
  }

  const Reactor = {}
  addReagents(Reactor, state)
  addReactions(Reactor, state)
  addRuntime(Reactor, state)
  addSubscriptions(Reactor, state)

  return Reactor
}

function addReagents(Reactor, state) {
  function put(reagent) {
    if (state.isRunning) {
      const { type: reagentType } = reagent
      if (state.subscriptions.has(reagentType)) {
        const listeners = [...state.subscriptions.get(reagentType)]
        for (let i = 0; i < listeners.length; i++) {
          listeners[i](reagent)
        }
      }
    }
  }

  Object.defineProperty(Reactor, 'put', { value: put, writable: false, enumerable: true })
}

function addReactions(Reactor, state) {
  function addReaction(reactionGenerator) {
    const reaction = Reaction(reactionGenerator)
    state.reactions.add(reaction)
    if (state.isRunning) {
      runReactorReaction(reaction, Reactor, void 0)
    }
    return () => {
      if (reaction.isRunning) {
        stopReactorReaction(reaction, Reactor)
      }
      state.reactions.delete(reaction)
    }
  }

  Object.defineProperty(Reactor, 'addReaction', { value: addReaction, writable: false, enumerable: true })
}

function addRuntime(Reactor, state) {
  function runReaction(reaction, currentValue, onDone) {
    return runReactorReaction(reaction, Reactor, currentValue, onDone)
  }

  function stopReaction(reaction) {
    return stopReactorReaction(reaction, Reactor)
  }

  function run() {
    if (!state.isRunning) {
      state.isRunning = true
      const reactions = [...state.reactions]
      for (let i = 0; i < reactions.length; i++) {
        const reaction = reactions[i]
        if (reaction.isRunning) {
          stopReactorReaction(reaction, Reactor)
        }
        runReactorReaction(reaction, Reactor, void 0)
      }
      return true
    } else {
      return false
    }
  }

  function stop() {
    if (state.isRunning) {
      state.isRunning = false
      state.reactions.forEach(reaction => {
        if (reaction.isRunning) {
          stopReactorReaction(reaction, Reactor)
        }
      })
      return true
    } else {
      return false
    }
  }

  Object.defineProperty(Reactor, 'run', { value: run, writable: false, enumerable: true })
  Object.defineProperty(Reactor, 'stop', { value: stop, writable: false, enumerable: true })
  Object.defineProperty(Reactor, 'isRunning', {
    get() {
      return state.isRunning
    },
    enumerable: true
  })
  Object.defineProperty(Reactor, 'runReaction', {
    value: runReaction,
    writable: false,
    enumerable: true
  })
  Object.defineProperty(Reactor, 'stopReaction', { value: stopReaction, writable: false, enumerable: true })
}

function addSubscriptions(Reactor, state) {
  function takeEvery(reagentType, listener) {
    if ('function' === typeof listener) {
      if (!state.subscriptions.has(reagentType)) {
        state.subscriptions.set(reagentType, new Set())
      }
      state.subscriptions.get(reagentType).add(listener)
      return () => {
        if (state.subscriptions.has(reagentType) && state.subscriptions.get(reagentType).has(listener)) {
          state.subscriptions.get(reagentType).delete(listener)
          return true
        } else {
          return false
        }
      }
    } else {
      throw new Error('Reactor.takeEvery: listener should be a Function')
    }
  }

  function take(reagentType, listener) {
    if ('function' === typeof listener) {
      const stopTaking = takeEvery(reagentType, reagent => {
        stopTaking()
        listener(reagent)
      })
    } else {
      throw new Error('Reactor.take: listener should be a Function')
    }
  }

  Object.defineProperty(Reactor, 'takeEvery', { value: takeEvery, writable: false, enumerable: true })
  Object.defineProperty(Reactor, 'take', { value: take, writable: false, enumerable: true })
}
