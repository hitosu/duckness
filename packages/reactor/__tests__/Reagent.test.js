import Reagent from '../src/Reagent'

describe('@duckness/reactor Reagent', () => {
  test('should build reagent constructors', () => {
    const TestReagent = Reagent('TEST')
    expect(TestReagent).toBeInstanceOf(Function)
    expect(TestReagent(true)).toEqual({ type: 'TEST', payload: true })
  })

  test('should build reagent constructors with payloadBuilder', () => {
    const AmountReagent = Reagent('AMOUNT', payload => ({ amount: payload }))
    expect(AmountReagent).toBeInstanceOf(Function)
    expect(AmountReagent(10)).toEqual({ type: 'AMOUNT', payload: { amount: 10 } })
  })

  test('should build reagent constructors with reagentTransformer', () => {
    const CustomReagent = Reagent('CUSTOM', null, reagent => ((reagent.custom = true), reagent))
    expect(CustomReagent).toBeInstanceOf(Function)
    expect(CustomReagent(true)).toEqual({ type: 'CUSTOM', payload: true, custom: true })
  })

  test('should build reagent constructors with payloadBuilder and reagentTransformer', () => {
    const CustomAmountReagent = Reagent(
      'AMOUNT',
      payload => ({ amount: payload }),
      reagent => ((reagent.big = reagent.payload.amount > 9000), reagent)
    )
    expect(CustomAmountReagent).toBeInstanceOf(Function)
    expect(CustomAmountReagent(10)).toEqual({ type: 'AMOUNT', payload: { amount: 10 }, big: false })
    expect(CustomAmountReagent(10000)).toEqual({ type: 'AMOUNT', payload: { amount: 10000 }, big: true })
  })
})
