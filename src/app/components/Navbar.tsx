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
  .shared-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: transparent;
    backdrop-filter: none;
    border-bottom: 1px solid transparent;
    padding: 0 48px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    box-sizing: border-box;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    transition: background 0.3s, border-color 0.3s, backdrop-filter 0.3s;
  }
  .shared-nav.scrolled {
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(12px);
    border-bottom-color: #E2E8F0;
  }
  .shared-nav-logo { text-decoration: none; display: flex; align-items: center; }
  .shared-nav-links { display: flex; align-items: center; gap: 32px; }
  .shared-nav-links a {
    font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.75);
    text-decoration: none; transition: color 0.3s;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  }
  .shared-nav-links a:hover { color: #34D399; }
  .shared-nav.scrolled .shared-nav-links a { color: #475569; }
  .shared-nav.scrolled .shared-nav-links a:hover { color: #059669; }
  .shared-nav-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, #059669 0%, #14B8A6 100%); color: #fff;
    border: none; border-radius: 12px;
    padding: 10px 22px; font-size: 14px; font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    transition: transform 0.1s, box-shadow 0.2s;
    line-height: normal;
    box-shadow: 0 2px 10px rgba(5,150,105,0.25);
  }
  .shared-nav-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(5,150,105,0.35); }
  .shared-mobile-btn {
    display: none; background: none; border: none;
    cursor: pointer; padding: 8px; color: rgba(255,255,255,0.8);
    transition: color 0.3s;
  }
  .shared-nav.scrolled .shared-mobile-btn { color: #334155; }
  .shared-mobile-menu {
    position: fixed; top: 64px; left: 0; right: 0;
    background: white; border-bottom: 1px solid #E2E8F0;
    padding: 20px; z-index: 99;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transform: translateY(-100%); opacity: 0;
    transition: transform 0.25s ease, opacity 0.2s ease;
    pointer-events: none;
    display: flex; flex-direction: column; gap: 4px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  }
  .shared-mobile-menu.open { transform: translateY(0); opacity: 1; pointer-events: auto; }
  .shared-mobile-menu a {
    padding: 12px 8px; font-size: 15px; font-weight: 500;
    color: #334155; text-decoration: none; border-radius: 8px;
    transition: background 0.15s; display: block;
  }
  .shared-mobile-menu a:hover { background: #F8FAFC; }
  .shared-mobile-overlay {
    display: none; position: fixed; inset: 0; z-index: 98;
  }
  @media (max-width: 768px) {
    .shared-nav { padding: 0 20px; }
    .shared-nav-links { display: none; }
    .shared-mobile-btn { display: flex; }
    .shared-mobile-overlay { display: block; }
  }
`;

// Logo SVG identical to CertiVehLogo compact
function Logo({ scrolled }: { scrolled: boolean }) {
  return (
    <svg width="180" height="44" viewBox="0 0 240 60" fill="none" role="img" aria-label="Logo CertiVeh" style={{ transition: "all 0.3s" }}>
      <defs>
        <linearGradient id="navLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#059669"/><stop offset="100%" stopColor="#14B8A6"/>
        </linearGradient>
      </defs>
      <g transform="translate(4,8) scale(0.48)">
        <path d="M50 10 L80 25 L80 50 C80 65 70 77 50 85 C30 77 20 65 20 50 L20 25 L50 10 Z" fill="url(#navLogoGrad)"/>
        <path d="M55 28 L42 52 L48 52 L45 72 L58 48 L52 48 L55 28 Z" fill="white"/>
      </g>
      <g transform="translate(60,28)">
        <text x="0" y="0" fill={scrolled ? "#0F172A" : "#FFFFFF"} fontSize="26" fontWeight="700"
          fontFamily="Inter, system-ui, sans-serif" letterSpacing="-0.5" style={{ transition: "fill 0.3s" }}>
          Certi<tspan fill="#059669">Veh</tspan>
        </text>
      </g>
    </svg>
  );
}

interface NavbarProps {
  /** true = links are anchors (#section), false = links go to /#section */
  isHome?: boolean;
  /** true = start transparent over dark hero, false = start solid */
  darkHero?: boolean;
}

export function Navbar({ isHome = true, darkHero = false }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const startTransparent = isHome || darkHero;
  const [scrolled, setScrolled] = useState(!startTransparent);
  const link = (hash: string) => isHome ? hash : `/${hash}`;

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
      <nav className={`shared-nav${scrolled ? " scrolled" : ""}`} aria-label="Navegación principal">
        <a href={link("#hero")} className="shared-nav-logo" aria-label="CertiVeh — inicio">
          <Logo scrolled={scrolled} />
        </a>
        <button className="shared-mobile-btn" onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}>
          <Icon name={mobileOpen ? "x" : "menu"} size={24} />
        </button>
        <div className="shared-nav-links">
          <a href={link("#beneficios")}>Beneficios</a>
          <a href={link("#como-funciona")}>Cómo funciona</a>
          <a href={link("#calculadora")}>Calculadora</a>
          <a href="/blog">Blog</a>
          <a href="/aliados">Aliados</a>
          <a href="/api-docs">API</a>
          <a href="https://portal.certiveh.co" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <button className="shared-nav-btn">
              Empezar ahora <Icon name="arrowRight" size={15} color="white" />
            </button>
          </a>
        </div>
      </nav>

      {mobileOpen && <div className="shared-mobile-overlay" onClick={() => setMobileOpen(false)} />}
      <div className={`shared-mobile-menu${mobileOpen ? " open" : ""}`}>
        <a href={link("#beneficios")} onClick={() => setMobileOpen(false)}>Beneficios</a>
        <a href={link("#como-funciona")} onClick={() => setMobileOpen(false)}>Cómo funciona</a>
        <a href={link("#calculadora")} onClick={() => setMobileOpen(false)}>Calculadora</a>
        <a href="/blog" onClick={() => setMobileOpen(false)}>Blog</a>
        <a href="/aliados" onClick={() => setMobileOpen(false)}>Aliados</a>
        <a href="/api-docs" onClick={() => setMobileOpen(false)}>API</a>
        <a href="https://portal.certiveh.co" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <button className="shared-nav-btn" style={{ width: "100%", justifyContent: "center", padding: "12px 20px" }}
            onClick={() => setMobileOpen(false)}>
            Empezar ahora <Icon name="arrowRight" size={15} color="white" />
          </button>
        </a>
      </div>
    </>
  );
}
