/**
 * **Lo que la landing le dice a un cliente sobre la DIAN, vigilado en cada build.**
 *
 * Dos reglas del negocio que ya se habían colado en el copy y se corrigieron a mano:
 *
 * 1. **Los plazos.** La DIAN tiene hasta 15 días hábiles para RESPONDER la solicitud y, si la
 *    aprueba, hasta 50 días hábiles para PAGAR. Lo que no puede volver:
 *      - asociar los 50 días a la respuesta («50 días hábiles para responder / resolver / contestar»);
 *      - contarlos desde la radicación o el envío sin nombrar los 15;
 *      - respaldar esos plazos con un artículo que no los dice así (855 y 860 del Estatuto
 *        Tributario). Una cita literal de la DIAN, entre comillas, sí puede nombrarlos;
 *      - un total «a ojo» («tres meses y medio»).
 * 2. **Quién hace qué.** La respuesta de la DIAN le llega al contribuyente, al correo de su RUT, y
 *    es él quien nos la cuenta: no «te avisamos cuando la DIAN responda». Y ante la DIAN no
 *    radicamos nosotros (ante la UPME sí: esa frase pasa).
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
import { readdirSync, readFileSync, statSync } from 'node:fs';
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
const RESPONDER = /respond|resolv|contest|decid|pronunci|(?:dar(?:te|le|nos)?|en dar(?:te|le|nos)?) (?:una )?respuesta|una respuesta|estudiar|aprob|rechaz|revis/i;
const DESDE_EL_ENVIO = /radica|desde que (?:se )?(?:re)?env[ií]|desde el env[ií]o|a partir del env[ií]o|desde que (?:la )?present/i;

export function plazoMalDicho(frase) {
  const f = plano(frase);
  const m = CINCUENTA.exec(f);
  if (!m) return false;
  const tras = f.slice(m.index, m.index + 80);
  const donde = tras.search(RESPONDER);
  if (donde !== -1 && !/pag/i.test(tras.slice(0, donde))) return true;
  if (DESDE_EL_ENVIO.test(f) && !QUINCE.test(f)) return true;
  return false;
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
  /\b(?:te|lo) (?:mantenemos|mantendremos|tenemos|tendremos) (?:al tanto|informad[oa]) de lo que (?:diga|responda|decida|resuelva|conteste) la dian\b/,
  /\b(?:cuando|apenas|en cuanto|tan pronto(?: como)?) la dian (?:responda|conteste|decida|resuelva|apruebe|rechace|se pronuncie|diga algo)\b[^.;]{0,40}\b(?:te|se) lo (?:contamos|contaremos|avisamos|avisaremos|decimos|diremos|informamos|informaremos|hacemos saber)\b/,
];

export function invierteQuienHaceQue(frase) {
  const f = sinTildes(plano(frase));
  if (PATRONES_QUE_INVIERTEN.some((p) => p.test(f))) return true;
  if (!/\b(?:(?:nosotros )?nos (?:encargamos|ocupamos|encargaremos) de radicar|nosotros (?:la |lo |te (?:la|lo) )?radicamos|radicamos (?:tu|la|su) (?:solicitud|devolucion)|(?:la|lo) radicamos (?:nosotros|por ti|ante|en la dian)|radicamos (?:ante|en) la dian|radicaremos (?:tu|la|su) (?:solicitud|devolucion))/.test(f)) return false;
  if (/\bno (?:la |lo |te (?:la|lo) )?radicamos\b|\bnunca radicamos\b|\bni radicamos\b/.test(f)) return false;
  if (/\bupme\b|certificad/.test(f)) return false;
  // (En la landing «radicamos tu solicitud» sin nombrar la entidad SÍ aparece, y es la UPME: la ficha
  // del servicio «Certificado UPME». Aquí, sin fichero que dé contexto, sólo cuenta con la DIAN o el IVA.)
  return /\bdian\b|\biva\b|devolucion/.test(f);
}

const REGLAS = [
  [plazoMalDicho, 'los 50 días son para PAGAR tras aprobar, no para responder ni desde el envío'],
  [citaUnArticuloParaElPlazo, 'se cita un artículo (855/860) para un plazo que no dice'],
  [prometeUnTotal, '«tres meses y medio» no tiene fuente'],
  [invierteQuienHaceQue, 'invierte quién hace qué ante la DIAN'],
];

// ── El control: cada regla caza lo suyo y deja pasar lo cierto ─────────────────────────────────

function control() {
  const fallos = [];
  const debe = (ok, que) => { if (!ok) fallos.push(que); };
  for (const mal of [
    'La DIAN tiene hasta 50 días hábiles para responder.',
    'La DIAN tiene hasta 50 días hábiles para contestar.',
    'La DIAN cuenta con cincuenta (50) días hábiles para resolver.',
    'Desde que envías el correo, la DIAN tiene hasta 50 días hábiles para pagarte.',
    'la DIAN tiene hasta 50 dias habiles para pagar, contados desde que la solicitud queda radicada',
    'La DIAN se demora hasta 50 días hábiles en darte una respuesta.',
    'La DIAN tiene 50 días hábiles para aprobar o rechazar.',
    'La DIAN tiene 50 días hábiles para revisar tu solicitud.',
  ]) debe(plazoMalDicho(mal), `plazoMalDicho no caza: ${mal}`);
  for (const bien of [
    'tiene hasta 15 días hábiles para responder y, si la aprueba, hasta 50 días hábiles para pagar.',
    'Desde la radicación hasta el certificado UPME: normalmente unos 15 días hábiles, y el máximo legal son 30.',
    'Son 50 días hábiles para pagar.',
  ]) debe(!plazoMalDicho(bien), `plazoMalDicho marca una frase cierta: ${bien}`);
  debe(citaUnArticuloParaElPlazo('responde en 15 días hábiles y, si aprueba, paga en 50 días (artículos 855 y 860 del Estatuto Tributario).'), 'no caza el artículo citado para el plazo');
  debe(citaUnArticuloParaElPlazo('si la aprueba, 50 días hábiles para pagar (artículo 855 del Estatuto Tributario).'), 'no caza el 855 junto a los 50 días');
  debe(!citaUnArticuloParaElPlazo('"el término para devolver será el consagrado en los artículos 855 y 860 del Estatuto Tributario." Son 50 días hábiles para pagar.'), 'marca la cita literal de la DIAN');
  debe(!citaUnArticuloParaElPlazo('Estatuto Tributario, Arts. 855 y 857. Procedimiento de devolución, plazos y causales de rechazo.'), 'marca una lista de fuentes sin plazo');
  debe(!citaUnArticuloParaElPlazo('para los casos que cumplen el mecanismo de devolución automática, conforme al parágrafo 5 del artículo 855 del Estatuto Tributario, la devolución tendrá lugar dentro de los quince (15) días siguientes.'), 'marca la devolución automática de los Términos');
  debe(prometeUnTotal('En total suele tomar unos tres meses y medio.'), 'no caza el total a ojo');
  for (const mal of ['Te avisamos cuando la DIAN responda.', 'Te contamos apenas la DIAN nos diga algo.', 'Nosotros radicamos tu solicitud ante la DIAN.', 'Te avisamos en cuanto sepamos algo.', 'Te mantenemos al tanto de lo que diga la DIAN.', 'Cuando la DIAN responda, te lo contamos.', 'Nosotros nos encargamos de radicar tu solicitud ante la DIAN.']) {
    debe(invierteQuienHaceQue(mal), `invierteQuienHaceQue no caza: ${mal}`);
  }
  for (const bien of ['Te avisamos en cuanto la DIAN nos asigne tu cita.', 'Te escribimos cuando la DIAN nos confirme el día de tu cita.', 'Gestionamos todo el trámite por ti: creamos tu cuenta, llenamos formularios y radicamos tu solicitud.', 'Nosotros radicamos tu solicitud ante la UPME.', 'Tú reenvías el correo que te dejamos listo desde el correo de tu RUT.', 'Te avisamos cuando tu certificado esté emitido.']) {
    debe(!invierteQuienHaceQue(bien), `invierteQuienHaceQue marca una frase cierta: ${bien}`);
  }
  // El lector: ve el texto visible y el JSON-LD, y no los comentarios ni los scripts.
  const html = '<!-- 50 días hábiles para responder --><script>var x = "50 días hábiles para responder";</script>'
    + '<script type="application/ld+json">{"text":"La DIAN tiene hasta 50 días hábiles para responder."}</script>'
    + '<p>Una vez radicada, la DIAN tiene hasta <strong>50 días</strong>\n hábiles para resolver.</p>';
  debe(frases(loQueDiceUnHtml(html)).filter(plazoMalDicho).length === 2, 'el lector de HTML no ve exactamente el párrafo y el JSON-LD');
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
  for (const f of paginas) juzgar(loQueDiceUnHtml(readFileSync(f, 'utf8')), relative(raiz, f));
  for (const f of ['public/llms.txt', 'COPIES_LANDING_CERTIVEH.md']) {
    try { juzgar(readFileSync(join(raiz, f), 'utf8').replace(/\n/g, '. '), f); } catch { /* si no existe, no hay nada que juzgar */ }
  }
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
    console.error(`[guarda-de-textos] ${r.hallazgos.length} frase(s) dicen mal los plazos de la DIAN o quién hace qué:`);
    for (const h of r.hallazgos) console.error(`  · ${h}`);
    process.exit(1);
  }
  console.log(`[guarda-de-textos] ${r.paginas} páginas, llms.txt y los copies: los plazos y quién hace qué, bien dichos.`);
}
