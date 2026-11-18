/**
 * **100 · O-3 del dictamen legal (18-nov-2026): los Términos dicen el «Descuento de bienvenida» que da Camila.** Sustituye a la
 * prueba de los 48 minutos (80 r3, BAJO-6): el Código de descuento de 48 minutos deja de ofrecerse y su lugar lo ocupa el Código de
 * bienvenida, de 72 h. Camila enlaza `certiveh.co/terminos-y-condiciones#descuento-de-bienvenida`: el ancla tiene que existir, y la
 * cláusula, decir lo mismo que Camila (72 h, un solo pago, no se acumula, el IVA sobre lo descontado, la gracia de 15 min).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const tyc = readFileSync(new URL('../src/pages/terminos-y-condiciones.astro', import.meta.url), 'utf8');
const vigencia = readFileSync(new URL('../src/lib/vigencia-de-los-codigos.ts', import.meta.url), 'utf8');

test('🔴 el ancla que enlaza Camila existe, una sola vez, en el párrafo del descuento', () => {
  assert.equal(tyc.split('id="descuento-de-bienvenida"').length - 1, 1);
  assert.match(tyc, /<p id="descuento-de-bienvenida"><strong>Descuento de bienvenida\.<\/strong> Desde el \{VIGENTE_DESDE_LA_BIENVENIDA\}/);
});

test('🔴 la cláusula dice lo que dice Camila: 72 h, la gracia, un solo pago, no se acumula, el IVA sobre lo descontado, sin la UPME', () => {
  const i = tyc.indexOf('id="descuento-de-bienvenida"');
  const clausula = tyc.slice(i, tyc.indexOf('</div>', i));
  for (const dice of [
    'setenta y dos (72) horas desde que se ofrece',
    'hasta quince (15) minutos después',
    'Sirve en un solo pago y no se acumula con otros códigos',
    'El IVA se liquida sobre la tarifa ya descontada',
    'No se aplica al valor que cobra la UPME',
    'personal e intransferible',
    'el Operador de la Plataforma respetará el descuento',
    'Ningún Usuario paga más que la tarifa publicada',
  ]) assert.ok(clausula.includes(dice), dice);
});

test('🔴 la definición es la del Código de bienvenida; el de 48 minutos solo queda en la transición', () => {
  assert.match(tyc, /<strong>Código de bienvenida:<\/strong> El código personal[^<]*Empieza por «CV» y vale durante setenta y dos \(72\) horas desde que se ofrece\./);
  assert.doesNotMatch(tyc, /<strong>Código de descuento de 48 minutos:<\/strong>/);
  assert.doesNotMatch(tyc, /<strong>Beneficios personales\.<\/strong>/);
  assert.equal(tyc.split('48 minutos').length - 1, 1, 'solo en «Los Códigos de descuento de 48 minutos asignados antes del …»');
});

test('🔴 su fecha va aparte y, sin fijar, la guarda impide publicar', () => {
  assert.match(vigencia, /export const VIGENTE_DESDE_LA_BIENVENIDA: string = PENDIENTE_DE_FIJAR;/);
  assert.match(tyc, /laGuardaDeLaVigencia\(process\.env, laVigenciaDeLaBienvenidaEstaPendiente\(\), 'VIGENTE_DESDE_LA_BIENVENIDA'\)/);
});
