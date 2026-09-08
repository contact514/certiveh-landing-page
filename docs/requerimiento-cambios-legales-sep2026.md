# Requerimiento de modificación de documentos legales

**Para:** equipo jurídico de CertiVeh
**De:** CertiVeh — Operación
**Fecha:** 8 de septiembre de 2026
**Documentos afectados:**

1. **Política de Tratamiento de Datos Personales** — versión 2.0, vigente desde el 27 de agosto de 2026, publicada en `certiveh.co/politica-de-privacidad`
2. **Términos y Condiciones** — Anexo del Servicio de Devolución del IVA y artículo del mandato administrativo, publicados en `certiveh.co/terminos-y-condiciones`

---

## 1. Qué les pedimos y por qué

Este documento reúne, en un solo lugar, **los cambios que la operación necesita** en los dos documentos legales publicados. Cada punto va con la **cita literal** de lo que dice hoy, **por qué no corresponde** con lo que el sistema hace de verdad, **qué debería decir**, y **las preguntas** que solo ustedes pueden contestar.

**La redacción final es suya.** Nosotros aportamos el hecho técnico verificado; ustedes deciden cómo se dice.

Los puntos están ordenados por urgencia. Los tres primeros de la Parte A describen **tratamientos de datos que ya están ocurriendo** y que la Política no declara, lo que en nuestra lectura es un incumplimiento del régimen de habeas data (Ley 1581 de 2012 y Decreto 1377 de 2013), no una imprecisión de redacción. El punto B.1 describe **una modalidad de servicio que ya se vende y se cobra** sin respaldo contractual.

---

# PARTE A · Política de Tratamiento de Datos Personales v2.0

## A.1 · La grabación de sesión no está declarada — **entró en producción el 8 de septiembre de 2026**

### Qué está pasando

Desde hoy, el portal de clientes (`portal.certiveh.co`) **graba la sesión de navegación** de los usuarios mediante la herramienta **PostHog**, operada por PostHog Inc. (Estados Unidos). Se activó para diagnosticar en qué paso exacto abandonan los usuarios el trámite.

La grabación reconstruye lo que ocurrió en pantalla: en qué paso está el usuario, dónde hace clic, qué campo enfoca, cómo se mueve y en qué punto abandona.

### Qué SÍ y qué NO se captura

Esto importa para la redacción, porque acota el tratamiento:

**No se captura:**

- El **texto** de la pantalla: va enmascarado en su totalidad.
- El **contenido de los campos** que el usuario diligencia.
- Los **documentos** que sube (cédula, RUT, tarjeta de propiedad, factura): los selectores de archivo están bloqueados.
- El **contenido de las peticiones** al servidor.
- Los **mensajes de consola** del navegador.
- El **lienzo gráfico** (`canvas`).
- El **correo, nombre o teléfono** del usuario: a PostHog solo se le envía el identificador interno (UUID).

**Sí se captura:**

- La **secuencia de interacción**: pasos, clics, desplazamientos, tiempos.
- La **ruta** de las páginas visitadas.
- **Datos técnicos** del navegador y del dispositivo.
- La **dirección IP**, tratada por PostHog como dato de conexión.

### Por qué se lo traemos

Aunque el enmascarado es amplio, **la grabación de la sesión de un titular en un formulario donde diligencia datos personales es un tratamiento**, y PostHog Inc. es un **encargado nuevo** que no figura en la Política. Además implica **transferencia internacional de datos** a Estados Unidos.

### Qué debería decir la Política

- Declarar la **finalidad**: analítica de producto y mejora de la experiencia de uso, mediante registro de la interacción del usuario con la Plataforma.
- Incorporar a **PostHog Inc.** en la lista de Encargados del artículo 13.1, con su país.
- Precisar el **alcance** de lo grabado y, sobre todo, lo que **no** se graba, en los términos de arriba.
- Cubrir la **transferencia internacional** en el artículo correspondiente.

### Preguntas para ustedes

