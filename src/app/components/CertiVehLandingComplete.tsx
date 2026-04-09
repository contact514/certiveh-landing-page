import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BackgroundPaths } from './ui/background-paths';
import { AnimatedGridPattern } from './ui/animated-grid-pattern';
import { BGPattern } from './ui/bg-pattern';
import { cn } from '@/lib/utils';
import { ImageComparison } from './ui/image-comparison';
import imgElectricCar from '@/assets/01fdb1b89e1e3dc564e3f61a00a2b3b99dc99d04.png';
import imgPortalUsuario from '@/assets/878e55d5a2f4bcff614314941422acc1fce4e6b2.png';

// ─────────────────────────────────────────────────────────────────────────────
// CertiVeh, Landing Page
// Brand Manual v1.0 · Marzo 2026
//
// Colores:
//   Primary   emerald-600  #059669
//   Accent    teal-500     #14B8A6
//   Neutral   slate-900    #0F172A
//   Premium   amber-500    #F59E0B
//   BG light  slate-50     #F8FAFC
//   BG white  #FFFFFF
//
// Tipografía: Inter · 400 / 500 / 600 / 700
// Iconos: Lucide (SVG inline, sin dependencias extra)
// Border-radius: lg=8px, xl=12px, 2xl=16px, 3xl=24px
// ─────────────────────────────────────────────────────────────────────────────

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
  @keyframes ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--slate-100); }
  ::-webkit-scrollbar-thumb { background: var(--emerald-600); border-radius: 3px; }

  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--slate-200);
    padding: 0 48px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .nav-links { display: flex; align-items: center; gap: 32px; }
  .nav-links a {
    font-size: 14px; font-weight: 500;
    color: var(--slate-600); text-decoration: none; transition: color 0.15s;
  }
  .nav-links a:hover { color: var(--emerald-600); }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--emerald-600); color: var(--white);
    border: none; border-radius: 8px;
    padding: 12px 24px; font-size: 15px; font-weight: 600;
    cursor: pointer; font-family: var(--ff);
    transition: background 0.15s, transform 0.1s;
  }
  .btn-primary:hover { background: var(--emerald-700); transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary-lg { padding: 16px 32px; font-size: 16px; box-shadow: none; }
  .btn-primary-lg:hover { box-shadow: none; }

  .btn-secondary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--white); color: var(--slate-700);
    border: 1.5px solid var(--slate-300); border-radius: 8px;
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

  .ticker-wrap { overflow: hidden; background: var(--grad-primary); padding: 12px 0; }
  .ticker-inner { display: flex; animation: ticker 30s linear infinite; width: max-content; }
  .ticker-item {
    display: flex; align-items: center; gap: 10px;
    font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.9);
    padding: 0 36px; white-space: nowrap; letter-spacing: 0.02em;
  }
  .ticker-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.6); flex-shrink: 0; }

  .faq-item { border: 1px solid var(--slate-200); border-radius: 12px; overflow: hidden; transition: border-color 0.15s; }
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
    width: 24px; height: 24px; border-radius: 9999px;
    background: var(--emerald-50);
    display: flex; align-items: center; justify-content: center;
    color: var(--emerald-600); font-size: 18px; font-weight: 300; flex-shrink: 0;
    transition: transform 0.2s, background 0.15s;
    line-height: 1;
  }
  .faq-item.open .faq-icon { background: var(--emerald-600); color: white; transform: rotate(45deg); }
  .faq-body {
    padding: 16px 24px 20px; font-size: 15px; line-height: 1.65;
    color: var(--slate-600); background: var(--emerald-50);
  }

  .step-tab {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 16px; border-radius: 10px; cursor: pointer;
    border: 1.5px solid transparent; background: transparent;
    text-align: left; font-family: var(--ff); transition: all 0.15s; width: 100%;
  }
  .step-tab.active { background: var(--emerald-50); border-color: var(--emerald-200); }
  .step-tab:hover:not(.active) { background: var(--slate-50); }
  .step-num {
    width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700;
    background: var(--slate-100); color: var(--slate-500); transition: all 0.15s;
  }
  .step-tab.active .step-num { background: var(--emerald-600); color: white; }

  /* ── URGENCY MODAL ──────────────────────────────────────────────────────── */
  .urgency-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(4px);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .urgency-modal {
    position: relative;
    background: var(--white);
    border-radius: 16px;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.25);
    max-width: 520px;
    width: 100%;
    padding: 40px;
    border: 1px solid var(--slate-200);
  }

  .urgency-modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--slate-100);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
    color: var(--slate-600);
  }

  .urgency-modal-close:hover {
    background: var(--slate-200);
  }

  /* ── RESPONSIVE ──────────────────────────────────────────────────────────── */
  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    color: var(--slate-700);
  }
  
  .mobile-menu {
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    background: white;
    border-bottom: 1px solid var(--slate-200);
    padding: 20px;
    z-index: 99;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transform: translateY(-100%);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.2s ease;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .mobile-menu.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: all;
  }
  
  .mobile-menu a {
    font-size: 16px;
    font-weight: 500;
    color: var(--slate-700);
    text-decoration: none;
    padding: 12px 0;
    border-bottom: 1px solid var(--slate-100);
  }
  
  .mobile-menu a:last-child {
    border-bottom: none;
  }
  
  .mobile-menu-overlay {
    display: none;
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 98;
    backdrop-filter: blur(2px);
  }
  
  .mobile-menu-overlay.open {
    display: block;
  }
  
  @media (max-width: 768px) {
    nav { padding: 0 20px; height: 56px; }
    .nav-links { display: none; }
    .mobile-menu-btn { display: flex; }
    
    .hero-section { padding: 100px 20px 60px !important; min-height: 90vh !important; }
    .section { padding: 64px 20px; }
    
    .btn-primary { padding: 12px 20px; font-size: 14px; }
    .btn-primary-lg { padding: 14px 24px; font-size: 15px; }
    .btn-secondary { padding: 10px 20px; font-size: 14px; }
    
    .step-tab { padding: 12px; gap: 10px; }
    .step-num { width: 32px; height: 32px; font-size: 12px; }
    
    .faq-btn { padding: 16px 20px; font-size: 14px; }
    .faq-body { padding: 0 20px 16px; font-size: 14px; }
    
    .grid-3-cols { grid-template-columns: 1fr !important; gap: 16px !important; }
    .grid-2-cols { grid-template-columns: 1fr !important; gap: 40px !important; }
    .grid-calc { grid-template-columns: 1fr !important; }
    .card-calc-controls { border-right: none !important; border-bottom: 1px solid var(--slate-200) !important; padding: 32px 24px !important; }
    .card-calc-result { padding: 32px 24px !important; }
    
    .step-card { padding: 28px !important; height: auto !important; min-height: 360px !important; }
    
    .ticker-item { padding: 0 24px; font-size: 12px; }

    /* Urgency modal responsive */
    .urgency-modal {
      padding: 32px 24px;
      margin: 16px;
    }
    
    /* Ajustes de texto para mobile */
    h1 br, h2 br { display: none; }
  }
  
  @media (max-width: 640px) {
    /* CTA final responsive */
    .cta-section { padding: 64px 20px !important; }
    .cta-button { padding: 14px 28px !important; font-size: 15px !important; }
    
    /* Footer responsive */
    footer { padding: 40px 20px !important; }
    
    /* Ajustar márgenes en móviles pequeños */
    .grid-2-cols { gap: 32px !important; }
  }
  
  @media (max-width: 400px) {
    /* Ajustes para móviles muy pequeños */
    .trust-item { font-size: 11px !important; }
    .cta-feature { font-size: 12px !important; }
    .cta-button { padding: 12px 24px !important; font-size: 14px !important; }
  }
  
  @media (max-width: 480px) {
    .hero-section { padding: 90px 16px 50px !important; }
    .section { padding: 48px 16px; }
    .card-calc-controls { padding: 24px 16px !important; }
    .card-calc-result { padding: 24px 16px !important; }
    .btn-primary-lg { padding: 12px 20px; font-size: 14px; }
    
    /* Cards más compactos en móvil */
    .benefit-card { padding: 24px !important; }
    .trust-card { padding: 20px !important; }
    .step-card { padding: 20px !important; min-height: 320px !important; }
    
    /* Trust strip más compacto */
    .trust-item { font-size: 12px !important; gap: 4px !important; }
    
    /* Info callout responsive */
    .info-callout { padding: 20px !important; gap: 12px !important; }
    
    /* Stat pills en móvil */
    .card { border-radius: 12px; }

    /* Urgency modal en móviles muy pequeños */
    .urgency-modal {
      padding: 24px 20px;
    }
  }
