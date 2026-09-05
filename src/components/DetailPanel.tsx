import { enabledBy, FEATURES } from '../data/features'
import type { Feature, FeatureId, Level } from '../data/types'
import { ACTUATORS, CATEGORIES, ECUS, LEVELS, SENSORS } from '../data/vocab'

interface Props {
  level: Level
  feature: Feature | null
  onSelect: (id: FeatureId) => void
}

export default function DetailPanel({ level, feature, onSelect }: Props) {
  const lv = LEVELS[level]
  return (
    <div className="detail">
      <section className="levelcard">
        <h2>L{level} · {lv.name}</h2>
        <p className="who">{lv.who}</p>
        <p>{lv.description}</p>
      </section>

      {feature ? (
        <section className="feature">
          <header>
            <code>{feature.id}</code>
            <span className={`cat cat-${feature.category}`}>{CATEGORIES[feature.category].name}</span>
            <span className="pill">L{feature.level}</span>
          </header>
          <h2>{feature.name}</h2>
          {feature.aliases.length > 0 && <p className="aliases">Also sold as: {feature.aliases.join(' · ')}</p>}
          <p className="summary">{feature.summary}</p>
          <p>{feature.detail}</p>

          <h4>Signal flow</h4>
          <div className="flow">
            <div className="col">
              {feature.sensors.map((s) => (
                <span key={s} className="chip sensor" title={SENSORS[s].description}>{SENSORS[s].short}</span>
              ))}
            </div>
            <div className="arrow">→</div>
            <div className="col">
              <span className="chip ecu" title={ECUS[feature.ecu].description}>{ECUS[feature.ecu].name}</span>
            </div>
            <div className="arrow">→</div>
            <div className="col">
              {feature.actuators.map((a) => (
                <span key={a} className="chip actuator" title={ACTUATORS[a].description}>{ACTUATORS[a].short}</span>
              ))}
            </div>
          </div>

          <div className="rel">
            <div>
              <h4>Depends on</h4>
              {feature.dependsOn.length === 0 ? <p className="muted">Nothing. This is a base layer.</p> : (
                <div className="chips">
                  {feature.dependsOn.map((d) => (
                    <button key={d} className="chip link dep" onClick={() => onSelect(d)} title={FEATURES[d].summary}>{d} <small>{FEATURES[d].name}</small></button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h4>Enables</h4>
              {enabledBy(feature.id).length === 0 ? <p className="muted">Nothing builds on this yet.</p> : (
                <div className="chips">
                  {enabledBy(feature.id).map((d) => (
                    <button key={d.id} className="chip link en" onClick={() => onSelect(d.id)} title={d.summary}>{d.id} <small>{d.name}</small></button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {feature.regulations.length > 0 && (
            <p className="regs"><strong>Standards:</strong> {feature.regulations.join(' · ')}</p>
          )}
        </section>
      ) : (
        <p className="muted">Pick a feature to see what it does, what it senses and what it moves.</p>
      )}
    </div>
  )
}
