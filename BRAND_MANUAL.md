# CertiVeh - Manual de Marca 2026

> **Desde noviembre de 2026 manda `DESIGN_SYSTEM.md` §0** («Sistema visual 2026-11») y las variables de
> `src/styles/marca.css`. Las decisiones fijas de la marca están en esa sección: Albert Sans, el verde
> plano `#047857`, un solo radio de 6 px, sin degradados, sin turquesa, sin sombras ni vidrio, sin iconos en
> cuadritos, sin rótulos en mayúsculas espaciadas. Donde este manual diga otra cosa, gana §0. Este documento
> conserva la voz, la ortografía y las reglas de uso del logo.

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
- **Un solo verde plano** (`#047857`): sin degradado. El degradado esmeralda → turquesa se retiró en
  noviembre de 2026: era uno de los rasgos que hacían que la marca «se viera hecha con IA».

### Construcción (marca 2026-11)

- **Escudo** (viewBox `0 0 64 64`): `M32 4 L56 16 L56 36 C56 50 46 60 32 64 C18 60 8 50 8 36 L8 16 Z`,
  relleno `#047857` plano.
- **Rayo**: `M36 18 L26 38 L32 38 L28 56 L42 36 L36 36 Z`, blanco.
- **Palabra «CertiVeh»**: Albert Sans 700, tracking -0.03em, **en una sola tinta**: `#0F172A` sobre claro,
  `#FFFFFF` sobre oscuro. Ya **no** va «Veh» en verde ni la bajada «CERTIFICACIÓN VEHICULAR» en mayúsculas
  espaciadas.
- **Sobre el verde `#047857`**: escudo blanco con el rayo verde, palabra blanca.
- **Ícono, favicon y avatar**: el escudo solo (`public/favicon.svg`). Avatar de redes: escudo blanco centrado
  sobre un cuadrado `#047857` (o escudo verde sobre blanco), con aire: el escudo ocupa ~56% del lado.

En el sitio, el logo de la barra vive en `src/app/components/Navbar.tsx` (función `Logo`): el escudo en SVG y
la palabra como texto HTML.

### Componente Logo (React)

```tsx
// CertiVehLogo.tsx — marca 2026-11: un verde plano, la palabra en una tinta
interface CertiVehLogoProps {
  width?: number;
  height?: number;
  variant?: 'default' | 'light';
  iconOnly?: boolean;
  compact?: boolean;
}

const SHIELD = "M32 4 L56 16 L56 36 C56 50 46 60 32 64 C18 60 8 50 8 36 L8 16 Z";
const BOLT = "M36 18 L26 38 L32 38 L28 56 L42 36 L36 36 Z";

export function CertiVehLogo({ width = 200, height = 50, variant = 'default', iconOnly = false, compact = false }: CertiVehLogoProps) {
  const ink = variant === 'light' ? '#FFFFFF' : '#0F172A';

  if (iconOnly) {
    return (
      <svg width={width} height={height} viewBox="0 0 64 64" fill="none" role="img" aria-label="CertiVeh">
        <path d={SHIELD} fill="#047857" />
        <path d={BOLT} fill="#FFFFFF" />
      </svg>
    );
  }

  const w = compact ? 240 : 320;
  const h = compact ? 60 : 80;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${w} ${h}`} fill="none" role="img" aria-label="CertiVeh">
      <g transform={compact ? "translate(4,4) scale(0.82)" : "translate(4,6) scale(1.06)"}>
        <path d={SHIELD} fill="#047857" />
        <path d={BOLT} fill="#FFFFFF" />
      </g>
      <text x={compact ? 64 : 84} y={compact ? 40 : 52} fill={ink} fontSize={compact ? 30 : 40} fontWeight="700"
        fontFamily="'Albert Sans', 'Helvetica Neue', Arial, sans-serif" letterSpacing="-0.03em">
        CertiVeh
      </text>
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

Fuente de verdad: `src/styles/marca.css` y `DESIGN_SYSTEM.md` §0.2. Las páginas usan las variables `--cv-*`;
no escriben colores sueltos.

### Colores de marca

