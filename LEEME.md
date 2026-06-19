# Marvel Champions — Colección y Constructor de Mazos

App de una sola página (un archivo HTML) para llevar tu colección y armar mazos con lo que tienes.

## Cómo abrirla
Haz doble clic en **`Marvel Champions Collection.html`**. Se abre en tu navegador (Chrome o Edge recomendados). No instala nada.

## Primer uso
1. La primera vez necesita **internet** para descargar la base de datos de cartas (motor SQLite + datos de MarvelCDB). Tarda unos segundos.
2. Ve a la pestaña **Collection** y marca los productos que tienes (Core Set, hero packs, cajas grandes…).
3. Las pestañas **Heroes**, **Villains & Scenarios**, **Cards** y **Deck Builder** se filtran automáticamente a lo que posees.

## Villanos y módulos
- **Villains:** los escenarios que puedes jugar, **agrupados por villano**. Cada grupo es el set de encuentro completo de esa pelea (villano, esquema principal, secuaces…). Hay una casilla para incluir también los **sets némesis** de cada héroe.
- **Modular Sets:** los módulos reutilizables que puedes añadir a casi cualquier escenario (Bomb Scare, Legions of Hydra, etc.). El menú permite ver también los sets Standard / Expert / Evidence / Leader.

> Nota: los villanos y cartas de encuentro vienen de la API de MarvelCDB (no del dataset de mazos, que solo tiene cartas de jugador). Por eso la **primera descarga** y el botón **Update data** necesitan conexión. Si por algún motivo no se pudieran descargar, las pestañas Villains/Modular te avisarán y bastará con pulsar Update estando en línea.

## Armar un mazo (Deck Builder)
- Elige un **héroe** y un **aspecto** (Aggression, Justice, Leadership, Protection).
- Las cartas **signature** del héroe se añaden solas.
- Agrega cartas de tu aspecto + básicas con los botones **+ / −** (solo aparece lo que tienes).
- El panel valida las reglas: mínimo 40 cartas, límite de copias por carta y cuántas posees.
- **Save** guarda el mazo; **Export text** lo copia/descarga como lista.

## Cartas recomendadas (sinergias)
Junto a la lista del mazo verás el panel **Recommended pairings**. Sugiere cartas de **tu colección** que combinan bien:
- Antes de añadir cartas muestra **buenas cartas de inicio para ese héroe**.
- A medida que añades cartas pasa a sugerir **cartas que combinan con tu mazo** (mismos rasgos/«traits», combos por nombre, y cartas afines al aspecto).
- Cada sugerencia trae un motivo corto y los botones **+ / −** para añadirla al instante (respeta lo que tienes y los límites de copias).

Funciona **sin conexión**: las sugerencias salen de la propia base de cartas (rasgos y textos), no de internet.

## Importar un mazo de MarvelCDB y ver qué te falta
En la pestaña **Deck Builder**, arriba del todo, pega el **enlace de un mazo** de marvelcdb.com (o solo su número de ID) y pulsa **Import & check**. El programa:
1. Carga el mazo en el constructor (héroe, aspecto y cartas).
2. Te muestra un informe con **las cartas que te faltan**, agrupadas por el **producto** del que salen (p. ej. "Core Set: 3 cartas", "Hero Pack X: 1 carta"), e indica si te falta el propio héroe.

Así puedes usar cualquier mazo de la comunidad como base y saber exactamente qué expansión necesitas comprar para montarlo. (Necesita conexión para descargar el mazo.)

## Actualizar cuando consigas más expansiones
Dos cosas distintas:
- **Tu colección:** solo marca el nuevo producto en la pestaña Collection. Listo.
- **Cartas nuevas / sets recién publicados:** pulsa **↻ Update data** (arriba a la derecha). Descarga la lista más reciente desde MarvelCDB y los productos nuevos aparecen solos en Collection.

## Respaldo (importante)
Tu colección y mazos se guardan en este navegador/computadora.
- **⭳ Backup** descarga un archivo JSON con todo (guárdalo o pásalo a otra PC).
- **⭱ Restore** lo vuelve a cargar.
- En la pestaña Help también puedes exportar la base de datos completa como archivo **SQLite (.db)**.

## Notas
- Después de la primera descarga funciona **sin conexión**, pero las **imágenes** de las cartas necesitan internet.
- Interfaz en inglés; los nombres/textos de las cartas vienen en inglés (es la base de datos de MarvelCDB).
- Datos: dataset abierto de [MarvelCDB](https://marvelcdb.com/) vía jsDelivr. Motor: SQLite (sql.js / WebAssembly) corriendo en el navegador.
