/**
 * **80 r2 · BAJO-12: la fecha sin fijar no se publica desde NINGÚN build.** Antes la guarda solo miraba `process.env.VERCEL`:
 * un build local (el que se sube a mano con `vercel deploy --prebuilt`) pintaba «PENDIENTE DE FIJAR» sin avisar. Se ejecuta
 * la guarda real (`laGuardaDeLaVigencia`) y se comprueba que la página la usa y pinta el aviso del borrador.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { laGuardaDeLaVigencia, PERMISO_DEL_BORRADOR, laVigenciaEstaPendiente } from '../src/lib/vigencia-de-los-codigos.ts';

test('con la fecha sin fijar, Vercel falla siempre (también con el permiso del borrador)', () => {
  assert.throws(() => laGuardaDeLaVigencia({ VERCEL: '1' }, true), /falta fijar VIGENTE_DESDE/);
  assert.throws(() => laGuardaDeLaVigencia({ VERCEL: '1', [PERMISO_DEL_BORRADOR]: '1' }, true), /falta fijar VIGENTE_DESDE/);
});

test('🔴 con la fecha sin fijar, el build LOCAL también falla, y dice cómo pedir un borrador', () => {
  assert.throws(() => laGuardaDeLaVigencia({}, true), /no se puede publicar\. Para un borrador local: PERMITIR_VIGENCIA_PENDIENTE=1/);
  assert.throws(() => laGuardaDeLaVigencia({ [PERMISO_DEL_BORRADOR]: 'si' }, true));
});

test('🔴 el borrador local pedido a propósito lleva un aviso visible', () => {
  const g = laGuardaDeLaVigencia({ [PERMISO_DEL_BORRADOR]: '1' }, true);
  assert.match(g.aviso ?? '', /^BORRADOR: la fecha desde la que rigen las condiciones nuevas está pendiente de fijar\./);
});

test('con la fecha fijada, nada (ni falla ni avisa)', () => {
  assert.deepEqual(laGuardaDeLaVigencia({}, false), { aviso: null });
  assert.deepEqual(laGuardaDeLaVigencia({ VERCEL: '1' }, false), { aviso: null });
});

test('la página la usa con process.env y pinta el aviso; ya no depende solo de VERCEL', () => {
  const src = readFileSync(new URL('../src/pages/terminos-y-condiciones.astro', import.meta.url), 'utf8');
  assert.match(src, /const guardaDeLaVigencia = laGuardaDeLaVigencia\(process\.env\);/);
  assert.match(src, /\{guardaDeLaVigencia\.aviso && \(/);
  assert.doesNotMatch(src, /process\.env\.VERCEL && laVigenciaEstaPendiente\(\)/);
  // Hoy la fecha sigue sin fijar (la fija el día de T): lo dice el módulo.
  assert.equal(typeof laVigenciaEstaPendiente(), 'boolean');
});

test('80 r3: el aviso del borrador es UNO, el de los Términos y el de la home', async () => {
  const { AVISO_DEL_BORRADOR } = await import('../src/lib/vigencia-de-los-codigos.ts');
  assert.equal(laGuardaDeLaVigencia({ [PERMISO_DEL_BORRADOR]: '1' }, true).aviso, AVISO_DEL_BORRADOR);
});
