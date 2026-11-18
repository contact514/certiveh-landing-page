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

export const VIGENTE_DESDE: string = '12 de noviembre de 2026 a las 12:45 p. m. (hora de Colombia)';

export const laVigenciaEstaPendiente = (): boolean => VIGENTE_DESDE === PENDIENTE_DE_FIJAR;

/**
 * **100 · Desde cuándo rige el «Descuento de bienvenida»** (art. XXVIII, dictamen legal O-3 del 18-nov-2026). Va aparte de
 * `VIGENTE_DESDE` porque llega en otra fecha: la del encendido del experimento de precio, que fija Julian. Mientras esté sin fijar,
 * la misma guarda impide publicar los Términos (`laGuardaDeLaVigencia`). Los textos los tienen que aprobar Julian o la abogada.
 */
export const VIGENTE_DESDE_LA_BIENVENIDA: string = '19 de noviembre de 2026 a la 1:00 a. m. (hora de Colombia)';
export const laVigenciaDeLaBienvenidaEstaPendiente = (): boolean => VIGENTE_DESDE_LA_BIENVENIDA === PENDIENTE_DE_FIJAR;

/**
 * El aviso del borrador, el MISMO en los Términos y en la home (80 r3, BAJO-7 de pantalla): con la fecha sin fijar, la home
 * también lo pinta, en vez de «Condiciones vigentes desde el PENDIENTE DE FIJAR» a secas.
 */
export const AVISO_DEL_BORRADOR = 'BORRADOR: la fecha desde la que rigen las condiciones nuevas está pendiente de fijar. Esta versión no se puede publicar.';

/** Con esta variable a «1», un build LOCAL con la fecha sin fijar se permite como borrador (nunca en Vercel). */
export const PERMISO_DEL_BORRADOR = 'PERMITIR_VIGENCIA_PENDIENTE';

/**
 * **La guarda de la fecha, en cualquier build** (80 r2, BAJO-12 de la auditoría de pantalla). Antes solo fallaba con
 * `process.env.VERCEL`: un build local (el que se sube a mano con `vercel deploy --prebuilt` cuando Vercel no dispara)
 * pintaba «PENDIENTE DE FIJAR» en los Términos y en la home sin avisar. Ahora, con la fecha sin fijar:
 *   · en Vercel, falla siempre;
 *   · en local, falla también, salvo que se pida un borrador con `PERMITIR_VIGENCIA_PENDIENTE=1`: entonces lo avisa en
 *     la consola del build y la página lleva un aviso visible de borrador (`aviso`).
 * Con la fecha fijada, nada.
 */
export function laGuardaDeLaVigencia(
  entorno: Record<string, string | undefined>,
  pendiente: boolean = laVigenciaEstaPendiente(),
  cual: string = 'VIGENTE_DESDE',
): { aviso: string | null } {
  if (!pendiente) return { aviso: null };
  const falta = `terminos-y-condiciones: falta fijar ${cual} en src/lib/vigencia-de-los-codigos.ts`;
  if (entorno.VERCEL) throw new Error(falta);
  if (entorno[PERMISO_DEL_BORRADOR] !== '1') {
    throw new Error(`${falta}. Un build con la fecha sin fijar no se puede publicar. Para un borrador local: ${PERMISO_DEL_BORRADOR}=1 npm run build (la página lo dirá en un aviso visible).`);
  }
  return { aviso: AVISO_DEL_BORRADOR };
}
