/*
 * La franja de la Black Week: la enciende y la apaga el reloj del navegador (no el del build).
 *
 * NO es un módulo: FranjaDeLaBlackWeek.astro lo incrusta tal cual (`?raw`) en un <script is:inline> justo detrás de la
 * franja, para que decida antes de pintar la primera vez (sin parpadeo ni salto). El test lo evalúa con los mismos bytes.
 *
 *   laFranjaDeLaBlackWeek(window, desdeMs, hastaMs)
 *
 * - Se ve si desde <= ahora < hasta. Fuera, `hidden` (como viene en el HTML).
 * - Si la página sigue abierta, se enciende a la hora de empezar y se apaga sola a la de terminar (temporizador, y se
 *   vuelve a mirar al volver a la pestaña o al salir de la caché de atrás y adelante, que congelan los temporizadores).
 * - Mientras se ve, publica en <html> `--cv-aviso-y`: lo que asoma de la franja por arriba (su alto menos lo bajado,
 *   nunca menos de 0). La barra fija (`Navbar`) se pone ahí debajo, y al bajar sube con la franja hasta el borde.
 * - En el anfitrión de un aliado (exotics.*) no se enciende: BLACK20 no aplica con aliados.
 * - Como los demás botones al portal, conserva las UTM con que llegó la visita; si no trae, lleva las suyas.
 * - La cuenta regresiva (el <span> visible dentro del <time> de la franja, vacío en el HTML) la escribe
 *   `cuentaDeLaBlackWeek`, sin segundos y por la FECHA de Colombia (UTC-5 fijo, sin horario de verano):
 *     · hasta el antepenúltimo día (sábado 28): «Termina en N d N h» (lo que falta, por debajo);
 *     · el penúltimo (domingo 29), todo el día: «Termina mañana a las 11:59 p. m.» (sin contador);
 *     · el último (lunes 30): «Termina hoy en N h N min» y, con menos de 1 h, «Termina en N min» (como mínimo 1).
 *   Se reescribe justo cuando cambia el minuto que enseña (temporizador encadenado, alineado al minuto: 1 ms después
 *   de cruzarlo, para que un disparo puntual no lo deje un minuto atrás) y se vacía mientras la franja no se ve. Al
 *   llegar a cero la franja se apaga sola. Sin aria-live: no se anuncia cada minuto; el lector de pantalla lee el
 *   texto fijo del <time>, no la cuenta.
 */
var DIA_MS = 86400000;
var COLOMBIA_MS = 5 * 3600000;

/** El día (número de días desde 1970) que es en Colombia en el instante `t`. */
function diaDeColombia(t) {
  return Math.floor((t - COLOMBIA_MS) / DIA_MS);
}

function cuentaDeLaBlackWeek(ahora, hasta) {
  var falta = hasta - ahora;
  var min = Math.floor(falta / 60000);
  var antes = diaDeColombia(hasta - 1) - diaDeColombia(ahora);
  if (antes >= 2) return 'Termina en ' + Math.floor(min / 1440) + ' d ' + Math.floor((min % 1440) / 60) + ' h';
  if (antes === 1) return 'Termina mañana a las 11:59 p. m.';
  // El lunes a las 00:00:00.000 justas faltan 24 h 0 min: dentro de «hoy» se topa en 23 h 59 min.
  var hoy = Math.min(min, 1439);
  if (falta >= 3600000) return 'Termina hoy en ' + Math.floor(hoy / 60) + ' h ' + (hoy % 60) + ' min';
  return 'Termina en ' + Math.max(1, min) + ' min';
}

function laFranjaDeLaBlackWeek(w, desde, hasta) {
  var d = w.document;
  var el = d.getElementById('cv-bw');
  if (!el) return;
  if (/^exotics\./.test(w.location.hostname || '')) return;
  var raiz = d.documentElement;

  var enlace = el.querySelector('a[href]');
  var cuenta = el.querySelector('.cv-bw-cuenta');
  try {
    var q = new w.URLSearchParams(w.location.search || '');
    var traidas = new w.URLSearchParams();
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
      var v = q.get(k);
      if (v) traidas.set(k, v);
    });
    if (enlace && traidas.toString()) enlace.href = enlace.href.split('?')[0] + '?' + traidas.toString();
  } catch (e) { /* sin URLSearchParams queda el enlace del HTML */ }

  var alto = 0;
  var puesto = null;
  var temporizador = 0;
  var pendiente = false;
  var tic = 0;

  function publicar() {
    pendiente = false;
    var y = el.hidden ? 0 : Math.max(0, alto - (w.scrollY || w.pageYOffset || 0));
    if (y === puesto) return;
    puesto = y;
    raiz.style.setProperty('--cv-aviso-y', y + 'px');
  }
  function medir() {
    alto = el.hidden ? 0 : el.offsetHeight;
    publicar();
  }
  function alBajar() {
    if (pendiente) return;
    pendiente = true;
    (w.requestAnimationFrame || function (f) { return w.setTimeout(f, 16); })(publicar);
  }

  function contar() {
    w.clearTimeout(tic);
    if (!cuenta) return;
    if (el.hidden) {
      if (cuenta.textContent) cuenta.textContent = '';
      return;
    }
    var ahora = w.Date.now();
    var falta = hasta - ahora;
    if (falta <= 0) { aplicar(); return; }
    var texto = cuentaDeLaBlackWeek(ahora, hasta);
    if (cuenta.textContent !== texto) cuenta.textContent = texto;
    // El texto cambia cuando lo que falta cruza un minuto entero (el final cae en minuto exacto, así que también el
    // cambio de día en Colombia): se vuelve a mirar 1 ms después de cruzarlo.
    tic = w.setTimeout(contar, (falta % 60000) + 1);
  }

  function aplicar() {
    var ahora = w.Date.now();
    var ve = ahora >= desde && ahora < hasta;
    if (el.hidden === ve) el.hidden = !ve;
    contar();
    medir();
    w.clearTimeout(temporizador);
    var falta = ahora < desde ? desde - ahora : (ahora < hasta ? hasta - ahora : 0);
    // Un temporizador de más de ~24,8 días desborda y dispara al instante: como mucho, se vuelve a mirar cada hora.
    if (falta > 0) temporizador = w.setTimeout(aplicar, Math.min(falta, 3600000));
  }

  aplicar();
  w.addEventListener('scroll', alBajar, { passive: true });
  w.addEventListener('resize', medir);
  w.addEventListener('pageshow', aplicar);
  d.addEventListener('visibilitychange', function () { if (d.visibilityState === 'visible') aplicar(); });
  // El alto cambia al llegar Albert Sans o al girar el celular.
  if (w.ResizeObserver) new w.ResizeObserver(medir).observe(el);
}
