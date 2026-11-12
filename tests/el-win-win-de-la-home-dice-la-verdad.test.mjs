/**
 * **80 r2 · M-3, BAJO-9 y BAJO-12 de la auditoría de pantalla: el Win Win de la home dice la verdad.** La comisión se paga UNA
 * vez, por el PRIMER trámite de cada amigo (Anexo A num. 7), sobre su tarifa antes de IVA y sin la tasa de la UPME; las cifras
 * del paquete llevan «al menos» (la Devolución de IVA sube con el valor del vehículo); el beneficio se nombra entero; y «Tu saldo
 * no vence» lleva el matiz del Anexo A num. 10. Se lee la fuente de la sección (el build la pinta tal cual: comprobado en
 * `dist/index.html` con `PERMITIR_VIGENCIA_PENDIENTE=1 npm run build`).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const fuente = readFileSync(new URL('../src/app/components/CertiVehLandingComplete.tsx', import.meta.url), 'utf8');
const ww = fuente.slice(fuente.indexOf('function WinWin()'), fuente.indexOf('function WinWin()') + 6000);

test('🔴 la comisión, del primer trámite de cada amigo, antes de IVA y sin la tasa de la UPME', () => {
  assert.match(ww, /title: `Gana el \$\{PCT_COMISION_DEL_REFERIDOR\} % del primer trámite de cada amigo`/);
  assert.match(ww, /Cuando tu amigo pague su primer trámite, ganas el \$\{PCT_COMISION_DEL_REFERIDOR\} % de su tarifa antes de IVA \(sin la tasa de la UPME\)/);
  assert.match(ww, /ganas el \{PCT_COMISION_DEL_REFERIDOR\} % de su primer trámite cuando pague/);
  assert.doesNotMatch(ww, /% de su trámite|del valor de su trámite|de cada trámite/);
});

test('🔴 «al menos» en las cifras del paquete y el beneficio con su forma', () => {
  assert.match(ww, /Devolución de IVA \(5% del valor del vehículo\) son al menos \$\{formatoDelPortal\(descuentoPaquete\)\} menos/);
  assert.match(ww, /son al menos \$\{formatoDelPortal\(comisionPaquete\)\} para ti/);
});

test('🔴 el saldo no vence, con el matiz del Anexo A num. 10', () => {
  assert.match(ww, /Tu saldo no vence mientras el programa siga activo; si terminara, tendrías dos meses para retirarlo\./);
  assert.doesNotMatch(ww, /Tu saldo no vence\. /);
});

test('sin guion largo en la sección', () => {
  assert.doesNotMatch(ww.replace(/\/\/.*$/gm, ''), /—/);
});
