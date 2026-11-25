/**
 * **La franja de la Black Week se ve solo dentro de la ventana de BLACK20** (25-nov-2026 00:00 al 30-nov 23:59:59,
 * hora de Colombia; `2026-11-25T05:00:00.000Z` incluido, `2026-12-01T05:00:00.000Z` excluido).
 *
 * Corre los MISMOS bytes que van al navegador: `src/scripts/la-franja-de-la-black-week.js` (que el componente incrusta
 * tal cual) y, si hay `dist/` (tras `pnpm build`), el <script> que de verdad quedó en el HTML de la home, con los
 * instantes que le puso el build. Un DOM y un reloj fingidos, lo mínimo que el script toca.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import vm from 'node:vm';
import {
  DESDE_LA_BLACK_WEEK, HASTA_LA_BLACK_WEEK, DESDE_LA_BLACK_WEEK_MS, HASTA_LA_BLACK_WEEK_MS, ENLACE_DE_LA_FRANJA,
} from '../src/lib/la-black-week.ts';

const FUENTE = readFileSync(new URL('../src/scripts/la-franja-de-la-black-week.js', import.meta.url), 'utf8');
const D = DESDE_LA_BLACK_WEEK_MS;
const H = HASTA_LA_BLACK_WEEK_MS;

/** Una página fingida a la hora `ahora` (ms). Devuelve la franja, la variable publicada y cómo mover el reloj. */
function pagina({ ahora, host = 'certiveh.co', search = '', alto = 44, scrollY = 0 } = {}) {
  let reloj = ahora;
  const temporizadores = [];
  const oyentes = {};
  const variables = {};
  const enlace = { href: ENLACE_DE_LA_FRANJA };
  const cuenta = { textContent: '' };
  const franja = { hidden: true, offsetHeight: alto, querySelector: (sel) => (sel === '.cv-bw-cuenta' ? cuenta : sel === 'a[href]' ? enlace : null) };
  const w = {
    Date: { now: () => reloj },
    URLSearchParams,
    location: { hostname: host, search },
    scrollY,
    setTimeout: (fn, ms) => { temporizadores.push({ fn, en: reloj + ms }); return temporizadores.length; },
    clearTimeout: (id) => { if (id) temporizadores[id - 1] = null; },
    requestAnimationFrame: (fn) => fn(),
    addEventListener: (tipo, fn) => { (oyentes[tipo] ||= []).push(fn); },
    document: {
      visibilityState: 'visible',
      getElementById: (id) => (id === 'cv-bw' ? franja : null),
      documentElement: { style: { setProperty: (k, v) => { variables[k] = v; } } },
      addEventListener: (tipo, fn) => { (oyentes[tipo] ||= []).push(fn); },
    },
  };
  return {
    w, franja, enlace, cuenta, variables, oyentes,
    /** Cuántos temporizadores quedan por disparar. */
    pendientes: () => temporizadores.filter(Boolean).length,
    /**
     * Avanza el reloj a `t` y dispara, por orden de vencimiento, los temporizadores vencidos, cada uno EN SU INSTANTE
     * exacto (el navegador puntual: el caso que deja una cuenta un minuto atrás si se programa al milímetro).
     */
    avanzarA(t) {
      for (;;) {
        let i = -1;
        temporizadores.forEach((x, j) => { if (x && x.en <= t && (i < 0 || x.en < temporizadores[i].en)) i = j; });
        if (i < 0) break;
        const { fn, en } = temporizadores[i];
        temporizadores[i] = null;
        reloj = Math.max(reloj, en);
        fn();
      }
      reloj = t;
    },
    /** Dispara solo los temporizadores vencidos cuya función se llama `nombre` (los demás se quedan como están). */
    dispararSolo(nombre, t) {
      reloj = t;
      temporizadores.forEach((x, j) => { if (x && x.en <= t && x.fn.name === nombre) { temporizadores[j] = null; x.fn(); } });
    },
    /** Sin dejar correr los temporizadores (pestaña dormida): solo cambia la hora. */
    cambiarLaHora(t) { reloj = t; },
  };
}

function correr(codigo, p) {
  vm.runInNewContext(codigo, { window: p.w });
}
const conLaFuente = (p) => correr(`${FUENTE}\nlaFranjaDeLaBlackWeek(window, ${D}, ${H});`, p);

