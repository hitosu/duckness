/**
 * @jest-environment jsdom
 */

import createStore from '../lib/store'

describe('@ducknesss/store', () => {
  it('should create a store', () => {
    const store = createStore({ initState: { counter: 0 } })
    expect(store).toBeDefined()
    expect(store.getState()).toEqual({ counter: 0 })
  })

  it('should update state', () => {
    const store = createStore({ initState: { counter: 0 } })
    store.updateStore(state => ((state.counter = 1), state))
    expect(store.getState()).toEqual({ counter: 1 })
  })

  it('should subscribe to store', () => {
    const store = createStore({ initState: { counter: 0 } })
    const listener = jest.fn()
    store.subscribe(listener)
    store.updateStore(state => (state.counter++, state))
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith({ counter: 1 })
    store.updateStore(state => (state.counter++, state))
    expect(listener).toHaveBeenCalledTimes(2)
    expect(listener).toHaveBeenCalledWith({ counter: 2 })
  })

  it('should unsubscribe from store', () => {
    const store = createStore({ initState: { counter: 0 } })
    const listener = jest.fn()
    const unsubscribe = store.subscribe(listener)
    store.updateStore(state => (state.counter++, state))
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith({ counter: 1 })
    unsubscribe()
    store.updateStore(state => (state.counter++, state))
    expect(listener).toHaveBeenCalledTimes(1)
  })

  describe('listener', () => {
    it('can have selector', () => {
      const store = createStore({ initState: { counter: 0 } })
      const listener = jest.fn()
      listener.selector = state => state.counter
      store.subscribe(listener)
      store.updateStore(state => (state.counter++, state))
      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith(1)
    })

    it('can have shouldUpdate', () => {
      const store = createStore({ initState: { counter: 0 } })
      const listener = jest.fn()
      listener.selector = state => state.counter
      listener.shouldUpdate = (prevCounter, nextCounter) => prevCounter !== nextCounter
      store.subscribe(listener)
      store.updateStore(state => ((state.counter = 1), state))
      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith(1)
      store.updateStore(state => ((state.counter = 1), state))
      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('can have shouldSelect', () => {
      const store = createStore({ initState: { counter: 0 } })
      const listener = jest.fn()
      listener.selector = jest.fn(state => state.counter)
      listener.shouldSelect = (prevState, nextState) => prevState.counter !== nextState.counter
      store.subscribe(listener)
      store.updateStore(state => ({ ...state, counter: 0 }))
      expect(listener).toHaveBeenCalledTimes(0)
      expect(listener.selector).toHaveBeenCalledTimes(0)
      store.updateStore(state => ({ ...state, counter: 1 }))
      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener.selector).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith(1)
    })

    describe('async listener', () => {
      beforeEach(() => {
        jest.useFakeTimers()
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => setTimeout(cb, 0))
        jest
          .spyOn(performance, 'now')
          .mockReturnValueOnce(0) // initial call
          .mockReturnValueOnce(5) // after first listener
          .mockReturnValueOnce(10) // after second listener
          .mockReturnValueOnce(20) // after third listener (exceeds 14ms budget)
      })

      afterEach(() => {
        jest.useRealTimers()
        jest.restoreAllMocks()
      })

      it('should call async listener after state update', () => {
        const store = createStore({ initState: { counter: 0 } })
        const listener = jest.fn()
        listener.async = true

        store.subscribe(listener)
        store.updateStore(state => ({ ...state, counter: 1 }))

        expect(listener).not.toHaveBeenCalled()
        jest.runAllTimers()
        expect(listener).toHaveBeenCalledTimes(1)
        expect(listener).toHaveBeenCalledWith({ counter: 1 })
      })

      it('should work with selector', () => {
        const store = createStore({ initState: { counter: 0, name: 'test' } })
        const listener = jest.fn()
        listener.async = true
        listener.selector = state => state.counter

        store.subscribe(listener)
        store.updateStore(state => ({ ...state, counter: 42 }))

        jest.runAllTimers()
        expect(listener).toHaveBeenCalledWith(42)
      })

      it('should respect shouldUpdate condition', () => {
        const store = createStore({ initState: { counter: 0 } })
        const listener = jest.fn()
        listener.async = true
        listener.selector = state => state.counter
        listener.shouldUpdate = (next, _prev) => next > 5

        store.subscribe(listener)

        store.updateStore(state => ({ ...state, counter: 3 }))
        jest.runAllTimers()
        expect(listener).not.toHaveBeenCalled()

        store.updateStore(state => ({ ...state, counter: 10 }))
        jest.runAllTimers()
        expect(listener).toHaveBeenCalledWith(10)
      })

      it('should respect shouldSelect condition', () => {
        const store = createStore({ initState: { counter: 0, other: 'test' } })
        const selector = jest.fn(state => state.counter)
        const listener = jest.fn()
        listener.async = true
        listener.selector = selector
        listener.shouldSelect = (next, prev) => next.counter !== prev.counter

        store.subscribe(listener)

        store.updateStore(state => ({ ...state, other: 'changed' }))
        jest.runAllTimers()
        expect(selector).not.toHaveBeenCalled()
        expect(listener).not.toHaveBeenCalled()

        store.updateStore(state => ({ ...state, counter: 5 }))
        jest.runAllTimers()
        expect(selector).toHaveBeenCalled()
        expect(listener).toHaveBeenCalledWith(5)
      })

      it('should process listeners across multiple frames when budget exceeded', () => {
        const store = createStore({ initState: { counter: 0 } })
        const listener1 = jest.fn()
        const listener2 = jest.fn()
        const listener3 = jest.fn()

        listener1.async = listener2.async = listener3.async = true

        store.subscribe(listener1)
        store.subscribe(listener2)
        store.subscribe(listener3)

        store.updateStore(state => ({ ...state, counter: 1 }))

        // First frame
        jest.runOnlyPendingTimers()
        expect(listener1).toHaveBeenCalledTimes(1)
        expect(listener2).toHaveBeenCalledTimes(1)
        expect(listener3).not.toHaveBeenCalled()

        // Second frame (should process remaining listeners)
        jest.runOnlyPendingTimers()
        expect(listener1).toHaveBeenCalledTimes(1)
        expect(listener2).toHaveBeenCalledTimes(1)
        expect(listener3).toHaveBeenCalledTimes(1)
      })

      it('should maintain separate prevValue for async listeners', () => {
        const store = createStore({ initState: { counter: 0 } })
        const listener = jest.fn()
        listener.async = true
        listener.selector = state => state.counter
        listener.shouldUpdate = jest.fn((next, prev) => {
          return next !== prev
        })

        store.subscribe(listener)

        store.updateStore(state => ({ ...state, counter: 1 }))
        jest.runAllTimers()

        expect(listener.shouldUpdate).toHaveBeenCalledWith(1, undefined)
        expect(listener).toHaveBeenCalledWith(1)

        store.updateStore(state => ({ ...state, counter: 1 }))
        jest.runAllTimers()

        expect(listener.shouldUpdate).toHaveBeenCalledWith(1, 1)
        expect(listener).toHaveBeenCalledTimes(1) // No additional call
      })
    })
  })
})
