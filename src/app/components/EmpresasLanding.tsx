import { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { SiteFooter } from "./SiteFooter";
import { AnimatePresence, motion } from "motion/react";
import { cotizacionDeGas } from '@/lib/precios-de-la-landing.ts';
import { TarifaDeLaIsla, useTarifa, useTarifaDeLaIsla } from './la-tarifa-de-la-isla.ts';

// ─────────────────────────────────────────────────────────────────────────────
// CertiVeh — Landing Empresas
// Certificación UPME para GEE y FNCE
//
// Estándar visual 2026-11 (DESIGN_SYSTEM.md §0): las variables --cv-* de src/styles/marca.css y las clases
// .cv-btn / .cv-sq. Sin degradados (salvo el velo neutro sobre el video), sin sombras en reposo, sin vidrio,
// sin iconos en cuadritos, sin la rejilla animada ni los números 01/02/03 a la vista. Los textos, enlaces y
// datos de cada sección son los de siempre.
// ─────────────────────────────────────────────────────────────────────────────

const WHATSAPP_URL = "https://wa.me/573151298420?text=Hola%2C%20quiero%20información%20sobre%20la%20certificación%20UPME%20para%20mi%20empresa";

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: var(--cv-bg); color: var(--cv-ink); font-family: var(--cv-font); font-size: var(--cv-body); line-height: 1.5; letter-spacing: -0.01em; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
  .oa-wrap { padding-inline: var(--cv-m); max-width: 1520px; margin: 0 auto; }
  .oa-grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: clamp(12px, 2vw, 28px); }
  .oa-sec { padding-top: var(--cv-gap-sec); scroll-margin-top: 80px; }
  .oa-h2 { font-size: var(--cv-head); font-weight: var(--cv-wh); letter-spacing: var(--cv-trk); line-height: 1; text-wrap: balance; }
  .oa-intro { grid-column: 1 / span 7; }
  .oa-intro p { margin-top: 18px; max-width: 58ch; }

  @keyframes oaUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

  /* ── HERO: el video con el velo neutro de la home, el texto a la izquierda ── */
  .oa-hero { position: relative; color: #fff; background: var(--cv-field); overflow: hidden; padding: calc(64px + clamp(72px, 10vw, 160px)) 0 clamp(56px, 7vw, 110px); scroll-margin-top: 64px; }
  .oa-hero-media { position: absolute; inset: 0; }
  .oa-hero-media video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
  .oa-hero-media::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(9,14,26,.9) 0%, rgba(9,14,26,.74) 50%, rgba(9,14,26,.45) 100%); } /* taste-skill-ignore: velo neutro sobre el video */
  .oa-hero-copy { position: relative; }
  .oa-hero h1 { font-size: var(--cv-display); font-weight: var(--cv-wh); letter-spacing: var(--cv-trk); line-height: 1; text-wrap: balance; max-width: 18ch; animation: oaUp .6s .05s ease-out both; }
  .oa-hero-sub { font-size: var(--cv-lead); line-height: 1.4; color: #e2e8f0; max-width: 46ch; margin-top: 22px; animation: oaUp .6s .12s ease-out both; }
  .oa-acts { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 32px; animation: oaUp .6s .2s ease-out both; }
  .oa-acts .cv-btn-w:focus-visible { outline-color: var(--cv-mint); }
  .oa-trust { list-style: none; display: flex; flex-wrap: wrap; gap: 10px 28px; margin-top: 30px; font-size: var(--cv-small); font-weight: 600; animation: oaUp .6s .28s ease-out both; }
  .oa-trust .cv-sq::before, .oa-dark .cv-sq::before { background: var(--cv-mint); }

  /* ── ACTIVOS: tres baldosas con su foto ── */
  .oa-board { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-top: 56px; }
  .oa-asset { background: var(--cv-tone); border-radius: var(--cv-r); overflow: hidden; display: flex; flex-direction: column; }
  .oa-asset-img { aspect-ratio: 16 / 10; overflow: hidden; }
  .oa-asset-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .oa-asset-body { padding: clamp(22px, 2.4vw, 32px); display: flex; flex-direction: column; gap: 10px; }
  .oa-tag { font-size: var(--cv-small); font-weight: 600; color: var(--cv-accent); }
  .oa-asset h3 { font-size: clamp(1.375rem, 1.15rem + 0.7vw, 1.75rem); font-weight: var(--cv-wh); letter-spacing: var(--cv-trk); line-height: 1.1; }

  /* ── BENEFICIOS: cuatro baldosas, la cifra en verde ── */
  .oa-ben { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-top: 56px; }
  .oa-b { background: var(--cv-tone); border-radius: var(--cv-r); padding: clamp(22px, 2.4vw, 32px); display: flex; flex-direction: column; gap: 10px; }
  .oa-b h3 { font-size: 1.25rem; font-weight: var(--cv-wh); letter-spacing: -0.02em; line-height: 1.2; }
  .oa-b .pct { font-size: clamp(2.25rem, 1.6rem + 2vw, 3rem); font-weight: var(--cv-wh); letter-spacing: var(--cv-trk); line-height: 1; color: var(--cv-accent); }
  .oa-b p { font-size: 1rem; }
  .oa-b .norma { margin-top: auto; padding-top: 10px; font-size: var(--cv-small); color: var(--cv-soft); }

  /* ── CÓMO FUNCIONA: campo oscuro y el riel del portal ── */
  .oa-dark { background: var(--cv-field); color: #fff; margin-top: var(--cv-gap-sec); padding-block: clamp(64px, 8vw, 120px); scroll-margin-top: 64px; }
  .oa-dark .oa-intro p { color: #e2e8f0; }
  .oa-steps-col { grid-column: 1 / span 6; }
  .oa-steps-lead { margin-top: 18px; max-width: 52ch; color: #e2e8f0; }
  .oa-rail { list-style: none; margin-top: 40px; padding-left: 40px; position: relative; display: grid; gap: 4px; }
  .oa-rail::before { content: ""; position: absolute; left: 11px; top: 22px; bottom: 22px; width: 3px; background: rgba(255,255,255,.18); }
  .oa-rail li { position: relative; }
  .oa-rail li::before { content: ""; position: absolute; left: -40px; top: 15px; width: 25px; height: 25px; border-radius: 50%; background: var(--cv-field); box-shadow: inset 0 0 0 3px rgba(255,255,255,.35); transition: background-color .25s, box-shadow .25s; } /* taste-skill-ignore: anillo del punto del riel, como RielDelTramite del portal */
  .oa-rail li.done::before { background: var(--cv-mint); box-shadow:none; }
  .oa-rail li.on::before { background: var(--cv-field); box-shadow: inset 0 0 0 7px var(--cv-mint); } /* taste-skill-ignore: el paso actual, anillo verde del riel */
  .step-tab { width: 100%; display: block; text-align: left; background: none; border: 0; color: inherit; cursor: pointer; font-family: var(--cv-font); padding: 12px 14px; border-radius: var(--cv-r); transition: background-color .15s; }
  .step-tab:hover { background: var(--cv-field-2); }
  .step-tab.active { background: var(--cv-field-2); }
  .step-tab:focus-visible { outline: 3px solid var(--cv-mint); outline-offset: 2px; }
  /* El número del paso (01, 02…) se conserva en el documento pero no se pinta: el orden lo dice el riel */
  .step-num { display: none; }
  .step-t { display: block; font-size: 1.1875rem; font-weight: 600; letter-spacing: -0.02em; line-height: 1.3; color: var(--cv-field-soft); }
  .step-s { display: block; font-size: var(--cv-small); font-weight: 600; color: var(--cv-field-soft); margin-top: 2px; }
  .step-tab.active .step-t { color: #fff; }
  .step-tab.active .step-s { color: var(--cv-mint); }
  .oa-step-card { grid-column: 8 / span 5; align-self: center; background: var(--cv-field-2); border-radius: var(--cv-r); padding: clamp(28px, 3.5vw, 48px); min-height: 400px; display: flex; flex-direction: column; justify-content: center; position: relative; }
  .oa-step-card .wm { display: none; }
  .oa-step-card h3 { font-size: clamp(1.5rem, 1.15rem + 1.1vw, 2rem); font-weight: var(--cv-wh); letter-spacing: var(--cv-trk); line-height: 1.1; }
  .oa-step-card p { margin-top: 14px; color: #e2e8f0; max-width: 48ch; }
  .oa-step-card .det { margin-top: 20px; font-weight: 600; color: var(--cv-mint); }
  .oa-dots { display: flex; gap: 2px; margin-top: 28px; margin-left: -9px; }
  .oa-dots button { width: 32px; height: 32px; display: grid; place-items: center; background: none; border: 0; cursor: pointer; padding: 0; border-radius: var(--cv-r); }
  .oa-dots button i { display: block; height: 6px; width: 6px; border-radius: 3px; background: rgba(255,255,255,.3); transition: width .25s, background-color .25s; }
  .oa-dots button[aria-current="step"] i { width: 22px; background: var(--cv-mint); }
  .oa-dots button:focus-visible { outline: 3px solid var(--cv-mint); outline-offset: 0; }

  /* ── CALCULADORA: controles en tono, resultado en el campo oscuro (como la de la home) ── */
  .oa-calc { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 56px; }
  .oa-ctrl { background: var(--cv-tone); border-radius: var(--cv-r); padding: clamp(24px, 3.5vw, 48px); }
  .oa-lab { font-size: .9375rem; font-weight: 600; color: var(--cv-soft); margin-bottom: 10px; }
  .seg { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background: #fff; border-radius: var(--cv-r); padding: 4px; }
  .seg button { font: 600 .9375rem/1.25 var(--cv-font); color: var(--cv-soft); background: transparent; border: 0; border-radius: 4px; padding: 12px 8px; min-height: 44px; cursor: pointer; transition: background-color .15s, color .15s; }
  .seg button[aria-pressed="true"] { background: var(--cv-accent); color: #fff; }
  .seg button:focus-visible { outline: 3px solid var(--cv-accent); outline-offset: 1px; }
  .oa-val { display: flex; justify-content: space-between; align-items: baseline; margin-top: 28px; }
  .oa-val .oa-lab { margin: 0; }
  .oa-val output { font-size: 1.75rem; font-weight: var(--cv-wh); letter-spacing: var(--cv-trk); color: var(--cv-accent); }
  .oa-ctrl input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 44px; background: transparent; margin-top: 4px; cursor: pointer; touch-action: pan-y; }
  .oa-ctrl input[type=range]::-webkit-slider-runnable-track { height: 8px; border-radius: 4px; background: linear-gradient(var(--cv-accent), var(--cv-accent)) 0 / var(--p, 10%) 100% no-repeat, var(--cv-tone-2); } /* taste-skill-ignore: relleno plano del avance del deslizador */
  .oa-ctrl input[type=range]::-moz-range-track { height: 8px; border-radius: 4px; background: var(--cv-tone-2); }
  .oa-ctrl input[type=range]::-moz-range-progress { height: 8px; border-radius: 4px; background: var(--cv-accent); }
  .oa-ctrl input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 28px; height: 28px; border-radius: 50%; background: var(--cv-accent); margin-top: -10px; border: 4px solid #fff; }
  .oa-ctrl input[type=range]::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: var(--cv-accent); border: 4px solid #fff; }
  .oa-ctrl input[type=range]:focus-visible { outline: 3px solid var(--cv-accent); outline-offset: 2px; border-radius: 4px; }
  .oa-ends { display: flex; justify-content: space-between; font-size: .875rem; color: var(--cv-soft); }
  .oa-bars { display: grid; gap: 14px; margin-top: 22px; }
  .oa-brow { display: flex; justify-content: space-between; gap: 12px; font-size: .9375rem; }
  .oa-brow b { font-weight: 700; white-space: nowrap; }
  .oa-track { height: 6px; background: var(--cv-tone-2); border-radius: 3px; margin-top: 6px; overflow: hidden; }
  .oa-track i { display: block; height: 100%; background: var(--cv-accent); transition: width .4s; }
  .oa-track.b2 i { background: var(--cv-ink); }
  .oa-emp { margin-top: 16px; font-size: .9375rem; background: #fff; border-radius: var(--cv-r); padding: 12px 14px; }
  .oa-cost { margin-top: 16px; background: #fff; border-radius: var(--cv-r); padding: 14px 16px; font-size: .9375rem; }
  .oa-cost .h { font-weight: 700; margin-bottom: 8px; }
  .oa-cost > div:not(.h) { display: flex; justify-content: space-between; gap: 10px; padding: 3px 0; }
  .oa-cost > div > span:last-child { white-space: nowrap; }
  .oa-cost .m { font-size: .875rem; color: var(--cv-soft); }
  .oa-cost .t { font-weight: 700; font-size: 1rem; padding-top: 10px !important; margin-top: 6px; box-shadow: inset 0 2px 0 var(--cv-tone-2); } /* taste-skill-ignore: la raya del total de una cuenta */
  .oa-res { background: var(--cv-field); color: #fff; border-radius: var(--cv-r); padding: clamp(24px, 3.5vw, 48px); display: flex; flex-direction: column; justify-content: center; }
  .oa-res .k { font-size: .9375rem; color: var(--cv-mint); font-weight: 600; }
  .oa-res .big { font-size: clamp(2rem, 1.4rem + 2vw, 3rem); font-weight: var(--cv-wh); letter-spacing: var(--cv-trk); line-height: 1.05; margin-top: 6px; font-variant-numeric: tabular-nums; }
  .oa-res .s { font-size: .9375rem; color: var(--cv-field-soft); margin-top: 6px; }
  .oa-res .row { background: var(--cv-field-2); border-radius: var(--cv-r); padding: 16px 18px; margin-top: 22px; }
  .oa-res .row b { display: block; font-size: 1.75rem; font-weight: var(--cv-wh); letter-spacing: var(--cv-trk); margin-top: 4px; font-variant-numeric: tabular-nums; }
  .oa-res .per { font-size: .9375rem; color: var(--cv-field-soft); margin-top: 16px; }
  .oa-res .per b { color: #fff; }
  .oa-res .per em { font-style: normal; color: var(--cv-mint); font-weight: 700; }
  .oa-res .cv-btn { width: 100%; margin-top: 22px; }
  .oa-res .cv-btn:focus-visible { outline-color: var(--cv-mint); }
  .oa-res .note { font-size: .875rem; color: var(--cv-field-soft); margin-top: 12px; }

  /* ── POR QUÉ: el texto a la izquierda, cuatro razones en baldosas ── */
  .oa-why-copy { grid-column: 1 / span 6; }
  .oa-why-copy p { margin-top: 18px; max-width: 58ch; }
  .oa-why-copy p + p { color: var(--cv-soft); }
  .oa-why-list { grid-column: 7 / span 6; list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; align-self: start; }
  .oa-why-list li { background: var(--cv-tone); border-radius: var(--cv-r); padding: 22px; }
  .oa-why-list .t { font-size: 1.125rem; font-weight: 700; letter-spacing: -0.02em; line-height: 1.25; }
  .oa-why-list .d { font-size: .9375rem; margin-top: 8px; }

  /* ── PREGUNTAS: baldosas que se abren (las de la home) ── */
  .faq-grid { align-items: start; }
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
  .faq-body { padding: 0 24px 24px; max-width: 62ch; font-size: 1.0625rem; color: #fff; }

  /* ── CIERRE: campo verde, como el del resto del sitio ── */
  .oa-close { padding-block: var(--cv-gap-sec); }
  .oa-close-box { background: var(--cv-accent); color: #fff; border-radius: var(--cv-r); padding: clamp(36px, 6vw, 88px) clamp(24px, 5vw, 72px); display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: clamp(12px, 2vw, 28px); align-items: end; }
  .oa-close-copy { grid-column: 1 / span 7; }
  .oa-close-copy h2 { font-size: var(--cv-head); font-weight: var(--cv-wh); letter-spacing: var(--cv-trk); line-height: 1; text-wrap: balance; }
  .oa-close-copy p { margin-top: 18px; max-width: 54ch; }
  .oa-close-act { grid-column: 9 / span 4; }
  .oa-close-act .cv-btn { width: 100%; }
  .oa-close-act .cv-btn:focus-visible { outline-color: #fff; }
  .oa-close-act ul { list-style: none; display: grid; gap: 8px; margin-top: 22px; font-size: var(--cv-small); font-weight: 600; }
  .oa-close-act .cv-sq::before { background: #fff; }

  @media (max-width: 1100px) {
    .oa-ben { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 900px) {
    .oa-intro, .oa-steps-col, .oa-step-card, .oa-why-copy, .oa-why-list, .oa-close-copy, .oa-close-act { grid-column: 1 / -1; }
    .oa-step-card { margin-top: 32px; min-height: 0; }
    .oa-board { grid-template-columns: 1fr; gap: 6px; }
    .oa-calc { grid-template-columns: 1fr; gap: 6px; }
    .oa-why-list { margin-top: 32px; }
    .faq-grid > h2 { grid-column: 1 / -1; position: static; margin-bottom: 28px; }
    .qs { grid-column: 1 / -1; }
    .faq-btn { min-height: 64px; font-size: 1.0625rem; padding: 16px 18px; }
    .faq-body { padding: 0 18px 20px; font-size: 1rem; }
    .oa-close-act { margin-top: 32px; }
    h1 br, h2 br { display: none; }
  }
  @media (max-width: 560px) {
    .oa-ben, .oa-why-list { grid-template-columns: 1fr; gap: 6px; }
    .oa-acts .cv-btn { width: 100%; }
  }
  @media (prefers-reduced-motion: reduce) {
    .oa-hero h1, .oa-hero-sub, .oa-acts, .oa-trust { animation: none; }
    .oa-rail li::before, .oa-dots button i, .oa-track i, .pm::before, .pm::after { transition: none; }
  }
`;

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function Icon({ name, size = 20, color = "currentColor", style = {} }: { name: string; size?: number; color?: string; style?: React.CSSProperties }) {
  const paths: Record<string, JSX.Element> = {
    messageCircle: <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {paths[name]}
    </svg>
  );
}

const Arr = () => <span className="cv-arr" aria-hidden="true">→</span>;

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="hero" aria-label="Portada - CertiVeh Otros Activos" className="oa-hero cv-hero-full">
      {/* Background video, con el velo neutro de la home */}
      <div className="oa-hero-media" aria-hidden="true">
        <video
          ref={el => { if (el) { el.muted = true; el.play().catch(() => {}); } }}
          autoPlay muted loop playsInline
          preload="auto"
          poster="/otros-activos-poster.webp"
        >
          <source src="/otros-activos-hero.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="oa-wrap oa-hero-copy">
        <h1>
          Ahórrate hasta el 19% de IVA y deduce{" "}
          <span>
            el 50% de tu inversión en renta
          </span>
        </h1>

        <p className="oa-hero-sub">
          CertiVeh gestiona tu certificado UPME de principio a fin para proyectos de gestión eficiente de la energía (GEE) y fuentes no convencionales de energía (FNCE).
        </p>

        <div className="oa-acts">
          <a href="#calculadora" className="cv-btn cv-btn-a">
            Calcular mi beneficio <Arr/>
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="cv-btn cv-btn-w">
            Hablar con un asesor <Icon name="messageCircle" size={18}/>
          </a>
        </div>

        <ul className="oa-trust">
          {["Certificado oficial UPME","Cuatro beneficios tributarios","Gestión integral","Personas naturales y jurídicas"].map(txt => (
            <li key={txt} className="cv-sq">{txt}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── ACTIVOS ──────────────────────────────────────────────────────────────────
function Activos() {
  const activos = [
    {
      icon: "battery",
      tag: "GEE - Anexo 2",
      title: "Cargadores de vehículos eléctricos y electrolineras",
      desc: "Infraestructura de carga para movilidad eléctrica. Cargadores AC, DC y sistemas de gestión de carga.",
      accentColor: "var(--emerald-600)",
      iconBg: "rgba(5,150,105,0.1)",
      img: "/activo-cargador.webp",
    },
    {
      icon: "truck",
      tag: "GEE - Anexo 2",
      title: "Camiones y flotas a gas natural vehicular (GNV)",
      desc: "Vehículos nuevos de bajas emisiones dedicados a gas natural para transporte de carga o uso corporativo.",
      accentColor: "var(--teal-500)",
      iconBg: "rgba(20,184,166,0.1)",
      img: "/activo-camion.webp",
    },
    {
      icon: "sun",
      tag: "FNCE - Anexo 1",
      title: "Proyectos de energía solar",
      desc: "Autogeneración, techos solares y granjas solares. Paneles, inversores, estructuras y servicios de instalación.",
      accentColor: "var(--emerald-600)",
      iconBg: "rgba(5,150,105,0.1)",
      img: "/activo-solar.webp",
    },
  ];
  return (
    <section id="activos" aria-label="Activos que certificamos" className="oa-sec">
      <div className="oa-wrap">
        <div className="oa-grid">
          <div className="oa-intro">
            <h2 className="oa-h2">
              Activos que{" "}
              <span>certificamos</span>
            </h2>
            <p>
              Gestionamos tu certificado UPME para proyectos de gestión eficiente de la energía (GEE) y de fuentes no convencionales de energía (FNCE).
            </p>
          </div>
        </div>

        <div className="oa-board">
          {activos.map((a, i) => (
            <div key={i} className="oa-asset">
              <div className="oa-asset-img">
                <img src={a.img} alt={a.title} loading="lazy" />
              </div>
              <div className="oa-asset-body">
                <div className="oa-tag">
                  {a.tag}
                </div>
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── BENEFICIOS TRIBUTARIOS ────────────────────────────────────────────────────
function Beneficios() {
  const cards = [
    {
      icon: "percent",
      title: "Deducción en renta",
      pct: "50%",
      accentColor: "var(--emerald-600)",
      iconBg: "rgba(5,150,105,0.1)",
      desc: "Deducción del 50% del valor total de la inversión, aplicable en un periodo de hasta 15 años. El tope anual no puede exceder el 50% de la renta líquida.",
      norma: "Art. 11, Ley 1715/2014 (mod. Ley 2099/2021)",
    },
    {
      icon: "dollarSign",
      title: "Exclusión de IVA",
      pct: "19%",
      accentColor: "var(--teal-500)",
      iconBg: "rgba(20,184,166,0.1)",
      desc: "Equipos, maquinaria y servicios destinados al proyecto excluidos de IVA (19%). Si el IVA ya se pagó, el contribuyente puede solicitar su devolución ante la DIAN presentando el certificado UPME como soporte: ese trámite lo adelanta él, CertiVeh no lo gestiona en esta vertical.",
      norma: "Art. 12, Ley 1715/2014 (mod. Ley 2099/2021)",
    },
    {
      icon: "shield",
      title: "Exención arancelaria",
      pct: "0%",
      accentColor: "var(--emerald-600)",
      iconBg: "rgba(5,150,105,0.1)",
      desc: "Exención del pago de derechos arancelarios en la importación de maquinaria, equipos, materiales e insumos destinados al proyecto.",
      norma: "Art. 13, Ley 1715/2014 (mod. Ley 2099/2021)",
    },
    {
      icon: "zap",
      title: "Depreciación acelerada",
      pct: "~3 años",
      accentColor: "var(--teal-500)",
      iconBg: "rgba(20,184,166,0.1)",
      desc: "Tasa anual de hasta el 33,33%, permitiendo la recuperación contable y fiscal del activo en aproximadamente 3 años en lugar del periodo convencional.",
      norma: "Art. 14, Ley 1715/2014 (mod. Ley 2099/2021) y Decreto 895/2022",
    },
  ];
  return (
    <section id="beneficios" aria-label="Beneficios tributarios" className="oa-sec">
      <div className="oa-wrap">
        <div className="oa-grid">
          <div className="oa-intro">
            <h2 className="oa-h2">
              Cuatro beneficios tributarios. <br/>
              <span>Un solo certificado.</span>
            </h2>
            <p>
              La Ley 1715 de 2014, modificada por la Ley 2099 de 2021, creó cuatro incentivos tributarios para inversiones en GEE y FNCE. El certificado UPME es el único requisito para acceder a todos.
            </p>
          </div>
        </div>

        <div className="oa-ben">
          {cards.map((c, i) => (
            <div key={i} className="oa-b">
              <h3>{c.title}</h3>
              <div className="pct">{c.pct}</div>
              <p>{c.desc}</p>
              <div className="norma">
                <span>{c.norma}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ── COMO FUNCIONA ────────────────────────────────────────────────────────────
function ComoFunciona() {
  const [active, setActive] = useState(0);
  const steps = [
    { num: "01", icon: "upload",      title: "Recopilación de documentos",  subtitle: "Fichas técnicas y facturas",      desc: "Nos envías las fichas técnicas de los equipos, facturas o cotizaciones y la información del proyecto. Nosotros verificamos que todo corresponda a los anexos de la Resolución UPME 135 de 2025.", detail: "Verificamos elegibilidad antes de radicar." }, // taste-skill-ignore: el número se conserva en el documento (huella de textos) pero no se pinta
    { num: "02", icon: "fileText",    title: "Radicación ante la UPME",     subtitle: "Ventana continua",               desc: "CertiVeh prepara y radica la solicitud a través del Sistema Único de Usuarios (SUU) de la UPME con todos los formatos oficiales. La ventana de radicación es continua: del 1 de febrero al 15 de diciembre.", detail: "Resolución UPME 400 de 2026, ventana continua." }, // taste-skill-ignore: el número se conserva en el documento (huella de textos) pero no se pinta
    { num: "03", icon: "clock",       title: "Evaluación técnica",          subtitle: "FNCE: 20 días / GEE: 30 días",  desc: "La UPME verifica completitud en 10 días hábiles. Luego evalúa: hasta 20 días hábiles para proyectos FNCE (solar) o hasta 30 días hábiles para GEE (cargadores, GNV). Respondemos cualquier requerimiento.", detail: "CertiVeh gestiona los requerimientos de la UPME." }, // taste-skill-ignore: el número se conserva en el documento (huella de textos) pero no se pinta
    { num: "04", icon: "award",       title: "Emisión del certificado",     subtitle: "Certificado oficial UPME",       desc: "Si el concepto técnico es favorable, la UPME emite el certificado y lo notifica por el SUU. Los certificados no tienen límite de vigencia y pueden modificarse dentro de los 2 años siguientes.", detail: "Sin límite de vigencia." }, // taste-skill-ignore: el número se conserva en el documento (huella de textos) pero no se pinta
    { num: "05", icon: "dollarSign",  title: "Aplicación de beneficios",    subtitle: "IVA, renta, arancel, depreciación", desc: "Con el certificado UPME soportas la exclusión/devolución de IVA ante la DIAN, la deducción en renta, la exención arancelaria y la depreciación acelerada en tu contabilidad fiscal.", detail: "Cuatro beneficios con un solo certificado." }, // taste-skill-ignore: el número se conserva en el documento (huella de textos) pero no se pinta
  ];

  // Avanza solo cada 5 s, salvo con «reducir movimiento»: ahí no se mueve nada que el visitante no toque.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section id="como-funciona" aria-label="Cómo funciona" className="oa-dark">
      <div className="oa-wrap oa-grid">
        <div className="oa-steps-col">
          <h2 className="oa-h2">
            El proceso de <br/><span>certificación.</span>
          </h2>
          <p className="oa-steps-lead">
            De la documentación al certificado UPME. CertiVeh gestiona todo el trámite por ti.
          </p>
          <ol className="oa-rail">
            {steps.map((s, i) => (
              <li key={i} className={i < active ? "done" : i === active ? "on" : ""}>
                <button className={`step-tab${active === i ? " active" : ""}`} onClick={() => setActive(i)} aria-current={active === i ? "step" : undefined}>
                  <span className="step-num" aria-hidden="true">{s.num}</span>
                  <span className="step-t">{s.title}</span>
                  <span className="step-s">{s.subtitle}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="oa-step-card" aria-live="polite">
          <div className="wm" aria-hidden="true">{steps[active].num}</div>
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}>
              <h3>{steps[active].title}</h3>
              <p>{steps[active].desc}</p>
              <div className="det cv-sq">
                {steps[active].detail}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="oa-dots">
            {steps.map((s, i) => (
              <button key={i} onClick={() => setActive(i)} aria-label={s.title} aria-current={i === active ? "step" : undefined}><i/></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CALCULADORA ───────────────────────────────────────────────────────────────
function Calculadora() {
  const tarifa = useTarifa();
  const [valor, setValor] = useState(200);
  const [perfil, setPerfil] = useState("empresa");
  const [calc, setCalc] = useState<any>({});
  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-CO") + " COP";

  useEffect(() => {
    const v = valor * 1_000_000;

    const iva = v * 0.19;
    const renta = v * 0.50;
    const totalBeneficio = iva + renta;

    // La tasa UPME (en UVT) y los honorarios de gas de la tarifa: `cotizacionDeGas` (ajuste de precios, lote 4).
    const { costoUPME, honorariosBase, ivaServicio, costoTotal } = cotizacionDeGas(v, tarifa);

    setCalc({ iva, renta, totalBeneficio, costoUPME, honorariosBase, ivaServicio, costoTotal, neto: totalBeneficio - costoTotal });
  }, [valor, perfil, tarifa]);

  return (
    <section id="calculadora" aria-label="Calculadora de costos" className="oa-sec">
      <div className="oa-wrap">
        <div className="oa-grid">
          <div className="oa-intro">
            <h2 className="oa-h2">
              Calcula tu beneficio y{" "}
              <span>el costo total</span>
            </h2>
            <p>Mueve el slider y ve el desglose en tiempo real, con el costo del trámite incluido, y cuánto puedes solicitar en incentivos.</p>
          </div>
        </div>

        <div className="oa-calc">
          {/* Controls */}
          <div className="oa-ctrl">
            <div className="oa-lab">Perfil tributario</div>
            <div className="seg">
              {[{ value: "natural", label: "Persona natural" },{ value: "empresa", label: "Empresa" }].map(opt => (
                <button key={opt.value} onClick={() => setPerfil(opt.value)} aria-pressed={perfil === opt.value}>
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="oa-val">
              <div className="oa-lab">Valor de la inversión</div>
              <output>${valor}M</output>
            </div>
            <input type="range" min="10" max="2000" step="10" value={valor} onChange={e => setValor(Number(e.target.value))} aria-label="Valor de la inversión" style={{ ["--p" as string]: `${((valor-10)/1990)*100}%` }}/>
            <div className="oa-ends">
              <span>$10M</span><span>$2.000M</span>
            </div>

            {/* Benefit bars */}
            <div className="oa-bars">
              {[
                { label: "Exclusión/devolución de IVA (19%)", value: calc.iva, pct: calc.iva / (calc.totalBeneficio || 1) },
                { label: "Deducción en renta (50%)", value: calc.renta, pct: calc.renta / (calc.totalBeneficio || 1) },
              ].map((b, i) => (
                <div key={i}>
                  <div className="oa-brow">
                    <span>{b.label}</span>
                    <b>{b.value ? fmt(b.value) : "-"}</b>
                  </div>
                  <div className={`oa-track${i ? " b2" : ""}`}>
                    <i style={{ width: `${(b.pct || 0) * 100}%` }}/>
                  </div>
                </div>
              ))}
            </div>

            {perfil === "empresa" && (
              <div className="oa-emp">
                Depreciación acelerada a ~3 años (tasa anual hasta 33,33%), más exención arancelaria si los equipos son importados.
              </div>
            )}

            {calc.costoUPME != null && (
              <div className="oa-cost">
                <div className="h">
                  <span>Costo total</span>
                </div>
                <div>
                  <span>Trámite ante UPME</span>
                  <span>{fmt(calc.costoUPME)}</span>
                </div>
                <div>
                  <span>Servicio de tramitación CertiVeh</span>
                  <span>{fmt(calc.honorariosBase)}</span>
                </div>
                <div className="m">
                  <span>IVA (19% sobre tramitación)</span>
                  <span>{fmt(calc.ivaServicio)}</span>
                </div>
                <div className="t">
                  <span>Total</span>
                  <span>{fmt(calc.costoTotal)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Result */}
          <div className="oa-res" aria-live="polite" data-ui>
            <div className="k">Beneficio total estimado</div>
            <div className="big">
              {calc.totalBeneficio ? fmt(calc.totalBeneficio) : "-"}
            </div>
            <div className="s">en incentivos tributarios (incluye base gravable en renta)</div>

            <div className="row">
              <div className="k">Beneficio estimado menos el costo total</div>
              <b>{calc.neto ? fmt(calc.neto) : "-"}</b>
            </div>

            {calc.costoTotal && calc.totalBeneficio && (
              <div className="per">
                Por cada <b>$1</b> de costo total, un beneficio estimado de{" "}
                <em>${(Math.round(calc.totalBeneficio / calc.costoTotal * 10) / 10).toLocaleString("es-CO")}</em> en beneficios.
              </div>
            )}

            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="cv-btn cv-btn-a">
              Solicitar cotización <Arr/>
            </a>
            <div className="note">Certificación UPME para GEE y FNCE</div>
          </div>
        </div>

      </div>
    </section>
  );
}

// ── POR QUE EL CERTIFICADO UPME ──────────────────────────────────────────────
function PorQueCertificado() {
  return (
    <section id="por-que" aria-label="Por qué el certificado UPME es indispensable" className="oa-sec">
      <div className="oa-wrap oa-grid">
        <div className="oa-why-copy">
          <h2 className="oa-h2">
            Por qué el certificado UPME es{" "}
            <span>indispensable</span>
          </h2>
          <p>
            Según la UPME, para acceder a los beneficios de exclusión de IVA, deducción de renta, depreciación acelerada y exención arancelaria, "lo único que se requiere es tener el certificado de la UPME como soporte".
          </p>
          <p>
            Sin certificado UPME no hay acceso a ninguno de los cuatro beneficios. Es el requisito habilitante que acredita que tu inversión es elegible para los incentivos de la Ley 1715 de 2014.
          </p>
        </div>
        <ul className="oa-why-list">
            {[
              { icon: "shield", title: "Documento oficial", desc: "Acredita que tu inversión es elegible para los cuatro incentivos tributarios de la Ley 1715/2014 (mod. Ley 2099/2021)." },
              { icon: "clock", title: "Sin límite de vigencia", desc: "Los certificados bajo la Resolución UPME 135 de 2025 no vencen. Pueden modificarse hasta 2 años después de su expedición." },
              { icon: "building", title: "Para cualquier contribuyente", desc: "Puede solicitarlo cualquier persona natural o jurídica que realice la inversión, incluyendo inversiones vía leasing financiero." },
              { icon: "checkCircle", title: "Ventana continua", desc: "La UPME recibe solicitudes de forma continua del 1 de febrero al 15 de diciembre de cada año (Res. UPME 563/2026)." },
            ].map((item, i) => (
            <li key={i}>
              <div className="t">{item.title}</div>
              <div className="d">{item.desc}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    { q: "¿Qué es el certificado UPME y para qué sirve?", a: "Es el documento oficial que acredita que una inversión en eficiencia energética (GEE) o energías renovables (FNCE) es elegible para los incentivos de la Ley 1715 de 2014. Es el único soporte requerido para acceder a los cuatro beneficios tributarios: deducción en renta, exclusión de IVA, exención arancelaria y depreciación acelerada." },
    { q: "¿Quién puede solicitarlo?", a: "Cualquier persona natural o jurídica que realice la inversión. Esto incluye empresas, inversionistas, operadores de flotas, desarrolladores de proyectos solares y propietarios de infraestructura de carga, entre otros." },
    { q: "¿Cuánto se demora el proceso?", a: "La UPME verifica completitud en 10 días hábiles y evalúa en hasta 20 días hábiles para proyectos FNCE (como energía solar) o hasta 30 días hábiles para proyectos GEE (como cargadores o vehículos GNV). CertiVeh gestiona todo el proceso y responde a los requerimientos de la UPME." },
    { q: "¿El certificado vence?", a: "No. Los certificados emitidos bajo la Resolución UPME 135 de 2025 no tienen límite de vigencia. Pueden modificarse (por ejemplo, para incluir información arancelaria o adicionar solicitantes) dentro de los 2 años siguientes a su expedición." },
    { q: "¿Aplica si la inversión se hizo con leasing?", a: "Sí. El Decreto 895 de 2022 contempla expresamente las inversiones realizadas mediante leasing financiero (art. 1.2.1.18.72). Esto es especialmente relevante para flotas de vehículos y equipos de alto valor." },
    { q: "¿Puedo combinar la deducción de renta con la depreciación acelerada?", a: "Sí. La norma establece que tomar ambos beneficios no se considera concurrencia de beneficios (Decreto 895 de 2022). Cada caso debe validarse con asesoría tributaria." },
    { q: "¿Qué pasa con el IVA que ya pagué?", a: "Con el certificado UPME puede solicitarse la devolución del IVA ante la DIAN, presentándolo como soporte. Ese trámite lo adelanta el contribuyente: el servicio de gestión del IVA de CertiVeh aplica solo a vehículos eléctricos e híbridos." },
  ];
  return (
    <section id="faq" aria-label="Preguntas frecuentes" className="oa-sec">
      <div className="oa-wrap oa-grid faq-grid">
        <h2 className="oa-h2">Todo lo que necesitas saber</h2>
        <div className="qs">
          {items.map((item, i) => (
            <div key={i} className={`faq-item${open === i ? " open" : ""}`}>
              <button className="faq-btn" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                <span>{item.q}</span><span className="pm" aria-hidden="true"/>
              </button>
              {open === i && (
                <motion.div className="faq-body" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }}>
                  {item.a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA FINAL ─────────────────────────────────────────────────────────────────
function CTAFinal() {
  return (
    <section id="cta-final" aria-label="Comenzar" className="oa-close">
      <div className="oa-wrap">
        <div className="oa-close-box">
          <div className="oa-close-copy">
            <h2>
              Tus incentivos tributarios <br/><span>te están esperando.</span>
            </h2>
            <p>
              Deducción de renta del 50%, exclusión de IVA, exención arancelaria y depreciación acelerada. CertiVeh gestiona tu certificado UPME de principio a fin.
            </p>
          </div>
          <div className="oa-close-act">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="cv-btn cv-btn-w">
              Hablar con un asesor <Icon name="messageCircle" size={18}/>
            </a>
            <ul>
              {["Gestión integral del trámite","Personas naturales y jurídicas","Leasing financiero elegible"].map(t => (
                <li key={t} className="cta-feature cv-sq">{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
// El pie compartido (SiteFooter) con el contenido propio de esta vertical: su frase, sus tres columnas
// con anclas locales y sin el botón del portal de vehículos. Textos y enlaces, los de siempre.
const FOOTER_COLUMNAS = [
  { label: "Secciones", links: [{ text: "Activos", href: "#activos" }, { text: "Beneficios", href: "#beneficios" }, { text: "Cómo funciona", href: "#como-funciona" }, { text: "Calculadora", href: "#calculadora" }] },
  { label: "CertiVeh", links: [{ text: "Eléctricos e híbridos", href: "/" }, { text: "Blog", href: "/blog" }, { text: "Quiénes somos", href: "/nosotros/" }] },
  { label: "Legal", links: [{ text: "Términos y Condiciones", href: "/terminos-y-condiciones" }, { text: "Política de Privacidad", href: "/politica-de-privacidad" }] }
];

function Footer() {
  return (
    <SiteFooter
      tagline="Certificación UPME para proyectos de gestión eficiente de la energía (GEE) y fuentes no convencionales de energía (FNCE) en Colombia."
      columns={FOOTER_COLUMNAS}
      cta={null}
    />
  );
}

// ── WhatsApp FAB ─────────────────────────────────────────────────────────────
// Flota sobre la página: es uno de los tres elementos del sitio que llevan sombra (DESIGN_SYSTEM.md §0.3).
function WhatsAppFAB() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      style={{
        position: "fixed", bottom: 24, right: 20, zIndex: 90,
        width: 56, height: 56, borderRadius: "50%",
        background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 16px rgba(37,211,102,0.4), 0 2px 4px rgba(0,0,0,0.2)", // taste-skill-ignore: el botón flotante de WhatsApp
        transition: "transform 0.2s",
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function EmpresasLanding({ tarifaDelBuild }: { tarifaDelBuild?: string } = {}) {
  // La tarifa del build al pintar y, tras hidratar, la vigente con el reloj del cliente (lote 4).
  const tarifa = useTarifaDeLaIsla(tarifaDelBuild);
  return (
    <TarifaDeLaIsla.Provider value={tarifa}>
      {/* Como HTML crudo: con <style>{CSS}</style> React escapa el CSS prerenderizado y la hidratación no coincide (ver CertiVehLandingComplete). */}
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Navbar isHome={false} darkHero vertical="otros-activos" localSections={["#beneficios", "#como-funciona", "#calculadora"]} />
      <main>
        <Hero/>
        <Activos/>
        <Beneficios/>
        <ComoFunciona/>
        <Calculadora/>
        <PorQueCertificado/>
        <FAQ/>
        <CTAFinal/>
      </main>
      <Footer/>
      <WhatsAppFAB/>
    </TarifaDeLaIsla.Provider>
  );
}
