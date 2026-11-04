import { useEffect, useState } from "react";

/**
 * **Las piezas de la home que comparten las demás páginas de venta** (estándar visual 2026-11, DESIGN_SYSTEM.md §0.5):
 * la calculadora dentro del hero (`.calc`), el riel de pasos que avanza con el scroll (`.flow*`) y las piezas de
 * interfaz que lo acompañan (`.ui`, `.plate`). Salieron TAL CUAL de `CertiVehLandingComplete.tsx`: la home las
 * interpola en el mismo sitio de su hoja y su CSS compilado es byte a byte el de antes. `/otros-activos` y las fichas
 * de vehículos montan las mismas, así que un cambio aquí cambia las tres.
 *
 * Los bloques `_MOVIL` van DENTRO del `@media (max-width: 900px)` de cada página, en el mismo orden que en la home.
 */
export const CSS_CALC = `  /* ── CALCULADORA ── */
  .calc { background: #fff; color: var(--cv-ink); border-radius: 0 var(--cv-r) var(--cv-r) var(--cv-r); clip-path: polygon(48px 0, 100% 0, 100% 100%, 0 100%, 0 48px); padding: 32px 28px 28px; }
  .calc h2 { font-size: clamp(1.625rem, 1.2rem + 1.2vw, 2.25rem); font-weight: var(--cv-wh); letter-spacing: var(--cv-trk); line-height: 1.05; }
  .calc .sub { color: var(--cv-soft); font-size: .9375rem; margin-top: 8px; }
  .calc .lab { font-size: .875rem; font-weight: 600; color: var(--cv-soft); margin: 22px 0 8px; }
  .seg { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background: var(--cv-tone); border-radius: var(--cv-r); padding: 4px; }
  .seg button { font: 600 .9375rem/1.25 var(--cv-font); color: var(--cv-soft); background: transparent; border: 0; border-radius: 4px; padding: 12px 8px; cursor: pointer; transition: background-color .15s, color .15s; }
  .seg button[aria-pressed="true"] { background: #fff; color: var(--cv-ink); }
  .seg button:focus-visible { outline: 3px solid var(--cv-accent); outline-offset: 1px; }
  .val { display: flex; justify-content: space-between; align-items: baseline; margin-top: 22px; }
  .val .lab { margin: 0; }
  .val output { font-size: 1.75rem; font-weight: var(--cv-wh); letter-spacing: var(--cv-trk); color: var(--cv-accent); }
  .calc input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 44px; background: transparent; margin-top: 4px; cursor: pointer; touch-action: pan-y; }
  .calc input[type=range]::-webkit-slider-runnable-track { height: 8px; border-radius: 4px; background: linear-gradient(var(--cv-accent), var(--cv-accent)) 0 / var(--p, 14%) 100% no-repeat, var(--cv-tone-2); } /* taste-skill-ignore: relleno plano del avance del control */
  .calc input[type=range]::-moz-range-track { height: 8px; border-radius: 4px; background: var(--cv-tone-2); }
  .calc input[type=range]::-moz-range-progress { height: 8px; border-radius: 4px; background: var(--cv-accent); }
  .calc input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 28px; height: 28px; border-radius: 50%; background: var(--cv-accent); margin-top: -10px; border: 4px solid #fff; }
  .calc input[type=range]::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: var(--cv-accent); border: 4px solid #fff; }
  .calc input[type=range]:focus-visible { outline: 3px solid var(--cv-accent); outline-offset: 2px; border-radius: 4px; }
  .ends { display: flex; justify-content: space-between; font-size: .8125rem; color: var(--cv-soft); }
  .sw { display: flex; align-items: center; gap: 12px; margin-top: 18px; padding: 14px; background: var(--cv-tone); border-radius: var(--cv-r); cursor: pointer; font-weight: 600; font-size: .9375rem; }
  .sw input { position: absolute; opacity: 0; width: 1px; height: 1px; }
  .sw i { flex: none; width: 44px; height: 26px; border-radius: 13px; background: #b9c6c0; position: relative; transition: background-color .15s; }
  .sw i::after { content: ""; position: absolute; left: 3px; top: 3px; width: 20px; height: 20px; border-radius: 50%; background: #fff; transition: transform .18s; }
  .sw input:checked + i { background: var(--cv-accent); }
  .sw input:checked + i::after { transform: translateX(18px); }
  .sw input:focus-visible + i { outline: 3px solid var(--cv-accent); outline-offset: 2px; }
  .bars { display: grid; gap: 12px; margin-top: 20px; }
  .brow { display: flex; justify-content: space-between; font-size: .9375rem; }
  .brow b { font-weight: 700; }
  .btrack { height: 6px; background: var(--cv-tone-2); border-radius: 3px; margin-top: 6px; overflow: hidden; }
  .btrack i { display: block; height: 100%; background: var(--cv-accent); transition: width .4s; }
  .btrack.b2 i { background: var(--cv-ink); }
  .emp { margin-top: 12px; font-size: .875rem; background: var(--cv-tone); border-radius: var(--cv-r); padding: 10px 12px; }
  .cost { margin-top: 20px; background: var(--cv-tone); border-radius: var(--cv-r); padding: 14px 16px; font-size: .875rem; }
  .cost .h { font-weight: 700; margin-bottom: 8px; }
  .cost > div:not(.h) { display: flex; justify-content: space-between; gap: 10px; padding: 3px 0; }
  .cost .t { font-weight: 700; font-size: 1rem; padding-top: 10px; margin-top: 6px; }
  .res { margin-top: 16px; background: var(--cv-field); color: #fff; border-radius: var(--cv-r); padding: 20px; }
  .res .k { font-size: .875rem; color: var(--cv-mint); font-weight: 600; }
  .res .big { font-size: clamp(2rem, 1.4rem + 2vw, 2.75rem); font-weight: var(--cv-wh); letter-spacing: var(--cv-trk); line-height: 1.05; margin-top: 4px; }
  .res .s { font-size: .875rem; color: var(--cv-field-soft); margin-top: 4px; }
  .res .row { display: grid; gap: 2px; background: var(--cv-field-2); border-radius: 4px; padding: 12px 14px; margin-top: 10px; }
  .res .row b { font-size: 1.375rem; font-weight: var(--cv-wh); letter-spacing: var(--cv-trk); }
  .res .per { font-size: .875rem; color: var(--cv-field-soft); margin-top: 12px; }
  .res .per b { color: #fff; }
  .res .per em { font-style: normal; color: var(--cv-mint); font-weight: 700; }
  .res .cv-btn { width: 100%; margin-top: 14px; }
  .res .note { font-size: .8125rem; color: var(--cv-field-soft); margin-top: 10px; }
`;

