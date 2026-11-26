<p align="center"><img src="https://raw.githubusercontent.com/davidsant7e/arcanos-theme/main/images/icono.png" alt="Arcanos Theme" width="110"></p>

# Arcanos Theme

Temas de color para **VS Code**, **Kiro** y otros editores compatibles, inspirados en los **Arcanos Mayores** del tarot. Cada carta tiene su paleta; todas parten del duotono del mazo: azul noche `#1f2a5c` y durazno `#f4a582`.

*Color themes for VS Code and Kiro inspired by the tarot's Major Arcana — four dark and two light variants, contrast-checked.*

## Las cartas

| Tema | Tipo | Idea |
|---|---|---|
| **Arcanos** | oscuro | El duotono del mazo: azul noche y durazno. |
| **XVIII · La Luna** | oscuro | Noche profunda y luz de plata: los ciclos. |
| **XVII · La Estrella** | oscuro | Agua clara bajo una estrella dorada. |
| **IX · El Ermitaño** | oscuro, suave | Penumbra cálida y la luz del farol: contraste suave para largas horas. |
| **XIX · El Sol** | claro | Mañana cálida: claro, dorado y legible. |
| **III · La Emperatriz** | claro | Jardín al mediodía: verde, marfil y rosa. |

### Arcanos
![Arcanos](https://raw.githubusercontent.com/davidsant7e/arcanos-theme/main/images/arcanos.png)

### XVIII · La Luna
![La Luna](https://raw.githubusercontent.com/davidsant7e/arcanos-theme/main/images/la-luna.png)

### XVII · La Estrella
![La Estrella](https://raw.githubusercontent.com/davidsant7e/arcanos-theme/main/images/la-estrella.png)

### IX · El Ermitaño
![El Ermitaño](https://raw.githubusercontent.com/davidsant7e/arcanos-theme/main/images/el-ermitano.png)

### XIX · El Sol
![El Sol](https://raw.githubusercontent.com/davidsant7e/arcanos-theme/main/images/el-sol.png)

### III · La Emperatriz
![La Emperatriz](https://raw.githubusercontent.com/davidsant7e/arcanos-theme/main/images/la-emperatriz.png)

## Instalar

- **Kiro / VSCodium / Cursor** (Open VSX): Extensiones (`Ctrl+Shift+X`) → busca **Arcanos Theme** → Instalar. O en la web: <https://open-vsx.org/extension/davidsant7e/arcanos-theme>.
- **Archivo `.vsix`**: descárgalo de [Releases](https://github.com/davidsant7e/arcanos-theme/releases) y en el editor: `Ctrl+Shift+P` → *Extensions: Install from VSIX…*.

Luego elige la carta: `Ctrl+K` `Ctrl+T` → **Arcanos · …**

## Legibilidad

Cada paleta se revisa al generar los temas (`npm run generar` falla si no cumple):
- texto normal ≥ **7:1** sobre el editor, la barra lateral y los paneles;
- colores del código ≥ **4,5:1** (WCAG AA), también sobre la línea actual;
- comentarios ≥ **3:1** (van en cursiva y más tenues a propósito).

## Cómo está hecho

- `paletas.json`: una paleta por carta (fondos, texto, acento y 12 colores de sintaxis).
- `scripts/generar.mjs`: convierte cada paleta en `themes/<carta>-color-theme.json` (colores del editor, terminal, git, corchetes, colores semánticos) y revisa el contraste.
- `scripts/capturas.mjs`: genera las capturas con [Shiki](https://shiki.style) y Playwright.
- Publicación: al crear una etiqueta `v*`, GitHub Actions genera los temas, empaqueta el `.vsix`, lo publica en **Open VSX** y lo adjunta a la release.

¿Quieres otra carta? Agrega su paleta a `paletas.json` y corre `npm run generar`.

Licencia MIT · Parte del mazo de [davidsant7e](https://github.com/davidsant7e).
