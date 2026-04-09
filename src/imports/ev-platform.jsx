import { useState, useEffect } from "react";

// ── MOCK DATA ──────────────────────────────────────────────────────────────
const MOCK_PROCESSES = [
  {
    id: "APP-2024-001",
    client: "Carlos Mendoza",
    email: "carlos.mendoza@gmail.com",
    vehicle: { make: "Tesla", model: "Model 3", year: 2024, vin: "5YJ3E1EA4PF123456", value: 850000 },
    status: "needs_captcha",
    admin_action_required: true,
    admin_action_type: "captcha",
    created_at: "2024-12-01",
    updated_at: "2025-03-07 14:32",
    portal_email: "carlos.mendoza.tax@tramitesev.mx",
    fee: 42500,
    steps: [
      { step: "Application submitted", status: "ok", time: "Dec 1, 10:00" },
      { step: "Payment received", status: "ok", time: "Dec 1, 10:05" },
      { step: "Documents verified", status: "ok", time: "Dec 1, 10:10" },
      { step: "Email account created", status: "ok", time: "Mar 7, 14:20" },
      { step: "Portal registration started", status: "ok", time: "Mar 7, 14:28" },
      { step: "CAPTCHA encountered — waiting for admin", status: "pending", time: "Mar 7, 14:32" },
    ],
  },
  {
    id: "APP-2024-002",
    client: "Ana Sofía Reyes",
    email: "ana.reyes@outlook.com",
    vehicle: { make: "BMW", model: "iX3", year: 2024, vin: "WBY73AW04RCP12345", value: 1200000 },
    status: "monitoring",
    admin_action_required: false,
    created_at: "2024-11-15",
    updated_at: "2025-03-06 09:15",
    portal_email: "ana.reyes.tax@tramitesev.mx",
    fee: 60000,
    portal_confirmation: "SAT-2025-789456",
    steps: [
      { step: "Application submitted", status: "ok", time: "Nov 15, 09:00" },
      { step: "Payment received", status: "ok", time: "Nov 15, 09:10" },
      { step: "Documents verified", status: "ok", time: "Nov 15, 09:20" },
      { step: "Portal account created", status: "ok", time: "Mar 1, 08:00" },
      { step: "Application form filled", status: "ok", time: "Mar 1, 08:45" },
      { step: "Documents uploaded", status: "ok", time: "Mar 1, 09:10" },
      { step: "Application submitted to portal", status: "ok", time: "Mar 1, 09:30" },
      { step: "Monitoring for government response", status: "pending", time: "Ongoing" },
    ],
  },
  {
    id: "APP-2024-003",
    client: "Roberto Gutiérrez",
    email: "r.gutierrez@empresa.mx",
    vehicle: { make: "Nissan", model: "Leaf", year: 2023, vin: "1N4AZ1CP4PC123789", value: 520000 },
    status: "queued",
    admin_action_required: false,
    created_at: "2025-02-20",
    updated_at: "2025-02-20 16:00",
    portal_email: null,
    fee: 26000,
    steps: [
      { step: "Application submitted", status: "ok", time: "Feb 20, 16:00" },
      { step: "Payment received", status: "ok", time: "Feb 20, 16:05" },
      { step: "Documents verified", status: "ok", time: "Feb 20, 16:15" },
      { step: "Queued for processing window", status: "pending", time: "Waiting" },
    ],
  },
  {
    id: "APP-2024-004",
    client: "María Fernanda López",
    email: "mflopez@gmail.com",
    vehicle: { make: "Audi", model: "e-tron", year: 2024, vin: "WA1LAAGE4NB012345", value: 1650000 },
    status: "approved",
    admin_action_required: false,
    created_at: "2024-08-10",
    updated_at: "2025-01-15 11:30",
    portal_email: "mfernanda.tax@tramitesev.mx",
    fee: 82500,
    portal_confirmation: "SAT-2024-445123",
    steps: [
      { step: "Application submitted", status: "ok", time: "Aug 10" },
      { step: "Payment received", status: "ok", time: "Aug 10" },
      { step: "Portal account created", status: "ok", time: "Aug 16" },
      { step: "Application submitted to portal", status: "ok", time: "Aug 17" },
      { step: "Government approval received", status: "ok", time: "Jan 15" },
    ],
  },
  {
    id: "APP-2024-005",
    client: "Diego Hernández",
    email: "diego.h@hotmail.com",
    vehicle: { make: "Volkswagen", model: "ID.4", year: 2024, vin: "1V2WR2CA0NC123456", value: 780000 },
    status: "needs_email_confirmation",
    admin_action_required: true,
    admin_action_type: "email_confirm",
    created_at: "2025-03-01",
    updated_at: "2025-03-07 11:45",
    portal_email: "diego.hernandez.tax@tramitesev.mx",
    fee: 39000,
    steps: [
      { step: "Application submitted", status: "ok", time: "Mar 1" },
      { step: "Payment received", status: "ok", time: "Mar 1" },
      { step: "Email account created", status: "ok", time: "Mar 7, 11:30" },
      { step: "Portal registration completed", status: "ok", time: "Mar 7, 11:40" },
      { step: "Confirmation email sent — waiting for admin", status: "pending", time: "Mar 7, 11:45" },
    ],
  },
];

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "#94a3b8", bg: "#f1f5f9" },
  queued: { label: "Queued", color: "#7c3aed", bg: "#ede9fe" },
  window_open: { label: "Window Open", color: "#2563eb", bg: "#dbeafe" },
  agent_working: { label: "Agent Working", color: "#0891b2", bg: "#cffafe" },
  needs_captcha: { label: "Needs CAPTCHA", color: "#d97706", bg: "#fef3c7" },
  needs_email_confirmation: { label: "Needs Email Confirm", color: "#d97706", bg: "#fef3c7" },
  captcha_resolved: { label: "CAPTCHA Resolved", color: "#059669", bg: "#d1fae5" },
  monitoring: { label: "Monitoring", color: "#2563eb", bg: "#dbeafe" },
  docs_requested: { label: "Docs Requested", color: "#dc2626", bg: "#fee2e2" },
  approved: { label: "Approved ✓", color: "#059669", bg: "#d1fae5" },
  rejected: { label: "Rejected", color: "#dc2626", bg: "#fee2e2" },
  error: { label: "Error", color: "#dc2626", bg: "#fee2e2" },
  on_hold: { label: "On Hold", color: "#6b7280", bg: "#f3f4f6" },
};