export const CSS_CALC_MOVIL = `    .calc { padding: 26px 18px 20px; clip-path: polygon(36px 0, 100% 0, 100% 100%, 0 100%, 0 36px); }
    .seg button { min-height: 44px; }`;

export const CSS_RIEL = `  /* ── CÓMO FUNCIONA: el riel avanza con el scroll y la pieza del portal acompaña ── */
  .flow { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: clamp(12px, 2vw, 28px); margin-top: 48px; }
  .flow-steps { grid-column: 1 / span 6; list-style: none; padding-left: 40px; position: relative; }
  .flow-steps::before { content: ""; position: absolute; left: 11px; top: 14px; bottom: 14px; width: 3px; background: var(--cv-tone-2); }
  .flow-steps > li { position: relative; min-height: 46vh; padding-bottom: 40px; cursor: pointer; }
  .flow-steps > li:last-child { min-height: auto; }
  .flow-steps > li::before { content: ""; position: absolute; left: -40px; top: 6px; width: 25px; height: 25px; border-radius: 50%; background: var(--cv-bg); box-shadow: inset 0 0 0 3px var(--cv-tone-2); transition: background-color .25s, box-shadow .25s; } /* taste-skill-ignore: punto y anillo del riel de pasos */
  .flow-steps > li.done::before { background: var(--cv-accent); box-shadow: none; } /* taste-skill-ignore: pieza de interfaz del portal (data-ui) */
  .flow-steps > li.on::before { box-shadow: inset 0 0 0 7px var(--cv-accent); } /* taste-skill-ignore: punto y anillo del riel de pasos */
  .flow-steps > li > h3 { font-size: clamp(1.5rem, 1.1rem + 1.4vw, 2.25rem); font-weight: var(--cv-wh); letter-spacing: var(--cv-trk); line-height: 1.05; transition: color .25s; }
  .flow-steps > li > .subt { font-weight: 600; color: var(--cv-accent); margin-top: 6px; }
  .flow-steps > li > .desc { margin-top: 12px; max-width: 46ch; transition: color .25s; }
  .flow-steps > li > .det { font-weight: 600; margin-top: 10px; }
  /* Pasos no activos en el gris secundario (--cv-soft, 7,2:1): siguen por debajo del activo (tinta y verde) y se leen.
     Antes #94a3b8 (2,56:1) y #7aa894 (2,8:1). */
  .flow-steps > li:not(.on) > h3, .flow-steps > li:not(.on) > .desc, .flow-steps > li:not(.on) > .det { color: var(--cv-soft); }
  .flow-steps > li:not(.on) > .subt { color: var(--cv-soft); }
  .flow-steps .frag { display: none; }
  .flow-panel { grid-column: 8 / span 5; }
  .flow-sticky { position: sticky; top: 120px; background: var(--cv-tone); border-radius: var(--cv-r); min-height: 420px; display: grid; place-items: center; padding: clamp(20px, 3vw, 40px); }
`;

