# Tasks — Add user profiles

## 1. Almacén de perfiles (SQLite en IndexedDB) — DONE

- [x] `pdb` (sql.js dedicada) + helpers `pq`/`pq1`/`savePdb`
- [x] Esquema `profiles(id,name,color,owned,decks,theme,created,pos)` + `meta(k,v)`
- [x] Persistencia a IndexedDB bajo `profiles_v1` (reusa `idbGet/idbPut`)
- [x] `localStorage` como espejo del perfil activo (`mc_owned/mc_decks/mc_theme`)

## 2. Ciclo de vida y migración — DONE

- [x] `initProfiles()` async, no bloqueante, llamado desde `init()`
- [x] Migración: primer arranque vuelca la colección existente en «Jugador 1»
- [x] Reconciliación del espejo con la fila activa al cargar
- [x] Modo degradado un-perfil si sql.js no carga

## 3. CRUD y cambio de perfil — DONE

- [x] `addProfile` / `renameProfile` / `deleteProfile` (bloquea borrar el último)
- [x] `loadProfile` (snapshot del actual → carga datos → espejo → re-render)
- [x] `persistActive` enganchado en `saveOwned`/`saveDeck`/`deleteDeck`/`restore`/tema

## 4. UI — DONE

- [x] Botón 👤 + dropdown `#prof-menu` en el header
- [x] `renderProfileMenu` / `toggleProfileMenu`, cierre al hacer click fuera
- [x] CSS del dropdown (themable con `--ink/--paper/--accent`)

## 5. Verificación

- [x] `node --check` del script principal (sintaxis OK)
- [x] Lógica SQL ejercitada bajo sql.js real (schema, migrar, switch, CRUD, round-trip)
- [ ] Smoke test manual en navegador (abrir, crear 2º perfil, alternar, recargar)
