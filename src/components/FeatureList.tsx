import { useMemo, useState } from 'react'
import { ALL_FEATURES } from '../data/features'
import type { Category, Feature, FeatureId, Level } from '../data/types'
import { CATEGORIES } from '../data/vocab'

const CAT_ORDER: Category[] = ['chassis', 'warning', 'intervention', 'comfort', 'longitudinal', 'lateral', 'combined', 'parking', 'automated']

interface Props {
  level: Level
  selected: Feature | null
  onSelect: (id: FeatureId) => void
}

export default function FeatureList({ level, selected, onSelect }: Props) {
  const [q, setQ] = useState('')
  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const match = (f: Feature) =>
      !needle || [f.id, f.name, ...f.aliases, f.summary].some((s) => s.toLowerCase().includes(needle))
    const out: { level: Level; items: Feature[] }[] = []
    for (let l = 0 as Level; l <= level; l++) {
      const items = ALL_FEATURES.filter((f) => f.level === l && match(f)).sort((a, b) => CAT_ORDER.indexOf(a.category) - CAT_ORDER.indexOf(b.category))
      if (items.length) out.push({ level: l, items })
    }
    return out
  }, [level, q])

  const deps = new Set(selected?.dependsOn ?? [])
  const enables = new Set(ALL_FEATURES.filter((f) => selected && f.dependsOn.includes(selected.id)).map((f) => f.id))

  return (
    <div className="list">
      <input className="search" placeholder="Search ESP, brake, lane…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search features" />
      {groups.map((g) => (
        <section key={g.level}>
          <h3>L{g.level} <span>{g.items.length}</span></h3>
          <ul>
            {g.items.map((f) => (
              <li key={f.id}>
                <button
                  className={[selected?.id === f.id ? 'sel' : '', deps.has(f.id) ? 'dep' : '', enables.has(f.id) ? 'en' : ''].join(' ')}
                  onClick={() => onSelect(f.id)}
                >
                  <code>{f.id}</code>
                  <span className="fname">{f.name}</span>
                  <span className={`cat cat-${f.category}`}>{CATEGORIES[f.category].short}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {groups.length === 0 && <p className="empty">Nothing matches.</p>}
    </div>
  )
}
