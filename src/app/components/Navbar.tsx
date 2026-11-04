import { useState, useEffect } from "react";

// Inline Icon component (same as in CertiVehLandingComplete)
function Icon({ name, size = 20, color = "currentColor" }: { name: string; size?: number; color?: string }) {
  const paths: Record<string, React.ReactNode> = {
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    menu:       <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    x:          <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

const NAV_CSS = `
  /* Barra sólida y plana (estándar visual 2026-11, DESIGN_SYSTEM.md §0): sin transparencia sobre el hero,
     sin desenfoque, sin sombra. La misma en todas las páginas. */
  .shared-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: var(--cv-bg, #ffffff);
    padding: 0 48px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    box-sizing: border-box;
    font-family: var(--cv-font, 'Albert Sans', 'Helvetica Neue', Arial, sans-serif);
    -webkit-font-smoothing: antialiased;
    transition: background-color .2s ease;
  }
  /* Arriba del todo, en las páginas que empiezan con una cabecera oscura (home y las que pasan darkHero),
     la barra es transparente y su texto blanco: se ve el video o la foto entera. Al bajar 40 px, o al abrir
     el menú del celular, vuelve a ser la barra blanca sólida. */
  .shared-nav:not(.scrolled) { background: transparent; }
  .shared-nav:not(.scrolled) .shared-nav-logo, .shared-nav:not(.scrolled) .shared-nav-links a:not(:last-child) { color: #fff; }
  .shared-nav:not(.scrolled) .shared-nav-links a.nav-vertical { color: var(--cv-mint, #A7F3D0); }
  .shared-nav:not(.scrolled) .shared-nav-links a:not(:last-child):hover { color: var(--cv-mint, #A7F3D0); }
  .shared-nav:not(.scrolled) .shared-mobile-btn { background: rgba(255,255,255,.14); color: #fff; }
  .shared-nav:not(.scrolled) .shared-nav-logo svg path:first-child { fill: #fff; }
  .shared-nav:not(.scrolled) .shared-nav-logo svg path:last-child { fill: var(--cv-accent, #047857); }
  .shared-nav:not(.scrolled) a:focus-visible, .shared-nav:not(.scrolled) .shared-mobile-btn:focus-visible { outline-color: #fff; }
  .shared-nav-logo { text-decoration: none; display: flex; align-items: center; gap: 10px; color: var(--cv-ink, #0F172A); }
  .shared-nav-logo span { font-size: 22px; font-weight: 700; letter-spacing: -0.03em; }
  .shared-nav-links { display: flex; align-items: center; gap: 26px; }
  .shared-nav-links a {
    font-size: 15px; font-weight: 600; color: var(--cv-ink, #0F172A);
    text-decoration: none; transition: color 0.15s;
  }
  .shared-nav-links a:hover { color: var(--cv-accent, #047857); }
  /* link de retorno a la otra vertical: acentuado para que se lea como salida */
  .shared-nav-links a.nav-vertical, .shared-mobile-menu a.nav-vertical { color: var(--cv-accent, #047857); }
  .shared-nav-btn {
    display: inline-flex; align-items: center; gap: 12px;
    background: var(--cv-accent, #047857); color: #fff;
    border: none; border-radius: 6px;
    padding: 12px 16px; font-size: 15px; font-weight: 600; letter-spacing: -0.01em;
    cursor: pointer; font-family: inherit; line-height: 1;
    transition: background-color 0.15s;
  }
  .shared-nav-btn:hover { background: var(--cv-accent-hover, #036B4E); }
  /* Es un enlace (antes un <button> dentro de un <a>: HTML inválido y dos paradas de teclado). Gana a los estilos de
     enlace de la barra y del menú, que lo pintarían en tinta. */
  .shared-nav-links a.shared-nav-btn, .shared-mobile-menu a.shared-nav-btn { color: #fff; text-decoration: none; }
  .shared-nav-links a.shared-nav-btn:hover, .shared-mobile-menu a.shared-nav-btn:hover { color: #fff; background: var(--cv-accent-hover, #036B4E); }
  .shared-mobile-menu a.shared-nav-btn-full { display: flex; width: 100%; justify-content: center; padding: 12px 20px; margin-top: 8px; }
  .shared-nav-btn:focus-visible, .shared-nav a:focus-visible, .shared-mobile-btn:focus-visible { outline: 3px solid var(--cv-accent, #047857); outline-offset: 3px; }
  .shared-mobile-btn {
    display: none; background: var(--cv-tone, #F0F4F2); border: none; border-radius: 6px;
    cursor: pointer; padding: 10px; color: var(--cv-ink, #0F172A);
  }
  /* El menú del celular SÍ flota sobre la página: es el único sitio de la barra con sombra. */
  .shared-mobile-menu {
    position: fixed; top: 64px; left: 0; right: 0;
    background: var(--cv-bg, #ffffff);
    padding: 12px 20px 20px; z-index: 99;
    box-shadow: 0 18px 40px rgba(15,23,42,0.16); /* taste-skill-ignore: el menú del celular flota sobre la página */
    transform: translateY(-100%); opacity: 0; visibility: hidden;
    transition: transform 0.25s ease, opacity 0.2s ease, visibility 0s linear 0.25s;
    pointer-events: none;
    display: flex; flex-direction: column; gap: 2px;
    font-family: var(--cv-font, 'Albert Sans', 'Helvetica Neue', Arial, sans-serif);
  }
  /* cerrado = oculto de verdad (visibility): sus enlaces no se alcanzan con el teclado ni los lee un lector */
  .shared-mobile-menu.open { transform: translateY(0); opacity: 1; visibility: visible; pointer-events: auto; transition: transform 0.25s ease, opacity 0.2s ease; }
  .shared-mobile-menu a {
    padding: 13px 10px; font-size: 16px; font-weight: 600;
    color: var(--cv-ink, #0F172A); text-decoration: none; border-radius: 6px;
    transition: background-color 0.15s; display: block;
  }
  .shared-mobile-menu a:hover { background: var(--cv-tone, #F0F4F2); }
  .shared-mobile-overlay {
    display: none; position: fixed; inset: 0; z-index: 98;
  }
  /* 9 links + CTA + logo no caben con gap 26 por debajo de ~1400px */
  @media (max-width: 1400px) {
    .shared-nav { padding: 0 32px; }
    .shared-nav-links { gap: 20px; }
  }
  @media (max-width: 1100px) {
    .shared-nav { padding: 0 20px; }
    .shared-nav-links { display: none; }
    .shared-mobile-btn { display: flex; }
    .shared-mobile-overlay { display: block; }
  }
  /* Celular: el logo (enlace al inicio) como blanco de toque de 44 px */
  @media (max-width: 640px) { .shared-nav-logo { min-height: 44px; } }
  @media (prefers-reduced-motion: reduce) { .shared-mobile-menu { transition: none; } }
`;

// Logo: escudo en un solo verde (sin degradado) y la palabra en la fuente de la marca, en una sola tinta.
function Logo(_: { scrolled: boolean }) {
  return (
    <>
      <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M32 4 L56 16 L56 36 C56 50 46 60 32 64 C18 60 8 50 8 36 L8 16 Z" fill="#047857"/>
        <path d="M36 18 L26 38 L32 38 L28 56 L42 36 L36 36 Z" fill="white"/>
      </svg>
      <span>CertiVeh</span>
    </>
  );
}

interface NavbarProps {
  /** true = links are anchors (#section), false = links go to /#section */
  isHome?: boolean;
  /** true = start transparent over dark hero, false = start solid */
  darkHero?: boolean;
  /** hashes that exist on this page, so they stay local instead of jumping to home */
  localSections?: string[];
  /** which product vertical this page belongs to; the nav shows a link to the other one */
  vertical?: "vehiculos" | "otros-activos";
}

export function Navbar({ isHome = true, darkHero = false, localSections = [], vertical = "vehiculos" }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const startTransparent = isHome || darkHero;
  const [scrolled, setScrolled] = useState(!startTransparent);
  const link = (hash: string) => (isHome || localSections.includes(hash)) ? hash : `/${hash}`;
  // en /otros-activos el link "Otros activos" seria un self-link muerto: ahi se convierte
  // en la salida etiquetada de vuelta a la vertical de electricos e hibridos
  const otherVertical = vertical === "otros-activos"
    ? { href: "/", text: "Eléctricos e híbridos" }
    : { href: "/otros-activos", text: "Otros activos" };

  useEffect(() => {
    if (!startTransparent) { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [startTransparent]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: NAV_CSS }} />
      <nav className={`shared-nav${scrolled || mobileOpen ? " scrolled" : ""}`} aria-label="Navegación principal">
        <a href={link("#hero")} className="shared-nav-logo" aria-label="CertiVeh - inicio">
          <Logo scrolled={scrolled} />
        </a>
        <button className="shared-mobile-btn" onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}>
          <Icon name={mobileOpen ? "x" : "menu"} size={24} />
        </button>
        <div className="shared-nav-links">
          <a href={link("#beneficios")}>Beneficios</a>
          <a href={link("#servicios")}>Servicios</a>
          <a href={link("#como-funciona")}>Cómo funciona</a>
          <a href={link("#calculadora")}>Calculadora</a>
          <a href="/vehiculos">Vehículos</a>
          <a href="/blog">Blog</a>
          <a href="/aliados">Aliados</a>
          <a href={otherVertical.href} className={vertical === "otros-activos" ? "nav-vertical" : undefined}>{otherVertical.text}</a>
          <a href="/api-docs">API</a>
          <a href="https://portal.certiveh.co" target="_blank" rel="noopener noreferrer" className="shared-nav-btn">
            Empezar ahora <Icon name="arrowRight" size={15} color="white" />
          </a>
        </div>
      </nav>

      {mobileOpen && <div className="shared-mobile-overlay" onClick={() => setMobileOpen(false)} />}
      <div className={`shared-mobile-menu${mobileOpen ? " open" : ""}`}>
        <a href={link("#beneficios")} onClick={() => setMobileOpen(false)}>Beneficios</a>
        <a href={link("#servicios")} onClick={() => setMobileOpen(false)}>Servicios</a>
        <a href={link("#como-funciona")} onClick={() => setMobileOpen(false)}>Cómo funciona</a>
        <a href={link("#calculadora")} onClick={() => setMobileOpen(false)}>Calculadora</a>
        <a href="/vehiculos" onClick={() => setMobileOpen(false)}>Vehículos</a>
        <a href="/blog" onClick={() => setMobileOpen(false)}>Blog</a>
        <a href="/aliados" onClick={() => setMobileOpen(false)}>Aliados</a>
        <a href={otherVertical.href} className={vertical === "otros-activos" ? "nav-vertical" : undefined} onClick={() => setMobileOpen(false)}>{otherVertical.text}</a>
        <a href="/api-docs" onClick={() => setMobileOpen(false)}>API</a>
        <a href="https://portal.certiveh.co" target="_blank" rel="noopener noreferrer" className="shared-nav-btn shared-nav-btn-full"
          onClick={() => setMobileOpen(false)}>
          Empezar ahora <Icon name="arrowRight" size={15} color="white" />
        </a>
      </div>
    </>
  );
}
