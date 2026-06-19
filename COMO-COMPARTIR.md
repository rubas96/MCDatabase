# Cómo compartir tu app y abrirla en cualquier lado

Tu app es **un solo archivo HTML** que funciona en cualquier dispositivo con internet
(descarga el motor y las cartas de MarvelCDB al abrirla). Para tener un **enlace** que
puedas abrir y compartir desde donde sea, súbela a un hosting gratis. Aquí las dos formas
más fáciles.

---

## Opción A — Netlify Drop (la más rápida, sin instalar nada)

1. **Renombra** el archivo a **`index.html`**
   (clic derecho → *Cambiar nombre*). Esto hace que el enlace quede limpio.
2. Entra a **https://app.netlify.com/drop**
3. **Arrastra** el archivo `index.html` a esa página.
4. En unos segundos te da un **enlace público** tipo
   `https://algo-al-azar.netlify.app` → ese enlace lo abres en el celular, la tablet,
   otra PC, o se lo pasas a quien quieras.
5. *(Opcional)* Crea una cuenta gratis para que el enlace **no expire** y poder ponerle
   un nombre más bonito (`https://mi-coleccion-marvel.netlify.app`).

> También funciona arrastrando **la carpeta** completa (con el `index.html` dentro).

---

## Opción B — GitHub Pages (si ya usas GitHub)

1. Crea un repositorio nuevo (puede ser privado o público).
2. Sube el archivo con el nombre **`index.html`**.
3. En el repo: **Settings → Pages → Branch: `main` → Save**.
4. A los minutos tu enlace será `https://TU-USUARIO.github.io/TU-REPO/`.

---

## Cosas que conviene saber

- **Necesita internet** la primera vez que se abre (y al pulsar *Update data*), porque
  baja la base de datos de cartas. Después funciona aunque pierdas conexión; solo las
  *imágenes* de las cartas requieren estar en línea.

- **Cada dispositivo guarda su propia colección.** Si abres el enlace en el celular, ahí
  empiezas con la colección vacía. Para llevarte la tuya:
  - En la PC pulsa **⭳ Backup** (descarga un archivo `.json`).
  - En el otro dispositivo abre la app y pulsa **⭱ Restore**, eligiendo ese `.json`.

- **Si compartes el enlace con un amigo**, él verá la app con *su* colección (vacía al
  principio), nunca la tuya. Es una herramienta personal: el enlace es el mismo, los datos
  son de cada quien.

- El archivo no contiene datos personales; puedes compartir el enlace sin problema.
