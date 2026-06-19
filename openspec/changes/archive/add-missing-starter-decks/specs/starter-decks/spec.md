# Starter Decks Specification

## ADDED Requirements

### Requirement: Show each hero's preconstructed starter deck

The system SHALL display, on a hero's detail view, the hero's official preconstructed
("starter") deck — including the basic cards drawn from the Core Set (resources such as
Energy/Genius/Strength and standard basic events/allies) that are part of that deck but are
not printed in the hero's own pack.

#### Scenario: Hero with a mapped starter deck

- **WHEN** the player opens the detail view of a hero that has an entry in `STARTER_SLOTS`
- **THEN** the deck is rendered grouped by aspect and Basic, showing every card in the
  decklist with its copy count
- **AND** Core-Set basic cards that belong to the deck (e.g. Energy/Genius/Strength) are shown
  even though they are not in the hero's own pack

#### Scenario: Hero whose deck card is hero-faction but not a signature

- **WHEN** a starter deck contains a card with `faction_code` `hero` that is not one of the
  hero's signature cards (its `set_code` differs from the hero's set)
- **THEN** that card is still listed in the rendered deck (it is not silently dropped)

#### Scenario: A deck references cards absent from the loaded data

- **WHEN** one or more deck card codes are not present in the loaded card database
- **THEN** the view reports how many cards are missing and prompts the player to press
  "↻ Update data"

### Requirement: Maintain starter-deck mappings from verified sources

The system SHALL keep the hero→decklist mapping (`DECKS` in `_fetch_starters.mjs`) sourced
from public MarvelCDB decklists that faithfully reproduce the factory preconstructed deck,
each verified before inclusion.

#### Scenario: Verifying a candidate decklist

- **WHEN** a decklist id is considered for a hero
- **THEN** it is accepted only if its `hero_code` matches the hero, its aspect matches the
  hero's pack aspect, and its total copy count is within the expected preconstructed range
  (~40–42 cards)

#### Scenario: Regenerating the embedded slots

- **WHEN** the maintainer runs `node _fetch_starters.mjs`
- **THEN** each mapped decklist is fetched and the `STARTER_SLOTS={...}` literal in
  `Marvel Champions Collection.html` (and `_starter_slots.json`) is replaced with the result
- **AND** the run reports OK/EMPTY/FAIL and flags any hero whose `hero_code` does not match
  its mapped deck
