#!/usr/bin/env python3
# Builds the embeddable JSON from the CLEAN column-aware extraction.
#   entry = {t: title, c: category, x: literal body text, g: group/source label}
import json, re, sys
from collections import Counter

SRC = r"D:\Documentos\Claude\Marvel Champions\mc_rules_clean.md"
OUT = r"D:\Documentos\Claude\Marvel Champions\_rulesref.json"

text = open(SRC, encoding="utf-8").read()

# split into (title, body) sections by '## ' headings, preserving order
parts = re.split(r"(?m)^## (.+?)\s*$", text)
# parts[0] = preamble; then alternating title, body
sections = []
for i in range(1, len(parts), 2):
    title = parts[i].strip()
    body = parts[i + 1].strip() if i + 1 < len(parts) else ""
    body = re.sub(r"\n{3,}", "\n\n", body).strip()
    sections.append({"title": title, "body": body})

CAT_AT = {
    "GLOSSARY": "Glossary",
    "APPENDIX I: DECK CUSTOMIZATION": "Deck customization",
    "APPENDIX II: SETUP": "Setup",
    "APPENDIX III: CARD ANATOMY": "Card anatomy",
    "APPENDIX IV: FAQ": "FAQ",
    "APPENDIX V: ERRATA": "Errata",
    "APPENDIX VI: GAME ENVIRONMENTS (BETA)": "Game environments",
}
SKIP = {"INDEX", "SUMMARY OF NOTABLE CHANGES", "RULES REFERENCE",
        "GLOSSARY", "OVERVIEW"}  # OVERVIEW kept? keep it -> remove from skip

SKIP = {"INDEX", "GLOSSARY"}

def split_see_also(body):
    return re.sub(r"\s*\*\*See also\*\*\s*:", "\n\n**See also**:", body).strip()

def split_faq(body):
    """A FAQ section body holds one or more '**Q: ...** A: ...' pairs."""
    out = []
    chunks = re.split(r"(?=\*\*Q:)", body)
    for ch in chunks:
        ch = ch.strip()
        if not ch.startswith("**Q:"):
            continue
        m = re.split(r"\s+A:\s+", ch, maxsplit=1)
        if len(m) != 2:
            continue
        q = re.sub(r"[*_]", "", m[0]).strip()          # "Q: ...?"
        q = re.sub(r"\s{2,}", " ", q)
        a = "A: " + m[1].strip()
        out.append((q, a))
    return out

# assign category in document order
cat = "Basics"
entries = []
group = ""
for s in sections:
    up = s["title"].upper()
    if up in CAT_AT:
        cat = CAT_AT[up]
        continue                       # divider, not an entry
    if up in SKIP:
        continue

    if cat == "FAQ":
        group = s["title"]            # product / section label
        for q, a in split_faq(s["body"]):
            entries.append({"t": q, "c": cat, "x": a, "g": group})
        continue

    if cat == "Errata":
        if not s["body"]:
            group = s["title"]        # product header
            continue
        entries.append({"t": s["title"], "c": cat, "x": split_see_also(s["body"]), "g": group})
        continue

    # glossary / basics / appendix prose
    group = ""
    if s["body"]:
        entries.append({"t": s["title"], "c": cat, "x": split_see_also(s["body"]), "g": ""})

cnt = Counter(e["c"] for e in entries)
print("entries:", len(entries), file=sys.stderr)
for k in ["Basics","Glossary","Deck customization","Setup","Card anatomy","FAQ","Errata","Game environments"]:
    if cnt.get(k): print(f"  {k}: {cnt[k]}", file=sys.stderr)
print("empty-body:", sum(1 for e in entries if not e["x"]), file=sys.stderr)

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(entries, f, ensure_ascii=False, separators=(",", ":"))
print("wrote", OUT, file=sys.stderr)
