import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { Navbar } from "./Navbar";
import { SiteFooter } from "./SiteFooter";
import { AnimatePresence, motion } from "motion/react";
import { cotizacionDeLaHome, preciosDesde } from '@/lib/precios-de-la-landing.ts';
import { TarifaDeLaIsla, useTarifa, useTarifaDeLaIsla } from './la-tarifa-de-la-isla.ts';
import { CSS_CALC, CSS_CALC_MOVIL, CSS_RIEL, CSS_RIEL_MOVIL, CSS_UI } from './piezas-de-la-marca.ts';

/**
 * **El corte de caducidad del IVA, calculado y no escrito a mano.**
 *
 * El plazo son 5 años desde la factura (Art. 2536 CC · Concepto DIAN 673/2026), así que el mes de
 * corte se mueve solo cada mes. Estaba escrito a mano —«finales de 2021» / «anterior a septiembre
 * de 2021»— y eso dejaba **un hueco justo en el mes del corte**: una factura de septiembre de 2021
 * no era «de finales de 2021» ni «anterior a septiembre de 2021», o sea que la cohorte que vence
 * ESTE MES, la única a la que de verdad le urge, no se veía nombrada en ninguno de los dos casos.
 *
 * Y aunque se hubiera parcheado el hueco, dentro de un mes volvería: unas fechas fijas en un aviso
 * de caducidad envejecen exactamente igual que el plazo del que hablan.
 *
 * ⚠️ **El texto va en probabilidad y no en indicativo, a propósito.** Decía «el plazo ya se
 * venció», que es un veredicto jurídico dado en la home por una función sin tests, y el coste
 * de un falso positivo es un cliente que se rinde teniendo derecho. Además hay un caso real en
 * que el indicativo sería falso: una factura del 29 de febrero leída el 1 de marzo cinco años
 * después —un día cada cuatro años— vence ESE día, no antes. Con «es muy probable» el aviso
 * empuja igual y deja la última palabra en la fecha exacta, que es lo que se le pide al lector.
 */
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function corteDeCaducidadIva(hoy = new Date()) {
  // ⚠️ **Al DÍA, no al mes.** La primera versión fijaba el día a 1 y decía «si tu factura es de
  // {mes}, se te vence este mes». El plazo corre al día, así que a fin de mes **9 de cada 10 de
  // esa cohorte ya lo tenían vencido** y les decíamos que estaban a tiempo. Medido el 8-sep-2026:
  // 7 de 30 ya caducados; el día 28 serían 27 de 30.
  const corte = new Date(hoy.getFullYear() - 5, hoy.getMonth(), hoy.getDate());
  // Un 29 de febrero no existe cinco años antes y JavaScript lo desborda al 1 de marzo, o sea
  // ADELANTA el corte y daría por vencido a quien no lo está. `setDate(0)` retrocede al último
  // día del mes anterior, que es el 28.
  if (corte.getMonth() !== hoy.getMonth()) corte.setDate(0);
  return { dia: corte.getDate(), mes: MESES[corte.getMonth()], anio: corte.getFullYear() };
}

const PortalUrlContext = createContext("https://portal.certiveh.co");
const getPortalUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname === 'exotics.certiveh.co') {
    return "https://exotics.portal.certiveh.co";
  }
  return "https://portal.certiveh.co";
};
const usePortalUrl = () => {
  const [url, setUrl] = useState("https://portal.certiveh.co");
  useEffect(() => {
    const base = getPortalUrl();
    const params = new URLSearchParams(window.location.search);
    const utms = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    const kept = new URLSearchParams();
    utms.forEach(k => { const v = params.get(k); if (v) kept.set(k, v); });
    setUrl(kept.toString() ? `${base}?${kept}` : base);
  }, []);
  return url;
};

