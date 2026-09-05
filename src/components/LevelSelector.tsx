import type { Level } from '../data/types'
import { LEVELS } from '../data/vocab'

const ALL: Level[] = [0, 1, 2, 3, 4, 5]
const SHORT: Record<Level, string> = { 0: 'No automation', 1: 'Assistance', 2: 'Partial', 3: 'Conditional', 4: 'High', 5: 'Full' }

export default function LevelSelector({ level, onChange }: { level: Level; onChange: (l: Level) => void }) {
  return (
    <div className="levels" role="tablist" aria-label="SAE automation level">
      {ALL.map((l) => (
        <button key={l} role="tab" aria-selected={l === level} className={l === level ? 'on' : l < level ? 'below' : ''} onClick={() => onChange(l)} title={LEVELS[l].name}>
          <span className="lvl">L{l}</span>
          <span className="lname">{SHORT[l]}</span>
        </button>
      ))}
    </div>
  )
}
