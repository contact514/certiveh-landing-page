# CertiVeh · Sistema visual 2026-11 (la fuente única)

> **Este fichero es la regla.** El original vive en `~/certiveh/marca-2026-11/SISTEMA.md` junto a
> `tokens.json` (los mismos valores, para máquinas). Cada proyecto lleva **una copia idéntica** de los dos
> y un test que compara su huella SHA-256: si se cambia una copia sin las demás, ese repo se pone en rojo.
> **Para cambiar una regla:** se edita el original, se copia a los cinco sitios (lista en §9), se actualiza
> el SHA de los cinco tests y se corre `node ~/certiveh/marca-2026-11/comprobar.mjs`.
> El porqué de cada decisión (citas de Julian, lo que no le gustó) está en `DECISIONES.md`.
> Las guías de cada proyecto (DESIGN_SYSTEM §0, `diseno-y-contraste.md`, `estandar-visual-del-panel.md`,
> `visual-assets-guide.md` §00) describen **cómo se aplica allí**; donde contradigan esto, gana esto.

Aprobado por Julian el 3-nov-2026 tras cuatro rondas. Brief: «tecnológico, moderno, de buen gusto,
pulcro, elegante aunque cercano con la gente». La idea: **el producto en acción** (piezas reales del
trámite en lugar de tarjetas con iconos).

## 1. Las tres reglas de Julian (mandan sobre todo lo demás)

1. **Los copies se mantienen.** Rediseñar no cambia, resume, acorta ni esconde ni una palabra, cifra,
   enlace, encabezado, `alt`, `<head>` o JSON-LD. Se puede **reorganizar**. Un texto que pide corrección
   (una norma derogada, una sigla prohibida) se le pregunta a Julian; no se corrige de paso.
2. **Toda la información sigue disponible.** Lo que pasa a un acordeón, carrusel o pestaña sigue en el
   HTML y es alcanzable con teclado y lector de pantalla.
3. **La funcionalidad queda igual.** Mismas acciones en los mismos estados, sin pasos nuevos ni quitados;
   mover una acción de sitio se le propone a Julian. Y el SEO no se daña.

Además: **celular primero** (390 px antes que 1440) y **consistencia estricta**: lo que comparte un
componente se cambia en todos los sitios donde aparece.

## 2. Tokens (valores en `tokens.json`)

| Nombre | Valor | Uso |
|---|---|---|
| suelo | `#FFFFFF` | Fondo |
| tinta | `#0F172A` | Todo el texto corrido |
| secundario | `#475569` | Texto secundario sobre claro. Nunca más claro para algo que se lee |
| tono / tono2 | `#F0F4F2` / `#E1E9E5` | Separar superficies sin línea ni sombra |
| acción | `#047857` | Botón principal y verde del texto. Blanco encima: 5,48:1 |
| acción al tocar | `#036B4E` | Al tocar se oscurece, nunca se aclara |
| verde sobre oscuro | `#A7F3D0` | Cifras, rótulos y enlaces sobre el campo oscuro |
| campo / campo2 | `#0F172A` / `#1B2537` | Campo oscuro plano y sus baldosas |
| secundario sobre oscuro | `#B6C2D1` | Notas sobre el campo oscuro |
| entradilla sobre oscuro | `#DBE3EE` | La entradilla de toda portada |
| placa | `#F5C518` | La placa colombiana (borde negro 2 px, letra 800) |
| gris pequeño | `#64748B` | Letra pequeña de correos y pies |
| línea de campo | `#8792A2` | Borde de un campo de formulario (WCAG 1.4.11) |
| error | `#B91C1C` | Lo que falla |
| ámbar de acción | `#D97706` | «Te toca a ti» (es un estado, no la marca) |

- **Retirados:** el turquesa `#14B8A6` y `#34D399`. `#059669` solo como relleno decorativo, nunca como texto.
- **Fuente:** Albert Sans 400/600/700 (el portal añade 500 por sus rótulos y 800 solo para la placa).
  Títulos 700 con tracking -0.03em. Pila web `'Albert Sans', 'Helvetica Neue', Arial, sans-serif`.
- **Un radio: 6 px.** Los campos de formulario 4 px. Las píldoras, solo para estados.

## 3. Escala de texto

1. Seis pasos: `display` (h1), `head` (h2), `lead` (entradilla), `intro` (introducción de sección, 19 / 17 px),
   `body` (17-19 px), `small` (14-15 px).
   Los `clamp()` exactos están en `tokens.json`.
2. **Portada: titular y entradilla son UNA regla** (`.cv-hero-title` / `.cv-hero-sub`). Titular `display`
   (64 px escritorio, 34 px celular), 700, interlineado .96, tracking -0.03em. Entradilla `lead` (26 / 20 px),
   interlineado 1.4, `#DBE3EE` sobre oscuro, 24 px bajo el titular, máximo 46ch. Una pantalla solo decide el
   ancho de su columna. Vale para la landing, el portal (la cabecera del campo de cada pantalla) y las maquetas.
   Excepción: los documentos de lectura (artículos del blog, /api-docs) tienen su escala.
