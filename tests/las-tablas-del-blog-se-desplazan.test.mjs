// Toda tabla de un artículo del blog va dentro de `.table-wrap` (BlogLayout: overflow-x: auto). Sin él, una tabla de
// tres columnas con cifras ensancha la página entera en el celular: a 360 px, /blog/flotas-… se desplazaba 26 px de
// lado (3-nov-2026). El conjunto sale del árbol, no de una lista escrita a mano.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const dir = new URL('../src/pages/blog/', import.meta.url);
const paginas = readdirSync(dir).filter((f) => f.endsWith('.astro'));

test('cada <table> del blog está dentro de .table-wrap', () => {
  assert.ok(paginas.length >= 15, `solo ${paginas.length} páginas: el barrido no llega a la carpeta`);
  let tablas = 0;
  const sueltas = [];
  for (const f of paginas) {
    const s = readFileSync(new URL(f, dir), 'utf8');
    for (const m of s.matchAll(/<table\b/g)) {
      tablas++;
      if (!/<div class="table-wrap">\s*$/.test(s.slice(0, m.index))) sueltas.push(`${f} @${m.index}`);
    }
  }
  assert.ok(tablas >= 21, `solo ${tablas} tablas: el barrido no las encuentra`);
  assert.deepEqual(sueltas, []);
});
