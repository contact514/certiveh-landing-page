# CertiVeh - Design System UI

## 0. Sistema visual 2026-11 (manda sobre todo lo de abajo)

> **Esta sección es la fuente de verdad desde noviembre de 2026.** Donde el resto del documento
> (escrito en marzo de 2026) diga otra cosa —degradados, Inter, radios de 12 a 16 px, sombras en
> tarjetas, iconos en cuadritos, badges en mayúsculas—, **gana esta sección**. Lo de abajo se conserva
> como referencia de componentes de formulario y tablas, que siguen valiendo en lo que no contradigan.

> **La regla común de TODOS los proyectos es `docs/marca-2026-11/SISTEMA.md`** (copia idéntica del original
> `~/certiveh/marca-2026-11/SISTEMA.md`, con sus valores en `tokens.json`). Esta sección es cómo se aplica en la
> landing; si chocan, gana SISTEMA.md. La guarda `tests/el-sistema-de-marca-es-uno.test.mjs` (en `pnpm test`)
> falla si la copia se aparta del original o si `marca.css` se aparta de los tokens.

**Por qué existe.** En noviembre de 2026 nos dijeron que la web, el portal y el logo «se veían hechos
con IA». Lo auditamos con `design-taste-frontend` (taste skill) y `web-design-guidelines`: la home
sacaba 18 fallos y usaba casi todos los recursos que hoy delatan una página generada. Este sistema es
el resultado, aprobado por Julian tras cuatro rondas sobre una vista previa. Cada regla de §0.4 es un
rasgo concreto que se quitó; si vuelve, la página vuelve a parecer plantilla.

**La idea:** «el producto en acción». Donde otra landing pondría tarjetas con iconos, CertiVeh muestra
piezas reales de su trámite: la calculadora con la tarifa vigente, el riel de pasos del portal, el
módulo Win Win, la placa del vehículo. Pulcro, tecnológico y cercano.

### 0.1 Dónde vive

- `src/styles/marca.css`: las variables `--cv-*` y las clases compartidas (`.cv-btn`, `.cv-sq`). Se
  carga una sola vez en `BaseLayout.astro`, así que toda página la tiene.
- `src/app/components/Navbar.tsx`: la barra. Una para todo el sitio.
- `src/app/components/SiteFooter.tsx`: el pie. Uno para todo el sitio (antes había nueve copias).
  Las páginas con un pie de contenido distinto lo montan con props y el mismo estilo: `/otros-activos`
  (`tagline`, `columns`, `cta={null}`) y los dos legales (`homeLink`, que conserva su enlace del logo a la
  home). La documentación de la API conserva su propio pie de una línea, en la baldosa de contacto.
- Las páginas componen sus secciones con esas variables. **Ninguna página escribe un color, una
  fuente o un radio sueltos.** Si hace falta uno nuevo, se añade a `marca.css` y a esta sección.

### 0.2 Tokens

| Variable | Valor | Uso |
|---|---|---|
| `--cv-bg` | `#ffffff` | Suelo |
| `--cv-ink` | `#0f172a` | Todo el texto corrido |
| `--cv-soft` | `#475569` | Texto secundario (7,2:1). Nunca más claro que esto para algo que se lee |
| `--cv-tone` / `--cv-tone-2` | `#f0f4f2` / `#e1e9e5` | Un paso de tono: separa superficies sin línea ni sombra |
| `--cv-accent` | `#047857` | La acción y el verde del texto. Blanco encima: 5,48:1 |
| `--cv-accent-hover` | `#036b4e` | Al tocar se **oscurece**, nunca se aclara |
| `--cv-mint` | `#a7f3d0` | El verde legible sobre fondos oscuros |
| `--cv-field` / `--cv-field-2` | `#0f172a` / `#1b2537` | Campo oscuro plano |
| `--cv-field-soft` | `#b6c2d1` | Texto secundario sobre el campo oscuro |
| `--cv-plate` | `#f5c518` | La placa colombiana (solo en piezas del portal) |
| `--cv-r` | `6px` | El único radio. Las píldoras (999px) solo para estados |
| `--cv-m` | `clamp(20px, 4vw, 48px)` | Margen lateral de página |
| `--cv-gap-sec` | `clamp(96px, 12vw, 200px)` | Aire entre secciones |

El turquesa `#14b8a6` **se retiró**: como texto da 2,4:1 y solo existía como final del degradado.
El verde `#059669` tampoco se usa en texto (3,87:1); solo puede ser relleno decorativo.

### 0.3 Tipografía y componentes

- **Albert Sans**, pesos 400, 600 y 700, cargada en `BaseLayout.astro` con precarga y `display=swap`.
  Títulos a 700 con `letter-spacing: -0.03em` (`--cv-trk`).
- **Respaldo con las medidas de Albert Sans** (`marca.css`; la decisión, en DECISIONES.md del original del sistema de marca): mientras
  carga Albert Sans, las familias de respaldo de la pila se redefinen por `@font-face` sobre la fuente local
  («Helvetica Neue» solo en Apple; «Arial» Regular/Bold en Windows y Roboto en Android) con `size-adjust` y métricas
  verticales calibradas, y el `unicode-range` de Albert Sans. Los anchos de portada van en `em` (28.934em = 46ch de
  Albert Sans), no en `ch`, que se mide con la fuente que esté pintando. Así la portada no salta al llegar la fuente.
  Con Albert Sans cargada, su texto no cambia y lo que Albert Sans no trae («→ ↗ ⧉») se pinta con la misma fuente del
  sistema que antes (caras sin ajustar con el `unicode-range` complementario). Quedan cinco saltos pequeños, todos
  ≤ 0,024, solo en Windows y durante la carga (máximo de Windows emulado: 0,028), aceptados (cortes de línea de titulares
  que ningún ajuste quita sin empeorar otros): /blog/vehiculos-electricos-hibridos-elegibles-beneficios-tributarios-2026/
  a 390 (0,020), /terminos-y-condiciones a 390 (0,021), /vehiculos/hyundai-ioniq-5 a 390 (0,018),
  /vehiculos/tesla-model-y a 320 (0,010) y /api-docs a 320 (0,019 → 0,024).
