# Collection Tracking Specification

## ADDED Requirements

### Requirement: Multiple user profiles

The system SHALL let several people share one browser install, each with an independent
profile holding its own owned-product set, saved decks, and interface theme, selectable
from a profiles dropdown in the header.

#### Scenario: Switching profiles

- **WHEN** the player picks a different profile from the dropdown
- **THEN** the current profile's working state is snapshotted
- **AND** the chosen profile's owned set, decks, and theme are loaded and every owned-driven view re-renders

#### Scenario: Adding a profile

- **WHEN** the player chooses "Añadir perfil" and names it
- **THEN** a new profile with an empty collection and no decks is created and becomes active

#### Scenario: Renaming and deleting

- **WHEN** the player renames or deletes a profile
- **THEN** the change is persisted; the system SHALL refuse to delete the last remaining profile

### Requirement: Persist profiles in a dedicated SQLite database

The system SHALL store all profiles in a dedicated in-browser SQLite database (separate
from the card-data cache), serialized to IndexedDB under the `profiles_v1` key, with a
`profiles` table (id, name, color, owned, decks, theme, created, pos) and a `meta` table
recording the active profile id.

#### Scenario: Reopening the app

- **WHEN** the player reopens the app
- **THEN** the active profile recorded in `meta` is restored with its owned set, decks, and theme

#### Scenario: First run migration

- **WHEN** no profiles database exists yet
- **THEN** the existing single collection/decks/theme are migrated into an initial "Jugador 1" profile so no data is lost

## MODIFIED Requirements

### Requirement: Persist ownership locally

The system SHALL store the active profile's owned product set in the browser's
`localStorage` under `mc_owned` (a mirror of the active profile) and reload it on startup
so the collection survives reloads and renders instantly, offline, without any server or
login. The `localStorage` keys (`mc_owned`, `mc_decks`, `mc_theme`) mirror the active
profile; the dedicated SQLite database is the source of truth for the full set of
profiles. If the SQLite engine fails to load, the app SHALL keep working in single-profile
mode off the `localStorage` mirror.

#### Scenario: Returning to the app

- **WHEN** the player reopens the app in the same browser
- **THEN** the active profile's owned products are restored from the `localStorage` mirror and shown as owned

#### Scenario: SQLite engine unavailable

- **WHEN** the SQLite engine cannot load (e.g. offline on a machine without it cached)
- **THEN** the app still loads the active profile from the `localStorage` mirror, and profile switching is unavailable until the engine loads
