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
import { capturarLaAtribucionDeLaUrl, leerLaCookieDeAtribucion, idDeLaEtiquetaDeGoogle, configurarLaEtiquetaDeGoogleAds } from '../src/scripts/cv-atrib.ts';

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
  assert.deepEqual(leerLaCookieDeAtribucion(v.win.document), {
    v: 1, fbclid: 'IwAR2xYz_abc-123', fbclid_at: 1_762_400_000_000, utm: { utm_source: 'facebook' }, landing_url: 'https://certiveh.co/blog/devolucion-iva',
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
  const c = leerLaCookieDeAtribucion({ cookie: v.tarro[0].split(';')[0] });
  assert.deepEqual(c, { v: 1, wbraid: 'WBRAID_1234567', clic_at: 50, fbclid: 'IwAR2xYz_abc-123', fbclid_at: 2, landing_url: 'https://exotics.certiveh.co/' });
  assert.equal(capturarLaAtribucionDeLaUrl(ventana('https://certiveh.co/?gclid=Cj0KCQiA_gclid1', `cv_atrib=${previo}`).win, 50), false);
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
  assert.equal(con.dataLayer.length, 3);
  assert.deepEqual(Array.from(con.dataLayer[1]), ['set', 'url_passthrough', false]);
  assert.deepEqual(Array.from(con.dataLayer[2]), ['config', 'AW-123456789', { allow_enhanced_conversions: false }]);
  assert.equal(Object.prototype.toString.call(con.dataLayer[2]), '[object Arguments]');
});

test('el cable en BaseLayout: la meta sólo con el id del build, y la etiqueta configurada cuando ya corrió GA4', () => {
  const f = readFileSync(resolve(RAIZ, 'src/layouts/BaseLayout.astro'), 'utf8');
  assert.match(f, /const etiquetaDeGoogleAds = idDeLaEtiquetaDeGoogle\(import\.meta\.env\.GOOGLE_ADS_TAG_ID\);/);
  assert.match(f, /\{etiquetaDeGoogleAds && <meta name="cv-etiqueta-google-ads" content=\{etiquetaDeGoogleAds\} \/>\}/);
    assert.ok(f.indexOf('capturarLaAtribucionDeLaUrl(window);') > 0);
  // La etiqueta se configura al DOMContentLoaded: los módulos de Astro no respetan el orden respecto al de GA4.
  assert.match(f, /window\.addEventListener\('DOMContentLoaded', \(\) => configurarLaEtiquetaDeGoogleAds\(window\), \{ once: true \}\);/);
  // El píxel de la landing NO se toca en esta entrega (decisión del 6-nov-2026).
  assert.match(f, /fbq\('init', '1323375866331511'\);/);
});