3. **Secciones de una página: también UNA regla** (`.cv-sec-title` / `.cv-sec-intro` / `.cv-close-title`).
   Título de sección `head` (56 px escritorio, ~29 px celular), 700, interlineado .98, tracking -0.03em.
   Introducción de sección `intro` (19 / 17 px), interlineado 1.5, máximo 58ch, 18 px bajo el título; un
   subtítulo corto de sección (p. ej. «Refiere amigos y gana dinero») es introducción, con su peso y color, nunca
   el tamaño de la entradilla de portada. Título del cierre («¿Listo…?») `display`, interlineado .96. Una página
   solo fija ancho, columna y color sobre oscuro. Los componentes tienen su escala de componente (calculadora
   36 / 26 px, tarjeta de listado 30 / 22 px, rótulo de bloque 14 px 700); en el portal, el título de baldosa va de
   22 a 30 px. No se mezclan más tamaños que estos.
4. **Mínimo legible:** 13 px en pantalla y en correo; 9 pt en PDF. Nada que se lea por debajo.

## 4. Prohibido en todos los medios (cada uno delata «hecho con IA»)

1. Degradados de marca. Única excepción: el velo neutro oscuro sobre una foto o un video.
2. Texto en degradado o una palabra del titular en otro color. Un titular, una tinta.
3. Sombras y brillos en reposo. Solo flotan con sombra: menús, modales, toasts, el botón de chat/WhatsApp.
4. Vidrio (`backdrop-filter`).
5. Iconos dentro de un cuadrito o círculo de color. (Se quedan los que dicen un estado: el check de
   «listo», los ámbar de «te toca», los nodos del riel.)
6. Números decorativos 01 / 02 / 03. Si el orden importa, `<ol>`.
7. Cifras o letras gigantes en marca de agua.
8. MAYÚSCULAS con letra espaciada y píldoras encima de títulos. (Un texto tecleado en mayúsculas en el
   fuente se queda: es copy.)
9. Cajas con borde de 1 px y franjas de color al costado. Se permiten: los campos de formulario, las
   tablas de datos, los separadores de filas de una lista y los fragmentos de producto (`data-ui`).
10. Radios de 12-16 px.
11. Fotos de banco de gente con portátil; estrellas de valoración; comillas gigantes decorativas.
12. Rejillas de N tarjetas iguales y medias pantallas vacías: se usan mosaicos y baldosas de tamaños
    distintos, y la mitad derecha de una portada lleva siempre una pieza.
13. Emojis en piezas nuevas. (Un emoji que ya está en un copy se le pregunta a Julian.)

Comprobación: `node ~/.claude/skills/design-taste-frontend/scripts/lint.mjs <fichero>` (0 FAIL; un patrón
legítimo lleva `taste-skill-ignore: motivo`) e `inspect.mjs <url>` en la página servida.

## 5. Logo

- Escudo con rayo en **un solo verde plano `#047857`**, rayo blanco. Paths (viewBox 0 0 64 64):
  escudo `M32 4 L56 16 L56 36 C56 50 46 60 32 64 C18 60 8 50 8 36 L8 16 Z`, rayo
  `M36 18 L26 38 L32 38 L28 56 L42 36 L36 36 Z`.
- «CertiVeh» en Albert Sans 700, **una tinta** (`#0F172A` sobre claro, blanco sobre oscuro). Sin «Veh» en
  verde ni la bajada «CERTIFICACIÓN VEHICULAR». Sobre verde: escudo blanco con rayo verde.
- Ficheros: `~/certiveh/marca-2026-11/logos/` (SVG, PNG, favicons, avatares).
- Certi (la mascota) nunca en la web ni en el portal; solo en marketing, con sus reglas.

## 6. Por medio

### 6.1 Web (certiveh.co y aliado.certiveh.co)

1. Variables `--cv-*` y clases compartidas en un solo fichero (`marca.css` / `index.css`); ninguna página
   escribe un color, fuente o radio suelto. Una barra y un pie para todo el sitio.
2. **Portada:** a pantalla completa (`100svh`) en páginas de venta, video o foto con velo, texto a la
   izquierda y a la derecha lo real de esa página (calculadora, pieza del portal, foto real). Con calculadora,
   el texto acompaña al bajar (sticky en escritorio). Catálogo, blog y legales: cabecera corta.
3. **Paso a paso = el riel** que avanza con el scroll, con la pieza del paso a la derecha («Datos de
   ejemplo» si lleva cifras inventadas).
4. **Cifras en baldosas escalonadas** (la mayor en campo verde, otra en campo oscuro). **Preguntas:** la
   respuesta siempre en el HTML (`hidden` al cerrar, `aria-expanded`/`aria-controls`).
5. Barra transparente sobre cabeceras oscuras; sólida al bajar 40 px.
6. Imágenes sociales: 1200×630, JPEG ligero (~50 KB), una por artículo con su titular, `og:image:width/height`.

