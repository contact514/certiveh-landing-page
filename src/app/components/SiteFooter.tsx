/**
 * **El pie de página de certiveh.co, uno solo para todas las páginas** (estándar visual 2026-11,
 * DESIGN_SYSTEM.md §0).
 *
 * Hasta noviembre de 2026 había NUEVE copias escritas a mano —la home, el blog, nosotros, aliados,
 * vehículos y su ficha, términos, privacidad y api-docs—, cada una con sus propias clases. El texto
 * coincidía; el estilo no, y cada cambio había que hacerlo nueve veces. Ahora todas montan este.
 *
 * Los enlaces se conservan EXACTOS en las dos variantes que existían: en la home las secciones son
 * anclas locales (`#beneficios`) y en el resto apuntan a la home (`/#beneficios`) con la barra final
 * que usaban esas páginas. No los «normalices»: cambiarlos es cambiar URLs que Google ya tiene.
 *
 * Se monta sin `client:*`: es HTML estático, no necesita JavaScript.
 *
 * **La variante de otra vertical** (`/otros-activos`, la isla `EmpresasLanding`) tiene su propio contenido —otra
 * frase, tres columnas con anclas locales y sin el «Empezar ahora» del portal de vehículos—. Lo pasa por props
 * (`tagline`, `columns`, `cta={null}`) y conserva el mismo estilo; sus textos y enlaces no se tocan.
 *
 * **`homeLink`**: los dos documentos legales llevaban el logo del pie enlazado a la home
 * (`<a href="/" aria-label="Ir al inicio CertiVeh">`). Con `homeLink` la baldosa de la palabra conserva ese
 * enlace; las demás páginas no lo tenían y no lo ganan.
 */
const CSS = `
  .sf { padding: 8px; font-family: var(--cv-font); }
  .sf-board { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 8px; }
  .sf-t { background: var(--cv-tone); color: var(--cv-ink); border-radius: var(--cv-r); padding: 24px; min-width: 0; }
  .sf-t .sf-h { font-size: 1rem; font-weight: 700; letter-spacing: -0.01em; margin: 0 0 12px; }
  .sf-t ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
  .sf-t a { color: var(--cv-ink); text-decoration: none; }
  .sf-t a:hover { color: var(--cv-accent); }
  .sf-t a:focus-visible, .sf-go:focus-visible { outline: 3px solid var(--cv-accent); outline-offset: 3px; border-radius: 2px; }
  .sf-st { grid-column: span 4; display: flex; flex-direction: column; justify-content: space-between; gap: 24px; min-height: 220px; }
  .sf-st p { margin: 0; font-size: 1.25rem; font-weight: 600; letter-spacing: -0.02em; line-height: 1.3; }
  .sf-st small { font-size: 0.875rem; color: var(--cv-soft); }
  .sf-n { grid-column: span 2; }
  .sf-word { grid-column: span 8; background: var(--cv-field); color: #fff; min-height: 300px; display: flex; align-items: flex-end; overflow: hidden; }
  a.sf-word { text-decoration: none; transition: background-color .15s; }
  a.sf-word:hover { background: var(--cv-field-2); }
  a.sf-word:focus-visible { outline: 3px solid var(--cv-accent); outline-offset: 3px; }
  .sf-word span { font-size: clamp(3.5rem, 1.8rem + 7vw, 9rem); font-weight: var(--cv-wh); letter-spacing: -0.04em; line-height: .8; }
  .sf-go { grid-column: span 4; background: var(--cv-accent); color: #fff; min-height: 300px; display: flex; flex-direction: column; justify-content: space-between; text-decoration: none; border-radius: var(--cv-r); padding: 24px; transition: background-color .15s; }
  .sf-go:hover { background: var(--cv-accent-hover); }
  .sf-go b { font-size: 1.75rem; letter-spacing: var(--cv-trk); }
  .sf-go svg { align-self: flex-end; transition: transform .15s; }
  .sf-go:hover svg { transform: translate(4px, -4px); }
  .sf-contact { grid-column: span 12; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
  .sf-contact a.mail { font-size: 1.125rem; font-weight: 600; color: var(--cv-accent); }
  .sf-social { display: flex; gap: 8px; }
  .sf-social a { width: 44px; height: 44px; display: grid; place-items: center; border-radius: var(--cv-r); background: var(--cv-bg); color: var(--cv-ink); }
  .sf-social a:hover { color: var(--cv-accent); }
  /* tres columnas: la frase ocupa la mitad; sin el botón del portal, la palabra va a todo el ancho */
  .sf-c3 .sf-st { grid-column: span 6; }
  .sf-nogo .sf-word { grid-column: span 12; }
  @media (max-width: 900px) {
    .sf-board { gap: 6px; }
    .sf-word { grid-column: 1 / -1; min-height: 170px; order: -2; }
    .sf-go { grid-column: 1 / -1; min-height: 150px; order: -1; }
    .sf-st, .sf-contact { grid-column: 1 / -1; min-height: 0; }
    .sf-n { grid-column: span 6; }
    .sf-c3 .sf-st, .sf-nogo .sf-word { grid-column: 1 / -1; }
  }
  /* Celular: cada enlace es un blanco de toque de 44 px (antes 20 px de alto, a 8 px del siguiente), y la palabra y el
     botón del portal sin el alto de escritorio. */
  @media (max-width: 640px) {
    .sf-t ul { gap: 0; }
    .sf-t li a { display: flex; align-items: center; min-height: 44px; }
    .sf-contact a.mail { display: inline-flex; align-items: center; min-height: 44px; }
    .sf-t .sf-h { margin-bottom: 4px; }
    .sf-word { min-height: 128px; }
    .sf-go { min-height: 120px; }
  }
`;

