import 'regenerator-runtime/runtime'

import Reactor, { Reagent } from '@duckness/reactor'
import { take, put } from '@duckness/reactor/effects'

describe('@duckness/reactor Reactor', () => {
  test('ping reaction', () =>
    new Promise(resolve => {
      const TEST_PINGS = 100

      const reactor = Reactor()
      const pingReagent = Reagent('ping')
      const pongReagent = Reagent('pong')

      reactor.addReaction(function* () {
        while (true) {
          const { payload } = yield take('ping')
          yield put(pongReagent(payload))
        }
      })

      let currentPong = 1
      reactor.takeEvery('pong', ({ type, payload } = {}) => {
        expect(type).toBe('pong')
        expect(payload).toBe(currentPong)
        currentPong++
        if (TEST_PINGS <= currentPong) {
          resolve()
        }
      })

      reactor.run()
      for (let i = 1; i <= TEST_PINGS; i++) {
        reactor.put(pingReagent(i))
      }
    }))
})
