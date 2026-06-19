# Collection Tracking Specification

## Purpose

Let a player record which Marvel Champions products they own so that every other part of the app (Heroes, Villains, Cards, Deck Builder) can be filtered to the cards actually available to them. Ownership is the single source of truth that drives the rest of the experience.

## Requirements

### Requirement: Mark products as owned

The system SHALL present every known product (Core Set, hero packs, scenario packs, campaign boxes) on the Collection tab and let the player toggle each one as owned or not owned.

#### Scenario: Toggling a product on

- **WHEN** the player marks a product as owned on the Collection tab
- **THEN** the product's pack code is added to the owned set and persisted under the `mc_owned` key in `localStorage`

#### Scenario: Toggling a product off

- **WHEN** the player unmarks a previously owned product
- **THEN** the pack code is removed from the owned set and the persisted `mc_owned` value is updated immediately

### Requirement: Persist ownership locally

The system SHALL store the owned product set in the browser's `localStorage` and reload it on startup so the collection survives page reloads without any server or login.

#### Scenario: Returning to the app

- **WHEN** the player reopens the app in the same browser
- **THEN** the previously owned products are restored from `localStorage` and shown as owned

### Requirement: Filter content to owned products

The system SHALL filter the Heroes, Villains & Scenarios, Cards, and Deck Builder views to only the cards and sets contained in owned products.

#### Scenario: Owning a new product reveals its content

- **WHEN** the player marks an additional product as owned
- **THEN** the heroes, cards, and sets from that product become visible in the other tabs without requiring a data re-download