test('los instantes son los del portal: 25-nov 00:00 y 1-dic 00:00, hora de Colombia', () => {
  assert.equal(DESDE_LA_BLACK_WEEK, '2026-11-25T05:00:00.000Z');
  assert.equal(HASTA_LA_BLACK_WEEK, '2026-12-01T05:00:00.000Z');
  assert.equal(new Date(D).toLocaleString('es-CO', { timeZone: 'America/Bogota', hour12: false }).replace(/\s/g, ' '), '25/11/2026, 0:00:00');
  assert.equal(new Date(H - 1).toLocaleString('es-CO', { timeZone: 'America/Bogota', hour12: false }).replace(/\s/g, ' '), '30/11/2026, 23:59:59');
  assert.equal(ENLACE_DE_LA_FRANJA, 'https://portal.certiveh.co/?utm_source=landing&utm_campaign=black-week');
});

for (const [nombre, ahora, ve] of [
  ['un día antes', D - 86400000, false],
  ['1 ms antes de empezar', D - 1, false],
  ['justo al empezar (25-nov 00:00)', D, true],
  ['en medio', D + 3 * 86400000, true],
  ['el último milisegundo (30-nov 23:59:59.999)', H - 1, true],
  ['justo al terminar (1-dic 00:00)', H, false],
  ['una semana después', H + 7 * 86400000, false],
]) {
  test(`${nombre}: ${ve ? 'se ve' : 'no se ve'}`, () => {
    const p = pagina({ ahora });
    conLaFuente(p);
    assert.equal(p.franja.hidden, !ve);
    assert.equal(p.variables['--cv-aviso-y'], ve ? '44px' : '0px');
  });
}

test('con la página abierta: se enciende sola al empezar y se apaga sola al terminar', () => {
  const p = pagina({ ahora: D - 2 * 3600000 });
  conLaFuente(p);
  assert.equal(p.franja.hidden, true);
  p.avanzarA(D - 1);
  assert.equal(p.franja.hidden, true);
  p.avanzarA(D);
  assert.equal(p.franja.hidden, false);
  assert.equal(p.variables['--cv-aviso-y'], '44px');
  p.avanzarA(H - 1);
  assert.equal(p.franja.hidden, false);
  p.avanzarA(H);
  assert.equal(p.franja.hidden, true);
  assert.equal(p.variables['--cv-aviso-y'], '0px');
});

test('una pestaña dormida que vuelve el martes la apaga al volver (visibilitychange y pageshow)', () => {
  for (const evento of ['visibilitychange', 'pageshow']) {
    const p = pagina({ ahora: H - 60000 });
    conLaFuente(p);
    assert.equal(p.franja.hidden, false);
    p.cambiarLaHora(H + 3600000);
    for (const fn of p.oyentes[evento]) fn();
    assert.equal(p.franja.hidden, true, evento);
  }
});

test('al bajar, la barra sube con la franja hasta el borde y no pasa de 0', () => {
  const p = pagina({ ahora: D + 1000, alto: 60 });
  conLaFuente(p);
  assert.equal(p.variables['--cv-aviso-y'], '60px');
  p.w.scrollY = 25; for (const fn of p.oyentes.scroll) fn();
  assert.equal(p.variables['--cv-aviso-y'], '35px');
  p.w.scrollY = 500; for (const fn of p.oyentes.scroll) fn();
  assert.equal(p.variables['--cv-aviso-y'], '0px');
});

test('en el anfitrión de un aliado (exotics.) no se enciende', () => {
  const p = pagina({ ahora: D + 1000, host: 'exotics.certiveh.co' });
  conLaFuente(p);
  assert.equal(p.franja.hidden, true);
});

test('el enlace conserva las UTM con que llegó la visita y, si no trae, lleva las de la campaña', () => {
  const sin = pagina({ ahora: D + 1000, search: '?fbclid=abc' });
  conLaFuente(sin);
  assert.equal(sin.enlace.href, ENLACE_DE_LA_FRANJA);
  const con = pagina({ ahora: D + 1000, search: '?utm_source=meta&utm_campaign=bw&x=1' });
  conLaFuente(con);
  assert.equal(con.enlace.href, 'https://portal.certiveh.co/?utm_source=meta&utm_campaign=bw');
});

// ── La cuenta regresiva ──────────────────────────────────────────────────────────────────────────────────────
const MIN = 60000;
const HORA = 60 * MIN;
const DIA = 24 * HORA;
/** Un instante en hora de Colombia (UTC-5, sin horario de verano). */
const col = (iso) => Date.parse(`${iso}-05:00`);

