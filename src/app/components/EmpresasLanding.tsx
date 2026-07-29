import { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { AnimatePresence, motion } from "motion/react";
import { AnimatedGridPattern } from './ui/animated-grid-pattern';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// CertiVeh — Landing Empresas
// Certificación UPME para GEE y FNCE
// ─────────────────────────────────────────────────────────────────────────────

const WHATSAPP_URL = "https://wa.me/573151298420?text=Hola%2C%20quiero%20información%20sobre%20la%20certificación%20UPME%20para%20mi%20empresa";

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  :root {
    --emerald-50:  #ECFDF5;
    --emerald-100: #D1FAE5;
    --emerald-200: #A7F3D0;
    --emerald-500: #10B981;
    --emerald-600: #059669;
    --emerald-700: #047857;
    --emerald-800: #065F46;
    --teal-50:  #F0FDFA;
    --teal-100: #CCFBF1;
    --teal-200: #99F6E4;
    --teal-500: #14B8A6;
    --teal-600: #0D9488;
    --slate-50:  #F8FAFC;
    --slate-100: #F1F5F9;
    --slate-200: #E2E8F0;
    --slate-300: #CBD5E1;
    --slate-400: #94A3B8;
    --slate-500: #64748B;
    --slate-600: #475569;
    --slate-700: #334155;
    --slate-900: #0F172A;
    --amber-50:  #FFFBEB;
    --amber-100: #FEF3C7;
    --amber-200: #FDE68A;
    --amber-500: #F59E0B;
    --amber-600: #D97706;
    --white: #FFFFFF;
    --grad-primary: linear-gradient(135deg, #059669 0%, #14B8A6 100%);
    --grad-subtle:  linear-gradient(135deg, #ECFDF5 0%, #F0FDFA 100%);
    --ff: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  }

  body {
    background: var(--white);
    color: var(--slate-900);
    font-family: var(--ff);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    line-height: 1.5;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* H3: Range slider cross-browser thumb */
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    width: 22px; height: 22px; border-radius: 50%;
    background: white; cursor: pointer;
    border: 3px solid var(--emerald-600);
    box-shadow: 0 2px 8px rgba(5,150,105,0.3), 0 0 0 4px rgba(5,150,105,0.08);
    transition: box-shadow 0.15s;
  }
  input[type=range]::-moz-range-thumb {
    width: 22px; height: 22px; border-radius: 50%;
    background: white; cursor: pointer;
    border: 3px solid var(--emerald-600);
    box-shadow: 0 2px 8px rgba(5,150,105,0.3), 0 0 0 4px rgba(5,150,105,0.08);
  }
  input[type=range]::-webkit-slider-thumb:hover {
    box-shadow: 0 2px 12px rgba(5,150,105,0.4), 0 0 0 6px rgba(5,150,105,0.12);
  }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--emerald-600); color: var(--white);
    border: none; border-radius: 12px;
    padding: 12px 24px; font-size: 15px; font-weight: 600;
    cursor: pointer; font-family: var(--ff);
    transition: background 0.15s, transform 0.1s;
  }
  .btn-primary:hover { background: var(--emerald-700); transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary-lg { padding: 16px 32px; font-size: 16px; }

  .btn-secondary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--white); color: var(--slate-700);
    border: 1.5px solid var(--slate-300); border-radius: 12px;
    padding: 11px 24px; font-size: 15px; font-weight: 500;
    cursor: pointer; font-family: var(--ff);
    transition: border-color 0.15s, background 0.15s;
  }
  .btn-secondary:hover { border-color: var(--slate-400); background: var(--slate-50); }

  .section { padding: 96px 48px; max-width: 1200px; margin: 0 auto; }

  .badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 600; letter-spacing: 0.05em;
    padding: 4px 12px; border-radius: 9999px;
    background: var(--emerald-50); color: var(--emerald-700);
    border: 1px solid var(--emerald-200);
  }

  .card {
    background: var(--white); border: 1px solid var(--slate-200);
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  }

  .faq-item { border: 1px solid var(--slate-200); border-radius: 16px; overflow: hidden; transition: border-color 0.15s; }
  .faq-item.open { border-color: var(--emerald-200); }
  .faq-btn {
    width: 100%; padding: 20px 24px;
    display: flex; justify-content: space-between; align-items: center;
    background: var(--white); border: none; cursor: pointer;
    font-family: var(--ff); font-size: 15px; font-weight: 500;
    color: var(--slate-900); text-align: left; gap: 16px; transition: background 0.15s;
  }
  .faq-btn:hover { background: var(--slate-50); }
  .faq-icon {
    width: 28px; height: 28px; border-radius: 9999px;
    background: var(--emerald-50);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: transform 0.2s, background 0.15s;
  }
  .faq-item.open .faq-icon { background: var(--emerald-600); transform: rotate(45deg); }
  .faq-body {
    padding: 16px 24px 20px; font-size: 15px; line-height: 1.65;
    color: var(--slate-600); background: var(--emerald-50);
  }

  .step-tab {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 16px; border-radius: 12px; cursor: pointer;
    border: 1.5px solid transparent; background: transparent;
    text-align: left; font-family: var(--ff); transition: all 0.15s; width: 100%;
  }
  .step-tab.active { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); }
  .step-tab:hover:not(.active) { background: rgba(255,255,255,0.04); }
  .step-num {
    width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700;
    background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); transition: all 0.15s;
  }
  .step-tab.active .step-num { background: var(--emerald-600); color: white; }

  /* ── RESPONSIVE ──────────────────────────────────────────────────────────── */
  @media (max-width: 768px) {
    .hero-section { padding: 100px 20px 60px !important; min-height: 60vh !important; }
    .section { padding: 64px 20px; }

    .btn-primary { padding: 12px 20px; font-size: 14px; }
    .btn-primary-lg { padding: 14px 24px; font-size: 15px; }
    .btn-secondary { padding: 10px 20px; font-size: 14px; }

    .step-tab { padding: 12px; gap: 10px; }
    .step-num { width: 32px; height: 32px; font-size: 12px; }

    .faq-btn { padding: 16px 20px; font-size: 14px; }
    .faq-body { padding: 0 20px 16px; font-size: 14px; }

    .grid-4-cols { grid-template-columns: 1fr 1fr !important; }
    .grid-3-cols { grid-template-columns: 1fr !important; gap: 16px !important; }
    .grid-2-cols { grid-template-columns: 1fr !important; gap: 40px !important; }
    .grid-calc { grid-template-columns: 1fr !important; }
    .card-calc-controls { border-right: none !important; border-bottom: 1px solid var(--slate-200) !important; padding: 32px 24px !important; }
    .card-calc-result { padding: 32px 24px !important; }

    .step-card { padding: 28px !important; height: auto !important; min-height: 360px !important; }

    h1 br, h2 br { display: none; }
  }

  @media (max-width: 640px) {
    .cta-section { padding: 64px 20px !important; }
    footer { padding: 40px 20px !important; }
    .grid-4-cols { grid-template-columns: 1fr !important; }
  }

  @media (max-width: 480px) {
    .hero-section { padding: 90px 16px 50px !important; }
    .section { padding: 48px 16px; }
    .card-calc-controls { padding: 24px 16px !important; }
    .card-calc-result { padding: 24px 16px !important; }
    .btn-primary-lg { padding: 12px 20px; font-size: 14px; }
    .benefit-card { padding: 24px !important; }
    .step-card { padding: 20px !important; min-height: 320px !important; }
  }
