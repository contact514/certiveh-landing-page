/**
 * **La tarifa que publica la landing, vigilada en cada build** (ajuste de precios, lote 4; ESPEC §5.1).
 *
 * Tres cosas, en este orden:
 *
 * 1. **La quinta copia.** `src/lib/tipos-de-activo.ts` es byte a byte la misma de los dos repos (portal y panel,
 *    `src/lib` y `supabase/functions/_shared`). Su SHA-256 tiene que ser `SHA_TIPOS_DE_ACTIVO`, la misma constante
 *    que fijan los tests de los dos repos. La reescribe `scripts/fijar-la-vigencia-de-la-tarifa.sh` del portal en el
 *    commit de publicación: nunca a mano.
 * 2. **El control del instrumento**, como `guarda-de-textos.mjs`: una copia alterada a propósito tiene que fallar, y
 *    el barrido tiene que cazar un precio de otra tarifa en un HTML inventado y dejar pasar uno limpio. Si el
 *    control falla, el build falla.
 * 3. **El barrido de `dist/` contra la tarifa vigente EN EL INSTANTE DEL BUILD**, no contra una lista negra fija.
 *    Se toma `tarifaVigente(new Date())`. Un precio de lista de cualquier OTRA fila de `TARIFAS` que no coincida con
 *    uno de la vigente (antes de T: 494.000, 606.000, 796.000…; después de T: 599.990, 499.990…) hace fallar el
 *    build. Y cada `"price"` de un `Offer` JSON-LD tiene que ser un precio de la vigente o el total de una ficha
 *    calculado con ella. Así el build de antes de T compila con la tarifa de agosto y el de T+1 min, con la nueva.
 *
 * Uso: `node scripts/guarda-de-la-tarifa.mjs` (lo corre `pnpm build`, después de `guarda-de-textos.mjs`).
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const COPIA = join(RAIZ, 'src/lib/tipos-de-activo.ts');

/** La huella de las cinco copias. La reescribe el script de la vigencia del portal; nunca a mano. */
export const SHA_TIPOS_DE_ACTIVO = 'e445283b4d141348f52de47a6f56f901e9fcc86e4b1178fdf611950180774243';

const sha = (texto) => createHash('sha256').update(texto).digest('hex');

/** «599.990» */
const conPuntos = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** Los precios de lista de una fila: tramitación eléctrica, gas, IVA en paquete y por separado (el fijo de cada regla). */
export function preciosDeLista(t) {
  return [...new Set([t.honorarios.veh.fijo, t.honorarios.gnv.fijo, t.ivaPaquete.fijo, t.ivaSuelto.fijo])];
}

/**
 * Los precios que NO pueden aparecer con la tarifa `vigente`: los de lista de las otras filas que no coinciden con
 * ninguno de la vigente (T1 y T2 comparten la tramitación eléctrica, por ejemplo).
 */
export function preciosProhibidos(tarifas, vigente) {
  const permitidos = new Set(preciosDeLista(vigente));
  const prohibidos = new Set();
  for (const t of tarifas) if (t.id !== vigente.id) for (const p of preciosDeLista(t)) if (!permitidos.has(p)) prohibidos.add(p);
  return [...prohibidos];
}

/** Las apariciones de un precio prohibido en un HTML: «$599.990», «599.990», o «599990» suelto (JSON-LD, código). */
export function preciosViejosEn(html, prohibidos) {
  const hallados = [];
  for (const p of prohibidos) {
    const formas = [conPuntos(p), String(p)];
    for (const f of formas) {
      const re = new RegExp(`(?<![\\d.,])${f.replace(/\./g, '\\.')}(?![\\d]|\\.\\d)`, 'g');
      if (re.test(html)) hallados.push(f);
    }
  }
  return hallados;
}

/** Los `"price"` de los Offer JSON-LD de un HTML. */
export function preciosDeLosOffers(html) {
  const precios = [];
  for (const m of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    for (const p of m[1].matchAll(/"price"\s*:\s*"?(\d+)"?/g)) precios.push(Number(p[1]));
  }
  return precios;
}

function htmlDe(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) return htmlDe(p);
    return n.endsWith('.html') ? [p] : [];
  });
}

