import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// GNV Calculator — Gestión de Eficiencia Energética (GEE)
// Gas Natural Vehicular — Demo page
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

  .section { padding: 96px 48px; max-width: 1200px; margin: 0 auto; }

  .card {
    background: var(--white); border: 1px solid var(--slate-200);
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
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

  @media (max-width: 768px) {
    .gnv-header { padding: 12px 20px !important; }
    .gnv-hero { padding: 60px 20px 48px !important; }
    .section { padding: 64px 20px; }
    .grid-calc { grid-template-columns: 1fr !important; }
    .card-calc-controls { border-right: none !important; border-bottom: 1px solid var(--slate-200) !important; padding: 32px 24px !important; }
    .card-calc-result { padding: 32px 24px !important; }
    .btn-primary { padding: 12px 20px; font-size: 14px; }
    .btn-primary-lg { padding: 14px 24px; font-size: 15px; }
    h1 br { display: none; }
    .gnv-footer { padding: 40px 20px !important; }
  }

  @media (max-width: 480px) {
    .gnv-header { padding: 12px 16px !important; }
    .gnv-hero { padding: 48px 16px 40px !important; }
    .section { padding: 48px 16px; }
    .card-calc-controls { padding: 24px 16px !important; }
    .card-calc-result { padding: 24px 16px !important; }
    .btn-primary-lg { padding: 12px 20px; font-size: 14px; }
    .gnv-footer { padding: 32px 16px !important; }
  }
`;

function Icon({ name, size = 20, color = "currentColor", style = {} }: { name: string; size?: number; color?: string; style?: React.CSSProperties }) {
  const paths: Record<string, JSX.Element> = {
    zap:         <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    fileText:    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    arrowRight:  <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    user:        <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    building:    <><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></>,
    fuel:        <><path d="M3 22V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v17"/><path d="M13 10h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 6"/><line x1="3" y1="22" x2="15" y2="22"/><path d="M7 8h4"/><path d="M7 12h4"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {paths[name]}
    </svg>
  );
}

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

export default function GNVCalculadora() {
  const [valor, setValor] = useState(80);
  const [perfil, setPerfil] = useState("natural");
  const [calc, setCalc] = useState<any>({});
  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-CO") + " COP";

  useEffect(() => {
    const v = valor * 1_000_000;

    // Beneficios tributarios
    const iva = v * 0.05;
    const renta = v * 0.50;
    const totalBeneficio = iva + renta;

    // Trámite UPME - Resolución UPME No. 135 de 2025
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

    // Honorarios CertiVeh - GNV/GEE
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
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Header */}
      <header className="gnv-header" style={{ background: "var(--white)", borderBottom: "1px solid var(--slate-200)", padding: "16px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <CertiVehLogo compact />
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 9999, background: "var(--emerald-50)", border: "1px solid var(--emerald-200)" }}>
          <Icon name="fuel" size={14} color="var(--emerald-700)" />
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--emerald-700)", letterSpacing: "0.04em" }}>GNV / GEE</span>
        </div>
      </header>

      {/* Hero */}
      <section className="gnv-hero" style={{ background: "var(--slate-900)", padding: "80px 48px 64px", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", padding: "4px 12px", borderRadius: 9999, background: "rgba(5,150,105,0.15)", color: "#34D399", border: "1px solid rgba(5,150,105,0.3)", marginBottom: 20 }}>
            <Icon name="zap" size={12} color="#34D399" />
            Gestión de Eficiencia Energética
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-0.03em", color: "white", lineHeight: 1.2, marginBottom: 16 }}>
            Certificado UPME para vehículos a {" "}<br/>
            <span style={{ background: "linear-gradient(135deg, #34D399, #14B8A6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Gas Natural Vehicular</span>
          </h1>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
            Accede a la deducción en renta del 50% del valor de la conversión o equipo GNV mediante la certificación UPME de Gestión Eficiente de la Energía.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculadora" aria-label="Calculadora de costos GNV" style={{ background: "var(--white)" }}>
        <div className="section">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--slate-900)", lineHeight: 1.25, marginBottom: 14 }}>Calcula el costo de tu certificación</h2>
            <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "var(--slate-600)", lineHeight: 1.6 }}>Mueve el slider y ve en tiempo real cuánto cuesta el servicio y cuánto puedes deducir.</p>
          </div>

          <div className="card grid-calc" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden", padding: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)" }}>
            {/* Controls */}
            <div className="card-calc-controls" style={{ padding: 48, borderRight: "1px solid var(--slate-200)" }}>
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
                  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", color: "var(--slate-500)" }}>Valor del activo / conversión</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "var(--emerald-600)", letterSpacing: "-0.02em" }}>${valor}M</div>
                </div>
                <input type="range" min="10" max="500" step="5" value={valor} onChange={e => setValor(Number(e.target.value))} style={{ width: "100%", appearance: "none", height: 4, borderRadius: 4, outline: "none", cursor: "pointer", background: `linear-gradient(to right, #059669 0%, #14B8A6 ${((valor-10)/490)*100}%, #E2E8F0 ${((valor-10)/490)*100}%, #E2E8F0 100%)` }}/>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--slate-400)", fontWeight: 500, marginTop: 6 }}>
                  <span>$10M</span><span>$500M</span>
                </div>
              </div>

              {/* Benefit bars */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                {[
                  { label: "Devolución IVA (5%)", value: calc.iva, color: "var(--emerald-600)", pct: calc.iva / (calc.totalBeneficio || 1) },
                  { label: "Deducción en renta (50%)", value: calc.renta, color: "var(--teal-500)", pct: calc.renta / (calc.totalBeneficio || 1) },
                ].map((b, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 14, color: "var(--slate-600)", fontWeight: 500, lineHeight: 1.5 }}>{b.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: b.color, lineHeight: 1.5 }}>{b.value ? fmt(b.value) : "-"}</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: "var(--slate-100)", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 3, background: b.color, width: `${(b.pct || 0) * 100}%`, transition: "width 0.4s ease" }}/>
                    </div>
                  </div>
                ))}
              </div>

              {perfil === "empresa" && (
                <div style={{ padding: "10px 14px", background: "var(--emerald-50)", border: "1px solid var(--emerald-200)", borderRadius: 12, fontSize: 13, color: "var(--emerald-700)", lineHeight: 1.5, marginBottom: 16 }}>
                  Depreciación acelerada a 3 años, reduce tu base gravable más rápido y paga menos impuestos hoy.
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
                {calc.totalBeneficio ? fmt(calc.totalBeneficio) : "-"}
              </div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 28, lineHeight: 1.5 }}>en incentivos tributarios</div>

              <div style={{ width: "100%", padding: "20px 24px", marginBottom: 24, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#34D399", marginBottom: 8 }}>Beneficio neto (menos costo del servicio)</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "white", letterSpacing: "-0.02em" }}>{calc.neto ? fmt(calc.neto) : "-"}</div>
              </div>

              {calc.costoTotal && calc.totalBeneficio && (
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 28 }}>
                  Por cada <span style={{ fontWeight: 700, color: "white" }}>$1 invertido</span> en CertiVeh, recibes{" "}
                  <span style={{ fontWeight: 700, color: "#34D399" }}>${(Math.round(calc.totalBeneficio / calc.costoTotal * 10) / 10).toLocaleString("es-CO")}</span> en beneficios.
                </div>
              )}

              <a href="https://portal.certiveh.co" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", width: "100%" }}>
                <button className="btn-primary btn-primary-lg" style={{ width: "100%", justifyContent: "center", background: "linear-gradient(135deg, #059669, #14B8A6)", boxShadow: "0 4px 24px rgba(5,150,105,0.4)" }}>
                  Solicitar cotización <Icon name="arrowRight" size={18} color="white"/>
                </button>
              </a>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 12 }}>Certificación UPME vía GEE para vehículos a gas natural</div>
            </div>
          </div>

          {/* Info about pricing tiers */}
          <div style={{ marginTop: 32, padding: "20px 24px", background: "var(--slate-50)", border: "1px solid var(--slate-200)", borderRadius: 12, maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--slate-700)", marginBottom: 12 }}>Honorarios CertiVeh - GNV</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--emerald-600)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>01</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--slate-900)" }}>Activo con valor menor o igual a $150.000.000</div>
                  <div style={{ fontSize: 13, color: "var(--slate-500)" }}>El costo sería de $899.990 COP + IVA</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--emerald-600)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>02</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--slate-900)" }}>Activo con valor mayor a $150.000.000</div>
                  <div style={{ fontSize: 13, color: "var(--slate-500)" }}>Se cobra el 0.6% del valor del activo a certificar + IVA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Disclaimer */}
      <div style={{ background: "var(--amber-50)", borderTop: "1px solid var(--amber-200)", padding: "16px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "var(--amber-600)", lineHeight: 1.6, maxWidth: 700, margin: "0 auto" }}>
          Aplica para vehículos de más de 10 toneladas dedicados al transporte de carga que operan con Gas Natural Vehicular.
        </p>
      </div>

      <footer className="gnv-footer" style={{ background: "var(--slate-900)", padding: "40px 48px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <CertiVehLogo variant="light" compact />
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 16, lineHeight: 1.6 }}>
          Demo interno - Calculadora GNV / Gestión de Eficiencia Energética
        </p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 8 }}>
          Los valores son estimados. El costo de la certificación UPME depende de la resolución vigente.
        </p>
      </footer>
    </>
  );
}
