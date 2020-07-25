import 'regenerator-runtime/runtime'
import Reactor, { Reagent } from '@duckness/reactor'
import { take, takeEvery, put, delay, getContext, setContext } from '@duckness/reactor/effects'

const pingReagent = Reagent('ping')
const ping1Reagent = Reagent('ping1')
const ping2Reagent = Reagent('ping2')
const pongReagent = Reagent('pong')

describe('@duckness/reactor Reactor [basic]', () => {
  test('ping - pong', () => {
    const reactor = Reactor()
    const pongsReceived = []

    reactor.addReaction(function* () {
      const { payload } = yield take(ping1Reagent.reagentType)
      yield put(pongReagent(payload))
    })
    reactor.addReaction(function* () {
      const { payload: payload1 } = yield take([ping1Reagent.reagentType, ping2Reagent.reagentType])
      yield put(pongReagent(payload1))
      const { payload: payload2 } = yield take([ping1Reagent.reagentType, ping2Reagent.reagentType])
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
  })

  test('delayed ping - pong', () => {
    const reactor = Reactor()
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
  })

  test('get / set context', () => {
    const reactor = Reactor()

    let takeEveryStopped = false
    reactor.addReaction(function* () {
      try {
        yield takeEvery('ping', function* (reagent) {
          const { payload: incValue } = reagent
          const { pingsCounter } = yield getContext('pingsCounter')
          const updatedCounter = pingsCounter + incValue
          yield put(pongReagent(updatedCounter))
          yield setContext({ pingsCounter: updatedCounter })
        })
      } finally {
        takeEveryStopped = true
      }
    })

    reactor.addReaction(function* () {
      const { payload: incValue } = yield take(pingReagent.reagentType)
      const { pingsCounter } = yield getContext('pingsCounter')
      yield put(pongReagent(pingsCounter + incValue))
    })

    const pongsReceived = []
    reactor.takeEvery('pong', reagent => {
      pongsReceived.push(reagent.payload)
    })

    reactor.setContext({ pingsCounter: 0 })
    reactor.run()
    reactor.put(pingReagent(1))
    reactor.put(pingReagent(2))
    reactor.put(pingReagent(3))

    expect(reactor.isRunning()).toBeTruthy()
    expect(pongsReceived).toEqual([1, 2, 3, 6])
    reactor.stop()
    expect(reactor.isRunning()).toBeFalsy()
    expect(takeEveryStopped).toBeTruthy()
  })
})