const CUENTAS = [
  ['25-nov 00:00, al empezar', D, 'Termina en 6 d 0 h'],
  ['26-nov 10:00', col('2026-11-26T10:00:00'), 'Termina en 4 d 14 h'],
  ['26-nov 10:00:30 (cuenta por debajo)', col('2026-11-26T10:00:30'), 'Termina en 4 d 13 h'],
  ['sábado 28 a las 23:59 (aún «N d N h»)', col('2026-11-28T23:59:00'), 'Termina en 2 d 0 h'],
  ['sábado 28, último milisegundo', col('2026-11-29T00:00:00') - 1, 'Termina en 2 d 0 h'],
  ['domingo 29 a las 00:00 (mañana, sin contador)', col('2026-11-29T00:00:00'), 'Termina mañana a las 11:59 p. m.'],
  ['domingo 29 a las 15:00', col('2026-11-29T15:00:00'), 'Termina mañana a las 11:59 p. m.'],
  ['domingo 29 a las 23:59', col('2026-11-29T23:59:00'), 'Termina mañana a las 11:59 p. m.'],
  ['domingo 29, último milisegundo', col('2026-11-30T00:00:00') - 1, 'Termina mañana a las 11:59 p. m.'],
  ['lunes 30 a las 00:00 (tope: nunca «24 h»)', col('2026-11-30T00:00:00'), 'Termina hoy en 23 h 59 min'],
  ['lunes 30 a las 00:00:00.001', col('2026-11-30T00:00:00') + 1, 'Termina hoy en 23 h 59 min'],
  ['lunes 30 a las 10:00', col('2026-11-30T10:00:00'), 'Termina hoy en 14 h 0 min'],
  ['lunes 30 a las 10:40', col('2026-11-30T10:40:00'), 'Termina hoy en 13 h 20 min'],
  ['justo 1 h antes', H - HORA, 'Termina hoy en 1 h 0 min'],
  ['menos de 1 h', H - 45 * MIN - 30000, 'Termina en 45 min'],
  ['los últimos segundos', H - 30000, 'Termina en 1 min'],
];
for (const [nombre, ahora, texto] of CUENTAS) {
  test(`la cuenta, ${nombre}: «${texto}»`, () => {
    const p = pagina({ ahora });
    conLaFuente(p);
    assert.equal(p.franja.hidden, false);
    assert.equal(p.cuenta.textContent, texto);
    assert.doesNotMatch(texto, /\d+ s\b|seg/, 'sin segundos');
  });
}

test('«hoy», «mañana» y «N d» van por la FECHA de Colombia, no por las horas que faltan', () => {
  const ctx = {};
  vm.runInNewContext(FUENTE, ctx);
  const cuenta = ctx.cuentaDeLaBlackWeek;
  // Un final que no cae a medianoche (martes 06:00 COL): el lunes a las 23:00 faltan 7 h, pero el final es MAÑANA.
  // (La hora «11:59 p. m.» es la de ESTA campaña, escrita en el texto; aquí solo se prueba el tramo, por fecha.)
  const fin = col('2026-12-01T06:00:00');
  assert.equal(cuenta(col('2026-11-30T23:00:00'), fin), 'Termina mañana a las 11:59 p. m.');
  assert.equal(cuenta(col('2026-12-01T00:30:00'), fin), 'Termina hoy en 5 h 30 min');
  // Y el domingo a las 23:00 faltan 31 h, pero por fecha el final es pasado mañana: cuenta en días.
  assert.equal(cuenta(col('2026-11-29T23:00:00'), fin), 'Termina en 1 d 7 h');
});

test('del domingo al lunes con la página abierta: la frontera nunca enseña «24 h»', () => {
  const p = pagina({ ahora: col('2026-11-29T23:59:30') });
  conLaFuente(p);
  assert.equal(p.cuenta.textContent, 'Termina mañana a las 11:59 p. m.');
  p.avanzarA(col('2026-11-30T00:00:00') + 1);
  assert.equal(p.cuenta.textContent, 'Termina hoy en 23 h 59 min');
});

test('del sábado al domingo y del domingo al lunes, con la página abierta', () => {
  const p = pagina({ ahora: col('2026-11-28T23:58:10') });
  conLaFuente(p);
  assert.equal(p.cuenta.textContent, 'Termina en 2 d 0 h');
  p.avanzarA(col('2026-11-29T00:00:00') + 1);
  assert.equal(p.cuenta.textContent, 'Termina mañana a las 11:59 p. m.');
  p.avanzarA(col('2026-11-29T23:59:59'));
  assert.equal(p.cuenta.textContent, 'Termina mañana a las 11:59 p. m.');
  p.avanzarA(col('2026-11-30T00:01:00') + 1);
  assert.equal(p.cuenta.textContent, 'Termina hoy en 23 h 58 min');
});

