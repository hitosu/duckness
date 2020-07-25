import 'regenerator-runtime/runtime'
import Reactor, { Reagent } from '@duckness/reactor'
import { take, put } from '@duckness/reactor/effects'

describe('@duckness/reactor Reactor', () => {
  test('something', () =>
    new Promise(resolve => {
      const reactor = Reactor()

      const pingReagent = Reagent('ping')
      const pongReagent = Reagent('pong')

      reactor.addReaction(function* () {
        const { payload } = yield take(pingReagent.reagentType)
        yield put(pongReagent(payload))
      })
      reactor.addReaction(function* () {
        const { payload } = yield take(pingReagent.reagentType)
        yield put(pongReagent(payload))
      })

      reactor.run('A', 'B', 'C')
      reactor.put(pingReagent('*'))
      expect(reactor.isRunning()).toBeFalsy()
      resolve()
    }))
})
