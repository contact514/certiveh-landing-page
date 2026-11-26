/**
 * **Las cifras de la portada se piden UNA vez por visita** (24/25-nov-2026).
 *
 * La portada repetía la petición a `public-stats` cada 60 s por pestaña abierta, aunque nadie la mirara, y cada una leía
 * en la base todos los casos pagados: ~12.000 lecturas al día, lo que más cargó la base el 24-nov-2026, el día que se
 * cayó varias veces. La función ahora guarda las cifras diez minutos (repo del panel), pero un sondeo nuevo aquí volvería
 * a multiplicar las llamadas por cada pestaña abierta. Este test se pone rojo si alguien vuelve a meter un temporizador
 * en el efecto que pide las cifras, o si aparece otra llamada a la función fuera de él.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const FUENTE = readFileSync(new URL('../src/app/components/CertiVehLandingComplete.tsx', import.meta.url), 'utf8');
const sinComentarios = (t) => t.replace(/\/\*[\s\S]*?\*\//g, ' ').split('\n').map((l) => l.replace(/(?<!:)\/\/.*$/, '')).join('\n');
const CODIGO = sinComentarios(FUENTE);

/** El cuerpo del `useEffect` que contiene la llamada: desde su `useEffect(` hasta su `}, [` de cierre. */
function efectoQueLlama(fuente) {
  const llamada = fuente.indexOf('/functions/v1/public-stats');
  assert.ok(llamada > 0, 'no encuentro la llamada a public-stats: el instrumento no mide nada');
  const inicio = fuente.lastIndexOf('useEffect(', llamada);
  const fin = fuente.indexOf('}, [', llamada);
  assert.ok(inicio > 0 && fin > llamada, 'no encuentro el efecto que envuelve la llamada');
  return fuente.slice(inicio, fin);
}

test('CONTROL: el instrumento ve un sondeo cuando lo hay', () => {
  const conSondeo = CODIGO.replace('fetchStats();\n  }, []);', 'fetchStats();\n    const t = setInterval(fetchStats, 60_000);\n    return () => clearInterval(t);\n  }, []);');
  assert.notEqual(conSondeo, CODIGO, 'la mutación de control no se aplicó: el ancla cambió');
  assert.match(efectoQueLlama(conSondeo), /setInterval|setTimeout/);
});

test('el efecto que pide las cifras no lleva temporizador', () => {
  const efecto = efectoQueLlama(CODIGO);
  assert.doesNotMatch(efecto, /setInterval|setTimeout|requestAnimationFrame/, 'volvió un sondeo sobre public-stats');
});

test('la portada llama a public-stats en un solo sitio', () => {
  assert.equal(CODIGO.split('/functions/v1/public-stats').length - 1, 1);
});
