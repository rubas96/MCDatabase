// Fetches the preconstructed decklists from MarvelCDB for each mapped hero and
// embeds them into STARTER_SLOTS in the HTML so box heroes show their deck cards.
import fs from "node:fs";

const DECKS = {
  "01001a":5,"01010a":2,"01019a":3,"01029a":4,"01040a":1,
  "04001a":3483,"04031a":3390,
  // --- Hero packs individuales: starter/precon oficiales (verificados: hero_code + aspecto + ~40cp) ---
  "03001a":306,"05001a":272,"06001a":669,"08001a":1126,"09001a":3468,
  "10001a":2465,"12001a":5074,"13001a":11397,"14001a":6893,"15001a":7675,
  "26001a":16198,"49001a":44013,
  // Guardianes de la Galaxia
  "17001a":9907,"18001a":11401,"19001a":10599,"20001a":11396,"22001a":14353,"28001a":19389,"30001a":21000,
  // Vengadores / otros
  "23001a":14192,"25001a":17013,"29001a":19388,"31001a":21004,
  "51001a":49162,"52001a":49163,"53001a":56009,"54001a":51163,"58001a":59633,"59001a":59634,
  // X-Men
  "33001a":23548,"34001a":23226,"35001a":24941,"36001a":28756,"37001a":28755,"38001a":35683,
  "41001a":32976,"42001a":32640,"43001a":35684,"46001a":38676,"47001a":42415,"48001a":42495,
  "16001a":8441,"16029a":8762,
  "21001a":14354,"21031a":14355,
  "27001a":38354,"27030a":18101,
  "32001a":27026,"32030a":23072,
  "40001a":32974,"40037a":32975,
  "44001a":38350,
  "45001a":38001,"45030a":38002,
  "50001a":47082,"50034a":48334,
  "56001a":55371,"56029a":55370
};
const base = c => String(c).replace(/[a-z]$/i, "");
const sleep = ms => new Promise(r => setTimeout(r, ms));

const out = {};
const report = [];
for (const [code, id] of Object.entries(DECKS)) {
  try {
    const r = await fetch(`https://marvelcdb.com/api/public/decklist/${id}.json`, { headers: { "Accept": "application/json" } });
    if (!r.ok) { report.push(`FAIL ${code} (deck ${id}): HTTP ${r.status}`); await sleep(120); continue; }
    const j = await r.json();
    const slots = j.slots || {};
    // MarvelCDB starter decks carry the hero in `hero_code`; `investigator_code` is often null.
    const inv = j.hero_code || j.investigator_code || "";
    const n = Object.values(slots).reduce((a, b) => a + (b || 0), 0);
    const match = base(inv) === base(code);
    if (!Object.keys(slots).length) { report.push(`EMPTY ${code} (deck ${id})`); await sleep(120); continue; }
    out[code] = slots;
    report.push(`OK   ${code} <- deck ${id} (hero ${inv}${match ? "" : " ⚠MISMATCH"}, ${Object.keys(slots).length} cards / ${n} copies)`);
  } catch (e) {
    report.push(`ERR  ${code} (deck ${id}): ${e.message}`);
  }
  await sleep(120);
}

console.log(report.join("\n"));
console.log(`\nfetched ${Object.keys(out).length}/${Object.keys(DECKS).length} decks`);

// Embed into HTML (replace the empty STARTER_SLOTS={...})
const HTML = "Marvel Champions Collection.html";
let html = fs.readFileSync(HTML, "utf8");
const marker = "const STARTER_SLOTS={";
const i1 = html.indexOf(marker);
const i2 = html.indexOf("};", i1);
if (i1 < 0 || i2 < 0) throw new Error("STARTER_SLOTS marker not found");
const json = JSON.stringify(out).replace(/</g, "\\u003c");
html = html.slice(0, i1) + "const STARTER_SLOTS=" + json + html.slice(i2 + 1);
fs.writeFileSync(HTML, html);
console.log("embedded into", HTML);
fs.writeFileSync("_starter_slots.json", JSON.stringify(out, null, 1));
