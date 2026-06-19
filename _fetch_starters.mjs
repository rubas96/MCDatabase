// Fetches the preconstructed decklists from MarvelCDB for each mapped hero and
// embeds them into STARTER_SLOTS in the HTML so box heroes show their deck cards.
import fs from "node:fs";

const DECKS = {
  "01001a":5,"01010a":2,"01019a":3,"01029a":4,"01040a":1,
  "04001a":3483,"04031a":3390,
  "09001a":3468,                                            // Doctor Strange (u6276 starter, 40cp, verificado)
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