const ENLACES = (isHome: boolean) => [
  { label: "Plataforma", links: [
    { text: "Beneficios", href: isHome ? "#beneficios" : "/#beneficios" },
    { text: "Servicios", href: isHome ? "#servicios" : "/#servicios" },
    { text: "Cómo funciona", href: isHome ? "#como-funciona" : "/#como-funciona" },
    { text: "Calculadora", href: isHome ? "#calculadora" : "/#calculadora" },
  ] },
  { label: "Recursos", links: [
    { text: "Vehículos", href: "/vehiculos/" },
    { text: "Blog", href: isHome ? "/blog" : "/blog/" },
    { text: "API", href: isHome ? "/api-docs" : "/api-docs/" },
  ] },
  { label: "Empresa", links: [
    { text: "Quiénes somos", href: "/nosotros/" },
    { text: "Programa de Aliados", href: isHome ? "/aliados" : "/aliados/" },
    { text: "Otros activos (GEE/FNCE)", href: "/otros-activos" },
  ] },
  { label: "Legal", links: [
    { text: "Términos y Condiciones", href: "/terminos-y-condiciones" },
    { text: "Política de Privacidad", href: "/politica-de-privacidad" },
  ] },
];

type Columna = { label: string; links: { text: string; href: string }[] };

export function SiteFooter({
  isHome = false,
  portalUrl = "https://portal.certiveh.co",
  tagline = "Certificado UPME y gestión de la devolución de IVA para vehículos eléctricos e híbridos en Colombia.",
  columns,
  cta = { href: portalUrl, label: "Empezar ahora" },
  homeLink = false,
}: {
  isHome?: boolean;
  portalUrl?: string;
  tagline?: string;
  columns?: Columna[];
  cta?: { href: string; label: string } | null;
  homeLink?: boolean;
}) {
  const cols = columns ?? ENLACES(isHome);
  const board = ["sf-board", cols.length === 3 ? "sf-c3" : "", cta ? "" : "sf-nogo"].filter(Boolean).join(" ");
  return (
    <footer className="sf" aria-label="Pie de página">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className={board}>
        <div className="sf-t sf-st">
          <p>{tagline}</p>
          <small>© 2026 CertiVeh · Certificados de Beneficio Tributario · Colombia</small>
        </div>
        {cols.map(col => (
          <nav key={col.label} className="sf-t sf-n" aria-label={col.label}>
            <p className="sf-h">{col.label}</p>
            <ul>{col.links.map(l => <li key={l.text}><a href={l.href}>{l.text}</a></li>)}</ul>
          </nav>
        ))}
        {homeLink
          ? <a href="/" aria-label="Ir al inicio CertiVeh" className="sf-t sf-word"><span aria-hidden="true">CertiVeh</span></a>
          : <div className="sf-t sf-word" aria-label="CertiVeh"><span aria-hidden="true">CertiVeh</span></div>}
        {cta && (
          <a className="sf-go" href={cta.href} target="_blank" rel="noopener noreferrer">
            <b>{cta.label}</b>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="4" aria-hidden="true"><path d="M14 42 42 14M20 14h22v22" /></svg>
          </a>
        )}
        <div className="sf-t sf-contact">
          <a className="mail" href="mailto:contacto@certiveh.co">contacto@certiveh.co</a>
          <div className="sf-social">
            <a href="https://www.instagram.com/certiveh/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de CertiVeh">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/certiveh/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de CertiVeh">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61589443583623" target="_blank" rel="noopener noreferrer" aria-label="Facebook de CertiVeh">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
