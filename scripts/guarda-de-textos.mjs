/**
 * **Lo que la landing le dice a un cliente sobre la DIAN, vigilado en cada build.**
 *
 * Dos reglas del negocio que ya se habían colado en el copy y se corrigieron a mano:
 *
 * 1. **Los plazos** (D15-99 del portal, 18-oct-2026, con fuentes oficiales; 96, 14-nov-2026). Desde que radica la
 *    solicitud, la DIAN tiene hasta 15 días hábiles para PEDIR UNA CORRECCIÓN (inadmitirla) y hasta 50 días hábiles,
 *    contados también desde la radicación, para DEVOLVER el dinero: los 50 incluyen el pago. Lo que no puede volver:
 *      - la frase de antes, que era falsa: «15 días hábiles para responder y, si la aprueba, 50 para pagar»
 *        (los 15 no son para responder, y los 50 no empiezan al aprobar);
 *      - asociar los 50 días a la respuesta («50 días hábiles para responder / resolver / contestar»);
 *      - respaldar esos plazos con un artículo que no los dice así (855 y 860 del Estatuto
 *        Tributario). Una cita literal de la DIAN, entre comillas, sí puede nombrarlos;
 *      - un total «a ojo» («tres meses y medio»).
 * 2. **Quién hace qué.** La respuesta de la DIAN le llega al contribuyente, al correo de su RUT, y
 *    es él quien nos la cuenta: no «te avisamos cuando la DIAN responda». Y ante la DIAN no
 *    radicamos nosotros (ante la UPME sí: esa frase pasa).
 * 3. **Las seccionales con cita son SEIS** (20-nov-2026): Bogotá, Medellín, Cali, Bucaramanga, Manizales y Grandes
 *    Contribuyentes. Manizales la exige según el Abecé de la DIAN modificado el 9-nov-2026 (en nuestro sistema
 *    desde el 18-nov-2026). No puede volver la lista de cinco ni el «5 de 34».
 * 4. **Sin guiones largos** (23-nov-2026, regla de Julian): ni «–» ni «—» en el texto, los atributos o el JSON-LD.
 *    El guion corto «-» sí vale. Ver `guionesLargos`.
 *
 * ## Qué lee
 *
 * El HTML YA CONSTRUIDO (`dist/`), que es lo que ve quien entra: el texto visible y los bloques
 * JSON-LD que lee Google. Y dos fuentes que no pasan por el build: `public/llms.txt` y
 * `COPIES_LANDING_CERTIVEH.md`. Leer el HTML y no el `.tsx` evita el punto ciego de siempre: el texto
 * escrito suelto entre etiquetas no está entre comillas.
 *
 * ## Control del instrumento
 *
 * Antes de mirar nada comprueba que cada regla caza su ejemplo malo y deja pasar el bueno, y que
 * encontró páginas de sobra. Si el control falla, el build falla: una guarda que no mide no deja
 * publicar creyendo que midió.
 *
 * Uso: `node scripts/guarda-de-textos.mjs` (lo corre `npm run build`, después de `astro build`).
 */
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

