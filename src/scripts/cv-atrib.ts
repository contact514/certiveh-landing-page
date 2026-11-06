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
 *   {"v":1,"fbclid":…,"fbclid_at":<ms>,"gclid"|"gbraid"|"wbraid":…,"clic_at":<ms>,"landing_url":"https://…/ruta","utm":{…}}
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
};

function esDeCertiveh(h: string): boolean {
  const x = String(h || '').toLowerCase();
  return x === 'certiveh.co' || x.endsWith('.certiveh.co');
}

export function leerLaCookieDeAtribucion(doc: { cookie: string }): CookieDeAtribucion | null {
  try {
    for (const parte of String(doc.cookie ?? '').split(';')) {
      const i = parte.indexOf('=');
      if (i < 0 || parte.slice(0, i).trim() !== COOKIE_DE_ATRIBUCION) continue;
      const j = JSON.parse(decodeURIComponent(parte.slice(i + 1).trim())) as CookieDeAtribucion;
      return j && typeof j === 'object' && j.v === 1 ? j : null;
    }
  } catch { /* ilegible */ }
  return null;
}

/** Si la URL trae un id de clic o utm, lo guarda en `cv_atrib`. Devuelve si escribió. */
export function capturarLaAtribucionDeLaUrl(win: Ventana, ahora: number = Date.now()): boolean {
  try {
    if (!esDeCertiveh(win.location.hostname)) return false;
    const p = new URLSearchParams(win.location.search);
    const antes: CookieDeAtribucion = leerLaCookieDeAtribucion(win.document) ?? { v: 1 };
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
    if (Object.keys(utm).length && (clic || !antes.utm)) { nueva.utm = utm; cambio = true; }
    if (cambio && (clic || !antes.landing_url)) nueva.landing_url = `${win.location.origin}${win.location.pathname}`.slice(0, 300);
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
    gtag('config', id);
    return true;
  } catch {
    return false;
  }
}
