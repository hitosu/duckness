import 'regenerator-runtime/runtime'

import Reactor, { Reagent } from '@duckness/reactor'
import { take, put, delay, call } from '@duckness/reactor/effects'

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

  test('ping cascade reactions', () =>
    new Promise(resolve => {
      const TEST_PINGS = 100

      const reactor = Reactor()
      const pingReagent1 = Reagent('ping1')
      const pongReagent1 = Reagent('pong1')
      const pongReagent2 = Reagent('pong2')
      const pongReagent3 = Reagent('pong3')

      reactor.addReaction(function* () {
        while (true) {
          const { payload } = yield take('ping1')
          yield put(pongReagent1(payload))
        }
      })

      reactor.addReaction(function* () {
        while (true) {
          const { payload } = yield take('pong1')
          yield put(pongReagent2(payload))
        }
      })

      reactor.addReaction(function* () {
        while (true) {
          const { payload } = yield take('pong2')
          yield put(pongReagent3(payload))
        }
      })

      let currentPong = 1
      reactor.takeEvery('pong3', ({ type, payload } = {}) => {
        expect(type).toBe('pong3')
        expect(payload).toBe(currentPong)
        currentPong++
        if (TEST_PINGS <= currentPong) {
          resolve()
        }
      })

      reactor.run()
      for (let i = 1; i <= TEST_PINGS; i++) {
        reactor.put(pingReagent1(i))
      }
    }))

  test('delay effect', () =>
    new Promise(resolve => {
      const reactor = Reactor()
      const pingReagent = Reagent('ping')
      const pongReagent = Reagent('pong')

      reactor.addReaction(function* () {
        yield take('ping')
        yield delay(1000)
        yield put(pongReagent())
        yield delay(2000)
        yield put(pongReagent())
        yield delay(3000)
        yield put(pongReagent())
        yield delay(4000)
        yield put(pongReagent())
      })

      let pongsReceived = 0
      reactor.takeEvery('pong', () => {
        pongsReceived++
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000 * pongsReceived)
        if (4 === pongsReceived) {
          resolve()
        }
      })

      jest.useFakeTimers()

      reactor.run()
      reactor.put(pingReagent())

      jest.runAllTimers()
      jest.useRealTimers()
    }))

  test('call effect with generator', () =>
    new Promise(resolve => {
      const reactor = Reactor()
      const pingReagent = Reagent('ping')
      const pongReagent = Reagent('pong')

      reactor.addReaction(function* () {
        yield take('ping')
        const amount = yield call(function* (amount) {
          for (let i = 0; i < amount; i++) {
            yield put(pongReagent(i + 1))
          }
          return amount
        }, 9)
        expect(amount).toBe(9)
        yield put(pongReagent(10))
      })

      let lastPongValueReceived = 0
      reactor.takeEvery('pong', ({ payload: pongValue } = {}) => {
        expect(pongValue).toBe(lastPongValueReceived + 1)
        lastPongValueReceived = pongValue
        if (10 === pongValue) {
          resolve()
        }
      })

      reactor.run()
      reactor.put(pingReagent())
    }))
})
