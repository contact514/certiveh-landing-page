/**
 * **Los precios que muestra la landing salen de la TARIFA, no se escriben** (ajuste de precios, lote 4; ESPEC §5).
 *
 * `tipos-de-activo.ts` es la quinta copia, byte a byte, de la de los dos repos (la vigila
 * `scripts/guarda-de-la-tarifa.mjs` en cada build). Aquí solo se componen sus funciones con la tasa de la UPME,
 * para que las dos calculadoras, las tarjetas, las fichas y los JSON-LD citen las mismas cifras que el portal.
 *
 * Quién elige la tarifa:
 *  - en el build (frontmatter de Astro): `tarifaVigente(new Date())` en el instante del build;
 *  - en el navegador (islas React): la del build al pintar y, tras hidratar, la vigente con el reloj del
 *    cliente (`useTarifaDeLaIsla`), para que tras T la home no muestre la vieja hasta el rebuild.
 */
import {
  costoIvaBundled,
  costoIvaStandalone,
  honorariosCertivehSinEscalar,
  pesosDeLaTarifa,
  textoDeLaRegla,
  type Tarifa,
} from './tipos-de-activo.ts';

/** El UVT de 2026 (Resolución DIAN 000238 de 2025): el mismo con el que el portal calcula la tasa. */
export const UVT_2026 = 52_374;

/** La tasa del trámite ante la UPME (Res. UPME 563 de 2026), en pesos: la misma fórmula del portal. */
export function tasaUpme(valorSinIva: number): number {
  const invUVT = valorSinIva / UVT_2026;
  let pagoUVT: number;
  if (invUVT < 275) pagoUVT = 1.2;
  else if (invUVT < 826) pagoUVT = 3.4;
  else if (invUVT < 1_652) pagoUVT = 6.7;
  else if (invUVT < 3_305) pagoUVT = 13.4;
  else pagoUVT = Math.min(13.4 + (invUVT - 3_305) * 0.405 * 0.005, 275);
  return Math.round(pagoUVT * UVT_2026);
}

const iva19 = (x: number) => Math.round(x * 0.19);

/** La calculadora de la home (eléctricos e híbridos), con o sin la gestión de la devolución de IVA. */
export function cotizacionDeLaHome(valorSinIva: number, conIva: boolean, t: Tarifa) {
  const costoUPME = tasaUpme(valorSinIva);
  const honorariosBase = honorariosCertivehSinEscalar('veh', valorSinIva, t);
  const ivaServicio = iva19(honorariosBase);
  const honorariosIvaRefund = conIva ? costoIvaBundled(valorSinIva, t) : 0;
  const ivaIvaRefund = iva19(honorariosIvaRefund);
  const costoTotal = costoUPME + honorariosBase + ivaServicio + honorariosIvaRefund + ivaIvaRefund;
  return { costoUPME, honorariosBase, ivaServicio, honorariosIvaRefund, ivaIvaRefund, costoTotal };
}

/** La calculadora de «otros activos» (gas natural). */
export function cotizacionDeGas(valorSinIva: number, t: Tarifa) {
  const costoUPME = tasaUpme(valorSinIva);
  const honorariosBase = honorariosCertivehSinEscalar('gnv', valorSinIva, t);
  const ivaServicio = iva19(honorariosBase);
  return { costoUPME, honorariosBase, ivaServicio, costoTotal: costoUPME + honorariosBase + ivaServicio };
}

/** Las cifras «desde» de las tarjetas, la confianza y los JSON-LD. */
export function preciosDesde(t: Tarifa) {
  const certificado = honorariosCertivehSinEscalar('veh', 0, t);
  const ivaPaquete = costoIvaBundled(0, t);
  const ivaSuelto = costoIvaStandalone(0, t);
  const gas = honorariosCertivehSinEscalar('gnv', 0, t);
  return {
    certificado, ivaPaquete, ivaSuelto, gas,
    /** «$494.000» */
    pesos: { certificado: pesosDeLaTarifa(certificado), ivaPaquete: pesosDeLaTarifa(ivaPaquete), ivaSuelto: pesosDeLaTarifa(ivaSuelto), gas: pesosDeLaTarifa(gas) },
    reglas: { ivaPaquete: textoDeLaRegla(t.ivaPaquete), ivaSuelto: textoDeLaRegla(t.ivaSuelto), gas: textoDeLaRegla(t.honorarios.gnv) },
  };
}

/** «Desde $880.000 COP + IVA para inversiones de hasta $150M. Si vale más, …»: la descripción del Offer de gas. */
export function descripcionDeGas(t: Tarifa): string {
  return `Desde ${textoDeLaRegla(t.honorarios.gnv).replace(' + IVA', ' COP + IVA').replace('para vehículos de hasta', 'para inversiones de hasta').replace(/del valor del vehículo/g, 'del valor del activo')}. Más el costo del trámite ante la UPME según resolución vigente.`;
}
