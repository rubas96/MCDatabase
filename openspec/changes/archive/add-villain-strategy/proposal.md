# Add villain strategy guide

## Why

La app muestra los héroes con un "dossier" curado (quién es, fuerte/débil) en su modal de
detalle, pero los **villanos** solo se ven como portadas desplegables con sus cartas. Al
elegir un villano no hay ninguna ayuda sobre **cómo enfrentarlo**: qué aspectos rinden, qué
amenazas vigilar, qué tempo seguir. Queremos esa guía para que el jugador prepare mejor su
mazo antes de la partida.

## What Changes

- **Nuevo modal de detalle de villano** (`openVillainDetail`, espejo de `openHeroDetail`):
  portada cómic del villano (arte de la etapa I, nombre, stats), un **bloque de estrategia**,
  y la rejilla de cartas del set. Se abre desde la portada del villano en la pestaña Villains
  (sin romper el desplegable actual: botón/área dedicada).
- **`VILLAIN_STRATEGY`**: mapa curado (keyed por `set_code`, con respaldo por nombre) con la
  estrategia de **los 59 villanos** del juego. Cada entrada: resumen de la amenaza, aspectos/
  enfoques recomendados, y avisos clave. Si un villano no tiene entrada, el modal se muestra
  igual sin el bloque (degradación elegante).
- El contenido se **apoya en estrategia de la comunidad** (Reddit r/marvelchampionslcg, Hall
  of Heroes, BoardGameGeek) para ser preciso, no inventado; se sintetiza y parafrasea.

## Impact

- Solo `Marvel Champions Collection.html`: nueva función modal, `VILLAIN_STRATEGY`, CSS del
  modal/bloque, y el disparador en `renderSetGroups`/`renderVillains`.
- Sin dependencias nuevas. Reutiliza el modal `#hmodal` o uno análogo, `imgUrl`, `cardTile`.
- Nueva capability `villain-strategy`.