export const CSS_RIEL_MOVIL = `    .flow-steps { grid-column: 1 / -1; }
    .flow-panel { display: none; }
    .flow-steps > li { min-height: 0; padding-bottom: 36px; cursor: default; }
    .flow-steps > li:not(.on) > h3, .flow-steps > li:not(.on) > .desc, .flow-steps > li:not(.on) > .det { color: var(--cv-ink); }
    .flow-steps > li:not(.on) > .subt { color: var(--cv-accent); }
    .flow-steps .frag { display: block; margin-top: 18px; }
    .flow-steps .frag .ui { width: 100%; }
    /* Celular: el paso es un bloque compacto. El título, su subtítulo verde y la frase en negrita juntos como una sola
       cabecera (la frase en negrita repite la idea del subtítulo: va pegada a él, no suelta bajo el párrafo), luego el
       párrafo y la pieza. Mismo HTML y mismo orden de lectura del DOM; solo cambia el orden visual. */
    .flow-steps > li { display: flex; flex-direction: column; padding-bottom: 32px; }
    .flow-steps > li > .det { order: 1; margin-top: 2px; }
    .flow-steps > li > .desc, .flow-steps > li > .al-step-desc { order: 2; margin-top: 10px; }
    .flow-steps .frag { order: 3; margin-top: 14px; }
    .flow-steps > li > .subt { margin-top: 4px; }
    .flow-steps .frag .ui { padding: 16px; }`;

