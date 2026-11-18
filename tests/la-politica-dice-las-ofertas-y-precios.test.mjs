/**
 * **100 · O-4 del dictamen legal (18-nov-2026): la Política dice la finalidad de las ofertas y precios** (y el canal de WhatsApp, la
 * autorización de quien escribe por él, su conservación y los encargados nuevos). La versión 2.3 rige desde la misma fecha que el
 * «Descuento de bienvenida» de los Términos, y sin fijarla la guarda impide publicarla.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const p = readFileSync(new URL('../src/pages/politica-de-privacidad.astro', import.meta.url), 'utf8');

test('🔴 la finalidad nueva, el canal, la autorización por conducta inequívoca, la conservación y los encargados', () => {
  for (const dice of [
    '<li>Ofertas y precios: asignar de forma automática, ofrecer y aplicar descuentos personales, que pueden ser distintos entre usuarios',
    'nunca da lugar a un precio mayor que la tarifa publicada',
    '<strong>Datos de contacto por WhatsApp y el chat del portal:</strong>',
    'Estas conversaciones pueden ser atendidas por un asistente de inteligencia artificial',
    'la autorización se obtiene por conducta inequívoca, cuando el titular, informado mediante el aviso de privacidad del canal, continúa la conversación',
    'Los datos de ofertas y precios de que trata el numeral 7.1 se conservan hasta doce (12) meses después del último análisis',
    'Anthropic, PBC (asistente de inteligencia artificial)',
    'Meta Platforms, Inc. (WhatsApp Business)',
  ]) assert.ok(p.includes(dice), dice);
});

test('🔴 la versión 2.3, con la fecha del descuento de bienvenida y su guarda', () => {
  assert.match(p, /Versión 2\.3 · Entrada en vigencia: \{VIGENTE_DESDE_LA_BIENVENIDA\}/);
  assert.match(p, /La presente Política \(versión 2\.3\) entra en vigencia a partir del \{VIGENTE_DESDE_LA_BIENVENIDA\}, y sustituye a la versión 2\.2/);
  assert.match(p, /laGuardaDeLaVigencia\(process\.env, laVigenciaDeLaBienvenidaEstaPendiente\(\), 'VIGENTE_DESDE_LA_BIENVENIDA'\)/);
});