1. ¿Basta con declararlo en la Política, o hace falta además un **aviso o consentimiento específico** en el portal antes de grabar (banner, aviso en el primer paso)?
2. ¿Debe ofrecerse al titular una **forma de oponerse** a la grabación sin perder el servicio?
3. ¿El **plazo de conservación** de las grabaciones debe fijarse en la Política? (Hoy PostHog las conserva según su configuración por defecto; podemos ajustarla al plazo que ustedes indiquen.)
4. ¿La **dirección IP** exige mención expresa como dato tratado?

> **Nota operativa.** La grabación se puede desactivar en minutos si ustedes consideran que no debe operar hasta que la Política esté actualizada. Solo hay que decirlo.

---

## A.2 · La lista de Encargados está incompleta: faltan ocho

### Qué dice hoy

El artículo 13.1 declara **tres** Encargados: **Supabase**, **GoDaddy** y **Google Analytics**.

### Qué está pasando

Verificado en el código en producción, **ocho proveedores más reciben datos personales** de titulares:

| # | Encargado | Finalidad | Datos que recibe |
|---|---|---|---|
| 1 | **Wompi** (Bancolombia, Colombia) | Pasarela de pago | Nombre, documento, correo, valor |
| 2 | **Mercado Pago** (Argentina/Colombia) | Pasarela de pago | Nombre, documento, correo, valor |
| 3 | **Alegra** (Colombia) | Facturación electrónica | Nombre o razón social, NIT o cédula, correo, dirección |
| 4 | **Resend** (Estados Unidos) | Envío de correo transaccional | Nombre, correo |
| 5 | **Hetzner** (Alemania) | Envío de correo | Nombre, correo |
| 6 | **Twilio** (Estados Unidos) | Verificación por SMS | Número de teléfono |
| 7 | **Meta / WhatsApp Business** (Estados Unidos) | Notificaciones y soporte | Número de teléfono, nombre, contenido de la conversación |
| 8 | **ZapSign** (Brasil) | Firma electrónica de la declaración juramentada | Nombre, correo, teléfono **y el PDF completo del documento**, que contiene cédula, datos del vehículo y cuenta bancaria |
| 9 | **PostHog** (Estados Unidos) | Analítica y grabación de sesión | Ver A.1 |

**ZapSign merece atención especial:** no recibe un dato suelto, recibe **el documento completo** que el titular firma, con su cédula y su cuenta bancaria dentro.

### Por qué está mal

El artículo 13.1 le dice al titular quién más trata sus datos. Hoy nombra a tres de doce.

### Qué debería decir

Incorporar los ocho (más PostHog) a la lista, con su finalidad y su país. Y revisar si la cláusula de **transferencia internacional** cubre a los que están fuera de Colombia: hoy hay proveedores en Estados Unidos, Alemania y Brasil.

### Preguntas para ustedes

1. ¿La lista debe ser **nominativa y cerrada** —lo que obliga a actualizar la Política cada vez que cambiemos de proveedor— o basta con **categorías** de encargados con un enlace a la lista vigente?
2. ¿Hace falta declaración expresa de **transferencia internacional** por cada país, o una cláusula general?
3. ¿Alguno de estos requiere **contrato de transmisión de datos** firmado, conforme al Decreto 1377?

---

## A.3 · El programa Win Win no está declarado, ni los datos bancarios que pedimos

### Qué está pasando

El programa **Win Win** está en producción **desde el 14 de mayo de 2026** y mueve dinero real: quien refiere a un cliente recibe **$75.000**.

Para pagarle, el portal le pide al Referidor: **entidad bancaria, tipo y número de cuenta, nombre del titular de la cuenta y su documento**.

### Por qué está mal

La Política v2.0 **no menciona el programa ni una vez**. Sus tres referencias a "referido" son todas sobre Aliados Comerciales, que es otra figura.

Es decir: **pedimos datos financieros para un tratamiento que la Política no declara.**

Hay un agravante: el resumen de política que la v2.0 sustituyó **sí** declaraba estos datos. En este punto concreto, **el documento nuevo va hacia atrás**.