`;

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function Icon({ name, size = 20, color = "currentColor", style = {} }: { name: string; size?: number; color?: string; style?: React.CSSProperties }) {
  const paths: Record<string, JSX.Element> = {
    shield:      <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    zap:         <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    fileText:    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    checkCircle: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    upload:      <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>,
    arrowRight:  <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    clock:       <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    lock:        <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    award:       <><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></>,
    percent:     <><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></>,
    sun:         <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    truck:       <><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
    battery:     <><rect x="1" y="6" width="18" height="12" rx="2" ry="2"/><line x1="23" y1="13" x2="23" y2="11"/></>,
    user:        <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    building:    <><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></>,
    info:        <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    dollarSign:  <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    messageCircle: <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></>,
    barChart:    <><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {paths[name]}
    </svg>
  );
}

// ── Logo ──────────────────────────────────────────────────────────────────────
function CertiVehLogo({ variant = "default", compact = false }: { variant?: "default" | "light"; compact?: boolean }) {
  const isBrowser = typeof document !== 'undefined';
  const getCSSVar = (name: string, fallback: string) => isBrowser ? (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback) : fallback;
  const textColor = variant === "light" ? "#FFFFFF" : getCSSVar('--slate-900', '#0F172A');
  const primary = getCSSVar('--emerald-600', '#059669');
  const accent = getCSSVar('--teal-500', '#14B8A6');
  const w = compact ? 180 : 220, h = compact ? 44 : 56;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${compact ? 240 : 320} ${compact ? 60 : 80}`} fill="none" role="img" aria-label="Logo CertiVeh">
      <defs>
        <linearGradient id="empLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary}/><stop offset="100%" stopColor={accent}/>
        </linearGradient>
      </defs>
      <g transform={compact ? "translate(4,8) scale(0.48)" : "translate(4,4) scale(0.62)"}>
        <path d="M50 10 L80 25 L80 50 C80 65 70 77 50 85 C30 77 20 65 20 50 L20 25 L50 10 Z" fill="url(#empLogoGrad)"/>
        <path d="M55 28 L42 52 L48 52 L45 72 L58 48 L52 48 L55 28 Z" fill="white"/>
      </g>
      <g transform={compact ? "translate(60,28)" : "translate(70,24)"}>
        <text x="0" y="0" fill={textColor} fontSize={compact ? "26" : "30"} fontWeight="700"
          fontFamily="Inter, system-ui, sans-serif" letterSpacing="-0.5">
          Certi<tspan fill={primary}>Veh</tspan>
        </text>
        {!compact && (
          <text x="0" y="20" fill={variant === "light" ? "rgba(255,255,255,0.6)" : getCSSVar('--slate-500', '#64748B')}
            fontSize="10" fontWeight="500" fontFamily="Inter, system-ui, sans-serif" letterSpacing="1.5">
            EMPRESAS
          </text>
        )}
      </g>
    </svg>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="hero" aria-label="Portada - CertiVeh Empresas" className="hero-section" style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center", textAlign: "center",
      padding: "100px 48px 80px", position: "relative",
      background: "var(--slate-900)", overflow: "hidden",
    }}>
      {/* Animated grid background */}
      <div style={{ position: "absolute", inset: 0, color: "rgba(0,0,0,0.4)" }}>
        <AnimatedGridPattern numSquares={60} maxOpacity={0.4} duration={4} repeatDelay={0.5} />
      </div>
      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(180deg, rgba(15,23,42,0.5) 0%, rgba(15,23,42,0.3) 50%, rgba(5,150,105,0.12) 100%)",
      }}/>

      {/* Badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.15)", borderRadius: 9999,
        padding: "6px 16px", marginBottom: 20,
        animation: "fadeUp 0.6s 0.04s ease both",
        position: "relative", zIndex: 1
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80" }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)", letterSpacing: "0.04em" }}>
          Certificación UPME para empresas
        </span>
      </div>

      {/* H1 */}
      <h1 style={{
        fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700,
        lineHeight: 1.15, letterSpacing: "-0.03em", color: "#FFFFFF",
        maxWidth: 820, marginBottom: 16, animation: "fadeUp 0.6s 0.08s ease both",
        position: "relative", zIndex: 1
      }}>
        Recupera hasta el 19% en IVA y deduce{" "}
        <span style={{ background: "linear-gradient(135deg, #34D399 0%, #14B8A6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          el 50% de tu inversión en renta
        </span>
      </h1>

      {/* Sub */}
      <p style={{
        fontSize: "clamp(15px, 1.8vw, 18px)", lineHeight: 1.7,
        color: "rgba(255,255,255,0.55)", maxWidth: 560,
        marginBottom: 32, animation: "fadeUp 0.6s 0.16s ease both",
        position: "relative", zIndex: 1
      }}>
        CertiVeh gestiona tu certificado UPME de principio a fin para proyectos de gestión eficiente de la energia (GEE) y fuentes no convencionales de energia (FNCE).
      </p>

      {/* CTAs */}
      <div style={{
        display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
        marginBottom: 40, animation: "fadeUp 0.6s 0.24s ease both",
        position: "relative", zIndex: 1
      }}>
        <a href="#calculadora" style={{ textDecoration: "none" }}>
          <button className="btn-primary btn-primary-lg" style={{
            background: "linear-gradient(135deg, #059669 0%, #14B8A6 100%)",
            boxShadow: "0 4px 24px rgba(5,150,105,0.4), 0 1px 2px rgba(0,0,0,0.2)",
            padding: "16px 36px", fontSize: 16, borderRadius: 12,
          }}>
            Calcular mi beneficio <Icon name="arrowRight" size={18} color="white"/>
          </button>
        </a>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <button className="btn-secondary" style={{
            background: "rgba(255,255,255,0.08)", color: "#FFFFFF",
            border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 12,
            backdropFilter: "blur(4px)", padding: "15px 28px",
          }}>
            <Icon name="messageCircle" size={16} color="white"/> Hablar con un asesor
          </button>
        </a>
      </div>

      {/* Trust strip */}
      <div style={{
        display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center",
        animation: "fadeUp 0.6s 0.36s ease both",
        position: "relative", zIndex: 1
      }}>
        {[["shield","Certificado oficial UPME"],["checkCircle","Cuatro beneficios tributarios"],["lock","Gestión integral"],["building","Personas naturales y juridicas"]].map(([ico,txt]) => (
          <span key={txt as string} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 500, cursor: "default" }}>
            <Icon name={ico as string} size={13} color="#34D399"/>{txt}
          </span>
        ))}
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
      title: "Cargadores de vehiculos electricos y electrolineras",
      desc: "Infraestructura de carga para movilidad electrica, reconocida en el PAI-PROURE 2022-2030. Incluye cargadores AC, DC y sistemas de gestion de carga.",
      accentColor: "var(--emerald-600)",
      iconBg: "rgba(5,150,105,0.1)",
    },
    {
      icon: "truck",
      tag: "GEE - Anexo 2",
      title: "Camiones y flotas a gas natural vehicular (GNV)",
      desc: "Vehiculos nuevos de bajas emisiones dedicados a gas natural para transporte de carga, pasajeros o uso corporativo. Camiones, tractocamiones, volquetas, buses y camionetas.",
      accentColor: "var(--teal-500)",
      iconBg: "rgba(20,184,166,0.1)",
    },
    {
      icon: "sun",
      tag: "FNCE - Anexo 1",
      title: "Proyectos de energia solar",
      desc: "Autogeneracion, techos solares y granjas solares. Incluye paneles, inversores, estructuras, servicios de diseño e instalacion. Evaluacion en hasta 20 dias habiles.",
      accentColor: "var(--emerald-600)",
      iconBg: "rgba(5,150,105,0.1)",
    },
  ];
  return (
    <section id="activos" aria-label="Activos que certificamos" style={{ background: "var(--white)" }}>
      <div className="section">
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--slate-900)", lineHeight: 1.25, marginBottom: 16 }}>
            Activos que{" "}
            <span style={{ background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>certificamos</span>
          </h2>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "var(--slate-600)", lineHeight: 1.6, maxWidth: 560, margin: "0 auto" }}>
            Gestionamos tu certificado UPME para proyectos de gestion eficiente de la energia (GEE) y de fuentes no convencionales de energia (FNCE).
          </p>
        </div>

        <div className="grid-3-cols" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {activos.map((a, i) => (
            <div key={i} className="card benefit-card" style={{ padding: 32, position: "relative", overflow: "hidden", background: "var(--white)", borderColor: "var(--slate-200)", borderLeft: `4px solid ${a.accentColor}`, transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: a.iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon name={a.icon} size={22} color={a.accentColor}/>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 9999, background: "var(--slate-50)", border: "1px solid var(--slate-200)", fontSize: 11, fontWeight: 600, color: a.accentColor, marginBottom: 12, letterSpacing: "0.02em" }}>
                {a.tag}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: "var(--slate-900)", letterSpacing: "-0.01em", marginBottom: 10, lineHeight: 1.35 }}>{a.title}</h3>
              <p style={{ fontSize: 14, color: "var(--slate-600)", lineHeight: 1.6 }}>{a.desc}</p>
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
      title: "Deduccion especial en renta",
      pct: "50%",
      accentColor: "var(--emerald-600)",
      iconBg: "rgba(5,150,105,0.1)",
      desc: "Deduccion del 50% del valor total de la inversion, aplicable en un periodo de hasta 15 años. Tope anual: no puede exceder el 50% de la renta liquida del contribuyente.",
      norma: "Art. 11, Ley 1715/2014 (mod. Ley 2099/2021)",
    },
    {
      icon: "dollarSign",
      title: "Exclusion de IVA",
      pct: "19%",
      accentColor: "var(--teal-500)",
      iconBg: "rgba(20,184,166,0.1)",
      desc: "Los equipos, maquinaria y servicios destinados al proyecto estan excluidos de IVA (19%). Si ya se pago, se puede gestionar la devolucion ante la DIAN con el certificado UPME.",
      norma: "Art. 12, Ley 1715/2014 (mod. Ley 2099/2021)",
    },
    {
      icon: "shield",
      title: "Exencion arancelaria",
      pct: "0%",
      accentColor: "var(--emerald-600)",
      iconBg: "rgba(5,150,105,0.1)",
      desc: "Exencion del pago de derechos arancelarios en la importacion de maquinaria, equipos, materiales e insumos destinados exclusivamente al proyecto.",
      norma: "Art. 13, Ley 1715/2014 (mod. Ley 2099/2021)",
    },
    {
      icon: "zap",
      title: "Depreciacion acelerada",
      pct: "~3 años",
      accentColor: "var(--teal-500)",
      iconBg: "rgba(20,184,166,0.1)",
      desc: "Depreciacion acelerada de los activos con tasa anual de hasta el 33,33%, permitiendo la recuperacion contable/fiscal del activo en aproximadamente 3 años.",
      norma: "Art. 14, Ley 1715/2014 (mod. Ley 2099/2021) y Decreto 895/2022",
    },
  ];
  return (
    <section id="beneficios" aria-label="Beneficios tributarios" style={{ background: "var(--slate-50)" }}>
      <div className="section">
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--slate-900)", lineHeight: 1.25, marginBottom: 16 }}>
            Cuatro beneficios tributarios. <br/>
            <span style={{ background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Un solo certificado.</span>
          </h2>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "var(--slate-600)", lineHeight: 1.6, maxWidth: 580, margin: "0 auto" }}>
            La Ley 1715 de 2014, modificada por la Ley 2099 de 2021, creo cuatro incentivos tributarios para inversiones en GEE y FNCE. El certificado UPME es el unico requisito para acceder a todos.
          </p>
        </div>

        <div className="grid-4-cols" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {cards.map((c, i) => (
            <div key={i} className="card benefit-card" style={{ padding: 28, position: "relative", overflow: "hidden", background: "var(--white)", borderColor: "var(--slate-200)", borderTop: `4px solid ${c.accentColor}`, transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ position: "absolute", top: 12, right: 16, fontSize: 64, fontWeight: 700, color: "rgba(0,0,0,0.03)", lineHeight: 1, pointerEvents: "none" }}>{c.pct}</div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: c.iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <Icon name={c.icon} size={20} color={c.accentColor}/>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: "var(--slate-900)", letterSpacing: "-0.01em", marginBottom: 4, lineHeight: 1.35 }}>{c.title}</h3>
              <div style={{ fontSize: 32, fontWeight: 700, color: c.accentColor, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 12 }}>{c.pct}</div>
              <p style={{ fontSize: 13, color: "var(--slate-600)", lineHeight: 1.55, marginBottom: 14 }}>{c.desc}</p>
              <div style={{ borderTop: "1px solid var(--slate-200)", paddingTop: 12 }}>
                <span style={{ fontSize: 11, color: "var(--slate-400)", lineHeight: 1.4 }}>{c.norma}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Notas */}
        <div style={{ marginTop: 24, padding: "16px 20px", background: "var(--white)", border: "1px solid var(--slate-200)", borderRadius: 12, maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "var(--slate-500)", lineHeight: 1.6 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <Icon name="checkCircle" size={14} color="var(--emerald-600)" style={{ marginTop: 3, flexShrink: 0 }}/>
              <span>La deduccion en renta y la depreciacion acelerada pueden tomarse simultaneamente sin que se considere concurrencia de beneficios (Decreto 895/2022).</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <Icon name="checkCircle" size={14} color="var(--emerald-600)" style={{ marginTop: 3, flexShrink: 0 }}/>
              <span>Las inversiones realizadas mediante leasing financiero tambien son elegibles (Decreto 895/2022, art. 1.2.1.18.72).</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── COMO FUNCIONA ────────────────────────────────────────────────────────────
function ComoFunciona() {
  const [active, setActive] = useState(0);
  const steps = [
    { num: "01", icon: "upload",      title: "Recopilacion de documentos",  subtitle: "Fichas tecnicas y facturas",      desc: "Nos envias las fichas tecnicas de los equipos, facturas o cotizaciones y la informacion del proyecto. Nosotros verificamos que todo corresponda a los anexos de la Resolucion UPME 135 de 2025.", detail: "Verificamos elegibilidad antes de radicar." },
    { num: "02", icon: "fileText",    title: "Radicacion ante la UPME",     subtitle: "Ventana continua",               desc: "CertiVeh prepara y radica la solicitud a traves del Sistema Unico de Usuarios (SUU) de la UPME con todos los formatos oficiales. La ventana de radicacion es continua: del 1 de febrero al 15 de diciembre.", detail: "Resolucion UPME 400 de 2026, ventana continua." },
    { num: "03", icon: "clock",       title: "Evaluacion tecnica",          subtitle: "FNCE: 20 dias / GEE: 30 dias",  desc: "La UPME verifica completitud en 10 dias habiles. Luego evalua: hasta 20 dias habiles para proyectos FNCE (solar) o hasta 30 dias habiles para GEE (cargadores, GNV). Respondemos cualquier requerimiento.", detail: "CertiVeh gestiona los requerimientos de la UPME." },
    { num: "04", icon: "award",       title: "Emision del certificado",     subtitle: "Certificado oficial UPME",       desc: "Si el concepto tecnico es favorable, la UPME emite el certificado y lo notifica por el SUU. Los certificados no tienen limite de vigencia y pueden modificarse dentro de los 2 años siguientes.", detail: "Sin limite de vigencia." },
    { num: "05", icon: "dollarSign",  title: "Aplicacion de beneficios",    subtitle: "IVA, renta, arancel, depreciacion", desc: "Con el certificado UPME soportas la exclusion/devolucion de IVA ante la DIAN, la deduccion en renta, la exencion arancelaria y la depreciacion acelerada en tu contabilidad fiscal.", detail: "Cuatro beneficios con un solo certificado." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section id="como-funciona" aria-label="Como funciona" style={{ background: "var(--slate-900)" }}>
      <div className="section">
        <div className="grid-2-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", lineHeight: 1.25, marginBottom: 12 }}>
              El proceso de <br/><span style={{ color: "rgba(255,255,255,0.4)" }}>certificacion.</span>
            </h2>
            <p style={{ fontSize: "clamp(14px, 1.8vw, 16px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 32 }}>
              De la documentacion al certificado UPME. CertiVeh gestiona todo el tramite por ti.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {steps.map((s, i) => (
                <button key={i} className={`step-tab${active === i ? " active" : ""}`} onClick={() => setActive(i)}
                  style={active === i ? { background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)" } : { background: "transparent", borderColor: "transparent" }}
                >
                  <div className="step-num" style={active === i ? { background: "var(--emerald-600)", color: "white" } : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>{s.num}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: active === i ? "white" : "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{s.title}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: active === i ? "#34D399" : "rgba(255,255,255,0.3)", marginTop: 1, lineHeight: 1.4 }}>{s.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card step-card" style={{ padding: 40, height: 420, display: "flex", flexDirection: "column", justifyContent: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.08)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -8, right: 16, fontSize: 140, fontWeight: 700, color: "rgba(255,255,255,0.03)", lineHeight: 1, pointerEvents: "none" }}>{steps[active].num}</div>
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Icon name={steps[active].icon} size={24} color="#34D399"/>
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 600, color: "white", letterSpacing: "-0.01em", lineHeight: 1.35, marginBottom: 12 }}>{steps[active].title}</h3>
                <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 20 }}>{steps[active].desc}</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 14, fontWeight: 500, color: "#34D399" }}>
                  <Icon name="checkCircle" size={14} color="#34D399"/>{steps[active].detail}
                </div>
              </motion.div>
            </AnimatePresence>
            <div style={{ display: "flex", gap: 6, marginTop: 28 }}>
              {steps.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} style={{ height: 6, width: i === active ? 24 : 6, borderRadius: 3, background: i === active ? "var(--emerald-500)" : "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.25s" }}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CALCULADORA ───────────────────────────────────────────────────────────────
function Calculadora() {
  const [valor, setValor] = useState(200);
  const [perfil, setPerfil] = useState("empresa");
  const [calc, setCalc] = useState<any>({});
  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-CO") + " COP";

  useEffect(() => {
    const v = valor * 1_000_000;

    const iva = v * 0.19;
    const renta = v * 0.50;
    const totalBeneficio = iva + renta;

    // Tramite UPME - Resolucion UPME No. 135 de 2025
    const UVT = 52_374;
    const invUVT = v / UVT;
    let pagoUVT: number;
    if (invUVT < 275)        pagoUVT = 1.2;
    else if (invUVT < 826)   pagoUVT = 3.4;
    else if (invUVT < 1_652) pagoUVT = 6.7;
    else if (invUVT < 3_305) pagoUVT = 13.4;
    else {
      const beneficio = (invUVT - 3_305) * 0.405;
      pagoUVT = Math.min(13.4 + beneficio * 0.005, 275);
    }
    const costoUPME = Math.round(pagoUVT * UVT);

    // Honorarios CertiVeh - GEE/FNCE
    let honorariosBase: number;
    if (v <= 150_000_000) {
      honorariosBase = 899_990;
    } else {
      honorariosBase = Math.round(v * 0.006);
    }
    const ivaServicio = Math.round(honorariosBase * 0.19);

    const costoTotal = costoUPME + honorariosBase + ivaServicio;

    setCalc({ iva, renta, totalBeneficio, costoUPME, honorariosBase, ivaServicio, costoTotal, neto: totalBeneficio - costoTotal });
  }, [valor, perfil]);

  return (
    <section id="calculadora" aria-label="Calculadora de costos" style={{ background: "var(--white)" }}>
      <div className="section">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--slate-900)", lineHeight: 1.25, marginBottom: 14 }}>
            Calcula tu beneficio y{" "}
            <span style={{ background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>el costo del servicio</span>
          </h2>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "var(--slate-600)", lineHeight: 1.6 }}>Mueve el slider y ve en tiempo real cuanto cuesta el servicio y cuanto puedes recuperar en incentivos.</p>
        </div>

        <div className="card grid-calc" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden", padding: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)" }}>
          {/* Controls */}
          <div className="card-calc-controls" style={{ padding: 48, borderRight: "1px solid var(--slate-200)" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", color: "var(--slate-500)", marginBottom: 10 }}>Perfil tributario</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[{ value: "natural", label: "Persona natural", icon: "user" },{ value: "empresa", label: "Empresa", icon: "building" }].map(opt => (
                  <button key={opt.value} onClick={() => setPerfil(opt.value)} style={{ padding: "12px 12px", borderRadius: 12, border: perfil === opt.value ? "1.5px solid var(--emerald-600)" : "1.5px solid var(--slate-200)", background: perfil === opt.value ? "var(--emerald-600)" : "var(--white)", color: perfil === opt.value ? "white" : "var(--slate-600)", fontSize: "clamp(12px, 1.5vw, 14px)", fontWeight: perfil === opt.value ? 600 : 500, cursor: "pointer", fontFamily: "var(--ff)", transition: "all 0.15s", textAlign: "center", lineHeight: 1.3, display: "flex", alignItems: "center", gap: 6, justifyContent: "center", boxShadow: perfil === opt.value ? "0 2px 8px rgba(5,150,105,0.25)" : "none" }}>
                    <Icon name={opt.icon} size={16} color={perfil === opt.value ? "white" : "var(--slate-400)"} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", color: "var(--slate-500)" }}>Valor de la inversion</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "var(--emerald-600)", letterSpacing: "-0.02em" }}>${valor}M</div>
              </div>
              <input type="range" min="10" max="2000" step="10" value={valor} onChange={e => setValor(Number(e.target.value))} style={{ width: "100%", appearance: "none", height: 4, borderRadius: 4, outline: "none", cursor: "pointer", background: `linear-gradient(to right, #059669 0%, #14B8A6 ${((valor-10)/1990)*100}%, #E2E8F0 ${((valor-10)/1990)*100}%, #E2E8F0 100%)` }}/>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--slate-400)", fontWeight: 500, marginTop: 6 }}>
                <span>$10M</span><span>$2.000M</span>
              </div>
            </div>

            {/* Benefit bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Exclusion/devolucion de IVA (19%)", value: calc.iva, color: "var(--emerald-600)", pct: calc.iva / (calc.totalBeneficio || 1) },
                { label: "Deduccion en renta (50%)", value: calc.renta, color: "var(--teal-500)", pct: calc.renta / (calc.totalBeneficio || 1) },
              ].map((b, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 14, color: "var(--slate-600)", fontWeight: 500, lineHeight: 1.5 }}>{b.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: b.color, lineHeight: 1.5, whiteSpace: "nowrap" }}>{b.value ? fmt(b.value) : "-"}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "var(--slate-100)", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 3, background: b.color, width: `${(b.pct || 0) * 100}%`, transition: "width 0.4s ease" }}/>
                  </div>
                </div>
              ))}
            </div>

            {perfil === "empresa" && (
              <div style={{ padding: "10px 14px", background: "var(--emerald-50)", border: "1px solid var(--emerald-200)", borderRadius: 12, fontSize: 13, color: "var(--emerald-700)", lineHeight: 1.5, marginBottom: 16 }}>
                Depreciacion acelerada a ~3 años (tasa anual hasta 33,33%), mas exencion arancelaria si los equipos son importados.
              </div>
            )}

            {calc.costoUPME != null && (
              <div style={{ marginTop: 20, padding: "16px 18px", background: "var(--slate-50)", border: "1px solid var(--slate-200)", borderRadius: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <Icon name="fileText" size={13} color="var(--slate-500)" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--slate-500)", letterSpacing: "0.04em" }}>Costo del servicio</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "var(--slate-600)", lineHeight: 1.5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Tramite ante UPME</span>
                    <span style={{ fontWeight: 600, color: "var(--slate-700)" }}>{fmt(calc.costoUPME)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Servicio de tramitacion CertiVeh</span>
                    <span style={{ fontWeight: 600, color: "var(--slate-700)" }}>{fmt(calc.honorariosBase)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "var(--slate-400)" }}>IVA (19% sobre tramitacion)</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--slate-400)" }}>{fmt(calc.ivaServicio)}</span>
                  </div>
                  <div style={{ borderTop: "1px solid var(--slate-200)", paddingTop: 6, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700, color: "var(--slate-900)" }}>Total</span>
                    <span style={{ fontWeight: 700, color: "var(--slate-900)" }}>{fmt(calc.costoTotal)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Result */}
          <div className="card-calc-result" style={{ padding: 48, background: "var(--slate-900)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#34D399", marginBottom: 12 }}>BENEFICIO TOTAL ESTIMADO</div>
            <div style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, color: "white", marginBottom: 6, transition: "all 0.3s" }}>
              {calc.totalBeneficio ? fmt(calc.totalBeneficio) : "-"}
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 28, lineHeight: 1.5 }}>en incentivos tributarios</div>

            <div style={{ width: "100%", padding: "20px 24px", marginBottom: 24, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#34D399", marginBottom: 8 }}>BENEFICIO NETO (MENOS COSTO DEL SERVICIO)</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "white", letterSpacing: "-0.02em" }}>{calc.neto ? fmt(calc.neto) : "-"}</div>
            </div>

            {calc.costoTotal && calc.totalBeneficio && (
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 28 }}>
                Por cada <span style={{ fontWeight: 700, color: "white" }}>$1 invertido</span> en CertiVeh, recibes{" "}
                <span style={{ fontWeight: 700, color: "#34D399" }}>${(Math.round(calc.totalBeneficio / calc.costoTotal * 10) / 10).toLocaleString("es-CO")}</span> en beneficios.
              </div>
            )}

            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", width: "100%" }}>
              <button className="btn-primary btn-primary-lg" style={{ width: "100%", justifyContent: "center", background: "linear-gradient(135deg, #059669, #14B8A6)", boxShadow: "0 4px 24px rgba(5,150,105,0.4)" }}>
                Solicitar cotizacion <Icon name="arrowRight" size={18} color="white"/>
              </button>
            </a>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 12 }}>Certificacion UPME para GEE y FNCE</div>
          </div>
        </div>

        {/* Pricing tiers */}
        <div style={{ marginTop: 32, padding: "20px 24px", background: "var(--slate-50)", border: "1px solid var(--slate-200)", borderRadius: 12, maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--slate-700)", marginBottom: 12 }}>Honorarios CertiVeh</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--emerald-600)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>01</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--slate-900)" }}>Inversion menor o igual a $150.000.000</div>
                <div style={{ fontSize: 13, color: "var(--slate-500)" }}>Honorarios de $899.990 COP + IVA</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--emerald-600)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>02</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--slate-900)" }}>Inversion mayor a $150.000.000</div>
                <div style={{ fontSize: 13, color: "var(--slate-500)" }}>Se cobra el 0,6% del valor del activo a certificar + IVA</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── POR QUE EL CERTIFICADO UPME ──────────────────────────────────────────────