- **Cinco pasos de tamaño**: `--cv-display` (h1), `--cv-head` (h2), `--cv-lead` (entradilla y
  subtítulos), `--cv-body` (17 a 19 px; todo el texto corrido) y `--cv-small` (14 a 15 px).
  **Nada que se lea por debajo de 13 px.**
- **Botones** (`.cv-btn` + `.cv-btn-a` principal verde, `.cv-btn-b` secundario en tono, `.cv-btn-w`
  blanco sobre fondo oscuro): planos, un color, 6 px, flecha `→` que se desplaza al pasar el ratón.
  Sin degradado, sin brillo, sin sombra.
- **Listas**: viñeta cuadrada de 7 px (`.cv-sq`), nunca checks ni iconos por ítem.
- **Superficies**: una baldosa es un relleno `--cv-tone` con 6 px de radio, **sin borde y sin sombra**.
  Las piezas destacadas van en `--cv-accent` (texto blanco) o en `--cv-field` (texto blanco, cifras en
  `--cv-mint`).
- **Lo único que flota y lleva sombra**: el menú del celular, los modales y el botón de WhatsApp.

**Portada de página: titular y entradilla son UNA regla** (`.cv-hero-title` y `.cv-hero-sub` en `marca.css`).
Toda portada (home, otros activos, aliados, nosotros, vehículos, fichas, índice del blog) usa las dos clases:
titular `--cv-display` 700, interlineado .96, tracking -0.03em; entradilla `--cv-lead` (26 px en escritorio,
20 px en celular), interlineado 1.4, `#dbe3ee`, 24 px bajo el titular, máx. 46ch. Una página solo puede fijar el
ancho de su columna (`max-width` del titular); nunca tamaño, peso, color ni separación propios. La home lleva
antes de la entradilla su línea animada («Accede a…», `--cv-lead` 600), y por eso la entradilla queda a 10 px
de esa línea. La cabecera de los artículos del blog y /api-docs son documentos, no portadas: tienen su escala.

**La escala completa de una página** (todas en `marca.css`; las páginas solo fijan ancho, columna y color sobre
oscuro, nunca tamaño, peso, interlineado ni tracking propios):

| Nivel | Clase | Escritorio / celular | Peso, interlineado |
|---|---|---|---|
| Portada: titular | `.cv-hero-title` (`--cv-display`) | 64 / 34 px | 700, .96, -0.03em |
| Portada: entradilla | `.cv-hero-sub` (`--cv-lead`) | 26 / 20 px | 400, 1.4, `#dbe3ee` |
| Título de sección | `.cv-sec-title` (`--cv-head`) | 56 / 29 px | 700, .98, -0.03em |
| Introducción de sección | `.cv-sec-intro` (`--cv-intro`) | 19 / 17 px | hereda peso, 1.5, máx. 58ch |
| Título del cierre («¿Listo…?») | `.cv-close-title` (`--cv-display`) | 64 / 34 px | 700, .96, -0.03em |
| Componentes | su propia escala | calculadora 36 / 26 px; tarjeta de listado del blog 30 / 22 px (la destacada 52 / 32); rótulos de bloque («Costo total del trámite») 14 px 700 | |

Un subtítulo corto de sección (el «Refiere amigos y gana dinero» de Win Win) es una introducción: `.cv-sec-intro`
con su peso y color, no el tamaño de la entradilla de portada. Los artículos del blog y /api-docs son documentos
y tienen su escala de lectura.

### 0.4 Lo que NO se usa (cada uno era un rasgo de página generada)

1. Degradados de marca en botones, textos, logo, banners o fondos. Única excepción: el velo neutro
   oscuro sobre una foto o un video para poder leer encima.
2. Texto en degradado o una palabra del titular en otro color. Un titular, una tinta.
3. Sombras y brillos en reposo (`box-shadow` en tarjetas, botones, cajas).
4. Desenfoque tipo vidrio (`backdrop-filter`). La barra es sólida.
5. Iconos dentro de un cuadrito o círculo de color encima de una tarjeta.
6. Números decorativos 01 / 02 / 03. Si el orden importa, se usa `<ol>` y la posición lo dice.
7. Cifras o letras gigantes en marca de agua detrás del contenido.
8. Etiquetas en mayúsculas pequeñas con letra espaciada, y píldoras encima de los títulos. El texto se
   escribe en minúscula inicial a tamaño legible (y en la fuente ya va así: la mayúscula era CSS).
9. Cajas con borde de 1 px y la franja de color al costado de las tarjetas. Los campos de formulario y
   las tablas de datos sí llevan su línea.
10. Radios de 12 a 16 px en todo. Un radio: 6 px.
11. Fotos de banco de personas con portátil. Se muestran piezas reales del producto o fotos reales.
12. Estrellas de valoración y comillas gigantes decorativas.

Para comprobarlo: `node ~/.claude/skills/design-taste-frontend/scripts/lint.mjs <fichero>` en el
código y `inspect.mjs <url>` en la página servida (`astro preview`). Una línea que deba conservar uno
de estos patrones por un motivo real lleva el comentario `taste-skill-ignore` con el motivo.

### 0.5 Patrones de sección

- **Portada a pantalla completa** (`.cv-hero-full` en `marca.css`): la portada de una página de venta (home,
  otros activos, aliados, nosotros) ocupa al cargar toda la pantalla (`100svh`, con `100vh` de respaldo) y su
  contenido va centrado en vertical: nunca una franja blanca debajo. Si el contenido es más alto (la home con la
  calculadora), crece. El catálogo de vehículos, el blog, las fichas y los legales llevan cabecera corta a
  propósito: allí el visitante viene al buscador o al texto.