const fmtCurrency = (n) => `$${n.toLocaleString("es-MX")} MXN`;

// ── SHARED COMPONENTS ──────────────────────────────────────────────────────
const StatusBadge = ({ status, pulse }) => {
  const cfg = STATUS_CONFIG[status] || { label: status, color: "#6b7280", bg: "#f3f4f6" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}30`
    }}>
      {pulse && (
        <span style={{
          width: 7, height: 7, borderRadius: "50%", background: cfg.color,
          animation: "pulse 1.5s infinite"
        }} />
      )}
      {cfg.label}
    </span>
  );
};

const Card = ({ children, style = {} }) => (
  <div style={{
    background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)", ...style
  }}>
    {children}
  </div>
);

// ── CLIENT PORTAL ──────────────────────────────────────────────────────────
const ClientPortal = () => {
  const [page, setPage] = useState("login");
  const [submitStep, setSubmitStep] = useState(1);
  const [toast, setToast] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const [uploading, setUploading] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const clientProcess = MOCK_PROCESSES[2]; // Roberto - queued
  const clientApproved = MOCK_PROCESSES[3]; // María - approved

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => { setUploading(false); setExtracting(true); }, 1200);
    setTimeout(() => { setExtracting(false); setExtracted(true); }, 3000);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "⊡" },
    { id: "submit", label: "New Application", icon: "+" },
    { id: "applications", label: "My Applications", icon: "≡" },
    { id: "billing", label: "Billing", icon: "◈" },
  ];

  const styles = {
    wrap: { fontFamily: "'DM Sans', system-ui, sans-serif", height: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc", color: "#1e293b" },
    loginWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%)" },
    loginCard: { background: "#fff", borderRadius: 16, padding: "40px 36px", width: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" },
    input: { width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
    btn: { width: "100%", padding: "12px", background: "#1e3a5f", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer" },
    nav: { background: "#1e3a5f", color: "#fff", padding: "0 24px", display: "flex", alignItems: "center", gap: 32, height: 56 },
    navLink: (active) => ({ padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: active ? 600 : 400, background: active ? "rgba(255,255,255,0.15)" : "transparent", color: "#fff", border: "none", display: "flex", alignItems: "center", gap: 6 }),
    main: { flex: 1, overflow: "auto", padding: 28 },
  };

  if (page === "login") return (
    <div style={styles.loginWrap}>
      <div style={styles.loginCard}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>⚡</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>TrámitesEV</h1>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Incentivos fiscales para vehículos eléctricos</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#475569", display: "block", marginBottom: 5 }}>Correo electrónico</label>
            <input style={styles.input} placeholder="tu@email.com" defaultValue="carlos@gmail.com" />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#475569", display: "block", marginBottom: 5 }}>Contraseña</label>
            <input style={styles.input} type="password" placeholder="••••••••" defaultValue="password" />
          </div>
          <button style={{ ...styles.btn, marginTop: 8 }} onClick={() => setPage("dashboard")}>
            Iniciar sesión
          </button>
          <p style={{ textAlign: "center", fontSize: 13, color: "#64748b", margin: 0 }}>
            ¿No tienes cuenta? <span style={{ color: "#1e3a5f", cursor: "pointer", fontWeight: 600 }}>Regístrate</span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.wrap}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} @keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {toast && (
        <div style={{ position: "fixed", top: 16, right: 16, zIndex: 999, background: toast.type === "success" ? "#059669" : "#dc2626", color: "#fff", padding: "10px 18px", borderRadius: 8, fontSize: 14, fontWeight: 500, animation: "fadeIn 0.3s ease", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
          {toast.msg}
        </div>
      )}

      {/* Nav */}
      <nav style={styles.nav}>
        <div style={{ fontWeight: 700, fontSize: 16, marginRight: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <span>⚡</span> TrámitesEV
        </div>
        {navItems.map(n => (
          <button key={n.id} style={styles.navLink(page === n.id)} onClick={() => { setPage(n.id); setSubmitStep(1); setExtracted(false); }}>
            <span>{n.icon}</span> {n.label}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 12px", fontSize: 13 }}>
            Carlos Mendoza
          </div>
          <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12 }} onClick={() => setPage("login")}>
            Salir
          </button>
        </div>
      </nav>

      <main style={styles.main}>
        {/* DASHBOARD */}
        {page === "dashboard" && (
          <div style={{ maxWidth: 900, margin: "0 auto", animation: "fadeIn 0.3s ease" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Bienvenido, Carlos 👋</h1>
            <p style={{ color: "#64748b", margin: "0 0 24px" }}>Aquí está el estado de tus trámites</p>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Trámites activos", value: "1", icon: "◷", color: "#2563eb" },
                { label: "En proceso", value: "1", icon: "⚙", color: "#d97706" },
                { label: "Aprobados", value: "0", icon: "✓", color: "#059669" },
              ].map(s => (
                <Card key={s.label} style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: s.color }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{s.label}</div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Active application */}
            <Card style={{ padding: 24, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>TRÁMITE ACTIVO</div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Nissan Leaf 2023</h3>
                  <div style={{ color: "#64748b", fontSize: 13, marginTop: 2 }}>Ref: {clientProcess.id}</div>
                </div>
                <StatusBadge status={clientProcess.status} />
              </div>

              {/* Step tracker */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Progreso del trámite</div>
                {[
                  { label: "Solicitud enviada", done: true },
                  { label: "Pago recibido", done: true },
                  { label: "Documentos verificados", done: true },
                  { label: "Creación de cuenta en portal", done: false, active: true },
                  { label: "Envío al SAT", done: false },
                  { label: "Aprobación final", done: false },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700,
                      background: s.done ? "#059669" : s.active ? "#d97706" : "#e2e8f0",
                      color: s.done || s.active ? "#fff" : "#94a3b8"
                    }}>
                      {s.done ? "✓" : s.active ? "●" : i + 1}
                    </div>
                    <span style={{ fontSize: 14, color: s.done ? "#1e293b" : s.active ? "#d97706" : "#94a3b8", fontWeight: s.active ? 600 : 400 }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#92400e" }}>
                ⏳ Tu solicitud está en cola. La próxima ventana de procesamiento abre el <strong>1 de agosto de 2025</strong>.
              </div>
            </Card>

            {/* Notification */}
            <Card style={{ padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Notificaciones recientes</div>
              {[
                { msg: "Tu pago de $26,000 MXN fue recibido correctamente.", time: "Feb 20", type: "success" },
                { msg: "Tus documentos fueron verificados y están listos para procesarse.", time: "Feb 20", type: "info" },
              ].map((n, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < 1 ? "1px solid #f1f5f9" : "none" }}>
                  <span style={{ fontSize: 16 }}>{n.type === "success" ? "✅" : "ℹ️"}</span>
                  <div>
                    <div style={{ fontSize: 14, color: "#1e293b" }}>{n.msg}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* SUBMIT */}
        {page === "submit" && (
          <div style={{ maxWidth: 700, margin: "0 auto", animation: "fadeIn 0.3s ease" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Nueva Solicitud</h1>
            <p style={{ color: "#64748b", margin: "0 0 24px" }}>Incentivo fiscal para vehículo eléctrico o híbrido</p>

            {/* Progress bar */}
            <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
              {["Información personal", "Vehículo y documentos", "Pago"].map((s, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ height: 4, borderRadius: 4, background: i < submitStep ? "#1e3a5f" : i === submitStep - 1 ? "#2563eb" : "#e2e8f0" }} />
                  <div style={{ fontSize: 11, color: i < submitStep ? "#1e3a5f" : "#94a3b8", fontWeight: i === submitStep - 1 ? 600 : 400, textAlign: "center" }}>
                    {s}
                  </div>
                </div>
              ))}
            </div>

            <Card style={{ padding: 28 }}>
              {submitStep === 1 && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 600 }}>Datos personales</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {[["Nombre completo", "Carlos Mendoza García"], ["RFC", "MEGC850412HDF"], ["CURP", "MEGC850412HDFNRL07"], ["Fecha de nacimiento", "1985-04-12"], ["Teléfono", "+52 55 1234 5678"], ["Correo electrónico", "carlos@gmail.com"]].map(([label, val]) => (
                      <div key={label}>
                        <label style={{ fontSize: 12, fontWeight: 500, color: "#475569", display: "block", marginBottom: 5 }}>{label}</label>
                        <input style={{ ...styles.input, background: "#f8fafc" }} defaultValue={val} />
                      </div>
                    ))}
                    <div style={{ gridColumn: "1/-1" }}>
                      <label style={{ fontSize: 12, fontWeight: 500, color: "#475569", display: "block", marginBottom: 5 }}>Domicilio completo</label>
                      <input style={{ ...styles.input, background: "#f8fafc" }} defaultValue="Av. Insurgentes Sur 1234, Col. Del Valle, CDMX, 03100" />
                    </div>
                  </div>
                  <div style={{ marginTop: 16, padding: "12px 16px", background: "#f0f9ff", borderRadius: 8, border: "1px solid #bae6fd" }}>
                    <label style={{ fontSize: 13, color: "#0369a1", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <input type="checkbox" /> Ya tengo cuenta en el portal del gobierno — quiero proporcionar mis credenciales
                    </label>
                  </div>
                  <button style={{ ...styles.btn, marginTop: 24, width: "auto", padding: "11px 32px" }} onClick={() => setSubmitStep(2)}>
                    Continuar →
                  </button>
                </div>
              )}

              {submitStep === 2 && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 600 }}>Información del vehículo</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                    {[["Marca", "Nissan"], ["Modelo", "Leaf"], ["Año", "2023"], ["VIN / No. de serie", "1N4AZ1CP4PC123789"]].map(([label, val]) => (
                      <div key={label}>
                        <label style={{ fontSize: 12, fontWeight: 500, color: "#475569", display: "block", marginBottom: 5 }}>{label}</label>
                        <input style={{ ...styles.input, background: "#f8fafc" }} defaultValue={val} />
                      </div>
                    ))}
                    <div style={{ gridColumn: "1/-1", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "14px 16px" }}>
                      <div style={{ fontSize: 12, color: "#15803d", fontWeight: 600, marginBottom: 4 }}>💰 Cálculo de honorarios</div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                        <span style={{ color: "#374151" }}>Valor del vehículo (registro oficial)</span>
                        <span style={{ fontWeight: 700, color: "#15803d" }}>$520,000 MXN</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 4 }}>
                        <span style={{ color: "#374151" }}>Nuestros honorarios (5%)</span>
                        <span style={{ fontWeight: 700, color: "#15803d" }}>$26,000 MXN</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 12 }}>Documentos requeridos</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { label: "Identificación oficial (INE / Pasaporte)", required: true, done: extracted },
                      { label: "Factura o contrato de compraventa", required: true, done: false },
                      { label: "Tarjeta de circulación", required: true, done: false },
                    ].map((doc, i) => (
                      <div key={i} style={{ border: `1.5px dashed ${doc.done ? "#86efac" : "#cbd5e1"}`, borderRadius: 8, padding: "12px 16px", background: doc.done ? "#f0fdf4" : "#fafafa", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500, color: doc.done ? "#15803d" : "#1e293b" }}>
                            {doc.done ? "✓ " : ""}{doc.label}
                          </div>
                          {doc.done && extracted && i === 0 && (
                            <div style={{ fontSize: 12, color: "#059669", marginTop: 3 }}>
                              Extraído: Carlos Mendoza García • MEGC850412 • Vence 2029
                            </div>
                          )}
                        </div>
                        {!doc.done && i === 0 ? (
                          <button onClick={handleUpload} disabled={uploading || extracting} style={{ padding: "6px 14px", background: uploading || extracting ? "#e2e8f0" : "#1e3a5f", color: uploading || extracting ? "#64748b" : "#fff", border: "none", borderRadius: 6, fontSize: 12, cursor: uploading || extracting ? "default" : "pointer", fontWeight: 500, minWidth: 90 }}>
                            {uploading ? "Subiendo..." : extracting ? "Extrayendo..." : "Subir"}
                          </button>
                        ) : !doc.done ? (
                          <button style={{ padding: "6px 14px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Subir</button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  {extracting && (
                    <div style={{ marginTop: 12, padding: "10px 14px", background: "#eff6ff", borderRadius: 8, fontSize: 13, color: "#1d4ed8", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⟳</span>
                      Claude AI está extrayendo los datos del documento...
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                    <button style={{ ...styles.btn, background: "#f1f5f9", color: "#1e293b", width: "auto", padding: "11px 24px" }} onClick={() => setSubmitStep(1)}>← Atrás</button>
                    <button style={{ ...styles.btn, width: "auto", padding: "11px 32px" }} onClick={() => setSubmitStep(3)}>Continuar →</button>
                  </div>
                </div>
              )}

              {submitStep === 3 && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 600 }}>Resumen y pago</h3>
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: 20, marginBottom: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Detalle del servicio</div>
                    {[["Vehículo", "Nissan Leaf 2023"], ["VIN", "1N4AZ1CP4PC123789"], ["Valor registro", "$520,000 MXN"], ["Ventana de procesamiento", "Agosto 15 – Noviembre 14, 2025"]].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #e2e8f0", fontSize: 14 }}>
                        <span style={{ color: "#64748b" }}>{k}</span>
                        <span style={{ fontWeight: 500 }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", fontSize: 17, fontWeight: 700 }}>
                      <span>Total a pagar</span>
                      <span style={{ color: "#1e3a5f" }}>$26,000 MXN</span>
                    </div>
                  </div>
                  <div style={{ padding: "14px 16px", background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 8, fontSize: 13, color: "#92400e", marginBottom: 20 }}>
                    ⏳ Tu solicitud quedará en cola hasta que abra la ventana de procesamiento el <strong>15 de agosto de 2025</strong>.
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button style={{ ...styles.btn, background: "#f1f5f9", color: "#1e293b", width: "auto", padding: "11px 24px" }} onClick={() => setSubmitStep(2)}>← Atrás</button>
                    <button style={{ ...styles.btn, background: "#059669", width: "auto", padding: "11px 32px", flex: 1 }} onClick={() => { showToast("¡Pago procesado! Tu solicitud está en cola."); setPage("dashboard"); }}>
                      💳 Pagar $26,000 MXN
                    </button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* APPLICATIONS */}
        {page === "applications" && (
          <div style={{ maxWidth: 900, margin: "0 auto", animation: "fadeIn 0.3s ease" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 24px" }}>Mis Solicitudes</h1>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[clientProcess, clientApproved].map(p => (
                <Card key={p.id} style={{ padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⚡</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>{p.vehicle.make} {p.vehicle.model} {p.vehicle.year}</div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Ref: {p.id} • {p.created_at}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f" }}>{fmtCurrency(p.fee)}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>Honorarios pagados</div>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                  {p.status === "approved" && (
                    <div style={{ marginTop: 14, padding: "10px 14px", background: "#f0fdf4", borderRadius: 8, fontSize: 13, color: "#15803d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>✅ Aprobado — Folio: {p.portal_confirmation}</span>
                      <button style={{ padding: "4px 12px", background: "#059669", color: "#fff", border: "none", borderRadius: 5, fontSize: 12, cursor: "pointer" }}>Descargar resolución</button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* BILLING */}
        {page === "billing" && (
          <div style={{ maxWidth: 700, margin: "0 auto", animation: "fadeIn 0.3s ease" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 24px" }}>Facturación</h1>
            <Card style={{ padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>Historial de pagos</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                    {["Fecha", "Vehículo", "Monto", "Estado"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600, color: "#475569", fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: "Feb 20, 2025", vehicle: "Nissan Leaf 2023", amount: "$26,000 MXN", status: "Pagado" },
                    { date: "Ago 10, 2024", vehicle: "Audi e-tron 2024", amount: "$82,500 MXN", status: "Pagado" },
                  ].map((r, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px" }}>{r.date}</td>
                      <td style={{ padding: "12px" }}>{r.vehicle}</td>
                      <td style={{ padding: "12px", fontWeight: 600 }}>{r.amount}</td>
                      <td style={{ padding: "12px" }}><span style={{ color: "#059669", fontWeight: 600 }}>✓ {r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

// ── ADMIN PORTAL ───────────────────────────────────────────────────────────
const AdminPortal = () => {
  const [page, setPage] = useState("dashboard");
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState(null);
  const [processes, setProcesses] = useState(MOCK_PROCESSES);
  const [windowOpen, setWindowOpen] = useState(true);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const resolve = (id, newStatus, msg) => {
    setProcesses(prev => prev.map(p => p.id === id ? { ...p, status: newStatus, admin_action_required: false, updated_at: "Just now" } : p));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status: newStatus, admin_action_required: false }));
    showToast(msg);
  };

  const needsAction = processes.filter(p => p.admin_action_required);
  const filtered = filter === "all" ? processes : processes.filter(p => p.status === filter);

  const styles = {
    wrap: { fontFamily: "'DM Sans', system-ui, sans-serif", height: "100vh", display: "flex", flexDirection: "column", background: "#0f172a", color: "#e2e8f0" },
    sidebar: { width: 220, background: "#1e293b", borderRight: "1px solid #334155", display: "flex", flexDirection: "column", padding: "20px 0", flexShrink: 0 },
    sideLink: (active) => ({ padding: "9px 20px", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 10, color: active ? "#fff" : "#94a3b8", background: active ? "#2563eb" : "transparent", borderLeft: active ? "3px solid #60a5fa" : "3px solid transparent", fontWeight: active ? 600 : 400 }),
    main: { flex: 1, overflow: "auto", padding: 24 },
    th: { textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", background: "#1e293b" },
    td: { padding: "14px", borderBottom: "1px solid #1e293b", fontSize: 14 },
  };

  return (
    <div style={styles.wrap}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}} @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {toast && (
        <div style={{ position: "fixed", top: 16, right: 16, zIndex: 999, background: toast.type === "success" ? "#059669" : toast.type === "warning" ? "#d97706" : "#dc2626", color: "#fff", padding: "10px 18px", borderRadius: 8, fontSize: 14, fontWeight: 500, animation: "fadeIn 0.3s ease", boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
          {toast.msg}
        </div>
      )}

      {/* Top bar */}
      <div style={{ background: "#1e293b", borderBottom: "1px solid #334155", padding: "0 24px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 16 }}>
          <span style={{ color: "#60a5fa" }}>⚡</span>
          <span>TrámitesEV</span>
          <span style={{ background: "#dc2626", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 10 }}>ADMIN</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {needsAction.length > 0 && (
            <div style={{ background: "#dc262620", border: "1px solid #dc2626", borderRadius: 8, padding: "5px 12px", fontSize: 13, color: "#f87171", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ animation: "pulse 1.5s infinite", display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#f87171" }} />
              {needsAction.length} acción{needsAction.length > 1 ? "es" : ""} requerida{needsAction.length > 1 ? "s" : ""}
            </div>
          )}
          <div style={{ fontSize: 13, color: "#94a3b8" }}>Admin • María González</div>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={{ padding: "0 20px 16px", fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>Panel principal</div>
          {[
            { id: "dashboard", label: "Dashboard", icon: "⊡" },
            { id: "processes", label: "Todos los trámites", icon: "≡" },
            { id: "actions", label: "Requieren acción", icon: "⚠", badge: needsAction.length },
            { id: "window", label: "Ventana de proceso", icon: "◷" },
            { id: "agents", label: "Estado de agentes", icon: "🤖" },
          ].map(n => (
            <button key={n.id} style={styles.sideLink(page === n.id)} onClick={() => { setPage(n.id); setSelected(null); }}>
              <span>{n.icon}</span>
              <span>{n.label}</span>
              {n.badge > 0 && <span style={{ marginLeft: "auto", background: "#dc2626", color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 11 }}>{n.badge}</span>}
            </button>
          ))}
          <div style={{ padding: "16px 20px 8px", fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 8 }}>Sistema</div>
          {[
            { id: "logs", label: "Logs del agente", icon: "◫" },
          ].map(n => (
            <button key={n.id} style={styles.sideLink(page === n.id)} onClick={() => setPage(n.id)}>
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <main style={styles.main}>

          {/* DASHBOARD */}
          {page === "dashboard" && !selected && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 20px" }}>Panel de control</h1>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
                {[
                  { label: "Total activos", value: processes.filter(p => !["approved","rejected","cancelled"].includes(p.status)).length, color: "#60a5fa", icon: "◷" },
                  { label: "Requieren acción", value: needsAction.length, color: "#f87171", icon: "⚠" },
                  { label: "En monitoreo", value: processes.filter(p => p.status === "monitoring").length, color: "#a78bfa", icon: "👁" },
                  { label: "Aprobados", value: processes.filter(p => p.status === "approved").length, color: "#34d399", icon: "✓" },
                ].map(s => (
                  <div key={s.label} style={{ background: "#1e293b", borderRadius: 10, padding: "16px 18px", border: "1px solid #334155" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
                      <span style={{ fontSize: 20, opacity: 0.6 }}>{s.icon}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Needs action */}
              {needsAction.length > 0 && (
                <div style={{ background: "#1e293b", borderRadius: 10, border: "1px solid #dc262640", padding: 20, marginBottom: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#f87171", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ animation: "pulse 1.5s infinite", display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#f87171" }} />
                    REQUIEREN TU ATENCIÓN
                  </div>
                  {needsAction.map(p => (
                    <div key={p.id} style={{ background: "#0f172a", borderRadius: 8, padding: "14px 16px", marginBottom: 8, border: "1px solid #dc262640", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => { setSelected(p); setPage("processes"); }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{p.client}</div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>{p.vehicle.make} {p.vehicle.model} • {p.id}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <StatusBadge status={p.status} pulse />
                        <span style={{ color: "#94a3b8", fontSize: 18 }}>›</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recent processes table */}
              <div style={{ background: "#1e293b", borderRadius: 10, border: "1px solid #334155", overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #334155", fontSize: 14, fontWeight: 600 }}>Trámites recientes</div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Cliente", "Vehículo", "Estado", "Honorarios", "Última actualización", ""].map(h => (
                        <th key={h} style={styles.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {processes.slice(0, 5).map(p => (
                      <tr key={p.id} style={{ background: p.admin_action_required ? "#dc262608" : "transparent", cursor: "pointer" }}
                        onClick={() => { setSelected(p); setPage("processes"); }}>
                        <td style={{ ...styles.td, color: "#e2e8f0" }}>
                          <div style={{ fontWeight: 500 }}>{p.client}</div>
                          <div style={{ fontSize: 12, color: "#64748b" }}>{p.email}</div>
                        </td>
                        <td style={{ ...styles.td, color: "#94a3b8" }}>{p.vehicle.make} {p.vehicle.model} {p.vehicle.year}</td>
                        <td style={styles.td}><StatusBadge status={p.status} pulse={p.admin_action_required} /></td>
                        <td style={{ ...styles.td, color: "#e2e8f0", fontWeight: 600 }}>{fmtCurrency(p.fee)}</td>
                        <td style={{ ...styles.td, color: "#64748b", fontSize: 12 }}>{p.updated_at}</td>
                        <td style={{ ...styles.td, color: "#60a5fa" }}>Ver →</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROCESSES / DETAIL */}
          {page === "processes" && !selected && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Todos los trámites</h1>
                <div style={{ display: "flex", gap: 8 }}>
                  {["all", "queued", "needs_captcha", "monitoring", "approved"].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${filter === f ? "#2563eb" : "#334155"}`, background: filter === f ? "#2563eb" : "#1e293b", color: filter === f ? "#fff" : "#94a3b8", fontSize: 12, cursor: "pointer" }}>
                      {f === "all" ? "Todos" : STATUS_CONFIG[f]?.label || f}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ background: "#1e293b", borderRadius: 10, border: "1px solid #334155", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Cliente", "Vehículo", "Estado", "Honorarios", "Creado", ""].map(h => (
                        <th key={h} style={styles.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p.id} style={{ background: p.admin_action_required ? "#dc262608" : "transparent", cursor: "pointer" }}
                        onClick={() => setSelected(p)}>
                        <td style={{ ...styles.td, borderLeft: p.admin_action_required ? "3px solid #dc2626" : "3px solid transparent" }}>
                          <div style={{ fontWeight: 500, color: "#e2e8f0" }}>{p.client}</div>
                          <div style={{ fontSize: 12, color: "#64748b" }}>{p.id}</div>
                        </td>
                        <td style={{ ...styles.td, color: "#94a3b8" }}>{p.vehicle.make} {p.vehicle.model}</td>
                        <td style={styles.td}><StatusBadge status={p.status} pulse={p.admin_action_required} /></td>
                        <td style={{ ...styles.td, color: "#e2e8f0", fontWeight: 600 }}>{fmtCurrency(p.fee)}</td>
                        <td style={{ ...styles.td, color: "#64748b", fontSize: 12 }}>{p.created_at}</td>
                        <td style={{ ...styles.td, color: "#60a5fa" }}>Ver →</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROCESS DETAIL */}
          {selected && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", color: "#60a5fa", cursor: "pointer", fontSize: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 4 }}>
                ← Volver
              </button>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 300px", gap: 16 }}>
                {/* Left — client info */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ background: "#1e293b", borderRadius: 10, border: "1px solid #334155", padding: 18 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Cliente</div>
                    <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{selected.client}</div>
                    <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>{selected.email}</div>
                    {[
                      ["Vehículo", `${selected.vehicle.make} ${selected.vehicle.model} ${selected.vehicle.year}`],
                      ["VIN", selected.vehicle.vin],
                      ["Valor registro", fmtCurrency(selected.vehicle.value)],
                      ["Honorarios", fmtCurrency(selected.fee)],
                      ["Referencia", selected.id],
                      ...(selected.portal_confirmation ? [["Folio portal", selected.portal_confirmation]] : []),
                      ...(selected.portal_email ? [["Email portal", selected.portal_email]] : []),
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #1e293b", fontSize: 13 }}>
                        <span style={{ color: "#64748b" }}>{k}</span>
                        <span style={{ color: "#e2e8f0", fontWeight: 500, fontSize: 12, textAlign: "right", maxWidth: 160 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "#1e293b", borderRadius: 10, border: "1px solid #334155", padding: 18 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Documentos</div>
                    {["INE / Pasaporte", "Factura de compra", "Tarjeta de circulación"].map((d, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #0f172a" }}>
                        <span style={{ fontSize: 13, color: "#94a3b8" }}>📄 {d}</span>
                        <span style={{ fontSize: 11, color: "#34d399", background: "#34d39915", padding: "2px 8px", borderRadius: 10 }}>Verificado</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Middle — timeline */}
                <div style={{ background: "#1e293b", borderRadius: 10, border: "1px solid #334155", padding: 18 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Historial del proceso</div>
                  {selected.steps.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700,
                          background: s.status === "ok" ? "#059669" : s.status === "pending" ? "#d97706" : "#dc2626",
                          color: "#fff"
                        }}>
                          {s.status === "ok" ? "✓" : s.status === "pending" ? "●" : "✗"}
                        </div>
                        {i < selected.steps.length - 1 && <div style={{ width: 1, flex: 1, background: "#334155", marginTop: 4 }} />}
                      </div>
                      <div style={{ paddingBottom: 14 }}>
                        <div style={{ fontSize: 13, color: s.status === "pending" ? "#fbbf24" : "#e2e8f0", fontWeight: s.status === "pending" ? 600 : 400 }}>{s.step}</div>
                        <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{s.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right — actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ background: "#1e293b", borderRadius: 10, border: "1px solid #334155", padding: 18 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Estado actual</div>
                    <StatusBadge status={selected.status} pulse={selected.admin_action_required} />
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>Actualizado: {selected.updated_at}</div>
                  </div>

                  {/* CAPTCHA action */}
                  {selected.status === "needs_captcha" && (
                    <div style={{ background: "#1e293b", borderRadius: 10, border: "1px solid #d97706", padding: 18 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                        ⚠ Acción requerida: CAPTCHA
                      </div>
                      <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 14px", lineHeight: 1.5 }}>
                        El agente pausó porque encontró un CAPTCHA en el portal. Por favor entra al portal y resuélvelo, luego marca como resuelto.
                      </p>
                      <a href="#" style={{ display: "block", textAlign: "center", padding: "8px", background: "#334155", color: "#60a5fa", borderRadius: 6, fontSize: 13, textDecoration: "none", marginBottom: 10 }}>
                        🔗 Abrir portal del gobierno
                      </a>
                      <button onClick={() => resolve(selected.id, "captcha_resolved", "✅ CAPTCHA marcado como resuelto. Agente reanudando...")} style={{ width: "100%", padding: "10px", background: "#059669", color: "#fff", border: "none", borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                        ✓ CAPTCHA resuelto
                      </button>
                    </div>
                  )}

                  {/* Email confirm action */}
                  {selected.status === "needs_email_confirmation" && (
                    <div style={{ background: "#1e293b", borderRadius: 10, border: "1px solid #d97706", padding: 18 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                        ⚠ Acción requerida: Confirmar email
                      </div>
                      <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 10px", lineHeight: 1.5 }}>
                        El portal envió un correo de confirmación. Accede al buzón y da clic en el enlace de confirmación.
                      </p>
                      <div style={{ background: "#0f172a", borderRadius: 6, padding: "8px 12px", fontSize: 12, color: "#60a5fa", marginBottom: 12, wordBreak: "break-all" }}>
                        📧 {selected.portal_email}
                      </div>
                      <button onClick={() => resolve(selected.id, "email_confirmed", "✅ Email confirmado. Agente reanudando...")} style={{ width: "100%", padding: "10px", background: "#059669", color: "#fff", border: "none", borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                        ✓ Email confirmado
                      </button>
                    </div>
                  )}

                  {/* Monitoring state */}
                  {selected.status === "monitoring" && (
                    <div style={{ background: "#1e293b", borderRadius: 10, border: "1px solid #2563eb", padding: 18 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#60a5fa", marginBottom: 8 }}>👁 Agente monitoreando</div>
                      <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                        El agente revisa el correo del portal cada 20 minutos. Se te notificará ante cualquier novedad.
                      </p>
                      <div style={{ fontSize: 12, color: "#475569", marginTop: 10 }}>Folio: <span style={{ color: "#60a5fa" }}>{selected.portal_confirmation}</span></div>
                    </div>
                  )}

                  {/* Approved state */}
                  {selected.status === "approved" && (
                    <div style={{ background: "#1e293b", borderRadius: 10, border: "1px solid #059669", padding: 18 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#34d399", marginBottom: 8 }}>✅ Trámite aprobado</div>
                      <button style={{ width: "100%", padding: "8px", background: "#059669", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>
                        Descargar resolución
                      </button>
                    </div>
                  )}

                  {/* Override */}
                  <div style={{ background: "#1e293b", borderRadius: 10, border: "1px solid #334155", padding: 18 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Acciones manuales</div>
                    <select style={{ width: "100%", padding: "8px 10px", background: "#0f172a", border: "1px solid #334155", borderRadius: 6, color: "#e2e8f0", fontSize: 13, marginBottom: 8 }}>
                      <option>Cambiar estado...</option>
                      <option>on_hold</option>
                      <option>error</option>
                      <option>cancelled</option>
                    </select>
                    <textarea placeholder="Nota del admin..." style={{ width: "100%", padding: "8px 10px", background: "#0f172a", border: "1px solid #334155", borderRadius: 6, color: "#e2e8f0", fontSize: 13, resize: "vertical", minHeight: 70, boxSizing: "border-box", fontFamily: "inherit" }} />
                    <button style={{ width: "100%", padding: "8px", background: "#334155", color: "#e2e8f0", border: "none", borderRadius: 6, fontSize: 13, cursor: "pointer", marginTop: 6 }}>
                      Guardar cambio
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WINDOW CONTROL */}
          {page === "window" && (
            <div style={{ animation: "fadeIn 0.3s ease", maxWidth: 700 }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 20px" }}>Ventanas de procesamiento</h1>
              {[
                { name: "Ciclo 1 — 2026", open: "1 Marzo 2026", close: "31 Mayo 2026", status: "open", queued: 12, processed: 8 },
                { name: "Ciclo 2 — 2026", open: "15 Agosto 2026", close: "14 Noviembre 2026", status: "upcoming", queued: 0, processed: 0 },
              ].map((w, i) => (
                <div key={i} style={{ background: "#1e293b", borderRadius: 10, border: `1px solid ${w.status === "open" ? "#2563eb" : "#334155"}`, padding: 20, marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{w.name}</div>
                      <div style={{ fontSize: 13, color: "#64748b" }}>{w.open} → {w.close}</div>
                    </div>
                    <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: w.status === "open" ? "#2563eb20" : "#33415520", color: w.status === "open" ? "#60a5fa" : "#64748b", border: `1px solid ${w.status === "open" ? "#2563eb" : "#334155"}` }}>
                      {w.status === "open" ? "🟢 Activa" : "⏳ Próxima"}
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
                    <div style={{ background: "#0f172a", borderRadius: 7, padding: 12, textAlign: "center" }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: "#60a5fa" }}>{w.queued}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>En cola</div>
                    </div>
                    <div style={{ background: "#0f172a", borderRadius: 7, padding: 12, textAlign: "center" }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: "#34d399" }}>{w.processed}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>Procesados</div>
                    </div>
                  </div>
                  {w.status === "open" && (
                    <button onClick={() => showToast("⚠️ Ventana cerrada. 4 solicitudes pasadas a siguiente ciclo.", "warning")} style={{ marginTop: 14, width: "100%", padding: "9px", background: "#dc262620", color: "#f87171", border: "1px solid #dc2626", borderRadius: 7, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
                      Cerrar ventana manualmente
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* AGENTS */}
          {page === "agents" && (
            <div style={{ animation: "fadeIn 0.3s ease", maxWidth: 700 }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 20px" }}>Estado de agentes</h1>
              {[
                { name: "Agente de incorporación", desc: "Procesa nuevos clientes en el portal del gobierno", status: "active", last: "Hace 2 min", queue: 4, done: 8, color: "#34d399" },
                { name: "Monitor de correos", desc: "Revisa los correos del portal cada 20 minutos", status: "active", last: "Hace 8 min", queue: 3, done: 45, color: "#60a5fa" },
              ].map((a, i) => (
                <div key={i} style={{ background: "#1e293b", borderRadius: 10, border: `1px solid ${a.color}30`, padding: 20, marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, display: "inline-block", animation: "pulse 2s infinite" }} />
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{a.name}</span>
                      </div>
                      <div style={{ fontSize: 13, color: "#64748b" }}>{a.desc}</div>
                    </div>
                    <span style={{ fontSize: 12, color: a.color, background: `${a.color}15`, padding: "3px 10px", borderRadius: 10, border: `1px solid ${a.color}30` }}>En línea</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                    {[["Último heartbeat", a.last], ["En cola", a.queue], ["Completados hoy", a.done]].map(([k, v]) => (
                      <div key={k} style={{ background: "#0f172a", borderRadius: 7, padding: 10, textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>{v}</div>
                        <div style={{ fontSize: 11, color: "#475569" }}>{k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Recent logs */}
              <div style={{ background: "#1e293b", borderRadius: 10, border: "1px solid #334155", padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Logs recientes</div>
                {[
                  { agent: "onboarding", action: "navigate_to_portal", status: "success", detail: "Navegó al portal SAT", time: "14:32" },
                  { agent: "onboarding", action: "captcha_detected", status: "warning", detail: "CAPTCHA detectado — esperando admin", time: "14:32" },
                  { agent: "email_monitor", action: "check_inbox", status: "success", detail: "Revisó 3 buzones, 0 emails nuevos", time: "14:20" },
                  { agent: "onboarding", action: "form_filled", status: "success", detail: "APP-2024-002: Formulario completado", time: "09:30" },
                  { agent: "email_monitor", action: "email_classified", status: "success", detail: "Email de SAT clasificado: status_update", time: "09:15" },
                ].map((log, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: i < 4 ? "1px solid #0f172a" : "none", alignItems: "flex-start" }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>{log.status === "success" ? "✅" : log.status === "warning" ? "⚠️" : "❌"}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: "#e2e8f0" }}>{log.detail}</div>
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 1 }}>{log.agent} • {log.action} • {log.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIONS */}
          {page === "actions" && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 20px" }}>Requieren tu atención</h1>
              {needsAction.length === 0 ? (
                <div style={{ background: "#1e293b", borderRadius: 10, border: "1px solid #334155", padding: 40, textAlign: "center", color: "#475569" }}>
                  ✅ No hay acciones pendientes en este momento.
                </div>
              ) : needsAction.map(p => (
                <div key={p.id} style={{ background: "#1e293b", borderRadius: 10, border: "1px solid #d97706", padding: 20, marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{p.client}</div>
                      <div style={{ fontSize: 13, color: "#64748b" }}>{p.vehicle.make} {p.vehicle.model} • {p.id}</div>
                    </div>
                    <StatusBadge status={p.status} pulse />
                  </div>
                  <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 14px" }}>
                    {p.admin_action_type === "captcha" ? "El agente encontró un CAPTCHA y está esperando que lo resuelvas manualmente en el portal del gobierno." : "El portal del gobierno envió un correo de confirmación. Accede al buzón y confirma el enlace."}
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setSelected(p); setPage("processes"); }} style={{ padding: "8px 16px", background: "#334155", color: "#e2e8f0", border: "none", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>
                      Ver detalle
                    </button>
                    <button onClick={() => resolve(p.id, p.admin_action_type === "captcha" ? "captcha_resolved" : "email_confirmed", `✅ Resuelto para ${p.client}`)} style={{ padding: "8px 16px", background: "#059669", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
                      ✓ Marcar como resuelto
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {page === "logs" && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 20px" }}>Logs del sistema</h1>
              <div style={{ background: "#0f172a", borderRadius: 10, border: "1px solid #334155", padding: 20, fontFamily: "monospace", fontSize: 12, color: "#94a3b8", lineHeight: 1.8 }}>
                {[
                  ["14:32:05", "INFO", "onboarding", "APP-2024-001 | navigate | Portal SAT cargado correctamente"],
                  ["14:32:18", "WARN", "onboarding", "APP-2024-001 | captcha_detected | CAPTCHA encontrado en paso 3"],
                  ["14:32:18", "INFO", "onboarding", "APP-2024-001 | paused | Estado → needs_captcha. Notificando admin"],
                  ["14:20:00", "INFO", "email_monitor", "Iniciando ciclo de revisión. 2 buzones activos"],
                  ["14:20:03", "INFO", "email_monitor", "APP-2024-002 | check_inbox | 0 emails nuevos"],
                  ["14:20:05", "INFO", "email_monitor", "APP-2024-005 | check_inbox | 0 emails nuevos"],
                  ["14:20:05", "INFO", "email_monitor", "Ciclo completado en 5.2s"],
                  ["09:30:45", "INFO", "onboarding", "APP-2024-002 | submit | Solicitud enviada. Folio: SAT-2025-789456"],
                  ["09:15:12", "INFO", "email_monitor", "APP-2024-004 | email_classified | Tipo: approved"],
                ].map(([time, level, agent, msg], i) => (
                  <div key={i} style={{ color: level === "WARN" ? "#fbbf24" : level === "ERROR" ? "#f87171" : "#94a3b8" }}>
                    <span style={{ color: "#475569" }}>{time}</span> <span style={{ color: level === "WARN" ? "#fbbf24" : level === "ERROR" ? "#f87171" : "#34d399" }}>[{level}]</span> <span style={{ color: "#60a5fa" }}>[{agent}]</span> {msg}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// ── ROOT ───────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("client");
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Toggle bar */}
      <div style={{ background: "#020617", padding: "8px 16px", display: "flex", gap: 8, alignItems: "center", borderBottom: "1px solid #1e293b", flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: "#475569", marginRight: 4 }}>Vista:</span>
        {[["client", "👤 Portal del Cliente"], ["admin", "🔐 Panel de Admin"]].map(([v, label]) => (
          <button key={v} onClick={() => setView(v)} style={{ padding: "5px 14px", borderRadius: 6, border: "none", background: view === v ? "#2563eb" : "#1e293b", color: view === v ? "#fff" : "#64748b", fontSize: 13, cursor: "pointer", fontWeight: view === v ? 600 : 400 }}>
            {label}
          </button>
        ))}
        <span style={{ fontSize: 11, color: "#334155", marginLeft: 8 }}>— Prototipo interactivo TrámitesEV</span>
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        {view === "client" ? <ClientPortal /> : <AdminPortal />}
      </div>
    </div>
  );
}