async function main() {
  const fallos = [];
  const modulo = await import(new URL('../src/lib/tipos-de-activo.ts', import.meta.url).href);
  const { TARIFAS, tarifaVigente } = modulo;

  // 1 · La quinta copia.
  const texto = readFileSync(COPIA, 'utf8');
  if (sha(texto) !== SHA_TIPOS_DE_ACTIVO) {
    fallos.push(`src/lib/tipos-de-activo.ts no es la copia de los repos: SHA ${sha(texto)} ≠ ${SHA_TIPOS_DE_ACTIVO}. Cópiala byte a byte desde el portal.`);
  }

  // 2 · El control del instrumento.
  const vigente = tarifaVigente(new Date());
  const prohibidos = preciosProhibidos(TARIFAS, vigente);
  const control = [];
  if (sha(texto + '\n') === SHA_TIPOS_DE_ACTIVO) control.push('una copia alterada da el mismo SHA');
  if (prohibidos.length === 0) control.push('no hay ningún precio prohibido que buscar: el barrido no mide');
  const malo = `<p>Desde $${conPuntos(prohibidos[0] ?? 1)} + IVA</p><script type="application/ld+json">{"price": "${prohibidos[0] ?? 1}"}</script>`;
  if (preciosViejosEn(malo, prohibidos).length === 0) control.push('el barrido no caza un precio de otra tarifa');
  const bueno = `<p>Desde $${conPuntos(preciosDeLista(vigente)[0])} + IVA, IVA $1.234.567, ref 12599990123</p>`;
  if (preciosViejosEn(bueno, prohibidos).length > 0) control.push('el barrido acusa a un HTML limpio');
  if (control.length) {
    console.error(`[guarda-de-la-tarifa] FALLA EL CONTROL DEL INSTRUMENTO: ${control.join('; ')}`);
    process.exit(1);
  }

  // 3 · El barrido de dist/.
  const dist = join(RAIZ, 'dist');
  const paginas = htmlDe(dist);
  if (paginas.length < 20) {
    console.error(`[guarda-de-la-tarifa] solo ${paginas.length} páginas en dist/: ¿se construyó?`);
    process.exit(1);
  }
  const permitidosEnOffers = new Set(preciosDeLista(vigente));
  let fichas = 0;
  for (const p of paginas) {
    const html = readFileSync(p, 'utf8');
    const rel = relative(dist, p);
    const viejos = preciosViejosEn(html, prohibidos);
    if (viejos.length) fallos.push(`${rel}: cita precios de otra tarifa (${[...new Set(viejos)].join(', ')}); la vigente es ${vigente.id}`);
    for (const precio of preciosDeLosOffers(html)) {
      if (permitidosEnOffers.has(precio)) continue;
      // El total de una ficha de vehículo (tasa UPME + honorarios + IVA): vale si la ficha cita los honorarios de la
      // vigente, que es de donde sale ese total (`[slug].astro`).
      const fichaCuadra = rel.startsWith('vehiculos/') && html.includes(`honorarios CertiVeh $${conPuntos(vigente.honorarios.veh.fijo)}`);
      if (!fichaCuadra) fallos.push(`${rel}: el Offer JSON-LD dice "price": ${precio}, que no sale de la tarifa ${vigente.id}`);
    }
    if (rel.startsWith('vehiculos/') && rel !== 'vehiculos/index.html') {
      fichas++;
      if (!html.includes(`honorarios CertiVeh $${conPuntos(vigente.honorarios.veh.fijo)}`)) {
        fallos.push(`${rel}: la ficha no cita los honorarios de la tarifa ${vigente.id} ($${conPuntos(vigente.honorarios.veh.fijo)})`);
      }
    }
  }
  if (fichas < 5) fallos.push(`solo ${fichas} fichas de vehículos en dist/vehiculos: el barrido de fichas no mide`);

  if (fallos.length) {
    console.error(`[guarda-de-la-tarifa] ${fallos.length} fallo(s):\n  - ${fallos.join('\n  - ')}`);
    process.exit(1);
  }
  console.log(`[guarda-de-la-tarifa] copia ${SHA_TIPOS_DE_ACTIVO.slice(0, 12)}… ok; ${paginas.length} páginas y ${fichas} fichas con la tarifa ${vigente.id}; ninguna cita ${prohibidos.map(conPuntos).join(', ')}.`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
