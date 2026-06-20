# Villain Strategy Specification

## Purpose

Help the player prepare for a fight by showing, for each villain, a curated strategy guide
(threat summary, recommended approaches, key warnings) alongside the villain's cards in a
detail view — the villain-side counterpart to the hero "dossier".

## Requirements

### Requirement: Villain detail with strategy guide

The system SHALL provide a villain detail view, opened from the Villains tab, that shows the
villain's cards and a curated strategy guide for facing that villain.

#### Scenario: Opening a villain's detail

- **WHEN** the player chooses a villain (the "⚔ Strategy" action on its cover in the Villains tab)
- **THEN** a modal opens showing the villain's cover (featured art, name, stats), its cards, and—if
  available—a strategy block with the threat summary, recommended approaches, and key warnings

#### Scenario: Villain without a curated strategy

- **WHEN** the opened villain has no entry in the strategy data
- **THEN** the detail still opens (cover + cards) and the strategy block is shown as a graceful
  "no strategy guide yet" notice, never breaking the view

#### Scenario: Cover expand is preserved

- **WHEN** the player clicks the villain cover outside the strategy action
- **THEN** the existing expand/collapse of the card grid still works (the strategy action uses
  stopPropagation so it does not toggle the grid)

### Requirement: Curated, community-grounded strategy content

The system SHALL store villain strategies as curated data keyed by villain set (set name,
lowercased, with a set-code fallback), each with a threat summary, recommended approaches, and
key warnings, grounded in the cards' real mechanics and community strategy, paraphrased (not copied).

#### Scenario: Coverage of all villains

- **WHEN** the loaded card data is browsed in the Villains tab
- **THEN** every villain set has a strategy entry (currently all 56 villain sets are covered)

#### Scenario: Strategy references real cards

- **WHEN** a strategy mentions a specific card, stage, scheme, or mechanic of the villain
- **THEN** that reference matches the villain's actual cards in the loaded data
