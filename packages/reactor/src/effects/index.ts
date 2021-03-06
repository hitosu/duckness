import effectConstructor, { isEffect } from './Effect'

export const spawn = effectConstructor('spawn')
export const call = effectConstructor('call')
export const take = effectConstructor('take')
export const takeEvery = effectConstructor('takeEvery')
export const put = effectConstructor('put')
export const delay = effectConstructor('delay')
export const getContext = effectConstructor('getContext')
export const setContext = effectConstructor('setContext')
export { isEffect }
