# CertiVeh · Sitio público (certiveh.co)

Astro 5 con islas de React y Tailwind v4. Es el sitio de marketing: landing, páginas de empresas y
vehículos, el blog de SEO, la documentación de la API de aliados, y los textos legales publicados
(términos, política de privacidad).

> ⚠️ **Este repositorio es PÚBLICO.** Todo lo que se commitee aquí lo puede leer cualquiera. No
> entran credenciales, ni datos de clientes, ni notas internas de operación. Antes de añadir un
> documento, pregúntate si te da igual que lo lea la competencia.

## Comandos

```sh
corepack enable pnpm    # pnpm puede NO estar instalado; comprobado el 9-sep-2026, no lo estaba
pnpm install
pnpm dev                # astro dev
pnpm build              # astro build + el limpiador de NUL, ver abajo
pnpm preview
node scripts/generate-og-images.mjs   # regenera public/og/ con satori
```

⚠️ **Este repo es de pnpm y no se instala con npm.** Solo hay `pnpm-lock.yaml`, y el `package.json`
lleva un bloque `pnpm.overrides` que fija `react` y `react-dom` a `18.3.1`, más
`pnpm.onlyBuiltDependencies`. **npm ignora las dos claves por completo**: `npm install` resolvería
otras versiones de React sin decir nada y dejaría un `package-lock.json` compitiendo con el
lockfile bueno. Si `pnpm` no está, actívalo con `corepack`; no lo sustituyas.

No hay `tsconfig.json` raíz en este repo. La comprobación real es `pnpm build` limpio (con sus dos guardas) y
mirar la página, más `pnpm test` (`node --test`, sin dependencias), que fija las cifras de las calculadoras.

## Los precios salen de la tarifa, nunca se escriben

`src/lib/tipos-de-activo.ts` es la QUINTA copia, byte a byte, de la tarifa versionada del portal y del panel. No
se edita aquí: se copia desde el portal, y la vigencia la fija `scripts/fijar-la-vigencia-de-la-tarifa.sh` del
portal (que también rehace la huella de la guarda). `src/lib/precios-de-la-landing.ts` compone esa tarifa con la
tasa de la UPME para las calculadoras, las tarjetas, las fichas y los JSON-LD.

- **En el build** (frontmatter de Astro) se usa `tarifaVigente(new Date())`: las fichas, el blog y los JSON-LD
  cambian de tarifa con un rebuild. Tras el cambio de tarifa hay que reconstruir (el guion lo pide a T+1 min).
- **En el navegador** las islas pintan con la del build y, tras hidratar, pasan a la vigente con el reloj del
  cliente (`la-tarifa-de-la-isla.ts`).
- **`scripts/guarda-de-la-tarifa.mjs`**, en `pnpm build`: comprueba la huella de la copia y barre `dist/` contra
  la tarifa vigente en el instante del build. Un precio de lista de otra fila hace fallar el build.

## No quites el paso de limpieza del build

`pnpm build` es `astro build && node scripts/quitar-nul-del-html.mjs`. **Ese segundo comando no es
opcional.**

`astro build` produce, de forma determinista, HTML con algún byte `\0` suelto, y se sirvió en
producción dos veces el mismo día. No es la fuente (los `.tsx`/`.astro` no tienen ni uno), no es una
frase concreta, y no es el compresor de Astro: **se mueve con el tamaño del contenido**, así que
esquivar la frase de turno solo lo reubica. Cae siempre justo antes de un carácter multibyte.

Y **`grep` no sirve para comprobar esto**: un solo NUL vuelve el fichero binario y `grep` deja de
imprimir coincidencias sin decir por qué. Así es como tres auditorías seguidas dieron «limpio» sobre
una página rota. Se cuentan con Node. El razonamiento entero está en el docblock del script.

## Certi, la mascota, NO aparece aquí

Regla dura, y está escrita en `CERTI_MASCOT_USAGE_RULES.md`: **Certi nunca aparece en certiveh.co
ni en el portal.** Vive exclusivamente en marketing (Instagram, correos, flyers). El producto se
mantiene limpio y profesional. Hoy el repo la respeta: cero apariciones en `src/`.

## Marca y diseño

