import React, { useState, useRef } from 'react'
import CounterPool, { CounterDuck } from '../CounterPool'

export default function FetchCounter() {
  const [selectValue, setSelectValue] = useState('')
  const [fetchOverValue, setFetchOverValue] = useState('')
  const [triggerValue, setTriggerValue] = useState('')
  const clearTriggerRef = useRef()

  return (
    <>
      <div>FETCHING:</div>
      <br />
      <div>
        <button
          onClick={() => {
            setSelectValue(CounterPool.select(CounterDuck.select.counter))
          }}
        >
          SELECT
        </button>
        &nbsp;&nbsp;:&nbsp;&nbsp;
        <span>{selectValue}</span>
      </div>
      <br />
      <div>
        <button
          onClick={async () => {
            setFetchOverValue('...')
            const overValue = await CounterPool.fetch(CounterDuck.select.counter, (selected, resolve, prevSelected) => {
              if (prevSelected !== selected && 0 === selected % 10) {
                resolve(selected)
              }
            })
            setFetchOverValue(`${overValue}`)
          }}
        >
          FETCH (WHEN /10, ONCE)
        </button>
        &nbsp;&nbsp;:&nbsp;&nbsp;
        <span>{fetchOverValue}</span>
      </div>
      <br />
      <div>
        <button
          onClick={() => {
            setTriggerValue('...')
            if (clearTriggerRef.current) {
              clearTriggerRef.current()
            }
            clearTriggerRef.current = CounterPool.trigger(
              CounterDuck.select.counter,
              value => void setTriggerValue(`${value}`),
              (selected, resolve, prevSelected) => {
                if (prevSelected !== selected && 0 === selected % 5) {
                  resolve(selected)
                }
              }
            )
          }}
        >
          START TRIGGER (ON EVERY /5)
        </button>
        &nbsp;
        <button
          onClick={() => {
            if (clearTriggerRef.current) {
              clearTriggerRef.current()
            }
            setTriggerValue('')
          }}
        >
          STOP TRIGGER
        </button>
        &nbsp;&nbsp;:&nbsp;&nbsp;
        <span>{triggerValue}</span>
      </div>
    </>
  )
}
