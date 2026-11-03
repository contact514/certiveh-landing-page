// El sistema de marca 2026-11 es UNO para todos los proyectos (landing, portal, panel, aliados, marketing).
// El original vive en ~/certiveh/marca-2026-11/ (SISTEMA.md + tokens.json); aquí hay una copia idéntica en
// docs/marca-2026-11/. Este test falla si (a) la copia cambia sin cambiar el original y las otras cuatro copias
// (el SHA fijado abajo es el mismo en las cinco guardas), o (b) marca.css se aparta de los tokens.
// Para cambiar una regla: editar el original, copiarlo a los cinco sitios, actualizar este SHA en las cinco
// guardas y correr `node ~/certiveh/marca-2026-11/comprobar.mjs`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const SHA = {
  'SISTEMA.md': 'fec70bab40e89c354e58d18795b6df29a048e19edaf11d1f6f039ef912927a04',
  'tokens.json': 'f0703f2b483136ee780122f7115ed429c111b3125efb430e3589587fdae632e5',
};
const leer = (p) => readFileSync(new URL(`../${p}`, import.meta.url));

test('la copia del sistema de marca es la del original (mismo SHA en los cinco proyectos)', () => {
  for (const [f, esperado] of Object.entries(SHA)) {
    assert.equal(createHash('sha256').update(leer(`docs/marca-2026-11/${f}`)).digest('hex'), esperado, `docs/marca-2026-11/${f} no es la copia del original`);
  }
});

const tokens = JSON.parse(leer('docs/marca-2026-11/tokens.json'));
const css = leer('src/styles/marca.css').toString();
const v = (nombre) => {
  const m = css.match(new RegExp(`${nombre.replace(/[-]/g, '\\-')}:\\s*([^;]+);`));
  assert.ok(m, `marca.css no define ${nombre}`);
  return m[1].trim();
};
const regla = (sel) => {
  const m = css.match(new RegExp(`\\${sel}\\s*\\{([^}]*)\\}`));
  assert.ok(m, `marca.css no define ${sel}`);
  return m[1];
};

test('marca.css lleva los colores de los tokens', () => {
  const pares = {
    '--cv-bg': 'suelo', '--cv-ink': 'tinta', '--cv-soft': 'secundario', '--cv-tone': 'tono', '--cv-tone-2': 'tono2',
    '--cv-accent': 'accion', '--cv-accent-hover': 'accionAlTocar', '--cv-mint': 'verdeSobreOscuro', '--cv-field': 'campo',
    '--cv-field-2': 'campo2', '--cv-field-soft': 'secundarioSobreOscuro', '--cv-plate': 'placa',
  };
  for (const [variable, token] of Object.entries(pares)) assert.equal(v(variable).toLowerCase(), tokens.color[token].toLowerCase(), variable);
});

test('marca.css lleva la fuente, el radio y la escala de los tokens', () => {
  assert.equal(v('--cv-font'), tokens.fuente.pilaWeb);
  assert.equal(v('--cv-trk'), tokens.fuente.trackingTitulo);
  assert.equal(v('--cv-wh'), String(tokens.fuente.pesoTitulo));
  assert.equal(v('--cv-r'), `${tokens.forma.radioPx}px`);
  for (const paso of ['display', 'head', 'lead', 'intro', 'body', 'small']) assert.equal(v(`--cv-${paso}`), tokens.tipo[paso].css, `--cv-${paso}`);
});

test('la regla de portada (.cv-hero-title / .cv-hero-sub) es la de los tokens', () => {
  const t = regla('.cv-hero-title'), s = regla('.cv-hero-sub'), p = tokens.tipo.portada;
  assert.match(t, /font-size:\s*var\(--cv-display\)/);
  assert.match(t, new RegExp(`line-height:\\s*\\.?${String(p.titulo.interlineado).replace(/^0/, '')}`));
  assert.match(s, /font-size:\s*var\(--cv-lead\)/);
  assert.match(s, new RegExp(`line-height:\\s*${p.entradilla.interlineado}`));
  assert.match(s, new RegExp(`color:\\s*${p.entradilla.colorSobreOscuro}`, 'i'));
  assert.match(s, new RegExp(`margin-top:\\s*${p.entradilla.separacionPx}px`));
  assert.match(s, new RegExp(`max-width:\\s*${p.entradilla.anchoMaxCh}ch`));
});

test('la regla de secciones (.cv-sec-title / .cv-sec-intro / .cv-close-title) es la de los tokens', () => {
  const sec = tokens.tipo.seccion;
  const lh = (n) => new RegExp(`line-height:\\s*\\.?${String(n).replace(/^0/, '')}`);
  const t = regla('.cv-sec-title'), i = regla('.cv-sec-intro'), c = regla('.cv-close-title');
  assert.match(t, new RegExp(`font-size:\\s*var\\(--cv-${sec.titulo.tamano}\\)`));
  assert.match(t, lh(sec.titulo.interlineado));
  assert.match(t, /font-weight:\s*var\(--cv-wh\)/);
  assert.match(i, new RegExp(`font-size:\\s*var\\(--cv-${sec.introduccion.tamano}\\)`));
  assert.match(i, lh(sec.introduccion.interlineado));
  assert.match(i, new RegExp(`max-width:\\s*${sec.introduccion.anchoMaxCh}ch`));
  assert.match(i, new RegExp(`margin-top:\\s*${sec.introduccion.separacionPx}px`));
  assert.match(c, new RegExp(`font-size:\\s*var\\(--cv-${sec.cierre.tamano}\\)`));
  assert.match(c, lh(sec.cierre.interlineado));
});
