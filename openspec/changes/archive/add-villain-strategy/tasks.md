# Tasks — Villain strategy guide

## 1. Modal y disparador — DONE

- [x] `openVillainDetail(setCode)`: portada del villano + bloque estrategia + cartas, sobre `#hmodal`
- [x] CSS del bloque de estrategia (Amenaza / Enfoques / Avisos), themable (`--ink/--paper`)
- [x] Botón "⚔ Estrategia" en la portada de villano (`renderSetGroups` cover mode), con
      `stopPropagation`; solo en `coverBrand==='Marvel Villains'`
- [x] Degradación elegante si el villano no tiene entrada en `VILLAIN_STRATEGY`
- [x] Semilla: Rhino, Klaw, Ultron (a refinar con foros)

## 2. `VILLAIN_STRATEGY` — contenido curado (apoyado en foros)

Por cada villano: `{threat, approaches[], watch[]}`. Investigar comunidad y parafrasear;
verificar cartas/etapas contra los datos. Lotes:

- [x] **Core / wave 1:** Rhino, Klaw, Ultron, Risky Business + Mutagen Formula (Green Goblin), The Wrecking Crew (Wrecker/Bulldozer/Piledriver/Thunderball, claves por villano) — mecánicas de cartas + tips de comunidad (HoH, Cardboard Champions). Contenido en INGLÉS (coincide con HERO_DOSSIER/UI).
- [x] **Goblin / arácnidos:** Green Goblin (en lote 1), Venom, Venom Goblin, Mysterio, Sandman, The Sinister Six — mecánicas + comunidad (HoH Sinister Motives, BGG)
- [x] **Rise of Red Skull:** Crossbones, Absorbing Man, Taskmaster, Zola, Red Skull (mec. + HoH tips)
- [x] **Galaxy / Kang:** Ronan, Nebula, Brotherhood Of Badoon (Drang), Kang, Expert Kang, + museo (HoH tips)
- [x] **Mad Titan's Shadow:** Ebony Maw, Hela, Loki, Thanos, Tower Defense
- [x] **The Hood / tt:** The Hood, Enchantress, God of Lies
- [x] **Mutant Genesis:** Magneto, Mansion Attack, Master Mold, Project Wideawake, Sabretooth (mec. + search)
- [x] **MojoMania:** Mojo, Magog, Spiral
- [x] **NeXt Evolution:** Juggernaut, Marauders, Mister Sinister, Stryfe
- [x] **Age of Apocalypse:** Unus, Four Horsemen, Dark Beast, En Sabah Nur, Apocalypse
- [x] **Agents of S.H.I.E.L.D.:** Baron Zemo, Batroc, Black Widow, M.O.D.O.K, Thunderbolts

> Cobertura: **56/56** sets de villano con estrategia (0 sin clave). Mojo/Sinister Six/Wrecking Crew etc. keyed por nombre de set. Contenido en inglés, mecánicas de cartas + foros (HoH, Cardboard Champions, BGG).

## 3. Verificación

- [x] Balance de sintaxis del bloque `VILLAIN_STRATEGY` (comillas/llaves/corchetes pares) tras cada lote
- [x] Cobertura: cada uno de los 56 sets de villano tiene entrada (verificado contra los datos)
- [ ] Smoke test en navegador: abrir 4-5 villanos y ver portada + estrategia; el desplegable sigue funcionando (pendiente del usuario)
