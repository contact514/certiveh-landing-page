interface CertiVehLogoProps {
  width?: number;
  height?: number;
  variant?: 'default' | 'light';
  iconOnly?: boolean;
  compact?: boolean;
}

export function CertiVehLogo({ 
  width = 200, 
  height = 50, 
  variant = 'default',
  iconOnly = false,
  compact = false
}: CertiVehLogoProps) {
  const textColor = variant === 'light' ? '#FFFFFF' : '#0F172A';
  const primaryColor = '#059669'; // emerald-600
  const accentColor = '#14B8A6'; // teal-500
  
  if (iconOnly) {
    return (
      <svg width={width} height={height} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CertiVeh logo">
        <defs>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={accentColor} />
          </linearGradient>
        </defs>
        
        {/* Shield Badge */}
        <path 
          d="M50 10 L80 25 L80 50 C80 65 70 77 50 85 C30 77 20 65 20 50 L20 25 L50 10 Z" 
          fill="url(#shieldGradient)"
        />
        
        {/* Electric Bolt */}
        <path 
          d="M55 28 L42 52 L48 52 L45 72 L58 48 L52 48 L55 28 Z" 
          fill="white"
        />
      </svg>
    );
  }

  const logoWidth = compact ? 240 : 320;
  const logoHeight = compact ? 60 : 80;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${logoWidth} ${logoHeight}`} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CertiVeh - Certificación Vehicular">
      <defs>
        <linearGradient id={`shieldGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={accentColor} />
        </linearGradient>
      </defs>
      
      {/* Icon/Badge */}
      <g transform={compact ? "translate(5, 10) scale(0.5)" : "translate(5, 5) scale(0.65)"}>
        {/* Shield Badge */}
        <path 
          d="M50 10 L80 25 L80 50 C80 65 70 77 50 85 C30 77 20 65 20 50 L20 25 L50 10 Z" 
          fill={`url(#shieldGrad-${variant})`}
        />
        
        {/* Electric Bolt */}
        <path 
          d="M55 28 L42 52 L48 52 L45 72 L58 48 L52 48 L55 28 Z" 
          fill="white"
        />
      </g>
      
      {/* Wordmark */}
      <g transform={compact ? "translate(65, 30)" : "translate(75, 28)"}>
        <text 
          x="0" 
          y="0" 
          fill={textColor} 
          fontSize={compact ? "28" : "32"} 
          fontWeight="700" 
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="-0.5"
        >
          Certi<tspan fill={primaryColor}>Veh</tspan>
        </text>
        {!compact && (
          <text 
            x="0" 
            y="20" 
            fill={variant === 'light' ? 'rgba(255,255,255,0.7)' : '#64748B'} 
            fontSize="11" 
            fontWeight="500" 
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="1.5"
          >
            CERTIFICACIÓN VEHICULAR
          </text>
        )}
      </g>
    </svg>
  );
}