# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-09-05

### Added
- Market switch (Global, EU, US, CN) with the regulatory regime per level and per-feature
  status, rules and notes for features that differ by region.
- Theme toggle: Auto, Light, Dark, remembered per browser.
- One-shot motion: signal pulse through the flow, sensor cones sweep in, actuators flash once.
  Disabled under `prefers-reduced-motion`.
- Version and author sign in the footer.
- README with screenshots and this changelog.

### Changed
- Feature list shows the selected level first.
- Small screens: static panes, single-column signal flow, detail scrolls into view on selection.
- Pages workflow builds `main` to `/` and `dev` to `/dev/` in one deployment.

## [0.1.0] - 2026-09-05

### Added
- Level selector L0 to L5 following SAE J3016, cumulative view.
- 36 generic features with aliases, sensors, actuators, controller, dependencies and standards.
- Detail panel with signal flow and clickable dependency graph.
- Top-down blueprint car highlighting sensor coverage and actuators.
- Datasheet visual style with system dark mode, keyboard navigation, shareable URL state.
- GitHub Pages deployment workflow.

[0.2.0]: https://github.com/mersious/Mashinak/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/mersious/Mashinak/releases/tag/v0.1.0
