# Add missing starter decks for 46 heroes

## Why

La ficha de cada héroe muestra su **mazo precon** (starter deck) a partir de
`const STARTER_SLOTS={...}` en `Marvel Champions Collection.html`, que se genera con
`_fetch_starters.mjs` desde el mapa `DECKS` (heroCode → id de decklist de MarvelCDB).

Hoy `DECKS` solo cubre **24 de 70 códigos de héroe** (las cajas grandes y las campañas).
Faltan **46**, que son casi todos los *hero packs* individuales (Ant-Man, Wasp, Cap, Thor,
Doctor Strange, Hulk…). Cuando un héroe no tiene entrada en `STARTER_SLOTS`, la app cae en
un respaldo (rama `else` de `openHeroDetail`) que muestra **solo las cartas impresas en su
propio pack**. Por eso al usuario le faltan cartas: los **recursos básicos del Core Set**
(Energy `01088` / Genius `01089` / Strength `01090`, etc.) no están en el pack del héroe, así
que el mazo se ve incompleto (síntoma reportado con Ant-Man).

El usuario quiere los **datos oficiales** (no sintetizar mazos): localizar para cada héroe un
decklist público fiel al precon de fábrica y embeberlo.

## What Changes

- **Ampliar `DECKS`** en `_fetch_starters.mjs` con el id de starter deck de los 46 héroes
  faltantes (uno por héroe, verificado: `hero_code` correcto, aspecto correcto, ~40-42 cartas),
  regenerar `STARTER_SLOTS` + `_starter_slots.json` y embeber en el HTML.
- **Arreglar el bug de render** en `renderStarterCards`: el bucle de facciones solo recorre
  `aggression/justice/leadership/protection/pool/basic`, así que descarta cartas de facción
  `hero` que no son signature (`set_code != hset`). Esas cartas del mazo deben mostrarse.
- **Mejorar el aviso** de "cartas faltantes": que el conteo y el mensaje dejen claro cuándo
  un mazo no se pudo sourcear o cuándo faltan cartas por datos sin actualizar.

## Impact

- Datos/contenido en `_fetch_starters.mjs` (mapa `DECKS`), `STARTER_SLOTS` y `_starter_slots.json`,
  embebidos en `Marvel Champions Collection.html`.
- Código en `Marvel Champions Collection.html`: `renderStarterCards` y el aviso de faltantes.
- Sin dependencias nuevas. El sourcing depende de MarvelCDB (no hay endpoint canónico de starter
  decks: la API de listado pide OAuth y la búsqueda es HTML/limitada), así que es **manual,
  héroe por héroe**, aceptado por el usuario.
- Nueva capability documentada: `starter-decks`.
