import runReaction from './runtime/runReaction'
import stopReaction from './runtime/stopReaction'

export default function Reactor() {
  const runtime = {
    isRunning: false,
    reactions: new Set(),
    subscriptions: new Map()
  }

  const Reactor = {}
  addReagents(Reactor, runtime)
  addReactions(Reactor, runtime)
  addRuntime(Reactor, runtime)
  addSubscriptions(Reactor, runtime)

  return Reactor
}

function addReagents(Reactor, runtime) {
  function put(reagent) {
    if (runtime.isRunning) {
      const { type: reagentType } = reagent
      if (runtime.subscriptions.has(reagentType)) {
        const listeners = [...runtime.subscriptions.get(reagentType)]
        for (let i = 0; i < listeners.length; i++) {
          listeners[i](reagent)
        }
      }
    }
  }

  Object.defineProperty(Reactor, 'put', { value: put, writable: false, enumerable: true })
}

function addReactions(Reactor, runtime) {
  function addReaction(reactionGenerator) {
    const reaction = {
      isRunning: false,
      generator: reactionGenerator,
      iterator: null
    }
    runtime.reactions.add(reaction)
    if (runtime.isRunning) {
      runReaction(reaction, Reactor, runtime, void 0)
    }
    return () => {
      if (reaction.isRunning) {
        stopReaction(reaction, Reactor, runtime)
      }
      runtime.reactions.delete(reaction)
    }
  }

  Object.defineProperty(Reactor, 'addReaction', { value: addReaction, writable: false, enumerable: true })
}

function addRuntime(Reactor, runtime) {
  function run() {
    if (!runtime.isRunning) {
      runtime.isRunning = true
      const reactions = [...runtime.reactions]
      for (let i = 0; i < reactions.length; i++) {
        const reaction = reactions[i]
        if (reaction.isRunning) {
          stopReaction(reaction, Reactor, runtime)
        }
        runReaction(reaction, Reactor, runtime, void 0)
      }
      return true
    } else {
      return false
    }
  }

  function stop() {
    if (runtime.isRunning) {
      runtime.isRunning = false
      runtime.reactions.forEach(reaction => {
        if (reaction.isRunning) {
          stopReaction(reaction, Reactor, runtime)
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
      return runtime.isRunning
    },
    enumerable: true
  })
}

function addSubscriptions(Reactor, runtime) {
  function takeEvery(reagentType, listener) {
    if ('function' === typeof listener) {
      if (!runtime.subscriptions.has(reagentType)) {
        runtime.subscriptions.set(reagentType, new Set())
      }
      runtime.subscriptions.get(reagentType).add(listener)
      return () => {
        if (runtime.subscriptions.has(reagentType) && runtime.subscriptions.get(reagentType).has(listener)) {
          runtime.subscriptions.get(reagentType).delete(listener)
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