`;

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function Icon({ name, size = 20, color = "currentColor", style = {} }: { name: string; size?: number; color?: string; style?: React.CSSProperties }) {
  const paths: Record<string, JSX.Element> = {
    shield:      <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    zap:         <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    car:         <><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-3"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></>,
    fileText:    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    checkCircle: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    upload:      <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>,
    arrowRight:  <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    clock:       <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    bell:        <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    lock:        <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    calendar:    <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    award:       <><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></>,
    percent:     <><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></>,
    smartphone:  <><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>,
    battery:     <><rect x="1" y="6" width="18" height="12" rx="2" ry="2"/><line x1="23" y1="13" x2="23" y2="11"/></>,
    menu:        <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    x:           <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
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
  const textColor = variant === "light" ? "#FFFFFF" : getComputedStyle(document.documentElement).getPropertyValue('--slate-900').trim() || "#0F172A";
  const primary = getComputedStyle(document.documentElement).getPropertyValue('--emerald-600').trim() || "#059669";
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--teal-500').trim() || "#14B8A6";
  const w = compact ? 180 : 220, h = compact ? 44 : 56;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${compact ? 240 : 320} ${compact ? 60 : 80}`} fill="none" role="img" aria-label="Logo CertiVeh — Certificación Vehicular">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary}/><stop offset="100%" stopColor={accent}/>
        </linearGradient>
      </defs>
      <g transform={compact ? "translate(4,8) scale(0.48)" : "translate(4,4) scale(0.62)"}>
        <path d="M50 10 L80 25 L80 50 C80 65 70 77 50 85 C30 77 20 65 20 50 L20 25 L50 10 Z" fill="url(#logoGrad)"/>
        <path d="M55 28 L42 52 L48 52 L45 72 L58 48 L52 48 L55 28 Z" fill="white"/>
      </g>
      <g transform={compact ? "translate(60,28)" : "translate(70,24)"}>
        <text x="0" y="0" fill={textColor} fontSize={compact ? "26" : "30"} fontWeight="700"
          fontFamily="Inter, system-ui, sans-serif" letterSpacing="-0.5">
          Certi<tspan fill={primary}>Veh</tspan>
        </text>
        {!compact && (
          <text x="0" y="20" fill={variant === "light" ? "rgba(255,255,255,0.6)" : (getComputedStyle(document.documentElement).getPropertyValue('--slate-500').trim() || "#64748B")}
            fontSize="10" fontWeight="500" fontFamily="Inter, system-ui, sans-serif" letterSpacing="1.5">
            CERTIFICACIÓN VEHICULAR
          </text>
        )}
      </g>
    </svg>
  );
}

// ── FlipWords ──────────────────────────────────────────────────────���──────────
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
    <AnimatePresence onExitComplete={() => setAnimating(false)}>
      <motion.span key={current}
        initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -16, scale: 1.03, filter: "blur(6px)", position: "absolute" }}
        transition={{ type: "spring", stiffness: 100, damping: 14 }}
        style={{
          display: "inline-block", position: "relative",
          color: "var(--emerald-600)",
        }}
      >
        {current.split(" ").map((w, i) => (
          <motion.span key={w + i}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.25 }}
            style={{ display: "inline-block", marginRight: "0.25em" }}
          >{w}</motion.span>
        ))}
      </motion.span>
    </AnimatePresence>
  );
}

