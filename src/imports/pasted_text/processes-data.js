import { useState, useEffect, useRef } from "react";

const fmtCOP = (n) => `$${Number(n).toLocaleString("es-CO")} COP`;

const PROCESSES = [
  { id: "UPME-2025-001", client: "Carlos A. Gómez", cc: "1.020.456.789", email: "carlos@gmail.com", vehicle: "BYD Atto 3 2024", value: 185000000, fee: 5550000, status: "agent_working", admin_action_required: false, action_type: null, updated: "Hace 3 min", incentivos: ["Exención IVA", "Arancel", "Renta 20%"], steps: [{ s: "Solicitud y pago", ok: true }, { s: "Docs verificados", ok: true }, { s: "Correo creado", ok: true }, { s: "Registro UPME", ok: true }, { s: "⚡ CapSolver resolviendo captcha...", ok: false, pending: true }], portal_email: "carlos.gomez@tramitesev.co", capsolver_active: true },
  { id: "UPME-2025-005", client: "Andrés F. Jiménez", cc: "1.075.234.890", email: "ajimenez@hotmail.com", vehicle: "Volvo XC40 Recharge 2024", value: 310000000, fee: 9300000, status: "agent_working", admin_action_required: false, action_type: null, updated: "Hace 12 min", incentivos: ["Exención IVA", "Arancel", "Renta 20%"], steps: [{ s: "Solicitud y pago", ok: true }, { s: "Docs verificados", ok: true }, { s: "Correo creado", ok: true }, { s: "Registro completado", ok: true }, { s: "📧 Agente 2 confirmando email UPME...", ok: false, pending: true }], portal_email: "andres.jimenez@tramitesev.co", email_polling: true },
  { id: "UPME-2025-009", client: "Miguel A. Castro", cc: "1.045.678.234", email: "mcastro@gmail.com", vehicle: "BMW iX3 2024", value: 280000000, fee: 8400000, status: "needs_captcha", admin_action_required: true, action_type: "captcha", updated: "Hace 5 min", incentivos: ["Exención IVA", "Arancel", "Renta 20%"], steps: [{ s: "Solicitud y pago", ok: true }, { s: "Docs verificados", ok: true }, { s: "Correo creado", ok: true }, { s: "Registro UPME", ok: true }, { s: "⚠ CapSolver falló (2/2) — intervención requerida", ok: false, pending: true }], portal_email: "miguel.castro@tramitesev.co", capsolver_failed: true },
  { id: "UPME-2025-002", client: "Valentina Ospina", alegra_invoice_id: "12891", invoice_number: "FV-007", invoice_url: "#", cc: "1.193.847.562", email: "v.ospina@outlook.com", vehicle: "Renault Zoe 2024", value: 142000000, fee: 4260000, status: "monitoring", admin_action_required: false, updated: "Hace 2 hrs", incentivos: ["Exención IVA", "Renta 20%"], steps: [{ s: "Solicitud y pago", ok: true }, { s: "Docs verificados", ok: true }, { s: "Cuenta UPME creada", ok: true }, { s: "Radicación exitosa", ok: true }, { s: "Monitoreando respuesta", ok: false, pending: true }], portal_email: "valentina.ospina@tramitesev.co", radicado: "UPME-RAD-2025-44821" },
  { id: "UPME-2025-006", client: "Laura M. Torres", cc: "1.001.234.567", email: "l.torres@gmail.com", vehicle: "Hyundai Ioniq 5 2024", value: 195000000, fee: 5850000, status: "agent_working", admin_action_required: false, updated: "Hace 8 min", incentivos: ["Exención IVA", "Arancel"], steps: [{ s: "Solicitud y pago", ok: true }, { s: "Docs verificados", ok: true }, { s: "Cuenta UPME creada", ok: true }, { s: "Llenando formulario...", ok: false, pending: true }], portal_email: "laura.torres@tramitesev.co" },
  { id: "UPME-2025-003", client: "Sebastián Morales", cc: "79.845.123", email: "s.morales@empresa.co", vehicle: "Chevrolet Bolt EV 2024", value: 168000000, fee: 5040000, status: "queued", admin_action_required: false, updated: "Feb 28", incentivos: ["Exención IVA", "Arancel"], steps: [{ s: "Solicitud y pago", ok: true }, { s: "Docs verificados", ok: true }, { s: "En cola — ventana UPME", ok: false, pending: true }], portal_email: null },
  { id: "UPME-2025-007", client: "Felipe Arango", cc: "98.765.432", email: "farango@gmail.com", vehicle: "MG Marvel R 2024", value: 155000000, fee: 4650000, status: "queued", admin_action_required: false, updated: "Mar 1", incentivos: ["Exención IVA"], steps: [{ s: "Solicitud y pago", ok: true }, { s: "Docs verificados", ok: true }, { s: "En cola — ventana UPME", ok: false, pending: true }], portal_email: null },
  { id: "UPME-2024-047", client: "Daniela Herrera", cc: "1.032.789.456", email: "dherrera@gmail.com", vehicle: "Kia EV6 2024", value: 225000000, fee: 6750000, status: "approved", alegra_invoice_id: "12847", invoice_number: "FV-003", invoice_url: "#", admin_action_required: false, updated: "Ene 15", incentivos: ["Exención IVA", "Arancel", "Renta 20%"], steps: [{ s: "Solicitud y pago", ok: true }, { s: "Radicación UPME", ok: true }, { s: "Resolución aprobada", ok: true }], portal_email: "daniela.herrera@tramitesev.co", radicado: "UPME-RES-2024-98234" },
  { id: "UPME-2025-008", client: "Ricardo Peñalosa", cc: "80.234.567", email: "rpenalosa@outlook.com", vehicle: "BYD Han 2024", value: 245000000, fee: 7350000, status: "docs_requested", admin_action_required: true, action_type: "manual_review", updated: "Hace 1 hr", incentivos: ["Exención IVA", "Arancel", "Renta 20%"], steps: [{ s: "Solicitud y pago", ok: true }, { s: "Docs verificados", ok: true }, { s: "Radicación UPME", ok: true }, { s: "UPME solicitó docs adicionales", ok: false, pending: true }], portal_email: "ricardo.penalosa@tramitesev.co", radicado: "UPME-RAD-2025-51234" },
];