### Qué debería decir

- Declarar la **finalidad**: gestión del programa de referidos y pago de la recompensa.
- Declarar los **datos financieros** recolectados del Referidor.
- Precisar el **plazo de conservación** de esos datos bancarios.
- Aclarar el tratamiento cuando el Referidor **no es cliente** de CertiVeh, que es el caso habitual.

### Preguntas para ustedes

1. Los datos bancarios, ¿son **dato sensible** en este contexto o basta con la autorización general?
2. ¿El Referidor que no es cliente necesita **autorización separada**, distinta de la que acepta el usuario del portal?
3. ¿Cuánto tiempo debemos conservar la cuenta bancaria después de pagar?

---

# PARTE B · Términos y Condiciones — Anexo del Servicio de Devolución del IVA

> Esta parte reproduce el requerimiento entregado el 7 de septiembre de 2026, sin cambios de fondo. Se incorpora aquí para que exista **un solo documento** de trabajo.

## B.0 · El servicio, tal como funciona hoy

Confirmado con el asesor tributario entre el 2 y el 7 de septiembre de 2026:

1. El Usuario contrata el acompañamiento y sube sus documentos.
2. CertiVeh arma el expediente completo: Formato 010 diligenciado, relación de facturas, declaración juramentada, certificado bancario, certificado UPME, factura y, si es persona jurídica, certificado de existencia y representación legal.
3. **La cita ante la DIAN la solicita CertiVeh**, en las dos modalidades, cuando la Dirección Seccional del RUT del Usuario la exige. Solo **5 de las 34 seccionales** la exigen (Bogotá, Medellín, Cali, Bucaramanga y Grandes Contribuyentes); las demás radican por buzón electrónico.
4. **La cita NO es presencial.** Se agenda como no presencial y "atenderla" consiste en enviar un correo el día asignado, antes de la hora.
5. **La radicación la ejecuta materialmente el Usuario**, reenviando desde la dirección de correo inscrita en su RUT el mensaje que CertiVeh le deja redactado. **Esto es así también cuando otorga poder**: la DIAN exige que la solicitud salga del contribuyente.
6. **Hay dos modalidades**, y lo único que las distingue es **quién firma el Formato 010**:
   - **Sin poder:** lo firma el Usuario.
   - **Con poder:** lo firma CertiVeh como apoderado (código de representación 6 del formulario). El Usuario otorga un poder y **lo autentica ante notaría** (ese paso sí es presencial y obligatorio).

   En las dos, la declaración juramentada la firma el Usuario y el correo lo reenvía el Usuario.

---

## B.1 · La modalidad "con poder" no existe en el contrato — **el punto más urgente**

### Dice hoy

Anexo, definición de *Formato 010*:

> «El formato de solicitud de devolución y/o compensación dispuesto por la DIAN, que el Operador de la Plataforma diligencia con base en la información y los documentos suministrados por el Usuario, **para su posterior firma por parte del Usuario** y radicación ante la DIAN.»

Y en el cuerpo del Anexo:

> «…el Operador de la Plataforma diligenciará el Formato 010 dispuesto por la DIAN para la solicitud de devolución del IVA y **lo remitirá al Usuario para su revisión y firma**.»
>
> «El Usuario es responsable de revisar la información contenida en el Formato 010 **antes de firmarlo**. Con la firma del Formato 010, el Usuario declara que la información allí consignada es veraz…»

### Por qué está mal

El contrato asume que el Formato 010 lo firma siempre el Usuario. En la modalidad "con poder" **lo firma CertiVeh**, y esa modalidad **se ofrece y se cobra hoy** en el portal.

Además, el artículo del mandato administrativo limita la representación **exclusivamente al trámite ante la UPME**:

> «…dicho mandato **no implica la representación legal del Usuario para efectos distintos del proceso de solicitud del certificado**, ni le confiere al Operador de la Plataforma facultades para asumir obligaciones, celebrar actos jurídicos o realizar disposiciones en nombre del Usuario más allá de las expresamente señaladas en este artículo.»

