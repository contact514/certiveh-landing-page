# CertiVeh - Todos los Copies de la Landing Page
**Versión 1.1 · 8 de septiembre de 2026**

---


> ⚠️ **ESTE DOCUMENTO VA POR DETRÁS DEL CÓDIGO. Coteja CADA bloque con el `dist` antes de copiarlo.**
>
> Auditado el 8-sep-2026: al menos dieciséis bloques describen componentes que ya no se sirven así
> —el menú, el headline, el CTA del hero, las FlipWords, las Stat Pills, el Ticker, las Cards 1, 2,
> 4 y 6, el callout de ventanas, el subtítulo de Cómo Funciona, el paso 01, las barras del
> desglose, la FAQ entera, el CTA final y el footer—. **No es una lista cerrada**: la versión
> anterior de este aviso nombraba seis y por omisión daba por vigente todo lo demás, incluida una
> FAQ que prometía algo que los T&C contradicen.

## 📋 NAVEGACIÓN

### Menú Principal
- Beneficios
- Cómo funciona
- Calculadora
- **CTA:** Empezar ahora

---

## 🎯 HERO SECTION

### Headline Principal
**Tu vehículo eléctrico**  
**tiene derecho a** [texto rotativo]

### Textos Rotativos (FlipWords)
1. devolución de IVA
2. deducción en renta
3. exención de arancel en importación directa
4. un certificado UPME

### Subheadline
CertiVeh tramita tu certificado ante la UPME y gestiona tu devolución de IVA ante la DIAN.  
Tú subes tus documentos, firmas y reenvías un correo.

### CTAs Hero
- **Primario:** Calcular mi beneficio
- **Secundario:** ¿Cómo funciona?

### Trust Strip (4 elementos)
- ✓ Sin cuenta en la UPME
- ✓ Notificaciones WhatsApp
- ✓ Pago único
- ✓ 100% en línea

### Stat Pills (3 elementos)
1. **5%** - Devolución de IVA
2. **50%** - Deducción renta
3. **Exención** - Arancel en importación directa

---

## 📣 TICKER (Banda Animada)

### Mensajes Repetitivos
*[Se repiten en loop infinito]*
- Certificado UPME automático
- Sin trámites manuales
- 100% en línea
- Deduce hasta $75M de tu base gravable
- IA extrae tus datos
- Radicación automática ante la UPME
- Notificaciones WhatsApp
- Sin cuenta UPME

---

## 💰 SECCIÓN: BENEFICIOS

### Título
**Tres beneficios tributarios.**  
**Una sola gestión.**

### Subtítulo
El Estado colombiano creó estos incentivos para promover la movilidad eléctrica. La mayoría de propietarios nunca los reclama, por la complejidad del proceso.

### Card 1: Devolución de IVA
- **Tag:** IVA
- **Título:** Devolución de IVA
- **Porcentaje:** 5%
- **Descripción:** Los vehículos eléctricos e híbridos pagan un IVA reducido del 5%, y con el certificado UPME puedes solicitar a la DIAN su devolución. En un vehículo de $120M sin IVA, son $6M. El reconocimiento y el monto los decide la DIAN.
- **Ejemplo:** $120M sin IVA → solicitas $6.000.000

### Card 2: Deducción en Renta
- **Tag:** RENTA
- **Título:** Deducción en renta
- **Porcentaje:** 50%
- **Descripción:** Personas naturales y jurídicas pueden deducir hasta el 50% del valor del vehículo en su declaración de renta del año de la compra.
- **Ejemplo:** $150M → deduces $75.000.000

### Card 3 (histórica): Exención de arancel en importación directa

> ⚠️ **En la home servida el tercer titular es «Depreciación acelerada · 3 años», no el arancel.**
> Auditado el 8-sep-2026: la palabra «arancel» aparece **una sola vez** en toda la home, y está en
> el JSON-LD de `Organization`, no en la página visible. El arancel sigue siendo un beneficio real
> y se nombra con esta formulación exacta —«Exención de arancel en importación directa»—, pero **no
> es una de las tres tarjetas visibles**: el `<h2>` dice «Tres beneficios tributarios» y no hay una
> cuarta. Su única aparición es el JSON-LD de `Organization`, donde va tercero de tres. Quien copie
> de aquí sin mirar reintroduce el arancel como tarjeta y se deja fuera la depreciación.
- **Tag:** ARANCEL
- **Título:** Exención de arancel en importación directa
- **Porcentaje:** Exención
- **Descripción:** Exención de arancel en importación directa para vehículos eléctricos e híbridos bajo la Ley 1964. Aplica al momento de la importación.
- **Ejemplo:** Varía según modelo y origen