test('la cuenta avanza cada minuto, alineada al minuto, y al llegar a cero la franja se apaga sola', () => {
  const p = pagina({ ahora: H - 2 * MIN - 15000 }); // faltan 2 min 15 s
  conLaFuente(p);
  assert.equal(p.cuenta.textContent, 'Termina en 2 min');
  p.avanzarA(H - 2 * MIN - 1);
  assert.equal(p.cuenta.textContent, 'Termina en 2 min', 'no cambia antes del minuto');
  p.avanzarA(H - 2 * MIN);
  assert.equal(p.cuenta.textContent, 'Termina en 2 min', 'en el milisegundo exacto aún no ha cruzado');
  p.avanzarA(H - 2 * MIN + 1);
  assert.equal(p.cuenta.textContent, 'Termina en 1 min', 'cambia 1 ms después de cruzar el minuto, aunque el temporizador sea puntual');
  p.avanzarA(H - 1);
  assert.equal(p.franja.hidden, false);
  p.avanzarA(H);
  assert.equal(p.franja.hidden, true, 'a cero se oculta sin recargar');
  assert.equal(p.cuenta.textContent, '', 'y la cuenta queda vacía');
  assert.equal(p.variables['--cv-aviso-y'], '0px');
  assert.equal(p.pendientes(), 0, 'no deja temporizadores corriendo');
});

test('de horas a minutos sin recargar', () => {
  const p = pagina({ ahora: H - HORA - 90000 });
  conLaFuente(p);
  assert.equal(p.cuenta.textContent, 'Termina hoy en 1 h 1 min');
  p.avanzarA(H - HORA + 1);
  assert.equal(p.cuenta.textContent, 'Termina en 59 min');
});

test('si en H dispara primero el temporizador de la cuenta, él solo apaga la franja', () => {
  const p = pagina({ ahora: H - 30000 });
  conLaFuente(p);
  p.dispararSolo('contar', H + 1);
  assert.equal(p.franja.hidden, true);
  assert.equal(p.cuenta.textContent, '');
});

test('volver a la pestaña muchas veces no acumula temporizadores', () => {
  const p = pagina({ ahora: D + HORA });
  conLaFuente(p);
  for (let i = 0; i < 5; i++) {
    for (const fn of p.oyentes.visibilitychange) fn();
    for (const fn of p.oyentes.pageshow) fn();
  }
  assert.ok(p.pendientes() <= 2, `quedan ${p.pendientes()} temporizadores`);
});

test('antes de empezar no hay cuenta; al empezar aparece; una pestaña dormida la pone al día al volver', () => {
  const p = pagina({ ahora: D - HORA });
  conLaFuente(p);
  assert.equal(p.cuenta.textContent, '');
  p.avanzarA(D);
  assert.equal(p.cuenta.textContent, 'Termina en 6 d 0 h');
  p.cambiarLaHora(col('2026-11-30T10:40:00'));
  for (const fn of p.oyentes.visibilitychange) fn();
  assert.equal(p.cuenta.textContent, 'Termina hoy en 13 h 20 min');
});

test('en el anfitrión de un aliado no hay cuenta', () => {
  const p = pagina({ ahora: D + HORA, host: 'exotics.certiveh.co' });
  conLaFuente(p);
  assert.equal(p.cuenta.textContent, '');
});

