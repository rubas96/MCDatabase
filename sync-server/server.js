/* ============================================================
   Marvel Champions — servidor de sincronización de perfiles  (Bun)
   ------------------------------------------------------------
   Pequeño servicio en Bun SIN dependencias y SIN seguridad (proyecto
   personal). Guarda el blob de perfiles de cada "código de sync" como
   un archivo JSON en disco. Los dispositivos comparten perfiles usando
   el mismo código.

   Rutas:
     GET  /perfiles/:codigo  -> { updated:<ms>, blob:<base64|null> }
     PUT  /perfiles/:codigo  -> body { blob:<base64> }  (sobrescribe)
                                responde { ok:true, updated:<ms> }
     GET  /salud             -> "OK"

   Arranque:   bun run server.js      (o con Docker, ver LEEME.md)
   Variables:  PORT (def. 8787)   DATA_DIR (def. ./datos)
   ============================================================ */
const PORT     = parseInt(Bun.env.PORT || "8787", 10);
const DATA_DIR = (Bun.env.DATA_DIR || "./datos").replace(/\/+$/, "");
const MAX_BODY = 12 * 1024 * 1024; // 12 MB de tope por subida

// Sólo letras/números/_/-, 1..64 chars. Evita travesía de rutas (../).
const CODE_RE  = /^[A-Za-z0-9_-]{1,64}$/;
const fileFor  = code => `${DATA_DIR}/${code}.json`;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS },
  });

Bun.serve({
  port: PORT,
  hostname: "0.0.0.0",
  maxRequestBodySize: MAX_BODY,
  async fetch(req) {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

    const { pathname } = new URL(req.url);
    const parts = pathname.split("/").filter(Boolean); // ["perfiles","codigo"]

    if (parts.length <= 1 && (parts[0] === "salud" || parts[0] === undefined)) {
      return new Response("OK", { headers: { "Content-Type": "text/plain", ...CORS } });
    }

    if (parts[0] === "perfiles" && parts[1]) {
      const code = decodeURIComponent(parts[1]);
      if (!CODE_RE.test(code)) return json({ error: "código inválido (usa A-Z a-z 0-9 _ - )" }, 400);
      const file = Bun.file(fileFor(code));

      if (req.method === "GET") {
        if (!(await file.exists())) return json({ updated: 0, blob: null }); // aún no existe -> vacío
        try { return json(await file.json()); }
        catch { return json({ updated: 0, blob: null }); }
      }

      if (req.method === "PUT") {
        let body;
        try { body = await req.json(); }
        catch (e) { return json({ error: "JSON inválido: " + e.message }, 400); }
        if (!body || typeof body.blob !== "string") return json({ error: "falta 'blob'" }, 400);
        const record = { updated: Date.now(), blob: body.blob }; // hora del servidor = autoridad
        try { await Bun.write(file, JSON.stringify(record)); }    // Bun.write crea carpetas si faltan
        catch { return json({ error: "no se pudo guardar" }, 500); }
        return json({ ok: true, updated: record.updated });
      }

      return json({ error: "método no permitido" }, 405);
    }

    return json({ error: "no encontrado" }, 404);
  },
});

console.log(`[mc-sync] (Bun) escuchando en http://0.0.0.0:${PORT}  (datos en ${DATA_DIR})`);
