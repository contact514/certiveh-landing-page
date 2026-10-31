/**
 * **Las calculadoras y las cifras de la landing, con la tarifa EXPLÍCITA** (ajuste de precios, lote 4; ESPEC §5 y §7.4).
 * Sin reloj: se pasa la fila T2 (la de hoy) o T3 (la nueva). `node --test tests/` (lo corre `pnpm test`).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tarifaPorId, TARIFAS } from '../src/lib/tipos-de-activo.ts';
import { cotizacionDeLaHome, cotizacionDeGas, preciosDesde, descripcionDeGas, tasaUpme } from '../src/lib/precios-de-la-landing.ts';
import { SHA_TIPOS_DE_ACTIVO, preciosProhibidos, preciosViejosEn, preciosDeLosOffers, derivadasProhibidas, derivadasViejasEn } from '../scripts/guarda-de-la-tarifa.mjs';
import * as MODULO from '../src/lib/tipos-de-activo.ts';

const T2 = tarifaPorId('desde-2026-08-04');
const T3 = tarifaPorId('ajuste-oct-2026');
const VIEJAS = ['599.990', '499.990', '899.990', '113.998', '713.988', '594.988'];

test('la calculadora de la home con T3: 494.000 + IVA 93.860; con el IVA en paquete, 606.000 + 115.140', () => {
  const sin = cotizacionDeLaHome(120_000_000, false, T3);
  assert.deepEqual([sin.costoUPME, sin.honorariosBase, sin.ivaServicio, sin.costoTotal], [701_812, 494_000, 93_860, 1_289_672]);
  const con = cotizacionDeLaHome(120_000_000, true, T3);
  assert.deepEqual([con.honorariosIvaRefund, con.ivaIvaRefund, con.costoTotal], [606_000, 115_140, 2_010_812]);
  // El tramo del IVA por encima de $200M (§7.4): 300M → 909.000.
  assert.equal(cotizacionDeLaHome(300_000_000, true, T3).honorariosIvaRefund, 909_000);
});

test('…y con T2 da lo de siempre (el oráculo de hoy no se mueve)', () => {
  assert.equal(cotizacionDeLaHome(120_000_000, false, T2).costoTotal, 701_812 + 599_990 + 113_998);
  assert.equal(cotizacionDeLaHome(300_000_000, true, T2).honorariosIvaRefund, 750_000);
});

test('la tasa UPME es la del portal (oráculo de precio-veh-no-se-mueve)', () => {
  for (const [v, tasa] of [[10e6, 62_849], [20e6, 178_072], [50e6, 350_906], [100e6, 701_812], [200e6, 756_292], [300e6, 958_792], [500e6, 1_363_792], [1e9, 2_376_292]]) {
    assert.equal(tasaUpme(v), tasa, String(v));
  }
});

test('la calculadora de gas con T3: §7.4 al peso', () => {
  for (const [v, h] of [[120e6, 880_000], [150_000_834, 880_010], [250e6, 1_480_000], [300e6, 1_780_000], [600e6, 2_680_000], [1e9, 3_080_000]]) {
    assert.equal(cotizacionDeGas(v, T3).honorariosBase, h, String(v));
  }
  assert.equal(cotizacionDeGas(120e6, T2).honorariosBase, 899_990);
});

test('las cifras «desde» y la descripción de gas con T3 no dicen nada de T2', () => {
  const d = preciosDesde(T3);
  assert.deepEqual(d.pesos, { certificado: '$494.000', ivaPaquete: '$606.000', ivaSuelto: '$796.000', gas: '$880.000' });
  const textos = JSON.stringify(d) + descripcionDeGas(T3);
  for (const v of VIEJAS) assert.ok(!textos.includes(v), v);
  assert.match(descripcionDeGas(T3), /^Desde \$880\.000 COP \+ IVA para inversiones de hasta \$150M\. Si vale más, a esos \$880\.000 se les suma el 0,6% de la parte entre \$150M y \$300M/);
  assert.ok(!descripcionDeGas(T3).includes('vehículo'));
});

test('la guarda del build: con T2 vigente prohíbe las cifras de T3 y al revés, y caza y perdona lo que debe', () => {
  const conT2 = preciosProhibidos(TARIFAS, T2);
  for (const p of [494_000, 606_000, 796_000, 880_000]) assert.ok(conT2.includes(p), String(p));
  assert.ok(!conT2.includes(599_990), 'T1 y T2 comparten la tramitación: no se prohíbe');
  const conT3 = preciosProhibidos(TARIFAS, T3);
  for (const p of [599_990, 499_990, 899_990]) assert.ok(conT3.includes(p), String(p));
  assert.deepEqual(preciosViejosEn('<p>Desde $599.990 + IVA</p>', conT3), ['599.990']);
  assert.deepEqual(preciosViejosEn('{"price": "599990"}', conT3), ['599990']);
  assert.deepEqual(preciosViejosEn('<p>$494.000 + IVA; tasa $1.599.990; ref 15999901</p>', conT3), []);
  assert.deepEqual(preciosDeLosOffers('<script type="application/ld+json">{"offers":{"price":"494000"}}</script>'), [494_000]);
});

/**
 * El portal contra el que se compara la quinta copia: el de la PUNTA de la cadena de precios, nunca un worktree intermedio
 * (l3, l4…), que se queda con la vigencia vieja cuando el paso E del guion la fija solo en la punta. Medido el 30-oct-2026:
 * buscaba primero `../../l4` y E salía rojo con l4 en 2099 y l5 bien fijado. Orden: `PORTAL_HERMANO` (lo fija el guion),
 * `<wt>/l5` (la punta), y `certiveh-portal-login` al lado de la landing (el checkout de main). Si `PORTAL_HERMANO` está
 * puesto y no tiene la copia, es un fallo, no un «se salta».
 */