- **Las piezas de la home son las de todo el sitio** (`src/app/components/piezas-de-la-marca.ts`). La calculadora
  (`.calc`: blanca, esquina recortada, controles en tono, resultado en el campo oscuro), el riel de pasos que avanza
  con el scroll con la pieza de producto de cada paso a la derecha (`.flow`, `useRielPorScroll`) y las piezas de
  interfaz (`.ui`, `.plate`) viven en ese módulo y las montan la home, `/otros-activos` y las fichas de vehículos.
  La home las interpola en su hoja y su CSS compilado es byte a byte el de antes de extraerlas. Reglas:
  - **Si una página tiene calculadora, va en la portada**, a la derecha del texto (debajo en el celular, con
    «Calcular mi beneficio» como atajo solo en el celular). Las fichas de vehículos llevan ahí el desglose de su
    modelo con la misma pieza.
  - **Un «paso a paso» es el riel**, nunca una lista con una tarjeta que cambia sola: cada paso a la vista con su
    texto completo, el activo marcado al pasar por el centro de la pantalla, y su pieza (un fragmento real del
    trámite con los datos que el propio paso enuncia, marcado «Datos de ejemplo») a la derecha; en el celular, debajo
    de cada paso.
  - **Las cifras de beneficio van en baldosas escalonadas**: la mayor en el campo verde a media página, las demás
    apiladas al lado y una en el campo oscuro. En las tarjetas de un listado, la cifra principal grande y en verde
    arriba, el desglose debajo.
    - **Los tres beneficios (home y /exotics, `.steps3`)** usan la composición de la mini landing del portal
      (`.cv-ml-escalon` de `ServiceInfo.tsx`), que Julian aprobó: rejilla de 12 columnas y dos filas a 8 px; IVA
      (`.bt.a`, campo verde) en las columnas 1-6 ocupando las dos filas, mín. 560 px; renta (`.bt.b`, tono) en 7-12
      fila 1, mín. 300 px; depreciación (`.bt.c`, campo oscuro, cifra en menta) en 7-12 fila 2. Las tres se
      estiran: la verde termina donde la oscura, sin escalón suelto ni alturas en `vh`. Dentro, de arriba abajo:
      cifra gigante, título (h3), texto, la norma en pequeño y el ejemplo empujado al pie (`margin-top: auto`). En
      el celular (≤ 900 px) una columna en ese orden, a 8 px.
    - **Con cuatro (/otros-activos, `.steps4`)**: el mismo lenguaje en dos filas alternadas de la rejilla de 12,
      7+5 y 5+7, a 8 px: renta (`.bt.a`, campo verde) y IVA (`.bt.b`, tono) arriba; arancel (`.bt.c`, tono) y
      depreciación (`.bt.d`, campo oscuro) abajo. Las de cada fila se estiran a la misma altura (mín. 360 px), los
      bordes quedan alineados y la cita legal va al pie. No se usa la verde alta con tres apiladas: con cuatro
      baldosas la verde pasaba de 1.100 px con tres líneas de texto. En el celular, una columna a 8 px.
  - **Preguntas**: baldosas de tono que al abrirse pasan a verde, titular fijo a la izquierda en escritorio. **La
    respuesta está siempre en el HTML** y cerrada solo lleva `hidden` (lectores, buscadores y sin JavaScript la
    tienen); el botón lleva `aria-expanded` y `aria-controls`.
  - **Las demás portadas siguen la de la home**: texto a la izquierda y, a la derecha, lo real de esa página (la
    calculadora, la pieza del portal del aliado, la foto de los fundadores). Un listado (blog, vehículos) destaca
    su primer elemento en el campo verde y el segundo en el oscuro; los artículos llevan los pasos en el riel (línea
    y punto con su número) y el aviso rojo en el campo oscuro.
  - **El cierre**: titular a tamaño de portada a la izquierda y, a la derecha, el texto, la acción en verde y sus
    viñetas. Sin caja de color alrededor.
- **Barra de navegación** (`Navbar`): en las páginas que EMPIEZAN con una cabecera oscura (home y las que
  pasan `darkHero`: aliados, nosotros, vehículos y fichas, otros activos, índice del blog, términos y privacidad, y
  los artículos del blog, que `BlogLayout` marca solos con `isArticle`)
  arranca transparente con texto y escudo en blanco, y al bajar 40 px o al abrir el menú del celular pasa a la
  barra blanca sólida. En las que empiezan en blanco (la API, que tiene su propia barra de documentación) es sólida
  desde el principio. En un artículo, «Volver al Blog» va dentro de la cabecera, alineado con el titular.
  Una página nueva con cabecera oscura pasa `darkHero` y su cabecera sube hasta el borde de arriba (sin
  espaciador blanco), o el texto blanco quedaría sobre blanco.
- **Anclas** (`#beneficios`, `/#calculadora`, índices de los legales y de la API): el inicio de la sección queda
  justo bajo la barra con el mismo respiro en todas (`--cv-barra` + `--cv-ancla-aire`, en `marca.css`, como
  `scroll-padding-top` del `html`). Ninguna página escribe un `scroll-margin-top` en píxeles. Una sección cuyo aire
  de arriba es su padding (`--cv-gap-sec`) lleva `scroll-margin-top: var(--cv-ancla-sec)` (se ancla su título, no
  el hueco); un bloque de color a todo el ancho, `var(--cv-ancla-campo)` (su borde contra la barra, sin franja de la
  sección anterior). Una página con otra barra cambia solo `--cv-barra` (la API en el celular: 64 + 48 px).
  `BaseLayout` re-ancla al llegar con `#hash` mientras la página se asienta. Una isla no puede crecer al hidratar:
  calcula al pintar, no en un efecto.
- **Hero**: video a pantalla completa con velo neutro oscuro, texto blanco a la izquierda y la
  calculadora encima a la derecha en una ficha blanca con la esquina superior izquierda recortada
  (`clip-path`). En el celular, el texto y debajo la calculadora.
- **Intro de sección**: `h2` a `--cv-head` y un párrafo, alineados a la izquierda en 7 de 12 columnas.
- **Baldosas** (aliados, prensa): rejilla de rellenos `--cv-tone` con 8 px de separación; la primera es
  el título en `--cv-accent`. Los logos en gris, grandes.
