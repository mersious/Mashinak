export type Theme = 'system' | 'light' | 'dark'
const KEY = 'mashinak.theme'

export function readTheme(): Theme {
  try {
    const t = localStorage.getItem(KEY)
    return t === 'light' || t === 'dark' || t === 'system' ? t : 'dark'
  } catch {
    return 'dark'
  }
}

/** Applies the theme to <html data-theme>. 'system' removes the attribute so CSS falls back to prefers-color-scheme. */
export function applyTheme(t: Theme) {
  if (t === 'system') delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = t
  try {
    localStorage.setItem(KEY, t)
  } catch {
    /* storage unavailable: theme still applies for this page load */
  }
}

export const NEXT: Record<Theme, Theme> = { dark: 'light', light: 'system', system: 'dark' }
