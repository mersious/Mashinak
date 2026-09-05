import { useCallback, useEffect, useState } from 'react'
import CarView from './components/CarView'
import DetailPanel from './components/DetailPanel'
import FeatureList from './components/FeatureList'
import LevelSelector from './components/LevelSelector'
import { FEATURES } from './data/features'
import { visibleFeatures } from './data/query'
import { FEATURE_IDS, type FeatureId, type Level } from './data/types'

function readHash(): { level: Level; id: FeatureId | null } {
  const m = /^#L([0-5])(?:\/([A-Z0-9_]+))?$/.exec(location.hash)
  const level = (m ? Number(m[1]) : 2) as Level
  const id = m?.[2] && (FEATURE_IDS as readonly string[]).includes(m[2]) ? (m[2] as FeatureId) : null
  return { level, id: id ?? (m ? null : 'AEB') }
}

export default function App() {
  const [{ level, id }, setState] = useState(readHash)

  useEffect(() => {
    const onHash = () => setState(readHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  useEffect(() => {
    const h = `#L${level}${id ? `/${id}` : ''}`
    if (location.hash !== h) history.replaceState(null, '', h)
  }, [level, id])

  const setLevel = useCallback((l: Level) => setState((s) => ({ level: l, id: s.id && FEATURES[s.id].level <= l ? s.id : null })), [])
  const select = useCallback((fid: FeatureId) => setState((s) => ({ level: Math.max(s.level, FEATURES[fid].level) as Level, id: fid })), [])

  // Keyboard: arrows walk the visible list, digits switch level.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      if (/^[0-5]$/.test(e.key)) return setLevel(Number(e.key) as Level)
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      e.preventDefault()
      setState((s) => {
        const list = visibleFeatures(s.level)
        const i = list.findIndex((f) => f.id === s.id)
        const next = list[Math.min(list.length - 1, Math.max(0, i + (e.key === 'ArrowDown' ? 1 : -1)))]
        return next ? { ...s, id: next.id } : s
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setLevel])

  const feature = id ? FEATURES[id] : null

  return (
    <>
      <header className="top">
        <div className="brand">
          <h1>Mashinak</h1>
          <p>What a car does for its driver, layer by layer, L0 to L5.</p>
        </div>
        <LevelSelector level={level} onChange={setLevel} />
      </header>
      <main>
        <aside className="carpane">
          <CarView sensors={feature?.sensors ?? []} actuators={feature?.actuators ?? []} selected={feature !== null} />
          <p className="carnote"><b>Blue</b> is what the feature senses. <i>Red</i> is what it moves.</p>
        </aside>
        <FeatureList level={level} selected={feature} onSelect={select} />
        <DetailPanel level={level} feature={feature} onSelect={select} />
      </main>
      <footer>
        <span>Levels follow SAE J3016. Names are generic; brand names are listed as aliases.</span>
        <a href="https://github.com/mersious/Mashinak">Source and corrections on GitHub</a>
      </footer>
    </>
  )
}