- **Riel de pasos**: el mismo aspecto que `RielDelTramite` del portal: línea de 3 px, puntos de 25 px,
  el actual con anillo verde. En «Así de simple» avanza con el scroll y la pieza del portal acompaña a
  la derecha.
- **Piezas del portal** (`data-ui`): se construyen en HTML con los rótulos reales del portal. Dentro de
  una pieza valen las convenciones de interfaz (bordes de campo, sombra del panel). Si llevan cifras
  inventadas, la pieza dice «Datos de ejemplo».
- **Problema y solución**: ficha en tono con el problema y, dentro, la solución en blanco con una
  barra verde de 5 px a la izquierda.
- **Preguntas**: baldosas en tono que al abrirse pasan a `--cv-accent` con texto blanco.
- **Pie**: `SiteFooter`, de baldosas.

### 0.6 Reglas que no cambian con el estilo

- **Textos, encabezados, URLs, `<head>`, JSON-LD, `alt` y enlaces no se tocan** al cambiar el estilo.
  Se puede reordenar, nunca reescribir ni quitar. La comprobación es una huella del `dist/` antes y
  después (texto visible, encabezados, enlaces, `alt` y `<head>` de las 41 páginas).
- Celular primero: toda sección tiene su composición a 390 px.
- `prefers-reduced-motion`: nada se mueve y nada se queda oculto.
- Contraste AA en todo texto. El foco del teclado se ve (3 px en `--cv-accent`).

---


