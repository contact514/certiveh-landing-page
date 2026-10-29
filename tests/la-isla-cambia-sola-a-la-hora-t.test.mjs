/**
 * **La isla de la landing cambia sola a la tarifa nueva a la hora T** (ajuste de precios, ronda 4; AUDITORIA-CRUZADA-R3,
 * I3, mutante X3).
 *
 * Entre las 00:00 de T y el «Redeploy», el HTML estático de la home dice la tarifa del BUILD (agosto). Lo que la cambia
 * es `useTarifaDeLaIsla`: pinta con la del build (sin desajuste de hidratación) y, en su efecto, pasa a la vigente con
 * el reloj del navegador. Aquí corre el hook REAL con un React mínimo que hace lo que hace React al hidratar: un
 * primer render, los efectos y el render con el estado nuevo. El reloj, fingido (`mock.timers`, solo `Date`).
 *
 * `node --test --experimental-test-module-mocks` (lo pone `npm test`).
 */
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';

/** Un React mínimo para UN hook: estado por orden de llamada, efectos que se corren tras el render, y re-render. */
function reactDePrueba() {
  let estados = [];
  let efectos = [];
  let i = 0;
  return {
    namedExports: {
      useState: (inicial) => {
        const k = i++;
        if (!(k in estados)) estados[k] = typeof inicial === 'function' ? inicial() : inicial;
        return [estados[k], (v) => { estados[k] = typeof v === 'function' ? v(estados[k]) : v; }];
      },
      useEffect: (fn) => { efectos.push(fn); },
      createContext: (d) => ({ d }),
      useContext: () => null,
    },
    /** Monta: primer render, efectos, y el render que pinta lo que dejaron. Devuelve [lo del HTML, lo hidratado]. */
    montar(hook) {
      estados = []; i = 0; efectos = [];   // cada montaje, una isla nueva
      const primero = hook();
      for (const fn of efectos) fn();
      i = 0; efectos = [];
      const despues = hook();
      return [primero, despues];
    },
  };
}

const R = reactDePrueba();
mock.module('react', { namedExports: R.namedExports });
const { useTarifaDeLaIsla } = await import('../src/app/components/la-tarifa-de-la-isla.ts');

test('🔴 build de agosto y reloj DESPUÉS de T: pinta agosto en el HTML y, al hidratar, la nueva (494.000)', () => {
  // La vigencia real de la tabla es 2099-01-01 hasta el commit de publicación: el 1-jun-2099 rige la nueva sea cual sea T.
  mock.timers.enable({ apis: ['Date'], now: new Date('2099-06-01T05:00:30Z') });
  try {
    const [html, hidratada] = R.montar(() => useTarifaDeLaIsla('desde-2026-08-04'));
    assert.equal(html.id, 'desde-2026-08-04');
    assert.equal(html.honorarios.veh.fijo, 599_990);
    assert.equal(hidratada.id, 'ajuste-oct-2026');
    assert.equal(hidratada.honorarios.veh.fijo, 494_000);
  } finally {
    mock.timers.reset();
  }
});

test('build de agosto y reloj ANTES de T: se queda en agosto (no cambia antes de hora)', () => {
  mock.timers.enable({ apis: ['Date'], now: new Date('2026-10-20T17:00:00Z') });
  try {
    const [html, hidratada] = R.montar(() => useTarifaDeLaIsla('desde-2026-08-04'));
    assert.equal(html.id, 'desde-2026-08-04');
    assert.equal(hidratada.id, 'desde-2026-08-04');
  } finally {
    mock.timers.reset();
  }
});
