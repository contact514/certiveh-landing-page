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
  const franja = { hidden: true, offsetHeight: alto, querySelector: (sel) => (sel === 'time' ? cuenta : sel === 'a[href]' ? enlace : null) };
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
    /** Avanza el reloj a `t` y dispara, en orden, los temporizadores vencidos (como haría el navegador). */
    avanzarA(t) {
      reloj = t;
      for (;;) {
        const i = temporizadores.findIndex((x) => x && x.en <= reloj);
        if (i < 0) break;
        const { fn } = temporizadores[i];
        temporizadores[i] = null;
        fn();
      }
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

for (const [nombre, ahora, texto] of [
  ['26-nov 10:00 (más de 24 h)', col('2026-11-26T10:00:00'), 'Termina en 4 d 14 h'],
  ['25-nov 00:00, al empezar', D, 'Termina en 6 d'],
  ['más de 24 h con minutos y segundos sueltos', H - (5 * DIA + 13 * HORA + 59 * MIN + 59000), 'Termina en 5 d 13 h'],
  ['justo 24 h antes (30-nov 00:00)', H - DIA, 'Termina en 1 d'],
  ['1 ms dentro del último día', H - DIA + 1, 'Termina hoy en 23 h 59 min'],
  ['30-nov 10:00 (último día, hora en punto)', col('2026-11-30T10:00:00'), 'Termina hoy en 14 h'],
  ['30-nov 10:40 (último día)', col('2026-11-30T10:40:00'), 'Termina hoy en 13 h 20 min'],
  ['justo 1 h antes', H - HORA, 'Termina hoy en 1 h'],
  ['menos de 1 h', H - 45 * MIN - 30000, 'Termina en 45 min'],
  ['los últimos segundos', H - 30000, 'Termina en 1 min'],
]) {
  test(`la cuenta, ${nombre}: «${texto}»`, () => {
    const p = pagina({ ahora });
    conLaFuente(p);
    assert.equal(p.franja.hidden, false);
    assert.equal(p.cuenta.textContent, texto);
    assert.doesNotMatch(texto, /\bs\b|seg/, 'sin segundos');
  });
}

test('la cuenta avanza cada minuto, alineada al minuto, y al llegar a cero la franja se apaga sola', () => {
  const p = pagina({ ahora: H - 2 * MIN - 15000 }); // faltan 2 min 15 s
  conLaFuente(p);
  assert.equal(p.cuenta.textContent, 'Termina en 2 min');
  p.avanzarA(H - 2 * MIN - 1);
  assert.equal(p.cuenta.textContent, 'Termina en 2 min', 'no cambia antes del minuto');
  p.avanzarA(H - 2 * MIN + 1);
  assert.equal(p.cuenta.textContent, 'Termina en 1 min', 'cambia justo al cruzar el minuto');
  p.avanzarA(H - 1);
  assert.equal(p.franja.hidden, false);
  p.avanzarA(H);
  assert.equal(p.franja.hidden, true, 'a cero se oculta sin recargar');
  assert.equal(p.cuenta.textContent, '', 'y la cuenta queda vacía');
  assert.equal(p.variables['--cv-aviso-y'], '0px');
  assert.equal(p.pendientes(), 0, 'no deja temporizadores corriendo');
});

test('de un día a «hoy» y de horas a minutos sin recargar', () => {
  const p = pagina({ ahora: H - DIA - 90000 });
  conLaFuente(p);
  assert.equal(p.cuenta.textContent, 'Termina en 1 d');
  p.avanzarA(H - DIA + 1);
  assert.equal(p.cuenta.textContent, 'Termina hoy en 23 h 59 min');
  p.avanzarA(H - HORA + 1);
  assert.equal(p.cuenta.textContent, 'Termina en 59 min');
});

test('antes de empezar no hay cuenta; al empezar aparece; una pestaña dormida la pone al día al volver', () => {
  const p = pagina({ ahora: D - HORA });
  conLaFuente(p);
  assert.equal(p.cuenta.textContent, '');
  p.avanzarA(D);
  assert.equal(p.cuenta.textContent, 'Termina en 6 d');
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
  assert.match(aside, /<time class="cv-bw-cuenta[^"]*"[^>]*datetime="2026-12-01T05:00:00\.000Z"[^>]*><\/time>/, 'la cuenta sale vacía con el instante del final');
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
  assert.match(regla, /background:var\(--cv-accent-hover\)/, 'el paso de tono es un token');
  assert.match(regla, /border-radius:var\(--cv-r\)/, 'el radio es el token');
  assert.equal(/#[0-9a-f]{3,8}\b|rgb/i.test(regla), false, 'sin colores sueltos');
  assert.match(hojas, /\.cv-bw-cuenta(?:\[[^\]]+\])?:empty\{display:none\}/, 'vacía no ocupa sitio');
  const texto = aside.replace(/<[^>]+>/g, '').replace(/&nbsp;| /g, ' ');
  assert.ok(texto.includes('Black Week: 20% en cualquiera de tus trámites con el código BLACK20 · Hasta el lunes 30 de noviembre'), 'la línea principal');
  assert.equal(texto.includes('todo tu trámite'), false, 'ya no dice «todo tu trámite»');
  assert.ok(texto.includes('Código de uso general. Sobre honorarios de CertiVeh, no incluye la tasa de la UPME. Del 25 al 30 de noviembre de 2026. Aplican términos y condiciones en certiveh.co.'), 'la letra pequeña no cambia');
  const i = html.indexOf('<script>', franja);
  const codigo = html.slice(i + '<script>'.length, html.indexOf('</script>', i));
  assert.match(codigo, /laFranjaDeLaBlackWeek\(window, 1795582800000, 1796101200000\);$/);
  for (const [ahora, ve, cuenta] of [[D - 1, false, ''], [D, true, 'Termina en 6 d'], [col('2026-11-26T10:00:00'), true, 'Termina en 4 d 14 h'], [col('2026-11-30T10:40:00'), true, 'Termina hoy en 13 h 20 min'], [H - 1, true, 'Termina en 1 min'], [H, false, '']]) {
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
