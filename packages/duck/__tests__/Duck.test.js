import Duck from '../src/Duck'

function spawnDuck() {
  const duck = Duck('Donald', 'Lake')
  duck.mapActionType('QUACK')
  duck.mapActionType('SWIM')
  duck.mapActionType('EAT')
  return duck
}

describe('@duckness/duck', () => {
  describe('should handle action types', () => {
    const duck = spawnDuck()

    it('map action types', () => {
      expect(duck.mapActionType('QUACK')).toBe('Lake/Donald/QUACK')
      expect(duck.mapActionType('SWIM')).toBe('Lake/Donald/SWIM')
      expect(duck.mapActionType('EAT')).toBe('Lake/Donald/EAT')
    })

    it('return known action types by short name', () => {
      expect(duck.actionTypes.QUACK).toBe('Lake/Donald/QUACK')
      expect(duck.actionTypes.SWIM).toBe('Lake/Donald/SWIM')
      expect(duck.actionTypes.EAT).toBe('Lake/Donald/EAT')
      expect(duck.actionTypes.MEOW).toBeUndefined()
    })

    it('list known action types', () => {
      expect(new Set(duck.listActionTypes())).toEqual(new Set(['QUACK', 'SWIM', 'EAT']))
    })
  })

  // -----------------------------------------------------

  describe('should build action constructors', () => {
    const duck = spawnDuck()

    it('that accepts payload', () => {
      expect(duck.action('quackLoudly', 'QUACK')).toBeInstanceOf(Function)
      expect(duck.action.quackLoudly).toBeInstanceOf(Function)
      expect(duck.action.quackLoudly.actionType).toBe('QUACK')
      expect(duck.action.quackLoudly({ loudness: 9000 })).toEqual({
        type: 'Lake/Donald/QUACK',
        payload: { loudness: 9000 },
        error: false
      })
    })

    it('with payloadBuilder', () => {
      const quackActionConstructor = duck.action(null, 'QUACK', payload => {
        return { loudness: payload.loudness * payload.loudnessMultiplicator }
      })
      expect(quackActionConstructor).toBeInstanceOf(Function)
      expect(quackActionConstructor({ loudness: 1000, loudnessMultiplicator: 9 })).toEqual({
        type: 'Lake/Donald/QUACK',
        payload: { loudness: 9000 },
        error: false
      })
    })

    it('with actionTransformer', () => {
      const quackActionConstructor = duck.action(null, 'QUACK', null, action => {
        return {
          ...action,
          direction: 'moon'
        }
      })
      expect(quackActionConstructor).toBeInstanceOf(Function)
      expect(quackActionConstructor({ loudness: 9000 })).toEqual({
        type: 'Lake/Donald/QUACK',
        payload: { loudness: 9000 },
        direction: 'moon',
        error: false
      })
    })
  })

  // -----------------------------------------------------

  describe('should handle selectors', () => {
    const duck = spawnDuck()
    duck.selector('fish', state => state.fish)

    it('register selectors', function () {
      expect(duck.select.fish).toBeInstanceOf(Function)
      expect(duck.select.fish.selectorName).toBe('fish')
    })

    it('run selectors', function () {
      const state = { fish: ['(==<', '{=={=<'] }
      expect(duck.select.fish(state)).toBe(state.fish)
    })
  })

  // -----------------------------------------------------

  describe('should handle reducers', () => {
    it('register and run reducer', () => {
      const duck = spawnDuck()
      duck.reducer('SWIM', (state, action) => {
        return {
          ...state,
          position: {
            ...state.position,
            x: state.position.x + action.payload.dx,
            y: state.position.y + action.payload.dy
          }
        }
      })
      duck.action('swim', 'SWIM')
      const state = { position: { x: 0, y: 0 } }
      expect(duck(state, duck.action.swim({ dx: 1, dy: 2 }))).toEqual({
        position: { x: 1, y: 2 }
      })
      duck.reducer('SWIM', (state, _action) => {
        return { ...state, keptWarm: true }
      })
      expect(duck(state, duck.action.swim({ dx: 1, dy: 2 }))).toEqual({
        position: { x: 1, y: 2 },
        keptWarm: true
      })
    })

    it('register and run wildcard reducer', () => {
      const duck = spawnDuck()
      duck.reducer(null, (state, _action) => {
        return { ...state, actedTimes: (state.actedTimes || 0) + 1 }
      })
      duck.action('swim', 'SWIM')
      duck.action('fly', 'FLY')
      let state = {}
      expect((state = duck(state, duck.action.swim()))).toEqual({
        actedTimes: 1
      })
      expect((state = duck(state, duck.action.fly()))).toEqual({
        actedTimes: 2
      })
    })

    it('register and run custom reducers', () => {
      const duck = spawnDuck()
      duck.reducer(
        action => action.type.endsWith('SWIM'),
        (state, _action) => {
          return { ...state, swimTimes: (state.swimTimes || 0) + 1 }
        }
      )
      duck.reducer(
        action => action.type.endsWith('FLY'),
        (state, _action) => {
          return { ...state, flyTimes: (state.flyTimes || 0) + 1 }
        }
      )
      duck.action('slowSwim', 'SLOW_SWIM')
      duck.action('fastSwim', 'FAST_SWIM')
      duck.action('slowFly', 'SLOW_FLY')
      duck.action('fastFly', 'FAST_FLY')
      let state = {
        swimTimes: 0,
        flyTimes: 0
      }
      expect((state = duck(state, duck.action.slowSwim()))).toEqual({
        swimTimes: 1,
        flyTimes: 0
      })
      expect((state = duck(state, duck.action.slowFly()))).toEqual({
        swimTimes: 1,
        flyTimes: 1
      })
      expect((state = duck(state, duck.action.fastSwim()))).toEqual({
        swimTimes: 2,
        flyTimes: 1
      })
      expect((state = duck(state, duck.action.fastFly()))).toEqual({
        swimTimes: 2,
        flyTimes: 2
      })
    })
  })
})
