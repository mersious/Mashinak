import { enabledBy, FEATURES } from '../data/features'
import type { Feature, FeatureId, Level, Market, MarketStatus } from '../data/types'
import { ACTUATORS, CATEGORIES, ECUS, LEVELS, MARKETS, SENSORS } from '../data/vocab'

interface Props {
  level: Level
  market: Market
  feature: Feature | null
  onSelect: (id: FeatureId) => void
}

const STATUS: Record<MarketStatus, string> = {
  mandatory: 'Mandatory',
  phasing_in: 'Mandate adopted, phasing in',
  rated: 'Not required, rated',
  permitted: 'Permitted with conditions',
  pilot: 'Pilot programmes only',
  unregulated: 'No specific rule',
}

export default function DetailPanel({ level, market, feature, onSelect }: Props) {
  const lv = LEVELS[level]
  const mk = MARKETS[market]
  const enables = feature ? enabledBy(feature.id) : []
  const note = feature && market !== 'global' ? feature.markets?.[market] : undefined
  return (
    <article className="detail">
      <section className="levelcard">
        <h2>SAE Level {level} · {lv.name}{market !== 'global' && <> · {mk.name}</>}</h2>
        <p className="who">{lv.who}</p>
        <p>{lv.description}</p>
        {market !== 'global' && (
          <p className="mnote"><b>{mk.short}</b> {mk.levels[level] ?? mk.regime}</p>
        )}
      </section>

      {feature ? (
        <section className="feature" key={feature.id}>
          <header>
            <code>{feature.id}</code>
            <span>{CATEGORIES[feature.category].name}</span>
            <span>appears at L{feature.level}</span>
          </header>
          <h2>{feature.name}</h2>
          {feature.aliases.length > 0 && <p className="aliases">Also called: {feature.aliases.join(' · ')}</p>}
          <p className="summary">{feature.summary}</p>
          <p>{feature.detail}</p>

          <h4>Signal flow</h4>
          <div className="flow">
            <div className="col">
              <span className="colhead">senses with</span>
              {feature.sensors.map((s) => (
                <span key={s} className="chip sensor" title={SENSORS[s].description}>{SENSORS[s].name}</span>
              ))}
            </div>
            <div className="arrow" aria-hidden="true"><span className="pulse" /></div>
            <div className="col">
              <span className="colhead">decided in</span>
              <span className="chip ecu" title={ECUS[feature.ecu].description}>{ECUS[feature.ecu].name}</span>
            </div>
            <div className="arrow late" aria-hidden="true"><span className="pulse" /></div>
            <div className="col">
              <span className="colhead">acts through</span>
              {feature.actuators.map((a) => (
                <span key={a} className="chip actuator" title={ACTUATORS[a].description}>{ACTUATORS[a].name}</span>
              ))}
            </div>
          </div>

          <div className="rel">
            <div>
              <h4>Depends on</h4>
              {feature.dependsOn.length === 0 ? <p className="muted">Nothing. This is a base layer.</p> : (
                <ul>
                  {feature.dependsOn.map((d) => (
                    <li key={d}><button onClick={() => onSelect(d)} title={FEATURES[d].summary}><code>{d}</code><small>{FEATURES[d].name}</small></button></li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h4>Enables</h4>
              {enables.length === 0 ? <p className="muted">Nothing builds on this yet.</p> : (
                <ul>
                  {enables.map((d) => (
                    <li key={d.id}><button onClick={() => onSelect(d.id)} title={d.summary}><code>{d.id}</code><small>{d.name}</small></button></li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {feature.regulations.length > 0 && (
            <p className="regs"><b>Standards and regulations</b> · {feature.regulations.join(' · ')}</p>
          )}
          {market !== 'global' && (
            <div className="regs market">
              <h4>{mk.name}</h4>
              {note ? (
                <>
                  <p><span className={`status st-${note.status}`}>{STATUS[note.status]}</span>{note.rules.length > 0 && <> · {note.rules.join(' · ')}</>}</p>
                  <p>{note.note}</p>
                </>
              ) : (
                <p className="muted">No market-specific rule recorded. The engineering is the same everywhere.</p>
              )}
            </div>
          )}
        </section>
      ) : (
        <p className="muted">Pick a feature to see what it does, what it senses and what it moves.</p>
      )}
    </article>
  )
}
