import { describe, expect, it } from 'vitest'
import { ALL_FEATURES, FEATURES } from './features'
import { MARKET_NOTES } from './markets'
import { FEATURE_IDS, type FeatureId } from './types'

// Invariants that TypeScript cannot express. A failure here means the feature graph
// would show something a domain expert would call wrong.
describe('feature data', () => {
  it('defines every declared id exactly once', () => {
    expect(Object.keys(FEATURES).sort()).toEqual([...FEATURE_IDS].sort())
    expect(ALL_FEATURES.map((f) => f.id)).toEqual(Object.keys(FEATURES))
  })

  it('never depends on a feature from a higher level', () => {
    for (const f of ALL_FEATURES) {
      for (const d of f.dependsOn) {
        expect(FEATURES[d].level, `${f.id} (L${f.level}) depends on ${d} (L${FEATURES[d].level})`).toBeLessThanOrEqual(f.level)
      }
    }
  })

  it('has no dependency cycles', () => {
    const seen = new Set<FeatureId>()
    const visit = (id: FeatureId, path: FeatureId[]) => {
      expect(path, `cycle: ${[...path, id].join(' -> ')}`).not.toContain(id)
      if (seen.has(id)) return
      seen.add(id)
      for (const d of FEATURES[id].dependsOn) visit(d, [...path, id])
    }
    for (const f of ALL_FEATURES) visit(f.id, [])
  })

  it('senses and acts through at least one thing', () => {
    for (const f of ALL_FEATURES) {
      expect(f.sensors.length, `${f.id} has no sensors`).toBeGreaterThan(0)
      expect(f.actuators.length, `${f.id} has no actuators`).toBeGreaterThan(0)
    }
  })

  it('classifies momentary interventions and warnings as Level 0', () => {
    for (const f of ALL_FEATURES) {
      if (f.category === 'warning' || f.category === 'intervention' || f.category === 'chassis') {
        expect(f.level, `${f.id} is ${f.category} but level ${f.level}`).toBe(0)
      }
      if (f.category === 'automated') expect(f.level, `${f.id}`).toBeGreaterThanOrEqual(3)
      if (f.category === 'combined') expect(f.level, `${f.id}`).toBe(2)
    }
  })

  it('has a summary that fits one line and a longer detail', () => {
    for (const f of ALL_FEATURES) {
      expect(f.summary.length, `${f.id} summary`).toBeLessThanOrEqual(140)
      expect(f.detail.length, `${f.id} detail`).toBeGreaterThan(f.summary.length)
    }
  })

  it('keeps market notes attached to real features', () => {
    for (const id of Object.keys(MARKET_NOTES)) expect(FEATURES[id as FeatureId], id).toBeDefined()
  })
})
