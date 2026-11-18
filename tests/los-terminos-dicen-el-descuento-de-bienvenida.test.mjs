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

test('🔴 las dos definiciones: el Código de bienvenida, y el de 48 minutos hasta la fecha del de bienvenida (la flash sigue cubierta hasta que se apague)', () => {
  assert.match(tyc, /<strong>Código de bienvenida:<\/strong> El código personal[^<]*Empieza por «CV» y vale durante setenta y dos \(72\) horas desde que se ofrece\./);
  assert.match(tyc, /<strong>Código de descuento de 48 minutos:<\/strong> Hasta el \{VIGENTE_DESDE_LA_BIENVENIDA\}, el código personal[^<]*cuarenta y ocho \(48\) minutos siguientes a su asignación/);
  assert.match(tyc, /<strong>Beneficios personales\.<\/strong> Hasta el \{VIGENTE_DESDE_LA_BIENVENIDA\}, el Operador de la Plataforma podrá asignar[^<]*Código de descuento de 48 minutos/);
});

test('🔴 lit. a: también en la Plataforma; lit. g: el código no se restablece, sin salvedad', () => {
  assert.ok(tyc.includes('por WhatsApp, por el chat del portal o en la Plataforma y aún no han pagado ningún trámite'));
  assert.ok(tyc.includes('se devuelve lo efectivamente pagado. El código no se restablece.</p>'));
  assert.doesNotMatch(tyc, /salvo que siga vigente/);
});

test('🔴 el anexo del IVA: el Código de bienvenida desde su fecha, en cualquiera de sus modalidades, incluida la Premium', () => {
  assert.ok(tyc.includes('Desde el {VIGENTE_DESDE_LA_BIENVENIDA}, le es aplicable también el Código de bienvenida, en cualquiera de sus modalidades, incluida la Premium'));
});

test('🔴 su fecha va aparte y la guarda la mira (sin fijar, impide publicar; fijada, esta prueba sigue en verde)', () => {
  assert.match(vigencia, /export const VIGENTE_DESDE_LA_BIENVENIDA: string = (PENDIENTE_DE_FIJAR|'[^']+');/);
  assert.match(vigencia, /export const laVigenciaDeLaBienvenidaEstaPendiente = \(\): boolean => VIGENTE_DESDE_LA_BIENVENIDA === PENDIENTE_DE_FIJAR;/);
  assert.match(tyc, /laGuardaDeLaVigencia\(process\.env, laVigenciaDeLaBienvenidaEstaPendiente\(\), 'VIGENTE_DESDE_LA_BIENVENIDA'\)/);
});
