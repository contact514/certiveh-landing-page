# Especificaciones para Imagen Open Graph (og-image.png)
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
   Exención IVA • Deducción en Renta • Reducción Arancelaria
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
Exención IVA · Deducción 50% en Renta
Reducción Arancelaria

100% en línea · Sin trámites manuales
certiveh.co
```

### Opción 2: Orientada a Proceso
```
3 documentos
15 minutos
Tu certificado UPME listo

CertiVeh automatiza todo el proceso
certiveh.co
```

### Opción 3: Orientada a ROI
```
Recupera hasta
$75.000.000
en beneficios tributarios

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
│   Exención IVA • Deducción • Arancel   │
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
│  ✓ Exención IVA    │                    │
│  ✓ Deducción 50%   │                    │
│  ✓ Reducción       │                    │
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
│  [Badge] $75M en beneficios  [Badge]    │
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

## 📦 Ubicación del Archivo

```
/public/og-image.png
```

**URL Pública:**
```
https://certiveh.co/og-image.png
```

---

## 🔄 Variantes Recomendadas

### Principal (Default)
- `og-image.png` - Imagen genérica de la marca

### Específicas (Futuro)
- `og-image-calculator.png` - Para compartir calculadora
- `og-image-benefits.png` - Para compartir beneficios
- `og-image-faq.png` - Para compartir FAQ

---

## 📱 Mobile Preview

Asegurar que la imagen se vea bien en:
- WhatsApp mobile (280 x 147 px preview)
- Facebook mobile (500 x 261 px preview)
- Twitter mobile (506 x 253 px preview)
- LinkedIn mobile (552 x 289 px preview)

**Regla de oro:** Si el texto no se lee bien a 280 x 147 px, es muy pequeño.

---

**Última actualización:** Marzo 16, 2026  
**Status:** Pendiente de creación
