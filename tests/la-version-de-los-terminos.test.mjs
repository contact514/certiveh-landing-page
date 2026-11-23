/**
 * **Los Términos 3.0 (anexo del IVA 2.0), publicados con su versión y su fecha** (23-nov-2026).
 *
 * La versión y la fecha viven en `src/lib/version-de-los-terminos.ts`; la fecha en ISO es la `TERMS_VERSION` que guarda
 * el portal al aceptar. Aquí se fija que la página las pinta, que lleva las anclas nuevas y las cuatro decisiones de
 * Julian del 23-nov, y que no se cuela nada del borrador para los abogados (marcas, comentarios, «borrador»).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const FUENTE = readFileSync(new URL('../src/pages/terminos-y-condiciones.astro', import.meta.url), 'utf8');
const VERSION = readFileSync(new URL('../src/lib/version-de-los-terminos.ts', import.meta.url), 'utf8');
const HTML_URL = new URL('../dist/terminos-y-condiciones/index.html', import.meta.url);
const plano = (t) => t.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
const valor = (nombre) => VERSION.match(new RegExp(`export const ${nombre} = '([^']+)'`))?.[1];

test('la versión y la fecha: 3.0 y 2.0, y la ISO del portal es la misma fecha', () => {
  assert.equal(valor('VERSION_DE_LOS_TERMINOS'), '3.0');
  assert.equal(valor('VERSION_DEL_ANEXO_DEL_IVA'), '2.0');
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const [a, m, d] = valor('TERMINOS_VIGENTES_DESDE_ISO').split('-').map(Number);
  assert.equal(valor('TERMINOS_VIGENTES_DESDE'), `${d} de ${meses[m - 1]} de ${a}`);
});

test('la cabecera y la del anexo del IVA pintan la versión y la fecha', () => {
  assert.match(FUENTE, /<p class="tc-date">Versión \{VERSION_DE_LOS_TERMINOS\} · Fecha de entrada en vigencia: \{TERMINOS_VIGENTES_DESDE\}<\/p>/);
  const iva = FUENTE.slice(FUENTE.indexOf('id="devolucion-iva"'), FUENTE.indexOf('<!-- /tc-container IVA -->'));
  assert.match(iva, /Versión \{VERSION_DEL_ANEXO_DEL_IVA\} &nbsp;\|&nbsp; Fecha de entrada en vigencia: \{TERMINOS_VIGENTES_DESDE\}/);
});

test('las anclas nuevas existen una vez y el índice las enlaza', () => {
  for (const id of ['vi-b', 'xii-a', 'textos-de-la-interfaz']) {
    assert.equal(FUENTE.split(`id="${id}"`).length - 1, 1, id);
    assert.ok(FUENTE.includes(`<a href="#${id}" class="tc-index-item">`), id);
  }
});

test('cada entrada nueva del índice dice lo mismo que el título de su sección', () => {
  for (const id of ['vi-b', 'xii-a', 'textos-de-la-interfaz']) {
    const indice = FUENTE.match(new RegExp(`<a href="#${id}" class="tc-index-item">([^<]+)</a>`))[1];
    const seccion = FUENTE.slice(FUENTE.indexOf(`id="${id}"`));
    const titulo = seccion.match(/<h2 class="tc-section-title">([^<]+)<\/h2>/)[1];
    const num = seccion.match(/<div class="tc-section-num">([^<]+)<\/div>/);
    if (id === 'textos-de-la-interfaz') assert.equal(indice, titulo);
    else assert.ok(indice.startsWith(`${num[1]}. `), indice);
  }
});

test('las cuatro decisiones de Julian del 23-nov van redactadas', () => {
  const t = plano(FUENTE);
  for (const frase of [
    'Los poderes especiales otorgados al Operador de la Plataforma antes del 6 de octubre de 2026 para suscribir el Formato 010',
    'el Operador de la Plataforma no modificará el documento firmado sin la autorización previa de cada persona que lo firmó',
    'la falta de respuesta no se entiende como autorización',
    'No hay una casilla aparte para los datos escritos a mano',
    'el Operador de la Plataforma reembolsará al Usuario los honorarios pagados por el Servicio de Gestión de la Devolución del IVA',
  ]) assert.ok(t.includes(frase), frase);
});

test('no se cuela nada del borrador de los abogados', () => {
  const textos = [plano(FUENTE)];
  if (existsSync(HTML_URL)) textos.push(plano(readFileSync(HTML_URL, 'utf8')));
  for (const t of textos) {
    assert.doesNotMatch(t, /DECISIÓN DE CERTIVEH|PREGUNTA PARA LOS ABOGADOS|\{\{C:|FECHA POR FIJAR|borrador para revisión/);
  }
});