## 📋 Índice
0. [Sistema visual 2026-11](#0-sistema-visual-2026-11-manda-sobre-todo-lo-de-abajo) (manda sobre lo demás)
1. [Foundations](#foundations)
2. [Typography Tokens](#typography-tokens)
3. [Core Components](#core-components)
4. [Navigation Components](#navigation-components)
5. [Data Display](#data-display)
6. [Feedback Components](#feedback-components)
7. [Form Patterns](#form-patterns)
8. [Dashboard Patterns](#dashboard-patterns)
9. [Admin Patterns](#admin-patterns)

---

## 🎨 Foundations

### Color Tokens

#### Primitive Colors - Emerald (Primary)
```
emerald-50:  #ECFDF5
emerald-100: #D1FAE5
emerald-200: #A7F3D0
emerald-500: #10B981
emerald-600: #059669 ⭐
emerald-700: #047857
emerald-800: #065F46
```

#### Primitive Colors - Teal (Accent)
```
teal-50:  #F0FDFA
teal-100: #CCFBF1
teal-200: #99F6E4
teal-500: #14B8A6 ⭐
teal-600: #0D9488
teal-700: #0F766E
teal-800: #115E59
```

#### Primitive Colors - Slate (Neutral)
```
slate-50:  #F8FAFC
slate-100: #F1F5F9
slate-200: #E2E8F0
slate-500: #64748B
slate-700: #334155
slate-900: #0F172A ⭐
slate-950: #020617
```

#### Semantic Color Tokens

| Token Name | Value | Usage | Example |
|------------|-------|-------|---------|
| `primary` | `emerald-600` | Primary actions, brand color | `bg-emerald-600` |
| `primary-hover` | `emerald-700` | Hover state for primary | `hover:bg-emerald-700` |
| `success` | `emerald-600` | Success messages | `text-emerald-600` |
| `success-bg` | `emerald-50` | Success alert backgrounds | `bg-emerald-50` |
| `info` | `blue-600` | Info messages, links | `text-blue-600` |
| `info-bg` | `blue-50` | Info alert backgrounds | `bg-blue-50` |
| `warning` | `orange-500` | Warning messages | `text-orange-500` |
| `warning-bg` | `orange-50` | Warning backgrounds | `bg-orange-50` |
| `error` | `red-600` | Error messages | `text-red-600` |
| `error-bg` | `red-50` | Error backgrounds | `bg-red-50` |
| `premium` | `amber-500` | Premium features | `text-amber-500` |

### Spacing Scale

| Token | Value | Rem | Usage |
|-------|-------|-----|-------|
| `space-0` | 0px | 0rem | Reset |
| `space-1` | 4px | 0.25rem | Tight spacing |
| `space-2` | 8px | 0.5rem | Small gaps |
| `space-3` | 12px | 0.75rem | Compact padding |
| `space-4` | 16px | 1rem | Default spacing |
| `space-5` | 20px | 1.25rem | Comfortable padding |
| `space-6` | 24px | 1.5rem | Section spacing |
| `space-8` | 32px | 2rem | Large gaps |
| `space-10` | 40px | 2.5rem | Component separation |
| `space-12` | 48px | 3rem | Section separation |
| `space-16` | 64px | 4rem | Major sections |
| `space-20` | 80px | 5rem | Page sections |
| `space-24` | 96px | 6rem | Hero sections |

### Border Radius Scale

| Token | Value | Class | Usage |
|-------|-------|-------|-------|
| `none` | 0px | `rounded-none` | Sharp corners |
| `sm` | 2px | `rounded-sm` | Minimal rounding |
| `DEFAULT` | 4px | `rounded` | Subtle corners |
| `md` | 6px | `rounded-md` | Medium corners |
| `lg` | 8px | `rounded-lg` | Default UI elements ⭐ |
| `xl` | 12px | `rounded-xl` | Cards, panels |
| `2xl` | 16px | `rounded-2xl` | Large cards |
| `3xl` | 24px | `rounded-3xl` | Hero cards |
| `full` | 9999px | `rounded-full` | Pills, circles |

### Shadow Scale

| Token | Class | Usage |
|-------|-------|-------|
| Small | `shadow-sm` | Subtle lift, borders |
| Default | `shadow` | Cards, panels |
| Medium | `shadow-md` | Dropdowns, popovers |
| Large | `shadow-lg` | Modals, drawers |
| XL | `shadow-xl` | High emphasis dialogs |
| 2XL | `shadow-2xl` | Maximum elevation |

### Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `z-0` | 0 | Default, base layer |
| `z-10` | 10 | Dropdowns, tooltips |
| `z-20` | 20 | Sticky headers |
| `z-30` | 30 | Fixed navigation |
| `z-40` | 40 | Modal overlays |
| `z-50` | 50 | Toast notifications |

### Breakpoints

| Breakpoint | Min Width | Container Max | Columns |
|------------|-----------|---------------|---------|
| `sm` | 640px | 640px | 4 |
| `md` | 768px | 768px | 8 |
| `lg` | 1024px | 1024px | 12 |
| `xl` | 1280px | 1280px | 12 |
| `2xl` | 1536px | 1536px | 12 |

---

## ✍️ Typography Tokens

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
```

### Type Scale

```tsx
// Display Large
<h1 className="text-5xl font-bold text-slate-900">
  Display Large
</h1>
// 48px, Bold, line-height: 1.1

// Heading 1
<h1 className="text-4xl font-bold text-slate-900">
  Heading 1
</h1>
// 36px, Bold, line-height: 1.2

// Heading 2
<h2 className="text-3xl font-bold text-slate-900">
  Heading 2
</h2>
// 30px, Bold, line-height: 1.25

// Heading 3
<h3 className="text-2xl font-semibold text-slate-900">
  Heading 3
</h3>
// 24px, Semibold, line-height: 1.3

// Heading 4
<h4 className="text-xl font-semibold text-slate-900">
  Heading 4
</h4>
// 20px, Semibold, line-height: 1.4

// Body Large
<p className="text-lg text-slate-700">
  Body Large Text
</p>
// 18px, Regular, line-height: 1.5

// Body Default
<p className="text-base text-slate-700">
  Body Default Text
</p>
// 16px, Regular, line-height: 1.5

// Body Small
<p className="text-sm text-slate-600">
  Body Small Text
</p>
// 14px, Regular, line-height: 1.5

// Caption
<span className="text-xs text-slate-500">
  Caption Text
</span>
// 12px, Regular, line-height: 1.5
```

### Font Weights

```tsx
<span className="font-normal">Regular 400</span>
<span className="font-medium">Medium 500</span>
<span className="font-semibold">Semibold 600</span>
<span className="font-bold">Bold 700</span>
```

---

## 🧩 Core Components

### Buttons

#### Primary Button
```tsx
<button className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800
  disabled:opacity-50 disabled:cursor-not-allowed
  text-white font-medium px-6 py-3 rounded-lg 
  transition-colors">
  Primary Button
</button>
```

#### Secondary Button
```tsx
<button className="bg-slate-100 hover:bg-slate-200 active:bg-slate-300
  disabled:opacity-50 disabled:cursor-not-allowed
  text-slate-900 font-medium px-6 py-3 rounded-lg 
  transition-colors">
  Secondary Button
</button>
```

#### Ghost/Outline Button
```tsx
<button className="border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50
  disabled:opacity-50 disabled:cursor-not-allowed
  text-slate-700 font-medium px-6 py-3 rounded-lg 
  transition-colors">
  Ghost Button
</button>
```

#### Destructive Button
```tsx
<button className="bg-red-600 hover:bg-red-700 active:bg-red-800
  disabled:opacity-50 disabled:cursor-not-allowed
  text-white font-medium px-6 py-3 rounded-lg 
  transition-colors">
  Delete
</button>
```

#### Button with Icon
```tsx
import { ArrowRight } from 'lucide-react';

<button className="bg-emerald-600 hover:bg-emerald-700 
  text-white font-medium px-6 py-3 rounded-lg 
  flex items-center gap-2 transition-colors">
  Continuar
  <ArrowRight className="w-5 h-5" />
</button>
```

#### Loading Button
```tsx
import { Loader2 } from 'lucide-react';

<button disabled className="bg-emerald-600 text-white font-medium px-6 py-3 rounded-lg 
  flex items-center gap-2">
  <Loader2 className="w-4 h-4 animate-spin" />
  Procesando...
</button>
```

#### Button Sizes

```tsx
// Small
<button className="px-3 py-1.5 text-sm">Small</button>

// Default
<button className="px-6 py-3 text-base">Default</button>

// Large
<button className="px-8 py-4 text-lg">Large</button>
```

### Input Fields

#### Text Input
```tsx
<div className="space-y-2">
  <label htmlFor="email" className="block text-sm font-medium text-slate-700">
    Email
  </label>
  <input
    type="email"
    id="email"
    className="w-full px-4 py-3 border border-slate-300 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent
      placeholder:text-slate-400
      disabled:bg-slate-100 disabled:cursor-not-allowed"
    placeholder="tu@email.com"
  />
</div>
```

#### Input with Icon
```tsx
import { Search } from 'lucide-react';

<div className="relative">
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
  <input
    type="text"
    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
    placeholder="Buscar..."
  />
</div>
```

#### Input Error State
```tsx
<div className="space-y-2">
  <label htmlFor="email" className="block text-sm font-medium text-slate-700">
    Email
  </label>
  <input
    type="email"
    id="email"
    className="w-full px-4 py-3 border-2 border-red-600 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-red-600"
  />
  <p className="text-sm text-red-600 flex items-center gap-1">
    <AlertCircle className="w-4 h-4" />
    Este campo es requerido
  </p>
</div>
```

#### Input Success State
```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-slate-700">
    Email
  </label>
  <input
    type="email"
    className="w-full px-4 py-3 border-2 border-emerald-600 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-emerald-600"
  />
  <p className="text-sm text-emerald-600 flex items-center gap-1">
    <Check className="w-4 h-4" />
    Email válido
  </p>
</div>
```

### Textarea
```tsx
<div className="space-y-2">
  <label htmlFor="message" className="block text-sm font-medium text-slate-700">
    Mensaje
  </label>
  <textarea
    id="message"
    rows={4}
    className="w-full px-4 py-3 border border-slate-300 rounded-lg resize-none
      focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
    placeholder="Escribe tu mensaje..."
  />
</div>
```

### Select
```tsx
import { ChevronDown } from 'lucide-react';

<div className="space-y-2">
  <label className="block text-sm font-medium text-slate-700">
    Tipo de vehículo
  </label>
  <div className="relative">
    <select className="w-full px-4 py-3 border border-slate-300 rounded-lg
      appearance-none
      focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent">
      <option>Selecciona una opción</option>
      <option>Eléctrico</option>
      <option>Híbrido</option>
    </select>
    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
  </div>
</div>
```

### Checkbox
```tsx
<div className="flex items-center gap-3">
  <input
    type="checkbox"
    id="terms"
    className="w-5 h-5 rounded border-slate-300 text-emerald-600
      focus:ring-2 focus:ring-emerald-600 focus:ring-offset-0"
  />
  <label htmlFor="terms" className="text-sm text-slate-700">
    Acepto los términos y condiciones
  </label>
</div>
```

### Radio Button
```tsx
<div className="space-y-3">
  <div className="flex items-center gap-3">
    <input
      type="radio"
      id="option1"
      name="options"
      className="w-5 h-5 border-slate-300 text-emerald-600
        focus:ring-2 focus:ring-emerald-600 focus:ring-offset-0"
    />
    <label htmlFor="option1" className="text-sm text-slate-700">
      Opción 1
    </label>
  </div>
  <div className="flex items-center gap-3">
    <input
      type="radio"
      id="option2"
      name="options"
      className="w-5 h-5 border-slate-300 text-emerald-600
        focus:ring-2 focus:ring-emerald-600 focus:ring-offset-0"
    />
    <label htmlFor="option2" className="text-sm text-slate-700">
      Opción 2
    </label>
  </div>
</div>
```

### Toggle Switch
```tsx
<button
  onClick={() => setEnabled(!enabled)}
  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
    ${enabled ? 'bg-emerald-600' : 'bg-slate-300'}`}
>
  <span
    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
      ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
  />
</button>
```

---

## 🧭 Navigation Components

### Top Navigation
```tsx
<nav className="bg-white border-b border-slate-200">
  <div className="max-w-7xl mx-auto px-8 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-8">
        {/* Logo */}
        <CertiVehLogo width={160} height={40} />
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm text-slate-700 hover:text-emerald-600 transition-colors">
            Inicio
          </a>
          <a href="#" className="text-sm text-slate-700 hover:text-emerald-600 transition-colors">
            Servicios
          </a>
          <a href="#" className="text-sm text-slate-700 hover:text-emerald-600 transition-colors">
            Ayuda
          </a>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="text-sm text-slate-700 hover:text-emerald-600">
          Ingresar
        </button>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
          Registrarse
        </button>
      </div>
    </div>
  </div>
</nav>
```

### Sidebar Navigation
```tsx
<aside className="w-64 bg-slate-900 text-white min-h-screen p-6">
  <div className="mb-8">
    <CertiVehLogo width={140} height={35} variant="light" />
  </div>
  
  <nav className="space-y-1">
    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-600">
      <Home className="w-5 h-5" />
      <span className="text-sm font-medium">Dashboard</span>
    </a>
    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800">
      <FileText className="w-5 h-5" />
      <span className="text-sm font-medium">Certificados</span>
    </a>
    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800">
      <Settings className="w-5 h-5" />
      <span className="text-sm font-medium">Configuración</span>
    </a>
  </nav>
</aside>
```

### Breadcrumbs
```tsx
import { ChevronRight } from 'lucide-react';

<nav className="flex items-center gap-2 text-sm">
  <a href="#" className="text-slate-600 hover:text-emerald-600">Inicio</a>
  <ChevronRight className="w-4 h-4 text-slate-400" />
  <a href="#" className="text-slate-600 hover:text-emerald-600">Certificados</a>
  <ChevronRight className="w-4 h-4 text-slate-400" />
  <span className="text-slate-900 font-medium">Detalles</span>
</nav>
```

### Tabs
```tsx
<div className="border-b border-slate-200">
  <nav className="flex gap-8">
    <button className="pb-4 border-b-2 border-emerald-600 text-emerald-600 font-medium">
      Todos
    </button>
    <button className="pb-4 border-b-2 border-transparent text-slate-600 hover:text-slate-900">
      Pendientes
    </button>
    <button className="pb-4 border-b-2 border-transparent text-slate-600 hover:text-slate-900">
      Completados
    </button>
  </nav>
</div>
```

---

## 📊 Data Display

### Card
```tsx
<div className="bg-white rounded-xl border border-slate-200 p-6">
  <h3 className="text-lg font-semibold text-slate-900 mb-2">
    Título de Tarjeta
  </h3>
  <p className="text-sm text-slate-600 mb-4">
    Descripción de la tarjeta con información relevante.
  </p>
  <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
    Ver más →
  </button>
</div>
```

### Stat Card
```tsx
<div className="bg-white rounded-xl border border-slate-200 p-6">
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm text-slate-600">Certificados</span>
    <FileText className="w-5 h-5 text-emerald-600" />
  </div>
  <p className="text-3xl font-bold text-slate-900 mb-1">24</p>
  <p className="text-sm text-emerald-600">+12% este mes</p>
</div>
```

### Table
```tsx
<div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
  <table className="w-full">
    <thead className="bg-slate-50">
      <tr>
        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
          Certificado
        </th>
        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
          Estado
        </th>
        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
          Fecha
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-200">
      <tr className="hover:bg-slate-50">
        <td className="px-6 py-4 text-sm text-slate-900">CERT-2024-001</td>
        <td className="px-6 py-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
            Completado
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-slate-600">15 Mar 2026</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Badge/Pill
```tsx
{/* Success */}
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
  Completado
</span>

{/* Warning */}
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
  Pendiente
</span>

{/* Error */}
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
  Rechazado
</span>

{/* Info */}
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
  En proceso
</span>
```

---

## 💬 Feedback Components

### Alert - Success
```tsx
import { CheckCircle, X } from 'lucide-react';

<div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
  <div className="flex items-start gap-3">
    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-emerald-900 mb-1">
        ¡Certificado generado!
      </h4>
      <p className="text-sm text-emerald-700">
        Tu certificado ha sido generado exitosamente y está listo para descargar.
      </p>
    </div>
    <button className="text-emerald-600 hover:text-emerald-700">
      <X className="w-5 h-5" />
    </button>
  </div>
</div>
```

### Alert - Error
```tsx
import { AlertCircle, X } from 'lucide-react';

<div className="bg-red-50 border border-red-200 rounded-lg p-4">
  <div className="flex items-start gap-3">
    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-red-900 mb-1">
        Error al procesar
      </h4>
      <p className="text-sm text-red-700">
        No pudimos procesar tu solicitud. Por favor intenta nuevamente.
      </p>
    </div>
    <button className="text-red-600 hover:text-red-700">
      <X className="w-5 h-5" />
    </button>
  </div>
</div>
```

### Alert - Warning
```tsx
import { AlertTriangle, X } from 'lucide-react';

<div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
  <div className="flex items-start gap-3">
    <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-orange-900 mb-1">
        Atención requerida
      </h4>
      <p className="text-sm text-orange-700">
        Algunos documentos necesitan revisión antes de continuar.
      </p>
    </div>
    <button className="text-orange-600 hover:text-orange-700">
      <X className="w-5 h-5" />
    </button>
  </div>
</div>
```

### Alert - Info
```tsx
import { Info, X } from 'lucide-react';

<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
  <div className="flex items-start gap-3">
    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-blue-900 mb-1">
        Información importante
      </h4>
      <p className="text-sm text-blue-700">
        El proceso puede tomar hasta 48 horas hábiles.
      </p>
    </div>
    <button className="text-blue-600 hover:text-blue-700">
      <X className="w-5 h-5" />
    </button>
  </div>
</div>
```

### Toast Notification
```tsx
// Using a library like sonner or react-hot-toast
import { toast } from 'sonner';

// Success toast
toast.success('Certificado generado exitosamente');

// Error toast
toast.error('Error al procesar la solicitud');

// Info toast
toast.info('Proceso iniciado');

// Custom toast
toast.custom((t) => (
  <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
    <CheckCircle className="w-5 h-5 text-emerald-600" />
    <p className="text-sm text-slate-900">Acción completada</p>
  </div>
));
```

### Modal
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center">
  {/* Backdrop */}
  <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>
  
  {/* Modal */}
  <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
    {/* Close button */}
    <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
      <X className="w-6 h-6" />
    </button>
    
    {/* Content */}
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Confirmar acción
      </h2>
      <p className="text-slate-600">
        ¿Estás seguro de que deseas continuar con esta acción?
      </p>
    </div>
    
    {/* Actions */}
    <div className="flex gap-3">
      <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium px-6 py-3 rounded-lg">
        Cancelar
      </button>
      <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg">
        Confirmar
      </button>
    </div>
  </div>
</div>
```

### Progress Bar
```tsx
<div className="w-full">
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm text-slate-700">Progreso</span>
    <span className="text-sm font-medium text-slate-900">65%</span>
  </div>
  <div className="w-full bg-slate-200 rounded-full h-2">
    <div 
      className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
      style={{ width: '65%' }}
    ></div>
  </div>
</div>
```

### Skeleton Loader
```tsx
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
  <div className="h-4 bg-slate-200 rounded"></div>
  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
</div>
```

---

## 📝 Form Patterns

### Login Form
```tsx
<div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-8">
  <div className="text-center mb-8">
    <CertiVehLogo width={200} height={50} />
    <h2 className="text-2xl font-bold text-slate-900 mt-6 mb-2">
      Iniciar sesión
    </h2>
    <p className="text-slate-600">
      Ingresa a tu cuenta de CertiVeh
    </p>
  </div>
  
  <form className="space-y-6">
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        Email
      </label>
      <input
        type="email"
        className="w-full px-4 py-3 border border-slate-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-emerald-600"
        placeholder="tu@email.com"
      />
    </div>
    
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        Contraseña
      </label>
      <input
        type="password"
        className="w-full px-4 py-3 border border-slate-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-emerald-600"
        placeholder="••••••••"
      />
    </div>
    
    <div className="flex items-center justify-between">
      <label className="flex items-center gap-2">
        <input type="checkbox" className="rounded border-slate-300 text-emerald-600" />
        <span className="text-sm text-slate-700">Recordarme</span>
      </label>
      <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700">
        ¿Olvidaste tu contraseña?
      </a>
    </div>
    
    <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg">
      Iniciar sesión
    </button>
  </form>
  
  <p className="text-center text-sm text-slate-600 mt-6">
    ¿No tienes cuenta?{' '}
    <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
      Regístrate
    </a>
  </p>
</div>
```

### File Upload
```tsx
import { Upload, FileText, X } from 'lucide-react';

<div className="space-y-4">
  <label className="block text-sm font-medium text-slate-700">
    Documentos requeridos
  </label>
  
  {/* Drop zone */}
  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-emerald-600 transition-colors cursor-pointer">
    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
    <p className="text-sm text-slate-700 mb-1">
      <span className="text-emerald-600 font-medium">Click para subir</span> o arrastra archivos aquí
    </p>
    <p className="text-xs text-slate-500">
      PDF, JPG o PNG (máx. 5MB)
    </p>
  </div>
  
  {/* Uploaded file */}
  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center gap-3">
    <FileText className="w-10 h-10 text-emerald-600" />
    <div className="flex-1">
      <p className="text-sm font-medium text-slate-900">documento.pdf</p>
      <p className="text-xs text-slate-500">2.4 MB</p>
    </div>
    <button className="text-slate-400 hover:text-red-600">
      <X className="w-5 h-5" />
    </button>
  </div>
</div>
```

### Multi-Step Form
```tsx
<div className="max-w-2xl mx-auto">
  {/* Progress Steps */}
  <div className="mb-12">
    <div className="flex items-center justify-between">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
            ${step <= currentStep ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
            {step}
          </div>
          {step < 3 && (
            <div className={`flex-1 h-1 mx-4 ${step < currentStep ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
          )}
        </div>
      ))}
    </div>
    <div className="flex justify-between mt-4">
      <span className="text-sm text-slate-600">Información</span>
      <span className="text-sm text-slate-600">Documentos</span>
      <span className="text-sm text-slate-600">Confirmación</span>
    </div>
  </div>
  
  {/* Form content changes per step */}
  <div className="bg-white rounded-xl border border-slate-200 p-8">
    {/* Step content here */}
  </div>
  
  {/* Navigation */}
  <div className="flex gap-4 mt-6">
    <button className="flex-1 border-2 border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-lg">
      Anterior
    </button>
    <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg">
      Siguiente
    </button>
  </div>
</div>
```

---

## 📊 Dashboard Patterns

### Dashboard Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Stat Cards */}
  <div className="bg-white rounded-xl border border-slate-200 p-6">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-slate-600">Total Certificados</span>
      <FileText className="w-5 h-5 text-emerald-600" />
    </div>
    <p className="text-3xl font-bold text-slate-900 mb-1">156</p>
    <p className="text-sm text-emerald-600">+12% vs mes anterior</p>
  </div>
  
  {/* Repeat for other stats */}
</div>
```

### Dashboard Chart Card
```tsx
<div className="bg-white rounded-xl border border-slate-200 p-6">
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-lg font-semibold text-slate-900">
      Certificados por mes
    </h3>
    <select className="text-sm border border-slate-300 rounded-lg px-3 py-1.5">
      <option>Últimos 6 meses</option>
      <option>Últimos 12 meses</option>
    </select>
  </div>
  
  {/* Chart goes here (use recharts) */}
  <div className="h-64 flex items-center justify-center text-slate-400">
    [Gráfica de barras o líneas]
  </div>
</div>
```

### Dashboard Activity Feed
```tsx
<div className="bg-white rounded-xl border border-slate-200 p-6">
  <h3 className="text-lg font-semibold text-slate-900 mb-6">
    Actividad reciente
  </h3>
  
  <div className="space-y-4">
    {activities.map((activity) => (
      <div key={activity.id} className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-900 mb-1">
            Certificado <span className="font-medium">{activity.cert}</span> generado
          </p>
          <p className="text-xs text-slate-500">{activity.time}</p>
        </div>
      </div>
    ))}
  </div>
</div>
```

---

## ⚙️ Admin Patterns

### Admin Table with Actions
```tsx
<div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
  <div className="p-6 border-b border-slate-200">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-slate-900">Usuarios</h2>
      <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-sm">
        + Nuevo usuario
      </button>
    </div>
  </div>
  
  <table className="w-full">
    <thead className="bg-slate-50">
      <tr>
        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Usuario</th>
        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Estado</th>
        <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Acciones</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-200">
      <tr className="hover:bg-slate-50">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-sm font-medium text-emerald-600">JD</span>
            </div>
            <span className="text-sm font-medium text-slate-900">Juan Díaz</span>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-slate-600">juan@email.com</td>
        <td className="px-6 py-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
            Activo
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center justify-end gap-2">
            <button className="text-slate-400 hover:text-emerald-600">
              <Edit className="w-4 h-4" />
            </button>
            <button className="text-slate-400 hover:text-red-600">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Settings Panel
```tsx
<div className="bg-white rounded-xl border border-slate-200 p-6">
  <h3 className="text-lg font-semibold text-slate-900 mb-6">
    Configuración de notificaciones
  </h3>
  
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-900">Email de confirmación</p>
        <p className="text-sm text-slate-600">Recibe un email cuando se complete un certificado</p>
      </div>
      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-600">
        <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition-transform" />
      </button>
    </div>
    
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-900">Notificaciones push</p>
        <p className="text-sm text-slate-600">Recibe alertas en tiempo real</p>
      </div>
      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-300">
        <span className="inline-block h-4 w-4 transform translate-x-1 rounded-full bg-white transition-transform" />
      </button>
    </div>
  </div>
</div>
```

---

## 🚀 Implementación

### Instalación de Dependencias

```bash
# Framework
npm install react react-dom

# Routing (si es necesario)
npm install react-router

# Íconos
npm install lucide-react

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Utilities
npm install clsx # Para conditional classnames
```

### Configuración de Tailwind

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
        },
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

### CSS Base

```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-slate-200;
  }
  
  body {
    @apply font-sans text-slate-900 bg-slate-50;
  }
}
```

---

## 📱 Responsive Patterns

### Mobile-First Approach

```tsx
{/* Stack on mobile, row on desktop */}
<div className="flex flex-col md:flex-row gap-4">
  <div className="flex-1">Column 1</div>
  <div className="flex-1">Column 2</div>
</div>

{/* Hide on mobile, show on desktop */}
<div className="hidden md:block">
  Desktop only content
</div>

{/* Show on mobile, hide on desktop */}
<div className="block md:hidden">
  Mobile only content
</div>

{/* Responsive grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>
```

---

## 🎓 Best Practices

### Accessibility

```tsx
{/* Always use semantic HTML */}
<button type="button" aria-label="Cerrar modal">
  <X className="w-5 h-5" />
</button>

{/* Proper form labels */}
<label htmlFor="email" className="...">
  Email
</label>
<input id="email" type="email" />

{/* Focus states */}
<button className="focus:outline-none focus:ring-2 focus:ring-emerald-600">
  Button
</button>
```

### Performance

```tsx
{/* Lazy load images */}
<img src="..." alt="..." loading="lazy" />

{/* Use appropriate image formats */}
{/* WebP for web, PNG with transparency */}

{/* Memoize expensive computations */}
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

---

## 📞 Soporte

Para consultas sobre implementación del Design System:
- **Email**: dev@certiveh.co
- **Versión**: 1.0 - Marzo 2026
- **Stack**: React + Tailwind CSS + Lucide Icons

---

*Este Design System es un documento vivo y será actualizado conforme evolucionen las necesidades de la plataforma CertiVeh.*