const HOME = new URL('../dist/index.html', import.meta.url);
test('el <script> que quedó en el HTML construido hace lo mismo con los instantes del build', { skip: !existsSync(HOME) && 'sin dist/ (corre `pnpm build`)' }, () => {
  const html = readFileSync(HOME, 'utf8');
  const franja = html.indexOf('id="cv-bw"');
  assert.ok(franja > 0, 'la home lleva la franja');
  assert.match(html.slice(franja - 40, franja + 200), /<aside id="cv-bw"[^>]*\bhidden\b/, 'sale oculta en el HTML');
  const aside = html.slice(franja, html.indexOf('</aside>', franja));
  assert.match(aside, /<time class="cv-bw-fin"[^>]*datetime="2026-12-01T05:00:00\.000Z"[^>]*><span class="cv-bw-cuenta" aria-hidden="true"[^>]*><\/span><span class="cv-bw-para-lectores"[^>]*>Termina el lunes 30 de noviembre a las 11:59 p\. m\.<\/span><\/time>/, 'el <time> con el instante del final, la cuenta vacía y oculta a lectores, y la frase fija para ellos');
  assert.equal(/aria-live/.test(aside), false, 'sin aria-live');
  const enlaceHtml = aside.slice(aside.indexOf('<a class="cv-bw-enlace'), aside.indexOf('</a>') + 4).replace(/ data-astro-cid-[a-z0-9]+/g, '');
  assert.equal(enlaceHtml, '<a class="cv-bw-enlace" href="https://portal.certiveh.co/?utm_source=landing&utm_campaign=black-week" target="_blank" rel="noopener noreferrer"><strong>Black Week:</strong> 20% en cualquiera de tus trámites con el código&nbsp;<span class="cv-bw-codigo" translate="no">BLACK20</span> · Hasta el lunes 30 de noviembre<svg class="cv-bw-flecha" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>', 'la línea principal, byte a byte');
  const letraHtml = aside.slice(aside.indexOf('<p class="cv-bw-letra'), aside.indexOf('</p>') + 4).replace(/ data-astro-cid-[a-z0-9]+/g, '');
  assert.equal(letraHtml, '<p class="cv-bw-letra">Código de uso general. Sobre honorarios de CertiVeh, no incluye la tasa de la UPME. Del 25 al 30 de noviembre de 2026. Aplican <a href="/terminos-y-condiciones">términos y condiciones</a> en certiveh.co.</p>', 'la letra pequeña, byte a byte');
  // El estilo de la cuenta, en las hojas que enlaza la home: cifras tabulares (el ancho no baila), sin partirse, y solo
  // con los tokens de marca.css (ni un color, ni un radio sueltos).
  const hojas = [...html.matchAll(/<link rel="stylesheet" href="\/(_astro\/[^"]+\.css)"/g)]
    .map((m) => readFileSync(new URL(`../dist/${m[1]}`, import.meta.url), 'utf8')).join('\n');
  const regla = (hojas.match(/\.cv-bw-cuenta(?:\[[^\]]+\])?\{([^}]*)\}/) || [])[1] || '';
  assert.match(regla, /font-variant-numeric:tabular-nums/, 'cifras tabulares');
  assert.match(regla, /white-space:nowrap/, 'la cuenta no se parte');
  assert.equal(/background|border|radius|shadow|#[0-9a-f]{3,8}\b|rgb/i.test(regla), false, 'texto de la franja: sin caja, fondo, borde ni color suelto');
  assert.match(hojas, /\.cv-bw-fin(?:\[[^\]]+\])?:has\(\.cv-bw-cuenta(?:\[[^\]]+\])?:empty\)\{display:none\}/, 'vacía no ocupa sitio');
  const texto = aside.replace(/<[^>]+>/g, '').replace(/&nbsp;| /g, ' ');
  assert.ok(texto.includes('Black Week: 20% en cualquiera de tus trámites con el código BLACK20 · Hasta el lunes 30 de noviembre'), 'la línea principal');
  assert.equal(texto.includes('todo tu trámite'), false, 'ya no dice «todo tu trámite»');
  assert.ok(texto.includes('Código de uso general. Sobre honorarios de CertiVeh, no incluye la tasa de la UPME. Del 25 al 30 de noviembre de 2026. Aplican términos y condiciones en certiveh.co.'), 'la letra pequeña no cambia');
  const i = html.indexOf('<script>', franja);
  const codigo = html.slice(i + '<script>'.length, html.indexOf('</script>', i));
  assert.match(codigo, /laFranjaDeLaBlackWeek\(window, 1795582800000, 1796101200000\);$/);
  for (const [ahora, ve, cuenta] of [[D - 1, false, ''], [D, true, 'Termina en 6 d 0 h'], [col('2026-11-29T15:00:00'), true, 'Termina mañana a las 11:59 p. m.'], [col('2026-11-26T10:00:00'), true, 'Termina en 4 d 14 h'], [col('2026-11-30T10:40:00'), true, 'Termina hoy en 13 h 20 min'], [H - 1, true, 'Termina en 1 min'], [H, false, '']]) {
    const p = pagina({ ahora });
    correr(codigo, p);
    assert.equal(p.franja.hidden, !ve, new Date(ahora).toISOString());
    assert.equal(p.cuenta.textContent, cuenta, new Date(ahora).toISOString());
  }
  for (const pag of ['exotics', 'api-docs']) {
    const otra = readFileSync(new URL(`../dist/${pag}/index.html`, import.meta.url), 'utf8');
    assert.equal(otra.includes('id="cv-bw"'), false, `/${pag} no lleva la franja`);
  }
});