const sinTildes = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const ENTIDADES = {
  '&iacute;': 'í', '&aacute;': 'á', '&eacute;': 'é', '&oacute;': 'ó', '&uacute;': 'ú', '&ntilde;': 'ñ',
  '&nbsp;': ' ', '&laquo;': '«', '&raquo;': '»', '&iquest;': '¿', '&iexcl;': '¡', '&amp;': '&', '&quot;': '"', '&#34;': '"', '&#39;': "'",
};
const plano = (t) => t.replace(/<[^>]+>/g, '').replace(/&[a-zA-Z#0-9]+;/g, (e) => ENTIDADES[e] ?? e).replace(/\s+/g, ' ');
const frases = (t) => plano(t).split(/(?<=[.;!?])\s+/).filter((x) => x.trim() !== '');

/** Lo que dice un HTML: su texto visible y sus bloques JSON-LD, sin comentarios, estilos ni scripts. */
export function loQueDiceUnHtml(html) {
  const jsonLd = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => m[1].replace(/\\"/g, '"').replace(/"\s*,\s*"/g, '. ').replace(/[{}\[\]]/g, '. '))
    .join('. ');
  const visible = html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/(p|div|li|h[1-6]|td|th|section|article|summary|details|dd|dt)>/gi, '. ')
    .replace(/<br\s*\/?>/gi, '. ');
  return `${plano(visible)} . ${plano(jsonLd)}`;
}

// ── Los plazos ─────────────────────────────────────────────────────────────────────────────────

const CINCUENTA = /\b(?:50|cincuenta(?:\s*\(\s*50\s*\))?)\s+(?:d[ií]as|para\b)/i;
const QUINCE = /\b(?:15|quince(?:\s*\(\s*15\s*\))?)\s+d[ií]as/i;
const RESPONDER = /respond|resolv|contest|decid|pronunci|(?:dar(?:te|le|nos)?|en dar(?:te|le|nos)?) (?:una )?respuesta|una respuesta|estudiar|aprob|rechaz|revis|evalu|(?:dar(?:te|le|nos)?|en dar(?:te|le|nos)?) tr[aá]mite/i;
const DESDE_EL_ENVIO = /radica|desde que (?:se )?(?:re)?env[ií]|desde el env[ií]o|a partir del env[ií]o|desde que (?:la )?present/i;

export function plazoMalDicho(frase) {
  const f = plano(frase);
  const m = CINCUENTA.exec(f);
  if (!m) return false;
  const tras = f.slice(m.index, m.index + 80);
  const donde = tras.search(RESPONDER);
  if (donde !== -1 && !/pag/i.test(tras.slice(0, donde))) return true;
  // (Hasta el 96 también era «malo» contar los 50 desde la radicación sin nombrar los 15. Con D15-99 es lo cierto.)
  return false;
}

/**
 * 96 · La frase de antes (la 194 del portal, que D15-99 retiró por falsa): los 15 días «para responder» y los 50 «para
 * pagar» cuando la aprueba. Basta con una de las dos mitades.
 */
export function plazoDeAntes(frase) {
  const f = sinTildes(plano(frase));
  if (/\b(?:15|quince)\b[^.;]{0,40}\bdias(?: habiles)?\b[^.;]{0,40}\bpara (?:responder|contestar|resolver)\b/.test(f)) return true;
  return /\bsi (?:la |lo )?aprueba\b[^.;]{0,50}\b(?:50|cincuenta)\b[^.;]{0,30}\bpara pagar\b/.test(f);
}

/** Lo que va entre comillas es la cita literal de otro (la DIAN): no es una afirmación nuestra. */
const sinLoCitado = (f) => f.replace(/"[^"]*"|«[^»]*»|“[^”]*”/g, ' ');

export function citaUnArticuloParaElPlazo(frase) {
  const f = sinLoCitado(plano(frase));
  if (!CINCUENTA.test(f) && !QUINCE.test(f)) return false;
  // La devolución AUTOMÁTICA es otra figura, con su propio término en el parágrafo 5 del artículo 855:
  // la nombran los Términos y Condiciones, y ahí la cita es la de esa figura, no la del plazo general.
  if (/devoluci[oó]n autom[aá]tica/i.test(f)) return false;
  return /\bart(?:[ií]culos?|s?\.)\s*(?:855|860)\b|\b855 y 860\b/i.test(f);
}

const EL_TOTAL_A_OJO = new RegExp(['tres meses', 'y medio'].join(' '), 'i');
export const prometeUnTotal = (frase) => EL_TOTAL_A_OJO.test(plano(frase));

// ── Quién hace qué ─────────────────────────────────────────────────────────────────────────────

const PATRONES_QUE_INVIERTEN = [
  /\bte (?:avisamos|avisaremos|contamos|contaremos|escribimos|escribiremos|informamos|informaremos|notificamos|notificaremos|confirmamos) (?:apenas|cuando|en cuanto|tan pronto(?: como)?|una vez(?: que)?) la dian\b(?![^.;]{0,60}\b(?:cita|asign|agend))/,
  /\b(?:avisamos|avisaremos|contamos|contaremos|escribimos|escribiremos|informamos|informaremos) (?:apenas|cuando|en cuanto|tan pronto(?: como)?) (?:sepamos|tengamos|nos llegue|recibamos) (?:algo|noticias|novedades|respuesta|la respuesta)\b/,
  /\bseguimos (?:nosotros )?desde ahi\b/,
  /\b(?:te|lo) (?:mantenemos|mantendremos|tenemos|tendremos) (?:al tanto|informad[oa]) (?:de|sobre) (?:lo que (?:diga|responda|decida|resuelva|conteste) la dian|la respuesta de la dian|lo que pase con la dian)\b/,
  /\b(?:cuando|apenas|en cuanto|tan pronto(?: como)?) la dian (?:responda|conteste|decida|resuelva|apruebe|rechace|se pronuncie|diga algo)\b[^.;]{0,40}\b(?:te|se) (?:lo )?(?:contamos|contaremos|avisamos|avisaremos|decimos|diremos|informamos|informaremos|escribimos|escribiremos|hacemos saber)\b/,
];

export function invierteQuienHaceQue(frase) {
  const f = sinTildes(plano(frase));
  if (PATRONES_QUE_INVIERTEN.some((p) => p.test(f))) return true;
  if (!/\b(?:(?:nosotros )?nos (?:encargamos|ocupamos|encargaremos) de (?:radicar|presentar)|nosotros (?:la |lo )?presentamos|presentamos (?:tu|la|su) (?:solicitud|devolucion)|nosotros (?:la |lo |te (?:la|lo) )?radicamos|radicamos (?:tu|la|su) (?:solicitud|devolucion)|(?:la|lo) radicamos (?:nosotros|por ti|ante|en la dian)|radicamos (?:ante|en) la dian|radicaremos (?:tu|la|su) (?:solicitud|devolucion))/.test(f)) return false;
  if (/\bno (?:la |lo |te (?:la|lo) )?(?:radicamos|presentamos)\b|\bnunca radicamos\b|\bni radicamos\b/.test(f)) return false;
  if (/\bupme\b|certificad/.test(f)) return false;
  // (En la landing «radicamos tu solicitud» sin nombrar la entidad SÍ aparece, y es la UPME: la ficha
  // del servicio «Certificado UPME». Aquí, sin fichero que dé contexto, sólo cuenta con la DIAN o el IVA.)
  return /\bdian\b|\biva\b|devolucion/.test(f);
}

/**
 * 🔴 29-oct-2026 (la DIAN, de primera mano, y su Abecé): el correo de la cita se envía a la hora EXACTA de la cita o
 * dentro de los 30 minutos siguientes (mejor en los primeros 10), «no antes y tampoco después». Antes decíamos «el día de la cita, antes de la hora»
 * y «unos 5 minutos antes», que es justo lo que la DIAN da por no recibido.
 */
export function laVentanaMalDicha(frase) {
  const f = sinTildes(plano(frase));
  if (!/\b(?:cita|correo)\b/.test(f)) return false;
  return /\bantes de (?:la|tu|su) hora\b|\bminutos antes\b|\bantes de la hora (?:asignada|de (?:la|tu|su) cita)\b/.test(f);
}

/**
 * 19-nov-2026 · Lo que tarda la UPME. La Resolución 563 de 2026 le da HASTA 30 días hábiles para
 * resolver de fondo (numeral 6.3.1), unificado para FNCE, GEE e hidrógeno; el término se suspende
 * si envía un requerimiento (6.3.2) y al reanudarse quedan hasta 10 hábiles más (6.3.3).
 *
 * El sitio decía además que «en la práctica se demora aproximadamente 15 días hábiles». Ese número
 * no sale de la norma ni de una medición nuestra: Julian lo desmintió el 19-nov. Mientras no haya
 * un dato medido que lo respalde, no se publica un promedio de la UPME.
 *
 * También caza lo que describía el procedimiento ANTERIOR, que la 563 derogó: la etapa de
 * completitud de 10 días hábiles y los 20 días para FNCE.
 */
export function elPromedioDeLaUpmeSinFuente(frase) {
  const f = sinTildes(plano(frase));
  if (!/\bupme\b/.test(f)) return false;
  if (/\b(?:en la practica|normalmente|aproximadamente|de media|en promedio|suele(?:n)? (?:demorar|tardar)|se demora)\b[^.;]{0,60}\bdias(?: habiles)?\b/.test(f)) return true;
  if (/completitud\b[^.;]{0,30}\b(?:10|diez)\b[^.;]{0,20}\bdias/.test(f)) return true;
  if (/\b(?:20|veinte)\b[^.;]{0,25}\bdias habiles\b[^.;]{0,30}\bfnce\b/.test(f)) return true;
  return false;
}

// ── Las seccionales con cita ───────────────────────────────────────────────────────────────────

/**
 * 20-nov-2026 · Manizales también exige cita (Abecé de la DIAN, modificado el 9-nov-2026:
 * «Si usted se encuentra en Bogotá, Bucaramanga, Cali, Manizales o Medellín, debe programar una cita»), más
 * Grandes Contribuyentes: seis de 34. Caza el número de antes y la lista de antes: una frase que enumera
 * Bucaramanga junto a Grandes Contribuyentes, o junto a la cita, y no nombra Manizales.
 *
 * Deja pasar el Comunicado 127 de la DIAN («200 citas diarias en Bogotá, Medellín, Cali y Bucaramanga»): es lo que
 * dijo la DIAN el 1-oct-2026 sobre su capacidad, no la lista de las seccionales con cita.
 */
export function lasSeccionalesConCitaDeAntes(frase) {
  const f = sinTildes(plano(frase));
  if (/seccional|\bcita\b/.test(f) && /\b(?:4|cuatro|5|cinco) (?:de (?:las )?(?:34|treinta y cuatro) )?(?:direcciones )?(?:seccionales|ciudades)\b|\b(?:5|cinco) de (?:las )?(?:34|treinta y cuatro)\b|\bson (?:4|cuatro|5|cinco) las (?:seccionales|ciudades)\b/.test(f)) return true;
  if (!/\bbucaramanga\b/.test(f) || /\bmanizales\b/.test(f)) return false;
  return /\bgrandes contribuyentes\b|\bcita\b/.test(f);
}

/**
 * Los guiones largos (en dash «–» y em dash «—») están prohibidos en lo que se publica: regla de Julian del 23-nov-2026,
 * después de ver uno en un resultado de Google. El único guion que vale es el corto, «-». Se miran el texto visible, los
 * ATRIBUTOS (el título, las metas de descripción y de redes, los `alt`) y el JSON-LD, que es lo que lee Google; no los
 * comentarios, los estilos ni los scripts. Por eso no va en REGLAS: `loQueDiceUnHtml` descarta los atributos.
 */
const GUION_LARGO = /[–—]|&(?:ndash|mdash);|&#(?:8211|8212|x2013|x2014);|\\u201[34]/gi;
export function guionesLargos(html) {
  const publicado = html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script\b(?![^>]*application\/ld\+json)[\s\S]*?<\/script>/gi, ' ');
  return [...publicado.matchAll(GUION_LARGO)]
    .map((m) => publicado.slice(Math.max(0, m.index - 60), m.index + 40).replace(/\s+/g, ' ').trim());
}

const REGLAS = [
  [plazoMalDicho, 'los 50 días son para DEVOLVER el dinero desde la radicación, no para responder'],
  [plazoDeAntes, 'la frase de antes (D15-99): los 15 días son para pedir una corrección y los 50, desde la radicación, para devolver'],
  [citaUnArticuloParaElPlazo, 'se cita un artículo (855/860) para un plazo que no dice'],
  [prometeUnTotal, '«tres meses y medio» no tiene fuente'],
  [invierteQuienHaceQue, 'invierte quién hace qué ante la DIAN'],
  [laVentanaMalDicha, 'el correo de la cita va a la hora exacta o en los 30 minutos siguientes (mejor en los primeros 10), no antes'],
  [elPromedioDeLaUpmeSinFuente, 'un promedio de lo que tarda la UPME sin dato medido detrás, o el procedimiento que la Resolución 563 derogó'],
  [lasSeccionalesConCitaDeAntes, 'las seccionales con cita son seis (con Manizales, Abecé de la DIAN del 9-nov-2026): falta Manizales o dice cinco'],
];

// ── El control: cada regla caza lo suyo y deja pasar lo cierto ─────────────────────────────────

function control() {
  const fallos = [];
  const debe = (ok, que) => { if (!ok) fallos.push(que); };
  for (const mal of [
    'La DIAN tiene hasta 50 días hábiles para responder.',
    'La DIAN tiene hasta 50 días hábiles para contestar.',
    'La DIAN cuenta con cincuenta (50) días hábiles para resolver.',
    'La DIAN se demora hasta 50 días hábiles en darte una respuesta.',
    'La DIAN tiene 50 días hábiles para aprobar o rechazar.',
    'La DIAN tiene 50 días hábiles para revisar tu solicitud.',
    'La DIAN tarda hasta 50 días hábiles en darle trámite.',
    'La DIAN se toma hasta 50 días hábiles para evaluar.',
  ]) debe(plazoMalDicho(mal), `plazoMalDicho no caza: ${mal}`);
  for (const bien of [
    'la DIAN revisa los documentos de tu propia solicitud y, desde que la radica, tiene hasta 15 días hábiles para pedirte una corrección si falta algo y hasta 50 para devolverte el dinero.',
    'Si todo está en orden, tiene hasta 50 días hábiles desde la radicación para devolverte el dinero a tu cuenta bancaria.',
    'la DIAN tiene hasta 50 dias habiles para pagar, contados desde que la solicitud queda radicada',
    'Desde la radicación hasta el certificado UPME: la UPME tiene hasta 30 días hábiles para resolver de fondo.',
    'Son 50 días hábiles para pagar.',
  ]) debe(!plazoMalDicho(bien), `plazoMalDicho marca una frase cierta: ${bien}`);
  for (const mal of [
    'Desde la radicación hasta el certificado UPME: normalmente unos 15 días hábiles, y el máximo legal son 30.',
    'Por ley la UPME tiene hasta 30 días hábiles, aunque en la práctica se demora aproximadamente 15 días hábiles.',
    'El certificado UPME sale en promedio en 12 días hábiles.',
    'La UPME verifica completitud en 10 días hábiles y evalúa en hasta 20 días hábiles para proyectos FNCE.',
  ]) debe(elPromedioDeLaUpmeSinFuente(mal), `elPromedioDeLaUpmeSinFuente no caza: ${mal}`);
  for (const bien of [
    'La UPME tiene hasta 30 días hábiles para resolver de fondo la solicitud (Resolución 563 de 2026, numeral 6.3.1).',
    'Si la UPME envía un requerimiento, el término se suspende hasta que se responde, y al reanudarse quedan hasta 10 días hábiles adicionales.',
    'La DIAN tiene hasta 50 días hábiles desde la radicación para devolverte el dinero.',
    'En la práctica, la cita de la DIAN en Medellín se demora de 2 a 3 meses.',
  ]) debe(!elPromedioDeLaUpmeSinFuente(bien), `elPromedioDeLaUpmeSinFuente marca una frase cierta: ${bien}`);
  debe(citaUnArticuloParaElPlazo('responde en 15 días hábiles y, si aprueba, paga en 50 días (artículos 855 y 860 del Estatuto Tributario).'), 'no caza el artículo citado para el plazo');
  debe(citaUnArticuloParaElPlazo('si la aprueba, 50 días hábiles para pagar (artículo 855 del Estatuto Tributario).'), 'no caza el 855 junto a los 50 días');
  debe(!citaUnArticuloParaElPlazo('"el término para devolver será el consagrado en los artículos 855 y 860 del Estatuto Tributario." Son 50 días hábiles para pagar.'), 'marca la cita literal de la DIAN');
  debe(!citaUnArticuloParaElPlazo('Estatuto Tributario, Arts. 855 y 857. Procedimiento de devolución, plazos y causales de rechazo.'), 'marca una lista de fuentes sin plazo');
  debe(!citaUnArticuloParaElPlazo('para los casos que cumplen el mecanismo de devolución automática, conforme al parágrafo 5 del artículo 855 del Estatuto Tributario, la devolución tendrá lugar dentro de los quince (15) días siguientes.'), 'marca la devolución automática de los Términos');
  for (const mal of [
    'tiene hasta 15 días hábiles para responder y, si la aprueba, hasta 50 días hábiles para pagar.',
    'El tiempo de respuesta de la DIAN varía, pero tiene 15 días hábiles para responder la solicitud una vez radicada con todos los requisitos.',
    'Si la aprueba, hasta 50 días hábiles para pagar la devolución.',
    'La DIAN tiene quince días para contestar.',
    'Desde que radica tu solicitud, tiene hasta 15 días hábiles para pedirte una corrección si falta algo y, si aprueba, hasta 50 para pagar.',
  ]) debe(plazoDeAntes(mal), `plazoDeAntes no caza: ${mal}`);
  for (const bien of [
    'Desde que radica la solicitud, la DIAN tiene hasta 15 días hábiles para pedirte una corrección si falta algo y hasta 50 días hábiles para devolverte el dinero a tu cuenta bancaria.',
    'Desde la radicación hasta el certificado UPME: la UPME tiene hasta 30 días hábiles para resolver de fondo.',
    'El solicitante tiene hasta un mes desde que la UPME envía el requerimiento para responderlo.',
  ]) debe(!plazoDeAntes(bien), `plazoDeAntes marca una frase cierta: ${bien}`);
  // 96: la regla va de verdad en las REGLAS que barren las páginas (mutante: quitarla de la lista dejaba la guarda en verde).
  debe(frases(loQueDiceUnHtml('<p>La DIAN tiene hasta 15 días hábiles para responder y, si la aprueba, hasta 50 para pagar.</p>')).some((fr) => REGLAS.some(([r, porque]) => r === plazoDeAntes && r(fr) && porque)), 'las REGLAS no llevan la frase de antes (plazoDeAntes)');
  debe(prometeUnTotal('En total suele tomar unos tres meses y medio.'), 'no caza el total a ojo');
  for (const mal of ['Te avisamos cuando la DIAN responda.', 'Te contamos apenas la DIAN nos diga algo.', 'Nosotros radicamos tu solicitud ante la DIAN.', 'Te avisamos en cuanto sepamos algo.', 'Te mantenemos al tanto de lo que diga la DIAN.', 'Cuando la DIAN responda, te lo contamos.', 'Nosotros nos encargamos de radicar tu solicitud ante la DIAN.', 'Te mantendremos informado de la respuesta de la DIAN.', 'Apenas la DIAN conteste, te escribimos.', 'Nosotros presentamos tu solicitud de devolución ante la DIAN.']) {
    debe(invierteQuienHaceQue(mal), `invierteQuienHaceQue no caza: ${mal}`);
  }
  for (const bien of ['Te avisamos en cuanto la DIAN nos asigne tu cita.', 'Te escribimos cuando la DIAN nos confirme el día de tu cita.', 'Gestionamos todo el trámite por ti: creamos tu cuenta, llenamos formularios y radicamos tu solicitud.', 'Nosotros radicamos tu solicitud ante la UPME.', 'Nosotros presentamos tu solicitud ante la UPME.', 'Tú reenvías el correo que te dejamos listo desde el correo de tu RUT.', 'Te avisamos cuando tu certificado esté emitido.']) {
    debe(!invierteQuienHaceQue(bien), `invierteQuienHaceQue marca una frase cierta: ${bien}`);
  }
  for (const mal of ['Si hay cita, envías ese correo el día de tu cita, antes de la hora.', 'se atiende con un correo el día asignado, antes de la hora.', 'Reenvía el correo unos 5 minutos antes de la hora de tu cita.', 'se atiende mandando el correo ese día, antes de la hora asignada.']) {
    debe(laVentanaMalDicha(mal), `laVentanaMalDicha no caza: ${mal}`);
  }
  for (const bien of ['Envíalo a la hora exacta de tu cita o dentro de los 30 minutos siguientes (mejor en los primeros 10), ni antes ni después.', 'Desde la radicación hasta el certificado UPME: la UPME tiene hasta 30 días hábiles.', 'Tú reenvías el correo que te dejamos listo desde el correo de tu RUT.']) {
    debe(!laVentanaMalDicha(bien), `laVentanaMalDicha marca una frase cierta: ${bien}`);
  }
  for (const mal of [
    'En Bogotá, Medellín, Cali, Bucaramanga y Grandes Contribuyentes la DIAN exige cita para la devolución del IVA de carros eléctricos e híbridos.',
    'Si la seccional de la DIAN que te corresponde es la de Bogotá, Medellín, Cali o Bucaramanga, o si tu empresa pertenece a la Dirección de Grandes Contribuyentes, necesitas una cita.',
    'Si tu RUT tiene seccional en Bogotá, Medellín, Cali, Bucaramanga o Grandes Contribuyentes, la radicación exige cita previa, que pedimos nosotros a tu nombre.',
    'No. Fuera de Bogotá, Medellín, Cali, Bucaramanga y Grandes Contribuyentes, la solicitud se envía sin cita al correo de devoluciones.',
    'La cita va CONDICIONADA («si tu seccional la exige»): solo la exigen 5 de 34.',
    'La cita ante la DIAN la pedimos nosotros, pero solo la exigen cinco seccionales.',
    'Solo 5 de las 34 seccionales la exigen.',
    'La seccional de Bucaramanga pide cita.',
    'Si tu seccional es Bogotá, Medellín, Cali o Bucaramanga, debes programar una cita.',
    'Solo cuatro ciudades exigen cita.',
    'Hoy son 5 las seccionales con cita.',
  ]) debe(lasSeccionalesConCitaDeAntes(mal), `lasSeccionalesConCitaDeAntes no caza: ${mal}`);
  for (const bien of [
    'En Bogotá, Medellín, Cali, Bucaramanga, Manizales y Grandes Contribuyentes la DIAN exige cita para la devolución del IVA de carros eléctricos e híbridos.',
    'La cita va CONDICIONADA («si tu seccional la exige»): solo la exigen 6 de 34.',
    'La DIAN asignaba entonces cerca de 200 citas diarias en Bogotá, Medellín, Cali y Bucaramanga.',
    'Entre agosto y septiembre asignó más de 6.600, y anunció más capacidad en Medellín y Bucaramanga.',
    'Pedimos nosotros tu cita, si tu seccional la exige.',
    'Una cuota de 5 de 34 meses.',
  ]) debe(!lasSeccionalesConCitaDeAntes(bien), `lasSeccionalesConCitaDeAntes marca una frase cierta: ${bien}`);
  // Y va de verdad en las REGLAS que barren (mutante: quitarla de la lista).
  debe(frases(loQueDiceUnHtml('<td><strong>Bogotá, Medellín, Cali, Bucaramanga o Grandes Contribuyentes</strong></td>')).some((fr) => REGLAS.some(([r]) => r === lasSeccionalesConCitaDeAntes && r(fr))), 'las REGLAS no llevan las seccionales con cita (lasSeccionalesConCitaDeAntes)');
  // El lector: ve el texto visible y el JSON-LD, y no los comentarios ni los scripts.
  const html = '<!-- 50 días hábiles para responder --><script>var x = "50 días hábiles para responder";</script>'
    + '<script type="application/ld+json">{"text":"La DIAN tiene hasta 50 días hábiles para responder."}</script>'
    + '<p>Una vez radicada, la DIAN tiene hasta <strong>50 días</strong>\n hábiles para resolver.</p>';
  debe(frases(loQueDiceUnHtml(html)).filter(plazoMalDicho).length === 2, 'el lector de HTML no ve exactamente el párrafo y el JSON-LD');
  debe(guionesLargos('<title>A – B</title><meta content="x — y"><p>c &ndash; d</p><p>e &#8212; f</p>'
    + '<script type="application/ld+json">{"a":"g – h"}</script>').length === 5,
    'la guarda de guiones largos no ve el título, la meta, las entidades y el JSON-LD');
  debe(guionesLargos('<!-- a – b --><script>var s = "—";</script><style>/* – */</style><p>NIT 902051875-8, del 1 al 7</p>').length === 0,
    'la guarda de guiones largos caza comentarios, scripts, estilos o el guion corto');
  debe(guionesLargos('<script type="application/ld+json">{"a":"g \\u2013 h"}</script>').length === 1,
    'la guarda de guiones largos no ve el guion escapado dentro del JSON-LD');
  const falso = mkdtempSync(join(tmpdir(), 'guarda-de-textos-'));
  try {
    mkdirSync(join(falso, 'dist', 'x'), { recursive: true });
    mkdirSync(join(falso, 'public'), { recursive: true });
    writeFileSync(join(falso, 'dist', 'x', 'index.html'), '<title>A \u2013 B</title><p>Hola.</p>');
    writeFileSync(join(falso, 'public', 'llms.txt'), 'Hola.');
    debe(hallazgos(falso).hallazgos.some((h) => h.includes('guion largo')),
      'el barrido no llama a la guarda de guiones largos: la función mide, pero nadie la usa');
  } finally {
    rmSync(falso, { recursive: true, force: true });
  }
  return fallos;
}

// ── El barrido ─────────────────────────────────────────────────────────────────────────────────

function ficherosBajo(dir, ext, salida = []) {
  let nombres;
  try { nombres = readdirSync(dir); } catch { return salida; }
  for (const n of nombres) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) ficherosBajo(p, ext, salida);
    else if (ext.test(n)) salida.push(p);
  }
  return salida;
}