### Callout Informativo (Ventanas UPME)
**La ventana de radicación de la UPME va del 1 de febrero al 15 de diciembre.** Si no radicas antes del 15 de diciembre, la siguiente abre el 1 de febrero. (Resolución UPME 400 de 2026: se acabaron los dos ciclos cerrados.)

---


> ⚠️ **LO QUE ESTE DOCUMENTO NO DECÍA, Y HAY QUE DECIR EN CUALQUIER COPY NUEVO DE IVA.**
>
> Auditado el 8-sep-2026: `cita`, `poder`, `notaría` y `seccional` salían **cero veces** en todo el
> fichero. Quien escriba copy nuevo partiendo de aquí reproduce la asimetría que costó tres rondas
> cerrar en la web. Los cuatro hechos, tal cual hay que contarlos:
>
> · **La cita ante la DIAN la pedimos nosotros, en las DOS modalidades** — pero solo la exigen
>   cinco seccionales (Bogotá, Medellín, Cali, Bucaramanga y Grandes Contribuyentes), así que va
>   SIEMPRE condicionada: «si tu seccional la exige». Sin condicionar es falso para la mayoría.
>   Y la DIAN concede **una sola por contribuyente**: si la pide el cliente, gasta el cupo.
> · **La cita NO es presencial.** Nadie va a ninguna oficina: se atiende mandando el correo ese
>   día, antes de la hora asignada.
> · **El correo de radicación lo reenvía SIEMPRE el cliente**, desde la dirección inscrita en su
>   RUT, porque la DIAN exige que la solicitud salga del contribuyente. **También con poder.**
>   Nunca escribir que radicamos nosotros ante la DIAN. *(Ante la UPME sí radicamos: eso es otra
>   cosa y sí se puede decir.)*
> · **Con poder solo cambia quién firma el Formulario 010**: lo firmamos nosotros. A cambio, el
>   cliente autentica el poder en **notaría** —presencial, obligatorio y **lo paga él**—. La
>   declaración juramentada la firma él en las DOS modalidades, igual que el reenvío del correo.


## ⚙️ SECCIÓN: CÓMO FUNCIONA

### Título
**Así de simple**  
**es el trámite.**

### Subtítulo
De tu teléfono al certificado UPME. Sin que tengas que interactuar con ningún portal gubernamental.

### Paso 01: Sube tus documentos
- **Subtitle:** Menos de 3 minutos
- **Descripción:** Solo necesitas tus documentos: cédula, tarjeta de propiedad y factura de compra, más el RUT si vas a pedir la devolución del IVA. Si eres empresa, además va el certificado de Cámara de Comercio vigente; el RUT lo pide la devolución de IVA, no el certificado UPME. Nuestro sistema extrae todos los datos automáticamente con inteligencia artificial.
- **Detail:** Sin formularios manuales. Sin errores de digitación.

### Paso 02: Revisa y confirma
- **Subtitle:** 30 segundos
- **Descripción:** Verificas que los datos extraídos sean correctos. Puedes editar cualquier campo antes de continuar. Una vez confirmas, nos pones a trabajar.
- **Detail:** La IA extrae +90% de los datos correctamente en el primer intento.

### Paso 03: Pago único
- **Subtitle:** Una sola vez
- **Descripción:** Pagas nuestra tarifa de servicio una sola vez. Sin suscripciones. Aparte va el costo del trámite ante la UPME. El pago confirma tu caso y activa el proceso.
- **Detail:** Procesado con Wompi · Tarjeta, PSE o Nequi.

### Paso 04: Nosotros hacemos todo
- **Subtitle:** Tú no haces nada más
- **Descripción:** Nuestro agente automatizado crea tu cuenta en la UPME, llena todos los formularios con tus datos y radica la solicitud de inmediato.
- **Detail:** Sin que tengas que tocar ningún portal gubernamental.

