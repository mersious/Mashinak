import type { Level } from '../data/types'
import { LEVELS } from '../data/vocab'

const ALL: Level[] = [0, 1, 2, 3, 4, 5]

export default function LevelSelector({ level, onChange }: { level: Level; onChange: (l: Level) => void }) {
  return (
    <div className="levels" role="tablist" aria-label="SAE automation level">
      {ALL.map((l) => (
        <button key={l} role="tab" aria-selected={l === level} className={l === level ? 'on' : l < level ? 'below' : ''} onClick={() => onChange(l)} title={LEVELS[l].name}>
          <span className="lvl">L{l}</span>
          <span className="lname">{LEVELS[l].name.replace(' Driving Automation', '').replace('Driver Assistance', 'Assistance')}</span>
        </button>
      ))}
    </div>
  )
}
