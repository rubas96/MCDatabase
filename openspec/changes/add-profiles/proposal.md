# Add user profiles (multi-user collections)

## Why

Hasta ahora la app guarda una sola colección/mazos por navegador (las claves
`mc_owned`/`mc_decks`/`mc_theme` de `localStorage`). Si dos o más personas usan el
mismo perfil de navegador, **comparten y se pisan** sus datos. Queremos que varias
personas usen la misma instalación, cada una con su propia colección, mazos y tema,
seleccionables desde un dropdown.

## What Changes

- Nuevo **dropdown de perfiles** (botón 👤 en el header `.tools`) con: cambiar de
  perfil, **➕ añadir**, **✏️ renombrar**, **🗑️ borrar** (no permite borrar el último).
- Cada perfil aísla **colección (owned) + mazos (decks) + tema**.
- Los perfiles se guardan en una **base SQLite dedicada** (`pdb`, vía sql.js), separada
  de la caché de cartas, serializada a IndexedDB bajo la clave `profiles_v1`. Tablas:
  `profiles(id,name,color,owned,decks,theme,created,pos)` y `meta(k,v)` (`meta['active']`
  = perfil activo).
- `localStorage` (`mc_owned`/`mc_decks`/`mc_theme`) pasa a ser un **espejo del perfil
  activo**: mantiene el primer render instantáneo, sin parpadeo de tema y operable
  offline. `pdb` es la fuente de verdad del conjunto completo de perfiles.
- **Migración automática**: en el primer arranque la colección/mazos/tema existentes se
  vuelcan en un perfil inicial «Jugador 1». No se pierde nada.
- Si sql.js no carga (offline en un equipo sin caché), la app sigue en **modo
  un-perfil** leyendo el espejo de `localStorage`.

## Impact

- Afecta la capability `collection-tracking` (el contrato de `mc_owned` deja de ser
  global y pasa a ser por-perfil, espejado). Ver el delta en
  `specs/collection-tracking/spec.md`.
- Toca solo `Marvel Champions Collection.html` (estado, persistencia, header, init).
- Sin dependencias nuevas: reutiliza sql.js (ya cargado) e IndexedDB (`idbGet/idbPut`).
