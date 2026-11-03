# Especificaciones para las imágenes Open Graph (`public/og/*.png`)
**CertiVeh - Social Media Preview Image**

---

## 📐 Dimensiones y Formato

### Tamaño Recomendado
- **Resolución:** 1200 x 630 px
- **Formato:** PNG o JPG
- **Peso máximo:** 8 MB (recomendado < 300 KB)
- **Ratio:** 1.91:1

### Dimensiones Alternativas
- **Facebook:** 1200 x 630 px (recomendado)
- **Twitter:** 1200 x 675 px (16:9)
- **LinkedIn:** 1200 x 627 px
- **WhatsApp:** 1200 x 630 px

---

## 🎨 Cómo son hoy (marca 2026-11)

> **Manda `DESIGN_SYSTEM.md` §0** (el sistema visual 2026-11) y `src/styles/marca.css`. Lo que este
> documento decía antes —Inter, el degradado esmeralda → turquesa, píldoras, palabras del titular en
> otro color— quedó retirado en noviembre de 2026 y no se vuelve a usar.

Las siete imágenes las pinta `scripts/generate-og-images.mjs` con satori, todas con la misma
composición, a 1200 x 630:

1. **Fondo:** una foto real del sitio a todo color con el **velo neutro oscuro** encima
   (`rgba(9,14,26,.92)` a la izquierda → `.55` a la derecha), el mismo de las cabeceras del sitio. Es el
   único degradado permitido (§0.4.1): sirve para leer encima, no es un color de marca.
   - `scripts/og-bgs/hero-bg-poster.jpg`: el fotograma del video de la home (público en
     `/hero-bg-poster.webp`). Lo usan home, blog, vehículos, aliados, nosotros y portal.
   - `scripts/og-bgs/otros-activos-poster.jpg`: el del video de `/otros-activos`.
   - La foto de los fundadores se probó para `nosotros` y se descartó: el titular caía sobre las caras.
2. **Logo:** el escudo en **un solo verde plano `#047857`** con el rayo blanco (sale de
   `public/favicon.svg`, rasterizado por el propio guion) y la palabra «CertiVeh» en **una sola tinta**
   (blanco), Albert Sans 700, 38 px.
3. **Titular:** Albert Sans 700, 58 px, interlineado 1,04, tracking -0.03em, **blanco entero**. Las
   palabras que antes iban en verde (`color: "emerald"` en los datos) van en la misma tinta: un titular,
   un color.
4. **Entradilla:** Albert Sans 400, 24 px, `#E2E8F0`.
5. **Puntos clave** (lo que antes eran píldoras): texto blanco 600 a 19 px con la viñeta cuadrada de
   9 px en el verde legible sobre oscuro `#A7F3D0`. Sin caja, sin borde.
6. **URL:** abajo a la derecha, 600, 20 px, en `#A7F3D0`.

Los textos de cada imagen (titular, entradilla, puntos y URL) viven en el array `pages` del guion y
no se cambiaron con el rediseño.

**Tipografía:** Albert Sans 400/600/700 en TTF, en `scripts/fonts/` con su licencia
(`OFL-AlbertSans.txt`, SIL Open Font License 1.1). Se descargaron de Google Fonts.

## 🎨 Paleta

- **Campo oscuro:** `#0F172A` (debajo de la foto)
- **Texto:** `#FFFFFF` y `#E2E8F0`
- **Verde sobre oscuro:** `#A7F3D0` (viñetas y URL)
- **Escudo:** `#047857`
- El turquesa `#14B8A6` **no se usa**. Tampoco hay degradados de marca.

---

## ✅ Checklist de Calidad

### Contenido
- [ ] Logo CertiVeh visible y claro
- [ ] Headline fácil de leer en thumbnails pequeños
- [ ] Propuesta de valor clara en 3 segundos
- [ ] URL del sitio visible
- [ ] Sin texto cortado en los bordes

### Diseño
- [ ] Contraste suficiente (WCAG AA mínimo)
- [ ] Tipografía legible en tamaños pequeños
- [ ] Colores de marca consistentes (DESIGN_SYSTEM.md §0: sin degradados, titular en una tinta)
- [ ] Balance visual equilibrado
- [ ] No elementos importantes en zona de recorte

