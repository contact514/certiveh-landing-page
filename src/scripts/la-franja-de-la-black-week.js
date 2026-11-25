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
 */
function laFranjaDeLaBlackWeek(w, desde, hasta) {
  var d = w.document;
  var el = d.getElementById('cv-bw');
  if (!el) return;
  if (/^exotics\./.test(w.location.hostname || '')) return;
  var raiz = d.documentElement;

  var enlace = el.querySelector('a[href]');
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

  function aplicar() {
    var ahora = w.Date.now();
    var ve = ahora >= desde && ahora < hasta;
    if (el.hidden === ve) el.hidden = !ve;
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
