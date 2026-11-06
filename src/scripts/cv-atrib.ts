/**
 * **De dónde llegó la visita: la cookie `cv_atrib`** (medición de ventas, 6-nov-2026).
 *
 * Un anuncio deja en la URL su id de clic: `fbclid` (Meta), `gclid` (Google, web), `gbraid` / `wbraid` (Google, iOS).
 * Casi nadie se registra en esa página: lee la landing y entra al portal por un enlace que ya no lleva nada. Por eso el id
 * se guarda al llegar en una cookie PROPIA del dominio raíz (`.certiveh.co`, 90 días), que el portal
 * (`portal.certiveh.co`) y los de aliado (`*.portal.certiveh.co`) leen al crear la cuenta y mandan a su servidor.
 *
 * Es el MISMO formato que escribe el portal (`certiveh-portal-login`, `src/lib/atribucion.ts`, función
 * `capturarLaAtribucionDeLaUrl`): si cambias uno, cambia el otro. Versión 1:
 *   {"v":1,"fbclid":…,"fbclid_at":<ms>,"gclid"|"gbraid"|"wbraid":…,"clic_at":<ms>,"landing_url":"https://…/ruta","utm":{…},"llegada_at":<ms>}
 *
 * Qué NO guarda: ningún otro parámetro de la URL, ni la consulta ni el fragmento de la página (podrían llevar un correo
 * o un token). Nunca lanza: medir no puede romper la página.
 */

export const COOKIE_DE_ATRIBUCION = 'cv_atrib';
export const DURACION_DE_LA_ATRIBUCION_S = 90 * 24 * 3600;

const IDS_DE_GOOGLE = ['gclid', 'gbraid', 'wbraid'] as const;
const CLAVES_UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const OPACO = /^[A-Za-z0-9_\-.]{10,500}$/;

type Ventana = {
  location: { hostname: string; search: string; origin: string; pathname: string };
  document: { cookie: string };
};

type CookieDeAtribucion = {
  v: 1;
  fbclid?: string;
  fbclid_at?: number;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  clic_at?: number;
  landing_url?: string;
  utm?: Record<string, string>;
  /** Cuándo se guardaron `landing_url` y `utm` (ronda 8): como los ids, valen 90 días desde ahí. */
  llegada_at?: number;
};

function esDeCertiveh(h: string): boolean {
  const x = String(h || '').toLowerCase();
  return x === 'certiveh.co' || x.endsWith('.certiveh.co');
}

/**
 * **La cookie también cumple los 90 días** (ronda 8): al leerla se descarta cada dato capturado hace más de 90 días (o sin
 * fecha), aunque la cookie siga viva porque se reescribió después. Así no se reenvía ni se arrastra al reescribirla.
 */
export function sinLoCaducado(c: CookieDeAtribucion, ahora: number): CookieDeAtribucion {
  const vivo = (t: unknown) => typeof t === 'number' && Number.isFinite(t) && ahora - t <= DURACION_DE_LA_ATRIBUCION_S * 1000;
  const r: CookieDeAtribucion = { ...c };
  if (!vivo(r.fbclid_at)) { delete r.fbclid; delete r.fbclid_at; }
  if (!vivo(r.clic_at)) { for (const k of IDS_DE_GOOGLE) delete r[k]; delete r.clic_at; }
  if (!vivo(r.llegada_at)) { delete r.landing_url; delete r.utm; delete r.llegada_at; }
  return r;
}

export function leerLaCookieDeAtribucion(doc: { cookie: string }, ahora: number = Date.now()): CookieDeAtribucion | null {
  try {
    for (const parte of String(doc.cookie ?? '').split(';')) {
      const i = parte.indexOf('=');
      if (i < 0 || parte.slice(0, i).trim() !== COOKIE_DE_ATRIBUCION) continue;
      const j = JSON.parse(decodeURIComponent(parte.slice(i + 1).trim())) as CookieDeAtribucion;
      return j && typeof j === 'object' && j.v === 1 ? sinLoCaducado(j, ahora) : null;
    }
  } catch { /* ilegible */ }
  return null;
}

