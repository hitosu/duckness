import 'regenerator-runtime/runtime'

import { Reaction } from '@duckness/reactor'

test('@duckness/reactor Reaction', () => {
  const testReaction = Reaction(function* (amount) {
    for (let i = 0; i < amount; i++) {
      yield i
    }
    return amount
  }, 'test reaction')

  expect(testReaction.isRunning).toBeFalsy()
  expect(testReaction.name).toBe('test reaction')

  testReaction.run(3)
  expect(testReaction.isRunning).toBeTruthy()
  expect(testReaction.next()).toEqual({ value: 0, done: false })
  expect(testReaction.next()).toEqual({ value: 1, done: false })
  expect(testReaction.next()).toEqual({ value: 2, done: false })
  expect(testReaction.next()).toEqual({ value: 3, done: true })
  expect(testReaction.stop()).toBeTruthy()
  expect(testReaction.isRunning).toBeFalsy()

  testReaction.run(3)
  expect(testReaction.isRunning).toBeTruthy()
  expect(testReaction.next()).toEqual({ value: 0, done: false })
  expect(testReaction.stop(10)).toBeTruthy()
  expect(testReaction.isRunning).toBeFalsy()
  expect(() => testReaction.next()).toThrow('@duckness/reactor Reaction.next : reaction "test reaction" is not running')
})