| Variable | HEX | Uso |
|---|---|---|
| `--cv-accent` | `#047857` | **El verde de la marca**: la acción (botones), el escudo y el verde del texto. Blanco encima: 5,48:1 |
| `--cv-accent-hover` | `#036B4E` | Al tocar, el verde **se oscurece**, nunca se aclara |
| `--cv-ink` | `#0F172A` | Todo el texto corrido |
| `--cv-soft` | `#475569` | Texto secundario (7,2:1). Nunca más claro que esto para algo que se lee |
| `--cv-tone` / `--cv-tone-2` | `#F0F4F2` / `#E1E9E5` | Un paso de tono: separa superficies sin línea ni sombra |
| `--cv-mint` | `#A7F3D0` | El verde legible sobre fondos oscuros |
| `--cv-field` / `--cv-field-2` | `#0F172A` / `#1B2537` | Campo oscuro plano |
| `--cv-field-soft` | `#B6C2D1` | Texto secundario sobre el campo oscuro |
| `--cv-plate` | `#F5C518` | La placa colombiana (solo en piezas del portal) |

- **El turquesa `#14B8A6` se retiró.** Como texto daba 2,4:1 y solo existía como final del degradado.
- **`#059669` nunca como color de texto** (3,87:1 sobre blanco, no cumple AA). Puede quedar como relleno
  decorativo; para todo lo que se lee va `#047857`.

### Colores de estado

| Propósito | Hex | Uso |
|-----------|-----|-----|
| Éxito | `#047857` | Confirmaciones, completado |
| Advertencia | `#92400E` sobre `#FDF3E1` | Avisos que piden atención |
| Error | `#B91C1C` sobre `#FDECEA` | Errores, acciones destructivas |

### No usamos degradados

Ni en botones, ni en textos, ni en el logo, ni en banners ni fondos. Un titular va en una sola tinta (tampoco
una palabra en otro color). **La única excepción** es el velo neutro oscuro sobre una foto o un video, para
poder leer encima:

```css
/* el velo de las cabeceras del sitio, sobre el fotograma del video */
background: linear-gradient(90deg, rgba(9,14,26,.9) 0%, rgba(9,14,26,.74) 50%, rgba(9,14,26,.45) 100%);
```

---

## ✍️ Tipografía

### Fuentes del Sistema

**Familia única**: **Albert Sans** (Google Fonts, licencia OFL), pesos **400, 600 y 700**. Se carga una vez en
`BaseLayout.astro` con precarga y `display=swap`.
**Fallback**: `'Helvetica Neue', Arial, sans-serif` (variable `--cv-font`).

Se descartaron Inter y Schibsted Grotesk. Las imágenes sociales usan los mismos TTF, guardados en
`scripts/fonts/`.

### Jerarquía Tipográfica

Cinco pasos, como variables de `marca.css`. **Nada que se lea por debajo de 13 px.**

| Variable | Tamaño | Uso |
|---|---|---|
| `--cv-display` | 34 → 64 px | h1 |
| `--cv-head` | 28 → 56 px | h2 |
| `--cv-lead` | 20 → 26 px | Entradillas y subtítulos |
| `--cv-body` | 17 → 19 px | Todo el texto corrido |
| `--cv-small` | 14 → 15 px | Notas y datos secundarios |

Títulos a 700 con `letter-spacing: -0.03em` (`--cv-trk`) e interlineado cerrado (~1).

### Pesos de Fuente

| Peso | Valor | Uso |
|------|-------|-----|
| Regular | 400 | Texto de cuerpo |
| Semibold | 600 | Botones, etiquetas, entradillas destacadas |
| Bold | 700 | Títulos y cifras |

### Capitalización y ortografía

**Regla: el texto fuente siempre va en sentence case.** Nunca se escribe una etiqueta
en MAYÚSCULAS SOSTENIDAS dentro del JSX, el HTML o el JSON-LD.

Si un label necesita verse en mayúsculas (eyebrows, encabezados de tabla, tags), se
consigue **solo con CSS**:

```tsx
// ✅ Correcto — el texto fuente es legible y conserva tildes
<span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
  Beneficio total estimado
</span>

// ❌ Incorrecto — mayúsculas escritas a mano
<span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>
  BENEFICIO TOTAL ESTIMADO
</span>
```

Por qué: las mayúsculas escritas a mano se leen letra por letra en lectores de
pantalla, pierden las tildes, no se pueden revertir desde el diseño y rompen la
consistencia entre verticales.

#### Dónde sí van mayúsculas

**En casi ningún sitio.** Desde la marca 2026-11 (DESIGN_SYSTEM.md §0.4.8) ya no hay rótulos en mayúsculas
pequeñas con letra espaciada ni píldoras encima de los títulos: las que existían (`.tc-badge`, `.badge`,
`.al-section-label`, `.label` del blog, `.vh-card-badge`, `.vh-directory-badge`) se pintan hoy en minúscula
inicial, a tamaño legible y sin caja. Las píldoras (radio 999 px) quedan **solo para estados**.

