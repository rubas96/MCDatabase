# Design — Add missing starter decks

## Sourcing de los decklists (lo difícil)

No existe un origen canónico programático para los starter decks oficiales en MarvelCDB:

- `GET /api/oauth2/decks` → requiere OAuth (401).
- `GET /decklists/find?q=...` → devuelve **HTML** (no JSON) y resultados limitados/recientes.
- Los ids ya mapeados son de **usuarios distintos** con nombres dispares
  (`'Groot - precon'`, `'(Starter) Spectrum'`, `'Maria Hill precon deck'`, `'Deadpool (Starter Deck)'`),
  así que **no hay un autor único** que clonar.

Por tanto el sourcing es **manual por héroe**. Procedimiento por héroe:

1. Buscar en MarvelCDB un decklist que reproduzca el precon de fábrica (términos como
   `<héroe> starter` / `<héroe> precon`).
2. Verificar vía API antes de aceptarlo:
   `GET https://marvelcdb.com/api/public/decklist/<id>.json` y comprobar
   - `hero_code` == código del héroe (o su forma base),
   - `meta.aspect` coincide con el aspecto del pack,
   - `sum(slots.values())` ≈ **40–42** cartas, `len(slots)` razonable,
   - que `slots` incluya los básicos del Core esperados (recursos, etc.).
3. Anotar `heroCode → id` en `DECKS`.

`_fetch_starters.mjs` ya valida parcialmente: marca `⚠MISMATCH` cuando
`base(investigator_code) != base(code)` pero **igual lo embebe**. Nota: en los decks
de prueba `investigator_code` venía `None` y el dato bueno estaba en `hero_code` →
**cambiar la comprobación de match a `hero_code`** para que el report sea fiable.

## Formas alternativas de héroe (variantes `c` / numeradas)

El audit incluye variantes: Ant-Man `12001c`, Wasp `13001c`, Archangel `42001c`,
Ironheart `29002a`/`29003a`. Suelen ser **otra cara/forma del mismo héroe** que juega el
**mismo mazo**. Decisión: por defecto **no** añadir entrada propia (la forma primaria
`...a` cubre el mazo); si la UI muestra ficha separada para la variante y queda sin mazo,
mapearla al **mismo id** que la forma primaria. Documentar lo que se haga.

## Bug de render en `renderStarterCards`

Actual:

```js
["aggression","justice","leadership","protection","pool"].forEach(a=>{
  const cs=cards.filter(c=>isPlayer(c)&&c.faction_code===a&&!sig(c)); ...});
const basics=cards.filter(c=>isPlayer(c)&&c.faction_code==="basic");
```

Una carta del mazo con `faction_code==="hero"` que **no** sea signature (`set_code!=hset`,
p. ej. una carta de héroe invitada de otro set) no entra en ningún grupo y se pierde.
Arreglo: añadir un grupo final que recoja **lo no clasificado** —
`isPlayer(c) && !sig(c)` y que no haya caído en ningún aspecto ni en basic— y mostrarlo
(p. ej. bajo "Other / Hero"). Mantener la exclusión de signatures (ya van arriba) y el
bloque `missing` para códigos ausentes en los datos.

## Regenerar y embeber

`node _fetch_starters.mjs` (ya implementado) hace fetch de cada id, construye `out` y
**reemplaza el literal** `const STARTER_SLOTS={...}` en el HTML + escribe `_starter_slots.json`.
Requiere **internet**. Tras correrlo: revisar el report (OK/EMPTY/FAIL/MISMATCH), validar
con `node --check` que el HTML sigue parseando, y smoke test en navegador.

## Alternativas descartadas

- **Sintetizar** el mazo (pack + básicos estándar del Core): rechazada por el usuario; quiere
  datos oficiales.
- **Scrapear** masivamente la búsqueda HTML: frágil y los resultados no son fiables (mezcla
  decks de comunidad); se usa como ayuda para *encontrar candidatos*, no como fuente automática.