// ── NAVBAR ───────────────────────────────��────────────────────────────────────
function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <>
      <nav aria-label="Navegación principal">
        <CertiVehLogo compact />
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}>
          <Icon name={mobileMenuOpen ? "x" : "menu"} size={24} />
        </button>
        <div className="nav-links">
          <a href="#beneficios">Beneficios</a>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#calculadora">Calculadora</a>
          <a href="https://portal.certiveh.co" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <button className="btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>
              Empezar ahora <Icon name="arrowRight" size={15} color="white" />
            </button>
          </a>
        </div>
      </nav>
      
      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay${mobileMenuOpen ? " open" : ""}`} onClick={() => setMobileMenuOpen(false)} />
      
      {/* Mobile Menu */}
      <div className={`mobile-menu${mobileMenuOpen ? " open" : ""}`}>
        <a href="#beneficios" onClick={() => setMobileMenuOpen(false)}>Beneficios</a>
        <a href="#como-funciona" onClick={() => setMobileMenuOpen(false)}>Cómo funciona</a>
        <a href="#calculadora" onClick={() => setMobileMenuOpen(false)}>Calculadora</a>
        <a href="https://portal.certiveh.co" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px 20px", fontSize: 14 }} onClick={() => setMobileMenuOpen(false)}>
            Empezar ahora <Icon name="arrowRight" size={15} color="white" />
          </button>
        </a>
      </div>
    </>
  );
}

// ── TICKER ────────────────────────────────────────────────────────────────────
function Ticker() {
  const items = ["Ley 1964 de 2019","Exención de IVA · 5%","Deducción en renta · 50%","Reducción arancelaria · 5%","Radicación automática UPME","100% en línea · Sin filas","Notificaciones WhatsApp","Pago único · Sin suscripciones"];
  return (
    <div className="ticker-wrap">
      <div className="ticker-inner">
        {[...items,...items].map((item, i) => (
          <div className="ticker-item" key={i}><div className="ticker-dot"/>{item}</div>
        ))}
      </div>
    </div>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  const flipWords = ["exención de IVA","deducción en renta","reducción arancelaria","un certificado UPME"];
  return (
    <section id="hero" aria-label="Portada — CertiVeh" className="hero-section" style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center", textAlign: "center",
      padding: "120px 48px 80px", position: "relative",
      background: "var(--white)", overflow: "hidden",
    }}>
      {/* Animated Background Paths */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.6, pointerEvents: "none" }}>
        <BackgroundPaths />
      </div>
      
      {/* Dot pattern */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.035, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, var(--emerald-600) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}/>
      {/* Top gradient */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 400,
        background: "linear-gradient(180deg, var(--emerald-50) 0%, transparent 100%)", pointerEvents: "none",
      }}/>

      {/* H1 */}
      <h1 style={{
        fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700,
        lineHeight: 1.2, letterSpacing: "-0.02em", color: "var(--slate-900)",
        maxWidth: 860, marginBottom: 12, animation: "fadeUp 0.6s 0.08s ease both",
        position: "relative", zIndex: 1
      }}>
        Tu vehículo eléctrico <br />tiene derecho a{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <FlipWords words={flipWords} duration={2800}/>
        </span>
      </h1>

      {/* Sub */}
      <p style={{
        fontSize: "clamp(16px, 1.8vw, 18px)", lineHeight: 1.6,
        color: "var(--slate-500)", maxWidth: 560,
        marginTop: 24, marginBottom: 40, animation: "fadeUp 0.6s 0.16s ease both",
        position: "relative", zIndex: 1
      }}>
        CertiVeh automatiza el trámite ante la UPME de principio a fin.
        Tú subes tres documentos. Nosotros nos encargamos de todo lo demás.
      </p>

      {/* CTAs */}
      <div style={{
        display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
        marginBottom: 48, animation: "fadeUp 0.6s 0.24s ease both",
        position: "relative", zIndex: 1
      }}>
        <a href="#calculadora" style={{ textDecoration: "none" }}>
          <button className="btn-primary btn-primary-lg">
            Calcular mi beneficio <Icon name="arrowRight" size={18} color="white"/>
          </button>
        </a>
        <a href="#como-funciona" style={{ textDecoration: "none" }}>
          <button className="btn-secondary">¿Cómo funciona?</button>
        </a>
      </div>

      {/* Trust strip */}
      <div style={{
        display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center",
        marginBottom: 64, animation: "fadeUp 0.6s 0.32s ease both",
        position: "relative", zIndex: 1
      }}>
        {[["checkCircle","Sin cuenta en la UPME"],["bell","Notificaciones WhatsApp"],["lock","Pago único, sin sorpresas"],["smartphone","100% en línea"]].map(([ico,txt]) => (
          <span key={txt as string} className="trust-item" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--slate-500)", fontWeight: 500, lineHeight: 1.5 }}>
            <Icon name={ico as string} size={14} color="var(--emerald-600)"/>{txt}
          </span>
        ))}
      </div>

      {/* Stat pills */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", animation: "fadeUp 0.6s 0.4s ease both", position: "relative", zIndex: 1 }}>
        {[{ num: "5%", label: "Exención de IVA", color: "var(--emerald-600)" },{ num: "50%", label: "Deducción renta", color: "var(--teal-500)" },{ num: "5%", label: "Ahorro arancel", color: "var(--amber-500)" }].map(s => (
          <div key={s.label} className="card" style={{ padding: "20px 28px", textAlign: "center", minWidth: 140, flex: "1 1 auto", maxWidth: 200 }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: s.color, letterSpacing: "-0.02em", lineHeight: 1 }}>{s.num}</div>
            <div style={{ fontSize: 12, color: "var(--slate-500)", fontWeight: 500, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── BENEFICIOS ────────────────────────────────────────────────────────────────
function Beneficios() {
  const cards = [
    { icon: "percent",  tag: "IVA",     title: "Exención de IVA",        pct: "5%", accentColor: "var(--emerald-600)", bgColor: "var(--emerald-50)", borderColor: "var(--emerald-200)", desc: "Los vehículos eléctricos e híbridos están exentos del impuesto al valor agregado. En un vehículo de $120M, son $6M que no pagas.", ejemplo: "$120M → ahorras $6.000.000" },
    { icon: "fileText", tag: "RENTA",   title: "Deducción en renta",     pct: "50%", accentColor: "var(--teal-500)", bgColor: "var(--teal-50)", borderColor: "var(--teal-200)", desc: "Personas naturales y jurídicas pueden deducir hasta el 50% del valor del vehículo en su declaración de renta del año de la compra.", ejemplo: "$150M → deduces $75.000.000" },
    { icon: "car",      tag: "ARANCEL", title: "Reducción arancelaria",   pct: "5%",  accentColor: "var(--amber-500)", bgColor: "var(--amber-50)", borderColor: "var(--amber-200)", desc: "Reducción del arancel de importación para vehículos eléctricos e híbridos bajo la Ley 1964. Aplica al momento de la importación.", ejemplo: "Varía según modelo y origen" },
  ];
  return (
    <section id="beneficios" aria-label="Beneficios tributarios" style={{ background: "var(--slate-50)" }}>
      <div className="section">
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--slate-900)", lineHeight: 1.25, marginBottom: 16 }}>
            Tres beneficios tributarios. <br/>
            <span style={{ background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Una sola gestión.</span>
          </h2>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "var(--slate-500)", lineHeight: 1.6, maxWidth: 520, margin: "0 auto" }}>
            El Estado colombiano creó estos incentivos para promover la movilidad eléctrica. La mayoría de propietarios nunca los reclama, por la complejidad del proceso.
          </p>
        </div>

        <div className="grid-3-cols" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {cards.map((c, i) => (
            <div key={i} className="card benefit-card" style={{ padding: 32, position: "relative", overflow: "hidden", background: c.bgColor, borderColor: c.borderColor, transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "white", border: `1px solid ${c.borderColor}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <Icon name={c.icon} size={22} color={c.accentColor}/>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: "var(--slate-900)", letterSpacing: "-0.01em", marginBottom: 4, lineHeight: 1.4 }}>{c.title}</h3>
              <div style={{ fontSize: 40, fontWeight: 700, color: c.accentColor, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 14 }}>{c.pct}</div>
              <p style={{ fontSize: 14, color: "var(--slate-600)", lineHeight: 1.5, marginBottom: 16 }}>{c.desc}</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: "white", border: `1px solid ${c.borderColor}`, fontSize: 12, fontWeight: 600, color: c.accentColor }}>
                <Icon name="checkCircle" size={12} color={c.accentColor}/>{c.ejemplo}
              </div>
            </div>
          ))}
        </div>

        <div className="info-callout" style={{ marginTop: 40, padding: "24px 28px", background: "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0.04) 100%)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, display: "flex", alignItems: "flex-start", gap: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: "var(--amber-500)" }}></div>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "white", border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="calendar" size={20} color="var(--amber-600)"/>
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.6, paddingTop: 2 }}>
            <span style={{ fontWeight: 600, color: "var(--slate-900)" }}>La UPME abre ventanas de radicación dos veces al año. </span>
            <span style={{ color: "var(--slate-600)" }}>Si pierdes la ventana, esperas hasta el siguiente semestre. CertiVeh monitorea las fechas y radica tu solicitud automáticamente cuando abre el proceso.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CÓMO FUNCIONA ─────────────────────────────────────────────────────────────