const COLUMNS = [
  { id: "queued",                   label: "En cola",            icon: "⏳", color: "#7c3aed", bg: "#ede9fe", dark: "#4c1d95" },
  { id: "agent_working",            label: "Agente trabajando",  icon: "⚙️", color: "#0891b2", bg: "#cffafe", dark: "#164e63" },

  { id: "monitoring",               label: "Monitoreando",       icon: "👁",  color: "#2563eb", bg: "#dbeafe", dark: "#1e3a8a" },
  { id: "docs_requested",           label: "Docs solicitados",   icon: "📄", color: "#dc2626", bg: "#fee2e2", dark: "#7f1d1d" },
  { id: "approved",                 label: "Aprobado",           icon: "✅", color: "#059669", bg: "#d1fae5", dark: "#064e3b" },
];

const STATUS_CFG = Object.fromEntries(COLUMNS.map(c => [c.id, c]));

const Badge = ({ status, pulse }) => {
  const c = STATUS_CFG[status] || { label: status, color: "#6b7280", bg: "#f3f4f6" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: c.color, background: c.bg, border: `1px solid ${c.color}30` }}>
      {pulse && <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.color, animation: "pulse 1.4s infinite", display: "inline-block" }} />}
      {c.label}
    </span>
  );
};

// ── CAPSOLVER STATUS PANEL ───────────────────────────────────────────────
const CapSolverStatusPanel = ({ process }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("detecting"); // detecting | solving | solved

  useEffect(() => {
    const t1 = setTimeout(() => { setStatus("solving"); setProgress(30); }, 800);
    const t2 = setTimeout(() => { setProgress(70); }, 2000);
    const t3 = setTimeout(() => { setProgress(100); setStatus("solved"); }, 3800);
    return () => [t1,t2,t3].forEach(clearTimeout);
  }, []);

  const statusConfig = {
    detecting: { label: "Detectando tipo de captcha...", color: "#f59e0b", bg: "#fef3c7" },
    solving:   { label: "CapSolver resolviendo...", color: "#0891b2", bg: "#cffafe" },
    solved:    { label: "✅ Captcha resuelto — agente continúa", color: "#059669", bg: "#d1fae5" },
  };

// ── FALLBACK CAPTCHA BROWSER PANEL (solo si CapSolver falla 2 veces) ──────
const CaptchaBrowserPanel = ({ process, onResolved }) => {
  const [step, setStep] = useState("loading");
  const panelRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setStep("loaded"), 1800);
    return () => clearTimeout(t);
  }, []);

  const handleCaptchaClick = () => {
    setStep("solving");
    setTimeout(() => { setStep("solved"); onResolved(); }, 1400);
  };

  return (
    <div style={{ background: "#0f172a", borderRadius: 10, border: "1px solid #dc262640", padding: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 16 }}>⚠️</span>
        <div>
          <div style={{ color: "#fca5a5", fontWeight: 700, fontSize: 13 }}>Fallback — acción requerida</div>
          <div style={{ color: "#64748b", fontSize: 11 }}>CapSolver falló 2 veces · intervención manual necesaria</div>
        </div>
        <div style={{ marginLeft: "auto", padding: "3px 8px", borderRadius: 6, background: step === "solved" ? "#d1fae5" : "#fef3c7", color: step === "solved" ? "#059669" : "#d97706", fontSize: 11, fontWeight: 700 }}>
          {step === "loading" ? "Cargando..." : step === "loaded" ? "Listo para resolver" : step === "solving" ? "Verificando..." : "✅ Resuelto"}
        </div>
      </div>

      {/* Simulated browser */}
      <div ref={panelRef} style={{ background: "#1e293b", borderRadius: 8, overflow: "hidden", border: "1px solid #334155" }}>
        <div style={{ background: "#0f172a", padding: "6px 10px", display: "flex", alignItems: "center", gap: 6 }}>
          {["#ef4444","#f59e0b","#22c55e"].map(col => <div key={col} style={{ width: 8, height: 8, borderRadius: "50%", background: col }} />)}
          <div style={{ flex: 1, background: "#1e293b", borderRadius: 4, padding: "2px 8px", fontSize: 10, color: "#64748b", marginLeft: 4 }}>tramites.upme.gov.co</div>
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 10 }}>Formulario de registro UPME — paso 3 de 4</div>
          <div
            onClick={step === "loaded" ? handleCaptchaClick : undefined}
            style={{ border: `1.5px solid ${step === "solved" ? "#22c55e" : step === "solving" ? "#f59e0b" : "#334155"}`, borderRadius: 6, padding: "12px 14px", background: step === "solved" ? "#052e16" : "#111827", cursor: step === "loaded" ? "pointer" : "default", display: "flex", alignItems: "center", gap: 10, transition: "all 0.3s", boxShadow: step === "loaded" ? "0 0 0 3px #f59e0b20" : "none" }}
          >
            <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${step === "solved" ? "#22c55e" : "#475569"}`, display: "flex", alignItems: "center", justifyContent: "center", background: step === "solved" ? "#22c55e" : "transparent", transition: "all 0.3s" }}>
              {step === "solved" && <span style={{ color: "#fff", fontSize: 12, fontWeight: 900 }}>✓</span>}
              {step === "solving" && <span style={{ fontSize: 10 }}>⟳</span>}
            </div>
            <span style={{ color: step === "loaded" ? "#e2e8f0" : "#64748b", fontSize: 13, flex: 1 }}>No soy un robot</span>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16 }}>🔒</div>
              <div style={{ fontSize: 7, color: "#475569", lineHeight: 1.2 }}>reCAPTCHA<br/>Privacidad</div>
            </div>
          </div>
          {step === "loaded" && <div style={{ color: "#f59e0b", fontSize: 11, marginTop: 8, textAlign: "center" }}>👆 Haz clic en la casilla para resolver el captcha</div>}
          {step === "solved" && <div style={{ color: "#22c55e", fontSize: 11, marginTop: 8, textAlign: "center" }}>✅ Captcha resuelto — el agente continúa automáticamente</div>}
        </div>
      </div>
    </div>
  );
};
  const sc = statusConfig[status];

  return (
    <div style={{ background: "#0f172a", borderRadius: 10, padding: 16, border: "1px solid #1e293b" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: "#00C896", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#fff" }}>C</div>
        <div>
          <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 13 }}>CapSolver API</div>
          <div style={{ color: "#64748b", fontSize: 11 }}>Resolución automática · sin intervención humana</div>
        </div>
        <div style={{ marginLeft: "auto", padding: "3px 8px", borderRadius: 6, background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 700 }}>{sc.label}</div>
      </div>
      <div style={{ background: "#1e293b", borderRadius: 6, height: 6, overflow: "hidden", marginBottom: 10 }}>
        <div style={{ width: `${progress}%`, height: "100%", background: status === "solved" ? "#059669" : "#00C896", transition: "width 0.8s ease", borderRadius: 6 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[
          ["Tipo", "reCAPTCHA v2"],
          ["Estado", status === "solved" ? "Resuelto" : "Procesando"],
          ["Tiempo", status === "solved" ? "3.8s" : "—"],
        ].map(([k,v]) => (
          <div key={k} style={{ background: "#1e293b", borderRadius: 6, padding: "8px 10px" }}>
            <div style={{ color: "#64748b", fontSize: 10, marginBottom: 2 }}>{k}</div>
            <div style={{ color: "#f1f5f9", fontSize: 12, fontWeight: 600 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
// ── KANBAN BOARD ──────────────────────────────────────────────────────────
const KanbanBoard = ({ processes, onSelect }) => {
  const cols = COLUMNS.map(col => ({
    ...col,
    cards: processes.filter(p => p.status === col.id),
  }));

  return (
    <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 12, minHeight: 400 }}>
      {cols.map(col => (
        <div key={col.id} style={{ minWidth: 220, maxWidth: 240, display: "flex", flexDirection: "column", gap: 0, flexShrink: 0 }}>
          {/* Column header */}
          <div style={{ background: col.dark + "40", border: `1px solid ${col.color}30`, borderRadius: "8px 8px 0 0", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 14 }}>{col.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: col.color }}>{col.label}</span>
            </div>
            <span style={{ background: col.color + "25", color: col.color, borderRadius: 10, padding: "1px 8px", fontSize: 12, fontWeight: 700 }}>{col.cards.length}</span>
          </div>

          {/* Cards */}
          <div style={{ background: "#111827", border: `1px solid ${col.color}20`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: 8, display: "flex", flexDirection: "column", gap: 8, minHeight: 80 }}>
            {col.cards.length === 0 && (
              <div style={{ padding: "20px 0", textAlign: "center", fontSize: 12, color: "#374151" }}>Vacío</div>
            )}
            {col.cards.map(p => (
              <div key={p.id} onClick={() => onSelect(p)} style={{ background: "#0b1120", borderRadius: 8, padding: "11px 12px", cursor: "pointer", border: `1px solid ${p.admin_action_required ? col.color + "60" : "#1f2937"}`, boxShadow: p.admin_action_required ? `0 0 10px ${col.color}20` : "none", transition: "all 0.2s" }}>
                {p.admin_action_required && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: col.color, display: "inline-block", animation: "pulse 1.4s infinite" }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: col.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>Acción requerida</span>
                  </div>
                )}
                <div style={{ fontWeight: 700, fontSize: 13, color: "#e2e8f0", marginBottom: 2 }}>{p.client}</div>
                <div style={{ fontSize: 11, color: "#4b5563", marginBottom: 6 }}>{p.vehicle}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#6b7280" }}>{p.updated}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#4ade80" }}>{fmtCOP(p.fee)}</span>
                </div>
                <div style={{ marginTop: 7, display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {p.incentivos.slice(0, 2).map(inc => (
                    <span key={inc} style={{ fontSize: 9, color: "#374151", background: "#1f2937", padding: "1px 6px", borderRadius: 4 }}>{inc}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── PROCESS DETAIL PANEL ─────────────────────────────────────────────────
const ProcessDetail = ({ process, onClose, onResolve }) => {
  const [captchaResolved, setCaptchaResolved] = useState(false);
  const showCapSolverPanel = process.capsolver_active && !process.capsolver_failed;
  const showFallbackCaptcha = process.status === "needs_captcha" && process.capsolver_failed && !captchaResolved;
  const showEmailFallback = process.status === "needs_email_confirmation";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#111827", borderRadius: 14, width: "100%", maxWidth: (showFallbackCaptcha || showEmailFallback) ? 960 : 700, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", border: "1px solid #1f2937", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>

        {/* Modal header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#e2e8f0" }}>{process.client}</div>
            <div style={{ fontSize: 12, color: "#4b5563" }}>{process.vehicle} · {process.id} · C.C. {process.cc}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Badge status={process.status} pulse={process.admin_action_required} />
            <button onClick={onClose} style={{ background: "#1f2937", border: "none", color: "#94a3b8", borderRadius: 6, width: 30, height: 30, cursor: "pointer", fontSize: 16 }}>×</button>
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* Left panel — info + timeline */}
          <div style={{ width: "100%", overflow: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Client info */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#374151", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Información</div>
              {[["Honorarios", fmtCOP(process.fee)], ["Valor vehículo", fmtCOP(process.value)], ...(process.radicado ? [["Radicado", process.radicado]] : []), ...(process.portal_email ? [["Correo UPME", process.portal_email]] : [])].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #1f2937", fontSize: 12 }}>
                  <span style={{ color: "#4b5563" }}>{k}</span>
                  <span style={{ color: "#e2e8f0", fontWeight: 500, textAlign: "right", maxWidth: 150, wordBreak: "break-all" }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#374151", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Historial</div>
              {process.steps.map((st, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: st.ok ? "#166534" : st.pending ? "#92400e" : "#7f1d1d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                      {st.ok ? "✓" : "●"}
                    </div>
                    {i < process.steps.length - 1 && <div style={{ width: 1, flex: 1, background: "#1f2937", marginTop: 3 }} />}
                  </div>
                  <div style={{ paddingBottom: 10 }}>
                    <div style={{ fontSize: 12, color: st.pending ? "#fbbf24" : "#94a3b8", fontWeight: st.pending ? 700 : 400 }}>{st.s}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Email confirm action (no browser needed) */}
            {process.status === "needs_email_confirmation" && (
              <div style={{ background: "#0b1120", borderRadius: 8, border: "1px solid #d97706", padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#fbbf24", marginBottom: 8 }}>⚠ Confirmar correo UPME</div>
                <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 10px", lineHeight: 1.5 }}>El portal envió un correo de confirmación. Accede al buzón y haz clic en el enlace de activación.</p>
                <div style={{ background: "#111827", borderRadius: 5, padding: "6px 10px", fontSize: 11, color: "#60a5fa", marginBottom: 10, wordBreak: "break-all" }}>📧 {process.portal_email}</div>
                <button onClick={() => onResolve(process.id, "email_confirmed", `✅ Correo confirmado para ${process.client}`)} style={{ width: "100%", padding: "9px", background: "#166534", color: "#4ade80", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✓ Email confirmado</button>
              </div>
            )}

            {process.status === "docs_requested" && (
              <div style={{ background: "#0b1120", borderRadius: 8, border: "1px solid #dc2626", padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#f87171", marginBottom: 8 }}>📄 UPME solicita documentos</div>
                <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 10px", lineHeight: 1.5 }}>El portal UPME requiere documentos adicionales para continuar con la solicitud.</p>
                <button onClick={() => onResolve(process.id, "monitoring", `📄 Docs adicionales enviados para ${process.client}`)} style={{ width: "100%", padding: "9px", background: "#7f1d1d", color: "#fca5a5", border: "1px solid #dc262640", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Notificar cliente y gestionar</button>
              </div>
            )}

            {process.status === "monitoring" && (
              <div style={{ background: "#0b1120", borderRadius: 8, border: "1px solid #166534", padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#4ade80", marginBottom: 6 }}>👁 Monitoreando activamente</div>
                <p style={{ fontSize: 12, color: "#4b5563", margin: 0, lineHeight: 1.5 }}>El agente revisa el correo UPME cada 20 min. Se notificará ante cualquier novedad.</p>
              </div>
            )}

            {process.status === "approved" && (
              <div style={{ background: "#0b1120", borderRadius: 8, border: "1px solid #166534", padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#4ade80", marginBottom: 8 }}>✅ Aprobado por UPME</div>
                <button style={{ width: "100%", padding: "8px", background: "#166534", color: "#4ade80", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Descargar resolución</button>
              </div>
            )}
          </div>

          {/* CapSolver auto panel OR fallback panels */}
          {(showCapSolverPanel || showFallbackCaptcha || showEmailFallback) && (
            <div style={{ flex: 1, padding: 18, display: "flex", flexDirection: "column", gap: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#374151", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
                🖥 Sesión en vivo del agente — Portal UPME
              </div>
              <div style={{ flex: 1, borderRadius: 10, overflow: "hidden", border: "1px solid #334155", minHeight: 380 }}>
                {showCapSolverPanel && <CapSolverStatusPanel process={process} />}
                {showFallbackCaptcha && (
                  <CaptchaBrowserPanel
                    process={process}
                    onResolved={() => {
                      setCaptchaResolved(true);
                      onResolve(process.id, "captcha_resolved", `✅ Captcha resuelto manualmente para ${process.client}`);
                    }}
                  />
                )}
                {showEmailFallback && (
                  <div style={{ background: "#0f172a", borderRadius: 10, border: "1px solid #db277740", padding: 16 }}>
                    <div style={{ color: "#f9a8d4", fontWeight: 700, fontSize: 13, marginBottom: 8 }}>📧 Fallback — confirmación de email</div>
                    <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>El Agente 2 no encontró el email en 30 min. Opciones:</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <button onClick={() => onResolve(process.id, "email_confirmed", "Admin confirmó email manualmente")} style={{ padding: "9px 14px", background: "#db2777", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "left" }}>
                        ✅ Confirmar que el email ya fue validado
                      </button>
                      <button style={{ padding: "9px 14px", background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 7, fontSize: 13, cursor: "pointer", textAlign: "left" }}>
                        🔄 Pedir al agente que reenvíe el correo de confirmación
                      </button>
                      <div style={{ color: "#475569", fontSize: 11, marginTop: 4 }}>Buzón: {process.portal_email} · Último check: hace 32 min</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── MAIN ADMIN APP ────────────────────────────────────────────────────────
export default function AdminApp() {
  const [page, setPage] = useState("kanban");
  const [processes, setProcesses] = useState(PROCESSES);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleResolve = (id, newStatus, msg) => {
    setProcesses(prev => prev.map(p => p.id === id ? { ...p, status: newStatus, admin_action_required: false, updated: "Ahora mismo" } : p));
    setSelected(null);
    showToast(msg);
  };

  const needsAction = processes.filter(p => p.admin_action_required);
  const currentProc = selected ? processes.find(p => p.id === selected.id) || selected : null;

  const sideNav = [
    { id: "kanban",    label: "Tablero Kanban",      icon: "⊞" },
    { id: "list",      label: "Lista de trámites",   icon: "≡" },
    { id: "actions",   label: "Requieren acción",    icon: "⚠", badge: needsAction.length },
    { id: "window",    label: "Ventana UPME",        icon: "◷" },
    { id: "agents",    label: "Agentes IA",          icon: "🤖" },
    { id: "logs",      label: "Logs del sistema",    icon: "◫" },
  ];

  const s = {
    wrap: { fontFamily: "'DM Sans', system-ui, sans-serif", height: "100vh", display: "flex", flexDirection: "column", background: "#0b1120", color: "#e2e8f0" },
    topbar: { background: "#111827", borderBottom: "1px solid #1f2937", padding: "0 22px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 },
    sidebar: { width: 220, background: "#111827", borderRight: "1px solid #1f2937", display: "flex", flexDirection: "column", padding: "16px 0", flexShrink: 0 },
    sideBtn: (a) => ({ padding: "9px 18px", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 10, color: a ? "#fff" : "#6b7280", background: a ? "#166534" : "transparent", borderLeft: a ? "3px solid #4ade80" : "3px solid transparent", fontWeight: a ? 700 : 400, border: "none", width: "100%", textAlign: "left" }),
    main: { flex: 1, overflow: "auto", padding: 22 },
    th: { textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em", background: "#111827" },
    td: { padding: "12px 14px", borderBottom: "1px solid #111827", fontSize: 13 },
  };

  return (
    <div style={s.wrap}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes loadbar { from{width:0%} to{width:100%} }
        @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      {toast && (
        <div style={{ position: "fixed", top: 16, right: 16, zIndex: 999, background: toast.type === "success" ? "#059669" : "#d97706", color: "#fff", padding: "11px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, animation: "slideIn 0.3s ease", boxShadow: "0 4px 20px rgba(0,0,0,0.4)", maxWidth: 380 }}>
          {toast.msg}
        </div>
      )}

      {selected && (
        <ProcessDetail
          process={currentProc}
          onClose={() => setSelected(null)}
          onResolve={handleResolve}
        />
      )}

      {/* Topbar */}
      <div style={s.topbar}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 15 }}>
          <span style={{ color: "#4ade80" }}>⚡</span>
          <span>TrámitesEV Colombia</span>
          <span style={{ background: "#166534", color: "#4ade80", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 4, border: "1px solid #4ade8030" }}>ADMIN</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {needsAction.length > 0 && (
            <div onClick={() => setPage("actions")} style={{ background: "#dc262615", border: "1px solid #dc2626", borderRadius: 8, padding: "5px 12px", fontSize: 13, color: "#f87171", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <span style={{ animation: "pulse 1.5s infinite", display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#f87171" }} />
              {needsAction.length} pendiente{needsAction.length > 1 ? "s" : ""}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#166534", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#4ade80" }}>A</div>
            <span style={{ fontSize: 13, color: "#6b7280" }}>Admin</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={s.sidebar}>
          <div style={{ padding: "0 18px 10px", fontSize: 10, fontWeight: 800, color: "#374151", textTransform: "uppercase", letterSpacing: "0.1em" }}>Panel UPME</div>
          {sideNav.map(n => (
            <button key={n.id} style={s.sideBtn(page === n.id)} onClick={() => setPage(n.id)}>
              <span>{n.icon}</span>
              <span style={{ flex: 1 }}>{n.label}</span>
              {n.badge > 0 && <span style={{ background: "#dc2626", color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 11 }}>{n.badge}</span>}
            </button>
          ))}
          <div style={{ marginTop: "auto", padding: "14px 18px", borderTop: "1px solid #1f2937" }}>
            <div style={{ fontSize: 10, color: "#374151", marginBottom: 4 }}>🟢 Ciclo activo UPME</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#4ade80" }}>Mar 1 – May 31, 2026</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 11, color: "#374151" }}>{processes.filter(p=>p.status==="queued").length} en cola</span>
              <span style={{ fontSize: 11, color: "#374151" }}>{processes.filter(p=>p.status==="approved").length} aprobados</span>
            </div>
          </div>
        </div>

        {/* Main */}
        <main style={s.main}>

          {/* KANBAN */}
          {page === "kanban" && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>Tablero Kanban — Pipeline UPME</h1>
                  <p style={{ margin: 0, fontSize: 13, color: "#4b5563" }}>{processes.length} trámites activos · Ciclo 1, 2026</p>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  {[
                    { label: "Total", value: processes.length, color: "#e2e8f0" },
                    { label: "Acción", value: needsAction.length, color: "#f87171" },
                    { label: "Aprobados", value: processes.filter(p=>p.status==="approved").length, color: "#4ade80" },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: "center", background: "#111827", borderRadius: 8, padding: "8px 14px", border: "1px solid #1f2937" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 10, color: "#374151" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <KanbanBoard processes={processes} onSelect={p => setSelected(p)} />
            </div>
          )}

          {/* LIST */}
          {page === "list" && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 20px" }}>Todos los trámites</h1>
              <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1f2937", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead><tr>{["Cliente / C.C.", "Vehículo", "Estado", "Honorarios", "Actualizado", ""].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {processes.map(p => (
                      <tr key={p.id} style={{ cursor: "pointer", background: p.admin_action_required ? "#dc262608" : "transparent" }} onClick={() => setSelected(p)}>
                        <td style={{ ...s.td, borderLeft: p.admin_action_required ? "3px solid #dc2626" : "3px solid transparent" }}>
                          <div style={{ fontWeight: 600, color: "#e2e8f0" }}>{p.client}</div>
                          <div style={{ fontSize: 11, color: "#374151" }}>C.C. {p.cc}</div>
                        </td>
                        <td style={{ ...s.td, color: "#6b7280" }}>{p.vehicle}</td>
                        <td style={s.td}><Badge status={p.status} pulse={p.admin_action_required} /></td>
                        <td style={{ ...s.td, fontWeight: 700, color: "#4ade80" }}>{fmtCOP(p.fee)}</td>
                        <td style={{ ...s.td, color: "#374151", fontSize: 12 }}>{p.updated}</td>
                        <td style={{ ...s.td, color: "#4ade80" }}>Ver →</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ACTIONS */}
          {page === "actions" && (
            <div style={{ animation: "fadeIn 0.3s ease", maxWidth: 720 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 20px" }}>Acciones pendientes</h1>
              {needsAction.length === 0 ? (
                <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1f2937", padding: 40, textAlign: "center", color: "#374151" }}>✅ Sin acciones pendientes.</div>
              ) : needsAction.map(p => (
                <div key={p.id} style={{ background: "#111827", borderRadius: 10, border: `1px solid ${STATUS_CFG[p.status]?.color || "#d97706"}60`, padding: 20, marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15 }}>{p.client}</div>
                      <div style={{ fontSize: 12, color: "#4b5563" }}>{p.vehicle} · C.C. {p.cc}</div>
                    </div>
                    <Badge status={p.status} pulse />
                  </div>
                  <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 14px", lineHeight: 1.6 }}>
                    p.action_type === "captcha" ? "⚠ CapSolver intentó 2 veces y no pudo resolver el captcha. Solo en este caso se requiere intervención manual. El agente está pausado esperando." : p.action_type === "email_confirm" ? "📧 El Agente 2 no encontró el email de confirmación en 30 minutos. Verifica el buzón o reenvía el correo desde UPME." : "📄 UPME solicita documentos adicionales para este trámite."
                  </p>
                  <button onClick={() => setSelected(p)} style={{ padding: "9px 20px", background: "#166534", color: "#4ade80", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    p.action_type === "captcha" ? "🖥 Resolver CAPTCHA manualmente" : p.action_type === "email_confirm" ? "📧 Verificar buzón y confirmar" : "Ver detalle"
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* WINDOW */}
          {page === "window" && (
            <div style={{ animation: "fadeIn 0.3s ease", maxWidth: 680 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 20px" }}>Ventanas de radicación UPME</h1>
              {[
                { name: "Ciclo 1 — 2026", open: "1 Marzo 2026", close: "31 Mayo 2026", status: "open", queued: processes.filter(p=>p.status==="queued").length, processed: processes.filter(p=>p.status==="approved").length },
                { name: "Ciclo 2 — 2026", open: "15 Agosto 2026", close: "14 Noviembre 2026", status: "upcoming", queued: 0, processed: 0 },
              ].map((w, i) => (
                <div key={i} style={{ background: "#111827", borderRadius: 10, border: `1px solid ${w.status === "open" ? "#166534" : "#1f2937"}`, padding: 22, marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>{w.name}</div>
                      <div style={{ fontSize: 13, color: "#4b5563" }}>{w.open} → {w.close}</div>
                    </div>
                    <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: w.status === "open" ? "#16653420" : "#1f293740", color: w.status === "open" ? "#4ade80" : "#4b5563", border: `1px solid ${w.status === "open" ? "#166534" : "#1f2937"}` }}>
                      {w.status === "open" ? "🟢 Activa" : "⏳ Próxima"}
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                    {[["En cola", w.queued, "#60a5fa"], ["En proceso", processes.filter(p=>!["queued","approved","rejected"].includes(p.status)).length, "#fbbf24"], ["Aprobados", w.processed, "#4ade80"]].map(([label, val, color]) => (
                      <div key={label} style={{ background: "#0b1120", borderRadius: 8, padding: 14, textAlign: "center" }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color }}>{val}</div>
                        <div style={{ fontSize: 11, color: "#374151", marginTop: 2 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                  {w.status === "open" && (
                    <button onClick={() => showToast("⚠️ Ventana cerrada. Los trámites pendientes pasarán al Ciclo 2.", "warning")} style={{ marginTop: 14, width: "100%", padding: "10px", background: "#7c2d1215", color: "#f87171", border: "1px solid #dc262640", borderRadius: 7, fontSize: 13, cursor: "pointer", fontWeight: 700 }}>
                      Cerrar ventana manualmente
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* AGENTS */}
          {page === "agents" && (
            <div style={{ animation: "fadeIn 0.3s ease", maxWidth: (showFallbackCaptcha || showEmailFallback) ? 960 : 700 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 20px" }}>Agentes IA — Estado en vivo</h1>
              {[
                { name: "Agente de incorporación UPME", desc: "Registra clientes y radica solicitudes en portal UPME", status: "active", last: "Hace 3 min", queue: processes.filter(p=>p.status==="queued").length, done: 8, color: "#4ade80", current: "UPME-2025-006 — Llenando formulario paso 3/4" },
                { name: "Monitor de correos UPME", desc: "Revisa buzones de correo de clientes cada 20 minutos", status: "active", last: "Hace 11 min", queue: processes.filter(p=>p.status==="monitoring").length, done: 47, color: "#60a5fa", current: "Próximo ciclo en 9 min" },
              ].map((a, i) => (
                <div key={i} style={{ background: "#111827", borderRadius: 10, border: `1px solid ${a.color}25`, padding: 20, marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, display: "inline-block", animation: "pulse 2s infinite" }} />
                        <span style={{ fontWeight: 800, fontSize: 15 }}>{a.name}</span>
                      </div>
                      <div style={{ fontSize: 13, color: "#4b5563" }}>{a.desc}</div>
                    </div>
                    <span style={{ fontSize: 12, color: a.color, background: `${a.color}15`, padding: "3px 10px", borderRadius: 10, border: `1px solid ${a.color}20` }}>En línea</span>
                  </div>
                  <div style={{ background: "#0b1120", borderRadius: 6, padding: "8px 12px", marginBottom: 12, fontSize: 12, color: "#4b5563" }}>
                    <span style={{ color: "#374151" }}>Estado actual: </span><span style={{ color: a.color }}>{a.current}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                    {[["Último heartbeat", a.last], ["Monitoreando", a.queue], ["Completados hoy", a.done]].map(([k, v]) => (
                      <div key={k} style={{ background: "#0b1120", borderRadius: 7, padding: 10, textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>{v}</div>
                        <div style={{ fontSize: 10, color: "#374151" }}>{k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LOGS */}
          {page === "logs" && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 20px" }}>Logs del sistema</h1>
              <div style={{ background: "#0b1120", borderRadius: 10, border: "1px solid #1f2937", padding: 20, fontFamily: "monospace", fontSize: 12, color: "#4b5563", lineHeight: 2 }}>
                {[
                  ["14:32:05", "INFO",  "onboarding",    "UPME-2025-001 | navigate        | Portal UPME cargado OK"],
                  ["14:32:18", "INFO",  "onboarding",    "UPME-2025-001 | captcha_detect  | CAPTCHA detectado — llamando CapSolver API"],
                    ["14:32:22", "INFO",  "onboarding",    "UPME-2025-001 | captcha_solved  | CapSolver resolvió en 3.8s — agente continúa"],
                    ["14:18:44", "INFO",  "webhook",       "UPME-2025-002 | wompi_paid      | FV-007 creada en Alegra · CUFE validado DIAN · PDF enviado al cliente"],
                  ["14:32:18", "INFO",  "onboarding",    "UPME-2025-001 | notify_admin    | Admin notificado, esperando resolución"],
                  ["14:20:00", "INFO",  "email_monitor", "Ciclo iniciado — 2 buzones activos"],
                  ["14:20:04", "INFO",  "email_monitor", "UPME-2025-002 | inbox_check     | 0 correos nuevos de UPME"],
                  ["14:20:06", "INFO",  "email_monitor", "UPME-2025-005 | inbox_check     | 0 correos nuevos"],
                  ["14:20:06", "INFO",  "email_monitor", "Ciclo completado en 6.1s"],
                  ["09:30:45", "INFO",  "onboarding",    "UPME-2025-002 | submit          | Radicado: UPME-RAD-2025-44821 ✓"],
                  ["09:15:12", "INFO",  "email_monitor", "UPME-2024-047 | classify_email  | Tipo: approved — Resolución recibida"],
                ].map(([time, level, agent, msg], i) => (
                  <div key={i}>
                    <span style={{ color: "#1f2937" }}>{time}</span>{" "}
                    <span style={{ color: level === "WARN" ? "#fbbf24" : level === "ERROR" ? "#f87171" : "#4ade80" }}>[{level}]</span>{" "}
                    <span style={{ color: "#60a5fa" }}>[{agent}]</span>{" "}
                    <span style={{ color: "#6b7280" }}>{msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}