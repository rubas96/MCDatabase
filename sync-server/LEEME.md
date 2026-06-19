# Servidor de sincronización de perfiles — Marvel Champions

Pequeño servicio en **Bun** (sin dependencias) y **sin seguridad** (proyecto personal).
Guarda los perfiles de cada *código de sincronización* como un archivo JSON y los sirve
a cualquier dispositivo que use el mismo código. Así puedes consultar tus perfiles en
varios equipos.

## Cómo funciona

- El navegador (la app `Marvel Champions Collection.html`) exporta su base de perfiles
  (SQLite) a base64 y la **sube** (`PUT`) cuando guardas algo, y la **baja** (`GET`) al abrir.
- El servidor solo almacena ese blob por código. La hora del servidor decide cuál es la
  versión más reciente (*last-write-wins*).

## Rutas

| Método | Ruta | Qué hace |
|---|---|---|
| `GET`  | `/perfiles/:codigo` | Devuelve `{ updated, blob }` (o `blob:null` si no existe). |
| `PUT`  | `/perfiles/:codigo` | Body `{ blob }`. Sobrescribe. Responde `{ ok, updated }`. |
| `GET`  | `/salud` | `OK` (sonda de salud). |

`:codigo` solo admite `A-Z a-z 0-9 _ -` (1–64 caracteres).

Variables de entorno:
- `PORT` — puerto (por defecto `8787`).
- `DATA_DIR` — carpeta donde guardar los JSON (por defecto `./datos`).

## Opción A — Docker (recomendado)

Con Docker Compose (incluye reinicio automático y volumen persistente en `./datos`):

```bash
cd sync-server
docker compose up -d --build
docker compose logs -f          # ver el log
# -> [mc-sync] (Bun) escuchando en http://0.0.0.0:8787  (datos en /data)
```

Parar / actualizar:
```bash
docker compose down             # parar
docker compose up -d --build    # reconstruir tras cambios
```

Sin compose (Docker a pelo):
```bash
cd sync-server
docker build -t mc-sync .
docker run -d --name mc-sync --restart unless-stopped \
  -p 8787:8787 -v "$PWD/datos:/data" mc-sync
```

## Opción B — Bun directo (sin Docker)

```bash
# requiere Bun instalado (https://bun.sh)
cd sync-server
PORT=8787 DATA_DIR=./datos bun run server.js
```

Para dejarlo vivo entre reinicios sin Docker, usa tu gestor de procesos preferido
(p. ej. `pm2 start "bun run server.js" --name mc-sync`, o una unidad systemd que llame a
`bun`).

## Exponerlo con HTTPS detrás de nginx (recomendado)

Si la app se sirve por `https://`, el navegador exige que el sync también sea `https://`
(contenido mixto). Pon el servicio tras nginx en una ruta `/sync`:

```nginx
location /sync/ {
    proxy_pass http://127.0.0.1:8787/;
    proxy_set_header Host $host;
}
```

Con eso, en la app pones como **servidor de sincronización**: `https://tu-dominio.com/sync`
(la app añade sola `/perfiles/<codigo>`). Si sirves la app y el sync desde el **mismo
dominio**, ni siquiera hace falta CORS (el server lo permite igualmente).

## Uso en la app

1. Abre la app → botón **👤 (perfiles)** → **☁ Sincronización…**.
2. Escribe el **servidor** (p. ej. `https://tu-dominio.com/sync`) y un **código** que
   inventes (p. ej. `ruben-casa`).
3. **Guardar y sincronizar**. Repite los **mismos** datos en el otro dispositivo.

> Sin seguridad: cualquiera que conozca el servidor **y** el código puede leer/escribir
> esos perfiles. Para uso personal basta con elegir un código no obvio.

## Copias de seguridad

Todo vive en `DATA_DIR` (montado en `./datos` con Docker) como archivos `*.json`.
Para respaldar, copia esa carpeta.