function ComoFunciona() {
  const [active, setActive] = useState(0);
  const steps = [
    { num: "01", icon: "upload",      title: "Sube tus documentos",    subtitle: "Menos de 3 minutos",       desc: "Solo necesitas tres documentos: tu Cédula, la Tarjeta de Propiedad del vehículo y la Factura de Compra. Nuestro sistema extrae todos los datos automáticamente con inteligencia artificial.", detail: "Sin formularios manuales. Sin errores de digitación." },
    { num: "02", icon: "checkCircle", title: "Revisa y confirma",      subtitle: "30 segundos",              desc: "Verificas que los datos extraídos sean correctos. Puedes editar cualquier campo antes de continuar. Una vez confirmas, nos pones a trabajar.", detail: "La IA extrae +90% de los datos correctamente en el primer intento." },
    { num: "03", icon: "lock",        title: "Pago único",             subtitle: "Una sola vez",             desc: "Pagas nuestra tarifa de servicio una sola vez. Sin suscripciones, sin costos ocultos. El pago confirma tu caso y activa el proceso.", detail: "Procesado con Wompi · Tarjeta, PSE o Nequi." },
    { num: "04", icon: "zap",         title: "Nosotros hacemos todo",  subtitle: "Tú no haces nada más",    desc: "Nuestro agente automatizado crea tu cuenta en la UPME, llena todos los formularios con tus datos y radica la solicitud en la ventana correspondiente.", detail: "Sin que tengas que tocar ningún portal gubernamental." },
    { num: "05", icon: "award",       title: "Recibe tu certificado",  subtitle: "Lo descargas desde tu panel", desc: "Te notificamos por WhatsApp y email en cada etapa del proceso. Cuando el certificado está listo, lo descargas directamente desde tu dashboard.", detail: "Seguimiento en tiempo real. Nunca te dejamos sin información." },
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [steps.length]);
  
  return (
    <section id="como-funciona" aria-label="Cómo funciona" style={{ background: "var(--white)" }}>
      <div className="section">
        <div className="grid-2-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--slate-900)", lineHeight: 1.25, marginBottom: 12 }}>
              Así de simple <br/><span style={{ color: "var(--slate-400)" }}>es el trámite.</span>
            </h2>
            <p style={{ fontSize: "clamp(14px, 1.8vw, 16px)", color: "var(--slate-500)", lineHeight: 1.6, marginBottom: 32 }}>
              De tu teléfono al certificado UPME. Sin que tengas que interactuar con ningún portal gubernamental.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {steps.map((s, i) => (
                <button key={i} className={`step-tab${active === i ? " active" : ""}`} onClick={() => setActive(i)}>
                  <div className="step-num">{s.num}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: active === i ? "var(--slate-900)" : "var(--slate-600)", lineHeight: 1.6 }}>{s.title}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: active === i ? "var(--emerald-600)" : "var(--slate-400)", marginTop: 1, lineHeight: 1.4 }}>{s.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card step-card" style={{ padding: 40, height: 420, display: "flex", flexDirection: "column", justifyContent: "center", background: "var(--grad-subtle)", borderColor: "var(--emerald-200)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -8, right: 16, fontSize: 140, fontWeight: 700, color: "var(--emerald-600)", opacity: 0.06, lineHeight: 1, pointerEvents: "none" }}>{steps[active].num}</div>
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: "var(--grad-primary)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: "0 4px 14px rgba(5,150,105,0.3)" }}>
                  <Icon name={steps[active].icon} size={24} color="white"/>
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 600, color: "var(--slate-900)", letterSpacing: "-0.01em", lineHeight: 1.35, marginBottom: 12 }}>{steps[active].title}</h3>
                <p style={{ fontSize: 16, color: "var(--slate-600)", lineHeight: 1.6, marginBottom: 20 }}>{steps[active].desc}</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 8, background: "white", border: "1px solid var(--emerald-200)", fontSize: 14, fontWeight: 500, color: "var(--emerald-700)" }}>
                  <Icon name="checkCircle" size={14} color="var(--emerald-600)"/>{steps[active].detail}
                </div>
              </motion.div>
            </AnimatePresence>
            <div style={{ display: "flex", gap: 6, marginTop: 28 }}>
              {steps.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} style={{ height: 6, width: i === active ? 24 : 6, borderRadius: 3, background: i === active ? "var(--emerald-600)" : "var(--slate-300)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.25s" }}/>
              ))}
            </div>
          </div>
        </div>

        {/* Image Comparison */}
        <div style={{ marginTop: 64 }}>
          <ImageComparison
            beforeImage={imgElectricCar}
            afterImage={imgPortalUsuario}
          />
        </div>
      </div>
    </section>
  );
}