### Paso 05: Recibe tu certificado
- **Subtitle:** Lo descargas desde tu panel
- **Descripción:** Te notificamos por WhatsApp y email en cada etapa del proceso. Cuando el certificado está listo, lo descargas directamente desde tu dashboard.
- **Detail:** Seguimiento en tiempo real. Nunca te dejamos sin información.

---

## 🧮 SECCIÓN: CALCULADORA

### Título
**¿Cuánto vale tu beneficio?**

### Subtítulo
Mueve el slider y ve el desglose en tiempo real, con el costo del trámite incluido.

### Controles

#### Tipo de vehículo
- Eléctrico puro
- Híbrido

#### Valor del vehículo
- Rango: $40M - $600M
- Labels: "Valor del vehículo (sin IVA)"


#### Barras de Desglose
- Devolución IVA
- Deducción renta
- Exención de arancel en importación directa

#### Honorarios
**Honorarios CertiVeh (tarifa fija)**  
*Estimación referencial. Valor real depende del régimen tributario.

### Panel de Resultados

#### Label Principal
**BENEFICIO TOTAL ESTIMADO**

#### Label Secundario
en incentivos tributarios (incluye base gravable en renta)

#### Beneficio Neto
**BENEFICIO ESTIMADO MENOS EL COSTO TOTAL**

#### ROI Copy
Por cada **$1** de costo total, un beneficio estimado de **$[X]**.

#### CTA
**Empezar ahora**

#### Microcopy
Si la UPME rechaza, revisamos tu caso · Si el error es nuestro, corregimos sin costo

---

## 🛡️ SECCIÓN: CONFIANZA

### Título
**Hecho para que no**  
**tengas que preocuparte.**

### Card 1: Agente automatizado
Nuestra tecnología navega el portal UPME por ti, llena todos los formularios y radica la solicitud sin que tengas que hacer nada.

### Card 2: Actualización en tiempo real
Seguimiento completo por WhatsApp y email. Sabes exactamente en qué etapa está tu trámite, en todo momento.

### Card 3: Tus datos, protegidos
Cifrado de extremo a extremo. Cumplimos la Ley 1581 de Habeas Data. Nunca compartimos tu información con terceros.

### Card 4: Radicación inmediata
La ventana de la UPME es continua, del 1 de febrero al 15 de diciembre: tu solicitud se radica de inmediato. Si te registras con la ventana cerrada, entra en cuanto reabra y te avisamos.

### Card 5: Sin portal gubernamental
Tú nunca tienes que entrar a la UPME. Nosotros creamos la cuenta, gestionamos el proceso y resolvemos cualquier imprevisto.

### Card 6: Pago único, sin letra pequeña
Una sola tarifa de servicio, sin suscripciones. Aparte van el costo del trámite ante la UPME y, si eliges darnos poder, la notaría.

---

## ❓ SECCIÓN: FAQ

### Título
**Todo lo que necesitas saber**

### Pregunta 1
**¿Qué vehículos califican?**  
Vehículos eléctricos e híbridos NUEVOS registrados en Colombia. **No aplica a híbridos ligeros.** El vehículo debe estar a nombre del solicitante en el RUNT.

### Pregunta 2
**¿Cuándo puedo radicar mi solicitud?**  
La UPME recibe solicitudes en ventana continua, del 1 de febrero al 15 de diciembre. Tu solicitud se radica de inmediato; si te registras con la ventana cerrada, entra en cuanto reabra el 1 de febrero y te avisamos.

### Pregunta 3
**¿Qué documentos necesito?**  
Persona natural: cédula (frente y reverso), tarjeta de propiedad (frente y reverso) y factura de compra, más el RUT si vas a pedir la devolución del IVA. Empresa: cédula del representante legal, tarjeta de propiedad, factura de compra y certificado de Cámara de Comercio vigente. Todo se sube en PDF, JPG o PNG desde tu teléfono.

### Pregunta 4
**¿Cuánto toma el proceso completo?**  
Desde que subes tus documentos hasta la radicación: menos de 10 minutos de tu parte. Desde la radicación hasta el certificado UPME: normalmente unos 15 días hábiles, y el máximo legal son 30.

### Pregunta 5
**¿Qué pasa si la UPME rechaza mi solicitud?**  
Si el rechazo se debe a un error de nuestra parte, gestionamos la corrección y volvemos a radicar sin costo adicional, siempre que sigan vigentes los requisitos de la UPME. Si se debe a información incorrecta proporcionada por el usuario, gestionamos la corrección contigo y la nueva solicitud se cobra según las condiciones vigentes; te informamos el valor antes de cualquier cobro. 

