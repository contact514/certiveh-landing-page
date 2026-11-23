/**
 * **La versión de los Términos y Condiciones publicada** (TyC 3.0 y anexo de la Devolución del IVA 2.0, 23-nov-2026).
 *
 * La pinta `src/pages/terminos-y-condiciones.astro` en la cabecera y en la del anexo del IVA. El portal guarda la que
 * acepta cada usuario (`profiles.terms_version`, `TERMS_VERSION` de `src/lib/terminos.ts` del portal) con la fecha en
 * ISO: `TERMINOS_VIGENTES_DESDE_ISO` tiene que ser esa misma cadena. Si la publicación se mueve de día, se cambian las
 * dos fechas aquí y la del portal (tres sitios allí: `src/lib/terminos.ts`, `supabase/functions/partner-api/index.ts` y
 * `supabase/functions/_shared/version-de-los-terminos.ts`). Lo vigila `tests/la-version-de-los-terminos.test.mjs`.
 */
export const VERSION_DE_LOS_TERMINOS = '3.0';
export const VERSION_DEL_ANEXO_DEL_IVA = '2.0';
export const TERMINOS_VIGENTES_DESDE = '23 de noviembre de 2026';
export const TERMINOS_VIGENTES_DESDE_ISO = '2026-11-23';
