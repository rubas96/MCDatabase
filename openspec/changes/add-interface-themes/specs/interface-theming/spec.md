# Interface Theming Specification

## ADDED Requirements

### Requirement: Choose an interface theme

The system SHALL present a theme switcher in the top-right of the header that lets the
player choose between named interface looks. The set of themes SHALL be `comic` (default),
`shield`, `jarvis`, `strange`, and `tva`.

#### Scenario: Selecting a theme

- **WHEN** the player clicks a theme button in the switcher
- **THEN** the chosen theme key is set as the `data-theme` attribute on the root `<html>` element
- **AND** the corresponding `html[data-theme="<key>"]` CSS block governs the app's appearance
- **AND** the active button is highlighted

#### Scenario: Unknown or missing theme

- **WHEN** a theme value is not one of the known keys
- **THEN** the system falls back to the `comic` theme

### Requirement: Persist the chosen theme

The system SHALL store the chosen theme in `localStorage` under the `mc_theme` key and
apply it on every load, before first paint, so the selection survives reloads with no flash.

#### Scenario: Returning to the app

- **WHEN** the player reopens the app in the same browser
- **THEN** the previously chosen theme is read from `mc_theme` and applied to `<html>` before the page renders

### Requirement: Comic is the default look

The system SHALL treat `comic` as the default theme for a first-time visitor or when no
theme has been persisted.

#### Scenario: First visit

- **WHEN** the player opens the app with no `mc_theme` stored
- **THEN** the `comic` theme is applied