/** Si la URL trae un id de clic o utm, lo guarda en `cv_atrib`. Devuelve si escribió. */
export function capturarLaAtribucionDeLaUrl(win: Ventana, ahora: number = Date.now()): boolean {
  try {
    if (!esDeCertiveh(win.location.hostname)) return false;
    const p = new URLSearchParams(win.location.search);
    const antes: CookieDeAtribucion = leerLaCookieDeAtribucion(win.document, ahora) ?? { v: 1 };
    const nueva: CookieDeAtribucion = { ...antes, v: 1 };
    let cambio = false;
    let clic = false;

    const fbclid = p.get('fbclid')?.trim();
    if (fbclid && OPACO.test(fbclid) && fbclid !== antes.fbclid) {
      nueva.fbclid = fbclid;
      nueva.fbclid_at = ahora;
      cambio = clic = true;
    }
    const deGoogle = IDS_DE_GOOGLE.find((k) => { const v = p.get(k)?.trim(); return !!v && OPACO.test(v); });
    if (deGoogle) {
      const v = p.get(deGoogle)!.trim();
      if (v !== antes[deGoogle]) {
        for (const k of IDS_DE_GOOGLE) delete nueva[k];
        nueva[deGoogle] = v;
        nueva.clic_at = ahora;
        cambio = clic = true;
      }
    }
    const utm: Record<string, string> = {};
    for (const k of CLAVES_UTM) {
      const v = p.get(k)?.trim();
      if (v && v.length <= 150) utm[k] = v;
    }
    // La llegada (URL de entrada y utm) es UNA pieza con su fecha (ronda 8): un clic nuevo la sustituye entera (aunque sea
    // por nada); sin clic, sólo se llena si no había. Nunca un dato viejo bajo una fecha nueva.
    if (clic) { delete nueva.utm; delete nueva.landing_url; delete nueva.llegada_at; }
    const hayUtm = Object.keys(utm).length > 0;
    if (!nueva.utm && !nueva.landing_url && (hayUtm || clic)) {
      if (hayUtm) nueva.utm = utm;
      nueva.landing_url = `${win.location.origin}${win.location.pathname}`.slice(0, 300);
      if (nueva.utm || nueva.landing_url) nueva.llegada_at = ahora;
      cambio = true;
    }
    if (!cambio) return false;

    win.document.cookie = `${COOKIE_DE_ATRIBUCION}=${encodeURIComponent(JSON.stringify(nueva))}; Max-Age=${DURACION_DE_LA_ATRIBUCION_S}; Path=/; Domain=.certiveh.co; SameSite=Lax; Secure`;
    return true;
  } catch {
    return false;
  }
}

/** El id de la etiqueta de Google Ads (`AW-<dígitos>`) o `null`: sin él, la etiqueta no se configura. */
export function idDeLaEtiquetaDeGoogle(crudo: unknown): string | null {
  const v = typeof crudo === 'string' ? crudo.trim() : '';
  return /^AW-\d{6,15}$/.test(v) ? v : null;
}

type VentanaConDataLayer = { document: { querySelector(s: string): { getAttribute(n: string): string | null } | null }; dataLayer?: unknown[] };

/**
 * Configura la etiqueta de Google Ads leyendo el id del `<meta name="cv-etiqueta-google-ads">` que pinta el build. Usa el
 * gtag.js que ya carga GA4 (una sola descarga) y empuja `arguments`, como el `gtag` oficial. Sin meta o con un id mal
 * formado no hace nada. **Nunca lanza.** Devuelve si la configuró.
 */
export function configurarLaEtiquetaDeGoogleAds(win: VentanaConDataLayer): boolean {
  try {
    const id = idDeLaEtiquetaDeGoogle(win.document.querySelector('meta[name="cv-etiqueta-google-ads"]')?.getAttribute('content'));
    if (!id) return false;
    win.dataLayer = win.dataLayer || [];
    const dl = win.dataLayer;
    const gtag = function (..._a: unknown[]) { dl.push(arguments as any); };
    // Sin pasar el id de clic por los enlaces y sin conversiones avanzadas en la etiqueta: los datos del visitante no salen
    // del navegador (auditoría I5). En Google Ads se apaga además la recopilación automática de datos del usuario (guion F).
    gtag('set', 'url_passthrough', false);
    // Sin remarketing (7-nov-2026): ni personalización de anuncios ni señales de Google. Sólo el vinculador de conversiones.
    gtag('set', { allow_ad_personalization_signals: false, allow_google_signals: false });
    gtag('config', id, { allow_enhanced_conversions: false });
    return true;
  } catch {
    return false;
  }
}
