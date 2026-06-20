# Villain Strategy Specification

## ADDED Requirements

### Requirement: Villain detail with strategy guide

The system SHALL provide a villain detail view, opened from the Villains tab, that shows the
villain's cards and a curated strategy guide for facing that villain.

#### Scenario: Opening a villain's detail

- **WHEN** the player chooses a villain (the "⚔ Estrategia" action on its cover in the Villains tab)
- **THEN** a modal opens showing the villain's cover (featured art, name), its cards, and—if
  available—a strategy block with the threat summary, recommended approaches, and key warnings

#### Scenario: Villain without a curated strategy

- **WHEN** the opened villain has no entry in the strategy data
- **THEN** the detail still opens (cover + cards) and the strategy block is omitted or shown as
  "sin guía aún", never breaking the view

#### Scenario: Cover expand is preserved

- **WHEN** the player clicks the villain cover outside the strategy action
- **THEN** the existing expand/collapse of the card grid still works (the strategy action does
  not interfere with it)

### Requirement: Curated, community-grounded strategy content

The system SHALL store villain strategies as curated data keyed by villain set, each with a
threat summary, recommended approaches, and key warnings, grounded in community strategy and
paraphrased (not copied).

#### Scenario: Strategy references real cards

- **WHEN** a strategy mentions a specific card, stage, or scheme of the villain
- **THEN** that reference matches the villain's actual cards in the loaded data
