/**
 * **80 r3 · BAJO-6 de pantalla: el nombre definido y el texto dicen lo mismo del plazo.** «Código de descuento de 48 minutos»
 * fija 48 minutos; la definición y el art. XXVIII ya no remiten a «el plazo informado al asignarlo»: dicen los 48 minutos y los
 * 15 de gracia del pago iniciado. Lo que se informa al asignarlo es la hora exacta en que vence.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const tyc = readFileSync(new URL('../src/pages/terminos-y-condiciones.astro', import.meta.url), 'utf8');

test('🔴 la definición dice los 48 minutos y la gracia, como el art. XXVIII', () => {
  assert.match(tyc, /<strong>Código de descuento de 48 minutos:<\/strong>[^<]*dentro de los cuarenta y ocho \(48\) minutos siguientes a su asignación; un pago iniciado dentro de ese plazo puede completarse hasta quince \(15\) minutos después de vencido\.<\/li>/);
  assert.match(tyc, /<strong>Beneficios personales\.<\/strong>[^<]*cuarenta y ocho \(48\) minutos siguientes a su asignación\. Un pago iniciado dentro de ese plazo puede completarse hasta quince \(15\) minutos después de vencido\. Su valor, los servicios a los que aplica y la hora exacta en que vence se informan en la Plataforma al asignarlo\.<\/p>/);
  assert.doesNotMatch(tyc, /plazo informado al asignarlo|y el plazo se informan/);
});
