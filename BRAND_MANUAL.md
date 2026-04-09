# CertiVeh - Manual de Marca 2026

## 📋 Índice
1. [Logo e Identidad Visual](#logo-e-identidad-visual)
2. [Paleta de Color](#paleta-de-color)
3. [Tipografía](#tipografía)
4. [Iconografía](#iconografía)
5. [Ilustración](#ilustración)
6. [Tono de Voz](#tono-de-voz)
7. [Fotografía](#fotografía)
8. [Reglas de Uso](#reglas-de-uso)

---

## 🎨 Logo e Identidad Visual

### Descripción
El logo de CertiVeh combina un escudo con un rayo eléctrico, simbolizando:
- **Escudo**: Protección, confianza, certificación oficial
- **Rayo**: Energía eléctrica, velocidad, tecnología
- **Gradiente**: Modernidad, innovación, dinamismo

### Componente Logo (React)

```tsx
// CertiVehLogo.tsx
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
      <svg width={width} height={height} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <svg width={width} height={height} viewBox={`0 0 ${logoWidth} ${logoHeight}`} fill="none" xmlns="http://www.w3.org/2000/svg">
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
```

### Uso del Logo

```tsx
// Logo completo - modo oscuro (sobre fondo claro)
<CertiVehLogo width={320} height={80} />

// Logo completo - modo claro (sobre fondo oscuro)
<CertiVehLogo width={320} height={80} variant="light" />

// Versión compacta
<CertiVehLogo width={240} height={60} compact />

// Solo ícono
<CertiVehLogo width={100} height={100} iconOnly />
```

### Variaciones Disponibles

| Variación | Dimensiones | Uso |
|-----------|-------------|-----|
| Logo Completo | 800×200px | Headers, landing pages, documentos oficiales |
| Logo Compacto | 600×150px | Navegación móvil, espacios reducidos |
| Ícono Solo | 512×512px | Favicon, app icons, redes sociales |
| Tamaños Estándar | 16, 32, 48, 64, 128, 256px | Íconos de aplicación |

### Zona de Protección
- **Mínimo**: 25% del alto del logo en todos los lados
- Nunca colocar texto, imágenes u otros elementos dentro de esta zona
- Mantener siempre espacio respirable alrededor del logo

### Tamaños Mínimos
- **Digital**: 120px de ancho mínimo
- **Móvil**: 100px de ancho (usar versión compacta)
- **Impresión**: 30mm de ancho mínimo

---

## 🎨 Paleta de Color

### Colores Principales

#### Verde Esmeralda (Primary)
- **HEX**: `#059669`
- **RGB**: `5, 150, 105`
- **Tailwind**: `emerald-600`
- **Uso**: Color de marca principal, CTAs, elementos interactivos

#### Teal (Accent)
- **HEX**: `#14B8A6`
- **RGB**: `20, 184, 166`
- **Tailwind**: `teal-500`
- **Uso**: Acentos, gradientes, estados hover

#### Gris Pizarra (Neutral)
- **HEX**: `#0F172A`
- **RGB**: `15, 23, 42`
- **Tailwind**: `slate-900`
- **Uso**: Texto principal, fondos oscuros

#### Dorado (Premium)
- **HEX**: `#F59E0B`
- **RGB**: `245, 158, 11`
- **Tailwind**: `amber-500`
- **Uso**: Características premium, destacados de valor

### Escala Completa de Colores

#### Emerald (Primary Scale)
```
emerald-50:  #ECFDF5
emerald-100: #D1FAE5
emerald-200: #A7F3D0
emerald-500: #10B981
emerald-600: #059669 ⭐ Principal
emerald-700: #047857
emerald-800: #065F46
```

#### Teal (Accent Scale)
```
teal-50:  #F0FDFA
teal-100: #CCFBF1
teal-200: #99F6E4
teal-500: #14B8A6 ⭐ Acento
teal-600: #0D9488
teal-700: #0F766E
teal-800: #115E59
```

#### Slate (Neutral Scale)
```
slate-50:  #F8FAFC
slate-100: #F1F5F9
slate-200: #E2E8F0
slate-500: #64748B
slate-700: #334155
slate-900: #0F172A ⭐ Texto/Fondos
slate-950: #020617
```

#### Amber (Premium Scale)
```
amber-100: #FEF3C7
amber-400: #FBBF24
amber-500: #F59E0B ⭐ Premium
amber-600: #D97706
```

### Colores Semánticos

| Propósito | Color | Hex | Uso |
|-----------|-------|-----|-----|
| Success | emerald-600 | #059669 | Confirmaciones, completado |
| Info | blue-600 | #2563EB | Información, enlaces |
| Warning | orange-500 | #F97316 | Advertencias, precaución |
| Error | red-600 | #DC2626 | Errores, acciones destructivas |
| Premium | amber-500 | #F59E0B | Features premium |

### Gradientes

```css
/* Gradiente Principal */
background: linear-gradient(135deg, #059669 0%, #14B8A6 100%);

/* Gradiente Sutil */
background: linear-gradient(135deg, #ECFDF5 0%, #F0FDFA 100%);

/* Gradiente Premium */
background: linear-gradient(135deg, #059669 0%, #F59E0B 100%);
```

---

## ✍️ Tipografía

### Fuentes del Sistema

**Familia Principal**: Inter (Google Fonts)
**Fallback**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`

### Jerarquía Tipográfica

```tsx
// Títulos Display
<h1 className="text-5xl font-bold text-slate-900">
  // 48px, Bold, -0.02em letter-spacing
</h1>

// Títulos H1
<h1 className="text-4xl font-bold text-slate-900">
  // 36px, Bold
</h1>

// Títulos H2
<h2 className="text-3xl font-bold text-slate-900">
  // 30px, Bold
</h2>

// Títulos H3
<h3 className="text-2xl font-semibold text-slate-900">
  // 24px, Semibold
</h3>

// Títulos H4
<h4 className="text-xl font-semibold text-slate-900">
  // 20px, Semibold
</h4>

// Body Large
<p className="text-lg text-slate-700">
  // 18px, Regular, 1.5 line-height
</p>

// Body Default
<p className="text-base text-slate-700">
  // 16px, Regular, 1.5 line-height
</p>

// Body Small
<p className="text-sm text-slate-600">
  // 14px, Regular, 1.5 line-height
</p>

// Caption
<span className="text-xs text-slate-500">
  // 12px, Regular
</span>
```

### Pesos de Fuente

| Peso | Valor | Uso |
|------|-------|-----|
| Regular | 400 | Texto de cuerpo |
| Medium | 500 | Énfasis sutil, labels |
| Semibold | 600 | Subtítulos, botones |
| Bold | 700 | Títulos principales |

---

## 🎯 Iconografía

### Librería: Lucide React

```bash
npm install lucide-react
```

### Iconos del Sistema

```tsx
import { 
  Shield, Zap, Car, FileText, CheckCircle, 
  Upload, Download, AlertCircle, Info,
  ArrowRight, ChevronDown, Menu, X,
  User, Settings, LogOut, Bell,
  Clock, Calendar, MapPin, Phone
} from 'lucide-react';

// Uso básico
<Shield className="w-6 h-6 text-emerald-600" />

// Tamaños estándar
<Icon className="w-4 h-4" /> // 16px - Small
<Icon className="w-5 h-5" /> // 20px - Default
<Icon className="w-6 h-6" /> // 24px - Medium
<Icon className="w-8 h-8" /> // 32px - Large
```

### Iconos Clave de CertiVeh

| Ícono | Contexto | Uso |
|-------|----------|-----|
| `Shield` | Certificación, seguridad | Logo, protección de datos |
| `Zap` | Eléctrico, velocidad | Vehículos eléctricos, rapidez del proceso |
| `Car` | Vehículos | Contexto general de autos |
| `FileText` | Documentos | Certificados, formularios |
| `CheckCircle` | Éxito | Confirmaciones, completado |
| `Upload` | Subir archivos | Carga de documentos |
| `AlertCircle` | Advertencia | Mensajes importantes |

---

## 🎨 Ilustración

### Estilo Visual
- **Estilo**: Flat design con gradientes sutiles
- **Colores**: Paleta de marca (emerald, teal, amber)
- **Elementos**: Iconográficos, modernos, limpios
- **Contexto**: Vehículos eléctricos, tecnología, certificación

### Patrones de Ilustración

```tsx
// Patrón de fondo - Puntos sutiles
<div className="relative">
  <div className="absolute inset-0 opacity-5">
    <div className="h-full w-full" style={{
      backgroundImage: 'radial-gradient(circle, #059669 1px, transparent 1px)',
      backgroundSize: '24px 24px'
    }}></div>
  </div>
</div>

// Patrón de fondo - Grid
<div className="relative">
  <div className="absolute inset-0 opacity-5">
    <div className="h-full w-full" style={{
      backgroundImage: 'linear-gradient(#059669 1px, transparent 1px), linear-gradient(90deg, #059669 1px, transparent 1px)',
      backgroundSize: '32px 32px'
    }}></div>
  </div>
</div>
```

### Elementos Decorativos

```tsx
// Blob/Shape decorativo
<svg viewBox="0 0 200 200" className="w-64 h-64 text-emerald-100">
  <path fill="currentColor" d="M40,-65C52,-58,62,-48,68,-36C74,-24,76,-10,75,4C74,18,70,32,62,43C54,54,42,62,29,66C16,70,2,70,-12,67C-26,64,-40,58,-51,48C-62,38,-70,24,-73,9C-76,-6,-74,-22,-68,-36C-62,-50,-52,-62,-40,-68C-28,-74,-14,-74,0,-73C14,-72,28,-71,40,-65Z" transform="translate(100 100)" />
</svg>
```

---

## 💬 Tono de Voz

### Personalidad de Marca
**CertiVeh es**: Tu amigo conocedor que simplifica lo complicado

- ✅ **Confiable**: Serio cuando importa, sin ser aburrido
- ✅ **Claro**: Directo, sin jerga innecesaria
- ✅ **Empoderador**: Te hace sentir en control
- ✅ **Moderno**: Tecnológico pero accesible
- ✅ **Colombiano**: Cercano, cálido, con identidad local

### Principios de Comunicación

#### ✅ Hacer
- Usar lenguaje simple y directo
- Explicar términos técnicos cuando sea necesario
- Celebrar los logros del usuario
- Ser transparente sobre procesos y tiempos
- Mostrar empatía con la frustración burocrática

#### ❌ Evitar
- Jerga gubernamental innecesaria
- Promesas que no podemos cumplir
- Tono corporativo frío
- Complicar lo simple
- Ser condescendiente

### Ejemplos de Copywriting

#### Títulos
```
✅ "Tu certificado UPME en 3 pasos simples"
❌ "Proceso de tramitación certificatoria UPME"

✅ "Sube tus docs, nosotros hacemos el resto"
❌ "Cargue documentación requerida para inicio de trámite"

✅ "Ahorra hasta $X en tu declaración de renta"
❌ "Optimización fiscal tributaria vehicular"
```

#### CTAs (Call to Actions)
```
✅ "Empezar ahora"
❌ "Iniciar proceso"

✅ "Subir documentos"
❌ "Cargar archivos"

✅ "Ver mi certificado"
❌ "Acceder a documento"
```

#### Mensajes de Error
```
✅ "Ups, algo salió mal. Intenta de nuevo en un momento."
❌ "Error 500: Internal Server Error"

✅ "Este archivo es muy grande. Intenta con uno menor a 5MB."
❌ "El tamaño del archivo excede el límite permitido"
```

#### Mensajes de Éxito
```
✅ "¡Listo! Tu certificado está en camino 🎉"
❌ "Trámite completado exitosamente"

✅ "Documentos recibidos. Te avisamos cuando esté listo."
❌ "Documentación cargada correctamente"
```

---

## 📸 Fotografía

### Estilo Fotográfico
- **Tipo**: Fotografía real, natural, con personas reales
- **Iluminación**: Natural, cálida, acogedora
- **Composición**: Limpia, con espacio negativo
- **Tratamiento**: Colores vibrantes pero naturales, ligero boost a verdes

### Temas Principales
1. **Vehículos eléctricos e híbridos** en contextos urbanos colombianos
2. **Personas colombianas** usando tecnología con confianza
3. **Movilidad sostenible** en ciudades colombianas
4. **Momentos de logro** - personas celebrando soluciones

### Procesamiento de Imágenes

```tsx
// Overlay verde sutil sobre imágenes
<div className="relative">
  <img src="..." alt="..." />
  <div className="absolute inset-0 bg-emerald-600 mix-blend-multiply opacity-10"></div>
</div>

// Gradiente overlay para legibilidad de texto
<div className="relative">
  <img src="..." alt="..." />
  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
  <div className="relative z-10">
    {/* Contenido aquí */}
  </div>
</div>
```

---

## ✅ Reglas de Uso del Logo

### ✅ Hacer

1. **Usar el logo en su forma original** sin modificaciones
2. **Respetar la zona de protección** (25% del alto en todos los lados)
3. **Usar la versión light sobre fondos oscuros** (slate-900 o más oscuro)
4. **Mantener proporciones** al redimensionar
5. **Usar sobre fondos de alto contraste**

### ❌ NO Hacer

1. **No estirar o distorsionar** el logo
2. **No rotar** el logo
3. **No cambiar los colores** del logo
4. **No agregar efectos** (sombras, brillos, 3D)
5. **No colocar sobre fondos con bajo contraste**
6. **No usar versiones de baja resolución**
7. **No reconstruir o recrear** el logo

### Fondos Permitidos

#### ✅ Fondos Aprobados
- Blanco (#FFFFFF)
- Gris muy claro (slate-50: #F8FAFC)
- Gris muy oscuro (slate-900: #0F172A)
- Gradiente verde-teal oficial
- Negro (#000000)

#### ⚠️ Fondos con Precaución
- Fotografías con overlay oscuro (>70% opacidad)
- Fondos de color sólido si hay alto contraste

#### ❌ Fondos Prohibidos
- Colores brillantes o saturados
- Fotografías sin overlay
- Patrones complejos
- Gradientes no oficiales

---

## 📦 Assets Descargables

### Formatos de Logo Disponibles

| Formato | Variaciones | Tamaños |
|---------|-------------|---------|
| PNG | Full dark/light, Compact dark/light, Icon | 16px - 800px |
| SVG | Componente React | Escalable |

### Nombres de Archivos

```
certiveh-logo-full-dark.png
certiveh-logo-full-light.png
certiveh-logo-full-dark-transparent.png
certiveh-logo-full-light-transparent.png
certiveh-logo-compact-dark.png
certiveh-logo-compact-light.png
certiveh-icon-dark.png
certiveh-icon-light.png
certiveh-icon-{size}x{size}.png
```

---

## 📱 Aplicaciones del Sistema

### Tarjetas de Presentación
- Logo en versión light sobre gradiente verde-teal
- Tipografía clara y legible
- Información de contacto estructurada

### Headers Web
- Logo a 160px de ancho
- Navegación con fuente medium
- Fondo blanco con border sutil

### App Móvil
- Versión compacta del logo a 120px
- Ícono de 48px para navegación
- Espaciado generoso para touch targets

### Documentos Oficiales
- Logo completo centrado en header
- Tipografía formal pero accesible
- Colores de marca en acentos, no en texto principal

---

## 🎓 Guías de Implementación

### Instalación de Dependencias

```bash
# Iconos
npm install lucide-react

# Fuentes (agregar a index.html o _document.tsx)
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Configuración de Tailwind (Opcional)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#059669',
          accent: '#14B8A6',
          dark: '#0F172A',
          premium: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  }
}
```

---

## 📞 Contacto

Para consultas sobre el uso del manual de marca:
- **Email**: brand@certiveh.co
- **Versión**: 1.0 - Marzo 2026

---

*Este manual de marca es un documento vivo y será actualizado conforme evolucione la identidad de CertiVeh.*
