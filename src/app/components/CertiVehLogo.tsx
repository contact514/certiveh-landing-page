// CertiVehLogo — marca 2026-11 (DESIGN_SYSTEM.md §0, BRAND_MANUAL.md «Logo»): el escudo en un solo verde plano
// #047857 con el rayo blanco y la palabra «CertiVeh» en una sola tinta. Sin degradado, sin «Veh» en verde y sin la
// bajada «CERTIFICACIÓN VEHICULAR». Hoy ninguna página lo monta: la barra pinta su propio logo (Navbar.tsx, `Logo`).
interface CertiVehLogoProps {
  width?: number;
  height?: number;
  variant?: 'default' | 'light';
  iconOnly?: boolean;
  compact?: boolean;
}

const SHIELD = "M32 4 L56 16 L56 36 C56 50 46 60 32 64 C18 60 8 50 8 36 L8 16 Z";
const BOLT = "M36 18 L26 38 L32 38 L28 56 L42 36 L36 36 Z";

export function CertiVehLogo({
  width = 200,
  height = 50,
  variant = 'default',
  iconOnly = false,
  compact = false
}: CertiVehLogoProps) {
  const ink = variant === 'light' ? '#FFFFFF' : '#0F172A';

  if (iconOnly) {
    return (
      <svg width={width} height={height} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CertiVeh logo">
        <path d={SHIELD} fill="#047857" />
        <path d={BOLT} fill="#FFFFFF" />
      </svg>
    );
  }

  const w = compact ? 240 : 320;
  const h = compact ? 60 : 80;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${w} ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CertiVeh">
      <g transform={compact ? "translate(4,4) scale(0.82)" : "translate(4,6) scale(1.06)"}>
        <path d={SHIELD} fill="#047857" />
        <path d={BOLT} fill="#FFFFFF" />
      </g>
      <text
        x={compact ? 64 : 84}
        y={compact ? 40 : 52}
        fill={ink}
        fontSize={compact ? 30 : 40}
        fontWeight="700"
        fontFamily="'Albert Sans', 'Helvetica Neue', Arial, sans-serif"
        letterSpacing="-0.03em"
      >
        CertiVeh
      </text>
    </svg>
  );
}