### Técnico
- [ ] 1200 x 630 px exactos
- [ ] Peso < 300 KB
- [ ] Formato PNG o JPG
- [ ] sRGB color space
- [ ] Texto como gráficos vectoriales (no texto de imagen)

### Testing
- [ ] Preview en Facebook Sharing Debugger
- [ ] Preview en Twitter Card Validator
- [ ] Preview en LinkedIn Post Inspector
- [ ] Preview en WhatsApp (enviar link de prueba)
- [ ] Test en diferentes tamaños de pantalla

---

## 🛠️ Herramientas de Diseño

### Online (No-Code)
- **Canva:** Templates para OG images
- **Figma:** Template OG Image 1200x630
- **Pablo by Buffer:** OG image generator
- **Snappa:** Social media graphics

### Programáticas
- **Vercel OG Image Generation:** Dynamic OG images
- **Cloudinary:** Image transformations
- **Bannerbear:** Automated social images
- **Placid:** Dynamic social images

---

## 📦 Ubicación de los Archivos

Todo en `public/og/`, generado por `scripts/generate-og-images.mjs` (`node scripts/generate-og-images.mjs`).
**Las páginas enlazan el `.jpg`** (40-55 KB); el `.png` de cada página se sigue escribiendo con su nombre de
siempre porque es la URL que las redes ya tienen en caché.

```
/public/og/home.jpg          → la portada y las páginas sin imagen propia (por defecto en BaseLayout)
/public/og/vehiculos.jpg     → el catálogo y las fichas de cada vehículo
/public/og/blog.jpg          → el índice del blog (y el respaldo de un artículo sin imagen propia)
/public/og/blog/<slug>.jpg   → UNA POR ARTÍCULO, con el titular del propio artículo
/public/og/aliados.jpg       → la página de aliados
/public/og/nosotros.jpg      → la página de nosotros
/public/og/otros-activos.jpg → GEE / FNCE
/public/og/portal.jpg        → los enlaces al portal (el portal publica la suya como og-portal.png)
```

**URL Pública:** `https://certiveh.co/og/<nombre>.jpg`. Todas las páginas declaran además
`og:image:width` 1200 y `og:image:height` 630, para que WhatsApp y Facebook pinten la vista previa desde
el primer envío sin descargar la imagen antes.

**Los artículos.** El guion lee el `<h1 class="banner-title">` de cada `src/pages/blog/*.astro` y genera
`og/blog/<slug>.jpg` con ese titular, sin escribir ningún texto a mano: un titular corregido se corrige en
su imagen al reejecutar el guion. `BlogLayout` la enlaza por el slug (meta y `image` del JSON-LD
`BlogPosting`) y, si un artículo nuevo aún no la tiene, cae en `blog.jpg` en vez de enlazar una imagen que no
existe. **Al publicar un artículo nuevo, reejecuta el guion.** El cuerpo del titular baja con su longitud
(64 → 40 px) para que quepa siempre.

✅ **El guion se puede reejecutar** (noviembre de 2026). Antes sus siete fondos —fotos de banco—
vivían en `/tmp` y no en el repo, y moría con `ENOENT`. Ahora los fondos están en `scripts/og-bgs/`
(ya recortados a 1200 x 630) y las fuentes en `scripts/fonts/`; el escudo sale de `public/favicon.svg`.
Los textos llevan sus tildes (antes «electricos», «devolucion»: la fuente vieja no las tenía).

`/public/og-image.png` no lo enlaza ninguna página, pero está publicado y pudo haberse compartido: desde el
3-nov-2026 es una copia de `og/home.png`, para que un enlace viejo no muestre la marca anterior.

---

## 📱 Mobile Preview

Asegurar que la imagen se vea bien en:
- WhatsApp mobile (280 x 147 px preview)
- Facebook mobile (500 x 261 px preview)
- Twitter mobile (506 x 253 px preview)
- LinkedIn mobile (552 x 289 px preview)

**Regla de oro:** Si el texto no se lee bien a 280 x 147 px, es muy pequeño.

---

**Última actualización:** 3 de noviembre de 2026  
**Status:** Las siete imágenes, regeneradas con la marca 2026-11 (Albert Sans, escudo plano, sin degradados).
