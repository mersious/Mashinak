import { useMemo, useState } from 'react'
import { ALL_FEATURES } from '../data/features'
import { visibleFeatures } from '../data/query'
import type { Feature, FeatureId, Level } from '../data/types'
import { CATEGORIES } from '../data/vocab'

interface Props {
  level: Level
  selected: Feature | null
  onSelect: (id: FeatureId) => void
}

export default function FeatureList({ level, selected, onSelect }: Props) {
  const [q, setQ] = useState('')
  const groups = useMemo(() => {
    const out = new Map<Level, Feature[]>()
    for (const f of visibleFeatures(level, q)) out.set(f.level, [...(out.get(f.level) ?? []), f])
    return [...out.entries()]
  }, [level, q])

  const deps = new Set(selected?.dependsOn ?? [])
  const enables = new Set(ALL_FEATURES.filter((f) => selected && f.dependsOn.includes(selected.id)).map((f) => f.id))

  return (
    <nav className="list" aria-label="Features">
      <input className="search" placeholder="Search: ESP, brake, lane…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search features" />
      {groups.map(([l, items]) => (
        <section key={l}>
          <h3><span>Level {l}</span><span>{items.length}</span></h3>
          <ul>
            {items.map((f) => (
              <li key={f.id}>
                <button
                  className={[selected?.id === f.id ? 'sel' : '', deps.has(f.id) ? 'dep' : '', enables.has(f.id) ? 'en' : ''].join(' ')}
                  onClick={() => onSelect(f.id)}
                  aria-current={selected?.id === f.id}
                >
                  <code>{f.id}</code>
                  <span className="fname">{f.name}</span>
                  <span className="cat">{CATEGORIES[f.category].short}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {groups.length === 0 && <p className="empty" style={{ padding: '12px 16px' }}>Nothing matches.</p>}
      <p className="hint"><kbd>↑</kbd> <kbd>↓</kbd> move · <kbd>0</kbd>–<kbd>5</kbd> level · blue = it depends on · red = depends on it</p>
    </nav>
  )
}