### 6.2 App (portal, portales de aliado, maquetas)

1. **Cada pantalla abre con el campo oscuro** a todo el ancho: titular de portada a la izquierda y, a la
   derecha, **la pieza de producto** en blanco con la esquina cortada (en el panel, el trámite: placa, vehículo,
   riel de 7 etapas, %, la acción del estado). Nunca media pantalla vacía.
2. Debajo, **tablero de baldosas** (12 columnas, 8 px): verde cuando toca hacer algo, oscura para estado
   informativo, tono para lo demás, blanca para listas.
3. **Filtros** = control segmentado (fondo tono, activo en blanco); campos en tono o con la línea de campo,
   anillo verde de 3 px al foco. Botones: principal verde plano; «te toca a ti» ámbar; sobre verde, blanco.
4. Celular: orden por prioridad (avisos → trámite y su acción → IVA → resto); riel vertical; barra inferior
   que no tapa contenido; botones principales a todo el ancho, 48 px.
5. Win Win = el módulo `.ww-mod` de la landing, idéntico.
6. Los portales de aliado conservan sus colores, fuente y radio (`applyPartnerTheme`) y heredan la forma:
   plano, sin sombras, sin degradados.

### 6.3 Correo

1. HTML de tablas con estilos en línea, ancho 600 y fluido en celular; `bgcolor` además de `background-color`;
   nada de flex, grid, degradados ni sombras.
2. Pila `'Albert Sans',-apple-system,…,Arial,sans-serif` (Albert Sans casi nunca carga: el respaldo debe
   verse bien). `<meta name="color-scheme" content="light">`.
3. Cuerpo y fondo exterior en tono `#F0F4F2`; chasis con radio 6 y sin borde; cabecera en campo oscuro con
   «CertiVeh» en una tinta, **glifo suelto sin caja** (`#A7F3D0`, o `#D97706` si pide acción) y rótulo
   13 px/600 en `#A7F3D0`, sin píldora.
4. Tarjetas de datos y avisos sin borde (el tono las separa); números de pasos en verde 700 sin caja.
5. Botón: verde plano, radio 6, en Outlook `v:roundrect` con `arcsize` 12 %.
6. Letra mínima 13 px; grises de letra pequeña `#64748B`. El sobre común es `_shared/layout-de-correo.ts`.
7. No se rediseñan: el correo que el cliente reenvía a la DIAN, los avisos internos, Alegra, WhatsApp.

### 6.4 PDF propios

1. Albert Sans **incrustada**, logo nuevo, tokens de §2, sin degradados ni turquesa, radio 6 (4,5 pt).
2. Mínimo 9 pt. Superficies en tono sin borde.
3. Al cambiar el dibujo de una plantilla se sube su `VERSION_PLANTILLA`.
4. **Intocables:** formatos oficiales (Formulario 010, declaración juramentada, poderes, mandato, la unión
   de PDFs para la UPME) y el certificado UPME. No llevan color de marca.

### 6.5 Redes e impreso (`visual-assets-guide.md` §00 lo desarrolla)

1. Instagram 1080×1350; logo arriba a la izquierda (60/80 px, 46 px de alto) en SVG en línea.
2. Flyers **13×21 cm exactos** (lienzo 1300×2100, export a escala 2). En impreso, contrastar antes: los
   alfas no se comportan igual en papel.
3. Tres fondos y nada más: foto con velo neutro, campo oscuro plano, campo verde plano (cierre).
4. En HTML la fuente va incrustada en base64 (bajo `file://` no carga por ruta). Albert Sans no tiene «→»:
   la flecha va en SVG.
5. Las piezas ya publicadas no se rehacen.

## 7. Movimiento y accesibilidad

`prefers-reduced-motion`: nada se mueve y nada queda oculto. Contraste AA en todo texto. Foco visible
(3 px en `#047857`). Sin pulsos, rebotes ni aros que laten.

## 8. Cómo se verifica un cambio visual

Huella de textos antes/después (web: `dist/`; correo: render de cada constructor; PDF: texto extraído);
capturas a 390 y 1440 abiertas y revisadas; lint de taste skill; tests del repo; y, para algo compartido,
el mismo cambio en todos sus sitios.

## 9. Dónde están las copias

| Proyecto | Copia de este fichero y de los tokens | Guarda |
|---|---|---|
| Landing | `docs/marca-2026-11/` | `tests/el-sistema-de-marca-es-uno.test.mjs` |
| Portal | `docs/marca-2026-11/` | `src/lib/el-sistema-de-marca-es-uno.test.ts` |
| Panel | `docs/marca-2026-11/` | `src/lib/el-sistema-de-marca-es-uno.test.ts` |
| Aliados (inscripción) | `docs/marca-2026-11/` | `src/test/el-sistema-de-marca-es-uno.test.ts` |
| Marketing (`~/certiveh`) | el original, `marca-2026-11/` | `node marca-2026-11/comprobar.mjs` (compara las cinco) |