export function hallazgos(raiz = RAIZ) {
  const out = [];
  const juzgar = (texto, fichero) => {
    for (const fr of frases(texto)) {
      for (const [regla, porque] of REGLAS) if (regla(fr)) out.push(`${fichero} · ${porque}: ${fr.trim().slice(0, 200)}`);
    }
  };
  const paginas = ficherosBajo(join(raiz, 'dist'), /\.html$/);
  const GUION = 'guion largo (– o —): está prohibido, usa el guion corto «-», una coma o dos puntos';
  for (const f of paginas) {
    const html = readFileSync(f, 'utf8');
    juzgar(loQueDiceUnHtml(html), relative(raiz, f));
    for (const g of guionesLargos(html)) out.push(`${relative(raiz, f)} · ${GUION}: ${g}`);
  }
  for (const f of ['public/llms.txt', 'COPIES_LANDING_CERTIVEH.md']) {
    try { juzgar(readFileSync(join(raiz, f), 'utf8').replace(/\n/g, '. '), f); } catch { /* si no existe, no hay nada que juzgar */ }
  }
  for (const g of guionesLargos(readFileSync(join(raiz, 'public/llms.txt'), 'utf8'))) out.push(`public/llms.txt · ${GUION}: ${g}`);
  return { paginas: paginas.length, hallazgos: [...new Set(out)] };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const fallosDelControl = control();
  if (fallosDelControl.length) {
    console.error('[guarda-de-textos] EL CONTROL FALLA: la guarda no mide, así que no se publica.');
    for (const f of fallosDelControl) console.error(`  · ${f}`);
    process.exit(1);
  }
  const r = hallazgos();
  if (r.paginas < 10) {
    console.error(`[guarda-de-textos] sólo encontró ${r.paginas} páginas en dist/: ¿corrió antes \`astro build\`?`);
    process.exit(1);
  }
  if (r.hallazgos.length) {
    console.error(`[guarda-de-textos] ${r.hallazgos.length} frase(s) dicen mal los plazos de la DIAN, quién hace qué o las seccionales con cita, o llevan un guion largo:`);
    for (const h of r.hallazgos) console.error(`  · ${h}`);
    process.exit(1);
  }
  console.log(`[guarda-de-textos] ${r.paginas} páginas, llms.txt y los copies: los plazos, quién hace qué y las seccionales con cita, bien dichos, y sin guiones largos.`);
}
