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

- [ ] `node _fetch_starters.mjs` (necesita internet); revisar el report (OK/EMPTY/FAIL/MISMATCH)
- [ ] Confirmar que `STARTER_SLOTS` y `_starter_slots.json` cubren los héroes nuevos

## 4. Bug de render

- [x] En `renderStarterCards`, añadir grupo "Other" para cartas del mazo no clasificadas
      (`isPlayer && !sig` que no caen en aspecto ni basic — p. ej. facción `hero` no-signature)
- [ ] Afinar el aviso de "cartas faltantes" (datos sin actualizar vs. mazo no sourceado)

## 5. Verificación

- [ ] `node --check` del script principal embebido (sintaxis OK)
- [ ] Smoke test manual: abrir la app, abrir 4-5 héroes nuevos (Ant-Man incluido) y confirmar
      que el mazo muestra recursos básicos (Energy/Genius/Strength) y Swarm Tactics
- [ ] Spot-check de 3 mazos contra MarvelCDB (conteo y aspecto)
