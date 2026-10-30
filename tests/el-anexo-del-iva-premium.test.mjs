/**
 * **El anexo de T&C del IVA Premium (ESPEC-PREMIUM §9), publicado donde el checkout lo enlaza.**
 *
 * La casilla del checkout del portal hace aceptar «Condiciones de la Devolución de IVA Premium», con el enlace
 * `https://certiveh.co/terminos-y-condiciones#iva-premium` (`el-iva-premium-textos.ts`, que el portal fija con su
 * propio test). Encender el premium exige que ESE ancla exista: aquí se lee el fuente y, si el build ya corrió, el HTML.
 * Lo que se fija son las decisiones de Julian que el texto tiene que decir, y que no diga lo que no debe.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const FUENTE = readFileSync(new URL('../src/pages/terminos-y-condiciones.astro', import.meta.url), 'utf8');
const ENLACE_DEL_CHECKOUT = 'https://certiveh.co/terminos-y-condiciones#iva-premium';
const ancla = ENLACE_DEL_CHECKOUT.split('#')[1];
const plano = (t) => t.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
const inicio = FUENTE.indexOf(`id="${ancla}"`);
const fin = FUENTE.indexOf('<!-- /tc-container IVA Premium -->');
const ANEXO = plano(FUENTE.slice(inicio, fin));

test('el ancla del checkout existe UNA vez, en la cabecera del anexo, DESPUÉS del anexo de IVA, y el índice la enlaza', () => {
  assert.equal(FUENTE.split(`id="${ancla}"`).length - 1, 1);
  assert.match(FUENTE, /<div class="tc-anexo-header-block" id="iva-premium">/);
  assert.ok(inicio > FUENTE.indexOf('<!-- /tc-container IVA -->'), 'va tras el anexo de IVA');
  assert.ok(fin > inicio, 'el anexo se cierra');
  assert.match(FUENTE, /<a href="#iva-premium" class="tc-index-item">/);
});

test('las siete secciones, con el marcado del anexo de IVA', () => {
  const nums = [...FUENTE.slice(inicio, fin).matchAll(/<div class="tc-section-num">([IVX]+)<\/div>/g)].map((m) => m[1]);
  assert.deepEqual(nums, ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']);
});

test('dice las decisiones de Julian: llamada por video (revisar su caso y sus dudas), expediente impreso en carpeta, reembolso de la mitad del valor adicional efectivamente pagado, al aliado si pagó él', () => {
  for (const frase of [
    'Llamada por video con un especialista',
    'para revisar su caso y resolver sus dudas sobre la solicitud de devolución',
    'en una carpeta del Operador de la Plataforma, enviada a la dirección en Colombia',
    'Se entiende por «valor adicional efectivamente pagado»',
    'por causa que le sea imputable, o si la gestión de la devolución termina antes de poder prestarlo',
    'reembolsará la mitad del valor adicional efectivamente pagado por cada servicio no prestado, con su IVA',
    'cuando la pagó un aliado comercial, a ese aliado',
    'ni el envío para el que no indique la dirección',
    'no supera la devolución estimada del vehículo',
    'Versión del 30 de octubre de 2026',
  ]) assert.ok(ANEXO.includes(frase), frase);
});

test('DOS servicios complementarios y ninguna «línea directa» (decisión de Julian, 30-oct-2026: el WhatsApp es de todos los clientes)', () => {
  const iii = FUENTE.slice(FUENTE.indexOf('<div class="tc-section-num">III</div>', inicio), FUENTE.indexOf('<div class="tc-section-num">IV</div>', inicio));
  assert.equal(iii.split('<li>').length - 1, 2, 'dos servicios en la sección III');
  assert.doesNotMatch(ANEXO, /l[ií]nea directa|tercera parte|7:00 a\. m\.|bienvenida|obsequio|regalo|una nota/i);
  assert.doesNotMatch(ANEXO, /mejor resultado|mayor probabilidad/i, 'el premium no promete resultado');
});

test('no promete lo que no se presta ni usa palabras prohibidas', () => {
  assert.ok(ANEXO.includes('no incluye radicación presencial, asistencia a citas, representación del Usuario ante la DIAN ni visitas a domicilio'));
  assert.doesNotMatch(ANEXO, /—|cortes[ií]a|\bkit\b/i);
  assert.doesNotMatch(ANEXO, /\$\s?\d/, 'el anexo no lleva cifras: la tarifa la informa la Plataforma');
});

test('la cláusula XII del anexo de IVA remite al del Premium', () => {
  assert.ok(FUENTE.includes('Cuando el Usuario contrate la modalidad Devolución de IVA Premium, la tarifa será la informada para esa modalidad, conforme a su Anexo.'));
});

test('si el build ya corrió, el HTML publicado lleva el ancla', { skip: !existsSync(new URL('../dist/terminos-y-condiciones/index.html', import.meta.url)) && !existsSync(new URL('../dist/terminos-y-condiciones.html', import.meta.url)) }, () => {
  const ruta = existsSync(new URL('../dist/terminos-y-condiciones/index.html', import.meta.url)) ? '../dist/terminos-y-condiciones/index.html' : '../dist/terminos-y-condiciones.html';
  const html = readFileSync(new URL(ruta, import.meta.url), 'utf8');
  assert.match(html, /id="iva-premium"/);
});

test('el anexo de IVA (30-oct-2026, Julian): los requerimientos y las subsanaciones de la DIAN van incluidos, sin costo; lo que no da la naturaleza fiscal del Usuario, es suyo', () => {
  const ini = FUENTE.indexOf('Términos y Condiciones del Servicio de Gestión de la Devolución del IVA</div>');
  const IVA = plano(FUENTE.slice(ini, FUENTE.indexOf('<!-- /tc-container IVA -->')));
  for (const frase of [
    'preparará y gestionará la respuesta o la subsanación y, cuando se requiera, la nueva radicación de la solicitud una vez subsanada',
    'sin costo adicional para el Usuario',
    'firmar y remitir desde sus propios canales lo que le corresponda, toda vez que la DIAN solo lo recibe del contribuyente',
    'por la naturaleza fiscal del Usuario o por las particularidades de su caso, incluido el incumplimiento de los requisitos legales del beneficio',
    'salvo que se derive de errores u omisiones imputables al Operador de la Plataforma',
    'este reconocerá la devolución del cinco por ciento (5%) del valor pagado',
  ]) assert.ok(IVA.includes(frase), frase);
  assert.doesNotMatch(IVA, /responsabilidad exclusiva del Usuario\.<|La atención oportuna y adecuada de dichos requerimientos es responsabilidad exclusiva del Usuario|podrá generar el cobro de una tarifa adicional/);
});
