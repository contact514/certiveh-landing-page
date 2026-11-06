import { useState, useEffect, useCallback } from "react";
import { Navbar } from "./Navbar";
import { SiteFooter } from "./SiteFooter";
import { AnimatePresence, motion } from "motion/react";
import { cotizacionDeGas } from '@/lib/precios-de-la-landing.ts';
import { TarifaDeLaIsla, useTarifa, useTarifaDeLaIsla } from './la-tarifa-de-la-isla.ts';
import { CSS_CALC, CSS_CALC_MOVIL, CSS_RIEL, CSS_RIEL_MOVIL, useRielPorScroll } from './piezas-de-la-marca.ts';
import { CSS_ILUSTRACION, IlustracionDelPaso } from './IlustracionesDelProceso';

// ─────────────────────────────────────────────────────────────────────────────
// CertiVeh — Landing Empresas
// Certificación UPME para GEE y FNCE
//
// Estándar visual 2026-11 (DESIGN_SYSTEM.md §0) y los MISMOS patrones de la home (§0.5): el video a pantalla
// completa con la calculadora encima (`.calc`), los beneficios en baldosas escalonadas, el riel de pasos que avanza
// con el scroll con una pieza de producto a la derecha (`.flow`, `.ui`), las preguntas en baldosas y el cierre a
// lo ancho. El CSS de la calculadora, del riel y de las piezas sale de `piezas-de-la-marca.ts`, el mismo que monta
// la home. Los textos, enlaces y datos de cada sección son los de siempre.
// ─────────────────────────────────────────────────────────────────────────────