Se conservan en mayúsculas porque así se escriben: los numerales romanos de las páginas legales, los verbos
HTTP de la API (`POST`, `GET`) y las siglas (UPME, DIAN, IVA, GEE, FNCE). El lockup del logo ya no lleva
bajada en mayúsculas.

**Ortografía:** todo el copy visible lleva tildes y signos de apertura (`¿`, `¡`),
incluidos los textos dentro de bloques JSON-LD. Los identificadores de código,
slugs y rutas (`/vehiculos/`, `descripcion`, `solucion`) van sin tilde y no se tocan.

---

## 🎯 Iconografía

> Marca 2026-11: **nunca un ícono dentro de un cuadrito o círculo de color** encima de una tarjeta, y en las
> listas va la viñeta cuadrada de 7 px (`.cv-sq`), no un check por ítem. Los íconos quedan para controles
> (menú, cerrar, redes, flechas de los botones).

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
- **No hacemos ilustración decorativa.** Donde otra marca pondría un dibujo, CertiVeh muestra **piezas reales
  de su producto**: la calculadora con la tarifa vigente, el riel de pasos del portal, el módulo Win Win, la
  placa del vehículo (DESIGN_SYSTEM.md §0.5, «piezas del portal»).
- **Colores**: los de `marca.css`, planos.
- **Fuera** (eran rasgos de página generada): los patrones de puntos, la rejilla de fondo, las manchas
  («blobs») decorativas, las cifras en marca de agua y los números 01 / 02 / 03.

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

✅ "Sube tus docs y nosotros radicamos ante la UPME"
❌ "Cargue documentación requerida para inicio de trámite"

✅ "Deduce hasta $X de tu base gravable en renta"
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
- **Tipo**: Fotografía real, natural, con personas reales. **Nada de fotos de banco de gente con portátil**:
  se muestran fotos propias (los fundadores, los videos del sitio) o piezas reales del producto
- **Iluminación**: Natural, cálida, acogedora
- **Composición**: Limpia, con espacio negativo
- **Tratamiento**: Colores vibrantes pero naturales, ligero boost a verdes

### Temas Principales
1. **Vehículos eléctricos e híbridos** en contextos urbanos colombianos
2. **Personas colombianas** usando tecnología con confianza
3. **Movilidad sostenible** en ciudades colombianas
4. **Momentos de logro** - personas celebrando soluciones

### Procesamiento de Imágenes

Sin tinte verde ni filtros. Para leer encima de una foto o un video, el **velo neutro oscuro** (es el único
degradado permitido):

```css
.hero::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(9,14,26,.9) 0%, rgba(9,14,26,.74) 50%, rgba(9,14,26,.45) 100%);
}
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
4. **No agregar efectos** (sombras, brillos, 3D, degradados)
5. **No poner «Veh» en otro color** ni añadir la bajada en mayúsculas
6. **No colocar sobre fondos con bajo contraste**
7. **No usar versiones de baja resolución**
8. **No reconstruir o recrear** el logo
9. **No usar la placa como logo** (se probó y se descartó)

### Fondos Permitidos

#### ✅ Fondos Aprobados
- Blanco (#FFFFFF)
- Tono (`#F0F4F2`)
- Campo oscuro (`#0F172A`)
- Verde de marca `#047857` plano (con el escudo blanco y el rayo verde)
- Negro (#000000)

#### ⚠️ Fondos con Precaución
- Fotografías con overlay oscuro (>70% opacidad)
- Fondos de color sólido si hay alto contraste

#### ❌ Fondos Prohibidos
- Colores brillantes o saturados
- Fotografías sin overlay
- Patrones complejos
- Cualquier degradado

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
- Logo en versión light sobre el verde `#047857` plano
- Tipografía clara y legible
- Información de contacto estructurada

### Headers Web
- Escudo de 28 px y la palabra a 22 px
- Navegación en Albert Sans 600
- Barra blanca sólida, sin borde, sin sombra y sin desenfoque

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
<link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;600;700&display=swap" rel="stylesheet">
```

### Configuración de Tailwind (Opcional)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          accent: '#047857',       // --cv-accent
          'accent-hover': '#036B4E',
          ink: '#0F172A',          // --cv-ink
          soft: '#475569',         // --cv-soft
          tone: '#F0F4F2',         // --cv-tone
          mint: '#A7F3D0',         // --cv-mint
        }
      },
      borderRadius: { DEFAULT: '6px' },
      fontFamily: {
        sans: ['Albert Sans', 'Helvetica Neue', 'Arial', 'sans-serif'],
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
