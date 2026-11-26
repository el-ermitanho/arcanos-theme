// Capturas para el README y Open VSX: cada tema pintando el mismo código, con una ventana de editor simple.
// Uso: node scripts/capturas.mjs   (necesita playwright con Chromium; genera images/<id>.png)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHighlighter } from "shiki";
import { chromium } from "playwright";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const { cartas } = JSON.parse(readFileSync(join(raiz, "paletas.json"), "utf8"));

const codigo = `// Una tirada de tres cartas
import { barajar } from "./mazo";

interface Carta {
  numero: number;
  nombre: string;
  invertida?: boolean;
}

@registrar("tirada")
export class Tirada {
  private readonly cartas: Carta[] = [];

  constructor(public pregunta: string, semilla = 42) {
    this.cartas = barajar(MAZO, semilla).slice(0, 3);
  }

  leer(): string {
    const [pasado, presente, futuro] = this.cartas;
    return \`\${pasado.nombre} → \${presente.nombre} → \${futuro.nombre}\`;
  }
}

const MAZO: Carta[] = [{ numero: 18, nombre: "La Luna" }, { numero: 19, nombre: "El Sol" }];
console.log(new Tirada("¿Qué viene?").leer(), 0x1f2a5c, true);
`;

const temas = cartas.map((p) => JSON.parse(readFileSync(join(raiz, "themes", `${p.id}-color-theme.json`), "utf8")));
const resaltador = await createHighlighter({ themes: temas, langs: ["typescript"] });
mkdirSync(join(raiz, "images"), { recursive: true });

const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 860, height: 600 }, deviceScaleFactor: 2 });
for (const [i, p] of cartas.entries()) {
  const t = temas[i];
  const c = t.colors;
  const html = resaltador.codeToHtml(codigo, { lang: "typescript", theme: t.name });
  const lineas = codigo.split("\n").length - 1;
  const numeros = Array.from({ length: lineas }, (_, n) => `<div${n === 13 ? ' class="act"' : ""}>${n + 1}</div>`).join("");
  const pagina_html = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;font:13px/1.55 "JetBrains Mono","DejaVu Sans Mono",monospace;background:${c["titleBar.activeBackground"]}}
    .ventana{display:grid;grid-template-columns:46px 170px 1fr;grid-template-rows:30px 1fr 24px;height:600px}
    .titulo{grid-column:1/4;background:${c["titleBar.activeBackground"]};color:${c["titleBar.activeForeground"]};display:flex;align-items:center;justify-content:center;font:12px system-ui;border-bottom:1px solid ${c["titleBar.border"]}}
    .actividad{background:${c["activityBar.background"]};border-right:1px solid ${c["sideBar.border"]};padding-top:10px}
    .actividad i{display:block;width:22px;height:22px;margin:0 auto 18px;border-radius:5px;background:${c["activityBar.inactiveForeground"]};opacity:.5}
    .actividad i:first-child{background:${c["activityBar.foreground"]};opacity:1}
    .lateral{background:${c["sideBar.background"]};color:${c["sideBar.foreground"]};border-right:1px solid ${c["sideBar.border"]};font:12px system-ui;padding:8px 0}
    .lateral b{display:block;color:${c["sideBarTitle.foreground"]};font-size:11px;letter-spacing:.08em;padding:0 12px 8px}
    .lateral div{padding:3px 12px}.lateral .sel{background:${c["list.activeSelectionBackground"]}}
    .lateral .mod{color:${c["gitDecoration.modifiedResourceForeground"]}}.lateral .nuevo{color:${c["gitDecoration.untrackedResourceForeground"]}}
    .editor{background:${c["editor.background"]};display:flex;flex-direction:column;overflow:hidden}
    .pestanas{display:flex;background:${c["editorGroupHeader.tabsBackground"]};font:12px system-ui}
    .pestanas span{padding:8px 14px;color:${c["tab.inactiveForeground"]}}
    .pestanas .activa{background:${c["tab.activeBackground"]};color:${c["tab.activeForeground"]};box-shadow:inset 0 2px ${c["tab.activeBorderTop"]}}
    .cuerpo{display:flex;padding-top:6px}
    .numeros{color:${c["editorLineNumber.foreground"]};text-align:right;padding:0 14px 0 10px;user-select:none}
    .numeros .act{color:${c["editorLineNumber.activeForeground"]}}
    pre{margin:0;background:transparent!important;flex:1} code{font:inherit}
    pre .line:nth-child(14){background:${c["editor.lineHighlightBackground"]};display:inline-block;width:100%}
    .estado{grid-column:1/4;background:${c["statusBar.background"]};color:${c["statusBar.foreground"]};border-top:1px solid ${c["statusBar.border"]};display:flex;gap:18px;align-items:center;padding:0 10px;font:11px system-ui}
    .estado .r{background:${c["statusBarItem.remoteBackground"]};color:${c["statusBarItem.remoteForeground"]};padding:0 8px;height:100%;display:flex;align-items:center;margin-left:-10px}
  </style><div class="ventana">
    <div class="titulo">tirada.ts — ${t.name}</div>
    <div class="actividad"><i></i><i></i><i></i><i></i></div>
    <div class="lateral"><b>EXPLORADOR</b><div>▾ src</div><div class="sel">　tirada.ts</div><div class="mod">　mazo.ts</div><div class="nuevo">　cartas.json</div><div>　README.md</div></div>
    <div class="editor"><div class="pestanas"><span class="activa">tirada.ts</span><span>mazo.ts</span></div>
      <div class="cuerpo"><div class="numeros">${numeros}</div>${html}</div></div>
    <div class="estado"><span class="r">⌁ arcanos</span><span>main ✓</span><span>TypeScript</span><span style="margin-left:auto">Ln 14, Col 5</span></div>
  </div>`;
  await pagina.setContent(pagina_html);
  await pagina.screenshot({ path: join(raiz, "images", `${p.id}.png`) });
  console.log("captura", p.id);
}
await navegador.close();
