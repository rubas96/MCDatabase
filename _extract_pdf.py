#!/usr/bin/env python3
# Column-aware re-extraction of the Rules Reference PDF into clean markdown.
# Headings = font ExoMVC-Bold (size ~12); body keeps bold(**)/italic(_) emphasis.
# Paragraphs are rebuilt from vertical gaps; soft-wrapped lines are joined.
import fitz, re, sys

PDF = r"D:\Documentos\Claude\Marvel Champions\mc_rulesreference_v17-compressed.pdf"
OUT = r"D:\Documentos\Claude\Marvel Champions\mc_rules_clean.md"

doc = fitz.open(PDF)
BULLETS = "•‣◦·▪–—»"
GAP = 5.0  # vertical gap (pt) above which a new paragraph starts

def is_pua(ch):
    return 0xE000 <= ord(ch) <= 0xF8FF

def clean_text(t):
    s = "".join("" if is_pua(ch) else ch for ch in t)
    s = s.replace("\t", " ").replace("\xa0", " ")
    return re.sub(r"[ ]{2,}", " ", s)

def span_md(s):
    raw = s["text"]
    if not raw:
        return ""
    font = s["font"]
    bold = ("Black" in font) or ("Bold" in font) or bool(s["flags"] & 16)
    ital = ("Oblique" in font) or ("Italic" in font) or bool(s["flags"] & 2)
    txt = clean_text(raw)
    if not txt.strip():
        return txt
    lead = txt[:len(txt) - len(txt.lstrip())]
    trail = txt[len(txt.rstrip()):]
    core = txt.strip()
    if bold and ital: core = f"_**{core}**_"
    elif bold:        core = f"**{core}**"
    elif ital:        core = f"_{core}_"
    return lead + core + trail

def is_heading_line(spans):
    return any(s["font"].startswith("ExoMVC") for s in spans)

out_blocks = []  # list of ("h", title) or ("p", text)

for pno in range(doc.page_count):
    page = doc[pno]
    W = page.rect.width
    d = page.get_text("dict")
    # gather lines with geometry
    lines = []
    for b in d["blocks"]:
        for l in b.get("lines", []):
            spans = l["spans"]
            if not spans:
                continue
            raw = "".join(s["text"] for s in spans).strip()
            if not raw:
                continue
            if re.fullmatch(r"[0-9]+", raw):              # page numbers
                continue
            if all(s["font"].startswith("Exo2-Regular-SC") for s in spans) and len(raw) <= 3:
                continue                                   # alphabet tab letters
            x0 = min(s["bbox"][0] for s in spans)
            bb = l["bbox"]
            col = 0 if x0 < W / 2 else 1
            lines.append({"col": col, "y0": bb[1], "y1": bb[3], "x0": x0,
                          "spans": spans, "raw": raw,
                          "md": "".join(span_md(s) for s in spans)})
    lines.sort(key=lambda r: (r["col"], r["y0"], r["x0"]))

    # rebuild paragraphs within each column run
    global buf, kind
    buf, kind, prev = None, None, None
    def flush():
        global buf, kind
        if buf is not None:
            txt = re.sub(r"\s{2,}", " ", buf).strip()
            if txt:
                out_blocks.append((kind, txt))
        buf, kind = None, None

    for ln in lines:
        if prev is not None and ln["col"] != prev["col"]:
            flush(); prev = None
        if is_heading_line(ln["spans"]):
            title = re.sub(r"[*_]", "", ln["md"])
            title = re.sub(r"\s{2,}", " ", title).strip()
            if not title:
                prev = ln
                continue
            gap = (ln["y0"] - prev["y1"]) if (prev and prev["col"] == ln["col"]) else 999
            # wrapped title / duplicated running header: gap<3 right after a heading
            if out_blocks and out_blocks[-1][0] == "h" and gap < 3:
                ptitle = out_blocks[-1][1]
                if title == ptitle or title in ptitle:
                    pass                                   # duplicate -> drop
                elif ptitle in title:
                    out_blocks[-1] = ("h", title)          # keep the complete title
                else:
                    out_blocks[-1] = ("h", (ptitle + " " + title).strip())
            else:
                flush()
                out_blocks.append(("h", title))
            prev = ln
            continue
        md = ln["md"].strip()
        first = ln["raw"].lstrip()[:1]
        is_bullet = first in BULLETS
        gap = (ln["y0"] - prev["y1"]) if (prev and prev["col"] == ln["col"]) else 999
        if is_bullet:
            # remove bullet glyphs (and emphasis markers wrapping them)
            body = re.sub(r"(\*\*|_)?\s*[" + re.escape(BULLETS) + r"]\s*(\*\*|_)?", " ", md)
            body = re.sub(r"^\s*(\*\*|_)\s+", "", body)
            body = re.sub(r"\s{2,}", " ", body).strip()
            if not body:
                prev = ln           # empty bullet marker line -> skip
                continue
            flush()
            buf, kind = "- " + body, "li"
        elif gap > GAP or buf is None:
            flush()
            buf, kind = md, "p"
        else:
            buf = (buf + " " + md) if buf else md
        prev = ln
    flush(); prev = None

# emit markdown
md_out = []
for kind, txt in out_blocks:
    if kind == "h":
        md_out += ["", "## " + txt, ""]
    elif kind == "li":
        md_out.append(txt)
    else:
        md_out += ["", txt, ""]
text = re.sub(r"\n{3,}", "\n\n", "\n".join(md_out)).strip() + "\n"

with open(OUT, "w", encoding="utf-8") as f:
    f.write(text)
print("wrote", OUT, "chars", len(text), "headings", text.count("\n## "), file=sys.stderr)
