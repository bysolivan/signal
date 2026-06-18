import { assertEquals, assertThrows } from '@std/assert'
import { Signal } from '../source/index.ts'

Deno.test('Signal: should initialize with default values', () => {
  const signal = new Signal<[string, number]>()
  assertEquals(signal.enabled, true)
  assertEquals(signal.disposed, false)
  assertEquals(signal.listeners.size, 0)
})

Deno.test('Signal: should connect listeners and fire payloads', () => {
  const signal = new Signal<[string, number]>()
  let executedCount = 0
  let capturedName = ''
  let capturedAge = 0

  const connection = signal.connect((name, age) => {
    executedCount++
    capturedName = name
    capturedAge = age
  })

  signal.fire('Alice', 30)

  assertEquals(executedCount, 1)
  assertEquals(capturedName, 'Alice')
  assertEquals(capturedAge, 30)

  connection.disconnect()
  signal.fire('Bob', 25)

  assertEquals(executedCount, 1)
})

Deno.test('Signal: should throw error when connected to a disposed signal', () => {
  const signal = new Signal<[]>()
  signal.dispose()

  assertThrows(
    () => {
      signal.connect(() => {})
    },
    Error,
    'Signal is disposed, cannot connect',
  )
})

Deno.test('Signal: should throw error when connected to a disabled signal', () => {
  const signal = new Signal<[]>()
  signal.enabled = false

  assertThrows(
    () => {
      signal.connect(() => {})
    },
    Error,
    'Signal is disabled, cannot connect',
  )
})

Deno.test('Signal: should throw error when firing a disposed signal', () => {
  const signal = new Signal<[]>()
  signal.dispose()

  assertThrows(
    () => {
      signal.fire()
    },
    Error,
    'Signal is disposed, cannot fire',
  )
})

Deno.test('Signal: should throw error when firing a disabled signal', () => {
  const signal = new Signal<[]>()
  signal.enabled = false

  assertThrows(
    () => {
      signal.fire()
    },
    Error,
    'Signal is disabled, cannot fire',
  )
})

Deno.test('Signal: should expose a public view restricted from firing or clearing', () => {
  const signal = new Signal<[boolean]>()
  const exposed = signal.expose()

  let receivedValue = false
  exposed.connect((value) => {
    receivedValue = value
  })

  signal.fire(true)

  assertEquals(exposed.enabled, true)
  assertEquals(exposed.disposed, false)
  assertEquals(exposed.listeners.size, 1)
  assertEquals(receivedValue, true)
})

Deno.test('Signal: should clear non-persistent listeners by default', () => {
  const signal = new Signal<[]>()
  signal.connect(() => {}, false)
  signal.connect(() => {}, true)

  signal.clear(false)

  assertEquals(signal.listeners.size, 1)
})

Deno.test('Signal: should clear all listeners when forced', () => {
  const signal = new Signal<[]>()
  signal.connect(() => {}, false)
  signal.connect(() => {}, true)

  signal.clear(true)

  assertEquals(signal.listeners.size, 0)
})

Deno.test('Signal: should restore signal by clearing listeners and enabling it', () => {
  const signal = new Signal<[]>()
  signal.connect(() => {})
  signal.enabled = false

  signal.restore()

  assertEquals(signal.listeners.size, 0)
  assertEquals(signal.enabled, true)
})

Deno.test('Signal: should throw error when restoring a disposed signal', () => {
  const signal = new Signal<[]>()
  signal.dispose()

  assertThrows(
    () => {
      signal.restore()
    },
    Error,
    'Signal is disposed, cannot restore',
  )
})

Deno.test('Signal: should fully dispose the signal, clear listeners, and prevent further actions', () => {
  const signal = new Signal<[]>()
  signal.connect(() => {})

  signal.dispose()

  assertEquals(signal.disposed, true)
  assertEquals(signal.listeners.size, 0)
})

Deno.test('Signal: should throw error when disposing an already disposed signal', () => {
  const signal = new Signal<[]>()
  signal.dispose()

  assertThrows(
    () => {
      signal.dispose()
    },
    Error,
    'Signal is already disposed, cannot dispose',
  )
})