// ── CALCULADORA ───────────────────────────────────────────────────────────────
// v2.0 - Con perfil tributario, tasa de renta y depreciación acelerada
function Calculadora() {
  const [valor, setValor] = useState(120);
  const [tipo, setTipo] = useState("electrico");
  const [perfil, setPerfil] = useState("natural");
  const [tasaRenta, setTasaRenta] = useState(19);
  const [calc, setCalc] = useState<any>({});
  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-CO") + " COP";

  useEffect(() => {
    const v = valor * 1_000_000;
    const iva = tipo === "electrico" ? v * 0.05 : v * 0.025;
    const renta = v * 0.50 * (tasaRenta / 100);
    const arancel = v * 0.05;
    const total = iva + renta + arancel;
    const honorarios = v * 0.025;
    setCalc({ iva, renta, arancel, total, honorarios, neto: total - honorarios });
  }, [valor, tipo, perfil, tasaRenta]);

  const bars = [
    { label: "Exención IVA",    value: calc.iva,     color: "var(--emerald-600)", pct: calc.iva     / calc.total },
    { label: "Deducción renta", value: calc.renta,   color: "var(--teal-500)", pct: calc.renta   / calc.total },
    { label: "Ahorro arancel",  value: calc.arancel, color: "var(--amber-500)", pct: calc.arancel / calc.total },
  ];
  return (
    <section id="calculadora" aria-label="Calculadora de beneficios" style={{ background: "var(--slate-50)", position: "relative", overflow: "hidden" }}>
      <BGPattern variant="grid" mask="fade-edges" fill="#059669" size={40} className="opacity-10" />
      <div className="section" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--slate-900)", lineHeight: 1.25, marginBottom: 14 }}>¿Cuánto puedes recuperar?</h2>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "var(--slate-500)", lineHeight: 1.6 }}>Mueve el slider y ve en tiempo real cuánto vale tu beneficio tributario.</p>
        </div>

        <div className="card grid-calc" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden", padding: 0 }}>
          {/* Controls */}
          <div className="card-calc-controls" style={{ padding: 48, borderRight: "1px solid var(--slate-200)" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", color: "var(--slate-500)", marginBottom: 10, textTransform: "uppercase" }}>Tipo de vehículo</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[{ value: "electrico", label: "Eléctrico puro", icon: "zap" },{ value: "hibrido", label: "Híbrido", icon: "battery" }].map(opt => (
                  <button key={opt.value} onClick={() => setTipo(opt.value)} style={{ padding: "11px 16px", borderRadius: 8, border: tipo === opt.value ? "1.5px solid #059669" : "1.5px solid var(--slate-200)", background: tipo === opt.value ? "var(--emerald-50)" : "var(--white)", color: tipo === opt.value ? "var(--emerald-700)" : "var(--slate-600)", fontSize: 14, fontWeight: tipo === opt.value ? 600 : 400, cursor: "pointer", fontFamily: "var(--ff)", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                    <Icon name={opt.icon} size={16} color={tipo === opt.value ? "var(--emerald-700)" : "var(--slate-600)"} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", color: "var(--slate-500)", marginBottom: 10, textTransform: "uppercase" }}>Perfil tributario</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[{ value: "natural", label: "Persona natural" },{ value: "empresa", label: "Independiente/Empresa" }].map(opt => (
                  <button key={opt.value} onClick={() => setPerfil(opt.value)} style={{ padding: "11px 14px", borderRadius: 8, border: perfil === opt.value ? "1.5px solid #059669" : "1.5px solid var(--slate-200)", background: perfil === opt.value ? "var(--emerald-50)" : "var(--white)", color: perfil === opt.value ? "var(--emerald-700)" : "var(--slate-600)", fontSize: "clamp(12px, 1.5vw, 14px)", fontWeight: perfil === opt.value ? 600 : 400, cursor: "pointer", fontFamily: "var(--ff)", transition: "all 0.15s", textAlign: "center", lineHeight: 1.3 }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", color: "var(--slate-500)", textTransform: "uppercase" }}>Valor del vehículo</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "var(--emerald-600)", letterSpacing: "-0.02em" }}>${valor}M</div>
              </div>
              <input type="range" min="40" max="600" step="5" value={valor} onChange={e => setValor(Number(e.target.value))} style={{ width: "100%", appearance: "none", height: 6, borderRadius: 3, outline: "none", cursor: "pointer", background: `linear-gradient(to right,#059669 0%,#059669 ${((valor-40)/560)*100}%,#E2E8F0 ${((valor-40)/560)*100}%,#E2E8F0 100%)` }}/>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--slate-400)", fontWeight: 500, marginTop: 6 }}>
                <span>$40M</span><span>$600M</span>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", color: "var(--slate-500)", textTransform: "uppercase" }}>Tu tasa de renta</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "var(--teal-500)", letterSpacing: "-0.02em" }}>{tasaRenta}%</div>
              </div>
              <input type="range" min="19" max="39" step="1" value={tasaRenta} onChange={e => setTasaRenta(Number(e.target.value))} style={{ width: "100%", appearance: "none", height: 6, borderRadius: 3, outline: "none", cursor: "pointer", background: `linear-gradient(to right,#14B8A6 0%,#14B8A6 ${((tasaRenta-19)/20)*100}%,#E2E8F0 ${((tasaRenta-19)/20)*100}%,#E2E8F0 100%)` }}/>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--slate-400)", fontWeight: 500, marginTop: 6 }}>
                <span>19%</span><span>39%</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {bars.map((b, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 14, color: "var(--slate-600)", fontWeight: 500, lineHeight: 1.5 }}>{b.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: b.color, lineHeight: 1.5 }}>{b.value ? fmt(b.value) : "—"}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "var(--slate-100)", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 3, background: b.color, width: `${(b.pct||0)*100}%`, transition: "width 0.4s ease" }}/>
                  </div>
                </div>
              ))}
              {perfil === "empresa" && (
                <div style={{ padding: "10px 14px", background: "var(--emerald-50)", border: "1px solid var(--emerald-200)", borderRadius: 8, fontSize: 13, color: "var(--emerald-700)", lineHeight: 1.5 }}>
                  Depreciación acelerada a 3 años — reduce tu base gravable más rápido y paga menos impuestos hoy.
                </div>
              )}
            </div>

            <div style={{ marginTop: 20, padding: "12px 16px", background: "var(--slate-50)", border: "1px solid var(--slate-200)", borderRadius: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--slate-500)", marginBottom: 3, lineHeight: 1.5 }}>
                <span>Honorarios CertiVeh (2.5%)</span>
                <span style={{ fontWeight: 600, color: "var(--slate-700)" }}>{calc.honorarios ? fmt(calc.honorarios) : "—"}</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--slate-400)", lineHeight: 1.4 }}>
                * Estimación referencial. Valor real depende del régimen tributario.
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="card-calc-result" style={{ padding: 48, background: "var(--grad-subtle)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--emerald-600)", marginBottom: 12, textTransform: "uppercase" }}>Beneficio total estimado</div>
            <div style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 6, transition: "all 0.3s" }}>
              {calc.total ? fmt(calc.total) : "—"}
            </div>
            <div style={{ fontSize: 14, color: "var(--slate-500)", marginBottom: 28, lineHeight: 1.5 }}>en incentivos tributarios recuperables</div>

            <div className="card" style={{ width: "100%", padding: "20px 24px", marginBottom: 24, background: "white", borderColor: "var(--emerald-200)", textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--emerald-600)", marginBottom: 8, textTransform: "uppercase" }}>Beneficio neto (menos honorarios)</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--slate-900)", letterSpacing: "-0.02em" }}>{calc.neto ? fmt(calc.neto) : "—"}</div>
            </div>

            {calc.honorarios && calc.total && (
              <div style={{ fontSize: 14, color: "var(--slate-600)", lineHeight: 1.6, marginBottom: 28 }}>
                Por cada <span style={{ fontWeight: 700, color: "var(--slate-900)" }}>$1 invertido</span> en CertiVeh, recibes{" "}
                <span style={{ fontWeight: 700, color: "var(--emerald-600)" }}>${Math.round(calc.total / calc.honorarios * 10) / 10}</span> en beneficios.
              </div>
            )}

            <a href="https://portal.certiveh.co" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", width: "100%" }}>
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px 24px" }}>
                Empezar ahora <Icon name="arrowRight" size={18} color="white"/>
              </button>
            </a>
            <div style={{ fontSize: 12, color: "var(--slate-400)", marginTop: 12 }}>Sin riesgo · Si la UPME rechaza, revisamos tu caso</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CONFIANZA ─────────────────────────────────────────────────────────────────
