// Genera los temas de VS Code / Kiro a partir de paletas.json y revisa el contraste.
// Uso: node scripts/generar.mjs   (sale con error si algún color no llega al contraste mínimo)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const { cartas } = JSON.parse(readFileSync(join(raiz, "paletas.json"), "utf8"));

// ---------------------------------------------------------------- contraste (WCAG 2.x)
const canal = (c) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const luz = (hex) => {
  const [r, g, b] = rgb(hex).map(canal);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contraste = (a, b) => {
  const [x, y] = [luz(a), luz(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
/** Color con transparencia: "#rrggbb" + alfa 0..1 → "#rrggbbaa". */
const alfa = (hex, a) => hex + Math.round(a * 255).toString(16).padStart(2, "0");

// ---------------------------------------------------------------- tema
function tema(p) {
  const s = p.sintaxis;
  const oscuro = p.tipo === "dark";
  const error = oscuro ? "#ff7a85" : "#c0263a";
  const aviso = oscuro ? "#ffcc66" : "#a35c00";
  const info = oscuro ? "#8fc7ff" : "#1d5d88";
  const agregado = oscuro ? "#7fd99a" : "#2f7d32";
  const quitado = error;
  const modificado = oscuro ? "#8fb8ff" : "#2b5fb0";

  const colors = {
    // base
    "focusBorder": alfa(p.acento, 0.6),
    "foreground": p.texto,
    "descriptionForeground": p.tenue,
    "errorForeground": error,
    "icon.foreground": p.tenue,
    "selection.background": alfa(p.acento, 0.35),
    "widget.shadow": "#00000040",
    "textLink.foreground": p.acento,
    "textLink.activeForeground": p.acento,
    "textPreformat.foreground": s.cadena,
    "textBlockQuote.background": p.panel,
    "textBlockQuote.border": p.acento,
    // editor
    "editor.background": p.fondo,
    "editor.foreground": p.texto,
    "editorLineNumber.foreground": alfa(p.tenue, 0.55),
    "editorLineNumber.activeForeground": p.acento,
    "editorCursor.foreground": p.acento,
    "editor.selectionBackground": alfa(p.acento, oscuro ? 0.28 : 0.25),
    "editor.inactiveSelectionBackground": alfa(p.acento, 0.14),
    "editor.selectionHighlightBackground": alfa(p.acento, 0.16),
    "editor.wordHighlightBackground": alfa(s.tipo, 0.16),
    "editor.wordHighlightStrongBackground": alfa(s.funcion, 0.2),
    "editor.findMatchBackground": alfa(s.funcion, 0.45),
    "editor.findMatchHighlightBackground": alfa(s.funcion, 0.22),
    "editor.lineHighlightBackground": alfa(p.resalte, 0.7),
    "editor.lineHighlightBorder": "#00000000",
    "editor.rangeHighlightBackground": alfa(p.acento, 0.08),
    "editorWhitespace.foreground": alfa(p.tenue, 0.25),
    "editorIndentGuide.background1": alfa(p.borde, 0.8),
    "editorIndentGuide.activeBackground1": alfa(p.acento, 0.5),
    "editorRuler.foreground": p.borde,
    "editorBracketMatch.background": alfa(p.acento, 0.2),
    "editorBracketMatch.border": alfa(p.acento, 0.6),
    "editorBracketHighlight.foreground1": s.funcion,
    "editorBracketHighlight.foreground2": s.propiedad,
    "editorBracketHighlight.foreground3": s.tipo,
    "editorError.foreground": error,
    "editorWarning.foreground": aviso,
    "editorInfo.foreground": info,
    "editorGutter.background": p.fondo,
    "editorGutter.addedBackground": agregado,
    "editorGutter.modifiedBackground": modificado,
    "editorGutter.deletedBackground": quitado,
    "editorWidget.background": p.panel,
    "editorWidget.border": p.borde,
    "editorSuggestWidget.background": p.panel,
    "editorSuggestWidget.border": p.borde,
    "editorSuggestWidget.selectedBackground": p.resalte,
    "editorSuggestWidget.highlightForeground": p.acento,
    "editorHoverWidget.background": p.panel,
    "editorHoverWidget.border": p.borde,
    "editorGroupHeader.tabsBackground": p.lateral,
    "editorGroup.border": p.borde,
    "editorOverviewRuler.border": "#00000000",
    "minimap.background": p.fondo,
    "diffEditor.insertedTextBackground": alfa(agregado, 0.16),
    "diffEditor.removedTextBackground": alfa(quitado, 0.16),
    // pestañas
    "tab.activeBackground": p.fondo,
    "tab.activeForeground": p.texto,
    "tab.activeBorderTop": p.acento,
    "tab.inactiveBackground": p.lateral,
    "tab.inactiveForeground": p.tenue,
    "tab.border": p.lateral,
    "tab.hoverBackground": p.panel,
    // barras
    "activityBar.background": p.lateral,
    "activityBar.foreground": p.acento,
    "activityBar.inactiveForeground": alfa(p.tenue, 0.75),
    "activityBar.activeBorder": p.acento,
    "activityBarBadge.background": p.acento,
    "activityBarBadge.foreground": p.acentoTexto,
    "sideBar.background": p.lateral,
    "sideBar.foreground": p.texto,
    "sideBar.border": p.borde,
    "sideBarTitle.foreground": p.tenue,
    "sideBarSectionHeader.background": p.lateral,
    "sideBarSectionHeader.foreground": p.tenue,
    "list.activeSelectionBackground": p.resalte,
    "list.activeSelectionForeground": p.texto,
    "list.inactiveSelectionBackground": alfa(p.resalte, 0.7),
    "list.hoverBackground": alfa(p.resalte, 0.55),
    "list.focusOutline": alfa(p.acento, 0.6),
    "list.highlightForeground": p.acento,
    "statusBar.background": p.lateral,
    "statusBar.foreground": p.tenue,
    "statusBar.border": p.borde,
    "statusBar.debuggingBackground": p.acento,
    "statusBar.debuggingForeground": p.acentoTexto,
    "statusBar.noFolderBackground": p.lateral,
    "statusBarItem.remoteBackground": p.acento,
    "statusBarItem.remoteForeground": p.acentoTexto,
    "titleBar.activeBackground": p.lateral,
    "titleBar.activeForeground": p.texto,
    "titleBar.inactiveBackground": p.lateral,
    "titleBar.inactiveForeground": p.tenue,
    "titleBar.border": p.borde,
    "panel.background": p.lateral,
    "panel.border": p.borde,
    "panelTitle.activeBorder": p.acento,
    "panelTitle.activeForeground": p.texto,
    "panelTitle.inactiveForeground": p.tenue,
    "breadcrumb.foreground": p.tenue,
    "breadcrumb.focusForeground": p.texto,
    // controles
    "button.background": p.acento,
    "button.foreground": p.acentoTexto,
    "button.hoverBackground": alfa(p.acento, 0.85),
    "button.secondaryBackground": p.resalte,
    "button.secondaryForeground": p.texto,
    "badge.background": p.acento,
    "badge.foreground": p.acentoTexto,
    "input.background": p.panel,
    "input.foreground": p.texto,
    "input.border": p.borde,
    "input.placeholderForeground": alfa(p.tenue, 0.8),
    "inputOption.activeBorder": p.acento,
    "dropdown.background": p.panel,
    "dropdown.border": p.borde,
    "checkbox.background": p.panel,
    "checkbox.border": p.borde,
    "progressBar.background": p.acento,
    "scrollbarSlider.background": alfa(p.tenue, 0.2),
    "scrollbarSlider.hoverBackground": alfa(p.tenue, 0.32),
    "scrollbarSlider.activeBackground": alfa(p.acento, 0.45),
    "notifications.background": p.panel,
    "notifications.border": p.borde,
    "quickInput.background": p.panel,
    "pickerGroup.foreground": p.acento,
    "menu.background": p.panel,
    "menu.selectionBackground": p.resalte,
    // git
    "gitDecoration.addedResourceForeground": agregado,
    "gitDecoration.modifiedResourceForeground": modificado,
    "gitDecoration.deletedResourceForeground": quitado,
    "gitDecoration.untrackedResourceForeground": s.cadena,
    "gitDecoration.ignoredResourceForeground": alfa(p.tenue, 0.6),
    "gitDecoration.conflictingResourceForeground": aviso,
    // terminal
    "terminal.background": p.lateral,
    "terminal.foreground": p.texto,
    "terminalCursor.foreground": p.acento,
    "terminal.ansiBlack": oscuro ? p.lateral : p.texto,
    "terminal.ansiRed": error,
    "terminal.ansiGreen": agregado,
    "terminal.ansiYellow": aviso,
    "terminal.ansiBlue": s.tipo,
    "terminal.ansiMagenta": s.numero,
    "terminal.ansiCyan": s.cadena,
    "terminal.ansiWhite": oscuro ? p.texto : p.tenue,
    "terminal.ansiBrightBlack": p.tenue,
    "terminal.ansiBrightRed": error,
    "terminal.ansiBrightGreen": agregado,
    "terminal.ansiBrightYellow": s.funcion,
    "terminal.ansiBrightBlue": info,
    "terminal.ansiBrightMagenta": s.propiedad,
    "terminal.ansiBrightCyan": s.cadena,
    "terminal.ansiBrightWhite": oscuro ? "#ffffff" : p.texto,
  };

  const t = (scope, foreground, fontStyle) => ({ scope, settings: fontStyle ? { foreground, fontStyle } : { foreground } });
  const tokenColors = [
    t(["comment", "punctuation.definition.comment"], s.comentario, "italic"),
    t(["keyword", "storage.type", "storage.modifier", "keyword.control"], s.clave),
    t(["keyword.operator", "punctuation.separator", "punctuation.terminator"], s.operador),
    t(["string", "string.quoted", "string.template", "punctuation.definition.string"], s.cadena),
    t(["constant.character.escape", "string.regexp"], s.constante),
    t(["constant.numeric"], s.numero),
    t(["constant.language", "constant.other", "variable.other.constant", "support.constant"], s.constante),
    t(["entity.name.function", "support.function", "meta.function-call entity.name.function"], s.funcion),
    t(["entity.name.type", "entity.name.class", "support.type", "support.class", "entity.other.inherited-class"], s.tipo),
    t(["variable", "variable.other.readwrite", "meta.definition.variable"], s.variable),
    t(["variable.parameter"], s.variable, "italic"),
    t(["variable.language.this", "variable.language.self", "variable.language"], s.clave, "italic"),
    t(["variable.other.property", "variable.other.object.property", "support.variable.property", "meta.object-literal.key"], s.propiedad),
    t(["entity.name.tag", "punctuation.definition.tag"], s.etiqueta),
    t(["entity.other.attribute-name"], s.atributo, "italic"),
    t(["entity.name.namespace", "entity.name.module"], s.tipo),
    t(["meta.decorator", "punctuation.decorator", "entity.name.function.decorator"], s.constante),
    t(["markup.heading", "entity.name.section"], p.acento, "bold"),
    t(["markup.bold"], s.funcion, "bold"),
    t(["markup.italic"], s.propiedad, "italic"),
    t(["markup.inline.raw", "markup.fenced_code"], s.cadena),
    t(["markup.underline.link", "string.other.link"], s.tipo, "underline"),
    t(["markup.inserted"], agregado),
    t(["markup.deleted"], quitado),
    t(["markup.changed"], modificado),
    t(["support.type.property-name.json"], s.propiedad),
    t(["invalid", "invalid.illegal"], error),
  ];

  const semanticTokenColors = {
    "comment": { foreground: s.comentario, italic: true },
    "keyword": s.clave,
    "string": s.cadena,
    "number": s.numero,
    "function": s.funcion,
    "method": s.funcion,
    "class": s.tipo,
    "interface": s.tipo,
    "enum": s.tipo,
    "type": s.tipo,
    "typeParameter": s.tipo,
    "namespace": s.tipo,
    "variable": s.variable,
    "variable.readonly": s.constante,
    "parameter": { foreground: s.variable, italic: true },
    "property": s.propiedad,
    "enumMember": s.constante,
    "decorator": s.constante,
    "macro": s.constante,
  };

  const nombre = p.numero ? `Arcanos · ${p.numero} ${p.nombre}` : "Arcanos";
  return { $schema: "vscode://schemas/color-theme", name: nombre, type: p.tipo, semanticHighlighting: true, colors, tokenColors, semanticTokenColors };
}

// ---------------------------------------------------------------- revisión y salida
export function revisar(p) {
  const fallas = [];
  const exige = (que, color, fondo, minimo) => {
    const c = contraste(color, fondo);
    if (c < minimo) fallas.push(`${p.id}: ${que} ${color} sobre ${fondo} = ${c.toFixed(2)} (mínimo ${minimo})`);
  };
  for (const fondo of [p.fondo, p.lateral, p.panel]) exige("texto", p.texto, fondo, 7);
  exige("tenue", p.tenue, p.lateral, 4.5);
  exige("acentoTexto", p.acentoTexto, p.acento, 4.5);
  for (const [k, v] of Object.entries(p.sintaxis)) {
    exige(k, v, p.fondo, k === "comentario" ? 3 : 4.5);
    exige(`${k} (línea actual)`, v, p.resalte, k === "comentario" ? 3 : 4.5);
  }
  return fallas;
}

const salida = join(raiz, "themes");
mkdirSync(salida, { recursive: true });
const fallas = cartas.flatMap(revisar);
for (const p of cartas) {
  writeFileSync(join(salida, `${p.id}-color-theme.json`), JSON.stringify(tema(p), null, 2) + "\n");
}
if (fallas.length) {
  console.error("Contraste insuficiente:\n  " + fallas.join("\n  "));
  process.exit(1);
}
console.log(`${cartas.length} temas generados; contraste OK.`);
