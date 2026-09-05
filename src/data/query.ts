import { ALL_FEATURES } from './features'
import type { Feature, Level } from './types'

/**
 * Features present on a car of the given level, optionally filtered by a search
 * string. Highest level first, then the curated learning order from features.ts.
 */
export function visibleFeatures(level: Level, q = ''): Feature[] {
  const needle = q.trim().toLowerCase()
  return ALL_FEATURES.filter(
    (f) => f.level <= level && (!needle || [f.id, f.name, ...f.aliases, f.summary].some((s) => s.toLowerCase().includes(needle))),
  ).sort((a, b) => b.level - a.level)
}
