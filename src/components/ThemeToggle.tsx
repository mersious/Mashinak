import { NEXT, type Theme } from '../theme'

const LABEL: Record<Theme, string> = { system: 'Auto', light: 'Light', dark: 'Dark' }

export default function ThemeToggle({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
  return (
    <button className="theme" onClick={() => onChange(NEXT[theme])} title={`Theme: ${LABEL[theme]}. Click to change.`} aria-label={`Theme: ${LABEL[theme]}`}>
      <span className="swatch" aria-hidden="true" />
      {LABEL[theme]}
    </button>
  )
}
