import { MARKET_IDS, type Market } from '../data/types'
import { MARKETS } from '../data/vocab'

export default function MarketSelector({ market, onChange }: { market: Market; onChange: (m: Market) => void }) {
  return (
    <label className="market">
      Market
      <select value={market} onChange={(e) => onChange(e.target.value as Market)} aria-label="Regulatory market">
        {MARKET_IDS.map((m) => (
          <option key={m} value={m}>{MARKETS[m].name}</option>
        ))}
      </select>
    </label>
  )
}