O sea: el documento que debería habilitar la representación ante la DIAN **la excluye expresamente**.

### Qué debería decir

Que el Formato 010 lo firma el Usuario **o**, cuando este haya otorgado poder especial autenticado ante notaría, el Operador de la Plataforma en su calidad de apoderado; y que la declaración de veracidad de la información sigue siendo del Usuario en los dos casos. Y que el mandato administrativo alcance también las actuaciones ante la DIAN cuando medie ese poder.

### Preguntas para ustedes

1. ¿El poder especial autenticado debería quedar regulado en los propios T&C (requisitos, alcance, revocación, vigencia) o como anexo aparte que el Usuario firma?
2. Con poder, ¿quién responde si el Formato 010 lleva un dato equivocado que salió de la información que suministró el Usuario? Hoy la cláusula de veracidad cuelga de la firma del Usuario, y esa firma deja de existir en esa modalidad.
3. ¿Hay que decir algo sobre la **revocación** del poder a mitad de trámite?

---

## B.2 · "Radicación presencial": no existe

### Dice hoy

Anexo, definición de *Cita DIAN*:

> «El turno o cita que, según la ciudad o Dirección Seccional competente, deba solicitarse para la **radicación presencial** o atención del trámite ante la DIAN, sujeta a la disponibilidad de agenda de dicha entidad.»

### Por qué está mal

La cita se agenda como **no presencial**. Nadie acude a una oficina de la DIAN: el día de la cita se envía un correo antes de la hora asignada. Dejar "presencial" en el contrato le hace esperar al Usuario un trámite que no va a ocurrir, y describe mal la única obligación con hora límite que tiene.

### Qué debería decir

Que la cita se solicita cuando la Dirección Seccional del RUT del Usuario lo exige, que **no es presencial**, y que su atención consiste en el envío del correo de radicación el día y antes de la hora asignados.

---

## B.3 · "El Operador radica ante la DIAN": no lo hace, y no puede

### Dice hoy

Anexo, definición del *Servicio* y cuerpo del Anexo:

> «…consistente en la recopilación, organización, revisión preliminar, diligenciamiento **y radicación de la solicitud** de devolución del IVA pagado… ante la DIAN, así como en el seguimiento del trámite.»
>
> «…mediante el cual el Operador de la Plataforma recopila, organiza, revisa de manera preliminar, diligencia **y radica ante la DIAN** la solicitud de devolución del IVA…»

### Por qué está mal

El acto material de radicación consiste en enviar la solicitud **desde el correo electrónico inscrito en el RUT del solicitante**. La DIAN no gestiona la solicitud si llega de otra dirección. Por eso ese envío lo hace **siempre el Usuario**, también cuando ha otorgado poder. CertiVeh prepara el expediente, solicita la cita y deja el correo redactado, pero no lo envía.

No es un matiz cosmético: es la obligación del Usuario que más fácil se incumple, y el contrato hoy le dice justo lo contrario.

### Qué debería decir

Que el Operador prepara el expediente y **deja la solicitud lista para radicación**, y que **el envío del correo de radicación desde la dirección inscrita en el RUT es una obligación del Usuario**, en las dos modalidades, porque así lo exige la DIAN. Conviene que quede como obligación expresa del Usuario y no solo como descripción del servicio.

---

## B.4 · El plazo de pago de la DIAN: el contrato es más optimista que nuestro material

### Dice hoy

> «…para los casos que cumplen el mecanismo de **devolución automática**… la devolución tendrá lugar dentro de los **quince (15) días** siguientes a la fecha de radicación de la solicitud. En los demás casos, los plazos de respuesta y pago serán los previstos en la normativa aplicable, los cuales pueden ser superiores.»

### Por qué lo levantamos

La cláusula es correcta en derecho y está bien matizada, pero **todo nuestro material de cara al cliente dice "hasta 50 días hábiles"** (artículo 855 del Estatuto Tributario), que es el plazo general. No es una contradicción jurídica, pero un Usuario que lea los T&C puede quedarse con los 15 días y reclamarlos.

