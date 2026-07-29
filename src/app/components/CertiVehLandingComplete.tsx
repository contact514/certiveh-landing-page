import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { Navbar } from "./Navbar";
import { AnimatePresence, motion } from "motion/react";
import { AnimatedGridPattern } from './ui/animated-grid-pattern';
import { BGPattern } from './ui/bg-pattern';
import { cn } from '@/lib/utils';
import imgPortalUsuario from '@/assets/portal-dashboard.jpg';

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
// Border-radius: sm=8px, md=12px, lg=16px, full=9999px, modal=20px
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
  @keyframes waPulse {
    0%, 100% { box-shadow: 0 4px 16px rgba(37,211,102,0.4), 0 2px 4px rgba(0,0,0,0.2); }
    50% { box-shadow: 0 4px 24px rgba(37,211,102,0.6), 0 2px 8px rgba(0,0,0,0.2); transform: scale(1.05); }
  }
  @keyframes ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .pqns-row { display: grid; grid-template-columns: 3fr 2fr; }
  @media (max-width: 640px) {
    .pqns-row { grid-template-columns: 1fr !important; }
    .pqns-row > div:last-child { border-top: 1px solid var(--slate-200); }
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--slate-100); }
  ::-webkit-scrollbar-thumb { background: var(--emerald-600); border-radius: 3px; }

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
  input[type=range]:focus-visible::-webkit-slider-thumb {
    box-shadow: 0 2px 12px rgba(5,150,105,0.4), 0 0 0 6px rgba(5,150,105,0.15);
  }
  input[type=range]:focus-visible::-moz-range-thumb {
    box-shadow: 0 2px 12px rgba(5,150,105,0.4), 0 0 0 6px rgba(5,150,105,0.15);
  }

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

  .ticker-wrap { overflow: hidden; background: var(--grad-primary); padding: 12px 0; }
  .ticker-inner { display: flex; animation: ticker 30s linear infinite; width: max-content; }
  .ticker-item {
    display: flex; align-items: center; gap: 10px;
    font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.9);
    padding: 0 36px; white-space: nowrap; letter-spacing: 0.02em;
  }
  .ticker-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.6); flex-shrink: 0; }

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

  /* ── URGENCY MODAL ──────────────────────────────────────────────────────── */
  .urgency-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .urgency-modal {
    position: relative;
    background: #0F172A;
    border-radius: 20px;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(5,150,105,0.08);
    max-width: 520px;
    width: 100%;
    padding: 44px;
    border: 1px solid rgba(255,255,255,0.08);
  }

  .urgency-modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
    color: rgba(255,255,255,0.5);
  }

  .urgency-modal-close:hover {
    background: rgba(255,255,255,0.12);
    color: white;
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
    top: 64px;
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
    top: 64px;
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
  
  .hero-video { display: block; object-position: center 25%; }
  .hero-poster { display: none; }

  @media (max-width: 768px) {
    .hero-video { width: 100% !important; height: 100% !important; left: 0 !important; top: 0 !important; object-fit: cover !important; object-position: 15% 38%; opacity: 0.35 !important; }
    .hero-poster { display: none !important; }
    .hero-overlay { background: linear-gradient(180deg, rgba(15,23,42,0.7) 0%, rgba(15,23,42,0.4) 50%, rgba(5,150,105,0.15) 100%) !important; }

    nav { padding: 0 20px; height: 64px; }
    .nav-links { display: none; }
    .mobile-menu-btn { display: flex; }

    .hero-section { padding: 100px 20px 60px !important; height: auto !important; min-height: 60vh !important; }
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
    .cta-feature { font-size: 12px !important; gap: 4px !important; }
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

    /* WhatsApp FAB más pequeño en mobile */
    .whatsapp-fab { width: 48px !important; height: 48px !important; bottom: 16px !important; right: 12px !important; }
    
    /* Info callout responsive */
    .info-callout { padding: 20px !important; gap: 12px !important; }
    
    /* Stat pills en móvil */
    .card { border-radius: 16px; }

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
    gift:        <><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></>,
    share2:      <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>,
    dollarSign:  <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    info:        <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    user:        <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    building:    <><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></>,
    receipt:     <><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></>,
    users:       <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
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
    <svg width={w} height={h} viewBox={`0 0 ${compact ? 240 : 320} ${compact ? 60 : 80}`} fill="none" role="img" aria-label="Logo CertiVeh - Certificación Vehicular">
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
          <text x="0" y="20" fill={variant === "light" ? "rgba(255,255,255,0.6)" : getCSSVar('--slate-500', '#64748B')}
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
          color: "#34D399",
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

// ── NAVBAR — uses shared Navbar component ─────────────────────────────────────
// (imported from ./Navbar.tsx — same component used in blog)

// ── TICKER ────────────────────────────────────────────────────────────────────
function Ticker() {
  const items = ["Eléctricos e híbridos (no MHEV)","Devolución de IVA · 5%","Deducción en renta · 50%","Depreciación acelerada · 3 años","Radicación automática UPME","Menos de 5 minutos","Sin portal gubernamental","Certificado UPME digital","Gestión de devolución de IVA ante la DIAN"];
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

// ── VENTANA UPME (Resolución 400 de 2026 – ventana continua) ─────────────────
function VentanaUPME() {
  const portalUrl = usePortalUrl();

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const month = now.getMonth(); // 0-indexed
  const day = now.getDate();
  // Window open: Feb 1 (month 1, day 1) to Dec 15 (month 11, day 15)
  const ventanaAbierta =
    (month > 0 && month < 11) ||
    (month === 0 && day >= 1 && false) || // Jan is always closed
    (month === 11 && day <= 15);

  // Countdown target: next Feb 1
  const nextYear = month === 0 ? now.getFullYear() : now.getFullYear() + 1;
  const target = new Date(nextYear, 1, 1);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section aria-label="Ventana de radicación UPME" style={{ background: ventanaAbierta ? "var(--emerald-600)" : "var(--slate-800)", padding: "28px 20px", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", borderRadius: 9999, padding: "5px 14px", marginBottom: 14 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: ventanaAbierta ? "#4ADE80" : "#FBBF24", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "white", letterSpacing: "0.06em" }}>
            {ventanaAbierta ? "Ventana de radicación abierta" : "Ventana cerrada"}
          </span>
        </div>

        {ventanaAbierta ? (
          <>
            <div style={{ fontSize: "clamp(14px, 2vw, 16px)", color: "rgba(255,255,255,0.85)", marginBottom: 20, lineHeight: 1.5 }}>
              La UPME recibe solicitudes de forma continua del 1 de febrero al 15 de diciembre. Radica en cualquier momento.
            </div>

            <a href={portalUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button className="btn-primary btn-primary-lg" style={{ background: "white", color: "var(--emerald-700)" }}>
                Empezar mi trámite ahora <Icon name="arrowRight" size={18} color="var(--emerald-700)" />
              </button>
            </a>

            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 14 }}>
              Resolución UPME 400 de 2026
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: "clamp(14px, 2vw, 16px)", color: "rgba(255,255,255,0.85)", marginBottom: 16, lineHeight: 1.5 }}>
              La próxima ventana de radicación abre en:
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "clamp(8px, 2vw, 16px)", marginBottom: 20 }}>
              {[
                { val: days, label: "Días" },
                { val: hours, label: "Horas" },
                { val: mins, label: "Min" },
              ].map((u, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: "white", letterSpacing: "-0.02em", lineHeight: 1, fontVariantNumeric: "tabular-nums", background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px", minWidth: "clamp(56px, 8vw, 72px)" }}>
                    {pad(u.val)}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginTop: 6, letterSpacing: "0.06em" }}>{u.label}</div>
                </div>
              ))}
            </div>

            <a href={portalUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button className="btn-primary btn-primary-lg" style={{ background: "white", color: "var(--emerald-700)" }}>
                Empezar mi trámite ahora <Icon name="arrowRight" size={18} color="var(--emerald-700)" />
              </button>
            </a>

            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 14, lineHeight: 1.6, maxWidth: 480, margin: "14px auto 0" }}>
              No tienes que esperar. Carga tu solicitud ahora y nosotros la radicamos automáticamente el 1 de febrero. Tu lugar queda asegurado.
            </div>

            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 10 }}>
              Resolución UPME 400 de 2026
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  const portalUrl = usePortalUrl();
  const flipWords = ["devolución de IVA","deducción en renta","depreciación acelerada","un certificado UPME"];

  const fmtM = (n: number) => {
    const m = Math.round(n / 1_000_000);
    return "$" + m.toLocaleString("es-CO") + "M+";
  };

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
    <section id="hero" aria-label="Portada - CertiVeh" className="hero-section" style={{
      height: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center", textAlign: "center",
      padding: "100px 48px 60px", position: "relative",
      background: "var(--slate-900)", overflow: "hidden",
    }}>
      {/* Background video (desktop) / poster (mobile) */}
      <video
        autoPlay muted loop playsInline
        preload="metadata"
        poster="/hero-bg-poster.webp"
        className="hero-video"
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", pointerEvents: "none", opacity: 0.35,
        }}
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>
      {/* Static poster fallback for mobile */}
      <div className="hero-poster" style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.35,
        backgroundImage: "url(/hero-bg-poster.webp)",
        backgroundSize: "cover", backgroundPosition: "center",
      }} />
      {/* Gradient overlay */}
      <div className="hero-overlay" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(180deg, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.3) 50%, rgba(5,150,105,0.15) 100%)",
      }}/>

      {/* H1 */}
      <h1 style={{
        fontSize: "clamp(36px, 5.5vw, 56px)", fontWeight: 700,
        lineHeight: 1.15, letterSpacing: "-0.03em", color: "#FFFFFF",
        maxWidth: 800, marginBottom: 10, animation: "fadeUp 0.6s 0.08s ease both",
        position: "relative", zIndex: 1
      }}>
        Reclama los beneficios tributarios de tu{" "}
        <span style={{ background: "linear-gradient(135deg, #34D399 0%, #14B8A6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          carro eléctrico o híbrido
        </span>
        {" "}en Colombia
      </h1>
      <div style={{
        fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 500,
        color: "rgba(255,255,255,0.7)", marginBottom: 0,
        animation: "fadeUp 0.6s 0.12s ease both",
        position: "relative", zIndex: 1
      }}>
        Accede a{" "}
        <span style={{ position: "relative", display: "inline-block", color: "#34D399", fontWeight: 600 }}>
          <FlipWords words={flipWords} duration={2800}/>
        </span>
      </div>

      {/* Sub */}
      <p style={{
        fontSize: "clamp(15px, 1.8vw, 17px)", lineHeight: 1.7,
        color: "rgba(255,255,255,0.5)", maxWidth: 600,
        marginTop: 16, marginBottom: 28, animation: "fadeUp 0.6s 0.16s ease both",
        position: "relative", zIndex: 1
      }}>
        Tramitamos tu certificado UPME, el documento que desbloquea tus beneficios tributarios. Tú subes tus documentos. Nosotros nos encargamos de todo lo demás.
      </p>

      {/* CTAs */}
      <div style={{
        display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
        marginBottom: 36, animation: "fadeUp 0.6s 0.24s ease both",
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
        <a href={portalUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <button className="btn-secondary" style={{
            background: "rgba(255,255,255,0.08)", color: "#FFFFFF",
            border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 12,
            backdropFilter: "blur(4px)", padding: "15px 28px",
          }}>
            Empezar mi trámite ahora
          </button>
        </a>
      </div>

      {/* Stats */}
      <div style={{
        display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center",
        marginBottom: 20, animation: "fadeUp 0.6s 0.32s ease both",
        position: "relative", zIndex: 1,
        background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16,
        overflow: "hidden",
      }}>
        {[
          { num: stats ? fmtM(stats.vehiculos_gestionados) : null, label: "en vehículos gestionados", color: "#34D399" },
          { num: stats ? fmtM(stats.deducciones_renta) : null, label: "en deducciones de renta", color: "#5EEAD4" },
          { num: stats ? fmtM(stats.iva_por_devolver) : null, label: "en IVA por devolver", color: "#34D399" },
        ].map((s, i) => (
          <div key={s.label} style={{
            padding: "16px 28px", textAlign: "center", minWidth: 160,
            flex: "1 1 auto", cursor: "default",
            borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
          }}>
            {s.num
              ? <div style={{ fontSize: 26, fontWeight: 700, color: s.color, letterSpacing: "-0.02em", lineHeight: 1 }}>{s.num}</div>
              : <div style={{ height: 26, width: 100, borderRadius: 6, background: "rgba(255,255,255,0.1)", margin: "0 auto", animation: "pulse 1.5s ease-in-out infinite" }} />
            }
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 500, marginTop: 8 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Trust strip */}
      <div style={{
        display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center",
        marginBottom: 48, animation: "fadeUp 0.6s 0.36s ease both",
        position: "relative", zIndex: 1
      }}>
        {[["checkCircle","Sin cuenta en la UPME"],["bell","Notificaciones WhatsApp"],["lock","Pago único"],["smartphone","100% en línea"]].map(([ico,txt]) => (
          <span key={txt as string} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 500, cursor: "default" }}>
            <Icon name={ico as string} size={13} color="#34D399"/>{txt}
          </span>
        ))}
      </div>

      {/* Ticker inside hero */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 1 }}>
        <Ticker />
      </div>
    </section>
  );
}

// ── ALIADOS ─────────────────────────────────────────────────────────────────
function Aliados() {
  return (
    <section aria-label="Aliados de CertiVeh" style={{
      background: "var(--white)", borderTop: "1px solid var(--slate-200)",
      borderBottom: "1px solid var(--slate-200)", padding: "40px 24px",
    }}>
      <p style={{
        textAlign: "center", fontSize: 13, fontWeight: 500, color: "var(--slate-400)",
        letterSpacing: "1.5px", marginBottom: 32,
      }}>
        Aliados que confían en CertiVeh
      </p>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 56, flexWrap: "wrap", maxWidth: 900, margin: "0 auto",
      }}>
        {[
          { src: "/aliados-seguros-mundial.png", alt: "Seguros Mundial", maxH: 30, maxW: 150, note: "Compañía Mundial de Seguros S.A. · Vigilado Superintendencia Financiera de Colombia" },
          { src: "/aliados-fonlenovo.png", alt: "FonLenovo - El Fondo inteligente para todos", maxH: 32, maxW: 90, note: "" },
          { src: "/aliados-exotics.png", alt: "ExoticsCo", maxH: 32, maxW: 120, note: "" },
        ].map((a, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: 56, justifyContent: "center" }}>
            <img src={a.src} alt={a.alt} loading="lazy" style={{
              maxHeight: a.maxH, maxWidth: a.maxW, width: "auto", objectFit: "contain",
              filter: "grayscale(100%)", opacity: 0.35, transition: "filter 0.3s, opacity 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.filter = "grayscale(0%)"; e.currentTarget.style.opacity = "0.7"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = "grayscale(100%)"; e.currentTarget.style.opacity = "0.35"; }}
            />
            {a.note && <span style={{ fontSize: 8, color: "var(--slate-400)", textAlign: "center", lineHeight: 1.3, maxWidth: 180 }}>{a.note}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── BENEFICIOS ────────────────────────────────────────────────────────────────
function Beneficios() {
  const cards = [
    { icon: "percent",  tag: "IVA",     title: "Devolución de IVA",        pct: "5%", accentColor: "var(--emerald-600)", iconBg: "rgba(5,150,105,0.1)", bgColor: "var(--emerald-50)", borderColor: "var(--emerald-200)", desc: "Si pagaste un IVA del 5% en la compra, con el certificado UPME la DIAN te devuelve el 100% de ese IVA pagado.", ejemplo: "$120M → te devuelven $6.000.000", norma: "Art. 12, Ley 1715/2014 (mod. art. 9, Ley 2099/2021)" },
    { icon: "fileText", tag: "Renta",   title: "Deducción en renta",     pct: "50%", accentColor: "var(--teal-500)", iconBg: "rgba(20,184,166,0.1)", bgColor: "var(--teal-50)", borderColor: "var(--teal-200)", desc: "Personas naturales y jurídicas pueden deducir hasta el 50% del valor del vehículo en su declaración de renta.", ejemplo: "$150M → deduces $75.000.000", norma: "Art. 11, Ley 1715/2014 (mod. art. 8, Ley 2099/2021)" },
    { icon: "zap",      tag: "Depreciación", title: "Depreciación acelerada",   pct: "3 años",  accentColor: "var(--teal-500)", iconBg: "rgba(20,184,166,0.1)", bgColor: "var(--teal-50)", borderColor: "var(--teal-200)", desc: "Independientes y empresas deprecian el vehículo en 3 años en lugar de 5, reduciendo la base gravable más rápido.", ejemplo: "Solo independientes y empresas", norma: "Art. 14, Ley 1715/2014 (mod. art. 11, Ley 2099/2021) y Decreto 895/2022" },
  ];
  return (
    <section id="beneficios" aria-label="Beneficios tributarios" style={{ background: "var(--white)" }}>
      <div className="section">
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--slate-900)", lineHeight: 1.25, marginBottom: 16 }}>
            Tres beneficios tributarios. <br/>
            <span style={{ background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Una sola gestión.</span>
          </h2>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "var(--slate-600)", lineHeight: 1.6, maxWidth: 600, margin: "0 auto" }}>
            El Estado colombiano creó estos incentivos para promover la movilidad eléctrica e híbrida. La mayoría de propietarios nunca los reclama, por la complejidad del proceso.
          </p>
        </div>

        <div className="grid-3-cols" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {cards.map((c, i) => (
            <div key={i} className="card benefit-card" style={{ padding: 32, position: "relative", overflow: "hidden", background: "var(--white)", borderColor: "var(--slate-200)", borderLeft: `4px solid ${c.accentColor}`, transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ position: "absolute", top: 12, right: 16, fontSize: 80, fontWeight: 700, color: "rgba(0,0,0,0.04)", lineHeight: 1, pointerEvents: "none" }}>{c.pct}</div>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: c.iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon name={c.icon} size={22} color={c.accentColor}/>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: "var(--slate-900)", letterSpacing: "-0.01em", marginBottom: 4, lineHeight: 1.4 }}>{c.title}</h3>
              <div style={{ fontSize: 40, fontWeight: 700, color: c.accentColor, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 14 }}>{c.pct}</div>
              <p style={{ fontSize: 14, color: "var(--slate-600)", lineHeight: 1.5, marginBottom: 12 }}>{c.desc}</p>
              <div style={{ fontSize: 11, color: "var(--slate-400)", lineHeight: 1.4, marginBottom: 16 }}>{c.norma}</div>
              <div style={{ borderTop: "1px solid var(--slate-200)", paddingTop: 16 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 12, background: "var(--slate-50)", border: "1px solid var(--slate-200)", fontSize: 12, fontWeight: 600, color: c.accentColor }}>
                  <Icon name="checkCircle" size={12} color={c.accentColor}/>{c.ejemplo}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SERVICIOS ────────────────────────────────────────────────────────────────
function Servicios() {
  const portalUrl = usePortalUrl();
  const servicios = [
    {
      icon: "shield",
      tag: "Servicio 1",
      title: "Certificado UPME",
      desc: "Gestionamos todo el trámite por ti: creamos tu cuenta, llenamos formularios y radicamos tu solicitud. Tú solo subes tus documentos.",
      price: "$599.990",
      priceNote: "+ IVA + costo trámite UPME",
      features: ["Radicación automática ante la UPME", "Radicación aun si tu modelo no está en el listado", "Respuesta a requerimientos UPME", "Certificado + guía técnica para tu contador", "Desbloquea los 3 beneficios tributarios"],
      accentColor: "var(--emerald-600)",
      iconBg: "rgba(5,150,105,0.1)",
    },
    {
      icon: "receipt",
      tag: "Servicio 2",
      title: "Devolución de IVA",
      desc: "Acompañamiento integral para recuperar el IVA ante la DIAN (Concepto DIAN 673/2026). Preparamos todo el expediente y te indicamos exactamente cómo y dónde radicar.",
      price: "Desde $499.990",
      priceNote: "+ IVA · contratando junto al certificado UPME",
      features: ["Preparación integral del expediente", "Determinación de la vía de radicación correcta", "Generación documental completa", "Instructivo paso a paso para la radicación"],
      note: "El instructivo te guía exactamente cómo y dónde radicar ante la DIAN (cita virtual en Bogotá, Medellín, Cali y Bucaramanga; buzón electrónico en otras ciudades).",
      accentColor: "var(--teal-500)",
      iconBg: "rgba(20,184,166,0.1)",
    },
  ] as Array<{ icon: string; tag: string; title: string; desc: string; price: string; priceNote: string; features: string[]; note?: string; accentColor: string; iconBg: string }>;
  return (
    <section id="servicios" aria-label="Servicios CertiVeh" style={{ background: "var(--slate-50)" }}>
      <div className="section">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--slate-900)", lineHeight: 1.25, marginBottom: 14 }}>
            Dos servicios. <br/>
            <span style={{ background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Cero burocracia.</span>
          </h2>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "var(--slate-600)", lineHeight: 1.6, maxWidth: 600, margin: "0 auto" }}>
            CertiVeh gestiona el certificado UPME y te acompaña paso a paso para recuperar tu IVA ante la DIAN.
          </p>
        </div>

        <div className="grid-2-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, maxWidth: 1140, margin: "0 auto" }}>
          {servicios.map((s, i) => (
            <div key={i} className="card" style={{
              padding: 36, position: "relative", overflow: "hidden",
              borderLeft: `4px solid ${s.accentColor}`,
              display: "flex", flexDirection: "column",
            }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={s.icon} size={22} color={s.accentColor}/>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.02em", color: s.accentColor }}>{s.tag}</span>
              </div>

              <h3 style={{ fontSize: 22, fontWeight: 700, color: "var(--slate-900)", letterSpacing: "-0.01em", marginBottom: 10, lineHeight: 1.3 }}>{s.title}</h3>
              <p style={{ fontSize: 15, color: "var(--slate-600)", lineHeight: 1.6, marginBottom: 20, flex: 1 }}>{s.desc}</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {s.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--slate-600)", lineHeight: 1.5 }}>
                    <Icon name="checkCircle" size={14} color={s.accentColor}/>{f}
                  </div>
                ))}
              </div>

              {s.note && (
                <div style={{ background: "var(--slate-50)", border: "1px solid var(--slate-200)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "var(--slate-600)", lineHeight: 1.5 }}>
                  <strong style={{ color: "var(--slate-700)", fontWeight: 600 }}>¿Cómo se radica?</strong>{" "}{s.note}
                </div>
              )}

              <div style={{ borderTop: "1px solid var(--slate-200)", paddingTop: 20, marginTop: "auto" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: s.accentColor, letterSpacing: "-0.02em", lineHeight: 1 }}>{s.price}</div>
                <div style={{ fontSize: 12, color: "var(--slate-400)", marginTop: 4 }}>{s.priceNote}</div>
              </div>

              <a href={portalUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", marginTop: 20 }}>
                <button className="btn-primary btn-primary-lg" style={{ width: "100%", justifyContent: "center", background: "linear-gradient(135deg, #059669, #14B8A6)", boxShadow: "0 4px 24px rgba(5,150,105,0.4)" }}>
                  {i === 0 ? "Empezar mi trámite" : "Solicitar devolución de IVA"} <Icon name="arrowRight" size={18} color="white"/>
                </button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── ASÍ PROTEGEMOS TU BENEFICIO ───────────────────────────────────────────────
function PorQueNoSolo() {
  const items = [
    {
      num: "01",
      title: "Tu vehículo no aparece en el listado",
      problema: "Si la línea o modelo no está en el listado de la UPME, la solicitud requiere documentación técnica adicional para poder radicarse.",
      solucion: "Gestionamos la documentación técnica para radicar aunque tu modelo no aparezca en el listado.",
    },
    {
      num: "02",
      title: "Referencia equivocada en el certificado",
      problema: "Una diferencia mínima en la denominación puede invalidar el certificado. Versiones que parecen iguales se registran como referencias distintas.",
      solucion: "Verificamos la referencia exacta y reunimos la documentación adicional si no aparece en la base.",
    },
    {
      num: "03",
      title: "El valor debe registrarse antes de impuestos",
      problema: "El valor en el certificado debe ser antes de impuestos y descuentos. Registrar el total de la factura puede impedir la aplicación de los beneficios.",
      solucion: "Validamos todos los valores antes de radicar para que el certificado sea coherente con la DIAN.",
    },
    {
      num: "04",
      title: "Leasing, prenda o copropiedad",
      problema: "La UPME no tiene un proceso estándar documentado para estos escenarios. Sin experiencia previa, los errores son difíciles de corregir una vez radicados.",
      solucion: "Gestionamos estos escenarios con el proceso correcto para que el certificado quede bien emitido.",
    },
    {
      num: "05",
      title: "Certificado correcto hoy, auditoría después",
      problema: "El certificado recoge lo que registras sin verificar que los valores y referencias sean correctos. Un error es difícil de corregir una vez emitido.",
      solucion: "Revisamos que el certificado quede perfectamente emitido para que resista una eventual auditoría.",
    },
  ];

  const colStyle = { display: "grid", gridTemplateColumns: "3fr 2fr" };

  return (
    <section aria-label="Así protegemos tu beneficio" style={{ background: "var(--slate-50)", borderTop: "1px solid var(--slate-200)" }}>
      <div className="section">

        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{
            fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 700,
            letterSpacing: "-0.02em", color: "var(--slate-900)",
            lineHeight: 1.25, marginBottom: 14,
          }}>
            Así protegemos{" "}
            <span style={{ background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              tu beneficio.
            </span>
          </h2>
          <p style={{
            fontSize: "clamp(15px, 2vw, 18px)", color: "var(--slate-600)",
            lineHeight: 1.6, maxWidth: 480, margin: "0 auto",
          }}>
            Estos son los errores que hacen que la UPME rechace solicitudes. Los prevenimos antes de radicar.
          </p>
        </div>

        <div style={{ border: "1px solid var(--slate-200)", borderRadius: 16, overflow: "hidden" }}>

          {/* Header row */}
          <div className="pqns-row" style={{ ...colStyle, borderBottom: "1px solid var(--slate-200)" }}>
            <div style={{ padding: "12px 32px" }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--slate-400)", textTransform: "uppercase" }}>
                Problemas comunes
              </span>
            </div>
            <div style={{ padding: "12px 32px", background: "var(--emerald-50)" }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--emerald-600)", textTransform: "uppercase" }}>
                Cómo lo resuelve CertiVeh
              </span>
            </div>
          </div>

          {/* Data rows */}
          {items.map((item) => (
            <div key={item.num} className="pqns-row" style={{
              ...colStyle,
              background: "var(--white)",
              borderTop: "1px solid var(--slate-200)",
            }}>
              <div style={{ padding: "28px 32px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: "var(--emerald-50)", color: "var(--emerald-600)",
                  fontSize: 13, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {item.num}
                </div>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 600, color: "var(--slate-900)", lineHeight: 1.4, marginBottom: 6, letterSpacing: "-0.01em" }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: 14, color: "var(--slate-500)", lineHeight: 1.6, margin: 0 }}>
                    {item.problema}
                  </p>
                </div>
              </div>
              <div style={{
                padding: "28px 32px",
                background: "var(--emerald-50)",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{ flexShrink: 0, marginTop: 1 }}>
                  <Icon name="checkCircle" size={16} color="var(--emerald-600)" />
                </div>
                <p style={{ fontSize: 14, color: "var(--slate-700)", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                  {item.solucion}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

// ── CÓMO FUNCIONA ─────────────────────────────────────────────────────────────
function ComoFunciona() {
  const [active, setActive] = useState(0);
  const steps = [
    { num: "01", icon: "upload",      title: "Sube tus documentos",    subtitle: "Menos de 3 minutos",       desc: "Solo necesitas tu cédula o pasaporte, tarjeta de propiedad, factura de compra y RUT. La IA extrae los datos automáticamente.", detail: "Sin formularios manuales. Sin errores de digitación." },
    { num: "02", icon: "checkCircle", title: "Revisa y confirma",      subtitle: "30 segundos",              desc: "Verificas que los datos extraídos sean correctos. Puedes editar cualquier campo antes de continuar. Una vez confirmas, nos pones a trabajar.", detail: "Extracción automática de información con IA." },
    { num: "03", icon: "lock",        title: "Pago único",             subtitle: "Una sola vez",             desc: "Pagas nuestra tarifa de servicio una sola vez. Sin suscripciones, sin costos ocultos. El pago confirma tu caso y activa el proceso.", detail: "Paga con tu método favorito o a cuotas sin interés." },
    { num: "04", icon: "zap",         title: "Nosotros hacemos todo",  subtitle: "Tú no haces nada más",    desc: "Nuestro agente automatizado crea tu cuenta en la UPME, llena todos los formularios con tus datos y radica la solicitud de inmediato.", detail: "Sin que tengas que tocar ningún portal gubernamental." },
    { num: "05", icon: "award",       title: "Recibe tu certificado",  subtitle: "Lo descargas desde tu panel", desc: "Te notificamos por WhatsApp y email en cada etapa del proceso. Cuando el certificado está listo, lo descargas desde tu dashboard junto con la guía técnica para tu contador.", detail: "Seguimiento en tiempo real por WhatsApp y correo." },
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [steps.length]);
  
  return (
    <section id="como-funciona" aria-label="Cómo funciona" style={{ background: "var(--slate-900)" }}>
      <div className="section">
        <div className="grid-2-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", lineHeight: 1.25, marginBottom: 12 }}>
              Así de simple <br/><span style={{ color: "rgba(255,255,255,0.4)" }}>es el trámite.</span>
            </h2>
            <p style={{ fontSize: "clamp(14px, 1.8vw, 16px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 32 }}>
              Del certificado UPME a la devolución de tu IVA. Desde tu teléfono y sin portales gubernamentales.
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

        {/* Portal photo */}
        <div style={{
          marginTop: 80, maxWidth: 800, marginLeft: "auto", marginRight: "auto",
          borderRadius: 16, overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}>
          <img src={typeof imgPortalUsuario === 'string' ? imgPortalUsuario : imgPortalUsuario.src}
            alt="Usuario gestionando su certificado UPME desde el portal de CertiVeh"
            style={{ width: "100%", display: "block" }}
          />
        </div>
      </div>
    </section>
  );
}

// ── CALCULADORA ───────────────────────────────────────────────────────────────
function Calculadora() {
  const portalUrl = usePortalUrl();
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

    // Trámite UPME — Resolución UPME No. 135 de 2025
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

    // Honorarios CertiVeh — Certificado UPME
    const honorariosBase = 599_990;
    const ivaServicio = Math.round(honorariosBase * 0.19);

    // Honorarios devolución IVA (bundled pricing)
    let honorariosIvaRefund = 0;
    let ivaIvaRefund = 0;
    if (conIva) {
      honorariosIvaRefund = v <= 200_000_000 ? 499_990 : Math.round(v * 0.0025);
      ivaIvaRefund = Math.round(honorariosIvaRefund * 0.19);
    }

    const costoTotal = costoUPME + honorariosBase + ivaServicio + honorariosIvaRefund + ivaIvaRefund;

    setCalc({ iva, renta, total, costoUPME, honorariosBase, ivaServicio, honorariosIvaRefund, ivaIvaRefund, costoTotal, neto: total - costoTotal });
  }, [valor, tipo, perfil, conIva]);

  const bars = [
    { label: "Devolución IVA",    value: calc.iva,   color: "var(--emerald-600)", pct: calc.iva   / calc.total },
    { label: "Deducción renta", value: calc.renta, color: "var(--teal-500)",    pct: calc.renta / calc.total },
  ];
  return (
    <section id="calculadora" aria-label="Calculadora de beneficios" style={{ background: "var(--white)" }}>
      <div className="section">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--slate-900)", lineHeight: 1.25, marginBottom: 14 }}>¿Cuánto puedes recuperar?</h2>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "var(--slate-600)", lineHeight: 1.6 }}>Mueve el slider y ve en tiempo real cuánto vale tu beneficio tributario.</p>
        </div>

        <div className="card grid-calc" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden", padding: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)" }}>
          {/* Controls */}
          <div className="card-calc-controls" style={{ padding: 48, borderRight: "1px solid var(--slate-200)" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", color: "var(--slate-500)", marginBottom: 10 }}>Tipo de vehículo</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[{ value: "electrico", label: "Eléctrico puro", icon: "zap" },{ value: "hibrido", label: "Híbrido (No MHEV)", icon: "battery" }].map(opt => (
                  <button key={opt.value} onClick={() => setTipo(opt.value)} style={{ padding: "12px 12px", borderRadius: 12, border: tipo === opt.value ? "1.5px solid var(--emerald-600)" : "1.5px solid var(--slate-200)", background: tipo === opt.value ? "var(--emerald-600)" : "var(--white)", color: tipo === opt.value ? "white" : "var(--slate-600)", fontSize: "clamp(12px, 1.5vw, 14px)", fontWeight: tipo === opt.value ? 600 : 500, cursor: "pointer", fontFamily: "var(--ff)", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6, justifyContent: "center", boxShadow: tipo === opt.value ? "0 2px 8px rgba(5,150,105,0.25)" : "none", lineHeight: 1.3 }}>
                    <Icon name={opt.icon} size={16} color={tipo === opt.value ? "white" : "var(--slate-400)"} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", color: "var(--slate-500)", marginBottom: 10 }}>Perfil tributario</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[{ value: "natural", label: "Persona natural", icon: "user" },{ value: "empresa", label: "Independiente/Empresa", icon: "building" }].map(opt => (
                  <button key={opt.value} onClick={() => setPerfil(opt.value)} style={{ padding: "12px 12px", borderRadius: 12, border: perfil === opt.value ? "1.5px solid var(--emerald-600)" : "1.5px solid var(--slate-200)", background: perfil === opt.value ? "var(--emerald-600)" : "var(--white)", color: perfil === opt.value ? "white" : "var(--slate-600)", fontSize: "clamp(12px, 1.5vw, 14px)", fontWeight: perfil === opt.value ? 600 : 500, cursor: "pointer", fontFamily: "var(--ff)", transition: "all 0.15s", textAlign: "center", lineHeight: 1.3, display: "flex", alignItems: "center", gap: 6, justifyContent: "center", boxShadow: perfil === opt.value ? "0 2px 8px rgba(5,150,105,0.25)" : "none" }}>
                    <Icon name={opt.icon} size={16} color={perfil === opt.value ? "white" : "var(--slate-400)"} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", color: "var(--slate-500)" }}>Valor del vehículo</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "var(--emerald-600)", letterSpacing: "-0.02em" }}>${valor}M</div>
              </div>
              <input type="range" min="40" max="600" step="5" value={valor} onChange={e => setValor(Number(e.target.value))} style={{ width: "100%", appearance: "none", height: 4, borderRadius: 4, outline: "none", cursor: "pointer", background: `linear-gradient(to right, #059669 0%, #14B8A6 ${((valor-40)/560)*100}%, #E2E8F0 ${((valor-40)/560)*100}%, #E2E8F0 100%)` }}/>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--slate-400)", fontWeight: 500, marginTop: 6 }}>
                <span>$40M</span><span>$600M</span>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                padding: "14px 16px", borderRadius: 12,
                background: conIva ? "var(--emerald-50)" : "var(--slate-50)",
                border: conIva ? "1.5px solid var(--emerald-500)" : "1.5px solid var(--slate-200)",
                transition: "all 0.15s",
              }}>
                <div style={{
                  width: 40, height: 22, borderRadius: 11, position: "relative",
                  background: conIva ? "var(--emerald-600)" : "var(--slate-300)",
                  transition: "background 0.2s", flexShrink: 0,
                }}
                  onClick={() => setConIva(!conIva)}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", background: "white",
                    position: "absolute", top: 2, left: conIva ? 20 : 2,
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: conIva ? "var(--emerald-700)" : "var(--slate-600)", lineHeight: 1.4 }}>
                    Gestión de devolución de IVA
                  </div>
                </div>
              </label>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {bars.map((b, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 14, color: "var(--slate-600)", fontWeight: 500, lineHeight: 1.5 }}>{b.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: b.color, lineHeight: 1.5 }}>{b.value ? fmt(b.value) : "-"}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "var(--slate-100)", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 3, background: b.color, width: `${(b.pct||0)*100}%`, transition: "width 0.4s ease" }}/>
                  </div>
                </div>
              ))}
              {perfil === "empresa" && (
                <div style={{ padding: "10px 14px", background: "var(--emerald-50)", border: "1px solid var(--emerald-200)", borderRadius: 12, fontSize: 13, color: "var(--emerald-700)", lineHeight: 1.5 }}>
                  Depreciación acelerada a 3 años, reduce tu base gravable más rápido y paga menos impuestos hoy.
                </div>
              )}
            </div>

            {calc.costoUPME != null && (
              <div style={{ marginTop: 20, padding: "16px 18px", background: "var(--slate-50)", border: "1px solid var(--slate-200)", borderRadius: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <Icon name="fileText" size={13} color="var(--slate-500)" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--slate-500)", letterSpacing: "0.04em" }}>Costo del servicio</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "var(--slate-600)", lineHeight: 1.5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Trámite ante UPME</span>
                    <span style={{ fontWeight: 600, color: "var(--slate-700)" }}>{fmt(calc.costoUPME)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Servicio de tramitación</span>
                    <span style={{ fontWeight: 600, color: "var(--slate-700)" }}>{fmt(calc.honorariosBase)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "var(--slate-400)" }}>IVA (19% sobre tramitación)</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--slate-400)" }}>{fmt(calc.ivaServicio)}</span>
                  </div>
                  {conIva && (
                    <>
                      <div style={{ borderTop: "1px solid var(--slate-200)", paddingTop: 6, display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--teal-600)" }}>Gestión devolución IVA</span>
                        <span style={{ fontWeight: 600, color: "var(--teal-600)" }}>{fmt(calc.honorariosIvaRefund)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, color: "var(--slate-400)" }}>IVA (19% sobre gestión)</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--slate-400)" }}>{fmt(calc.ivaIvaRefund)}</span>
                      </div>
                    </>
                  )}
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
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#34D399", marginBottom: 12 }}>Beneficio total estimado</div>
            <div style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, color: "white", marginBottom: 6, transition: "all 0.3s" }}>
              {calc.total ? fmt(calc.total) : "-"}
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 28, lineHeight: 1.5 }}>en incentivos tributarios</div>

            {conIva && calc.iva && (
              <div style={{ width: "100%", padding: "16px 24px", marginBottom: 16, background: "rgba(20,184,166,0.12)", border: "1px solid rgba(20,184,166,0.25)", borderRadius: 12, textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#5EEAD4", marginBottom: 6 }}>IVA a recuperar ante la DIAN</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#5EEAD4", letterSpacing: "-0.02em" }}>{fmt(calc.iva)}</div>
              </div>
            )}

            <div style={{ width: "100%", padding: "20px 24px", marginBottom: 24, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#34D399", marginBottom: 8 }}>Beneficio neto (menos costo del servicio)</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "white", letterSpacing: "-0.02em" }}>{calc.neto ? fmt(calc.neto) : "-"}</div>
            </div>

            {calc.costoTotal && calc.total && (
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 28 }}>
                Por cada <span style={{ fontWeight: 700, color: "white" }}>$1 invertido</span> en CertiVeh, recibes{" "}
                <span style={{ fontWeight: 700, color: "#34D399" }}>${(Math.round(calc.total / calc.costoTotal * 10) / 10).toLocaleString("es-CO")}</span> en beneficios.
              </div>
            )}

            <a href={portalUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", width: "100%" }}>
              <button className="btn-primary btn-primary-lg" style={{ width: "100%", justifyContent: "center", background: "linear-gradient(135deg, #059669, #14B8A6)", boxShadow: "0 4px 24px rgba(5,150,105,0.4)" }}>
                Empezar mi trámite ahora <Icon name="arrowRight" size={18} color="white"/>
              </button>
            </a>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 12 }}>Sin riesgo · Si la UPME rechaza, revisamos tu caso</div>
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
    { icon: "calendar",    title: "Radicación inmediata",        desc: "La UPME recibe solicitudes del 1 de febrero al 15 de diciembre, sin ciclos. Tu trámite se radica de inmediato en esta ventana." },
    { icon: "shield",      title: "Sin portal gubernamental",     desc: "Tú nunca tienes que entrar a la UPME. Nosotros creamos la cuenta, gestionamos el proceso y resolvemos cualquier imprevisto." },
    { icon: "checkCircle", title: "Pago único, sin letra pequeña",desc: "Certificado UPME $599.990 + IVA. Devolución de IVA desde $499.990 + IVA. Sin suscripciones ni costos ocultos." },
  ];
  return (
    <section id="confianza" aria-label="Por qué CertiVeh" style={{ background: "var(--slate-900)" }}>
      <div className="section">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", lineHeight: 1.25, marginBottom: 16 }}>
            Hecho para que no <br/><span style={{ color: "rgba(255,255,255,0.4)" }}>tengas que preocuparte.</span>
          </h2>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: 600, margin: "0 auto" }}>
            Automatización, seguridad y seguimiento en tiempo real. Tú subes tus documentos, nosotros hacemos el resto.
          </p>
        </div>
        <div className="grid-3-cols" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {puntos.map((p, i) => (
            <div key={i} className="card trust-card" style={{ padding: 28, transition: "transform 0.2s, box-shadow 0.2s", position: "relative", overflow: "hidden", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, background: "linear-gradient(90deg, #059669 0%, #14B8A6 100%)" }}></div>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <Icon name={p.icon} size={20} color="#34D399"/>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "white", marginBottom: 8, letterSpacing: "-0.01em", lineHeight: 1.45 }}>{p.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
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
  return (
    <section id="testimonios" aria-label="Testimonios" style={{ background: "var(--white)" }}>
      <div className="section">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--slate-900)", lineHeight: 1.25 }}>
            Lo que dicen nuestros usuarios
          </h2>
        </div>
        <div className="grid-3-cols" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {testimonios.map((t, i) => (
            <div key={i} className="card" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 16, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -10, left: 8, fontSize: 80, fontWeight: 700, color: "rgba(0,0,0,0.04)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>&ldquo;</div>
              <div style={{ display: "flex", gap: 2, position: "relative" }}>
                {[...Array(5)].map((_, j) => (
                  <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <p style={{ fontSize: 15, color: "var(--slate-600)", lineHeight: 1.65, flex: 1, position: "relative", fontStyle: "italic" }}>"{t.texto}"</p>
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--slate-900)" }}>{t.nombre}</div>
                <div style={{ fontSize: 13, color: "var(--slate-400)" }}>{t.ciudad} · {t.vehiculo}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PRENSA ──────────────────────────────────────────────────────────────────
function Prensa() {
  const medios = [
    { name: "Revista Semana", logo: "/prensa-semana.png", url: "https://www.semana.com/vehiculos/articulo/buenas-noticias-para-conductores-de-carros-electricos-en-colombia-podrian-recuperar-millones-de-pesos-con-este-beneficio/202619/", maxH: 26, maxW: 130 },
    { name: "Valora Analitik", logo: "/prensa-valora.png", url: "https://www.valoraanalitik.com/compradores-de-vehiculos-electricos-podrian-recuperar-millones-de-pesos/", maxH: 28, maxW: 95 },
    { name: "Portafolio", logo: "/prensa-portafolio.png", url: "https://www.portafolio.co/negocios/vehiculo/una-empresa-colombiana-lleva-a-whatsapp-el-tramite-para-acceder-a-beneficios-tributarios-de-vehiculos-electricos-497545", maxH: 26, maxW: 130 },
    { name: "Infobae", logo: "/prensa-infobae.png", url: "https://www.infobae.com/colombia/2026/07/07/duenos-de-carros-electricos-podrian-recuperar-millones-por-iva-asi-funciona-el-beneficio/", maxH: 24, maxW: 110 },
    { name: "Revista C-Level", logo: "/prensa-clevel.png", url: "https://revistaclevel.com/empresa-colombiana-tramito-mas-de-17000-millones-en-beneficios-tributarios-para-compradores-de", maxH: 26, maxW: 105 },
    { name: "Ultima Hora", logo: "/prensa-ultimahora.png", url: "https://www.instagram.com/p/DaqeIT9D-ai/", maxH: 22, maxW: 130 },
    { name: "Yahoo Finance", logo: "/prensa-yahoo.png", url: "https://es-us.noticias.yahoo.com/compradores-veh%C3%ADculos-el%C3%A9ctricos-reclaman-beneficio-160000527.html", maxH: 28, maxW: 105 },
  ];
  const track = [...medios, ...medios];
  return (
    <section aria-label="CertiVeh en los medios" style={{
      background: "var(--white)", borderTop: "1px solid var(--slate-200)",
      borderBottom: "1px solid var(--slate-200)", padding: "40px 0",
    }}>
      <p style={{
        textAlign: "center", fontSize: 13, fontWeight: 500, color: "var(--slate-400)",
        letterSpacing: "1.5px", marginBottom: 32,
      }}>
        CertiVeh en los medios
      </p>
      <div style={{
        overflow: "hidden", position: "relative",
        maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}>
        <div style={{
          display: "flex", alignItems: "center",
          animation: "ticker 18s linear infinite",
          width: "max-content",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.animationPlayState = "paused"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.animationPlayState = "running"; }}
        >
          {track.map((m, i) => (
            <a key={i} href={m.url} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 56, padding: "0 40px", textDecoration: "none", flexShrink: 0 }}
            >
              <img src={m.logo} alt={m.name} loading="lazy" style={{
                maxHeight: m.maxH, maxWidth: m.maxW, width: "auto", objectFit: "contain",
                filter: "grayscale(100%)", opacity: 0.35, transition: "opacity 0.3s, filter 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.filter = "grayscale(0%)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "0.35"; e.currentTarget.style.filter = "grayscale(100%)"; }}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── WIN WIN ──────────────────────────────────────────────────────────────────
function WinWin() {
  const portalUrl = usePortalUrl();
  const steps = [
    { num: "01", icon: "award", title: "Crea tu cuenta", desc: "Regístrate en portal.certiveh.co, sube tus documentos y completa tu trámite para desbloquear tu código de referido." },
    { num: "02", icon: "share2", title: "Comparte tu código", desc: "Envíalo a amigos que tengan carro eléctrico o híbrido. Ellos reciben $60.000 de descuento en su trámite." },
    { num: "03", icon: "dollarSign", title: "Gana $75.000 por cada uno", desc: "Cada vez que un amigo solicite su trámite, tú ganas $75.000 que puedes acumular o retirar cuando quieras." },
  ];
  return (
    <section id="winwin" aria-label="Programa de referidos CertiVeh Win Win" style={{ background: "var(--slate-50)" }}>
      <div className="section">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--slate-900)", lineHeight: 1.25, marginBottom: 12 }}>
            CertiVeh <span style={{ background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Win Win</span>
          </h2>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "var(--slate-600)", lineHeight: 1.6 }}>Refiere amigos y gana dinero</p>
        </div>

        <div className="grid-3-cols" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
          {steps.map((s, i) => (
            <div key={i} className="card" style={{ padding: 28, position: "relative", overflow: "hidden", borderLeft: "4px solid var(--emerald-500)", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ position: "absolute", top: 16, right: 20, fontSize: 48, fontWeight: 700, color: "rgba(0,0,0,0.04)", lineHeight: 1, pointerEvents: "none" }}>{s.num}</div>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--emerald-50)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon name={s.icon} size={22} color="var(--emerald-600)" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--slate-900)", marginBottom: 8, letterSpacing: "-0.01em", lineHeight: 1.45 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: "var(--slate-600)", lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "var(--white)", border: "1px solid var(--slate-200)", borderRadius: 16, padding: "20px 28px", textAlign: "center", marginBottom: 32 }}>
          <p style={{ fontSize: 15, color: "var(--slate-600)", fontWeight: 500, lineHeight: 1.6, margin: 0 }}>
            Sin límite de referidos. Sin vencimiento. Retira tu saldo cuando quieras.
          </p>
        </div>

        <div style={{ textAlign: "center" }}>
          <a href={portalUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <button className="btn-primary btn-primary-lg" style={{ background: "linear-gradient(135deg, #059669 0%, #14B8A6 100%)", boxShadow: "0 4px 24px rgba(5,150,105,0.4)", borderRadius: 12 }}>
              Empezar mi trámite ahora <Icon name="arrowRight" size={18} color="white" />
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}

// ── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    { q: "¿Qué vehículos califican?",               a: "Vehículos eléctricos puros e híbridos nuevos registrados en Colombia. No aplica para vehículos usados ni para híbridos ligeros (MHEV). El vehículo debe estar a nombre del solicitante en el RUNT." },
    { q: "¿Cuándo puedo radicar mi solicitud?",     a: "Solo tienes que entrar a portal.certiveh.co, crear tu cuenta y cargar tu solicitud. Gracias a la Resolución UPME 400 de 2026, la ventana de radicación ahora es continua (del 1 de febrero al 15 de diciembre). Tu solicitud se radica de inmediato, sin esperar ciclos." },
    { q: "¿Qué documentos necesito?",               a: "Si eres persona natural: cédula de ciudadanía (frente y reverso), tarjeta de propiedad del vehículo (frente y reverso) y factura de compra. Si eres persona jurídica: certificado de cámara de comercio, cédula del representante legal (frente y reverso), tarjeta de propiedad del vehículo (frente y reverso) y factura de compra. Todo se sube en PDF, JPG o PNG desde tu teléfono." },
    { q: "¿Cuánto toma el proceso completo?",       a: "Desde que subes tus documentos hasta la radicación: menos de 10 minutos de tu parte. Desde la radicación hasta el certificado UPME: entre 4 y 8 semanas dependiendo de la UPME." },
    { q: "¿Qué pasa si la UPME rechaza mi solicitud?", a: "Si el rechazo se debe a un error de nuestra parte, gestionamos la corrección y volvemos a radicar sin costo adicional. Si se debe a información incorrecta proporcionada por el usuario, te acompañamos en el proceso de corrección y solo se cobra nuevamente el costo de la radicación ante la UPME." },
    { q: "¿Funciona para empresas e independientes?", a: "Sí. El servicio está disponible para personas naturales, independientes y empresas. Además, las empresas e independientes tienen un beneficio adicional: depreciación acelerada del vehículo a 3 años, lo que reduce la base gravable más rápido." },
    { q: "¿Cuánto tiempo tengo para reclamar mis beneficios?", a: "Para la devolución de IVA, tienes hasta 5 años desde la fecha de la factura de compra (artículo 2536 del Código Civil, Concepto DIAN 673 de 2026). Para la deducción en renta, tienes un periodo máximo de 15 años contados a partir del año gravable siguiente a la entrada en operación del vehículo (artículo 11, Ley 1715 de 2014). El certificado UPME puede obtenerse después de la compra." },
    { q: "¿CertiVeh gestiona la devolución del IVA?", a: "Sí. Una vez tienes tu certificado UPME, CertiVeh revisa la documentación y prepara el expediente, determina la vía de radicación correcta (cita virtual en Bogotá, Medellín, Cali y Bucaramanga; buzón electrónico en otras ciudades), genera todos los documentos necesarios y te entrega un instructivo paso a paso para la radicación ante la DIAN. Todo el proceso de preparación es 100% en línea desde tu dashboard." },
    { q: "¿Puedo hacer el trámite a nombre de otra persona o empresa?", a: "Sí. Puedes registrar múltiples titulares en tu cuenta, tanto personas naturales como jurídicas. Por ejemplo, tu vehículo personal y el de tu empresa. Cada trámite se asocia al propietario real del vehículo, que es quien debe figurar en la tarjeta de propiedad." },
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
  const portalUrl = usePortalUrl();
  return (
    <section id="cta-final" aria-label="Comenzar" className="cta-section" style={{ background: "var(--slate-900)", padding: "96px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, color: "rgba(0,0,0,0.4)" }}>
        <AnimatedGridPattern
          numSquares={50}
          maxOpacity={0.6}
          duration={4}
          repeatDelay={0.5}
        />
      </div>
      <div style={{ position: "relative", pointerEvents: "none" }}>
        <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", lineHeight: 1.2, marginBottom: 16, maxWidth: 680, margin: "0 auto 16px" }}>
          Tus beneficios tributarios <br/><span style={{ background: "linear-gradient(135deg, #34D399 0%, #14B8A6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>te están esperando.</span>
        </h2>
        <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, maxWidth: 600, margin: "0 auto 36px" }}>
          Certificado UPME y devolución de IVA. Miles de propietarios de vehículos eléctricos e híbridos en Colombia no han reclamado lo que les corresponde.
        </p>
        <a href={portalUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", pointerEvents: "auto" }}>
          <button className="btn-primary btn-primary-lg" style={{ background: "linear-gradient(135deg, #059669 0%, #14B8A6 100%)", color: "white", boxShadow: "0 4px 24px rgba(5,150,105,0.4)" }}>
            Empezar mi trámite ahora <Icon name="arrowRight" size={18} color="white"/>
          </button>
        </a>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
          {["Pago único · Sin suscripciones","100% en línea","Notificaciones por WhatsApp"].map(t => (
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
    <footer aria-label="Pie de página" style={{ background: "var(--slate-900)", color: "var(--slate-400)", padding: "48px 48px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
          <div>
            <CertiVehLogo variant="light" compact/>
            <p style={{ fontSize: 14, color: "var(--slate-500)", marginTop: 10, maxWidth: 260, lineHeight: 1.5 }}>
              Certificado UPME y gestión de devolución de IVA para vehículos eléctricos e híbridos en Colombia.
            </p>
          </div>
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            {[
              { label: "Plataforma", links: [{ text: "Beneficios", href: "#beneficios" }, { text: "Servicios", href: "#servicios" }, { text: "Cómo funciona", href: "#como-funciona" }, { text: "Calculadora", href: "#calculadora" }] },
              { label: "Recursos", links: [{ text: "Vehículos", href: "/vehiculos/" }, { text: "Blog", href: "/blog" }, { text: "API", href: "/api-docs" }] },
              { label: "Empresa", links: [{ text: "Quiénes somos", href: "/nosotros/" }, { text: "Programa de Aliados", href: "/aliados" }, { text: "Empresas (GEE/FNCE)", href: "/empresas" }] },
              { label: "Legal", links: [{ text: "Términos y Condiciones", href: "/terminos-y-condiciones" }, { text: "Política de Privacidad", href: "/politica-de-privacidad" }] }
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
  );
}

// ── URGENCY MODAL ───────────────────────────────────────────���─────────────────
function UrgencyModal({ onClose }: { onClose: () => void }) {
  const portalUrl = usePortalUrl();
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
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: 'rgba(239,68,68,0.12)',
              backdropFilter: 'blur(8px)',
              color: 'rgba(252,165,165,0.9)',
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 9999,
              padding: "6px 14px",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.08em'
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F87171', display: 'inline-block' }} />
              ADVERTENCIA DE PLAZO
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.3,
            marginBottom: 8,
            letterSpacing: '-0.01em'
          }}>
            Antes de irte:
          </h2>

          <h3 style={{
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #34D399 0%, #14B8A6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.3,
            marginBottom: 24,
            letterSpacing: '-0.02em'
          }}>
            Tu IVA puede prescribir.
          </h3>

          <p style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.7)',
            marginBottom: 16
          }}>
            El plazo para reclamar la devolución del IVA ante la DIAN caduca <strong style={{ color: '#34D399' }}>5 años después de la factura de tu vehículo</strong>. Si compraste en 2021 o 2022, ya estás contra el reloj.
          </p>

          <p style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 32
          }}>
            Además, la normativa tributaria puede cambiar. Radicar hoy blinda tu beneficio del 50% en renta como un derecho adquirido ante cualquier reforma futura.
          </p>

          <a href={portalUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: '100%' }}>
            <button
              className="btn-primary btn-primary-lg"
              style={{
                width: '100%',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #059669 0%, #14B8A6 100%)',
                boxShadow: '0 4px 24px rgba(5,150,105,0.4)',
                borderRadius: 12,
              }}
            >
              Empezar mi trámite ahora
              <Icon name="arrowRight" size={18} color="white" />
            </button>
          </a>

          <p style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.35)',
            marginTop: 16,
            fontStyle: 'italic',
            textAlign: 'center'
          }}>
            Plazo legal: 5 años desde la factura · Art. 2536 Código Civil · Concepto DIAN 673/2026.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function CertiVehLandingComplete({ portalUrl = "https://portal.certiveh.co" }: { portalUrl?: string } = {}) {
  const [showUrgencyModal, setShowUrgencyModal] = useState(false);

  // Urgency modal logic - shows after 10 seconds, once per session
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
      <style>{CSS}</style>
      <Navbar />
      <main>
        <Hero/>
        <Aliados/>
        <Beneficios/>
        <Servicios/>
        <ComoFunciona/>
        <Calculadora/>
        <Confianza/>
        <PorQueNoSolo/>
        <Testimonios/>
        <Prensa/>
        <WinWin/>
        <FAQ/>
        <CTAFinal/>
      </main>
      <Footer/>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/573132689212?text=Hola%20quiero%20información%20sobre%20los%20beneficios%20tributarios%20para%20vehículos%20eléctricos"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
        className="whatsapp-fab"
        style={{
          position: "fixed", bottom: 20, right: 16, zIndex: 9999,
          width: 56, height: 56, borderRadius: "50%",
          background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(37,211,102,0.4), 0 2px 4px rgba(0,0,0,0.2)",
          textDecoration: "none", cursor: "pointer",
          animation: "waPulse 2s infinite",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Urgency Modal */}
      {showUrgencyModal && <UrgencyModal onClose={() => { setShowUrgencyModal(false); document.body.style.overflow = ''; }} />}

      {/* Structured Data moved to index.astro for SSR */}
    </PortalUrlContext.Provider>
  );
}