/**
 * **La ventana de la Black Week 2026** (BLACK20), la que juzga el portal al preparar el pago.
 *
 * BLACK20 da el 20% de los honorarios de CertiVeh en todo el trámite (el certificado UPME, la Devolución de IVA o los
 * dos), nunca la tasa de la UPME, y no aplica con aliados. Vale del miércoles 25-nov-2026 a las 00:00 al lunes 30-nov
 * a las 23:59:59, hora de Colombia: `DESDE` incluido y `HASTA` excluido (el martes 1-dic a las 00:00 ya no vale).
 * Son los mismos instantes que `_shared/los-codigos.ts` del portal (DESPLIEGUE-BLACK-WEEK.md del portal).
 *
 * La franja de la landing (`FranjaDeLaBlackWeek.astro`) sale en el HTML siempre OCULTA y la enciende el reloj del
 * navegador (`src/scripts/la-franja-de-la-black-week.js`): un build de antes no la enseña antes de tiempo y un build
 * de durante no la deja pegada el martes.
 */
export const DESDE_LA_BLACK_WEEK = '2026-11-25T05:00:00.000Z';
export const HASTA_LA_BLACK_WEEK = '2026-12-01T05:00:00.000Z';

export const DESDE_LA_BLACK_WEEK_MS = Date.parse(DESDE_LA_BLACK_WEEK);
export const HASTA_LA_BLACK_WEEK_MS = Date.parse(HASTA_LA_BLACK_WEEK);

/** A dónde lleva la franja: el portal, como «Empezar ahora», con su campaña. */
export const ENLACE_DE_LA_FRANJA = 'https://portal.certiveh.co/?utm_source=landing&utm_campaign=black-week';