function Confianza() {
  const puntos = [
    { icon: "zap",         title: "Agente automatizado",          desc: "Nuestra tecnología navega el portal UPME por ti, llena todos los formularios y radica la solicitud sin que tengas que hacer nada." },
    { icon: "smartphone",  title: "Actualización en tiempo real", desc: "Seguimiento completo por WhatsApp y email. Sabes exactamente en qué etapa está tu trámite, en todo momento." },
    { icon: "lock",        title: "Tus datos, protegidos",        desc: "Cifrado de extremo a extremo. Cumplimos la Ley 1581 de Habeas Data. Nunca compartimos tu información con terceros." },
    { icon: "calendar",    title: "No pierdas la ventana",        desc: "Monitoreamos las fechas de apertura de la UPME. Tu solicitud se radica automáticamente cuando el sistema abre." },
    { icon: "shield",      title: "Sin portal gubernamental",     desc: "Tú nunca tienes que entrar a la UPME. Nosotros creamos la cuenta, gestionamos el proceso y resolvemos cualquier imprevisto." },
    { icon: "checkCircle", title: "Pago único, sin letra pequeña",desc: "Una sola tarifa de servicio. Sin suscripciones, sin costos adicionales. Todo incluido desde el primer día." },
  ];
  return (
    <section id="confianza" aria-label="Por qué CertiVeh" style={{ background: "var(--white)" }}>
      <div className="section">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--slate-900)", lineHeight: 1.25 }}>
            Hecho para que no <br/><span style={{ color: "var(--slate-400)" }}>tengas que preocuparte.</span>
          </h2>
        </div>
        <div className="grid-3-cols" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {puntos.map((p, i) => (
            <div key={i} className="card trust-card" style={{ padding: 28, transition: "transform 0.2s, box-shadow 0.2s", position: "relative", overflow: "hidden" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, background: "var(--grad-primary)" }}></div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--emerald-50)", border: "1px solid var(--emerald-200)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <Icon name={p.icon} size={20} color="var(--emerald-600)"/>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--slate-900)", marginBottom: 8, letterSpacing: "-0.01em", lineHeight: 1.45 }}>{p.title}</h3>
              <p style={{ fontSize: 14, color: "var(--slate-500)", lineHeight: 1.5 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ────────────────────────────────────────────────────────────────────���──
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    { q: "¿Qué vehículos califican?",               a: "Vehículos eléctricos puros e híbridos registrados en Colombia que cumplan los requisitos de la Ley 1964 de 2019. El vehículo debe estar a nombre del solicitante en el RUNT." },
    { q: "¿Cuándo puedo radicar mi solicitud?",     a: "La UPME abre ventanas de radicación dos veces al año. Si no hay ventana abierta cuando te registras, tu caso queda en cola y lo radicamos automáticamente en la siguiente apertura. Te avisamos con anticipación." },
    { q: "¿Qué documentos necesito?",               a: "Solo tres: Cédula de ciudadanía (frente y reverso), Tarjeta de Propiedad del vehículo (frente y reverso) y Factura de Compra del vehículo. Todo se sube en PDF, JPG o PNG desde tu teléfono." },
    { q: "¿Cuánto toma el proceso completo?",       a: "Desde que subes tus documentos hasta la radicación: menos de 10 minutos de tu parte. Desde la radicación hasta el certificado UPME: entre 4 y 8 semanas dependiendo de la UPME." },
    { q: "¿Qué pasa si la UPME rechaza mi solicitud?", a: "Revisamos el motivo del rechazo contigo y gestionamos la corrección sin costo adicional. Nuestra política de garantía está detallada en los términos del servicio." },
    { q: "¿Funciona para personas jurídicas?",      a: "Por el momento el servicio está disponible para personas naturales. El soporte para empresas está programado para el segundo semestre de 2026." },
  ];
  return (
    <section id="faq" aria-label="Preguntas frecuentes" style={{ background: "var(--slate-50)" }}>
      <div className="section">
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--slate-900)", lineHeight: 1.25 }}>Todo lo que necesitas saber</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {items.map((item, i) => (
              <div key={i} className={`faq-item${open === i ? " open" : ""}`}>
                <button className="faq-btn" onClick={() => setOpen(open === i ? null : i)}>
                  <span>{item.q}</span><div className="faq-icon">+</div>
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
    <section id="cta-final" aria-label="Comenzar" className="cta-section" style={{ background: "var(--grad-primary)", padding: "96px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <AnimatedGridPattern
        numSquares={40}
        maxOpacity={0.15}
        duration={3}
        repeatDelay={1}
        className="fill-white/30 stroke-white/30"
      />
      <div style={{ position: "relative" }}>
        <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", lineHeight: 1.2, marginBottom: 16, maxWidth: 680, margin: "0 auto 16px" }}>
          Tu certificado UPME <br/>te está esperando.
        </h2>
        <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, maxWidth: 460, margin: "0 auto 36px" }}>
          Miles de propietarios de vehículos eléctricos en Colombia no han reclamado sus beneficios. La próxima ventana UPME se abre pronto.
        </p>
        <a href="https://portal.certiveh.co" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <button className="cta-button" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "white", color: "var(--emerald-700)", border: "none", borderRadius: 8, padding: "16px 36px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "var(--ff)", transition: "transform 0.15s, box-shadow 0.15s", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)"; }}
          >
            Empezar ahora <Icon name="arrowRight" size={18} color="#047857"/>
          </button>
        </a>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
          {["Pago único · Sin suscripciones","100% en línea","Notificaciones por WhatsApp"].map(t => (
            <span key={t} className="cta-feature" style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", fontWeight: 500, display: "flex", alignItems: "center", gap: 6, lineHeight: 1.5 }}>
              <Icon name="checkCircle" size={13} color="rgba(255,255,255,0.75)"/>{t}
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
    <footer aria-label="Pie de página" style={{ background: "var(--slate-900)", color: "var(--slate-400)", padding: "48px 48px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
          <div>
            <CertiVehLogo variant="light" compact/>
            <p style={{ fontSize: 14, color: "var(--slate-500)", marginTop: 10, maxWidth: 260, lineHeight: 1.5 }}>
              Automatización del trámite UPME para certificados de beneficio tributario en Colombia.
            </p>
          </div>
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            {[{ label: "Plataforma", links: ["Beneficios","Cómo funciona","Calculadora"] },{ label: "Legal", links: ["Términos","Privacidad","Ley 1964"] }].map(col => (
              <div key={col.label}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--slate-300)", letterSpacing: "0.08em", marginBottom: 14, textTransform: "uppercase" }}>{col.label}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map(l => (
                    <a key={l} href="#" style={{ fontSize: 14, color: "var(--slate-500)", textDecoration: "none", transition: "color 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "white"}
                      onMouseLeave={e => e.currentTarget.style.color = "var(--slate-500)"}
                    >{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 12, lineHeight: 1.4 }}>© 2026 CertiVeh · Certificados de Beneficio Tributario · Colombia</span>
          <span style={{ fontSize: 12, lineHeight: 1.4 }}>certiveh.contacto@gmail.com</span>
        </div>
      </div>
    </footer>
  );
}

// ── URGENCY MODAL ───────────────────────────────────────────���─────────────────
function UrgencyModal({ onClose }: { onClose: () => void }) {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="urgency-modal-overlay"
        onClick={handleOverlayClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="urgency-modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="urgency-modal-close" onClick={onClose} aria-label="Cerrar modal">
            <Icon name="x" size={18} />
          </button>

          <div style={{ marginBottom: 20 }}>
            <span className="badge" style={{ 
              background: 'var(--amber-50)', 
              color: 'var(--amber-700)', 
              borderColor: 'var(--amber-200)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em'
            }}>
              ALERTA REGULATORIA
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: 400,
            color: 'var(--slate-900)',
            lineHeight: 1.3,
            marginBottom: 8,
            letterSpacing: '-0.01em'
          }}>
            ¿Y si cambian los beneficios?
          </h2>

          <h3 style={{
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: 700,
            color: 'var(--emerald-600)',
            lineHeight: 1.3,
            marginBottom: 24,
            letterSpacing: '-0.02em'
          }}>
            Blinda tu ahorro hoy.
          </h3>

          <p style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: 'var(--slate-600)',
            marginBottom: 32
          }}>
            La normativa tributaria cambia. Los incentivos de la Ley 1964 que hoy te dan hasta el 50% de deducción en renta podrían reducirse o eliminarse en una próxima reforma. Radicar tu trámite ahora te permite acogerte a la ley vigente y proteger tu beneficio como un derecho adquirido ante cualquier cambio futuro.
          </p>

          <a href="https://portal.certiveh.co" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: '100%' }}>
            <button 
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '16px 32px',
                fontSize: 16,
                fontWeight: 700
              }}
            >
              Blindar mi beneficio ahora
              <Icon name="arrowRight" size={18} color="white" />
            </button>
          </a>

          <p style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: 'var(--slate-500)',
            marginTop: 16,
            fontStyle: 'italic',
            textAlign: 'center'
          }}>
            Radicar hoy garantiza la aplicación de la norma actual bajo el principio de confianza legítima.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function CertiVehLandingComplete() {
  const [showUrgencyModal, setShowUrgencyModal] = useState(false);

  // Urgency modal logic - shows after 10 seconds, once per session
  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('urgencyModalSeen');
    if (hasSeenModal) return;

    const timer = setTimeout(() => {
      setShowUrgencyModal(true);
      sessionStorage.setItem('urgencyModalSeen', 'true');
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const structuredDataApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CertiVeh",
    "description": "CertiVeh automatiza el trámite del certificado UPME para vehículos eléctricos e híbridos en Colombia. Gestiona la exención de IVA, deducción en renta y reducción arancelaria bajo la Ley 1964 de 2019.",
    "url": "https://certiveh.co",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "COP",
      "description": "Tarifa única de servicio del 2.5% del beneficio total"
    },
    "provider": {
      "@type": "Organization",
      "name": "CertiVeh",
      "url": "https://certiveh.co",
      "email": "certiveh.contacto@gmail.com",
      "areaServed": "CO",
      "description": "Automatización del trámite UPME para certificados de beneficio tributario en Colombia"
    }
  };

  const structuredDataFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Qué vehículos califican?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Vehículos eléctricos puros e híbridos registrados en Colombia que cumplan los requisitos de la Ley 1964 de 2019. El vehículo debe estar a nombre del solicitante en el RUNT."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cuándo puedo radicar mi solicitud?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "La UPME abre ventanas de radicación dos veces al año. Si no hay ventana abierta cuando te registras, tu caso queda en cola y lo radicamos automáticamente en la siguiente apertura."
        }
      },
      {
        "@type": "Question",
        "name": "¿Qué documentos necesito?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Solo tres: Cédula de ciudadanía (frente y reverso), Tarjeta de Propiedad del vehículo (frente y reverso) y Factura de Compra del vehículo. Todo se sube en PDF, JPG o PNG desde tu teléfono."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cuánto toma el proceso completo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Desde que subes tus documentos hasta la radicación: menos de 10 minutos de tu parte. Desde la radicación hasta el certificado UPME: entre 4 y 8 semanas dependiendo de la UPME."
        }
      },
      {
        "@type": "Question",
        "name": "¿Qué pasa si la UPME rechaza mi solicitud?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Revisamos el motivo del rechazo contigo y gestionamos la corrección sin costo adicional. Nuestra política de garantía está detallada en los términos del servicio."
        }
      },
      {
        "@type": "Question",
        "name": "¿Funciona para personas jurídicas?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Por el momento el servicio está disponible para personas naturales. El soporte para empresas está programado para el segundo semestre de 2026."
        }
      }
    ]
  };

  return (
    <>
      <style>{CSS}</style>
      <Navbar />
      <main>
        <Hero/>
        <Ticker/>
        <Beneficios/>
        <ComoFunciona/>
        <Calculadora/>
        <Confianza/>
        <FAQ/>
        <CTAFinal/>
      </main>
      <Footer/>
      
      {/* Urgency Modal */}
      {showUrgencyModal && <UrgencyModal onClose={() => setShowUrgencyModal(false)} />}
      
      {/* Structured Data - JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(structuredDataApp)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(structuredDataFAQ)}} />
    </>
  );
}