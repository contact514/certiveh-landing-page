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

## 🎨 Contenido de la Imagen

### Elementos Principales

1. **Logo CertiVeh**
   - Ubicación: Esquina superior izquierda o centro superior
   - Tamaño: ~100-120 px de alto
   - Con escudo verde esmeralda y rayo eléctrico

2. **Headline Principal**
   ```
   Automatiza tu certificado UPME
   ```
   - Tipografía: Inter Bold, 64-72 px
   - Color: Slate 900 (#0F172A)
   - Alineación: Centro o izquierda

3. **Subheadline**
   ```
   Devolución IVA • Deducción en Renta • Exención Arancelaria
   ```
   - Tipografía: Inter Medium, 32-36 px
   - Color: Slate 600 (#475569)

4. **Beneficio Visual**
   - Icono de escudo con checkmark
   - Pill badge: "100% en línea"
   - Visual de vehículo eléctrico (opcional)

5. **CTA Visual**
   ```
   certiveh.co
   ```
   - Tipografía: Inter SemiBold, 28-32 px
   - Color: Emerald 600 (#059669)
   - Ubicación: Parte inferior

---

## 🎨 Paleta de Colores

### Colores de Marca
- **Fondo:** White (#FFFFFF) o Slate 50 (#F8FAFC)
- **Primario:** Emerald 600 (#059669)
- **Acento:** Teal 500 (#14B8A6)
- **Texto:** Slate 900 (#0F172A)
- **Texto Secundario:** Slate 600 (#475569)

### Gradiente (Opcional)
```css
background: linear-gradient(135deg, #059669 0%, #14B8A6 100%);
```

---

## 📝 Texto Recomendado

### Opción 1: Orientada a Beneficio
```
✓ Automatiza tu certificado UPME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Devolución IVA · Deducción 50% en Renta
Exención Arancelaria

100% en línea · Sin trámites manuales
certiveh.co
```

### Opción 2: Orientada a Proceso
```
3 documentos
15 minutos
Tu certificado UPME listo

CertiVeh tramita tu certificado ante la UPME
certiveh.co
```

### Opción 3: Orientada a ROI
```
Deduce hasta
$75.000.000
de tu base gravable

Automatización del certificado UPME
certiveh.co
```

---

## 🖼️ Layout Sugerido

### Layout A: Hero Centrado
```
┌─────────────────────────────────────────┐
│                                         │
│            [LOGO CERTIVEH]              │
│                                         │
│     Automatiza tu certificado UPME      │
│                                         │
│   Devolución IVA • Deducción • Arancel   │
│                                         │
│     [Escudo Icon]  100% en línea        │
│                                         │
│            certiveh.co                  │
│                                         │
└─────────────────────────────────────────┘
```

### Layout B: Split Screen
```
┌────────────────────┬────────────────────┐
│                    │                    │
│  [LOGO CERTIVEH]   │                    │
│                    │    [VISUAL DE      │
│  Automatiza tu     │     VEHÍCULO       │
│  certificado UPME  │     ELÉCTRICO]     │
│                    │                    │
│  ✓ Devolución IVA    │                    │
│  ✓ Deducción 50%   │                    │
│  ✓ Exención       │                    │
│                    │                    │
│  certiveh.co       │                    │
│                    │                    │
└────────────────────┴────────────────────┘
```

### Layout C: Badge Style
```
┌─────────────────────────────────────────┐
│  [Gradient Background Emerald → Teal]   │
│                                         │
│         [ESCUDO GRANDE - BLANCO]        │
│                                         │
│          CertiVeh                       │
│                                         │
│    Automatiza tu certificado UPME       │
│                                         │
│  [Badge] $75M de base gravable  [Badge]    │
│  [Badge] 100% en línea       [Badge]    │
│                                         │
│           certiveh.co                   │
│                                         │
└─────────────────────────────────────────┘
```

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
- [ ] Colores de marca consistentes
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

⚠️ **Esto ya NO está pendiente, y el documento decía que sí.** Hay **siete** PNG servidos hoy en
`public/og/`, generados por `scripts/generate-og-images.mjs`:

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

⚠️ **Los PNG llevan el copy anterior al renombrado de septiembre de 2026**: se generan desde el
script, así que hay que volver a correrlo para que digan «gestión».

⚠️ **Pero hoy ese script NO se puede reejecutar**: sus siete imágenes de fondo viven en `/tmp` y no
están en el repo, así que muere con `ENOENT`. Antes de regenerar hay que recuperar los fondos y
meterlos en el repo. (Esa mitad del aviso también estaba solo dentro del `.mjs`.) Ese aviso estaba solo dentro del
`.mjs`, o sea invisible para quien abriera este documento — que es justo el que va a decidir si
hacen falta.

⚠️ Y `/public/og-image.png` **sí existe**, está trackeado en git y se publica en
`https://certiveh.co/og-image.png` — un borrador anterior de este apartado decía que no. Lo cierto
es peor: existe y está **huérfano**, ninguna página lo referencia (`BaseLayout` usa `/og/home.png`
por defecto). O se borra o se documenta para qué queda.

---

## 📱 Mobile Preview

Asegurar que la imagen se vea bien en:
- WhatsApp mobile (280 x 147 px preview)
- Facebook mobile (500 x 261 px preview)
- Twitter mobile (506 x 253 px preview)
- LinkedIn mobile (552 x 289 px preview)

**Regla de oro:** Si el texto no se lee bien a 280 x 147 px, es muy pequeño.

---

**Última actualización:** 8 de septiembre de 2026  
**Status:** Las siete imágenes existen y se sirven. Pendiente: regenerarlas con el copy de «gestión».
