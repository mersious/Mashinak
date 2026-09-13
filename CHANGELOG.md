# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.2] - 2026-09-13

### Changed
- Hill Descent Control now states why it is filed at Level 0 even though it performs
  sustained longitudinal control, which a strict J3016 reading would place at Level 1.
- README explains that the level in a URL is the car being viewed, not the feature's own
  level, and documents what `npm test` guards.

## [0.2.1] - 2026-09-13

### Fixed
- Lane Departure Prevention is a momentary intervention at the lane edge and is now Level 0,
  as SAE J3016 classifies it. Lane Centering remains the Level 1 lateral function, and both
  entries explain the difference.
- A URL such as `#L2/ALKS` no longer shows a feature above the level it names; the level is
  raised to the feature's own level.
- Feature header reads "SAE Level n function" instead of the ambiguous "appears at Ln".

### Added
- `npm test` with data invariants: dependency levels, dependency cycles, category and level
  rules, and sensor and actuator completeness. CI runs it before every build.

## [0.2.0] - 2026-09-05

### Added
- Market switch (Global, EU, US, CN) with the regulatory regime per level and per-feature
  status, rules and notes for features that differ by region.
- Theme toggle: Auto, Light, Dark, remembered per browser.
- One-shot motion: signal pulse through the flow, sensor cones sweep in, actuators flash once.
  Disabled under `prefers-reduced-motion`.
- Version and author sign in the footer.
- Arrow keys `←` `→` switch level. Digit keys use physical key codes so they work on any
  keyboard layout.
- README with screenshots and this changelog. MIT license.

### Changed
- Dark is the default theme; Auto and Light are one click away.
- Feature list shows the selected level first, and within a level follows a curated learning
  order: foundations, mandated safety functions, then helpers and comfort.
- Small screens: static panes, single-column signal flow, detail scrolls into view on selection.
- Pages deploys from `main` only; other branches and pull requests get a lint and build check.

## [0.1.0] - 2026-09-05

### Added
- Level selector L0 to L5 following SAE J3016, cumulative view.
- 35 generic features with aliases, sensors, actuators, controller, dependencies and standards.
- Detail panel with signal flow and clickable dependency graph.
- Top-down blueprint car highlighting sensor coverage and actuators.
- Datasheet visual style with system dark mode, keyboard navigation, shareable URL state.
- GitHub Pages deployment workflow.

[0.2.2]: https://github.com/mersious/Mashinak/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/mersious/Mashinak/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/mersious/Mashinak/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/mersious/Mashinak/releases/tag/v0.1.0