### Qué les pedimos

Que nos digan si conviene dejarlo, reordenarlo para que el plazo general aparezca primero, o suprimir la mención a los 15 días. **Es su criterio, no el nuestro.**

---

## B.5 · Dos puntos menores, por coherencia

- **Gastos a cargo del Usuario.** La cláusula de la tarifa ya excluye «certificaciones de contador o revisor fiscal, autenticaciones u otros documentos exigidos por la normativa aplicable o por la DIAN». Con la modalidad con poder aparece un gasto nuevo y sistemático: **la autenticación del poder ante notaría**. Convendría nombrarla, porque es plata del Usuario y hoy solo se la advertimos en el portal.

- **Requerimientos posteriores de la DIAN.** Los T&C ya dicen que atenderlos es responsabilidad exclusiva del Usuario, y así se lo decimos en el portal. Solo queremos confirmar que eso **sigue siendo cierto también en la modalidad con poder**, donde el poder podría entenderse como facultad para atenderlos. Si el poder los cubre, hay que decidir si CertiVeh los asume o si el poder los excluye expresamente.

---

# 3. Resumen

| # | Documento | Punto | Situación |
|---|---|---|---|
| **A.1** | Política v2.0 | Grabación de sesión (PostHog) | **Tratamiento activo desde el 8-sep-2026, no declarado.** Encargado y transferencia internacional nuevos |
| **A.2** | Política v2.0 | Encargados | Declara 3; reciben datos **12** |
| **A.3** | Política v2.0 | Programa Win Win | En producción desde may-2026; **no se declara**, ni los datos bancarios del Referidor |
| **B.1** | T&C — Anexo IVA | Modalidad "con poder" | **Se vende y se cobra sin respaldo contractual.** El mandato excluye la representación ante la DIAN |
| **B.2** | T&C — Anexo IVA | "Radicación presencial" | La cita no es presencial |
| **B.3** | T&C — Anexo IVA | "El Operador radica" | Radica el Usuario, desde el correo de su RUT |
| **B.4** | T&C — Anexo IVA | Plazos | 15 días vs. 50 días hábiles de nuestro material — a su criterio |
| **B.5** | T&C — Anexo IVA | Tarifa y requerimientos | Falta la autenticación notarial; confirmar quién atiende requerimientos con poder |

**Prioridad sugerida:** A.1 y A.3 primero (tratamientos activos sin declarar), luego B.1 (servicio cobrado sin respaldo), luego A.2, B.2 y B.3.

---

# 4. Una nota sobre los documentos maestros en Word

Cuando nos devuelvan la versión actualizada, tengan en cuenta que **los `.docx` maestros que conservamos traen erratas que la web ya corrige**. Si se republica desde el Word sin revisarlas, se reintroducen:

- Los cuatro documentos traen `certiveh.contacto@gmail.com`, que **ya no se usa**. La web publica `contacto@certiveh.co`. En la Política esto importa especialmente: ese correo es **el canal para ejercer habeas data**.
- El Anexo A del Win Win usa **campos de fecha automáticos de Word**, que se recalculan según la configuración regional de quien abra el archivo. En un documento con fecha de entrada en vigencia, eso es riesgoso. Debería ser texto plano.
- La Política v2.0 llegó **sin fecha** (`[COMPLETAR]` en la cabecera y en el artículo 18). Se fijó el 27 de agosto de 2026, que es cuando quedó a disposición de los titulares.

Además, en los T&C de usuario hay **dos frases que la web tiene y el Word maestro no**, conservadas a propósito: la de los ~15 días hábiles reales de la UPME y la devolución del 5% por desistimiento posterior a 5 días calendario. Quitarlas sería una decisión legal que no se ha tomado.

**Les proponemos** que la versión que nos devuelvan incorpore estas correcciones, para que el Word y lo publicado dejen de divergir.

---

Quedamos atentos a los documentos actualizados y a sus respuestas sobre las preguntas planteadas.

**CertiVeh — Operación**
`contacto@certiveh.co`