function PorQueCertificado() {
  return (
    <section id="por-que" aria-label="Por que el certificado UPME es indispensable" style={{ background: "var(--slate-50)" }}>
      <div className="section">
        <div className="grid-2-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--slate-900)", lineHeight: 1.25, marginBottom: 16 }}>
              Por que el certificado UPME es{" "}
              <span style={{ background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>indispensable</span>
            </h2>
            <p style={{ fontSize: "clamp(15px, 2vw, 17px)", color: "var(--slate-600)", lineHeight: 1.7, marginBottom: 24 }}>
              Segun la UPME, para acceder a los beneficios de exclusion de IVA, deduccion de renta, depreciacion acelerada y exencion arancelaria, "lo unico que se requiere es tener el certificado de la UPME como soporte".
            </p>
            <p style={{ fontSize: "clamp(14px, 1.8vw, 16px)", color: "var(--slate-500)", lineHeight: 1.7 }}>
              Sin certificado UPME no hay acceso a ninguno de los cuatro beneficios. Es el requisito habilitante que acredita que tu inversion es elegible para los incentivos de la Ley 1715 de 2014.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { icon: "shield", title: "Documento oficial", desc: "Acredita la elegibilidad de tu inversion para los incentivos tributarios de la Ley 1715/2014." },
              { icon: "clock", title: "Sin limite de vigencia", desc: "Los certificados emitidos bajo la Resolucion UPME 135 de 2025 no vencen. Pueden modificarse dentro de los 2 años siguientes." },
              { icon: "building", title: "Para cualquier contribuyente", desc: "Puede solicitarlo cualquier persona natural o juridica que realice la inversion." },
              { icon: "barChart", title: "83% de aprobacion", desc: "Durante 2024, el 83% de las solicitudes fueron certificadas favorablemente por la UPME." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--emerald-50)", border: "1px solid var(--emerald-200)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={item.icon} size={20} color="var(--emerald-600)"/>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--slate-900)", marginBottom: 2, lineHeight: 1.4 }}>{item.title}</div>
                  <div style={{ fontSize: 14, color: "var(--slate-500)", lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
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
    { q: "¿Que es el certificado UPME y para que sirve?", a: "Es el documento oficial que acredita que una inversion en eficiencia energetica (GEE) o energias renovables (FNCE) es elegible para los incentivos de la Ley 1715 de 2014. Es el unico soporte requerido para acceder a los cuatro beneficios tributarios: deduccion en renta, exclusion de IVA, exencion arancelaria y depreciacion acelerada." },
    { q: "¿Quien puede solicitarlo?", a: "Cualquier persona natural o juridica que realice la inversion. Esto incluye empresas, inversionistas, operadores de flotas, desarrolladores de proyectos solares y propietarios de infraestructura de carga, entre otros." },
    { q: "¿Cuanto se demora el proceso?", a: "La UPME verifica completitud en 10 dias habiles y evalua en hasta 20 dias habiles para proyectos FNCE (como energia solar) o hasta 30 dias habiles para proyectos GEE (como cargadores o vehiculos GNV). CertiVeh gestiona todo el proceso y responde a los requerimientos de la UPME." },
    { q: "¿El certificado vence?", a: "No. Los certificados emitidos bajo la Resolucion UPME 135 de 2025 no tienen limite de vigencia. Pueden modificarse (por ejemplo, para incluir informacion arancelaria o adicionar solicitantes) dentro de los 2 años siguientes a su expedicion." },
    { q: "¿Aplica si la inversion se hizo con leasing?", a: "Si. El Decreto 895 de 2022 contempla expresamente las inversiones realizadas mediante leasing financiero (art. 1.2.1.18.72). Esto es especialmente relevante para flotas de vehiculos y equipos de alto valor." },
    { q: "¿Puedo combinar la deduccion de renta con la depreciacion acelerada?", a: "Si. La norma establece que tomar ambos beneficios no se considera concurrencia de beneficios (Decreto 895 de 2022). Cada caso debe validarse con asesoria tributaria." },
    { q: "¿Que pasa con el IVA que ya pague?", a: "Con el certificado UPME es posible gestionar la devolucion del IVA ante la DIAN. El mecanismo practico es la solicitud de devolucion con el certificado como soporte." },
  ];
  return (
    <section id="faq" aria-label="Preguntas frecuentes" style={{ background: "var(--white)" }}>
      <div className="section">
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--slate-900)", lineHeight: 1.25 }}>Todo lo que necesitas saber</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {items.map((item, i) => (
              <div key={i} className={`faq-item${open === i ? " open" : ""}`}>
                <button className="faq-btn" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                  <span>{item.q}</span><div className="faq-icon"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={open === i ? "white" : "var(--emerald-600)"} strokeWidth="2" strokeLinecap="round"><line x1="7" y1="2" x2="7" y2="12"/><line x1="2" y1="7" x2="12" y2="7"/></svg></div>
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
      </div>
    </section>
  );
}

