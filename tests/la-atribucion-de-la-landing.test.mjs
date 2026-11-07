/**
 * **La cookie `cv_atrib` y la etiqueta de Google Ads de la landing** (medición de ventas, 6-nov-2026). Se EJECUTAN las
 * funciones de `src/scripts/cv-atrib.ts` con una ventana de mentira y se mira lo observable: la cookie que se escribe y lo
 * que entra en `dataLayer`. Y el cable en `BaseLayout.astro`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { capturarLaAtribucionDeLaUrl, leerLaCookieDeAtribucion, sinLoCaducado, idDeLaEtiquetaDeGoogle, configurarLaEtiquetaDeGoogleAds } from '../src/scripts/cv-atrib.ts';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function ventana(url, cookie = '') {
  const u = new URL(url);
  const tarro = [];
  let actual = cookie;
  const document = {
    get cookie() { return actual; },
    set cookie(v) { tarro.push(v); actual = [actual, v.split(';')[0]].filter(Boolean).join('; '); },
  };
  return { win: { location: { hostname: u.hostname, search: u.search, origin: u.origin, pathname: u.pathname }, document }, tarro };
}

test('CONTROL · el fbclid del anuncio se guarda en .certiveh.co, 90 días, con la ruta sin parámetros', () => {
  const v = ventana('https://certiveh.co/blog/devolucion-iva?fbclid=IwAR2xYz_abc-123&utm_source=facebook&email=a%40b.co#x');
  assert.equal(capturarLaAtribucionDeLaUrl(v.win, 1_762_400_000_000), true);
  assert.match(v.tarro[0], /; Max-Age=7776000; Path=\/; Domain=\.certiveh\.co; SameSite=Lax; Secure$/);
  assert.deepEqual(leerLaCookieDeAtribucion(v.win.document, 1_762_400_000_000), {
    v: 1, fbclid: 'IwAR2xYz_abc-123', fbclid_at: 1_762_400_000_000, utm: { utm_source: 'facebook' }, landing_url: 'https://certiveh.co/blog/devolucion-iva',
    llegada_at: 1_762_400_000_000,
  });
  assert.doesNotMatch(v.tarro[0], /email|a%2540b/);
});

test('🔴 fuera de certiveh.co (vista previa de Vercel) o sin nada en la URL no escribe', () => {
  assert.equal(capturarLaAtribucionDeLaUrl(ventana('https://certiveh-landing.vercel.app/?gclid=Cj0KCQiA_gclid1').win), false);
  const v = ventana('https://certiveh.co/');
  assert.equal(capturarLaAtribucionDeLaUrl(v.win), false);
  assert.deepEqual(v.tarro, []);
});

test('🔴 el último clic de Google sustituye a los otros dos; el de Meta se conserva; repetir el mismo no reescribe', () => {
  const previo = encodeURIComponent(JSON.stringify({ v: 1, gclid: 'Cj0KCQiA_gclid1', clic_at: 1, fbclid: 'IwAR2xYz_abc-123', fbclid_at: 2 }));
  const v = ventana('https://exotics.certiveh.co/?wbraid=WBRAID_1234567', `_ga=1; cv_atrib=${previo}`);
  assert.equal(capturarLaAtribucionDeLaUrl(v.win, 50), true);
  const c = leerLaCookieDeAtribucion({ cookie: v.tarro[0].split(';')[0] }, 50);
  assert.deepEqual(c, { v: 1, wbraid: 'WBRAID_1234567', clic_at: 50, fbclid: 'IwAR2xYz_abc-123', fbclid_at: 2, landing_url: 'https://exotics.certiveh.co/', llegada_at: 50 });
  assert.equal(capturarLaAtribucionDeLaUrl(ventana('https://certiveh.co/?gclid=Cj0KCQiA_gclid1', `cv_atrib=${previo}`).win, 50), false);
});

test('🔴 ronda 8 · la cookie cumple 90 días: lo capturado hace más (o sin fecha) no se lee ni se arrastra; la llegada es una pieza', () => {
  const DIA = 86_400_000, T = 200 * DIA;
  const viejo = { v: 1, fbclid: 'IwAR2xYz_viejo1', fbclid_at: T - 91 * DIA, gclid: 'Cj0KCQiA_viejo1', clic_at: T - 91 * DIA,
    landing_url: 'https://certiveh.co/', utm: { utm_source: 'x' }, llegada_at: T - 91 * DIA };
  assert.deepEqual(sinLoCaducado(viejo, T), { v: 1 });
  assert.deepEqual(sinLoCaducado({ ...viejo, fbclid_at: T - 90 * DIA }, T), { v: 1, fbclid: 'IwAR2xYz_viejo1', fbclid_at: T - 90 * DIA });
  assert.deepEqual(sinLoCaducado({ v: 1, gclid: 'Cj0KCQiA_sinfecha', utm: { a: 'b' } }, T), { v: 1 });
  assert.deepEqual(sinLoCaducado({ ...viejo, clic_at: T - DIA }, T), { v: 1, gclid: 'Cj0KCQiA_viejo1', clic_at: T - DIA });
  assert.deepEqual(sinLoCaducado({ ...viejo, llegada_at: T - DIA }, T), { v: 1, landing_url: 'https://certiveh.co/', utm: { utm_source: 'x' }, llegada_at: T - DIA });
  const v = ventana('https://certiveh.co/blog?fbclid=IwAR2xYz_nuevo1', `cv_atrib=${encodeURIComponent(JSON.stringify(viejo))}`);
  assert.equal(capturarLaAtribucionDeLaUrl(v.win, T), true);
  assert.deepEqual(JSON.parse(decodeURIComponent(v.tarro[0].split(';')[0].slice('cv_atrib='.length))),
    { v: 1, fbclid: 'IwAR2xYz_nuevo1', fbclid_at: T, landing_url: 'https://certiveh.co/blog', llegada_at: T });
  // Un clic nuevo sustituye la llegada entera (los utm viejos no se heredan); sin clic y con llegada, no se toca.
  const previo = encodeURIComponent(JSON.stringify({ v: 1, gclid: 'Cj0KCQiA_viejo1', clic_at: 1, utm: { utm_source: 'viejo' }, landing_url: 'https://certiveh.co/', llegada_at: 1 }));
  const w = ventana('https://certiveh.co/b?gclid=Cj0KCQiA_nuevo1', `cv_atrib=${previo}`);
  assert.equal(capturarLaAtribucionDeLaUrl(w.win, 60), true);
  assert.deepEqual(leerLaCookieDeAtribucion({ cookie: w.tarro[0].split(';')[0] }, 60), { v: 1, gclid: 'Cj0KCQiA_nuevo1', clic_at: 60, landing_url: 'https://certiveh.co/b', llegada_at: 60 });
  assert.equal(capturarLaAtribucionDeLaUrl(ventana('https://certiveh.co/?utm_source=otro', `cv_atrib=${previo}`).win, 60), false);
});

test('🔴 ronda 9 · si al leerla hay algo caducado se reescribe ya, y la cookie vive lo que le quede a su dato más reciente', () => {
  const DIA = 86_400_000, T = 200 * DIA;
  const mezcla = { v: 1, fbclid: 'IwAR2xYz_vivo01', fbclid_at: T - 30 * DIA, gclid: 'Cj0KCQiA_viejo1', clic_at: T - 91 * DIA };
  const v = ventana('https://certiveh.co/blog', `cv_atrib=${encodeURIComponent(JSON.stringify(mezcla))}`);
  assert.equal(capturarLaAtribucionDeLaUrl(v.win, T), true);
  assert.match(v.tarro[0], new RegExp(`; Max-Age=${60 * 86_400}; `));
  assert.deepEqual(leerLaCookieDeAtribucion({ cookie: v.tarro[0].split(';')[0] }, null), { v: 1, fbclid: 'IwAR2xYz_vivo01', fbclid_at: T - 30 * DIA });
  const w = ventana('https://certiveh.co/', `cv_atrib=${encodeURIComponent(JSON.stringify({ v: 1, gclid: 'Cj0KCQiA_viejo1', clic_at: T - 91 * DIA }))}`);
  assert.equal(capturarLaAtribucionDeLaUrl(w.win, T), true);
  assert.match(w.tarro[0], /^cv_atrib=; Max-Age=0; /);
  const x = ventana('https://certiveh.co/', `cv_atrib=${encodeURIComponent(JSON.stringify({ v: 1, fbclid: 'IwAR2xYz_vivo01', fbclid_at: T - 30 * DIA }))}`);
  assert.equal(capturarLaAtribucionDeLaUrl(x.win, T), false);
});

test('un id con forma rara no se guarda, y una cookie basura no rompe', () => {
  assert.equal(capturarLaAtribucionDeLaUrl(ventana('https://certiveh.co/?gclid=a%20b').win), false);
  assert.equal(capturarLaAtribucionDeLaUrl(ventana('https://certiveh.co/?gclid=Cj0KCQiA_gclid1', 'cv_atrib=%7Bno').win), true);
});

test('🔴 la etiqueta AW: sólo con un id AW-<dígitos>, y empuja `arguments` como gtag', () => {
  for (const x of [undefined, '', 'G-FJ10NX1DV6', 'AW-', 'AW-12x']) assert.equal(idDeLaEtiquetaDeGoogle(x), null);
  assert.equal(idDeLaEtiquetaDeGoogle(' AW-123456789 '), 'AW-123456789');
  const sin = { document: { querySelector: () => null } };
  assert.equal(configurarLaEtiquetaDeGoogleAds(sin), false);
  assert.equal(sin.dataLayer, undefined);
  const con = { document: { querySelector: () => ({ getAttribute: () => 'AW-123456789' }) }, dataLayer: [['ya']] };
  assert.equal(configurarLaEtiquetaDeGoogleAds(con), true);
  assert.equal(con.dataLayer.length, 4);
  assert.deepEqual(Array.from(con.dataLayer[1]), ['set', 'url_passthrough', false]);
  // Sin remarketing (7-nov-2026), antes del config.
  assert.deepEqual(Array.from(con.dataLayer[2]), ['set', { allow_ad_personalization_signals: false, allow_google_signals: false }]);
  assert.deepEqual(Array.from(con.dataLayer[3]), ['config', 'AW-123456789', { allow_enhanced_conversions: false }]);
  assert.equal(Object.prototype.toString.call(con.dataLayer[3]), '[object Arguments]');
});

test('el cable en BaseLayout: la meta sólo con el id del build, y la etiqueta configurada cuando ya corrió GA4', () => {
  const f = readFileSync(resolve(RAIZ, 'src/layouts/BaseLayout.astro'), 'utf8');
  assert.match(f, /const etiquetaDeGoogleAds = idDeLaEtiquetaDeGoogle\(import\.meta\.env\.GOOGLE_ADS_TAG_ID\);/);
  assert.match(f, /\{etiquetaDeGoogleAds && <meta name="cv-etiqueta-google-ads" content=\{etiquetaDeGoogleAds\} \/>\}/);
    assert.ok(f.indexOf('capturarLaAtribucionDeLaUrl(window);') > 0);
  // La etiqueta se configura al DOMContentLoaded: los módulos de Astro no respetan el orden respecto al de GA4.
  assert.match(f, /window\.addEventListener\('DOMContentLoaded', \(\) => configurarLaEtiquetaDeGoogleAds\(window\), \{ once: true \}\);/);
  // Sin remarketing desde el PRIMER comando de gtag (ronda 8): el `set` de privacidad va antes del `js` y del config de GA4.
  const set = f.indexOf("gtag('set', { allow_ad_personalization_signals: false, allow_google_signals: false });");
  assert.ok(set > 0 && set < f.indexOf("gtag('js', new Date());") && set < f.indexOf("gtag('config', 'G-FJ10NX1DV6');"));
  // El píxel de la landing NO se toca en esta entrega (decisión del 6-nov-2026).
  assert.match(f, /fbq\('init', '1323375866331511'\);/);
});
