/**
 * **Desde cuándo rigen las condiciones nuevas de los códigos de descuento y del Programa Win Win.**
 *
 * Es la única fuente de la fecha: la interpolan los Términos y Condiciones (arts. XIII, XIII-A y XXVIII, el
 * Anexo A v2.0 y los TyC de la Devolución del IVA) y la sección Win Win de la home. Se publica ANTES de que
 * las condiciones nuevas rijan, y el texto dice «vigente desde el …; hasta entonces rige la versión 1.0».
 *
 * `VIGENTE_DESDE` se escribe como se lee dentro de una frase, por ejemplo:
 * `'20 de noviembre de 2026 a las 00:00 (hora de Colombia)'`.
 *
 * Mientras valga `PENDIENTE_DE_FIJAR`, el build de Vercel falla a propósito (lo comprueba el frontmatter de
 * `terminos-y-condiciones.astro`): un texto legal con la fecha sin fijar no puede llegar a producción.
 */
export const PENDIENTE_DE_FIJAR = 'PENDIENTE DE FIJAR';

export const VIGENTE_DESDE: string = 'PENDIENTE DE FIJAR';

export const laVigenciaEstaPendiente = (): boolean => VIGENTE_DESDE === PENDIENTE_DE_FIJAR;
