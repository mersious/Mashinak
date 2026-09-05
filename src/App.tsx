import { useCallback, useEffect, useRef, useState } from 'react'
import CarView from './components/CarView'
import DetailPanel from './components/DetailPanel'
import FeatureList from './components/FeatureList'
import LevelSelector from './components/LevelSelector'
import MarketSelector from './components/MarketSelector'
import { FEATURES } from './data/features'
import { visibleFeatures } from './data/query'
import { FEATURE_IDS, MARKET_IDS, type FeatureId, type Level, type Market } from './data/types'

interface State { level: Level; id: FeatureId | null; market: Market }

// #L2/AEB  or  #eu/L2/AEB
function readHash(): State {
  const m = /^#(?:(eu|us|cn)\/)?L([0-5])(?:\/([A-Z0-9_]+))?$/.exec(location.hash)
  const level = (m ? Number(m[2]) : 2) as Level
  const id = m?.[3] && (FEATURE_IDS as readonly string[]).includes(m[3]) ? (m[3] as FeatureId) : null
  const market = (m?.[1] && (MARKET_IDS as readonly string[]).includes(m[1]) ? m[1] : 'global') as Market
  return { level, id: id ?? (m ? null : 'AEB'), market }
}

export default function App() {
  const [{ level, id, market }, setState] = useState(readHash)

  useEffect(() => {
    const onHash = () => setState(readHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  useEffect(() => {
    const h = `#${market === 'global' ? '' : `${market}/`}L${level}${id ? `/${id}` : ''}`
    if (location.hash !== h) history.replaceState(null, '', h)
  }, [level, id, market])

  const setLevel = useCallback((l: Level) => setState((s) => ({ ...s, level: l, id: s.id && FEATURES[s.id].level <= l ? s.id : null })), [])
  const setMarket = useCallback((m: Market) => setState((s) => ({ ...s, market: m })), [])
  const select = useCallback((fid: FeatureId) => setState((s) => ({ ...s, level: Math.max(s.level, FEATURES[fid].level) as Level, id: fid })), [])

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

  // On narrow screens the detail panel sits below the list: bring it into view on selection.
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    if (id && window.matchMedia('(max-width: 1000px)').matches) {
      document.querySelector('.detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [id])

  const feature = id ? FEATURES[id] : null

  return (
    <>
      <header className="top">
        <div className="brand">
          <h1>Mashinak</h1>
          <p>What a car does for its driver, layer by layer, L0 to L5.</p>
        </div>
        <div className="controls">
          <LevelSelector level={level} onChange={setLevel} />
          <MarketSelector market={market} onChange={setMarket} />
        </div>
      </header>
      <main>
        <aside className="carpane">
          <CarView sensors={feature?.sensors ?? []} actuators={feature?.actuators ?? []} selected={feature !== null} animKey={id ?? 'none'} />
          <p className="carnote"><b>Blue</b> is what the feature senses. <i>Red</i> is what it moves.</p>
        </aside>
        <FeatureList level={level} market={market} selected={feature} onSelect={select} />
        <DetailPanel level={level} market={market} feature={feature} onSelect={select} />
      </main>
      <footer>
        <span>Levels follow SAE J3016. Names are generic; brand names are listed as aliases.</span>
        <a href="https://github.com/mersious/Mashinak">Source and corrections on GitHub</a>
      </footer>
    </>
  )
}
