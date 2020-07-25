import 'regenerator-runtime/runtime'
import Reactor, { Reagent } from '@duckness/reactor'
import { take, put, delay } from '@duckness/reactor/effects'

const pingReagent = Reagent('ping')
const ping1Reagent = Reagent('ping1')
const ping2Reagent = Reagent('ping2')
const pongReagent = Reagent('pong')

describe('@duckness/reactor Reactor', () => {
  test('ping - pong', () =>
    new Promise(resolve => {
      const reactor = Reactor()

      const pongsReceived = []

      reactor.addReaction(function* () {
        const { payload } = yield take(ping1Reagent.reagentType)
        yield put(pongReagent(payload))
      })
      reactor.addReaction(function* () {
        const { payload: payload1 } = yield take(ping1Reagent.reagentType, ping2Reagent.reagentType)
        yield put(pongReagent(payload1))
        const { payload: payload2 } = yield take(ping1Reagent.reagentType, ping2Reagent.reagentType)
        yield put(pongReagent(payload2))
      })

      reactor.takeEvery('pong', reagent => {
        pongsReceived.push(reagent.payload)
      })

      reactor.run()
      reactor.put(ping1Reagent('1'))
      reactor.put(ping2Reagent('2'))
      expect(reactor.isRunning()).toBeFalsy()
      expect(pongsReceived).toEqual(['1', '1', '2'])
      resolve()
    }))

  test('delayed ping - pong', () =>
    new Promise(resolve => {
      const reactor = Reactor()

      const pongReagent = Reagent('pong')

      const pongsReceived = []

      reactor.addReaction(function* () {
        const { payload } = yield take(pingReagent.reagentType)
        yield delay(100)
        yield put(pongReagent(payload))
        yield delay(200)
        yield put(pongReagent(payload))
      })

      reactor.takeEvery('pong', reagent => {
        pongsReceived.push(reagent.payload)
      })

      jest.useFakeTimers()
      reactor.run()
      reactor.put(pingReagent('1'))
      reactor.put(pingReagent('2'))
      setTimeout(() => {
        expect(reactor.isRunning()).toBeFalsy()
        expect(pongsReceived).toEqual(['1', '1'])
      }, 400)

      jest.runAllTimers()
      jest.useRealTimers()
      resolve()
    }))
})