### Pregunta 6
**¿Funciona para personas jurídicas?**  
Sí. El servicio está disponible para personas naturales, independientes y empresas. Además, las empresas e independientes tienen un beneficio adicional: depreciación acelerada del vehículo a 3 años, lo que reduce la base gravable más rápido.

---

## 🚀 SECCIÓN: CTA FINAL

### Título
**Tu certificado UPME**  
**te está esperando.**

### Descripción
Miles de propietarios de vehículos eléctricos en Colombia no han reclamado sus beneficios. La ventana UPME cierra el 15 de diciembre.

### CTA Principal
**Empezar ahora**

### Trust Elements (3 items)
- ✓ Pago único · Sin suscripciones
- ✓ 100% en línea
- ✓ Notificaciones por WhatsApp

---

## 📄 FOOTER

### Descripción de la empresa
Automatización del trámite UPME para certificados de beneficio tributario en Colombia.

### Columna: Plataforma
- Beneficios
- Cómo funciona
- Calculadora

### Columna: Legal
- Términos
- Privacidad
- Ley 1964

### Copyright
© 2026 CertiVeh · Certificados de Beneficio Tributario · Colombia

### Contacto
contacto@certiveh.co

---

## 📱 MENÚ MÓVIL (RESPONSIVE)

### Items del menú
- Beneficios
- Cómo funciona
- Calculadora
- **Botón CTA:** Empezar ahora

---

## 🔗 URLs Y ENLACES

### Link Principal (Portal)
https://portal.certiveh.co

### Anchors Internos
- #beneficios
- #como-funciona
- #calculadora

---

## 📊 DATOS Y NÚMEROS CLAVE

### Porcentajes de Beneficios
- **IVA:** 5%
- **Renta:** 50%
- **Arancel:** exención en importación directa

### Ejemplos de Cálculo
- Vehículo $120M → Devolución de IVA a solicitar: $6.000.000
- Vehículo $150M → Deducción renta: $75.000.000

### Honorarios CertiVeh
- Certificado UPME: $599.990 + IVA (tarifa fija). Gestión del IVA: $499.990 contratada junto al certificado, $599.990 por separado, + IVA. Tramo porcentual solo por encima de $200M.

### Tiempos del Proceso
- Subir documentos: Menos de 3 minutos
- Revisar y confirmar: 30 segundos
- Radicación: Menos de 10 minutos de tu parte
- Certificado UPME: ~15 días hábiles, máximo legal 30

### Precisión de la IA
+90% de los datos extraídos correctamente en el primer intento

### Ventana de radicación UPME
Continua, del 1 de febrero al 15 de diciembre

---

## 🎨 TONO Y VOZ DE MARCA

### Características del Copy
- **Directo y claro:** Sin jerga técnica innecesaria
- **Empático:** Reconoce la fricción burocrática
- **Confiable:** Menciona leyes, cifrado, protección de datos
- **Orientado a beneficios:** Siempre destaca el valor para el usuario
- **Números concretos:** Ejemplos específicos en pesos colombianos
- **Urgencia sutil:** Menciona ventanas limitadas sin ser agresivo
- **Transparente:** Explica honorarios y garantías claramente

### Palabras Clave Recurrentes
- Automático / Automatización
- Sin trámites manuales
- Certificado UPME
- Beneficios tributarios
- 100% en línea
- Pago único
- Pago único
- Ventana de radicación

---

## ✅ MICROCOPY Y DETALLES

### Labels de Formulario
- Tipo de vehículo
- Valor del vehículo (sin IVA)

### Mensajes de Garantía
- Si la UPME rechaza, revisamos tu caso · Si el error es nuestro, corregimos sin costo
- Sin suscripciones
- Aparte van el costo del trámite ante la UPME y, si eliges darnos poder, la notaría

### Status y Procesos
- Procesado con Wompi · Tarjeta, PSE o Nequi
- Todo se sube en PDF, JPG o PNG desde tu teléfono
- Seguimiento en tiempo real

### Formatos de Moneda
$[número] COP (formato colombiano con puntos de miles)

---

**Fin del documento de copies**  
*Última actualización: 8 de septiembre de 2026*
