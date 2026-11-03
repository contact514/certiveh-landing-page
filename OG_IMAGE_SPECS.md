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

Siete PNG en `public/og/`, generados por `scripts/generate-og-images.mjs`
(`node scripts/generate-og-images.mjs`):

```
/public/og/home.png          → la portada y 20 páginas más (por defecto en BaseLayout)
/public/og/vehiculos.png     → el catálogo y las fichas
/public/og/blog.png          → el índice del blog y los artículos
/public/og/aliados.png       → la página de aliados
/public/og/nosotros.png      → la página de nosotros
/public/og/otros-activos.png → GEE / FNCE
/public/og/portal.png        → los enlaces al portal
```

**URL Pública:** `https://certiveh.co/og/<nombre>.png`

✅ **El guion ya se puede reejecutar** (noviembre de 2026). Antes sus siete fondos —fotos de banco—
vivían en `/tmp` y no en el repo, y moría con `ENOENT`. Ahora los fondos están en `scripts/og-bgs/`
(ya recortados a 1200 x 630) y las fuentes en `scripts/fonts/`; el escudo sale de `public/favicon.svg`.
Las siete imágenes se regeneraron el 3-nov-2026 con el copy vigente del guion.

⚠️ **Pesan unos 500 KB cada una**, por encima de los 300 KB recomendados arriba: es una foto en PNG.
Los nombres de fichero son `.png` y las páginas los citan así, por eso no se pasaron a JPEG.

⚠️ Y `/public/og-image.png` **sí existe**, está trackeado en git y se publica en
`https://certiveh.co/og-image.png`, pero está **huérfano**: ninguna página lo referencia (`BaseLayout`
usa `/og/home.png` por defecto) y el guion **no** lo genera, así que sigue con la marca anterior. O se
borra o se documenta para qué queda.

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
