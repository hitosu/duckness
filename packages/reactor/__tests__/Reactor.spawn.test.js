import 'regenerator-runtime/runtime'
import Reactor, { Reagent } from '@duckness/reactor'
import { takeEvery, take, put, spawn, call } from '../lib/effects'

const pingReagent = Reagent('ping')
const pongReagent = Reagent('pong')

describe('@duckness/reactor Reactor [spawn]', () => {
  test('yeild Promise', () =>
    new Promise(resolve => {
      const reactor = Reactor()
      const pongsReceived = []

      reactor.addReaction(function* () {
        yield takeEvery('ping', function* (reagent) {
          const resolvedPayload = yield new Promise(resolve => {
            resolve(reagent.payload + 1)
          })
          yield put(pongReagent(resolvedPayload))
        })
      })

      reactor.takeEvery('pong', reagent => {
        pongsReceived.push(reagent.payload)
      })

      reactor.run()
      reactor.put(pingReagent(1))
      reactor.put(pingReagent(2))
      setTimeout(() => {
        expect(pongsReceived).toEqual([2, 3])
        resolve()
      }, 0)
    }))

  test('yeild async function', () =>
    new Promise(resolve => {
      const reactor = Reactor()
      const pongsReceived = []

      const asyncResolve = async function (value) {
        return value + 1
      }

      reactor.addReaction(function* () {
        yield takeEvery('ping', function* (reagent) {
          const resolvedPayload = yield asyncResolve(reagent.payload)
          yield put(pongReagent(resolvedPayload))
        })
      })

      reactor.takeEvery('pong', reagent => {
        pongsReceived.push(reagent.payload)
      })

      reactor.run()
      reactor.put(pingReagent(1))
      reactor.put(pingReagent(2))
      setTimeout(() => {
        expect(pongsReceived).toEqual([2, 3])
        resolve()
      }, 0)
    }))

  test('call', () => {
    const reactor = Reactor()
    const pongsReceived = []

    reactor.addReaction(function* () {
      const reagent = yield take(pingReagent.reagentType)
      const sum = yield call(function* (valueA) {
        const { payload: valueB } = yield take(pingReagent.reagentType)
        const { payload: valueC } = yield take(pingReagent.reagentType)
        return valueA + valueB + valueC + 1
      }, reagent.payload)
      yield put(pongReagent(sum))
    })

    reactor.takeEvery('pong', reagent => {
      pongsReceived.push(reagent.payload)
    })

    reactor.run()
    reactor.put(pingReagent(1))
    reactor.put(pingReagent(2))
    reactor.put(pingReagent(3))
    expect(reactor.isRunning()).toBeFalsy()
    expect(pongsReceived).toEqual([7])
  })

  test('spawn', () => {
    const reactor = Reactor()
    const pongsReceived = []

    reactor.addReaction(function* () {
      const pongReaction = function* (prefix = '') {
        const { payload } = yield take(pingReagent.reagentType)
        yield put(pongReagent(`${prefix}${payload}`))
      }
      yield spawn(pongReaction, '1')
      yield spawn(pongReaction, '2')
      yield spawn(pongReaction, '3')
    })

    reactor.takeEvery('pong', reagent => {
      pongsReceived.push(reagent.payload)
    })

    reactor.run()
    reactor.put(pingReagent('X'))
    expect(reactor.isRunning()).toBeFalsy()
    expect(pongsReceived).toEqual(['1X', '2X', '3X'])
  })
})