const WHATSAPP_URL = "https://wa.me/573151298420?text=Hola%2C%20quiero%20información%20sobre%20la%20certificación%20UPME%20para%20mi%20empresa";

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: var(--cv-bg); color: var(--cv-ink); font-family: var(--cv-font); font-size: var(--cv-body); line-height: 1.5; letter-spacing: -0.01em; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
  .oa-wrap { padding-inline: var(--cv-m); max-width: 1520px; margin: 0 auto; }
  .oa-grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: clamp(12px, 2vw, 28px); }
  .oa-sec { padding-top: var(--cv-gap-sec); scroll-margin-top: var(--cv-ancla-sec); }
  .oa-intro { grid-column: 1 / span 7; }
  .oa-intro p { margin-top: 18px; max-width: 58ch; }
  [hidden] { display: none !important; }

  /* ── HERO: el video a pantalla completa, el texto a la izquierda y la calculadora encima (como la home) ── */
  .oa-hero { position: relative; padding: calc(64px + clamp(40px, 6vw, 96px)) 0 clamp(40px, 5vw, 72px); color: #fff; background: var(--cv-field); overflow: clip; }
  .oa-hero-media { position: absolute; inset: 0; }
  .oa-hero-media video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
  .oa-hero-media::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(9,14,26,.88) 0%, rgba(9,14,26,.72) 45%, rgba(9,14,26,.35) 100%); } /* taste-skill-ignore: velo neutro sobre el video */
  .oa-hero .oa-grid { position: relative; z-index: 1; align-items: start; }
  .oa-hero-copy { grid-column: 1 / span 7; padding-bottom: 40px; position: sticky; top: 104px; } /* acompaña al bajar por la calculadora, como en las fichas */
  .oa-hero h1 { max-width: 11.61em; } /* = 18ch en Albert Sans 700 (el «0» mide 0,645 em). En ch, mientras carga la fuente el ancho salía del «0» del respaldo, mucho más estrecho: el titular partía en una línea más y la página saltaba al llegar Albert Sans (CLS 0,105-0,119). */
  .oa-acts { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 32px; }
  .oa-trust { list-style: none; margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; max-width: 560px; font-size: var(--cv-small); font-weight: 600; }
  .oa-hero .cv-sq::before { background: var(--cv-mint); }
  .oa-stage { grid-column: 8 / span 5; }
  @media (min-width: 901px) {
    /* «Calcular mi beneficio» solo lleva a la calculadora, que en escritorio ya está al lado */
    .oa-solo-movil { display: none; }
    .oa-asesor { background: var(--cv-accent); color: #fff; }
    .oa-asesor:hover { background: var(--cv-accent-hover); }
  }

${CSS_CALC}
  .cost .m, .cost .m span { color: var(--cv-soft); }
  .cost > div > :last-child, .brow b { white-space: nowrap; }
  .brow { gap: 12px; }
  .emp { margin-top: 12px; }

  /* ── ACTIVOS: tres baldosas con su foto ── */
  /* Mosaico de fotos a sangre (como las baldosas escalonadas de la home): los cargadores, la categoría que más se
     pide, ocupan la baldosa grande; el camión y el solar se apilan a su lado. El texto va sobre la foto con el velo
     neutro de las portadas. En el celular, carrusel horizontal con la siguiente asomando. */
  .oa-board { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(300px, 1fr)); gap: 8px; margin-top: 56px; }
  .oa-asset { position: relative; border-radius: var(--cv-r); overflow: hidden; color: #fff; background: var(--cv-field); display: flex; align-items: flex-end; min-height: 300px; }
  .oa-asset:nth-child(1) { grid-column: 1 / span 7; grid-row: 1 / span 2; min-height: 616px; }
  .oa-asset:nth-child(2), .oa-asset:nth-child(3) { grid-column: 8 / span 5; }
  .oa-asset-img { position: absolute; inset: 0; }
  .oa-asset-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .8s cubic-bezier(.2,.7,.2,1); }
  .oa-asset:hover .oa-asset-img img { transform: scale(1.04); }
  .oa-asset-img::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(9,14,26,.2) 0%, rgba(9,14,26,.55) 45%, rgba(9,14,26,.92) 100%); } /* taste-skill-ignore: velo neutro sobre la foto, el mismo de las portadas */
  .oa-asset:nth-child(n+2) .oa-asset-img::after { background: linear-gradient(180deg, rgba(9,14,26,.6) 0%, rgba(9,14,26,.92) 100%); } /* taste-skill-ignore: velo neutro; en las baldosas bajas el texto ocupa casi toda la foto */
  .oa-asset-body { position: relative; padding: clamp(22px, 2.4vw, 36px); display: flex; flex-direction: column; gap: 10px; max-width: 34rem; }
  .oa-asset-body p { color: #e2e8f0; }
  .oa-tag { font-size: var(--cv-small); font-weight: 600; color: var(--cv-mint); }
  .oa-asset:nth-child(1) h3 { font-size: clamp(1.75rem, 1.2rem + 1.8vw, 2.75rem); }
  .oa-asset h3 { font-size: clamp(1.375rem, 1.15rem + 0.7vw, 1.75rem); font-weight: var(--cv-wh); letter-spacing: var(--cv-trk); line-height: 1.1; }

  /* ── BENEFICIOS: baldosas escalonadas, el lenguaje de la home y de la mini landing del portal llevado a cuatro ──
     Dos filas alternadas 7+5 y 5+7: renta en el campo verde, IVA y arancel en tono, depreciación en el campo oscuro.
     Todas a 8 px y estiradas (alturas iguales por fila, bordes alineados), sin alturas en vh. Se probó la de la home
     (la primera alta a la izquierda y tres apiladas): con cuatro, la verde pasaba de 1.100 px con tres líneas de texto. */
  .steps4 { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); grid-template-rows: auto auto; gap: 8px; margin-top: 56px; }
  .bt { border-radius: var(--cv-r); padding: clamp(24px, 3vw, 40px); display: flex; flex-direction: column; gap: 12px; background: var(--cv-tone); min-height: 360px; }
  .bt .fig { font-size: clamp(3.5rem, 2.2rem + 4.4vw, 7rem); font-weight: var(--cv-wh); letter-spacing: calc(var(--cv-trk) * 1.3); line-height: .85; color: var(--cv-accent); }
  .bt h3 { font-size: clamp(1.5rem, 1.2rem + 1vw, 2rem); font-weight: var(--cv-wh); letter-spacing: var(--cv-trk); line-height: 1.1; margin-top: 8px; }
  .bt .law { font-size: var(--cv-small); color: var(--cv-soft); margin-top: auto; padding-top: 8px; }
  .bt.a { grid-column: 1 / span 7; grid-row: 1; background: var(--cv-accent); color: #fff; }
  .bt.a .fig { color: #fff; }
  .bt.a .law { color: #e6f8f0; }
  .bt.b { grid-column: 8 / span 5; grid-row: 1; }
  .bt.c { grid-column: 1 / span 5; grid-row: 2; }
  .bt.d { grid-column: 6 / span 7; grid-row: 2; background: var(--cv-field); color: #fff; }
  .bt.d .fig { color: var(--cv-mint); }
  .bt.d .law { color: var(--cv-field-soft); }

  /* ── EL PROCESO: el riel de la home (avanza con el scroll) y la ilustración de cada paso a la derecha ── */
${CSS_RIEL}
${CSS_ILUSTRACION}
  .flow-steps .step-num { display: none; }

  /* ── POR QUÉ: campo oscuro, el texto a la izquierda y cuatro razones en baldosas ── */
  .oa-dark { background: var(--cv-field); color: #fff; margin-top: var(--cv-gap-sec); padding-block: clamp(64px, 8vw, 120px); scroll-margin-top: var(--cv-ancla-campo); }
  .oa-why-copy { grid-column: 1 / span 5; position: sticky; top: 104px; align-self: start; }
  .oa-why-copy p { margin-top: 18px; max-width: 58ch; color: #e2e8f0; }
  .oa-why-copy p + p { color: var(--cv-field-soft); }
  /* Las cuatro razones como filas de definición (titular grande, explicación al lado), no una rejilla de 2x2 cajas iguales. */
  .oa-why-list { grid-column: 7 / span 6; list-style: none; margin: 0; padding: 0; align-self: start; }
  .oa-why-list li { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); gap: 8px 28px; padding: 26px 0; border-top: 1px solid rgba(255,255,255,.14); } /* taste-skill-ignore: separador de filas de una lista, no una caja */
  .oa-why-list li:first-child { border-top: 0; padding-top: 4px; }
  .oa-why-list .t { font-size: clamp(1.5rem, 1.1rem + 1.1vw, 2.125rem); font-weight: var(--cv-wh); letter-spacing: var(--cv-trk); line-height: 1.05; }
  .oa-why-list .d { font-size: 1rem; line-height: 1.5; color: #e2e8f0; }

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
  .faq-body { padding: 0 24px 24px; max-width: 62ch; font-size: 1.0625rem; color: #eafaf2; }

  /* ── CIERRE: el de la home, el titular grande a la izquierda y la acción a la derecha ── */
  .close { padding-block: var(--cv-gap-sec); scroll-margin-top: var(--cv-ancla-sec); }
  .close-grid { align-items: end; }
  .close h2 { grid-column: 1 / span 7; }
  .close-r { grid-column: 8 / span 5; }
  .close-r p { max-width: 52ch; }
  .close-r .cv-btn { margin-top: 30px; }
  .close-r ul { list-style: none; margin-top: 26px; display: flex; flex-wrap: wrap; gap: 10px 26px; font-size: var(--cv-small); font-weight: 600; }

  /* ── WhatsApp: el único botón que flota (el de la home) ── */
  .whatsapp-fab { position: fixed; right: 18px; bottom: calc(18px + env(safe-area-inset-bottom, 0px)); z-index: 90; width: 56px; height: 56px; border-radius: 50%; background: #1f9d55; display: grid; place-items: center; box-shadow: 0 10px 24px rgba(15,23,42,.25); } /* taste-skill-ignore: elemento que flota (modal o botón fijo) */
  .whatsapp-fab:focus-visible { outline: 3px solid var(--cv-ink); outline-offset: 3px; }

  /* ── entrada al aparecer: solo lo que está fuera del primer pantallazo ── */
  .rv { transition: opacity .6s cubic-bezier(.2,.7,.2,1), transform .6s cubic-bezier(.2,.7,.2,1); }
  .rv.pend { opacity: 0; transform: translateY(24px); }

  @media (max-width: 1100px) {
    .oa-why-copy { position: static; }
  }
  @media (max-width: 900px) {
    .oa-hero-copy, .oa-stage, .oa-intro, .oa-why-copy, .oa-why-list { grid-column: 1 / -1; }
    .oa-hero-copy { position: static; }
    .oa-hero-media::after { background: linear-gradient(180deg, rgba(9,14,26,.82) 0%, rgba(9,14,26,.7) 60%, rgba(9,14,26,.85) 100%); } /* taste-skill-ignore: velo neutro sobre el video */
${CSS_CALC_MOVIL}
    .oa-board { display: flex; gap: 8px; overflow-x: auto; scroll-snap-type: x mandatory; margin-inline: calc(var(--cv-m) * -1); padding-inline: var(--cv-m); scroll-padding-inline: var(--cv-m); scrollbar-width: none; }
    .oa-board::-webkit-scrollbar { display: none; }
    .oa-asset, .oa-asset:nth-child(1) { flex: 0 0 84%; min-height: 440px; scroll-snap-align: start; }
    .steps4 { grid-template-rows: none; gap: 8px; }
    .bt.a, .bt.b, .bt.c, .bt.d { grid-column: 1 / -1; grid-row: auto; min-height: 0; }
${CSS_RIEL_MOVIL}
    .oa-why-list { margin-top: 32px; }
    .oa-why-list li { grid-template-columns: 1fr; padding: 20px 0; }
    .faq-grid > h2 { grid-column: 1 / -1; position: static; margin-bottom: 28px; }
    .qs { grid-column: 1 / -1; }
    .faq-btn { min-height: 64px; font-size: 1.0625rem; padding: 16px 18px; }
    .faq-body { padding: 0 18px 20px; font-size: 1rem; }
    .close h2, .close-r { grid-column: 1 / -1; }
    .close-r { margin-top: 24px; }
    h1 br, h2 br { display: none; }
    /* En el celular todo se ve completo en reposo: sin entrada con opacidad (taste skill) */
    .rv, .rv.pend { opacity: 1; transform: none; transition: none; }
  }
  @media (max-width: 560px) {
    .oa-trust { grid-template-columns: 1fr; }
    .oa-acts .cv-btn, .close-r .cv-btn { width: 100%; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { transition: none !important; animation: none !important; scroll-behavior: auto !important; }
    .rv.pend { opacity: 1; transform: none; }
  }
`;

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function Icon({ name, size = 20, color = "currentColor", style = {} }: { name: string; size?: number; color?: string; style?: React.CSSProperties }) {
  const paths: Record<string, JSX.Element> = {
    messageCircle: <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></>,
    award: <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {paths[name]}
    </svg>
  );
}

const Arr = () => <span className="cv-arr" aria-hidden="true">→</span>;

// ── Entrada de cada pieza: solo lo que está fuera del primer pantallazo, y nunca se queda oculto (el de la home) ──
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
    const red = setTimeout(() => pend.forEach(el => el.classList.remove("pend")), 6000);
    return () => { io.disconnect(); clearTimeout(red); };
  }, []);
}

// ── HERO ──────────────────────────────────────────────────────────────────────
// Como en la home: el video ocupa el primer pantallazo y la calculadora, que es lo único que el visitante puede
// HACER en la página, va encima. En el celular queda debajo del texto y «Calcular mi beneficio» ahorra el scroll.
function Hero() {
  const videoRef = useCallback((el: HTMLVideoElement | null) => {
    if (!el) return;
    el.muted = true;
    el.setAttribute("playsinline", "");
    const tryPlay = () => { el.play().catch(() => {}); };
    tryPlay();
    el.addEventListener("canplay", tryPlay, { once: true });
    document.addEventListener("touchstart", tryPlay, { once: true });
  }, []);
  return (
    <section id="hero" aria-label="Portada - CertiVeh Otros Activos" className="oa-hero cv-hero-full">
      {/* Background video, con el velo neutro de la home */}
      <div className="oa-hero-media" aria-hidden="true">
        <video ref={videoRef} autoPlay muted loop playsInline preload="auto" poster="/otros-activos-poster.webp">
          <source src="/otros-activos-hero.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="oa-wrap oa-grid">
        <div className="oa-hero-copy">
          <h1 className="cv-hero-title">
            Ahórrate hasta el 19% de IVA y deduce{" "}
            <span>
              el 50% de tu inversión en renta
            </span>
          </h1>

          <p className="oa-hero-sub cv-hero-sub">
            CertiVeh gestiona tu certificado UPME de principio a fin para proyectos de gestión eficiente de la energía (GEE) y fuentes no convencionales de energía (FNCE).
          </p>

          <div className="oa-acts">
            <a href="#calculadora" className="cv-btn cv-btn-a oa-solo-movil">
              Calcular mi beneficio <Arr/>
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="cv-btn cv-btn-w oa-asesor">
              Hablar con un asesor <Icon name="messageCircle" size={18}/>
            </a>
          </div>

          <ul className="oa-trust">
            {["Certificado oficial UPME","Cuatro beneficios tributarios","Gestión integral","Personas naturales y jurídicas"].map(txt => (
              <li key={txt} className="cv-sq">{txt}</li>
            ))}
          </ul>
        </div>
        <div className="oa-stage"><Calculadora /></div>
      </div>
    </section>
  );
}

// ── ACTIVOS ──────────────────────────────────────────────────────────────────
function Activos() {
  const activos = [
    {
      tag: "GEE - Anexo 2",
      title: "Cargadores de vehículos eléctricos y electrolineras",
      desc: "Infraestructura de carga para movilidad eléctrica. Cargadores AC, DC y sistemas de gestión de carga.",
      img: "/activo-cargador.webp",
    },
    {
      tag: "GEE - Anexo 2",
      title: "Camiones y flotas a gas natural vehicular (GNV)",
      desc: "Vehículos nuevos de bajas emisiones dedicados a gas natural para transporte de carga o uso corporativo.",
      img: "/activo-camion.webp",
    },
    {
      tag: "FNCE - Anexo 1",
      title: "Proyectos de energía solar",
      desc: "Autogeneración, techos solares y granjas solares. Paneles, inversores, estructuras y servicios de instalación.",
      img: "/activo-solar.webp",
    },
  ];
  return (
    <section id="activos" aria-label="Activos que certificamos" className="oa-sec">
      <div className="oa-wrap">
        <div className="oa-grid">
          <div className="oa-intro rv">
            <h2 className="oa-h2 cv-sec-title">
              Activos que{" "}
              <span>certificamos</span>
            </h2>
            <p className="cv-sec-intro">
              Gestionamos tu certificado UPME para proyectos de gestión eficiente de la energía (GEE) y de fuentes no convencionales de energía (FNCE).
            </p>
          </div>
        </div>

        <div className="oa-board" role="list" aria-label="Activos que certificamos">
          {activos.map((a, i) => (
            <div key={i} className="oa-asset rv" role="listitem">
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
// Las baldosas escalonadas de la home: la deducción en renta (la cifra más grande) en el campo verde, y las otras
// tres a su lado, una de ellas en el campo oscuro.
function Beneficios() {
  const cards = [
    {
      title: "Deducción en renta",
      pct: "50%",
      desc: "Deducción del 50% del valor total de la inversión, aplicable en un periodo de hasta 15 años. El tope anual no puede exceder el 50% de la renta líquida.",
      norma: "Art. 11, Ley 1715/2014 (mod. Ley 2099/2021)",
    },
    {
      title: "Exclusión de IVA",
      pct: "19%",
      desc: "Equipos, maquinaria y servicios destinados al proyecto excluidos de IVA (19%). Si el IVA ya se pagó, el contribuyente puede solicitar su devolución ante la DIAN presentando el certificado UPME como soporte: ese trámite lo adelanta él, CertiVeh no lo gestiona en esta vertical.",
      norma: "Art. 12, Ley 1715/2014 (mod. Ley 2099/2021)",
    },
    {
      title: "Exención arancelaria",
      pct: "0%",
      desc: "Exención del pago de derechos arancelarios en la importación de maquinaria, equipos, materiales e insumos destinados al proyecto.",
      norma: "Art. 13, Ley 1715/2014 (mod. Ley 2099/2021)",
    },
    {
      title: "Depreciación acelerada",
      pct: "~3 años",
      desc: "Tasa anual de hasta el 33,33%, permitiendo la recuperación contable y fiscal del activo en aproximadamente 3 años en lugar del periodo convencional.",
      norma: "Art. 14, Ley 1715/2014 (mod. Ley 2099/2021) y Decreto 895/2022",
    },
  ];
  const [renta, iva, arancel, dep] = cards;
  const Baldosa = ({ c, cls }: { c: typeof cards[number]; cls: string }) => (
    <article className={`bt ${cls} rv`}>
      <div className="fig">{c.pct}</div>
      <h3>{c.title}</h3>
      <p>{c.desc}</p>
      <p className="law">{c.norma}</p>
    </article>
  );
  return (
    <section id="beneficios" aria-label="Beneficios tributarios" className="oa-sec">
      <div className="oa-wrap">
        <div className="oa-grid">
          <div className="oa-intro rv">
            <h2 className="oa-h2 cv-sec-title">
              Cuatro beneficios tributarios. <br/>
              <span>Un solo certificado.</span>
            </h2>
            <p className="cv-sec-intro">
              La Ley 1715 de 2014, modificada por la Ley 2099 de 2021, creó cuatro incentivos tributarios para inversiones en GEE y FNCE. El certificado UPME es el único requisito para acceder a todos.
            </p>
          </div>
        </div>

        <div className="steps4">
          <Baldosa c={renta} cls="a" />
          <Baldosa c={iva} cls="b" />
          <Baldosa c={arancel} cls="c" />
          <Baldosa c={dep} cls="d" />
        </div>
      </div>
    </section>
  );
}

// ── COMO FUNCIONA ────────────────────────────────────────────────────────────────────────────────────────────────────
// El riel de la home: avanza con el scroll (o al tocar un paso) y a la derecha va la ilustración de ESE paso. No son
// piezas del portal: el portal no tiene un flujo de proyectos, así que se dibujan (IlustracionesDelProceso.tsx).

function ComoFunciona() {
  const steps = [
    { num: "01", title: "Recopilación de documentos",  subtitle: "Fichas técnicas y facturas",      desc: "Nos envías las fichas técnicas de los equipos, facturas o cotizaciones y la información del proyecto. Nosotros verificamos que todo corresponda a los anexos de la Resolución UPME 135 de 2025.", detail: "Verificamos elegibilidad antes de radicar." }, // taste-skill-ignore: el número se conserva en el documento (huella de textos) pero no se pinta
    { num: "02", title: "Radicación ante la UPME",     subtitle: "Ventana continua",               desc: "CertiVeh prepara y radica la solicitud a través del Sistema Único de Usuarios (SUU) de la UPME con todos los formatos oficiales. La ventana de radicación es continua: del 1 de febrero al 15 de diciembre.", detail: "Resolución UPME 563 de 2026, ventana continua." }, // taste-skill-ignore: el número se conserva en el documento (huella de textos) pero no se pinta
    { num: "03", title: "Evaluación técnica",          subtitle: "FNCE: 20 días / GEE: unos 15 días hábiles",  desc: "La UPME verifica completitud en 10 días hábiles. Luego evalúa: hasta 20 días hábiles para proyectos FNCE (solar). Para GEE (cargadores, GNV), desde la radicación hasta el certificado UPME: normalmente unos 15 días hábiles, y el máximo legal son 30. Respondemos cualquier requerimiento.", detail: "CertiVeh gestiona los requerimientos de la UPME." }, // taste-skill-ignore: el número se conserva en el documento (huella de textos) pero no se pinta
    { num: "04", title: "Emisión del certificado",     subtitle: "Certificado oficial UPME",       desc: "Si el concepto técnico es favorable, la UPME emite el certificado y lo notifica por el SUU. Los certificados no tienen límite de vigencia y pueden modificarse dentro de los 2 años siguientes.", detail: "Sin límite de vigencia." }, // taste-skill-ignore: el número se conserva en el documento (huella de textos) pero no se pinta
    { num: "05", title: "Aplicación de beneficios",    subtitle: "IVA, renta, arancel, depreciación", desc: "Con el certificado UPME soportas la exclusión/devolución de IVA ante la DIAN, la deducción en renta, la exención arancelaria y la depreciación acelerada en tu contabilidad fiscal.", detail: "Cuatro beneficios con un solo certificado." }, // taste-skill-ignore: el número se conserva en el documento (huella de textos) pero no se pinta
  ];
  const [active, setActive] = useRielPorScroll("#como-funciona .flow-steps > li");

  return (
    <section id="como-funciona" aria-label="Cómo funciona" className="oa-sec">
      <div className="oa-wrap">
        <div className="oa-grid"><div className="oa-intro rv">
          <h2 className="oa-h2 cv-sec-title">
            El proceso de <br/><span>certificación.</span>
          </h2>
          <p className="cv-sec-intro">
            De la documentación al certificado UPME. CertiVeh gestiona todo el trámite por ti.
          </p>
        </div></div>
        <div className="flow">
          <ol className="flow-steps">
            {steps.map((s, i) => (
              <li key={s.num} data-i={i} className={i === active ? "on" : i < active ? "done" : ""} aria-current={i === active ? "step" : undefined} onClick={() => setActive(i)}>
                <span className="step-num" aria-hidden="true">{s.num}</span>
                <h3>{s.title}</h3>
                <p className="subt">{s.subtitle}</p>
                <p className="desc">{s.desc}</p>
                <p className="det">{s.detail}</p>
                <div className="frag" aria-hidden="true"><IlustracionDelPaso i={i} /></div>
              </li>
            ))}
          </ol>
          <div className="flow-panel" aria-hidden="true">
            <div className="flow-sticky">
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ width: "100%", display: "grid", placeItems: "center" }}>
                  <IlustracionDelPaso i={active} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CALCULADORA ───────────────────────────────────────────────────────────────
// La de la home (`.calc`), montada en el hero. La lógica es la de siempre: `cotizacionDeGas` con la tarifa vigente.
function Calculadora() {
  const tarifa = useTarifa();
  const [valor, setValor] = useState(200);
  const [perfil, setPerfil] = useState("empresa");
  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-CO") + " COP";

  // Al pintar, no en un efecto: el HTML del build trae el desglose (ver la calculadora de la home). En un efecto la
  // isla crecía 314 px al hidratar y dejaba cortos los saltos a /otros-activos#beneficios.
  const calc: any = (() => {
    const v = valor * 1_000_000;

    const iva = v * 0.19;
    const renta = v * 0.50;
    const totalBeneficio = iva + renta;

    // La tasa UPME (en UVT) y los honorarios de gas de la tarifa: `cotizacionDeGas` (ajuste de precios, lote 4).
    const { costoUPME, honorariosBase, ivaServicio, costoTotal } = cotizacionDeGas(v, tarifa);

    return { iva, renta, totalBeneficio, costoUPME, honorariosBase, ivaServicio, costoTotal, neto: totalBeneficio - costoTotal };
  })();

  return (
    <section id="calculadora" aria-label="Calculadora de costos" className="calc">
      <h2>
        Calcula tu beneficio y{" "}
        <span>el costo total</span>
      </h2>
      <p className="sub">Mueve el slider y ve el desglose en tiempo real, con el costo del trámite incluido, y cuánto puedes solicitar en incentivos.</p>

      <p className="lab" id="oa-calc-perfil">Perfil tributario</p>
      <div className="seg" role="group" aria-labelledby="oa-calc-perfil">
        {[{ value: "natural", label: "Persona natural" },{ value: "empresa", label: "Empresa" }].map(opt => (
          <button key={opt.value} type="button" onClick={() => setPerfil(opt.value)} aria-pressed={perfil === opt.value}>
            {opt.label}
          </button>
        ))}
      </div>

      <div className="val">
        <label className="lab" htmlFor="oa-calc-valor">Valor de la inversión</label>
        <output htmlFor="oa-calc-valor">${valor}M</output>
      </div>
      <input id="oa-calc-valor" type="range" min="10" max="2000" step="10" value={valor} onChange={e => setValor(Number(e.target.value))} aria-label="Valor de la inversión" aria-valuetext={`${valor} millones de pesos`} style={{ ["--p" as string]: `${((valor-10)/1990)*100}%` }}/>
      <div className="ends">
        <span>$10M</span><span>$2.000M</span>
      </div>

      {/* Benefit bars */}
      <div className="bars">
        {[
          { label: "Exclusión/devolución de IVA (19%)", value: calc.iva, pct: calc.iva / (calc.totalBeneficio || 1) },
          { label: "Deducción en renta (50%)", value: calc.renta, pct: calc.renta / (calc.totalBeneficio || 1) },
        ].map((b, i) => (
          <div key={i}>
            <div className="brow">
              <span>{b.label}</span>
              <b>{b.value ? fmt(b.value) : "-"}</b>
            </div>
            <div className={`btrack${i ? " b2" : ""}`}>
              <i style={{ width: `${(b.pct || 0) * 100}%` }}/>
            </div>
          </div>
        ))}
      </div>

      {perfil === "empresa" && (
        <p className="emp">
          Depreciación acelerada a ~3 años (tasa anual hasta 33,33%), más exención arancelaria si los equipos son importados.
        </p>
      )}

      {calc.costoUPME != null && (
        <div className="cost" aria-live="polite">
          <div className="h">
            <span>Costo total</span>
          </div>
          <div>
            <span>Trámite ante UPME</span>
            <b>{fmt(calc.costoUPME)}</b>
          </div>
          <div>
            <span>Servicio de tramitación CertiVeh</span>
            <b>{fmt(calc.honorariosBase)}</b>
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

      {/* Result */}
      <div className="res" aria-live="polite" data-ui>
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

        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="cv-btn cv-btn-w">
          Solicitar cotización <Arr/>
        </a>
        <div className="note">Certificación UPME para GEE y FNCE</div>
      </div>
    </section>
  );
}

// ── POR QUE EL CERTIFICADO UPME ──────────────────────────────────────────────
function PorQueCertificado() {
  return (
    <section id="por-que" aria-label="Por qué el certificado UPME es indispensable" className="oa-dark">
      <div className="oa-wrap oa-grid">
        <div className="oa-why-copy rv">
          <h2 className="oa-h2 cv-sec-title">
            Por qué el certificado UPME es{" "}
            <span>indispensable</span>
          </h2>
          <p className="cv-sec-intro">
            Según la UPME, para acceder a los beneficios de exclusión de IVA, deducción de renta, depreciación acelerada y exención arancelaria, "lo único que se requiere es tener el certificado de la UPME como soporte".
          </p>
          <p>
            Sin certificado UPME no hay acceso a ninguno de los cuatro beneficios. Es el requisito habilitante que acredita que tu inversión es elegible para los incentivos de la Ley 1715 de 2014.
          </p>
        </div>
        <ul className="oa-why-list">
            {[
              { title: "Documento oficial", desc: "Acredita que tu inversión es elegible para los cuatro incentivos tributarios de la Ley 1715/2014 (mod. Ley 2099/2021)." },
              { title: "Sin límite de vigencia", desc: "Los certificados bajo la Resolución UPME 135 de 2025 no vencen. Pueden modificarse hasta 2 años después de su expedición." },
              { title: "Para cualquier contribuyente", desc: "Puede solicitarlo cualquier persona natural o jurídica que realice la inversión, incluyendo inversiones vía leasing financiero." },
              { title: "Ventana continua", desc: "La UPME recibe solicitudes de forma continua del 1 de febrero al 15 de diciembre de cada año (Res. UPME 563/2026)." },
            ].map((item, i) => (
            <li key={i} className="rv">
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
    { q: "¿Cuánto se demora el proceso?", a: "La UPME verifica completitud en 10 días hábiles y evalúa en hasta 20 días hábiles para proyectos FNCE (como energía solar). Para proyectos GEE (como cargadores o vehículos GNV), desde la radicación hasta el certificado UPME: normalmente unos 15 días hábiles, y el máximo legal son 30. CertiVeh gestiona todo el proceso y responde a los requerimientos de la UPME." },
    { q: "¿El certificado vence?", a: "No. Los certificados emitidos bajo la Resolución UPME 135 de 2025 no tienen límite de vigencia. Pueden modificarse (por ejemplo, para incluir información arancelaria o adicionar solicitantes) dentro de los 2 años siguientes a su expedición." },
    { q: "¿Aplica si la inversión se hizo con leasing?", a: "Sí. El Decreto 895 de 2022 contempla expresamente las inversiones realizadas mediante leasing financiero (art. 1.2.1.18.72). Esto es especialmente relevante para flotas de vehículos y equipos de alto valor." },
    { q: "¿Puedo combinar la deducción de renta con la depreciación acelerada?", a: "Sí. La norma establece que tomar ambos beneficios no se considera concurrencia de beneficios (Decreto 895 de 2022). Cada caso debe validarse con asesoría tributaria." },
    { q: "¿Qué pasa con el IVA que ya pagué?", a: "Con el certificado UPME puede solicitarse la devolución del IVA ante la DIAN, presentándolo como soporte. Ese trámite lo adelanta el contribuyente: el servicio de gestión del IVA de CertiVeh aplica solo a vehículos eléctricos e híbridos." },
  ];
  return (
    <section id="faq" aria-label="Preguntas frecuentes" className="oa-sec">
      <div className="oa-wrap oa-grid faq-grid">
        <h2 className="oa-h2 cv-sec-title">Todo lo que necesitas saber</h2>
        <div className="qs">
          {items.map((item, i) => (
            <div key={i} className={`faq-item${open === i ? " open" : ""}`}>
              <button className="faq-btn" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} aria-controls={`oa-faq-${i}`}>
                <span>{item.q}</span><span className="pm" aria-hidden="true"/>

              </button>
              {/* La respuesta está SIEMPRE en el HTML (lectores, buscadores, sin JavaScript); cerrada solo se oculta. */}
              <div className="faq-body" id={`oa-faq-${i}`} hidden={open !== i}>
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
// El cierre de la home: el titular a tamaño de portada a la izquierda y la acción a la derecha.
function CTAFinal() {
  return (
    <section id="cta-final" aria-label="Comenzar" className="close oa-wrap">
      <div className="oa-grid close-grid">
        <h2 className="cv-close-title rv">
          Tus incentivos tributarios <br/><span>te están esperando.</span>
        </h2>
        <div className="close-r rv">
          <p className="cv-sec-intro">
            Deducción de renta del 50%, exclusión de IVA, exención arancelaria y depreciación acelerada. CertiVeh gestiona tu certificado UPME de principio a fin.
          </p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="cv-btn cv-btn-a">
            Hablar con un asesor <Icon name="messageCircle" size={18}/>
          </a>
          <ul>
            {["Gestión integral del trámite","Personas naturales y jurídicas","Leasing financiero elegible"].map(t => (
              <li key={t} className="cta-feature cv-sq">{t}</li>
            ))}
          </ul>
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
// El de la home: es uno de los tres elementos del sitio que llevan sombra (DESIGN_SYSTEM.md §0.3).
function WhatsAppFAB() {
  return (
    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp" className="whatsapp-fab">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function EmpresasLanding({ tarifaDelBuild }: { tarifaDelBuild?: string } = {}) {
  // La tarifa del build al pintar y, tras hidratar, la vigente con el reloj del cliente (lote 4).
  const tarifa = useTarifaDeLaIsla(tarifaDelBuild);
  useEntradas();
  return (
    <TarifaDeLaIsla.Provider value={tarifa}>
      {/* Como HTML crudo: con <style>{CSS}</style> React escapa el CSS prerenderizado y la hidratación no coincide (ver CertiVehLandingComplete). */}
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Navbar isHome={false} darkHero vertical="otros-activos" localSections={["#beneficios", "#como-funciona", "#calculadora"]} />
      <main id="main-content">
        <Hero/>
        <Activos/>
        <Beneficios/>
        <ComoFunciona/>
        <PorQueCertificado/>
        <FAQ/>
        <CTAFinal/>
      </main>
      <Footer/>
      <WhatsAppFAB/>
    </TarifaDeLaIsla.Provider>
  );
}