export function elPortalHermano(landing, env = process.env) {
  const copia = (raiz) => join(raiz, 'src/lib/tipos-de-activo.ts');
  if (env.PORTAL_HERMANO) {
    const p = copia(resolve(env.PORTAL_HERMANO));
    if (!existsSync(p)) throw new Error(`PORTAL_HERMANO=${env.PORTAL_HERMANO} no tiene src/lib/tipos-de-activo.ts`);
    return p;
  }
  for (const raiz of [resolve(landing, '../l5'), resolve(landing, '../certiveh-portal-login')]) if (existsSync(copia(raiz))) return copia(raiz);
  return null;
}
const LA_LANDING = resolve(fileURLToPath(new URL('..', import.meta.url)));

test('la quinta copia es la de los repos, y la guarda tiene su huella', () => {
  const texto = readFileSync(new URL('../src/lib/tipos-de-activo.ts', import.meta.url), 'utf8');
  assert.equal(createHash('sha256').update(texto).digest('hex'), SHA_TIPOS_DE_ACTIVO);
  // Si el portal de la punta está al lado, byte a byte igual.
  const p = elPortalHermano(LA_LANDING);
  if (p) assert.equal(readFileSync(p, 'utf8'), texto, p);
});

test('el portal hermano es el de la PUNTA (l5) y no un worktree intermedio (l4): con l4 en 2099 y l5 fijado, pasa; con l5 distinto, falla', () => {
  const wt = mkdtempSync(join(tmpdir(), 'portal-hermano-'));
  try {
    const escribir = (dir, t) => { mkdirSync(join(wt, dir, 'src/lib'), { recursive: true }); writeFileSync(join(wt, dir, 'src/lib/tipos-de-activo.ts'), t); };
    const FIJADA = "export const VIGENCIA_DEL_AJUSTE_OCT_2026 = '2026-11-01T00:00:00-05:00';\n";
    escribir('l4landing', FIJADA);
    escribir('l4', "export const VIGENCIA_DEL_AJUSTE_OCT_2026 = '2099-01-01T00:00:00-05:00';\n");
    escribir('l5', FIJADA);
    const landing = join(wt, 'l4landing');
    const igual = (env = {}) => readFileSync(elPortalHermano(landing, env), 'utf8') === FIJADA;
    assert.equal(elPortalHermano(landing, {}), join(wt, 'l5', 'src/lib/tipos-de-activo.ts'));
    assert.ok(igual(), 'con l4 en 2099 y l5 fijado tiene que pasar');
    escribir('l5', "export const VIGENCIA_DEL_AJUSTE_OCT_2026 = '2099-01-01T00:00:00-05:00';\n");
    assert.ok(!igual(), 'con l5 distinto tiene que fallar');
    // PORTAL_HERMANO manda, y si apunta a un sitio sin la copia, es un fallo.
    assert.equal(elPortalHermano(landing, { PORTAL_HERMANO: join(wt, 'l4') }), join(wt, 'l4', 'src/lib/tipos-de-activo.ts'));
    assert.throws(() => elPortalHermano(landing, { PORTAL_HERMANO: join(wt, 'no-hay') }), /no tiene/);
  } finally { rmSync(wt, { recursive: true, force: true }); }
});

test('la guarda caza las cifras DERIVADAS de otra tarifa (AUDITORIA-LOTE4-R1, M1) y no las de la vigente', () => {
  const conT3 = derivadasProhibidas(TARIFAS, T3, MODULO);
  const html = '<p>IVA $113.998, total $713.988, ~$595K, el 0,25 % del valor, y 0,3% del gas</p>';
  assert.deepEqual(derivadasViejasEn(html, conT3).sort(), ['0,25%', '113.998', '595K', '713.988'].sort());
  // Lo de la tarifa vigente pasa: su IVA, su total, «~$721K» y sus porcentajes (el 0,3 % de gas es de T3 también).
  assert.deepEqual(derivadasViejasEn('<p>IVA $93.860, $587.860, ~$721K, el 0,303% y el 0,3%</p>', conT3), []);
  // Y antes de T, al revés: lo de la nueva no puede salir.
  const conT2 = derivadasProhibidas(TARIFAS, T2, MODULO);
  assert.deepEqual(derivadasViejasEn('<p>$587.860, ~$721K, 0,303%</p>', conT2).sort(), ['0,303%', '587.860', '721K'].sort());
  assert.deepEqual(derivadasViejasEn('<p>$713.988, ~$595K, 0,25%</p>', conT2), []);
});

