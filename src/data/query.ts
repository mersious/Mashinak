import { ALL_FEATURES } from './features'
import type { Category, Feature, Level } from './types'

const CAT_ORDER: Category[] = ['chassis', 'warning', 'intervention', 'comfort', 'longitudinal', 'lateral', 'combined', 'parking', 'automated']

/** Features present on a car of the given level, optionally filtered by a search string, in display order. */
export function visibleFeatures(level: Level, q = ''): Feature[] {
  const needle = q.trim().toLowerCase()
  return ALL_FEATURES.filter(
    (f) => f.level <= level && (!needle || [f.id, f.name, ...f.aliases, f.summary].some((s) => s.toLowerCase().includes(needle))),
  ).sort((a, b) => a.level - b.level || CAT_ORDER.indexOf(a.category) - CAT_ORDER.indexOf(b.category))
}
