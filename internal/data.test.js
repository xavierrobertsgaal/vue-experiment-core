import { describe, expect, test } from 'bun:test'
import { isRef, isProxy, toRaw, reactive, ref } from 'vue'

// internal/data.ts relies on Nuxt auto-imports; provide the ones toSafeData uses.
Object.assign(globalThis, { isRef, isProxy, toRaw })
const { toSafeData } = await import('./data.ts')

describe('toSafeData', () => {
  test('accepts shared (non-circular) references', () => {
    const shared = { a: 1 }
    // e.g. an experiment.condition payload that lists the same map object under several keys
    expect(toSafeData({ x: shared, y: shared, z: [shared, shared] })).toEqual({
      x: { a: 1 }, y: { a: 1 }, z: [{ a: 1 }, { a: 1 }],
    })
  })

  test('still rejects true cycles', () => {
    const cyclic = { n: 1 }
    cyclic.self = cyclic
    expect(() => toSafeData(cyclic)).toThrow(/circular/)
  })

  test('unwraps refs and reactive proxies', () => {
    const state = reactive({ count: ref(2), nested: { ok: true } })
    expect(toSafeData({ state })).toEqual({ state: { count: 2, nested: { ok: true } } })
  })
})