**Manda `DESIGN_SYSTEM.md` §0 (sistema visual 2026-11) con las variables y clases de `src/styles/marca.css`**
(Albert Sans, verde plano `#047857`, un radio de 6 px, sin degradados ni turquesa; `Navbar` y `SiteFooter`
únicos para todo el sitio). Donde los demás documentos digan otra cosa, gana §0.

Antes de tocar un color, una tipografía o un espaciado, **abre y lee** el que corresponda. Están en
la raíz y son la fuente de verdad. No se importan aquí a propósito: entre los cuatro suman más de
2.400 líneas y cargarlos en cada sesión desplazaría al resto de las instrucciones.

- `BRAND_MANUAL.md` — identidad, logo, voz (~550 líneas).
- `DESIGN_SYSTEM.md` — §0 primero; tokens, componentes, escalas (~1.390 líneas).
- `OG_IMAGE_SPECS.md` — especificación de las imágenes sociales.
- `COPIES_LANDING_CERTIVEH.md` — los textos aprobados de la landing.

⚠️ **Hay dos verdes y no son intercambiables.** Desde la marca 2026-11 el verde de la marca es
`#047857` (`--cv-accent`), para la acción y para la letra. El antiguo primario `#059669` da 3.87:1
sobre blanco, que **no cumple AA para texto**: solo puede quedar como relleno decorativo. Es el
defecto que no se ve en pantalla y sí al imprimir.

## Los datos tributarios son la parte cara de equivocarse

Esto es un sitio público que promete beneficios fiscales a compradores de vehículo. Una cifra mal
puesta aquí es un problema comercial y legal, no una errata. **No inventes ni redondees ninguna de
estas, y no las deduzcas del código de otro repo:**

- **Devolución de IVA:** siempre «Devolución de IVA (5% del valor del vehículo)».
- **Arancel:** 0% en importación directa.
- **Renta:** 50% de deducción.
- **«Valor del vehículo» es siempre el precio de lista SIN IVA**, antes de impuestos y descuentos.
- **«Hasta un 55% en beneficios tributarios», nunca «recuperas el 55%».** El 55% es nominal; en caja
  real una empresa recibe alrededor del 22,5%. Prometer caja que no llega cuesta dinero y confianza.
- **No aplica a híbridos ligeros.** Si una página los menciona, es para excluirlos.
- **Siglas técnicas (BEV, HEV, PHEV, MHEV, EV): en el blog, palabra + sigla entre paréntesis**, la primera vez
  en cada bloque: «eléctrico puro (BEV)», «híbrido (HEV)», «híbrido enchufable (PHEV)», «híbrido ligero (MHEV)»,
  «eléctrico (EV)». Nunca la sigla sola. Decisión de Julian del 3-nov-2026, por SEO. **Fuera del blog** (landing,
  fichas, legales, componentes), sigue la regla de siempre: sin siglas, solo palabras.
- **Ventana UPME:** Resolución 400 de 2026, ventana continua del 1 de febrero al 15 de diciembre.
  Ya no hay ciclos; si un texto habla de «ciclos de recepción», está caducado.
- **Ante la UPME sí radicamos nosotros. Ante la DIAN no.** Son entidades distintas y la frase no se
  puede generalizar en ninguna de las dos direcciones.

Si un encargo pide una cifra o una promesa que no está en esta lista, **pregúntala**. No se deduce
del código ni de una pieza publicada: las piezas publicadas también envejecen.

## Los textos legales publicados

`src/pages/terminos-y-condiciones.astro` y `politica-de-privacidad.astro` son documentos vigentes,
no copy. **No se editan por estilo.** Cualquier cambio de fondo pasa por la abogada; lo que está
pendiente con ella vive en `docs/`.

## Despliegue

Vercel, en cada push a `main`. `vercel.json` lleva el `buildCommand` y tres redirecciones: los
subdominios `flyer.` y `enterprise.` reescriben a `certiveh.co` con sus UTM de campaña impresa, y
`/gnv` es una permanente a `/otros-activos`. El sitemap excluye a propósito los legales, `/exotics`
y `/gnv`.

## Cómo se verifica el trabajo aquí

Está en `.claude/rules/metodo-de-verificacion.md`, que se carga solo, y aplica igual aunque este
repo no tenga tests: **no midas una espera por su primer intento, y comprueba el efecto, no el
texto del fuente.**
