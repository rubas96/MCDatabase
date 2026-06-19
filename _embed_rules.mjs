// Embeds the verbatim rules dataset (_rulesref.json) into the single-file app,
// replacing the `const RULES=[...]` array that powers the Rules tab.
// Run after rebuilding _rulesref.json:  node _embed_rules.mjs
import fs from "node:fs";

const HTML = "Marvel Champions Collection.html";
const data = JSON.parse(fs.readFileSync("_rulesref.json", "utf8"));
let html = fs.readFileSync(HTML, "utf8");

const idx1 = html.indexOf("const RULES=[");
const idx2 = html.indexOf("const RULE_CATS", idx1);
if (idx1 < 0 || idx2 < 0) throw new Error("RULES markers not found (idx1=" + idx1 + " idx2=" + idx2 + ")");

// Valid JSON is valid JS here; only guard against accidentally closing the <script>.
const jsonStr = JSON.stringify(data).replace(/</g, "\\u003c");

html = html.slice(0, idx1) + "const RULES=" + jsonStr + ";\n" + html.slice(idx2);
fs.writeFileSync(HTML, html);
console.log("embedded", data.length, "verbatim rule entries into", HTML);