// ─────────────────────────────────────────────────────────────────────────────
// CertiVeh, Landing Page · estándar visual 2026-11 (DESIGN_SYSTEM.md §0)
//
// Dirección: «el producto en acción». Lo que en otras landings son tarjetas con iconos aquí son piezas
// del trámite de verdad: la calculadora con la tarifa vigente en el primer pantallazo, el riel de pasos
// del portal en «Así de simple», el módulo Win Win del portal. Colores, tipo y forma salen de
// `src/styles/marca.css` (variables --cv-*); esta hoja solo compone las secciones de la home.
//
// Lo que esta página NO usa, a propósito: degradados de marca, texto en degradado, sombras y brillos en
// reposo, vidrio, iconos en cuadritos, números 01/02/03, cifras en marca de agua, mayúsculas espaciadas.
// ─────────────────────────────────────────────────────────────────────────────

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: var(--cv-bg); color: var(--cv-ink); font-family: var(--cv-font); font-size: var(--cv-body); line-height: 1.5; letter-spacing: -0.01em; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
  .h-wrap { padding-inline: var(--cv-m); max-width: 1520px; margin: 0 auto; }
  .h-grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: clamp(12px, 2vw, 28px); }
  .h-intro { grid-column: 1 / span 7; }
  .h-intro p { margin-top: 18px; max-width: 58ch; }
  .h-sec { padding-top: var(--cv-gap-sec); scroll-margin-top: 80px; }
  .h-num { font-variant-numeric: normal; }
  [hidden] { display: none !important; }

  /* ── HERO: el video a pantalla completa, el texto a la izquierda y la calculadora encima ── */
  .h-hero { position: relative; padding: calc(64px + clamp(40px, 6vw, 96px)) 0 clamp(40px, 5vw, 72px); color: #fff; background: #0b1220; overflow: hidden; }
  .h-hero-media { position: absolute; inset: 0; }
  .h-hero-media video, .h-hero-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .h-hero-media::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(9,14,26,.88) 0%, rgba(9,14,26,.72) 45%, rgba(9,14,26,.35) 100%); } /* taste-skill-ignore: velo neutro sobre el video */
  .h-hero .h-grid { position: relative; z-index: 1; align-items: start; }
  .h-hero-copy { grid-column: 1 / span 7; padding-bottom: 40px; }
  .h-hero-lead { font-size: var(--cv-lead); font-weight: 600; margin-top: 28px; letter-spacing: -0.02em; }
  .h-hero-lead .flip { color: var(--cv-mint); }
  .h-hero-lead + .h-hero-sup { margin-top: 10px; }
  .h-acts { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 32px; }
  .h-figs { margin-top: 44px; display: grid; gap: 4px; }
  .h-fig { display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: baseline; gap: 16px; background: rgba(9,14,26,.62); border-radius: var(--cv-r); padding: 16px 18px; }
  .h-fig dt { font-size: var(--cv-small); color: #cbd5e1; }
  .h-fig dd { font-size: clamp(1.5rem, 1.1rem + 1.4vw, 2.125rem); font-weight: var(--cv-wh); letter-spacing: var(--cv-trk); color: var(--cv-mint); }
  .h-fig-wait { display: inline-block; width: 120px; height: 28px; border-radius: 4px; background: rgba(255,255,255,.12); }
  .h-trust { list-style: none; margin-top: 26px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; font-size: var(--cv-small); font-weight: 600; }
  .h-hero .cv-sq::before { background: var(--cv-mint); }
  .h-stage { grid-column: 8 / span 5; }
  @media (min-width: 901px) {
    .h-solo-movil { display: none; }
    .h-empezar { background: var(--cv-accent); color: #fff; }
    .h-empezar:hover { background: var(--cv-accent-hover); }
  }

${CSS_CALC}
  /* ── FRANJA DE LO QUE CUBRIMOS (carrusel continuo) ── */
  .cover { background: var(--cv-tone); overflow: hidden; }
  .cover-track { display: flex; width: max-content; animation: cvMarquee 48s linear infinite; }
  .cover:hover .cover-track { animation-play-state: paused; }
  .cover ul { list-style: none; display: flex; gap: 0 28px; padding: 22px 14px; font-size: var(--cv-small); font-weight: 600; }
  .cover li { white-space: nowrap; }
  @keyframes cvMarquee { to { transform: translateX(-50%); } }

  /* ── BALDOSAS (aliados y prensa) ── */
  .board { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
  .board.five { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  .tile { background: var(--cv-tone); border-radius: var(--cv-r); padding: 24px; min-height: 220px; display: flex; flex-direction: column; justify-content: space-between; gap: 18px; text-decoration: none; color: var(--cv-ink); transition: background-color .15s; }
  a.tile:hover { background: var(--cv-tone-2); }
  a.tile:focus-visible { outline: 3px solid var(--cv-accent); outline-offset: 3px; }
  .tile.head { grid-column: span 2; background: var(--cv-accent); color: #fff; }
  .tile.head .tile-h { font-size: clamp(1.75rem, 1.2rem + 1.6vw, 2.75rem); font-weight: var(--cv-wh); letter-spacing: var(--cv-trk); line-height: 1.02; }
  .tile.head p { color: #d6f5e8; max-width: 48ch; }
  .tile .mark { height: 72px; display: flex; align-items: center; }
  .tile .mark img { max-height: 56px; max-width: 78%; width: auto; object-fit: contain; filter: grayscale(1) contrast(1.1); }
  .tile .note { font-size: .8125rem; color: var(--cv-soft); }
  .tile .quote { font-size: 1.0625rem; font-weight: 600; line-height: 1.3; }
  .tile .meta { font-size: .875rem; color: var(--cv-soft); display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .tile .meta b { color: var(--cv-accent); font-weight: 700; }

  /* ── VENTANA UPME: campo oscuro plano (la sección es temporal; el video vive en el hero) ── */
  .win { background: var(--cv-field); color: #fff; margin-top: var(--cv-gap-sec); scroll-margin-top: 64px; }
  .win .h-wrap { padding-block: clamp(56px, 8vw, 110px); }
  .win h2 { max-width: 22ch; }
  .win p.s { max-width: 56ch; margin-top: 18px; color: #e2e8f0; }
  .win .clock-k { margin-top: 40px; font-weight: 600; color: #cbd5e1; }
  .clock { display: grid; grid-template-columns: repeat(4, auto); justify-content: start; gap: clamp(18px, 4vw, 64px); margin-top: 8px; font-variant-numeric: tabular-nums; }
  .clock b { display: block; font-size: clamp(3.5rem, 2rem + 7vw, 9.5rem); font-weight: var(--cv-wh); letter-spacing: calc(var(--cv-trk) * 1.3); line-height: .9; }
  .clock span { font-size: var(--cv-small); color: #cbd5e1; font-weight: 600; }
  .win .acts { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 26px; margin-top: 40px; }
  .win .fine { font-size: var(--cv-small); color: #cbd5e1; }
  .win .link, .h-link { font-weight: 600; color: #fff; text-decoration: none; border-bottom: 2px solid currentColor; padding-bottom: 1px; }

  /* ── BENEFICIOS: baldosas escalonadas ── */
  .steps3 { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 8px; margin-top: 56px; align-items: start; }
  .bt { border-radius: var(--cv-r); padding: clamp(24px, 3vw, 40px); display: flex; flex-direction: column; gap: 12px; background: var(--cv-tone); }
  .bt .fig { font-size: clamp(3.5rem, 2.2rem + 4.4vw, 7rem); font-weight: var(--cv-wh); letter-spacing: calc(var(--cv-trk) * 1.3); line-height: .85; color: var(--cv-accent); }
  .bt h3 { font-size: clamp(1.5rem, 1.2rem + 1vw, 2rem); font-weight: var(--cv-wh); letter-spacing: var(--cv-trk); margin-top: 8px; }
  .bt .law { font-size: var(--cv-small); color: var(--cv-soft); }
  .bt .ex { font-weight: 700; font-size: 1.125rem; margin-top: auto; padding-top: 8px; }
  .bt.a { grid-column: 1 / span 6; min-height: 72vh; background: var(--cv-accent); color: #fff; }
  .bt.a .fig { color: #fff; }
  .bt.a .law { color: #e6f8f0; }
  .bstack { grid-column: 7 / span 6; display: grid; gap: 8px; }
  .bt.b { min-height: 44vh; }
  .bt.c { min-height: 28vh; background: var(--cv-field); color: #fff; margin-top: 24px; }
  .bt.c .fig { color: var(--cv-mint); }
  .bt.c .law { color: var(--cv-field-soft); }

  /* ── SERVICIOS: los dos a la vista ── */
  .duo { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 56px; }
  .svc-col { background: var(--cv-tone); border-radius: var(--cv-r); padding: clamp(28px, 3.4vw, 52px); display: flex; flex-direction: column; }
  .svc-col.dark { background: var(--cv-field); color: #fff; }
  .svc-head { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; flex-wrap: wrap; }
  .svc-col h3 { font-size: clamp(2rem, 1.3rem + 2.4vw, 3.5rem); font-weight: var(--cv-wh); letter-spacing: var(--cv-trk); line-height: 1; }
  .svc-col .kick { font-size: var(--cv-small); font-weight: 600; color: var(--cv-soft); }
  .svc-col .price { font-size: clamp(2.5rem, 1.7rem + 2.6vw, 4.25rem); font-weight: var(--cv-wh); letter-spacing: calc(var(--cv-trk) * 1.3); line-height: .95; margin-top: 28px; color: var(--cv-accent); }
  .svc-col .per { font-size: var(--cv-small); color: var(--cv-soft); margin-top: 10px; }
  .svc-col.dark .kick, .svc-col.dark .per { color: var(--cv-field-soft); }
  .svc-col.dark .price { color: var(--cv-mint); }
  .svc-col .d { margin-top: 22px; max-width: 46ch; }
  .svc-col ul { list-style: none; margin: 18px 0 30px; display: grid; gap: 8px; font-size: 1rem; }
  .svc-col.dark .cv-sq::before { background: var(--cv-mint); }
  .svc-col .cv-btn { margin-top: auto; }

${CSS_RIEL}
${CSS_UI}
  /* La tarjeta del trámite: la misma estructura y medidas que TramiteWidget + RielDelTramite del portal. */
  .tc { background: #fff; border: 1px solid var(--cv-tone-2); border-radius: 6px; width: min(460px, 100%); color: var(--cv-ink); font-family: var(--cv-font); text-align: left; overflow: hidden; }
  .tc-h { display: flex; align-items: center; gap: 12px; padding: 16px 18px 4px; }
  .tc-img { width: 40px; height: 40px; flex: none; border-radius: 6px; background: var(--cv-tone); display: grid; place-items: center; color: #475569; }
  .tc-who { min-width: 0; flex: 1; }
  .tc-id { font-size: 13px; font-weight: 500; color: #475569; display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .tc-chip { font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 999px; color: var(--cv-accent); background: #ecfdf5; border: 1px solid #a7f3d0; white-space: nowrap; } /* taste-skill-ignore: pieza de interfaz del portal (data-ui) */
  .tc-t { font-size: 18px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; }
  .tc-pl { font-size: 14px; color: #475569; margin-top: 4px; display: flex; align-items: center; gap: 8px; }
  .tc-pct { text-align: right; flex: none; align-self: flex-start; }
  .tc-pct b { display: block; font-size: 26px; font-weight: 700; letter-spacing: -0.02em; line-height: 1; }
  .tc-pct span { font-size: 13px; font-weight: 500; color: #475569; }
  .tc-b { padding: 14px 18px 16px; }
  .tc-rail-x { overflow-x: auto; margin: 0 -18px; padding: 0 18px 4px; scrollbar-width: none; }
  .tc-rail { display: flex; min-width: 420px; padding-top: 6px; list-style: none; }
  .tc-rail li { flex: 1; display: flex; flex-direction: column; align-items: center; }
  .tc-rail .ln { display: flex; align-items: center; width: 100%; }
  .tc-rail .ln i { flex: 1; height: 2px; background: var(--cv-tone-2); }
  .tc-rail .ln i.on { background: var(--cv-accent); }
  .tc-rail .ln i.no { background: transparent; }
  .tc-rail .dot { width: 24px; height: 24px; flex: none; border-radius: 50%; display: grid; place-items: center; font-size: 11px; font-weight: 700; background: var(--cv-tone); color: #475569; }
  .tc-rail .done .dot { background: var(--cv-accent); color: #fff; }
  .tc-rail .now .dot { background: var(--cv-accent); color: #fff; box-shadow: 0 0 0 4px #d5efe3; } /* taste-skill-ignore: pieza de interfaz del portal (data-ui) */
  .tc-rail small { font-size: 10px; line-height: 1.2; text-align: center; margin-top: 6px; padding: 0 2px; color: #475569; text-wrap: balance; }
  .tc-rail .now small { color: var(--cv-accent); font-weight: 600; }
  .tc-iva { display: flex; align-items: center; gap: 12px; margin-top: 16px; padding: 14px; border-radius: 6px; background: #eef7f2; border: 1px solid rgba(4,120,87,.4); } /* taste-skill-ignore: pieza de interfaz del portal (data-ui) */
  .tc-iva b { display: block; font-size: 14px; }
  .tc-iva span { font-size: 12px; color: #475569; }
  .tc-iva .go { flex: none; width: 32px; height: 32px; border-radius: 50%; background: var(--cv-accent); color: #fff; display: grid; place-items: center; font-weight: 700; }
  .tc-f { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 16px; padding-top: 14px; box-shadow: 0 -1px 0 var(--cv-tone-2); } /* taste-skill-ignore: pieza de interfaz del portal (data-ui) */
  .tc-st { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 999px; color: #0369a1; background: #f0f9ff; border: 1px solid #bae6fd; } /* taste-skill-ignore: pieza de interfaz del portal (data-ui) */
  .tc-st.ok { color: var(--cv-accent); background: #ecfdf5; border-color: #a7f3d0; }
  .tc-acts { display: flex; gap: 8px; flex-wrap: wrap; }
  .tc-btn { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; padding: 10px 14px; border-radius: 6px; background: var(--cv-accent); color: #fff; }
  .tc-btn.g { background: var(--cv-tone); color: var(--cv-ink); }

  /* ── CONFIANZA: tres columnas livianas ── */
  .poster { list-style: none; margin-top: 48px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 44px clamp(20px, 3vw, 48px); }
  .poster li::before { content: ""; display: block; width: 28px; height: 4px; background: var(--cv-accent); margin-bottom: 18px; }
  .poster h3 { font-size: 1.375rem; font-weight: var(--cv-wh); letter-spacing: -0.015em; line-height: 1.2; }
  .poster p { color: var(--cv-soft); margin-top: 8px; max-width: 40ch; }

  /* ── ASÍ PROTEGEMOS: cada problema con su solución dentro ── */
  .prot-grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: clamp(12px, 2vw, 28px); align-items: start; }
  .prot-head { grid-column: 1 / span 4; }
  .prot-head p { margin-top: 18px; max-width: 34ch; }
  .prot-list { grid-column: 6 / span 7; display: grid; gap: 8px; }
  .prot-k { font-size: var(--cv-small); font-weight: 600; color: var(--cv-soft); margin-bottom: 4px; }
  .pcase { background: var(--cv-tone); border-radius: var(--cv-r); padding: clamp(20px, 2.4vw, 32px); }
  .pcase h3 { font-size: clamp(1.25rem, 1.05rem + .6vw, 1.5rem); font-weight: var(--cv-wh); letter-spacing: -0.02em; line-height: 1.2; }
  .pcase .pq { margin-top: 8px; color: var(--cv-soft); max-width: 56ch; }
  .pfix { background: #fff; border-radius: var(--cv-r); padding: 16px 18px 16px 22px; margin-top: 18px; box-shadow: inset 5px 0 0 var(--cv-accent); } /* taste-skill-ignore: barra de acento de la respuesta */
  .pfix span { display: block; font-size: var(--cv-small); font-weight: 600; color: var(--cv-accent); }
  .pfix p { margin-top: 2px; font-weight: 600; }

  /* ── TESTIMONIOS: una cita principal y dos al lado, rectas ── */
  .vgrid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: clamp(12px, 2vw, 28px); margin-top: 40px; background: var(--cv-field); color: #fff; border-radius: var(--cv-r); padding: clamp(32px, 5vw, 80px) clamp(20px, 4vw, 64px); }
  .vlead { grid-column: 1 / span 7; padding-right: clamp(0px, 3vw, 48px); }
  .vlead blockquote { font-size: clamp(1.375rem, 1.1rem + 1vw, 1.75rem); line-height: 1.25; letter-spacing: -0.02em; font-weight: 600; }
  .vside { grid-column: 8 / span 5; display: grid; gap: 36px; align-content: start; }
  .vq blockquote { font-size: 1.0625rem; line-height: 1.5; color: #e2e8f0; }
  .vgrid figcaption { margin-top: 16px; }
  .vgrid figcaption b { display: block; font-weight: 700; }
  .vgrid figcaption span { display: block; font-size: .9375rem; color: var(--cv-field-soft); margin-top: 2px; }

  /* ── WIN WIN: campo verde con el módulo real del portal ── */
  .ww { margin-top: var(--cv-gap-sec); background: var(--cv-accent); color: #fff; padding-block: clamp(64px, 8vw, 120px); }
  .ww .h-grid { align-items: center; }
  .ww-copy { grid-column: 1 / span 6; }
  .ww-copy .sub { font-weight: 600; margin-top: 12px; color: var(--cv-mint); }
  .ww-steps { list-style: none; margin-top: 36px; padding-left: 36px; position: relative; display: grid; gap: 24px; }
  .ww-steps::before { content: ""; position: absolute; left: 9px; top: 10px; bottom: 10px; width: 3px; background: rgba(255,255,255,.28); }
  .ww-steps li { position: relative; }
  .ww-steps li::before { content: ""; position: absolute; left: -36px; top: 4px; width: 21px; height: 21px; border-radius: 50%; background: var(--cv-mint); }
  .ww-steps h3 { font-size: 1.3125rem; font-weight: var(--cv-wh); letter-spacing: -0.02em; }
  .ww-steps p { margin-top: 4px; color: #dff5ea; max-width: 48ch; }
  .ww .fine { font-size: var(--cv-small); color: #c9ecdc; margin-top: 26px; }
  .ww .cv-btn { margin-top: 20px; }
  .ww-ui { grid-column: 8 / span 5; display: grid; place-items: center; }
  /* El módulo Win Win del portal (WinWinModule.tsx): cabecera en el verde de la marca con el código, y las cifras debajo.
     Sobre el campo verde de la sección lleva un filo blanco translúcido para separarse. */
  .ww-mod { width: min(420px, 100%); border-radius: 6px; overflow: hidden; box-shadow: 0 0 0 1px rgba(255,255,255,.35); font-family: var(--cv-font); text-align: left; } /* taste-skill-ignore: pieza de interfaz del portal (data-ui) */
  .ww-mod-h { background: var(--cv-accent); color: #fff; padding: 24px; }
  .ww-mod-k { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; margin-bottom: 12px; }
  .ww-mod-code { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .ww-mod-code span { background: rgba(255,255,255,.15); border-radius: 6px; padding: 10px 16px; font-weight: 700; font-size: 19px; letter-spacing: .05em; } /* 19 px: texto grande, AA a 3:1 sobre el blanco al 15 % del verde (a 18 px daba 4,12:1, por debajo de 4,5) */
  .ww-mod-code i { font-style: normal; background: rgba(255,255,255,.15); border-radius: 6px; width: 44px; height: 44px; display: grid; place-items: center; font-size: 17px; }
  .ww-mod-s { font-size: 14px; color: rgba(255,255,255,.9); }
  .ww-mod-b { background: #fff; color: var(--cv-ink); padding: 20px; }
  .ww-mod-n { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .ww-mod-n div { text-align: center; padding: 12px 6px; border-radius: 6px; background: var(--cv-tone); }
  .ww-mod-n b { display: block; font-size: 20px; font-weight: 700; }
  .ww-mod-n span { font-size: 11px; color: #475569; }
  .ww-mod-n .sal { background: #ecfdf5; box-shadow: inset 0 0 0 1px #a7f3d0; } /* taste-skill-ignore: pieza de interfaz del portal (data-ui) */
  .ww-mod-n .sal b { color: var(--cv-accent); font-size: 17px; }
  .ww-mod-n .sal span { color: var(--cv-accent); }
  .ww-mod-btn { display: block; text-align: center; margin-top: 16px; padding: 10px; border-radius: 6px; background: rgba(4,120,87,.05); box-shadow: inset 0 0 0 1px rgba(4,120,87,.2); color: var(--cv-accent); font-weight: 600; font-size: 13px; } /* taste-skill-ignore: pieza de interfaz del portal (data-ui) */

  /* ── PREGUNTAS: baldosas que se abren ── */
  .faq-grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: clamp(12px, 2vw, 28px); align-items: start; }
  .faq-grid > h2 { grid-column: 1 / span 4; position: sticky; top: 96px; }
  .qs { grid-column: 5 / span 8; display: grid; gap: 8px; }
  .faq-item { background: var(--cv-tone); border-radius: var(--cv-r); transition: background-color .15s; }
  .faq-item.open { background: var(--cv-accent); color: #fff; }
  .faq-btn { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px; min-height: 72px; padding: 18px 24px; background: none; border: 0; color: inherit; cursor: pointer; text-align: left; font: 600 1.1875rem/1.3 var(--cv-font); letter-spacing: -0.02em; }
  .faq-btn:focus-visible { outline: 3px solid var(--cv-accent); outline-offset: 3px; border-radius: var(--cv-r); }
  .pm { flex: none; position: relative; width: 16px; height: 16px; }
  .pm::before, .pm::after { content: ""; position: absolute; left: 0; top: 6.5px; width: 16px; height: 3px; background: currentColor; transition: transform .2s; }
  .pm::after { transform: rotate(90deg); }
  .faq-item.open .pm::after { transform: rotate(0); }
  .faq-body { padding: 0 24px 24px; max-width: 62ch; font-size: 1.0625rem; color: #eafaf2; }

  /* ── CIERRE ── */
  .close { padding-block: var(--cv-gap-sec); }
  .close-grid { align-items: end; }
  .close h2 { grid-column: 1 / span 7; }
  .close-r { grid-column: 8 / span 5; }
  .close-r p { max-width: 52ch; }
  .close-r .cv-btn { margin-top: 30px; }
  .close-r ul { list-style: none; margin-top: 26px; display: flex; flex-wrap: wrap; gap: 10px 26px; font-size: var(--cv-small); font-weight: 600; }

  /* ── MODAL DE PLAZO ── */
  .urgency-modal-overlay { position: fixed; inset: 0; background: rgba(9,14,26,.72); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; overscroll-behavior: contain; }
  .urgency-modal { position: relative; background: var(--cv-field); color: #fff; border-radius: var(--cv-r); box-shadow: 0 24px 80px rgba(0,0,0,.5); max-width: 520px; width: 100%; padding: 44px; } /* taste-skill-ignore: elemento que flota (modal o botón fijo) */
  .urgency-modal-close { position: absolute; top: 14px; right: 14px; width: 40px; height: 40px; border-radius: var(--cv-r); background: var(--cv-field-2); border: 0; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #cbd5e1; }
  .urgency-modal-close:hover { color: #fff; }
  .urgency-k { font-size: var(--cv-small); font-weight: 600; color: #fca5a5; }
  .urgency-modal h2 { font-size: clamp(1.5rem, 1.2rem + 1.4vw, 2rem); font-weight: 400; color: #cbd5e1; line-height: 1.2; margin-top: 18px; letter-spacing: var(--cv-trk); }
  .urgency-modal h3 { font-size: clamp(1.5rem, 1.2rem + 1.4vw, 2rem); font-weight: var(--cv-wh); color: var(--cv-mint); line-height: 1.2; margin: 4px 0 22px; letter-spacing: var(--cv-trk); }
  .urgency-modal p { line-height: 1.6; color: #e2e8f0; margin-bottom: 14px; }
  .urgency-modal p strong { color: var(--cv-mint); }
  .urgency-modal .fine { font-size: var(--cv-small); color: var(--cv-field-soft); }
  .urgency-modal .cv-btn { width: 100%; margin-top: 16px; }

  /* ── WhatsApp: el único botón que flota ── */
  .whatsapp-fab { position: fixed; right: 18px; bottom: calc(18px + env(safe-area-inset-bottom, 0px)); z-index: 9999; width: 56px; height: 56px; border-radius: 50%; background: #1f9d55; display: grid; place-items: center; box-shadow: 0 10px 24px rgba(15,23,42,.25); } /* taste-skill-ignore: elemento que flota (modal o botón fijo) */
  .whatsapp-fab:focus-visible { outline: 3px solid var(--cv-ink); outline-offset: 3px; }

  /* ── entrada al aparecer: solo lo que está fuera del primer pantallazo ── */
  .rv { transition: opacity .6s cubic-bezier(.2,.7,.2,1), transform .6s cubic-bezier(.2,.7,.2,1); }
  .rv.pend { opacity: 0; transform: translateY(24px); }

  /* ── celular ── */
  @media (max-width: 900px) {
    .h-hero-copy, .h-stage, .h-intro { grid-column: 1 / -1; }
    .h-hero-media::after { background: linear-gradient(180deg, rgba(9,14,26,.82) 0%, rgba(9,14,26,.7) 60%, rgba(9,14,26,.85) 100%); } /* taste-skill-ignore: velo neutro sobre el video */
${CSS_CALC_MOVIL}
    .board, .board.five { grid-template-columns: 1fr 1fr; gap: 6px; }
    .tile { min-height: 150px; padding: 18px; }
    .tile.head { grid-column: 1 / -1; }
    .tile .mark { height: 44px; }
    .tile .mark img { max-height: 38px; }
    .bt.a, .bstack { grid-column: 1 / -1; }
    /* En una columna el escalón (los 24 px de más sobre la tercera) ya no escalona nada: deja la última
       despegada (8 + 24 = 32 px frente a 8). Separación única, la misma de /otros-activos. */
    .steps3, .bstack { gap: 6px; }
    .bt.a, .bt.b, .bt.c { min-height: 0; margin-top: 0; }
    .duo { grid-template-columns: 1fr; }
${CSS_RIEL_MOVIL}
    .poster { grid-template-columns: 1fr; gap: 30px; }
    .prot-head, .prot-list { grid-column: 1 / -1; }
    .prot-head { margin-bottom: 28px; }
    .vlead, .vside { grid-column: 1 / -1; }
    .vside { margin-top: 36px; }
    .vlead { padding-right: 0; }
    .ww-copy, .ww-ui { grid-column: 1 / -1; }
    .ww-ui { margin-top: 40px; }
    .faq-grid > h2 { grid-column: 1 / -1; position: static; margin-bottom: 28px; }
    .qs { grid-column: 1 / -1; }
    .faq-btn { min-height: 64px; font-size: 1.0625rem; padding: 16px 18px; }
    .faq-body { padding: 0 18px 20px; font-size: 1rem; }
    .close h2, .close-r { grid-column: 1 / -1; }
    .close-r { margin-top: 24px; }
    .clock { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
    .urgency-modal { padding: 32px 22px; }
  }
  @media (min-width: 901px) { .prot-head { position: sticky; top: 110px; } }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { transition: none !important; animation: none !important; scroll-behavior: auto !important; }
    .rv.pend { opacity: 1; transform: none; }
  }
`;

// ── Flecha de los botones ──────────────────────────────────────────────────
const Arr = () => <span className="cv-arr" aria-hidden="true">→</span>;

// ── Entrada de cada pieza: solo lo que está fuera del primer pantallazo, y nunca se queda oculto ──
function useEntradas() {
  useEffect(() => {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const vh = window.innerHeight;
    const pend: Element[] = [];
    document.querySelectorAll(".rv").forEach(el => { if (el.getBoundingClientRect().top > vh) { el.classList.add("pend"); pend.push(el); } });
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const t = e.target as HTMLElement;
      const i = Array.prototype.indexOf.call(t.parentElement?.children ?? [], t);
      t.style.transitionDelay = Math.min(Math.max(i, 0), 5) * 75 + "ms";
      t.classList.remove("pend"); io.unobserve(t);
    }), { rootMargin: "0px 0px -8% 0px" });
    pend.forEach(el => io.observe(el));
    // red de seguridad: nada se queda oculto si el observador no llega a disparar
    const red = setTimeout(() => pend.forEach(el => el.classList.remove("pend")), 6000);
    return () => { io.disconnect(); clearTimeout(red); };
  }, []);
}


// ── FlipWords ─────────────────────────────────────────────────────────────────
// Las palabras rotan con un desplazamiento corto; sin desenfoque (era un rasgo de plantilla).
function FlipWords({ words, duration = 2800 }: { words: string[]; duration?: number }) {
  const [current, setCurrent] = useState(words[0]);
  const [animating, setAnimating] = useState(false);
  const next = useCallback(() => {
    setCurrent(words[(words.indexOf(current) + 1) % words.length]);
    setAnimating(true);
  }, [current, words]);
  useEffect(() => {
    if (!animating) { const t = setTimeout(next, duration); return () => clearTimeout(t); }
  }, [animating, duration, next]);
  return (
    // `initial={false}`: la primera palabra se pinta visible desde el HTML del servidor (sin esperar a
    // hidratar). Antes salía con opacity 0 y, sin JavaScript o con «reducir movimiento», no aparecía.
    <AnimatePresence initial={false} onExitComplete={() => setAnimating(false)}>
      <motion.span key={current} className="flip"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12, position: "absolute" }}
        transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
        style={{ display: "inline-block", position: "relative" }}
      >{current}</motion.span>
    </AnimatePresence>
  );
}

// ── LO QUE CUBRIMOS (la franja en movimiento; con «reducir movimiento» queda quieta) ──
function Ticker() {
  const items = ["Eléctricos e híbridos (no los ligeros)","Devolución de IVA · 5%","Deducción en renta · 50%","Depreciación acelerada · 3 años","Radicación automática UPME","Menos de 5 minutos","Sin portal gubernamental","Certificado UPME digital","Gestión de la devolución de IVA ante la DIAN"];
  return (
    <div className="cover">
      <div className="cover-track">
        <ul aria-label="Lo que cubrimos">{items.map(t => <li key={t} className="cv-sq">{t}</li>)}</ul>
        <ul aria-hidden="true">{items.map(t => <li key={t} className="cv-sq">{t}</li>)}</ul>
      </div>
    </div>
  );
}

// ── VENTANA UPME (Resolución UPME 563 de 2026, art. 6.1) ─────────────────────
// ⚠️ La 563 (5-ago-2026) DEROGÓ la 400 de 2026 y la 135 de 2025 y mantuvo la misma ventana. Citar
// la 400 como vigente es citar una norma derogada.
// La UPME recibe solicitudes del 1 de febrero al 15 de diciembre de cada año; las que llegan
// fuera de ese plazo «se entienden como no presentadas». La cuenta regresiva va contra el fin
// del 15 de diciembre mientras está abierta, y contra el 1 de febrero mientras está cerrada.
//
// ⚠️ **Las fechas se cuentan en hora de Colombia, no en la del navegador.** Con `new Date(año,
// 11, 15)` un visitante en Madrid veía cerrar la ventana seis horas antes que la UPME. Colombia
// no tiene horario de verano, así que es UTC-5 todo el año y basta con un desfase fijo.
const DESFASE_BOGOTA_MS = 5 * 3_600_000;

function estadoVentanaUpme(ahoraMs: number) {
  const anio = new Date(ahoraMs - DESFASE_BOGOTA_MS).getUTCFullYear();
  const abre = Date.UTC(anio, 1, 1) + DESFASE_BOGOTA_MS;    // 1 de febrero, 00:00 en Bogotá
  const cierra = Date.UTC(anio, 11, 16) + DESFASE_BOGOTA_MS; // fin del 15 de diciembre en Bogotá
  if (ahoraMs >= abre && ahoraMs < cierra) return { abierta: true, objetivo: cierra };
  const reabre = ahoraMs < abre ? abre : Date.UTC(anio + 1, 1, 1) + DESFASE_BOGOTA_MS;
  return { abierta: false, objetivo: reabre };
}

function VentanaUPME() {
  const portalUrl = usePortalUrl();

  // ⚠️ **`null` hasta montar, a propósito.** La landing se prerenderiza en el build: con la
  // hora del servidor en el HTML, cada visita hidrataría una cuenta distinta de la que el
  // navegador calcula (y un despliegue de noviembre seguiría diciendo «abierta» en enero).
  // Antes de montar se pinta el texto que es cierto todo el año y los dígitos en «--».
  const [ahora, setAhora] = useState<number | null>(null);
  useEffect(() => {
    setAhora(Date.now());
    const t = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const estado = ahora === null ? null : estadoVentanaUpme(ahora);
  const resta = estado && ahora !== null ? Math.max(0, estado.objetivo - ahora) : null;
  const unidades = [
    { val: resta === null ? null : Math.floor(resta / 86_400_000), label: "Días" },
    { val: resta === null ? null : Math.floor((resta % 86_400_000) / 3_600_000), label: "Horas" },
    { val: resta === null ? null : Math.floor((resta % 3_600_000) / 60_000), label: "Min" },
    { val: resta === null ? null : Math.floor((resta % 60_000) / 1000), label: "Seg" },
  ];
  const pad = (n: number | null) => (n === null ? "--" : String(n).padStart(2, "0")); // taste-skill-ignore: dígitos de un reloj
  const cerrada = estado?.abierta === false;
  return (
    <section id="ventana-upme" className="win" aria-labelledby="ventana-upme-titulo">
      <div className="h-wrap">
        <h2 id="ventana-upme-titulo" className="h-h2 cv-sec-title">
          {cerrada ? <>La UPME vuelve a recibir solicitudes el 1 de febrero</> : <>La UPME recibe solicitudes hasta el 15 de diciembre</>}
        </h2>
        <p className="s cv-sec-intro">
          {cerrada
            ? "La UPME recibe solicitudes de certificado del 1 de febrero al 15 de diciembre de cada año. Puedes preparar tu trámite desde ahora y lo radicamos apenas se abra la ventana."
            : "Después de esa fecha, la UPME no recibe más solicitudes de certificado hasta el 1 de febrero. Tú subes tus documentos y nosotros radicamos tu solicitud ante la UPME."}
        </p>
        <p className="clock-k">{cerrada ? "La ventana abre en" : "La ventana cierra en"}</p>
        <div className="clock" role="timer" aria-label={cerrada ? "Tiempo para que abra la ventana de radicación" : "Tiempo para que cierre la ventana de radicación"}>
          {unidades.map((u) => (
            <div key={u.label}><b>{pad(u.val)}</b><span>{u.label}</span></div>
          ))}
        </div>
        <div className="acts">
          <a className="cv-btn cv-btn-a" href={portalUrl} target="_blank" rel="noopener noreferrer">
            {cerrada ? "Preparar mi trámite ahora" : "Empezar mi trámite ahora"} <Arr />
          </a>
          <span className="fine">Resolución UPME 563 de 2026 · Hora de Colombia</span>
          <a className="link" href="/blog/cierre-ventana-upme-15-diciembre-2026">Qué pasa si no alcanzas a radicar</a>
        </div>
      </div>
    </section>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────
// El video ocupa todo el primer pantallazo (es permanente: no depende de la sección temporal de la
// ventana UPME) y la calculadora, que es lo único que el visitante puede HACER en la página, va encima.
function Hero() {
  const portalUrl = usePortalUrl();
  const flipWords = ["devolución de IVA","deducción en renta","depreciación acelerada","un certificado UPME"];

  const fmtM = (n: number) => {
    const m = Math.round(n / 1_000_000);
    return "$" + m.toLocaleString("es-CO") + "M+";
  };

  const videoRef = useCallback((el: HTMLVideoElement | null) => {
    if (!el) return;
    el.muted = true;
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "");
    const tryPlay = () => { el.play().catch(() => {}); };
    tryPlay();
    el.addEventListener("canplay", tryPlay, { once: true });
    el.addEventListener("loadeddata", tryPlay, { once: true });
    document.addEventListener("touchstart", tryPlay, { once: true });
  }, []);

  const [stats, setStats] = useState<{ vehiculos_gestionados: number; deducciones_renta: number; iva_por_devolver: number } | null>(null);

  useEffect(() => {
    const fetchStats = () => {
      fetch("https://ykolfdgnlaxahtbuurgj.supabase.co/functions/v1/public-stats")
        .then(r => r.json())
        .then(data => {
          if (data.vehiculos_gestionados) setStats(data);
        })
        .catch(() => {});
    };
    fetchStats();
    const interval = setInterval(fetchStats, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" aria-label="Portada - CertiVeh" className="h-hero cv-hero-full">
      <div className="h-hero-media" aria-hidden="true">
        <video ref={videoRef} autoPlay muted loop playsInline preload="auto" poster="/hero-bg-poster.webp">
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="h-wrap h-grid">
        <div className="h-hero-copy">
          <h1 className="cv-hero-title">Reclama los beneficios tributarios de tu carro eléctrico o híbrido en Colombia</h1>
          <p className="h-hero-lead">Accede a <span style={{ position: "relative", display: "inline-block" }}><FlipWords words={flipWords} duration={2800}/></span></p>
          <p className="h-hero-sup cv-hero-sub">Tramitamos tu certificado UPME, el documento que desbloquea tus beneficios tributarios, y gestionamos tu devolución de IVA ante la DIAN. Tú subes tus documentos y nosotros preparamos tu solicitud.</p>
          <div className="h-acts">
            {/* «Calcular mi beneficio» solo lleva a la calculadora: en escritorio ya está al lado y se oculta;
                en el celular queda debajo de las cifras y el botón ahorra el scroll. Entonces, en escritorio,
                la acción principal (verde) es empezar el trámite. */}
            <a className="cv-btn cv-btn-a h-solo-movil" href="#calculadora">Calcular mi beneficio <Arr /></a>
            <a className="cv-btn cv-btn-w h-empezar" href={portalUrl} target="_blank" rel="noopener noreferrer">Empezar mi trámite ahora <Arr /></a>
          </div>
          <dl className="h-figs">
            {[
              { num: stats ? fmtM(stats.vehiculos_gestionados) : null, label: "en vehículos gestionados" },
              { num: stats ? fmtM(stats.deducciones_renta) : null, label: "en deducciones de renta" },
              { num: stats ? fmtM(stats.iva_por_devolver) : null, label: "en IVA por devolver" },
            ].map(s => (
              <div className="h-fig" key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.num ?? <span className="h-fig-wait" aria-hidden="true" />}</dd>
              </div>
            ))}
          </dl>
          <ul className="h-trust">
            {["Sin cuenta en la UPME","Notificaciones WhatsApp","Solo pagas una vez","100% en línea"].map(t => <li key={t} className="cv-sq">{t}</li>)}
          </ul>
        </div>
        <div className="h-stage"><Calculadora /></div>
      </div>
    </section>
  );
}

// ── ALIADOS ─────────────────────────────────────────────────────────────────
function Aliados() {
  return (
    <section aria-label="Aliados de CertiVeh" className="h-wrap" style={{ paddingTop: "clamp(56px, 7vw, 96px)" }}>
      <div className="board five">
        <div className="tile head rv"><p className="tile-h">Aliados que confían en CertiVeh</p></div>
        {[
          { src: "/aliados-seguros-mundial.png", alt: "Seguros Mundial", note: "Compañía Mundial de Seguros S.A. · Vigilado Superintendencia Financiera de Colombia" },
          { src: "/aliados-fonlenovo.png", alt: "FonLenovo - El Fondo inteligente para todos", note: "" },
          { src: "/aliados-exotics.png", alt: "ExoticsCo", note: "" },
        ].map(a => (
          <div className="tile rv" key={a.src}>
            <div className="mark"><img src={a.src} alt={a.alt} loading="lazy" /></div>
            {a.note && <p className="note">{a.note}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── BENEFICIOS ────────────────────────────────────────────────────────────────
function Beneficios() {
  // ⚠️ **«te devuelven» EN EL EJEMPLO DE LA TARJETA DE IVA ES UNA DECISIÓN EXPLÍCITA DE JULIAN**
  // (9-sep-2026), reafirmada después de que yo señalara el motivo por el que estaba retirado.
  //
  // El motivo sigue siendo cierto y conviene tenerlo escrito: **la DIAN estudia y decide**, y por
  // encima de 1.000 UVT paga en TIDIS en vez de consignar. Por eso el resto del producto usa
  // «solicitas» / «puedes solicitar», y por eso el portal tiene una guarda —el barrido del pago de
  // la DIAN— que prohíbe prometer el depósito en `src/`.
  //
  // Aquí se acepta porque es un CHIP de ejemplo aritmético junto al porcentaje, no una promesa de
  // servicio, y porque el dueño lo pidió sabiendo el motivo. **Lo que NO se puede hacer es
  // extenderlo**: en la descripción de la tarjeta, en la de Servicio 2, en la FAQ, en el portal o
  // en los agentes, el verbo sigue siendo «solicitar». Si alguna vez se propaga, esto deja de ser
  // un chip y pasa a ser la promesa que el producto no puede cumplir.
  const cards = [
    { icon: "percent",  tag: "IVA",     title: "Devolución de IVA",        pct: "5%", accentColor: "var(--emerald-600)", iconBg: "rgba(5,150,105,0.1)", bgColor: "var(--emerald-50)", borderColor: "var(--emerald-200)", desc: "Con el certificado UPME puedes solicitar a la DIAN la devolución del 100% del IVA pagado en la compra (5% del valor).", ejemplo: "$150M → te devuelven $7.500.000", norma: "Art. 12, Ley 1715/2014 (mod. art. 9, Ley 2099/2021)" },
    { icon: "fileText", tag: "Renta",   title: "Deducción en renta",     pct: "50%", accentColor: "var(--teal-500)", iconBg: "rgba(20,184,166,0.1)", bgColor: "var(--teal-50)", borderColor: "var(--teal-200)", desc: "Personas naturales y jurídicas pueden deducir hasta el 50% del valor del vehículo en su declaración de renta.", ejemplo: "$150M → deduces $75.000.000", norma: "Art. 11, Ley 1715/2014 (mod. art. 8, Ley 2099/2021)" },
    { icon: "zap",      tag: "Depreciación", title: "Depreciación acelerada",   pct: "3 años",  accentColor: "var(--teal-500)", iconBg: "rgba(20,184,166,0.1)", bgColor: "var(--teal-50)", borderColor: "var(--teal-200)", desc: "Independientes y empresas deprecian el vehículo en 3 años en lugar de 5, reduciendo la base gravable más rápido.", ejemplo: "Solo independientes y empresas", norma: "Art. 14, Ley 1715/2014 (mod. art. 11, Ley 2099/2021) y Decreto 895/2022" },
  ];
  const [iva, renta, dep] = cards;
  const Baldosa = ({ c, cls }: { c: typeof cards[number]; cls: string }) => (
    <article className={`bt ${cls} rv`}>
      <div className="fig">{c.pct}</div>
      <h3>{c.title}</h3>
      <p>{c.desc}</p>
      <p className="law">{c.norma}</p>
      <p className="ex">{c.ejemplo}</p>
    </article>
  );
  return (
    <section id="beneficios" aria-label="Beneficios tributarios" className="h-sec h-wrap">
      <div className="h-grid"><div className="h-intro rv">
        <h2 className="h-h2 cv-sec-title">Tres beneficios tributarios. Una sola gestión.</h2>
        <p className="cv-sec-intro">El Estado colombiano creó estos incentivos para promover la movilidad eléctrica e híbrida. La mayoría de propietarios nunca los reclama, por la complejidad del proceso.</p>
      </div></div>
      <div className="steps3">
        <Baldosa c={iva} cls="a" />
        <div className="bstack">
          <Baldosa c={renta} cls="b" />
          <Baldosa c={dep} cls="c" />
        </div>
      </div>
    </section>
  );
}

// ── SERVICIOS ────────────────────────────────────────────────────────────────
function Servicios() {
  const portalUrl = usePortalUrl();
  // Las cifras de las tarjetas salen de la tarifa (ajuste de precios, lote 4).
  const desde = preciosDesde(useTarifa());
  const servicios = [
    {
      icon: "shield",
      tag: "Servicio 1",
      title: "Certificado UPME",
      desc: "Gestionamos todo el trámite por ti: creamos tu cuenta, llenamos formularios y radicamos tu solicitud. Tú solo subes tus documentos.",
      price: desde.pesos.certificado,
      priceNote: "+ IVA + costo trámite UPME",
      features: ["Radicación automática ante la UPME", "Radicación aun si tu modelo no está en el listado", "Respuesta a requerimientos UPME", "Certificado digital, listo para descargar", "Desbloquea los 3 beneficios tributarios"],
      accentColor: "var(--emerald-600)",
      iconBg: "rgba(5,150,105,0.1)",
    },
    {
      icon: "receipt",
      tag: "Servicio 2",
      title: "Devolución de IVA",
      // ⚠️ **LO QUE NO SE REPITE ES EL REENVÍO: vive solo en la nota.** La CONDICIÓN de la cita
      // va aquí Y en la viñeta, porque la viñeta promete —«la pedimos nosotros»— y una promesa sin
      // condición es falsa: solo la exigen cinco seccionales.
      //
      // Esta descripción llegó a decir la cita TRES veces y el reenvío DOS, en un bloque que el
      // lector ve de una sola ojeada. Y este mismo aviso ya se escribió una vez diciendo que
      // «aquí no se repite ni la cita ni el reenvío» — falso sobre su propia línea de debajo, que
      // sí nombra la cita, y falso sobre la nota, que también la nombraba. Prohibir la palabra no
      // vale: lo que hay que repartir es qué AFIRMA cada sitio.
      //
      // ⚠️ **Y ABRE POR LO QUE HACEMOS, NO POR LO QUE SALE MAL** (Julian, 9-sep-2026). La versión
      // anterior arrancaba con «si la pides tú, gastas el cupo y tu trámite se atasca»: tres
      // líneas de consecuencia y ninguna de servicio, en la tarjeta que existe para describir el
      // servicio. El hecho de la cita única SE QUEDA —es el argumento y lo exigen las guardas del
      // portal— pero como razón de que la pidamos nosotros, no como amenaza.
      //
      // Y «$6.000.000 de vuelta» prometía caja: la DIAN estudia y decide. El mismo verbo se
      // corrigió en la tarjeta de Beneficios y esta se quedó sin mirar.
      //
      // ⚠️ **NI EL EJEMPLO DE $6.000.000 NI LA CIFRA VAN AQUÍ** (Julian, 9-sep-2026). El dinero ya
      // lo cuenta la sección de Beneficios y la calculadora; en la tarjeta que describe el
      // servicio, repetirlo robaba las tres líneas que tenía para decir qué hacemos.
      //
      // ⚠️ **Y «pedimos la cita» VA CONDICIONADO, SIEMPRE.** Solo la exigen 5 de 34 seccionales:
      // sin la condición, esta frase es falsa para la mayoría de los que la leen. Es el motivo por
      // el que la condición vive aquí Y en la viñeta.
      desc: "Preparamos tus documentos, pedimos la cita por ti si tu seccional la exige y seguimos tu trámite hasta que la DIAN consigna tu devolución.",
      price: `Desde ${desde.pesos.ivaPaquete}`,
      priceNote: "+ IVA · contratando junto al certificado UPME",
      // ⚠️ **LA OBLIGACIÓN SE DESCRIBE POR SU RESULTADO, NO POR EL TRÁMITE.** Decía «(tú autenticas
      // el poder en notaría, presencial y a tu costa)» y hoy dice «(tú nos adjuntas el poder
      // autenticado)». Instrucción de Julian, 9-sep-2026, literal: *«no me gusta que se mencione lo
      // de la notaría, de que el usuario debe ir presencial y pagar; simplemente que debe adjuntar
      // el poder autenticado bajo esa modalidad»*.
      //
      // **LO QUE NO PUEDE PASAR ES QUE LA OBLIGACIÓN DESAPAREZCA.** Sigue siendo suya y sigue
      // dicha: «nos adjuntas» lo afirma igual de claro que «autenticas en notaría». Borrarla
      // entera sería la asimetría que esta tarjeta lleva tres rondas corrigiendo — enumerar lo que
      // hacemos nosotros y callar lo que le toca a él.
      //
      // Y los tres hechos que se retiran —notaría, presencial, quién paga— siguen escritos en
      // `llms.txt` y en el conocimiento de Camila y del agente de WhatsApp, que es donde se
      // contestan CUANDO PREGUNTA. Son una respuesta, no un argumento de venta.
      //
      // Este mismo cambio se aplicó el mismo día a `aviso-de-entrega.ts` del portal, con el mismo
      // razonamiento escrito. Si algún día se revierte uno, hay que revertir el otro.
      //
      // ⚠️ **TODO LO ANTERIOR ES HISTORIA DESDE EL 6-OCT-2026.** El poder a CertiVeh dejó de
      // ofrecerse (decisiones 110, 111 y 146 de Julian): el Formulario 010 lo firma siempre el
      // cliente, en línea, y Bogotá radica igual que las demás seccionales con cita. Ningún copy
      // de esta tarjeta nombra ya ese poder. El único poder que se sigue pidiendo es el del
      // copropietario, cuando la factura tiene varios compradores, y ese sí se autentica en
      // notaría: por eso ningún copy dice «sin notaría», y por eso «en línea» solo se dice de lo
      // que de verdad se firma en línea (el 010 y la declaración juramentada), nunca de «tus
      // documentos» en general: con copropietario, el mandato lo firman a mano él y el titular.
      // El hero, el paso 06 y la meta descripción dicen «firmas» a secas por eso mismo.
      //
      // ⚠️ **«Respuesta a requerimientos DIAN», Y ESTUVO MAL ESCRITA DOS VECES ANTES DE ACERTAR.**
      //
      // Primero no se puso, alegando que los T&C asignan esa atención al usuario. Después se puso
      // como «Te avisamos si la DIAN pide algo más», que es **falso**: Julian lo corrigió el
      // 9-sep-2026 con el dato que faltaba —«los requerimientos llegan al USUARIO, no a nosotros,
      // por lo tanto nosotros no somos los que avisamos; pero sí les ayudamos a solucionar esos
      // requerimientos o subsanaciones»—. O sea que la versión «prudente» inventaba un aviso que
      // no existe, que es peor que la que se quería evitar.
      //
      // Lo cierto, y lo que dice la viñeta: el requerimiento le llega a él y nosotros le ayudamos
      // a resolverlo. Por eso hace juego con «Respuesta a requerimientos UPME» de la tarjeta
      // hermana, y por eso NO dice «te avisamos».
      //
      // Sigue en pie que los T&C redactan esa atención como responsabilidad del Usuario: es el
      // §4 de `docs/decisiones-abiertas-para-julian.md`, un punto ya abierto para la abogada.
      // Ayudar a resolverlo no lo contradice; lo que lo contradiría es prometer que respondemos
      // nosotros en su nombre.
      //
      // ⚠️ **EL ORDEN ES EL DEL TRÁMITE, y las seis caben de una ojeada** (Julian, 9-sep-2026):
      // primero lo que armamos, luego lo que gestionamos ante la DIAN, luego las dos cosas que le
      // quedan a él (reenviar y firmar), y al final la vigilancia y lo que dura. Seis viñetas; la
      // alineación con la tarjeta del certificado la da el `marginTop: auto` del bloque, no que
      // haya el mismo numero.
      //
      // ⚠️ **LA TERCERA LLEVA EL REENVÍO («Correo de radicación ya redactado y listo, tú lo
      // reenvías») Y ESO NO ES ADORNO.** Antes esa obligación vivía en la nota de abajo, que se
      // retiró. Si alguien recorta ese trozo, el reenvío desaparece de la tarjeta entera y volvemos
      // al fallo del 3-sep: gente que no reenviaba y cuyo expediente NO SE RADICABA sin enterarse.
      // Puede moverse de sitio; no puede desaparecer.
      //
      // ⚠️ **EL REENVÍO VALE PARA TODAS LAS SECCIONALES, BOGOTÁ INCLUIDA (6-oct-2026).** Del 29-sep
      // al 6-oct la tercera decía «Fuera de Bogotá…» y la cuarta «En Bogotá, firmas tú o nos das un
      // poder», porque Bogotá radicaba por videoatención. Ya no: no hay videoatención, Bogotá
      // radica como las demás seccionales con cita y el poder a CertiVeh no se ofrece (decisiones
      // 110, 111 y 146). La cuarta dice desde el 8-oct-2026 «Firmas en línea, sin papeleo» (Julian: la gente no sabe
      // qué es el 010 ni la declaración). El detalle de qué se firma lo da la FAQ de la devolución.
      //
      // ⚠️ **LAS DOS MIDEN CASI LO MISMO QUE LAS QUE SUSTITUYEN (57 y 42 caracteres, frente a 57
      // y 39) Y NO ES CASUALIDAD:** medidas de 320 a 1920 px, parten línea igual que las de
      // antes y la tarjeta conserva su alto. Con 39 caracteres («Firmas en línea el 010…») la
      // cuarta cabía en un renglón a 390 px y la tarjeta perdía 21 px. Quien las retoque, que
      // cuente los renglones a varios anchos antes y después.
      features: ["Generamos tu expediente completo", "Pedimos nosotros tu cita, si tu seccional la exige", "Correo de radicación ya redactado y listo, tú lo reenvías", "Firmas en línea, sin papeleo", "Respuesta a requerimientos DIAN", "Seguimos tu trámite hasta que la DIAN consigna"],
      // ⚠️ **AQUÍ VIVÍA LA NOTA «¿Cómo se radica?», Y SE RETIRÓ EL 9-SEP-2026 (Julian).** Su aviso
      // decía «ESTA NOTA NO SE QUITA», y el motivo era bueno: es la única tarea que la DIAN no
      // admite hacer por él (exige que la radicación salga del correo inscrito en SU RUT, en
      // todas las seccionales) y callarla fue el fallo del 3-sep, con gente que no reenviaba y
      // cuyo expediente NO SE RADICABA sin enterarse.
      //
      // **Se puede quitar porque lo que protegía NO se ha ido, ha cambiado de sitio.** El reenvío
      // pasó a la tercera viñeta («Correo de radicación ya redactado y listo, tú lo reenvías»), y
      // la declaración juramentada la dice la FAQ de la devolución («Tú firmas en línea la
      // declaración juramentada y el Formulario 010…»); la cuarta viñeta solo dice «Firmas en
      // línea, sin papeleo» desde el 8-oct-2026. El subtítulo de Confianza
      // se retiró por largo el 9-sep y el paso 06 no la nombra. Antes de tocar la viñeta o la FAQ,
      // comprobar que queda la otra: el día que no quede ninguna, la tarjeta vuelve a enumerar
      // solo lo nuestro, que es la asimetría de siempre.
      accentColor: "var(--teal-500)",
      iconBg: "rgba(20,184,166,0.1)",
    },
  ] as Array<{ icon: string; tag: string; title: string; desc: string; price: string; priceNote: string; features: string[]; accentColor: string; iconBg: string }>;
  return (
    <section id="servicios" aria-label="Servicios CertiVeh" className="h-sec h-wrap">
      <div className="h-grid"><div className="h-intro rv">
        <h2 className="h-h2 cv-sec-title">Dos servicios. Cero burocracia.</h2>
        <p className="cv-sec-intro">CertiVeh gestiona el certificado UPME y la devolución de tu IVA ante la DIAN.</p>
      </div></div>
      <div className="duo">
        {servicios.map((s, i) => (
          <article key={s.title} className={`svc-col rv${i === 1 ? " dark" : ""}`}>
            <div className="svc-head"><h3>{s.title}</h3><p className="kick">{s.tag}</p></div>
            <div className="price">{s.price}</div>
            <p className="per">{s.priceNote}</p>
            <p className="d">{s.desc}</p>
            <ul>{s.features.map(f => <li key={f} className="cv-sq">{f}</li>)}</ul>
            <a className={`cv-btn ${i === 1 ? "cv-btn-w" : "cv-btn-a"}`} href={portalUrl} target="_blank" rel="noopener noreferrer">
              {i === 0 ? "Empezar mi trámite" : "Solicitar devolución de IVA"} <Arr />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

// ── ASÍ PROTEGEMOS TU BENEFICIO ───────────────────────────────────────────────
function PorQueNoSolo() {
  const items = [
    {
      num: "01", // taste-skill-ignore: clave interna del dato, no se pinta
      title: "Tu vehículo no aparece en el listado",
      problema: "Si la línea o modelo no está en el listado de la UPME, la solicitud requiere documentación técnica adicional para poder radicarse.",
      solucion: "Gestionamos la documentación técnica para radicar aunque tu modelo no aparezca en el listado.",
    },
    {
      num: "02", // taste-skill-ignore: clave interna del dato, no se pinta
      title: "Referencia equivocada en el certificado",
      problema: "Una diferencia mínima en la denominación puede invalidar el certificado. Versiones que parecen iguales se registran como referencias distintas.",
      solucion: "Verificamos la referencia exacta y reunimos la documentación adicional si no aparece en la base.",
    },
    {
      num: "03", // taste-skill-ignore: clave interna del dato, no se pinta
      title: "El valor debe registrarse antes de impuestos",
      problema: "El valor en el certificado debe ser antes de impuestos y descuentos. Registrar el total de la factura puede impedir la aplicación de los beneficios.",
      solucion: "Validamos todos los valores antes de radicar para que el certificado sea coherente con la DIAN.",
    },
    {
      num: "04", // taste-skill-ignore: clave interna del dato, no se pinta
      title: "Leasing, prenda o copropiedad",
      problema: "La UPME no tiene un proceso estándar documentado para estos escenarios. Sin experiencia previa, los errores son difíciles de corregir una vez radicados.",
      solucion: "Gestionamos estos escenarios con el proceso correcto para que el certificado quede bien emitido.",
    },
    {
      num: "05", // taste-skill-ignore: clave interna del dato, no se pinta
      title: "Certificado correcto hoy, auditoría después",
      problema: "El certificado recoge lo que registras sin verificar que los valores y referencias sean correctos. Un error es difícil de corregir una vez emitido.",
      solucion: "Revisamos que el certificado quede perfectamente emitido para que resista una eventual auditoría.",
    },
  ];
  return (
    <section aria-label="Así protegemos tu beneficio" className="h-sec h-wrap">
      <div className="prot-grid">
        <div className="prot-head rv">
          <h2 className="h-h2 cv-sec-title">Así protegemos tu beneficio.</h2>
          <p className="cv-sec-intro">Estos son los errores que hacen que la UPME rechace solicitudes. Los prevenimos antes de radicar.</p>
        </div>
        <div className="prot-list">
          <p className="prot-k">Problemas comunes</p>
          {items.map(item => (
            <article key={item.num} className="pcase rv">
              <h3>{item.title}</h3>
              <p className="pq">{item.problema}</p>
              <div className="pfix"><span>Cómo lo resuelve CertiVeh</span><p>{item.solucion}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CÓMO FUNCIONA ─────────────────────────────────────────────────────────────
// El riel avanza con el scroll (o al tocar un paso) y a la derecha va la pieza del portal de ese paso.
// En el celular cada paso lleva su pieza debajo. Las piezas usan los rótulos reales del portal; las
// cifras del pago salen de la tarifa vigente para un vehículo de $120M.
const RIEL_PORTAL = ["En borrador","Solicitud enviada","Registro en UPME","Esperando ventana UPME","Trámite en UPME","Espera de certificado","Certificado emitido"];
/** La tarjeta del trámite del portal (TramiteWidget + RielDelTramite + PlacaDelVehiculo), en un estado de ejemplo. */
function TarjetaDelTramite({ paso, iva = false }: { paso: number; iva?: boolean }) {
  const pct = Math.round(((paso - 1) / (RIEL_PORTAL.length - 1)) * 100);
  const emitido = paso === RIEL_PORTAL.length;
  return (
    <div className="tc" data-ui>
      <div className="tc-h">
        <div className="tc-img" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17h14M5 17a2 2 0 1 0 4 0M15 17a2 2 0 1 0 4 0M3 17V11l2-5h14l2 5v6"/></svg></div>
        <div className="tc-who">
          <div className="tc-id">AF284586 <span className="tc-chip">Certificado UPME</span></div>
          <div className="tc-t">BYD Seagull · 2026</div>
          <div className="tc-pl"><span className="plate">AB**12</span> Eléctrico</div>
        </div>
        <div className="tc-pct"><b>{pct}%</b><span>completado</span></div>
      </div>
      <div className="tc-b">
        <div className="tc-rail-x"><ol className="tc-rail">
          {RIEL_PORTAL.map((s, k) => {
            const n = k + 1, estado = n < paso || emitido ? "done" : n === paso ? "now" : "";
            return (<li key={s} className={estado}>
              <div className="ln"><i className={k === 0 ? "no" : n <= paso ? "on" : ""} /><span className="dot">{estado === "done" ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg> : n}</span><i className={k === RIEL_PORTAL.length - 1 ? "no" : n < paso ? "on" : ""} /></div>
              <small>{s}</small>
            </li>);
          })}
        </ol></div>
        {iva && (<div className="tc-iva"><span style={{ flex: 1 }}><b>Empezar mi expediente de devolución de IVA</b><span>Ya la pagaste con tu certificado. No tienes que pagar nada más.</span></span><span className="go" aria-hidden="true">→</span></div>)}
        <div className="tc-f">
          <span className={`tc-st${emitido ? " ok" : ""}`}>{emitido ? "¡Certificado emitido!" : RIEL_PORTAL[paso - 1]}</span>
          <span className="tc-acts">{emitido && <span className="tc-btn g">Descargar certificado</span>}<span className={`tc-btn${emitido ? " g" : ""}`}>Ver detalle →</span></span>
        </div>
        <p className="ej" style={{ fontSize: 12, color: "#64748b", marginTop: 10 }}>Datos de ejemplo</p>
      </div>
    </div>
  );
}

function PiezaDelPaso({ i }: { i: number }) {
  const tarifa = useTarifa();
  const c = cotizacionDeLaHome(120_000_000, false, tarifa);
  const pz = (n: number) => "$" + Math.round(n).toLocaleString("es-CO");
  switch (i) {
    case 0: return (<div className="ui" data-ui><div className="t">Documentos</div><div className="r"><span>Cédula (frente y reverso)</span><span className="ok">Leída</span></div><div className="r"><span>Tarjeta de propiedad (frente y reverso)</span><span className="ok">Leída</span></div><div className="r" style={{ display: "block" }}><div style={{ display: "flex", justifyContent: "space-between" }}><span>Factura de compra</span><span className="wait">Subiendo</span></div><div className="prog"><i /></div></div></div>);
    case 1: return (<div className="ui" data-ui><div className="t">Confirma tus datos</div><div className="fld"><span>Marca</span><b>BYD</b></div><div className="fld"><span>Línea</span><b>Seagull</b></div><div className="fld sel"><span>Valor del vehículo (sin IVA)</span><b>$120.000.000</b></div><span className="btnui">Confirmar</span><p className="ej">Datos de ejemplo</p></div>);
    case 2: return (<div className="ui" data-ui><div className="t">Resumen del pago</div><div className="r"><span>Servicio de tramitación</span><b>{pz(c.honorariosBase)}</b></div><div className="r"><span>IVA (19% sobre tramitación)</span><b>{pz(c.ivaServicio)}</b></div><div className="r"><span>Trámite ante UPME</span><b>{pz(c.costoUPME)}</b></div><div className="r" style={{ fontWeight: 800, fontSize: 16 }}><span>Total</span><b>{pz(c.costoTotal)}</b></div><span className="btnui">Pagar</span><p className="ej">Para un vehículo de $120M</p></div>);
    case 3: return <TarjetaDelTramite paso={5} />;
    case 4: return <TarjetaDelTramite paso={7} />;
    default: return <TarjetaDelTramite paso={7} iva />;
  }
}

function ComoFunciona() {
  const steps = [
    { num: "01", icon: "upload",      title: "Sube tus documentos",    subtitle: "Menos de 3 minutos",       desc: "Solo necesitas tu cédula, tarjeta de propiedad y factura de compra. La IA extrae los datos automáticamente.", detail: "Sin formularios manuales. Sin errores de digitación." }, // taste-skill-ignore: clave interna del dato, no se pinta
    { num: "02", icon: "checkCircle", title: "Revisa y confirma",      subtitle: "30 segundos",              desc: "Verificas que los datos extraídos sean correctos. Puedes editar cualquier campo antes de continuar. Una vez confirmas, nos pones a trabajar.", detail: "Extracción automática de información con IA." }, // taste-skill-ignore: clave interna del dato, no se pinta
    { num: "03", icon: "lock",        title: "Solo pagas una vez",     subtitle: "Sin suscripciones",             desc: "Pagas nuestra tarifa de servicio una sola vez. Sin suscripciones. Aparte va el costo del trámite ante la UPME. El pago confirma tu caso y activa el proceso.", detail: "Paga con tu método favorito o a cuotas sin interés." }, // taste-skill-ignore: clave interna del dato, no se pinta
    // ⚠️ EL PASO 04 PROMETÍA «todo» Y «Tú no haces nada más», Y CON EL PASO 06 LAS DOS SON FALSAS.
    // Eran ciertas mientras los cinco pasos describían solo el certificado —ahí, en efecto, no le
    // queda nada—. Desde que la lista llega hasta la devolución de IVA, «todo» y «nada más»
    // contradicen al 06, que le pide firmar la juramentada y reenviar un correo. Es el defecto que
    // el aviso del subtítulo de la sección documenta, movido un renglón: el paso no miente, miente
    // lo que lo rodea.
    //
    // Se corrigen LOS DOS, y el título también, porque arreglar solo el subtítulo deja «Nosotros
    // hacemos todo» cuatro renglones por encima de un paso que reparte tareas. Ahora los dos van
    // acotados al certificado, que es lo que este paso describe de verdad.
    //
    // ⚠️ Y el subtítulo NO puede ser «Sin portales gubernamentales»: eso es, palabra por palabra,
    // lo que ya dice el `detail` de esta misma tarjeta, y las dos se pintan juntas. Se probó y se
    // retiró el mismo día.
    //
    // ⚠️⚠️ **Y EL TÍTULO NO PUEDE TERMINAR EN «el trámite». ROMPE EL BUILD, EN SILENCIO.** Estuvo
    // en «Nosotros hacemos el trámite» y el HTML generado salía con un **byte NUL dentro de la
    // palabra**: `Nosotros hacemos el tr\0ámite`. Se sirvió así en producción.
    //
    // Es la trampa que este repo ya tiene fichada: un NUL pasa el build sin un aviso, pasa el
    // typecheck, y **vuelve el fichero binario para `grep`** — por eso toda comprobación con
    // `grep` sobre `dist/` salía vacía, incluidas las que decían que todo estaba bien.
    //
    // Acotado por bisección, cuatro builds: el NUL aparece solo cuando este título **termina** en
    // «el trámite», porque el titular de esta misma sección ya acaba en «es el trámite.». Con
    // «Nosotros hacemos la gestión» → limpio. Con «Hacemos el trámite por ti» → limpio, porque no
    // termina ahí. Y quitando el «el trámite.» del titular, el título viejo también sale limpio:
    // son las DOS apariciones juntas las que colisionan.
    //
    // La fuente está bien —los bytes son `c3 a1`, idénticos al «trámite» que sí funciona—, así
    // que el defecto es del pipeline de Astro/Vite. **Antes de tocar este título, construir y
    // contar NULs con Node**, que es lo único que los ve:
    //   node -e 'const b=require("fs").readFileSync("dist/index.html");console.log([...b].filter(x=>x===0).length)'
    { num: "04", icon: "zap",         title: "Hacemos el trámite por ti", subtitle: "Tú no entras a la UPME", desc: "Nuestro agente automatizado crea tu cuenta en la UPME, llena todos los formularios con tus datos y radica la solicitud de inmediato.", detail: "Sin que tengas que tocar ningún portal gubernamental." }, // taste-skill-ignore: clave interna del dato, no se pinta
    { num: "05", icon: "award",       title: "Recibe tu certificado",  subtitle: "Lo descargas desde tu panel", desc: "Te notificamos por WhatsApp y email en cada etapa del proceso. Cuando el certificado está listo, lo descargas desde tu dashboard.", detail: "Seguimiento en tiempo real por WhatsApp y correo." }, // taste-skill-ignore: clave interna del dato, no se pinta
    // ⚠️ PASO 06, añadido el 9-sep-2026 a petición de Julian: el recorrido terminaba en el
    // certificado y no decía en ninguna parte que la devolución ante la DIAN también la
    // gestionamos nosotros. Tres cosas que no se pueden aflojar al retocarlo:
    //   · «Gestionamos», NUNCA «radicamos»: el correo lo reenvía siempre el cliente desde la
    //     dirección de su RUT, en todas las seccionales. Desde el 6-oct-2026 Bogotá radica igual
    //     que las demás con cita: no hay videoatención ni poder a CertiVeh (decisiones 110, 111 y
    //     146 de Julian). (Ante la UPME sí radicamos, y por eso el paso 04 sí puede decirlo.)
    //   · La cita va CONDICIONADA a la seccional: solo la exigen cinco de treinta y cuatro.
    //   · Es un servicio APARTE y opcional. Sin decirlo, la lista se lee como que el precio del
    //     certificado lo incluye.
    { num: "06", icon: "receipt",     title: "Gestionamos tu devolución de IVA", subtitle: "Servicio aparte, ante la DIAN", desc: "Si contratas la devolución, generamos y revisamos tu expediente completo, definimos tu vía de radicación y pedimos tu cita si tu seccional la exige. Tú firmas tus documentos y reenvías el mensaje que te preparamos, desde el correo de tu RUT.", detail: "Seguimos tu trámite hasta que la DIAN consigna." }, // taste-skill-ignore: clave interna del dato, no se pinta
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const items = document.querySelectorAll("#como-funciona .flow-steps > li");
    if (!("IntersectionObserver" in window) || !items.length) return;
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i)); }), { rootMargin: "-45% 0px -50% 0px" });
    items.forEach(li => io.observe(li));
    return () => io.disconnect();
  }, []);
  return (
    <section id="como-funciona" aria-label="Cómo funciona" className="h-sec h-wrap">
      <div className="h-grid"><div className="h-intro rv">
        <h2 className="h-h2 cv-sec-title">Así de simple es el trámite.</h2>
        <p className="cv-sec-intro">Del certificado UPME a tu devolución de IVA: desde tu teléfono y sin portales gubernamentales.</p>
      </div></div>
      <div className="flow">
        <ol className="flow-steps">
          {steps.map((s, i) => (
            <li key={s.num} data-i={i} className={i === active ? "on" : i < active ? "done" : ""} aria-current={i === active ? "step" : undefined} onClick={() => setActive(i)}>
              <h3>{s.title}</h3>
              <p className="subt">{s.subtitle}</p>
              <p className="desc">{s.desc}</p>
              <p className="det">{s.detail}</p>
              <div className="frag" aria-hidden="true"><PiezaDelPaso i={i} /></div>
            </li>
          ))}
        </ol>
        <div className="flow-panel" aria-hidden="true">
          <div className="flow-sticky">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ width: "100%", display: "grid", placeItems: "center" }}>
                <PiezaDelPaso i={active} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CALCULADORA ───────────────────────────────────────────────────────────────
function Calculadora() {
  const portalUrl = usePortalUrl();
  const tarifa = useTarifa();
  const [valor, setValor] = useState(120);
  const [tipo, setTipo] = useState("electrico");
  const [perfil, setPerfil] = useState("natural");
  const [conIva, setConIva] = useState(false);
  const [calc, setCalc] = useState<any>({});
  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-CO") + " COP";

  useEffect(() => {
    const v = valor * 1_000_000;
    const iva = v * 0.05;
    const renta = v * 0.50;
    const total = iva + renta;

    // La tasa UPME (en UVT) y los honorarios de la tarifa: `cotizacionDeLaHome` (ajuste de precios, lote 4).
    const { costoUPME, honorariosBase, ivaServicio, honorariosIvaRefund, ivaIvaRefund, costoTotal } =
      cotizacionDeLaHome(v, conIva, tarifa);

    setCalc({ iva, renta, total, costoUPME, honorariosBase, ivaServicio, honorariosIvaRefund, ivaIvaRefund, costoTotal, neto: total - costoTotal });
  }, [valor, tipo, perfil, conIva, tarifa]);

  const bars = [
    { label: "Devolución IVA",    value: calc.iva,   color: "var(--emerald-600)", pct: calc.iva   / calc.total },
    { label: "Deducción renta", value: calc.renta, color: "var(--teal-500)",    pct: calc.renta / calc.total },
  ];
  const opcion = (actual: string, set: (v: string) => void) => (o: { value: string; label: string }) => (
    <button key={o.value} type="button" aria-pressed={actual === o.value} onClick={() => set(o.value)}>{o.label}</button>
  );
  return (
    <section id="calculadora" aria-label="Calculadora de beneficios" className="calc">
      <h2>¿Cuánto vale tu beneficio?</h2>
      <p className="sub">Mueve el slider y ve el desglose en tiempo real, con el costo del trámite incluido.</p>
      <p className="lab" id="calc-tipo">Tipo de vehículo</p>
      <div className="seg" role="group" aria-labelledby="calc-tipo">
        {[{ value: "electrico", label: "Eléctrico puro" },{ value: "hibrido", label: "Híbrido (no ligero)" }].map(opcion(tipo, setTipo))}
      </div>
      <p className="lab" id="calc-perfil">Perfil tributario</p>
      <div className="seg" role="group" aria-labelledby="calc-perfil">
        {[{ value: "natural", label: "Persona natural" },{ value: "empresa", label: "Independiente/Empresa" }].map(opcion(perfil, setPerfil))}
      </div>
      <div className="val"><label className="lab" htmlFor="calc-valor">Valor del vehículo (sin IVA)</label><output htmlFor="calc-valor">${valor}M</output></div>
      <input id="calc-valor" type="range" min="40" max="600" step="5" value={valor} aria-valuetext={`${valor} millones de pesos`}
        onChange={e => setValor(Number(e.target.value))} style={{ ["--p" as string]: `${((valor - 40) / 560) * 100}%` }} />
      <div className="ends"><span>$40M</span><span>$600M</span></div>
      <label className="sw"><input type="checkbox" checked={conIva} onChange={() => setConIva(!conIva)} /><i aria-hidden="true" />Gestión de la devolución de IVA</label>
      <div className="bars">
        {bars.map((b, i) => (
          <div key={b.label}>
            <div className="brow"><span>{b.label}</span><b>{b.value ? fmt(b.value) : "-"}</b></div>
            <div className={`btrack${i === 1 ? " b2" : ""}`}><i style={{ width: `${(b.pct || 0) * 100}%` }} /></div>
          </div>
        ))}
      </div>
      {perfil === "empresa" && <p className="emp">Depreciación acelerada a 3 años, reduce tu base gravable más rápido y paga menos impuestos hoy.</p>}
      {calc.costoUPME != null && (
        <div className="cost" aria-live="polite">
          <div className="h">Costo total</div>
          <div><span>Trámite ante UPME</span><b>{fmt(calc.costoUPME)}</b></div>
          <div><span>Servicio de tramitación</span><b>{fmt(calc.honorariosBase)}</b></div>
          <div><span>IVA (19% sobre tramitación)</span><b>{fmt(calc.ivaServicio)}</b></div>
          {conIva && (<>
            <div><span>Gestión devolución IVA</span><b>{fmt(calc.honorariosIvaRefund)}</b></div>
            <div><span>IVA (19% sobre la gestión)</span><b>{fmt(calc.ivaIvaRefund)}</b></div>
          </>)}
          <div className="t"><span>Total</span><b>{fmt(calc.costoTotal)}</b></div>
        </div>
      )}
      <div className="res" aria-live="polite" data-ui>
        <div className="k">Beneficio total estimado</div>
        <div className="big">{calc.total ? fmt(calc.total) : "-"}</div>
        <div className="s">en incentivos tributarios (incluye base gravable en renta)</div>
        {conIva && calc.iva && (<div className="row"><span className="k">IVA a recuperar ante la DIAN</span><b>{fmt(calc.iva)}</b></div>)}
        <div className="row"><span className="k">Beneficio estimado menos el costo total</span><b>{calc.neto ? fmt(calc.neto) : "-"}</b></div>
        {calc.costoTotal && calc.total && (
          <p className="per">Por cada <b>$1</b> de costo total, un beneficio estimado de{" "}<em>${(Math.round(calc.total / calc.costoTotal * 10) / 10).toLocaleString("es-CO")}</em> en beneficios.</p>
        )}
        <a className="cv-btn cv-btn-w" href={portalUrl} target="_blank" rel="noopener noreferrer">Empezar mi trámite ahora <Arr /></a>
        <p className="note">Si la UPME rechaza, revisamos tu caso · Si el error es nuestro, corregimos sin costo</p>
      </div>
    </section>
  );
}

// ── CONFIANZA ─────────────────────────────────────────────────────────────────
function Confianza() {
  const desde = preciosDesde(useTarifa());
  const puntos = [
    { icon: "zap",         title: "Agente automatizado",          desc: "Nuestra tecnología navega el portal UPME por ti, llena todos los formularios y radica la solicitud sin que tengas que hacer nada." },
    { icon: "smartphone",  title: "Actualización en tiempo real", desc: "Seguimiento completo por WhatsApp y email. Sabes exactamente en qué etapa está tu trámite, en todo momento." },
    { icon: "lock",        title: "Tus datos, protegidos",        desc: "Cifrado de extremo a extremo. Cumplimos la Ley 1581 de Habeas Data. Nunca compartimos tu información con terceros." },
    { icon: "calendar",    title: "Radicación inmediata",        desc: "La UPME recibe solicitudes del 1 de febrero al 15 de diciembre, sin ciclos. Tu trámite se radica de inmediato en esta ventana." },
    { icon: "shield",      title: "Sin portal gubernamental",     desc: "Tú nunca tienes que entrar a la UPME. Nosotros creamos la cuenta, gestionamos el proceso y resolvemos cualquier imprevisto." },
    // ⚠️ El desglose de costos ajenos («aparte van el trámite ante la UPME y, si das poder, la
    // notaría») se retiró de AQUÍ el 9-sep-2026 por decisión de Julian. NO se ha quedado sin
    // decir: el costo del trámite UPME sigue en el paso 03 de «Así de simple» y en el `priceNote`
    // de la tarjeta de Servicio 1, y el de la notaría vive en `llms.txt` y en el conocimiento de
    // los agentes, que responden si el cliente pregunta. Antes de borrarlo de esos sitios, mirar
    // que quede en pie al menos uno.
    { icon: "checkCircle", title: "Solo pagas una vez",           desc: `Certificado UPME ${desde.pesos.certificado} + IVA. Devolución de IVA desde ${desde.pesos.ivaPaquete} + IVA. Sin suscripciones.` },
  ];
  return (
    <section id="confianza" aria-label="Por qué CertiVeh" className="h-sec h-wrap">
      <div className="h-grid"><div className="h-intro rv">
        <h2 className="h-h2 cv-sec-title">Hecho para que no tengas que preocuparte.</h2>
        <p className="cv-sec-intro">Automatización, acompañamiento, seguridad y seguimiento en tiempo real.</p>
      </div></div>
      <ul className="poster">
        {puntos.map(p => <li key={p.title} className="rv"><h3>{p.title}</h3><p>{p.desc}</p></li>)}
      </ul>
    </section>
  );
}

// ── TESTIMONIOS ──────────────────────────────────────────────────────────────
function Testimonios() {
  const testimonios = [
    { nombre: "Andrés M.", ciudad: "Medellín", vehiculo: "BYD Yuan Up · Eléctrico", texto: "CertiVeh se encargó de todo. Yo subí mis documentos desde el celular y no tuve que entrar al portal de la UPME en ningún momento. A las pocas semanas ya tenía mi certificado listo." },
    { nombre: "Carolina R.", ciudad: "Medellín", vehiculo: "Toyota Corolla Cross Hybrid · Híbrido", texto: "Intenté hacer el trámite por mi cuenta y me lo rechazaron. Con CertiVeh lo volvimos a radicar, corrigieron lo que estaba mal y por fin pude acceder a mis beneficios tributarios. Súper agradecida." },
    { nombre: "Felipe T.", ciudad: "Bogotá", vehiculo: "BYD Seagull · Eléctrico", texto: "Fue muy rápido. En menos de 5 minutos ya había subido todo y empezado mi trámite en el portal de CertiVeh. Me avisaron por WhatsApp en cada paso. Muy recomendado." },
  ];
  // La cita de quien primero intentó solo y fue rechazado va grande: es la que cuenta el servicio.
  const [a, b, c] = testimonios;
  const Cita = ({ t, cls }: { t: typeof testimonios[number]; cls: string }) => (
    <figure className={`${cls} rv`}>
      <blockquote>"{t.texto}"</blockquote>
      <figcaption><b>{t.nombre}</b><span>{t.ciudad} · {t.vehiculo}</span></figcaption>
    </figure>
  );
  return (
    <section id="testimonios" aria-label="Testimonios" className="h-sec h-wrap">
      <h2 className="h-h2 cv-sec-title rv">Lo que dicen nuestros usuarios</h2>
      <div className="vgrid">
        <Cita t={b} cls="vlead" />
        <div className="vside"><Cita t={a} cls="vq" /><Cita t={c} cls="vq" /></div>
      </div>
    </section>
  );
}

// ── PRENSA ──────────────────────────────────────────────────────────────────
// ── PRENSA ──────────────────────────────────────────────────────────────────
// Cada tarjeta lleva el TITULAR TEXTUAL que publicó el medio, entre comillas porque son sus
// palabras y no las nuestras. Verificados contra cada página el 22-oct-2026 (og:title o el
// título del video). No se parafrasean: un titular «mejorado» deja de ser una cita.
//
// `maxH`/`maxW` igualan el peso óptico de logos con proporciones muy distintas (Portafolio es
// 5,4:1 y Valora 1,6:1). Conservan los valores del carrusel anterior salvo Valora: apilado, a 28 px
// quedaba con la mitad de área que el resto, así que va a 36 px, el alto de la caja del logo.
type Medio = {
  name: string; logo: string; maxH: number; maxW: number;
  titular: string; formato: "Artículo" | "Video" | "Publicación";
  fecha: string; url: string; accion: string;
};
const MEDIOS: Medio[] = [
  { name: "Negocios Ditu", logo: "/prensa-negociosditu.png", maxH: 30, maxW: 80, formato: "Video", fecha: "Septiembre 2026", accion: "Ver entrevista",
    titular: "¿Tienes un carro eléctrico o híbrido? Podrías estar perdiendo beneficios",
    url: "https://www.youtube.com/watch?v=MUugrTUv-Zg" },
  { name: "Revista Semana", logo: "/prensa-semana.png", maxH: 26, maxW: 130, formato: "Artículo", fecha: "Julio 2026", accion: "Leer artículo",
    titular: "Buenas noticias para conductores de carros eléctricos en Colombia: podrían recuperar millones de pesos con este beneficio",
    url: "https://www.semana.com/vehiculos/articulo/buenas-noticias-para-conductores-de-carros-electricos-en-colombia-podrian-recuperar-millones-de-pesos-con-este-beneficio/202619/" },
  { name: "Valora Analitik", logo: "/prensa-valora.png", maxH: 36, maxW: 95, formato: "Artículo", fecha: "Julio 2026", accion: "Leer artículo",
    titular: "Compradores de vehículos eléctricos podrían recuperar millones de pesos con este beneficio",
    url: "https://www.valoraanalitik.com/compradores-de-vehiculos-electricos-podrian-recuperar-millones-de-pesos/" },
  { name: "Portafolio", logo: "/prensa-portafolio.png", maxH: 26, maxW: 130, formato: "Artículo", fecha: "Julio 2026", accion: "Leer artículo",
    titular: "Una empresa colombiana lleva a WhatsApp el trámite para acceder a beneficios tributarios de vehículos eléctricos",
    url: "https://www.portafolio.co/negocios/vehiculo/una-empresa-colombiana-lleva-a-whatsapp-el-tramite-para-acceder-a-beneficios-tributarios-de-vehiculos-electricos-497545" },
  { name: "Infobae", logo: "/prensa-infobae.png", maxH: 24, maxW: 110, formato: "Artículo", fecha: "Julio 2026", accion: "Leer artículo",
    titular: "Dueños de carros eléctricos podrían recuperar millones por IVA: así funciona el beneficio",
    url: "https://www.infobae.com/colombia/2026/07/07/duenos-de-carros-electricos-podrian-recuperar-millones-por-iva-asi-funciona-el-beneficio/" },
  { name: "Revista C-Level", logo: "/prensa-clevel.png", maxH: 26, maxW: 105, formato: "Artículo", fecha: "Julio 2026", accion: "Leer artículo",
    titular: "Empresa colombiana tramitó más de $17.000 millones en beneficios tributarios para compradores de vehículos eléctricos",
    url: "https://revistaclevel.com/empresa-colombiana-tramito-mas-de-17000-millones-en-beneficios-tributarios-para-compradores-de" },
  { name: "Yahoo", logo: "/prensa-yahoo.png", maxH: 28, maxW: 105, formato: "Artículo", fecha: "Julio 2026", accion: "Leer artículo",
    titular: "Compradores de vehículos eléctricos aún no reclaman un beneficio que puede devolverles millones de pesos",
    url: "https://es-us.noticias.yahoo.com/compradores-veh%C3%ADculos-el%C3%A9ctricos-reclaman-beneficio-160000527.html" },
  // Publicación patrocinada en Instagram (11-jul-2026). Va la primera frase del texto del post y NO
  // el titular de su portada («Un auto de 120 millones costaría hasta 66 millones menos»), que
  // promete como dinero en caja lo que son beneficios tributarios: la regla del 55% del CLAUDE.md.
  { name: "Última Hora", logo: "/prensa-ultimahora.png", maxH: 22, maxW: 130, formato: "Publicación", fecha: "Julio 2026", accion: "Ver publicación",
    titular: "Un vehículo de 120 millones de pesos podría representar hasta 66 millones en beneficios tributarios",
    url: "https://www.instagram.com/p/DaqeIT9D-ai/" },
];
function Prensa() {
  return (
    <section id="prensa" aria-labelledby="prensa-titulo" className="h-sec h-wrap">
      <div className="board">
        <div className="tile head rv">
          <h2 id="prensa-titulo" className="cv-sec-title">CertiVeh en los medios</h2>
          <p className="cv-sec-intro">Entrevistas y artículos sobre CertiVeh y los beneficios tributarios de los carros eléctricos e híbridos en Colombia.</p>
        </div>
        {MEDIOS.map((m, i) => (
          <a key={m.name} className="tile rv" href={m.url} target="_blank" rel="noopener noreferrer"
            aria-label={`${m.name}: ${m.titular} (se abre en una pestaña nueva)`}
            style={i === MEDIOS.length - 1 ? { gridColumn: "span 2" } : undefined}>
            <div className="mark"><img src={m.logo} alt={m.name} loading="lazy" /></div>
            <p className="quote">«{m.titular}»</p>
            <span className="meta"><span>{m.formato} · {m.fecha}</span><b>{m.accion}</b></span>
          </a>
        ))}
      </div>
    </section>
  );
}

// ── WIN WIN ──────────────────────────────────────────────────────────────────
// A la derecha, el módulo Win Win del portal (`WinWinModule.tsx`) con sus rótulos reales y cifras de ejemplo.
function WinWin() {
  const portalUrl = usePortalUrl();
  const steps = [
    { num: "01", icon: "award", title: "Crea tu cuenta", desc: "Regístrate en portal.certiveh.co, sube tus documentos y completa tu trámite para desbloquear tu código de referido." }, // taste-skill-ignore: clave interna del dato, no se pinta
    { num: "02", icon: "share2", title: "Comparte tu código", desc: "Envíalo a amigos que tengan carro eléctrico o híbrido. Ellos reciben $60.000 de descuento en su trámite." }, // taste-skill-ignore: clave interna del dato, no se pinta
    { num: "03", icon: "dollarSign", title: "Gana $75.000 por cada uno", desc: "Cada vez que un amigo solicite su trámite, tú ganas $75.000 que puedes acumular o retirar cuando quieras." }, // taste-skill-ignore: clave interna del dato, no se pinta
  ];
  return (
    <section id="winwin" aria-label="Programa de referidos CertiVeh Win Win" className="ww">
      <div className="h-wrap h-grid">
        <div className="ww-copy rv">
          <h2 className="h-h2 cv-sec-title">CertiVeh Win Win</h2>
          <p className="sub cv-sec-intro">Refiere amigos y gana dinero</p>
          <ol className="ww-steps">
            {steps.map(s => <li key={s.num}><h3>{s.title}</h3><p>{s.desc}</p></li>)}
          </ol>
          <p className="fine">Sin límite de referidos. Sin vencimiento. Retira tu saldo cuando quieras.</p>
          <a className="cv-btn cv-btn-w" href={portalUrl} target="_blank" rel="noopener noreferrer">Empezar mi trámite ahora <Arr /></a>
        </div>
        <div className="ww-ui rv" aria-hidden="true">
          <div className="ww-mod" data-ui>
            <div className="ww-mod-h">
              <p className="ww-mod-k"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C9.5 3 12 8 12 8s2.5-5 4.5-5a2.5 2.5 0 0 1 0 5"/></svg>CertiVeh Win Win</p>
              <div className="ww-mod-code"><span>CERTIVEH-482</span><i aria-hidden="true">⧉</i><i aria-hidden="true">↗</i></div>
              <p className="ww-mod-s">Tu amigo recibe $60.000 de descuento y tú ganas $75.000 cuando pague su trámite.</p>
            </div>
            <div className="ww-mod-b">
              <div className="ww-mod-n"><div><b>2</b><span>Referidos</span></div><div><b>2</b><span>Pagados</span></div><div className="sal"><b>$150.000</b><span>Saldo disponible</span></div></div>
              <span className="ww-mod-btn">Solicitar retiro ($150.000)</span>
              <p className="ej" style={{ fontSize: 12, color: "#64748b", marginTop: 10 }}>Datos de ejemplo</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    { q: "¿Qué vehículos califican?",               a: "Vehículos eléctricos puros e híbridos nuevos registrados en Colombia. No aplica para vehículos usados ni para híbridos ligeros. El vehículo debe estar a nombre del solicitante en el RUNT." },
    { q: "¿Cuándo puedo radicar mi solicitud?",     a: "Solo tienes que entrar a portal.certiveh.co, crear tu cuenta y cargar tu solicitud. La UPME recibe solicitudes de forma continua del 1 de febrero al 15 de diciembre de cada año (Resolución UPME 563 de 2026), y dentro de esa ventana tu solicitud se radica de inmediato. Lo que llega después del 15 de diciembre se entiende como no presentado y tiene que esperar al 1 de febrero, así que no lo dejes para el último día." },
    { q: "¿Qué documentos necesito?",               a: "Si eres persona natural: cédula de ciudadanía o de extranjería (frente y reverso), tarjeta de propiedad del vehículo (frente y reverso), factura de compra y tu RUT (el RUT solo si además vas a pedir la devolución del IVA). Si eres persona jurídica: certificado de cámara de comercio, cédula del representante legal (frente y reverso), tarjeta de propiedad del vehículo (frente y reverso), factura de compra y el RUT de la empresa si vas a pedir la devolución del IVA. Todo se sube en PDF, JPG o PNG desde tu teléfono." },
    { q: "¿Cuánto toma el proceso completo?",       a: "Desde que subes tus documentos hasta la radicación: menos de 10 minutos de tu parte. Desde la radicación hasta el certificado UPME: normalmente unos 15 días hábiles, y el máximo legal son 30." },
    { q: "¿Qué pasa si la UPME rechaza mi solicitud?", a: "Si el rechazo se debe a un error de nuestra parte, gestionamos la corrección y volvemos a radicar sin costo adicional. Si se debe a información incorrecta proporcionada por el usuario, gestionamos la corrección contigo y la nueva solicitud se cobra según las condiciones vigentes; te informamos el valor antes de cualquier cobro." },
    { q: "¿Funciona para empresas e independientes?", a: "Sí. El servicio está disponible para personas naturales, independientes y empresas. Además, las empresas e independientes tienen un beneficio adicional: depreciación acelerada del vehículo a 3 años, lo que reduce la base gravable más rápido." },
    // ⚠️ La DIAN NEGÓ este beneficio a las personas naturales en el Concepto 012101 del 5-ago-2025
    // y se retractó un mes después en el 013853 del 5-sep-2025. Quien llega diciendo «esto es solo
    // para empresas» casi siempre viene citando el concepto derogado, así que la respuesta nombra
    // los dos: sin la fecha de la reconsideración, el cliente cree que le estamos discutiendo su
    // fuente. Ratificado después en los conceptos 14611/2025, 146/2026, 673/2026 y 3086/2026.
    { q: "¿La devolución del IVA solo aplica a empresas?", a: "No. También aplica a personas naturales que compran para uso personal. La DIAN lo había negado en el Concepto 012101 de agosto de 2025, pero reconsideró esa posición un mes después en el Concepto 013853 del 5 de septiembre de 2025, que es el que está vigente. El Concepto 673 de 2026 incluso previó el caso de quien no lleva contabilidad: puede reemplazar las certificaciones de contador por una declaración juramentada." },
    { q: "¿Cuánto tiempo tengo para reclamar mis beneficios?", a: "Para la devolución de IVA, tienes hasta 5 años desde la fecha de la factura de compra (artículo 2536 del Código Civil, Concepto DIAN 673 de 2026). Para la deducción en renta, tienes un periodo máximo de 15 años contados a partir del año gravable siguiente a la entrada en operación del vehículo (artículo 11, Ley 1715 de 2014). El certificado UPME puede obtenerse después de la compra." },
    // ⚠️ Esta respuesta medía 780 caracteres, el triple que cualquier otra de la lista, y la
    // enumeración de las cinco seccionales se llevaba una línea entera para un dato que el cliente
    // no puede usar todavía (su vía se la decimos nosotros al leer su RUT). Acortada el
    // 9-sep-2026. Los cuatro hechos que NO se pueden perder al recortarla, y siguen todos:
    // la cita la pedimos NOSOTROS y va condicionada a la seccional · la juramentada y el
    // Formulario 010 los firma siempre el cliente, en línea · el reenvío desde el correo del RUT
    // es suyo, en todas las seccionales · la cita no es presencial: se atiende enviando ese
    // correo el día de la cita, a la hora exacta o dentro de los 30 minutos siguientes, mejor en los primeros 10 (la DIAN,
    // 29-oct-2026, y su Abecé: «no antes y tampoco después»; antes decía «antes de la hora»).
    // «Una cita por contribuyente» se retiró el 16-sep: no tiene fuente oficial.
    //
    // ⚠️ Del 29-sep al 6-oct-2026 esta respuesta contaba que en Bogotá se radicaba en una
    // videollamada y que allí existía un poder. Las dos cosas dejaron de ser verdad (decisiones
    // 110, 111 y 146 de Julian) y NO vuelven: Bogotá radica igual que las demás seccionales con
    // cita. Y esta respuesta está duplicada, letra por letra, en el JSON-LD `FAQPage` de
    // `src/pages/index.astro` y `src/pages/exotics.astro`: se cambian las tres a la vez.
    { q: "¿CertiVeh gestiona la devolución del IVA?", a: "Sí, de punta a punta. Preparamos tus documentos, generamos tu expediente y, si tu seccional exige cita, la pedimos nosotros a tu nombre. Tú firmas en línea la declaración juramentada y el Formulario 010, y reenvías el correo que te preparamos desde el correo de tu RUT: la DIAN exige que salga del contribuyente. Si hay cita, no es presencial: envías ese correo el día de tu cita, a la hora exacta o dentro de los 30 minutos siguientes (mejor en los primeros 10), ni antes ni después. Y seguimos tu trámite hasta que la DIAN consigna." },
    // ⚠️ «No es una auditoría» es cierto; «no proceden auditorías» NO lo es y no se puede publicar.
    // El procedimiento DIAN PR-COT-0128 contempla que una solicitud se seleccione para los programas
    // de fiscalización AD, DI o PD, el art. 857-1 del ET permite suspender el término hasta 90 días
    // ante indicios, y el 684 conserva las facultades generales. Lo defendible es lo que dice esta
    // respuesta: no se abre revisión de la declaración de renta ni del historial del contribuyente.
    { q: "¿Pedir la devolución me expone a una auditoría de la DIAN?", a: "No es una auditoría. Es un trámite reglado: la DIAN revisa los documentos de tu propia solicitud, tiene hasta 15 días hábiles para responder y, si la aprueba, hasta 50 días hábiles para pagar. No se abre una revisión de tu declaración de renta ni de tu historial tributario. Lo que sí importa es presentarla bien: ese IVA no puede haberse tomado antes como mayor valor del costo, como deducción en renta ni como impuesto descontable." },
    // ⚠️ La regla de restitución del art. 1.2.1.18.76 aplica SOLO a los artículos 11 y 14 de la Ley
    // 1715 (deducción en renta y depreciación acelerada). NO al 12 (IVA) ni al 13 (arancel), y su
    // propio texto lo dice. Confundirlos es el mito que más trámites frena: el cliente cree que
    // vender el carro le obliga a devolver el IVA. Si se recorta esta respuesta, lo que no se puede
    // perder es la separación entre los dos beneficios.
    { q: "¿Tengo que quedarme con el vehículo para conservar mis beneficios?", a: "Para la devolución del IVA, no: ninguna norma la condiciona a que conserves el vehículo. Lo único que debes conservar es el certificado UPME y los soportes, por si la DIAN te los pide. La deducción en renta funciona distinto: si vendes antes de que termine el periodo de depreciación del vehículo, lo que ya dedujiste se reversa como recuperación de deducciones (Decreto 1625 de 2016, artículo 1.2.1.18.76)." },
    { q: "¿Puedo hacer el trámite a nombre de otra persona o empresa?", a: "Sí. Puedes registrar múltiples titulares en tu cuenta, tanto personas naturales como jurídicas. Por ejemplo, tu vehículo personal y el de tu empresa. Cada trámite se asocia al propietario real del vehículo, que es quien debe figurar en la tarjeta de propiedad." },
  ];
  return (
    <section id="faq" aria-label="Preguntas frecuentes" className="h-sec h-wrap">
      <div className="faq-grid">
        <h2 className="h-h2 cv-sec-title">Todo lo que necesitas saber</h2>
        <div className="qs">
          {items.map((item, i) => (
            <div key={item.q} className={`faq-item${open === i ? " open" : ""}`}>
              <button className="faq-btn" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} aria-controls={`h-faq-${i}`}>
                <span>{item.q}</span><span className="pm" aria-hidden="true" />

              </button>
              {/* La respuesta está SIEMPRE en el HTML (lectores, buscadores, sin JavaScript); cerrada solo se oculta. */}
              <div className="faq-body" id={`h-faq-${i}`} hidden={open !== i}>
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA FINAL ─────────────────────────────────────────────────────────────────
function CTAFinal() {
  const portalUrl = usePortalUrl();
  return (
    <section id="cta-final" aria-label="Comenzar" className="close h-wrap">
      <div className="h-grid close-grid">
        <h2 className="cv-close-title rv">Tus beneficios tributarios te están esperando.</h2>
        <div className="close-r rv">
          <p className="cv-sec-intro">Certificado UPME y devolución de IVA. Miles de propietarios de vehículos eléctricos e híbridos en Colombia no han reclamado lo que les corresponde.</p>
          <a className="cv-btn cv-btn-a" href={portalUrl} target="_blank" rel="noopener noreferrer">Empezar mi trámite ahora <Arr /></a>
          <ul>{["Solo pagas una vez · Sin suscripciones","100% en línea","Notificaciones por WhatsApp"].map(t => <li key={t} className="cv-sq">{t}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}

// ── URGENCY MODAL ─────────────────────────────────────────────────────────────
function UrgencyModal({ onClose }: { onClose: () => void }) {
  const portalUrl = usePortalUrl();
  const corte = corteDeCaducidadIva();
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", alTeclear);
    return () => document.removeEventListener("keydown", alTeclear);
  }, [onClose]);
  return (
    <AnimatePresence>
      <motion.div className="urgency-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
        <motion.div className="urgency-modal" role="dialog" aria-modal="true" aria-labelledby="urgencia-titulo"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} onClick={e => e.stopPropagation()}>
          <button className="urgency-modal-close" onClick={onClose} aria-label="Cerrar modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <p className="urgency-k">Advertencia de plazo</p>
          <h2 id="urgencia-titulo">Antes de irte:</h2>
          <h3>Tu IVA puede prescribir.</h3>
          <p>El plazo para reclamar la devolución del IVA ante la DIAN caduca <strong>5 años después de la factura de tu vehículo</strong>. Si la tuya es anterior al {corte.dia} de {corte.mes} de {corte.anio}, es muy probable que el plazo ya se te haya vencido; y si es del resto de {corte.anio}, se te vence este año. Escríbenos con la fecha de tu factura y te decimos cuánto te queda.</p>
          <p className="fine">Además, la normativa tributaria puede cambiar. Empezar hoy te deja el trámite andando bajo las reglas vigentes.</p>
          <a className="cv-btn cv-btn-a" href={portalUrl} target="_blank" rel="noopener noreferrer">Empezar mi trámite ahora <Arr /></a>
          <p className="fine" style={{ marginTop: 16, textAlign: "center" }}>Plazo legal: 5 años desde la factura · Art. 2536 Código Civil · Concepto DIAN 673/2026.</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function CertiVehLandingComplete({ portalUrl = "https://portal.certiveh.co", tarifaDelBuild }: { portalUrl?: string; tarifaDelBuild?: string } = {}) {
  // La tarifa del build al pintar y, tras hidratar, la vigente con el reloj del cliente (lote 4).
  const tarifa = useTarifaDeLaIsla(tarifaDelBuild);
  const [showUrgencyModal, setShowUrgencyModal] = useState(false);
  useEntradas();

  // Urgency modal logic - shows after 45 seconds, once per session
  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('urgencyModalSeen');
    if (hasSeenModal) return;

    const timer = setTimeout(() => {
      setShowUrgencyModal(true);
      document.body.style.overflow = 'hidden';
      sessionStorage.setItem('urgencyModalSeen', 'true');
    }, 45000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <PortalUrlContext.Provider value={portalUrl}>
    <TarifaDeLaIsla.Provider value={tarifa}>
      {/* ⚠️ **Como HTML crudo, no como hijo de texto.** Con `<style>{CSS}</style>` React escapa el // taste-skill-ignore: signo de aviso dentro de un comentario
          texto en el HTML prerenderizado (`>` sale como `&gt;`, las comillas como `&#x27;`): los
          selectores con `>` y la fuente no valían hasta hidratar, y al hidratar el texto no
          coincidía (errores #425 y #423), así que React tiraba el HTML del servidor y repintaba la
          landing entera. */}
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Navbar />
      <main>
        <Hero/>
        <Ticker/>
        <Aliados/>
        <VentanaUPME/>
        <Beneficios/>
        <Servicios/>
        <ComoFunciona/>
        <Confianza/>
        <PorQueNoSolo/>
        <Testimonios/>
        <Prensa/>
        <WinWin/>
        <FAQ/>
        <CTAFinal/>
      </main>
      <SiteFooter isHome />

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/573132689212?text=Hola%20quiero%20información%20sobre%20los%20beneficios%20tributarios%20para%20vehículos%20eléctricos"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
        className="whatsapp-fab"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Urgency Modal */}
      {showUrgencyModal && <UrgencyModal onClose={() => { setShowUrgencyModal(false); document.body.style.overflow = ''; }} />}

      {/* Structured Data moved to index.astro for SSR */}
    </TarifaDeLaIsla.Provider>
    </PortalUrlContext.Provider>
  );
}
