# Design — Villain strategy guide

## Modal: reutilizar `#hmodal`

Ya existe el modal `#hmodal` con `#hm-title` + `#hm-body` y cierre por ✕ / clic-fuera / Esc.
`openVillainDetail(setCode)` lo reutiliza (no hace falta un modal nuevo): rellena título y
cuerpo con el contenido del villano y hace `#hmodal.classList.add("show")`.

`openVillainDetail(setCode)`:
1. `cards = q("SELECT … WHERE set_code=? ORDER BY position")` del set del villano.
2. **Portada** (como `.herocover`): arte de la etapa I (`type_code='villain'` de menor
   `position`, o la primera carta), masthead "Marvel Villains · <tipo>", título = nombre del
   set, stats del villano (scheme/attack/HP) si están.
3. **Bloque de estrategia** = `VILLAIN_STRATEGY[setCode] || VILLAIN_STRATEGY[nombre.lower()]`.
   Si existe: secciones **Amenaza**, **Enfoques recomendados**, **Avisos**. Si no, se omite
   (degradación elegante) con una nota breve "sin guía aún".
4. **Cartas** del set en rejilla (`cardTile`), agrupando villano / esquema / resto si aplica.

## Disparador desde la portada (sin romper el desplegable)

En `renderSetGroups` (modo `coverBrand`), la `.cathead.vcover` es hoy toda `data-toggle`
(expandir). Se añade un botón **"⚔ Estrategia"** en `.vc-meta`; su `onclick` hace
`stopPropagation()` y llama `openVillainDetail(set_code)`. El resto de la portada sigue
expandiendo. El botón solo aparece cuando `coverBrand==='Marvel Villains'` (no en modulares).

## `VILLAIN_STRATEGY` — estructura y contenido

```js
const VILLAIN_STRATEGY = {
  "<set_code o nombre-lower>": {
    threat: "Qué hace peligroso al villano (esquema rápido, daño, secuaces, side schemes…).",
    approaches: ["Aspecto/táctica recomendada + por qué", "…"],
    watch: ["Aviso clave (carta/etapa concreta a vigilar)", "…"],
  }, …
}
```

- Clave principal por `set_code` (estable); respaldo por nombre en minúsculas.
- **Los 59 villanos** (lista en tasks.md), curados en lotes.
- Contenido **apoyado en la comunidad**: buscar en r/marvelchampionslcg, Hall of Heroes y BGG
  la estrategia que de verdad funciona (aspectos fuertes, errores comunes), y **sintetizar/
  parafrasear** (no copiar). Verificar nombres de cartas/etapas contra los datos del set.

## Alternativas descartadas

- **Modal nuevo separado**: innecesario, `#hmodal` ya sirve y mantiene cierre/estilos.
- **Texto auto-generado por stats**: descartado por el usuario (quiere curado real).
- **Bloque inline en el desplegable**: el usuario eligió modal dedicado.
