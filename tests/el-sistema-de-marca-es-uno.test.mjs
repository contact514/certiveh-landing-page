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
  'SISTEMA.md': '7cdab3a2f9757190ea5d089eaa76daf46c0398837f6187da66ecac5840a26b6b',
  'tokens.json': '01ba1cb2cd4491ebb4a10c721bdb8839aa84e513026c2bce6a765fc1a67a8ad8',
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
  for (const paso of ['display', 'head', 'lead', 'body', 'small']) assert.equal(v(`--cv-${paso}`), tokens.tipo[paso].css, `--cv-${paso}`);
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
