// El enlace de los correos de bienvenida de los aliados (`send-partner-welcome` del panel): `certiveh.co/r/<subdominio>`,
// también en el QR del correo. Hasta el 6-nov-2026 daba 404: la landing no tenía esa ruta. Ahora `vercel.json` lo manda
// con un 302 a `https://<subdominio>.portal.certiveh.co`, el mismo destino que el QR del panel (`getPartnerUrl`).
//
// Lo que se fija aquí, y por qué:
//   - 302 y no 308: el destino puede cambiar mañana, y un permanente se queda en la caché del navegador.
//   - `:sub` es un subdominio válido ([a-z0-9-]{1,63}) y NADA más: con un patrón abierto («[^/]+») el enlace sería una
//     redirección abierta (`/r/evil.com#` o `/r/x%2F@evil.com` a otro sitio con nuestro dominio delante).
//   - La query (utm) la conserva Vercel en producción en sus redirecciones (medido con `/gnv?utm_source=…` el 6-nov);
//     `vercel dev` no lo imita, así que el guion de publicación lo comprueba en vivo.
//
// Vercel compila cada regla con path-to-regexp: `/r/:sub(<patrón>)` es `^/r(?:/(<patrón>))$` y la de la barra final,
// lo mismo con `/` antes del `$`, sin distinguir mayúsculas; y un destino sin ruta sale con la barra final
// (`Location: https://$1.portal.certiveh.co/`), medido con @vercel/routing-utils 6.6.1. `compilar` y `destino` hacen
// exactamente eso para esta forma de regla, y fallan si la regla cambia de forma.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const cfg = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const reglas = cfg.redirects.filter((r) => r.source.startsWith('/r/'));

const compilar = (r) => {
  const m = /^\/r\/:sub\(([^)]*)\)(\/?)$/.exec(r.source);
  assert.ok(m, `forma de regla inesperada: ${r.source}`);
  return new RegExp(`^/r(?:/(${m[1]}))${m[2]}$`, 'i');
};
// Como `new URL`: a un origen sin ruta se le pone «/». Es lo que Vercel deja en el Location.
const destino = (d, sub) => { const u = d.replace(':sub', sub); return /^https:\/\/[^/]+$/.test(u) ? `${u}/` : u; };
const resolver = (ruta) => {
  for (const r of reglas) {
    const m = compilar(r).exec(ruta);
    if (m) return `${r.statusCode ?? (r.permanent ? 308 : 307)} ${destino(r.destination, m[1])}`;
  }
  return '404';
};

test('las dos reglas de /r/:sub, transcritas enteras', () => {
  assert.deepEqual(reglas, [
    { source: '/r/:sub([a-z0-9-]{1,63})', destination: 'https://:sub.portal.certiveh.co', statusCode: 302 },
    { source: '/r/:sub([a-z0-9-]{1,63})/', destination: 'https://:sub.portal.certiveh.co', statusCode: 302 },
  ]);
});

test('un subdominio válido va a su portal con un 302, con o sin barra final, y el Location lleva la barra final', () => {
  assert.equal(resolver('/r/mi-aliado'), '302 https://mi-aliado.portal.certiveh.co/');
  assert.equal(resolver('/r/mi-aliado/'), '302 https://mi-aliado.portal.certiveh.co/');
  assert.equal(resolver('/r/concesionario-2026/'), '302 https://concesionario-2026.portal.certiveh.co/');
  assert.equal(resolver('/r/concesionario-2026'), '302 https://concesionario-2026.portal.certiveh.co/');
  assert.equal(resolver(`/r/${'a'.repeat(63)}`), `302 https://${'a'.repeat(63)}.portal.certiveh.co/`);
});

test('lo que no es un subdominio no redirige a ningún sitio: 404, como antes', () => {
  for (const ruta of ['/r/', '/r', '/r/evil.com', '/r/evil.com/', '/r/a/b', '/r/x%2F@evil.com', '/r/..', '/r/a_b',
    '/r/a b', '/r/@evil', `/r/${'a'.repeat(64)}`, '/rr/x', '/x/r/y']) {
    assert.equal(resolver(ruta), '404', ruta);
  }
});

test('control: un patrón abierto sí dejaría pasar los ataques (el test los ve)', () => {
  const abierto = new RegExp('^/r(?:/([^/]+?))$', 'i');
  assert.ok(abierto.test('/r/evil.com'));
  assert.ok(abierto.test('/r/x%2F@evil.com'));
});