// ── CTA FINAL ─────────────────────────────────────────────────────────────────
function CTAFinal() {
  return (
    <section id="cta-final" aria-label="Comenzar" className="cta-section" style={{ background: "var(--slate-900)", padding: "96px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, color: "rgba(0,0,0,0.4)" }}>
        <AnimatedGridPattern numSquares={50} maxOpacity={0.6} duration={4} repeatDelay={0.5} />
      </div>
      <div style={{ position: "relative", pointerEvents: "none" }}>
        <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", lineHeight: 1.2, marginBottom: 16, maxWidth: 680, margin: "0 auto 16px" }}>
          Tus incentivos tributarios <br/><span style={{ background: "linear-gradient(135deg, #34D399 0%, #14B8A6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>te estan esperando.</span>
        </h2>
        <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, maxWidth: 520, margin: "0 auto 36px" }}>
          Deduccion de renta del 50%, exclusion de IVA, exencion arancelaria y depreciacion acelerada. CertiVeh gestiona tu certificado UPME de principio a fin.
        </p>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", pointerEvents: "auto" }}>
          <button className="btn-primary btn-primary-lg" style={{ background: "linear-gradient(135deg, #059669 0%, #14B8A6 100%)", color: "white", boxShadow: "0 4px 24px rgba(5,150,105,0.4)" }}>
            Hablar con un asesor <Icon name="messageCircle" size={18} color="white"/>
          </button>
        </a>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
          {["Gestion integral del tramite","Personas naturales y juridicas","Leasing financiero elegible"].map(t => (
            <span key={t} className="cta-feature" style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontWeight: 500, display: "flex", alignItems: "center", gap: 6, lineHeight: 1.5 }}>
              <Icon name="checkCircle" size={13} color="#34D399"/>{t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <>
      {/* Disclaimer */}
      <div style={{ background: "var(--amber-50)", borderTop: "1px solid var(--amber-200)", padding: "16px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "var(--amber-600)", lineHeight: 1.6, maxWidth: 800, margin: "0 auto" }}>
          La informacion presentada es de caracter general y no constituye asesoria tributaria, legal o contable. El acceso a los incentivos de la Ley 1715 de 2014 (modificada por la Ley 2099 de 2021) esta sujeto a la obtencion del certificado UPME y al cumplimiento de la normativa vigente (Decreto 895 de 2022, Resolucion UPME 135 de 2025 y normas que las modifiquen). Consulta con tu asesor tributario la aplicacion a tu caso particular.
        </p>
      </div>

      <footer aria-label="Pie de pagina" style={{ background: "var(--slate-900)", color: "var(--slate-400)", padding: "48px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
            <div>
              <CertiVehLogo variant="light" compact/>
              <p style={{ fontSize: 14, color: "var(--slate-500)", marginTop: 10, maxWidth: 280, lineHeight: 1.5 }}>
                Certificacion UPME para proyectos de gestion eficiente de la energia (GEE) y fuentes no convencionales de energia (FNCE) en Colombia.
              </p>
            </div>
            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              {[
                { label: "Secciones", links: [{ text: "Activos", href: "#activos" }, { text: "Beneficios", href: "#beneficios" }, { text: "Como funciona", href: "#como-funciona" }, { text: "Calculadora", href: "#calculadora" }] },
                { label: "CertiVeh", links: [{ text: "Vehiculos electricos", href: "/" }, { text: "Blog", href: "/blog" }, { text: "Quienes somos", href: "/nosotros/" }] },
                { label: "Legal", links: [{ text: "Terminos y Condiciones", href: "/terminos-y-condiciones" }, { text: "Politica de Privacidad", href: "/politica-de-privacidad" }] }
              ].map(col => (
                <div key={col.label}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--slate-300)", letterSpacing: "0.08em", marginBottom: 14 }}>{col.label}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {col.links.map(l => (
                      <a key={l.text} href={l.href} style={{ fontSize: 14, color: "var(--slate-500)", textDecoration: "none", transition: "color 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.color = "white"}
                        onMouseLeave={e => e.currentTarget.style.color = "var(--slate-500)"}
                      >{l.text}</a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 12, lineHeight: 1.4 }}>© 2026 CertiVeh · Certificados de Beneficio Tributario · Colombia</span>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 12, lineHeight: 1.4 }}>contacto@certiveh.co</span>
              <a href="https://www.instagram.com/certiveh/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de CertiVeh" style={{ color: "var(--slate-500)", transition: "color 0.15s" }} onMouseEnter={e => e.currentTarget.style.color = "white"} onMouseLeave={e => e.currentTarget.style.color = "var(--slate-500)"}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/certiveh/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de CertiVeh" style={{ color: "var(--slate-500)", transition: "color 0.15s" }} onMouseEnter={e => e.currentTarget.style.color = "white"} onMouseLeave={e => e.currentTarget.style.color = "var(--slate-500)"}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61589443583623" target="_blank" rel="noopener noreferrer" aria-label="Facebook de CertiVeh" style={{ color: "var(--slate-500)", transition: "color 0.15s" }} onMouseEnter={e => e.currentTarget.style.color = "white"} onMouseLeave={e => e.currentTarget.style.color = "var(--slate-500)"}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

// ── WhatsApp FAB ─────────────────────────────────────────────────────────────
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
        boxShadow: "0 4px 16px rgba(37,211,102,0.4), 0 2px 4px rgba(0,0,0,0.2)",
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
export default function EmpresasLanding() {
  return (
    <>
      <style>{CSS}</style>
      <Navbar isHome={false} darkHero />
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
    </>
  );
}
