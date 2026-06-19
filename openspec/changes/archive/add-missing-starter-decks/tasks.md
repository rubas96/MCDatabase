# Tasks — Add missing starter decks

## 1. Preparar el pipeline de sourcing

- [x] En `_fetch_starters.mjs`, cambiar la comprobación de match de `investigator_code` a
      `hero_code` (el dato fiable; `investigator_code` venía `None`)
- [x] Helper de verificación contra la API (`hero_code` + aspecto + conteo) — usado vía curl/python

## 2. Sourcing + verificación de los 46 héroes (uno por carta)

Para cada uno: localizar decklist fiel al precon, **verificar `hero_code` + aspecto + ~40-42
cartas**, y anotar `"<heroCode>":<id>` en `DECKS`.

### Hero packs clásicos
- [ ] 03001a Captain America
- [ ] 05001a Ms. Marvel
- [ ] 06001a Thor
- [ ] 08001a Black Widow
- [x] 09001a Doctor Strange → deck 3468 (u6276, protection, 40cp, verificado)
- [ ] 10001a Hulk
- [ ] 12001a Ant-Man
- [ ] 13001a Wasp
- [ ] 14001a Quicksilver
- [ ] 15001a Scarlet Witch
- [ ] 26001a Vision
- [ ] 49001a Magneto

### Guardianes de la Galaxia
- [ ] 17001a Star-Lord
- [ ] 18001a Gamora
- [ ] 19001a Drax
- [ ] 20001a Venom
- [ ] 22001a Nebula
- [ ] 28001a Nova
- [ ] 30001a Spider-Ham

### Otros / arácnidos / Vengadores
- [ ] 23001a War Machine
- [ ] 25001a Valkyrie
- [ ] 29001a Ironheart
- [ ] 31001a SP//dr
- [ ] 51001a Black Panther
- [ ] 52001a Silk
- [ ] 53001a Falcon
- [ ] 54001a Winter Soldier
- [ ] 58001a Wonder Man
- [ ] 59001a Hercules

### Mutantes (X-Men)
- [ ] 33001a Cyclops
- [ ] 34001a Phoenix
- [ ] 35001a Wolverine
- [ ] 36001a Storm
- [ ] 37001a Gambit
- [ ] 38001a Rogue
- [ ] 41001a Psylocke
- [ ] 42001a Angel
- [ ] 43001a X-23
- [ ] 46001a Iceman
- [ ] 47001a Jubilee
- [ ] 48001a Nightcrawler

### Formas alternativas (decidir: omitir o mapear al mismo id que la forma `a`)
- [ ] 12001c Ant-Man (forma alterna)
- [ ] 13001c Wasp (forma alterna)
- [ ] 42001c Archangel (forma de Angel)
- [ ] 29002a / 29003a Ironheart (formas adicionales)

## 3. Regenerar y embeber

> Los 39 héroes (33 sugeridos + 6 del usuario: BP 49162, Silk 49163, Falcon 56009,
> Winter Soldier 51163, Wonder Man 59633, Hercules 59634) añadidos a `DECKS` y verificados.
> Ver `candidatos.md`.

- [x] Regenerar (no había `node`; reimplementado en Python con la misma lógica del `.mjs`):
      65/65 decks OK, **0 mismatches**, 0 fails/empty
- [x] `STARTER_SLOTS` (24 → **65 héroes**) y `_starter_slots.json` actualizados

## 4. Bug de render

- [x] En `renderStarterCards`, añadir grupo "Other" para cartas del mazo no clasificadas
      (`isPlayer && !sig` que no caen en aspecto ni basic — p. ej. facción `hero` no-signature)
- [ ] Afinar el aviso de "cartas faltantes" (datos sin actualizar vs. mazo no sourceado)

## 5. Verificación

- [x] `STARTER_SLOTS` parsea como JSON válido (65 héroes) — sin `node`, validado con Python
- [x] Spot-check: 65/65 con `hero_code` correcto y conteo ~40; Ant-Man (12001a) = 40 cartas e
      **incluye** Energy/Genius/Strength (01088/89/90)
- [ ] Smoke test manual en navegador: abrir 4-5 héroes nuevos y confirmar visualmente el mazo
