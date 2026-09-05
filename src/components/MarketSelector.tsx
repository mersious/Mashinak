import { MARKET_IDS, type Market } from '../data/types'
import { MARKETS } from '../data/vocab'

export default function MarketSelector({ market, onChange }: { market: Market; onChange: (m: Market) => void }) {
  return (
    <div className="markets" role="tablist" aria-label="Regulatory market">
      <span className="mlabel">Market</span>
      {MARKET_IDS.map((m) => (
        <button key={m} role="tab" aria-selected={m === market} className={m === market ? 'on' : ''} onClick={() => onChange(m)} title={MARKETS[m].name}>
          {MARKETS[m].short}
        </button>
      ))}
    </div>
  )
}
