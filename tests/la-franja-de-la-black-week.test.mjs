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
  const franja = { hidden: true, offsetHeight: alto, querySelector: () => enlace };
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
    w, franja, enlace, variables, oyentes,
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

const HOME = new URL('../dist/index.html', import.meta.url);
test('el <script> que quedó en el HTML construido hace lo mismo con los instantes del build', { skip: !existsSync(HOME) && 'sin dist/ (corre `pnpm build`)' }, () => {
  const html = readFileSync(HOME, 'utf8');
  const franja = html.indexOf('id="cv-bw"');
  assert.ok(franja > 0, 'la home lleva la franja');
  assert.match(html.slice(franja - 40, franja + 200), /<aside id="cv-bw"[^>]*\bhidden\b/, 'sale oculta en el HTML');
  const texto = html.slice(franja, html.indexOf('</aside>', franja)).replace(/<[^>]+>/g, '').replace(/&nbsp;| /g, ' ');
  assert.ok(texto.includes('Black Week: 20% en cualquiera de tus trámites con el código BLACK20 · Hasta el lunes 30 de noviembre'), 'la línea principal');
  assert.equal(texto.includes('todo tu trámite'), false, 'ya no dice «todo tu trámite»');
  assert.ok(texto.includes('Código de uso general. Sobre honorarios de CertiVeh, no incluye la tasa de la UPME. Del 25 al 30 de noviembre de 2026. Aplican términos y condiciones en certiveh.co.'), 'la letra pequeña no cambia');
  const i = html.indexOf('<script>', franja);
  const codigo = html.slice(i + '<script>'.length, html.indexOf('</script>', i));
  assert.match(codigo, /laFranjaDeLaBlackWeek\(window, 1795582800000, 1796101200000\);$/);
  for (const [ahora, ve] of [[D - 1, false], [D, true], [H - 1, true], [H, false]]) {
    const p = pagina({ ahora });
    correr(codigo, p);
    assert.equal(p.franja.hidden, !ve, new Date(ahora).toISOString());
  }
  for (const pag of ['exotics', 'api-docs']) {
    const otra = readFileSync(new URL(`../dist/${pag}/index.html`, import.meta.url), 'utf8');
    assert.equal(otra.includes('id="cv-bw"'), false, `/${pag} no lleva la franja`);
  }
});
