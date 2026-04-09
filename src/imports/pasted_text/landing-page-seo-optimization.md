Add complete SEO optimization to this landing page. Do not change any visible text, layout, or styles. Only add meta tags, semantic HTML structure, structured data, and SEO attributes.
1. Add these meta tags to the <head>:
html<title>CertiVeh — Certificado UPME para Vehículos Eléctricos en Colombia</title>
<meta name="description" content="CertiVeh automatiza el trámite del certificado UPME para vehículos eléctricos e híbridos en Colombia. Exención de IVA, deducción en renta y reducción arancelaria bajo la Ley 1964 de 2019. 100% en línea." />
<meta name="keywords" content="certificado UPME, vehículos eléctricos Colombia, beneficios tributarios vehículo eléctrico, exención IVA vehículo eléctrico, deducción renta vehículo eléctrico, Ley 1964 2019, trámite UPME, certificado beneficio tributario Colombia" />
<meta name="robots" content="index, follow" />
<meta name="author" content="CertiVeh" />
<link rel="canonical" href="https://certiveh.co" />

<!-- Open Graph (Facebook, LinkedIn, WhatsApp) -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://certiveh.co" />
<meta property="og:title" content="CertiVeh — Certificado UPME para Vehículos Eléctricos en Colombia" />
<meta property="og:description" content="Automatizamos el trámite del certificado UPME de principio a fin. Tú subes tres documentos. Nosotros nos encargamos de todo lo demás." />
<meta property="og:image" content="https://certiveh.co/og-image.png" />
<meta property="og:locale" content="es_CO" />
<meta property="og:site_name" content="CertiVeh" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="CertiVeh — Certificado UPME para Vehículos Eléctricos en Colombia" />
<meta name="twitter:description" content="Automatizamos el trámite del certificado UPME de principio a fin. Tú subes tres documentos. Nosotros nos encargamos de todo lo demás." />
<meta name="twitter:image" content="https://certiveh.co/og-image.png" />
2. Add semantic HTML structure — replace generic divs with proper semantic tags:

Wrap the entire page in <main>
Navigation: use <nav aria-label="Navegación principal">
Hero section: use <section id="hero" aria-label="Hero">
Benefits section: use <section id="beneficios" aria-label="Beneficios tributarios">
How it works section: use <section id="como-funciona" aria-label="Cómo funciona">
Calculator section: use <section id="calculadora" aria-label="Calculadora de beneficios">
Trust section: use <section id="confianza" aria-label="Por qué CertiVeh">
FAQ section: use <section id="faq" aria-label="Preguntas frecuentes">
CTA final section: use <section id="cta-final" aria-label="Comenzar">
Footer: use <footer aria-label="Pie de página">
All section headlines: use <h2> tags
Hero headline: use <h1>
All card titles: use <h3>
FAQ questions: use <h3> inside <details> and <summary> elements for native accordion behavior

3. Add structured data (JSON-LD) — insert before closing </body>:
html<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "CertiVeh",
  "description": "CertiVeh automatiza el trámite del certificado UPME para vehículos eléctricos e híbridos en Colombia. Gestiona la exención de IVA, deducción en renta y reducción arancelaria bajo la Ley 1964 de 2019.",
  "url": "https://certiveh.co",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "COP",
    "description": "Tarifa única de servicio del 5% del beneficio total"
  },
  "provider": {
    "@type": "Organization",
    "name": "CertiVeh",
    "url": "https://certiveh.co",
    "email": "certiveh.contacto@gmail.com",
    "areaServed": "CO",
    "description": "Automatización del trámite UPME para certificados de beneficio tributario en Colombia"
  }
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué vehículos califican?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Vehículos eléctricos puros e híbridos registrados en Colombia que cumplan los requisitos de la Ley 1964 de 2019. El vehículo debe estar a nombre del solicitante en el RUNT."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuándo puedo radicar mi solicitud?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "La UPME abre ventanas de radicación dos veces al año. Si no hay ventana abierta cuando te registras, tu caso queda en cola y lo radicamos automáticamente en la siguiente apertura."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué documentos necesito?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Solo tres: Cédula de ciudadanía (frente y reverso), Tarjeta de Propiedad del vehículo (frente y reverso) y Factura de Compra del vehículo. Todo se sube en PDF, JPG o PNG desde tu teléfono."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto toma el proceso completo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Desde que subes tus documentos hasta la radicación: menos de 10 minutos de tu parte. Desde la radicación hasta el certificado UPME: entre 4 y 8 semanas dependiendo de la UPME."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué pasa si la UPME rechaza mi solicitud?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Revisamos el motivo del rechazo contigo y gestionamos la corrección sin costo adicional. Nuestra política de garantía está detallada en los términos del servicio."
      }
    },
    {
      "@type": "Question",
      "name": "¿Funciona para personas jurídicas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Por el momento el servicio está disponible para personas naturales. El soporte para empresas está programado para el segundo semestre de 2026."
      }
    }
  ]
}
</script>
4. Add performance and accessibility attributes:

Add lang="es" to the <html> tag
Add alt attributes to all images describing their content in Spanish
Add aria-label to all icon-only buttons
Add loading="lazy" to all images below the fold
Add fetchpriority="high" to the hero image
Add rel="noopener noreferrer" to all external links
Make sure all interactive elements have visible focus states

5. Add sitemap hint in <head>:
html<link rel="sitemap" type="application/xml" href="/sitemap.xml" />
Do not change any visible text, colors, fonts, layout, animations, or component behavior. Only add the above SEO, semantic, and accessibility improvements.