import Duck from '../lib/Duck'

function spawnDuck(duckContext) {
  const duck = Duck('Donald', 'Lake', duckContext)
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
      expect(duck.action.quackLoudly.actionType).toBe('Lake/Donald/QUACK')
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

    it('defaults actionType to actionName', () => {
      expect(duck.action('quackSilently')).toBeInstanceOf(Function)
      expect(duck.action.quackSilently).toBeInstanceOf(Function)
      expect(duck.action.quackSilently.actionType).toBe('Lake/Donald/quackSilently')
      expect(duck.actionTypes.quackSilently).toBe('Lake/Donald/quackSilently')
      expect(duck.action.quackSilently({ times: 9000 })).toEqual({
        type: 'Lake/Donald/quackSilently',
        payload: { times: 9000 },
        error: false
      })
    })
  })

  // -----------------------------------------------------

  describe('should handle selectors', () => {
    const duck = spawnDuck()
    duck.selector('fish', state => state.fish)
    duck.selector('fishLength', (state, duckFace) => duckFace.select.fish(state).length)
    const state = { fish: '{=={=<' }

    it('register selectors', function () {
      expect(duck.select.fish).toBeInstanceOf(Function)
      expect(duck.select.fish.selectorName).toBe('fish')
    })

    it('run selectors', function () {
      expect(duck.select.fish(state)).toBe(state.fish)
    })

    it('selectors duckFace', function () {
      expect(duck.select.fishLength(state)).toBe(6)
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
      state = duck(state, duck.action.swim())
      expect(state).toEqual({
        actedTimes: 1
      })
      state = duck(state, duck.action.fly())
      expect(state).toEqual({
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
      state = duck(state, duck.action.slowSwim())
      expect(state).toEqual({
        swimTimes: 1,
        flyTimes: 0
      })
      state = duck(state, duck.action.slowFly())
      expect(state).toEqual({
        swimTimes: 1,
        flyTimes: 1
      })
      state = duck(state, duck.action.fastSwim())
      expect(state).toEqual({
        swimTimes: 2,
        flyTimes: 1
      })
      state = duck(state, duck.action.fastFly())
      expect(state).toEqual({
        swimTimes: 2,
        flyTimes: 2
      })
    })
  })

  // -----------------------------------------------------

  describe('should inject duckFace', () => {
    const duckContext = { longFishLength: 4 }
    const duck = spawnDuck(duckContext)
    duck.selector('fish', state => state.fish)
    duck.selector('longFish', (state, duckFace) =>
      duckFace.select.fish(state).filter(fish => fish.length > duckFace.duckContext.longFishLength)
    )
    duck.reducer('EAT_SMALL_FISH', (state, _action, duckFace) => {
      return {
        ...state,
        fish: state.fish.filter(fish => fish.length <= duckFace.duckContext.longFishLength),
        fishEaten: duckFace.select.longFish(state)
      }
    })
    duck.action('eatSmallFish', 'EAT_SMALL_FISH')

    it('to selectors', () => {
      const state = { fish: ['(==<', '{=={=<'] }
      expect(duck.select.longFish(state)).toEqual(['{=={=<'])
    })

    it('to reducers', () => {
      const state = { fish: ['(==<', '{=={=<'] }
      expect(duck(state, duck.action.eatSmallFish())).toEqual({
        fish: ['(==<'],
        fishEaten: ['{=={=<']
      })
    })

    it('and show duckFace through duck.duckFace', () => {
      expect(duck.duckFace).toBeTruthy()
      expect(duck.duckFace.actionTypes).toBeTruthy()
      expect(duck.duckFace.select).toBeTruthy()
      expect(duck.duckFace.action).toBeTruthy()
      expect(duck.duckFace.reduce).toBeInstanceOf(Function)
      expect(duck.duckFace.duckName).toBe('Donald')
      expect(duck.duckFace.poolName).toBe('Lake')
      expect(duck.duckFace.duckContext).toEqual(duckContext)
      expect(duck.duckFace.reduce).toBe(duck)
    })
  })

  // -----------------------------------------------------

  describe('should clone', () => {
    const duck = spawnDuck({ duck: 'original' })

    it('to another duck', () => {
      duck.selector('fish', state => state.fish)
      duck.action('eatFish', 'EAT')
      duck.reducer('EAT', (state, _action, duckFace) => {
        return {
          ...state,
          ...(duckFace.duckContext || {}),
          fish: [],
          fishEaten: duckFace.select.fish(state).length
        }
      })
      duck.reducer(null, state => {
        return {
          ...state,
          actions: (state.actions || 0) + 1
        }
      })

      const duckClone = duck.clone('Huey', 'Hill', { duck: 'cloned' })
      expect(new Set(duckClone.listActionTypes())).toEqual(new Set(duck.listActionTypes()))
      expect(duckClone.mapActionType('QUACK')).toBe('Hill/Huey/QUACK')
      expect(duckClone.select.fish({ fish: ['{=<'] })).toEqual(['{=<'])
      expect(duckClone({ fish: ['{=<'] }, duckClone.action.eatFish())).toEqual({
        fish: [],
        fishEaten: 1,
        duck: 'cloned',
        actions: 1
      })
    })
  })

  // -----------------------------------------------------

  describe('context', () => {
    const duck = spawnDuck({ mealSize: 1 })
    duck.action('eatFish', 'EAT')
    duck.reducer('EAT', (state, _action, duckFace) => {
      return {
        ...state,
        fishEaten: state.fishEaten + duckFace.duckContext.mealSize
      }
    })
    it('should be able to update', () => {
      expect(duck.duckContext).toEqual({ mealSize: 1 })
      expect(duck.duckFace.duckContext).toEqual({ mealSize: 1 })
      let state = { fishEaten: 0 }
      state = duck(state, duck.action.eatFish())
      expect(state).toEqual({
        fishEaten: 1
      })
      state = duck(state, duck.action.eatFish())
      expect(state).toEqual({
        fishEaten: 2
      })
      duck.updateContext({ mealSize: 3 })
      expect(duck.duckContext).toEqual({ mealSize: 3 })
      expect(duck.duckFace.duckContext).toEqual({ mealSize: 3 })
      state = duck(state, duck.action.eatFish())
      expect(state).toEqual({
        fishEaten: 5
      })
      state = duck(state, duck.action.eatFish())
      expect(state).toEqual({
        fishEaten: 8
      })
    })
  })
})