export const CSS_UI = `  /* piezas del portal (data-ui): sus propias convenciones de interfaz */
  .ui { font-family: var(--cv-font); background: #fff; border-radius: 6px; border: 1px solid var(--cv-tone-2); width: min(440px, 100%); padding: 20px; font-size: 14px; color: var(--cv-ink); letter-spacing: -0.005em; }
  .ui .t { font-size: 16px; font-weight: 700; letter-spacing: -0.02em; }
  .ui .r { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 11px 0; border-bottom: 1px solid #edf1ef; } /* taste-skill-ignore: pieza de interfaz del portal (data-ui) */
  .ui .r:last-child { border-bottom: 0; }
  /* El estado de una fila, como en la lista 2026-11 del portal: texto con color a 13 px, sin píldora. */
  .ui .ok { font-size: 13px; font-weight: 600; color: var(--cv-accent); white-space: nowrap; }
  .ui .wait { font-size: 13px; font-weight: 600; color: #92400e; white-space: nowrap; }
  .ui .prog { height: 6px; background: #edf1ef; border-radius: 3px; margin-top: 6px; overflow: hidden; }
  .ui .prog i { display: block; height: 100%; width: 72%; background: var(--cv-accent); }
  .ui .fld { display: grid; gap: 4px; padding: 8px 0; }
  .ui .fld span { font-size: 13px; color: var(--cv-soft); font-weight: 600; }
  .ui .fld b { font-weight: 600; border: 1px solid #8792a2; border-radius: 6px; padding: 9px 10px; font-size: 14px; } /* taste-skill-ignore: pieza de interfaz del portal (data-ui) */
  .ui .fld.sel b { border-color: var(--cv-accent); box-shadow: 0 0 0 3px #d5efe3; } /* taste-skill-ignore: pieza de interfaz del portal (data-ui) */
  .ui .btnui { display: block; text-align: center; background: var(--cv-accent); color: #fff; font-weight: 600; border-radius: 6px; padding: 11px; margin-top: 14px; }
  .ui .btnui.g { background: #eef2f0; color: var(--cv-ink); margin-top: 8px; }
  .ui .ej { font-size: 13px; color: #64748b; margin-top: 8px; }
  .ui .rail { list-style: none; margin-top: 14px; }
  .ui .rail li { display: flex; align-items: center; gap: 10px; padding: 7px 0; }
  .ui .rail li::before { content: ""; width: 18px; height: 18px; border-radius: 50%; flex: none; background: var(--cv-accent); }
  .ui .rail li.now { font-weight: 700; }
  .ui .rail li.now::before { background: #fff; box-shadow: inset 0 0 0 3px var(--cv-accent), 0 0 0 4px #d5efe3; } /* taste-skill-ignore: pieza de interfaz del portal (data-ui) */
  .ui .rail li.next { color: #94a3b8; }
  .ui .rail li.next::before { background: #fff; box-shadow: inset 0 0 0 2px #cbd5d1; } /* taste-skill-ignore: pieza de interfaz del portal (data-ui) */
  /* La placa: idéntica a PlacaDelVehiculo del portal (amarilla, borde de 2 px en tinta, 800, 13 px). */
  .plate { display: inline-flex; align-items: center; white-space: nowrap; background: var(--cv-plate); color: var(--cv-ink); border: 2px solid var(--cv-ink); border-radius: 3px; padding: 0 6px; font-weight: 800; font-size: 13px; line-height: 1.35; letter-spacing: .04em; }`;

/**
 * El paso activo del riel: el que cruza la franja central de la pantalla al hacer scroll (o el que se toca).
 * `selector` apunta a los `<li data-i>` del riel de ESA sección.
 */
export function useRielPorScroll(selector: string) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const items = document.querySelectorAll(selector);
    if (!("IntersectionObserver" in window) || !items.length) return;
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i)); }), { rootMargin: "-45% 0px -50% 0px" });
    items.forEach(li => io.observe(li));
    return () => io.disconnect();
  }, [selector]);
  return [active, setActive] as const;
}

/**
 * El mismo riel en una página ESTÁTICA de Astro (sin isla de React): se monta con
 * `<script is:inline set:html={JS_RIEL}>`. Cada `.flow` lleva sus `<li data-i>` y, en el panel, una pieza por paso
 * con `data-pieza="<i>"`: el paso que cruza el centro de la pantalla (o el que se toca) se marca `on`, los anteriores
 * `done`, y en el panel solo se ve su pieza. Sin JavaScript, el riel queda con el primer paso activo y todo el texto.
 */
export const JS_RIEL = `(function(){
  document.querySelectorAll('.flow').forEach(function(flow){
    var items = flow.querySelectorAll('.flow-steps > li');
    var piezas = flow.querySelectorAll('.flow-sticky [data-pieza]');
    function activar(n){
      items.forEach(function(li, k){ li.classList.toggle('on', k === n); li.classList.toggle('done', k < n); if (k === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
      piezas.forEach(function(p){ p.hidden = Number(p.getAttribute('data-pieza')) !== n; });
    }
    items.forEach(function(li, k){ li.addEventListener('click', function(){ activar(k); }); });
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) activar(Number(e.target.getAttribute('data-i'))); }); }, { rootMargin: '-45% 0px -50% 0px' });
    items.forEach(function(li){ io.observe(li); });
  });
})();`;
