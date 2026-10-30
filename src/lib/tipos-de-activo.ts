/**
 * **El vocabulario de las verticales de CertiVeh, en un solo sitio.**
 *
 * Hasta agosto de 2026 sólo había una: el certificado UPME para vehículos eléctricos e híbridos.
 * Desde entonces se abre la de **vehículos a gas natural (GNV)**, y están anunciadas las de paneles
 * solares y cargadores. Este módulo es lo que hace que añadir la tercera sea una línea.
 *
 * ── Por qué es un EJE APARTE de `case_type`, y no un valor suyo ──
 *
 * `cases.case_type` distingue **el servicio** (`certificate` / `iva_refund`); `cases.asset_type`
 * distingue **el activo**. Son ortogonales: una devolución de IVA de un camión a gas es
 * `case_type='iva_refund'` **y** `asset_type='gnv'` a la vez. Con un único enum harían falta
 * `gnv`, `gnv_iva_refund`, `solar`, `solar_iva_refund`… y las ocho consultas del orquestador del
 * robot se multiplicarían por vertical.
 *
 * Y hay una razón medida, no estética: el código filtra `case_type` con **dos polaridades
 * opuestas**. Las listas blancas (`= 'certificate'`) excluirían un valor nuevo —incluido el kanban
 * del panel, donde el trámite tiene que verse— y las listas negras (`!= 'iva_refund'`) lo
 * contarían igual como ingreso UPME, con el precio equivocado. Invisible donde hay que verlo y
 * contado donde no.
 *
 * ── Este fichero NO IMPORTA NADA, y es a propósito ──
 *
 * Este módulo vive CINCO veces, byte a byte idéntico — dos por repo y la de la landing:
 *
 *   certiveh-portal-login/src/lib/tipos-de-activo.ts                     (navegador, portal)
 *   certiveh-portal-login/supabase/functions/_shared/tipos-de-activo.ts  (Deno, portal)
 *   certiveh-case-command/src/lib/tipos-de-activo.ts                     (navegador, panel)
 *   certiveh-case-command/supabase/functions/_shared/tipos-de-activo.ts  (Deno, panel)
 *   certiveh-landing-page/src/lib/tipos-de-activo.ts                     (landing: build y navegador)
 *
 * No es duplicación por descuido: el navegador y Deno no pueden compartir módulo, y los dos repos
 * tampoco pueden importarse. Es el mismo trato que ya tienen `reglas-de-producto.ts` e
 * `invoice-recipient.ts`. Sin imports, las cuatro copias pueden ser idénticas: el test de cada repo
 * compara sus dos **carácter a carácter**, y además fija el SHA-256 del fichero, que es lo que ata
 * los dos repos entre sí.
 * **Si tocas una, copia las otras CUATRO en el mismo commit** — y actualiza el SHA en los dos
 * repos y en la guarda de la landing, o los tests se ponen rojos.
 *
 * Por eso los precios de aquí salen SIN escalar: `scaleCop` vive en cada orilla. Quien consuma
 * `honorariosCertivehSinEscalar` tiene que envolverlo, igual que hace `fee-helpers.ts` con sus
 * constantes. Escalar aquí habría obligado a importar, y con ello a que las dos copias divergieran.
 */

/** Las verticales que existen. Añadir una es añadir aquí y en las tres tablas de abajo. */
export const TIPOS_DE_ACTIVO = ['veh', 'gnv'] as const;

export type TipoDeActivo = (typeof TIPOS_DE_ACTIVO)[number];

/**
 * **El defecto es el vehículo eléctrico, y de eso depende que nada se rompa.**
 *
 * La columna nace con `DEFAULT 'veh'`, así que las ~1.000 filas vivas quedan correctas sin
 * backfill y **todo consumidor que aún no lea la columna se comporta exactamente como hoy**. Es la
 * misma dirección de degradación que argumenta `reglas-de-producto.ts`: un olvido tiene que caer
 * en lo de siempre, nunca en lo nuevo.
 */
export const TIPO_DE_ACTIVO_POR_DEFECTO: TipoDeActivo = 'veh';

export function esTipoDeActivo(valor: unknown): valor is TipoDeActivo {
  return typeof valor === 'string' && (TIPOS_DE_ACTIVO as readonly string[]).includes(valor);
}

/**
 * Lo que no se reconoce cae en `veh`. **Falla hacia lo de siempre**: un `asset_type` corrupto o de
 * una versión futura del esquema tiene que comportarse como el trámite de toda la vida, no como
 * una vertical que este código no sabe tramitar.
 */
export function normalizaTipoDeActivo(valor: unknown): TipoDeActivo {
  return esTipoDeActivo(valor) ? valor : TIPO_DE_ACTIVO_POR_DEFECTO;
}

/**
 * **El nombre que ve el cliente. Nunca "GEE".**
 *
 * "GEE" es como la UPME llama internamente al proceso (Gestión Eficiente de la Energía) y un
 * cliente no tiene por qué saberlo.
 *
 * ⚠️ **Hoy NO lo consume nadie**, y está bien que se sepa: el nombre sólo hará falta cuando exista
 * el trámite de gas en el portal (selector, menú, filtro de "Mis trámites", tags de tipo, asunto
 * del correo, descripción del link de pago y chatbot). Se declara aquí desde ya para que, cuando
 * llegue ese momento, **el nombre se decida en un sitio y no en nueve** — que es exactamente el
 * problema que el `CLAUDE.md` fija con literales exactos para "Certificado UPME".
 *
 * `SUBTITULO_DE_ACTIVO` sí tiene consumidores (el onboarding y la tarjeta de ajustes), y por eso
 * los dos textos ya no divergen.
 */
export const NOMBRE_DE_ACTIVO: Record<TipoDeActivo, string> = {
  veh: 'Certificado UPME',
  gnv: 'Certificado UPME · Vehículos a gas natural',
};

/**
 * La lista de vehículos que admite cada vertical, en palabras del cliente.
 *
 * Lo consumen el paso 3 del onboarding y la tarjeta de ajustes del panel, que es lo que impide que
 * los dos digan cosas distintas de la misma vertical — ya pasó: uno decía "o microbuses" y el otro
 * "y microbuses a gas".
 *
 * **Los dos se usan**, y desde que la vertical de gas salió a producción: el selector del paso 1
 * (`SolicitudStep1`) y el desplegable de tipo de vehículo del cotizador del panel
 * (`QuoteVehicleCard`) recorren `TIPOS_DE_ACTIVO` y pintan el subtítulo de CADA uno, `veh`
 * incluido. *(Este párrafo decía que el de `veh` "todavía no lo usa nadie: hará falta cuando las
 * dos verticales convivan en el selector de trámite". Ya conviven desde agosto de 2026.)*
 */
export const SUBTITULO_DE_ACTIVO: Record<TipoDeActivo, string> = {
  veh: 'Eléctricos e híbridos',
  gnv: 'Camiones, tractocamiones, volquetas, buses y microbuses a gas',
};

// ── Elegibilidad ────────────────────────────────────────────────────────────────────────────

/** Uso del vehículo dentro de la vertical de gas. Se DERIVA de la clase, no se pregunta. */
export type UsoGnv = 'carga' | 'pasajeros';

/**
 * Las clases del RUNT que admite la vertical de gas, por uso.
 *
 * Los literales son los de `runt-catalog.ts` (`VEHICLE_CLASSES`), sin tildes y en la grafía del
 * catálogo; la comparación se hace normalizada, así que la tarjeta puede traerlos en mayúsculas.
 *
 * ⚠️ **`Buseta` está FUERA, y está confirmado** (28-ago-2026). El catálogo del RUNT la distingue
 * de `Bus` y de `Microbus`; se preguntó explícitamente y la respuesta fue que por ahora no entra.
 * No es un olvido: si algún día entra, se añade aquí a propósito.
 */
export const CLASES_GNV: Record<UsoGnv, readonly string[]> = {
  carga: ['Camion', 'Tractocamion', 'Volqueta'],
  pasajeros: ['Bus', 'Microbus'],
};

/** Normaliza como el catálogo: sin tildes, sin espacios de sobra, en minúsculas. */
function claveDeClase(raw: string): string {
  return String(raw ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

/**
 * El uso que corresponde a una clase, o `null` si esa clase no entra en la vertical de gas.
 *
 * **Se decide por CLASE, no por carrocería.** Una volqueta puede venir registrada con clase
 * `Camion` y carrocería `Volco`; en ese caso entra por ser camión, que es lo que dice la tarjeta.
 */
export function usoGnvDeLaClase(clase: string): UsoGnv | null {
  const clave = claveDeClase(clase);
  if (!clave) return null;
  for (const uso of Object.keys(CLASES_GNV) as UsoGnv[]) {
    if (CLASES_GNV[uso].some((c) => claveDeClase(c) === clave)) return uso;
  }
  return null;
}

/** Todas las clases admitidas, para pintar el desplegable del formulario. */
export function clasesGnvAdmitidas(): string[] {
  return [...CLASES_GNV.carga, ...CLASES_GNV.pasajeros];
}

/**
 * El combustible que tiene que decir la tarjeta de propiedad.
 *
 * Se compara normalizado y por inclusión, porque la grafía varía entre tarjetas. `DUAL` y
 * `BI-COMBUSTIBLE` **no** están, y está confirmado (28-ago-2026): se preguntó si un diésel
 * convertido a gas entraba y la respuesta fue que por ahora no.
 */
export const COMBUSTIBLES_GNV = ['gnv', 'gas natural', 'gas natural vehicular'] as const;

export function esCombustibleGnv(raw: string): boolean {
  const v = claveDeClase(raw);
  if (!v) return false;
  return COMBUSTIBLES_GNV.some((c) => v.includes(c));
}

// ── Precio ──────────────────────────────────────────────────────────────────────────────────

/**
 * **Las tarifas de CertiVeh, VERSIONADAS por fecha. Una fila nunca se edita: se añade otra.**
 *
 * Regla del dueño (28-oct-2026): lo PAGADO conserva su precio para siempre; desde la vigencia de una
 * fila, todo lo que se cobre paga esa fila, salvo un pago que el SERVIDOR registró como iniciado
 * antes (`payments.iniciado_at`). Ningún consumidor tardío reconstruye la lista con «la de hoy».
 *
 * Los precios salen SIN escalar: `scaleCop` vive en cada orilla, DESPUÉS del redondeo (ver el
 * encabezado de este fichero).
 *
 * ── Ninguna función de aquí lee el reloj ──
 * `tarifaVigente` exige el instante. Lo pasan los BORDES (componentes, handlers), nunca el código
 * de dinero, y así los tests no dependen de la hora: lo vigilan `la-tarifa-no-lee-el-reloj.test.ts`
 * y `npm run test:reloj` (corre las suites de cifras con la vigencia ANTES y DESPUÉS del reloj).
 *
 * ── `vigente_desde` es una constante, no «ahora» ──
 * Cinco orillas con cinco relojes y cinco despliegues tendrían cinco tarifas. Una fecha fija cambia
 * todas a la vez POR RELOJ, deja a la factura de ayer elegir la fila de ayer y es reproducible.
 * La de la última fila vale `2099-01-01` hasta el commit de PUBLICACIÓN, que la fija con
 * `scripts/fijar-la-vigencia-de-la-tarifa.sh` (copia a las cinco copias y rehace el SHA).
 *
 * ── Las filas viejas repiten la operación vieja ──
 * `v * 0.05 * 0.05` no es bit a bit `v * 0.0025`: `factores` se multiplican en orden.
 */
export interface TramoMarginal {
  /** Parte del valor entre `desde` (excluido) y `hasta` (incluido; `null` = sin tope). */
  readonly desde: number;
  readonly hasta: number | null;
  /** Partes por millón (0,303 % = 3030). Enteros: la suma es exacta. */
  readonly ppm: number;
}

export type ReglaDePrecio =
  | { readonly modo: 'fijo'; readonly fijo: number }
  | { readonly modo: 'fijo_y_porcentaje'; readonly fijo: number; readonly umbral: number; readonly factores: readonly number[] }
  | { readonly modo: 'fijo_y_tramos'; readonly fijo: number; readonly umbral: number;
      readonly combina: 'suma' | 'maximo'; readonly tramos: readonly TramoMarginal[] };

export interface Tarifa {
  /** Lo escribe el SERVIDOR en `confirmed_data.billing.tarifa_id` al facturar; el checkout lo deja
   *  en `honorarios_upme.tarifa_id` / `payment.tarifa_id` solo como traza (no decide nada). */
  readonly id: string;
  /** ISO 8601 CON zona. Rige desde este instante, incluido. */
  readonly vigente_desde: string;
  readonly honorarios: { readonly [K in TipoDeActivo]: ReglaDePrecio };
  /** Gestión de la devolución de IVA junto al certificado. Por VALOR: igual en las dos verticales. */
  readonly ivaPaquete: ReglaDePrecio;
  /** Gestión de la devolución de IVA por separado. Por VALOR: igual en las dos verticales. */
  readonly ivaSuelto: ReglaDePrecio;
}

/** Instante en que rige el ajuste de octubre de 2026. `2099-01-01` = todavía no publicado. */
export const VIGENCIA_DEL_AJUSTE_OCT_2026 = '2026-11-01T00:00:00-05:00';

export const TARIFAS: readonly Tarifa[] = [
  { // Antes del 4-ago-2026 (era `calcStandaloneIvaListPriceLegacy`). Gas no existía: copia la siguiente.
    id: 'hasta-2026-08-03', vigente_desde: '2026-01-01T00:00:00Z',
    honorarios: {
      veh: { modo: 'fijo', fijo: 599_990 },
      gnv: { modo: 'fijo_y_porcentaje', fijo: 899_990, umbral: 150_000_000, factores: [0.006] },
    },
    ivaPaquete: { modo: 'fijo_y_porcentaje', fijo: 499_990, umbral: 200_000_000, factores: [0.05, 0.05] },
    ivaSuelto: { modo: 'fijo_y_porcentaje', fijo: 699_990, umbral: 100_000_000, factores: [0.007] },
  },
  { // Medianoche UTC A PROPÓSITO: replica al segundo la puerta de la factura manual
    // (panel `importe-de-la-factura-manual.ts`, `created_at.slice(0, 10) < "2026-08-04"`).
    id: 'desde-2026-08-04', vigente_desde: '2026-08-04T00:00:00Z',
    honorarios: {
      veh: { modo: 'fijo', fijo: 599_990 },
      gnv: { modo: 'fijo_y_porcentaje', fijo: 899_990, umbral: 150_000_000, factores: [0.006] },
    },
    ivaPaquete: { modo: 'fijo_y_porcentaje', fijo: 499_990, umbral: 200_000_000, factores: [0.05, 0.05] },
    ivaSuelto: { modo: 'fijo_y_porcentaje', fijo: 599_990, umbral: 200_000_000, factores: [0.003] },
  },
  { // DECISIONES P1-P4 del ajuste de precios (28-oct-2026).
    id: 'ajuste-oct-2026', vigente_desde: VIGENCIA_DEL_AJUSTE_OCT_2026,
    honorarios: {
      veh: { modo: 'fijo', fijo: 494_000 },
      gnv: { modo: 'fijo_y_tramos', fijo: 880_000, umbral: 150_000_000, combina: 'suma', tramos: [
        { desde: 150_000_000, hasta: 300_000_000, ppm: 6_000 },
        { desde: 300_000_000, hasta: 600_000_000, ppm: 3_000 },
        { desde: 600_000_000, hasta: null, ppm: 1_000 },
      ] },
    },
    ivaPaquete: { modo: 'fijo_y_tramos', fijo: 606_000, umbral: 200_000_000, combina: 'maximo', tramos: [
      { desde: 0, hasta: 500_000_000, ppm: 3_030 }, { desde: 500_000_000, hasta: null, ppm: 1_500 },
    ] },
    ivaSuelto: { modo: 'fijo_y_tramos', fijo: 796_000, umbral: 200_000_000, combina: 'maximo', tramos: [
      { desde: 0, hasta: 500_000_000, ppm: 3_980 }, { desde: 500_000_000, hasta: null, ppm: 2_000 },
    ] },
  },
];

/** El instante (ms) de una fecha; `null` si no es legible. */
export function instanteDe(fecha: unknown): number | null {
  if (fecha instanceof Date) return Number.isFinite(fecha.getTime()) ? fecha.getTime() : null;
  if (typeof fecha === 'number') return Number.isFinite(fecha) ? fecha : null;
  if (typeof fecha === 'string' && fecha.trim() !== '') { const t = Date.parse(fecha); return Number.isFinite(t) ? t : null; }
  return null;
}

/** Las funciones que ELIGEN fila, construidas sobre una tabla. Existe para que `test:reloj` pueda
 *  simular la vigencia con el reloj REAL: monta un selector sobre una copia de `TARIFAS` con otra
 *  `vigente_desde`, sin tocar la hora. Producción usa `TARIFAS`. */
export function crearSelectorDeTarifas(tabla: readonly Tarifa[]) {
  const vigentePara = (instante: Date | string | number): Tarifa => {
    const t = instanteDe(instante);
    if (t === null) throw new Error(`tarifaVigente: instante ilegible (${String(instante)})`);
    let vigente = tabla[0];
    for (const fila of tabla) if (Date.parse(fila.vigente_desde) <= t) vigente = fila;
    return vigente;
  };
  return {
    /** La tarifa que regía en `instante` (OBLIGATORIO). Ilegible LANZA. */
    tarifaVigente: vigentePara,
    /** La fila de un id; `null` si no es ninguna. */
    tarifaPorId: (id: unknown): Tarifa | null =>
      typeof id === 'string' ? (tabla.find((f) => f.id === id) ?? null) : null,
    /** La vigente y la inmediatamente anterior, NUNCA una posterior. Solo para RECONSTRUIR lo
     *  cobrado (factura, derivación, cobro manual con fecha de transferencia); nunca para decidir
     *  lo que se cobra. La vigente va primero. */
    tarifasQueExplicanUnCobro: (instante: Date | string | number): Tarifa[] => {
      const v = vigentePara(instante); const i = tabla.indexOf(v);
      return i > 0 ? [v, tabla[i - 1]] : [v];
    },
    /** Para RECONSTRUIR un cobro: `tarifasQueExplicanUnCobro(instante)` y, solo si la fila SIGUIENTE
     *  entra en vigor como mucho `margenMs` después (10 min), también esa (reloj del cliente
     *  adelantado justo antes del cambio). La vigente al instante sigue mandando en el desempate. */
    filasParaReconstruir: (instante: Date | string | number, margenMs = 600_000): Tarifa[] => {
      const v = vigentePara(instante); const i = tabla.indexOf(v);
      const base = i > 0 ? [v, tabla[i - 1]] : [v];
      const sig = tabla[i + 1];
      const t = instanteDe(instante)!;
      return sig && Date.parse(sig.vigente_desde) - t <= margenMs ? [...base, sig] : base;
    },
    /** Las filas ya en vigor en `instante` (techo de plausibilidad). */
    tarifasEnVigorAl: (instante: Date | string | number): Tarifa[] => {
      const t = instanteDe(instante);
      if (t === null) throw new Error('tarifasEnVigorAl: instante ilegible');
      return tabla.filter((f) => Date.parse(f.vigente_desde) <= t);
    },
  };
}
export const { tarifaVigente, tarifaPorId, tarifasQueExplicanUnCobro, filasParaReconstruir, tarifasEnVigorAl } =
  crearSelectorDeTarifas(TARIFAS);

/** El precio de una regla, SIN escalar. `NaN` entra → `NaN` sale (como hoy en el IVA). */
export function precioDeLaRegla(regla: ReglaDePrecio, valor: number): number {
  switch (regla.modo) {
    case 'fijo': return regla.fijo;
    case 'fijo_y_porcentaje':
      return valor <= regla.umbral ? regla.fijo : Math.round(regla.factores.reduce((acc, f) => acc * f, valor));
    case 'fijo_y_tramos': {
      if (Number.isNaN(valor)) return NaN;       // no esconder un valor ausente tras el fijo
      if (valor <= regla.umbral) return regla.fijo;
      let ppmPorPeso = 0;
      for (const tr of regla.tramos) {
        const tope = tr.hasta === null ? valor : Math.min(valor, tr.hasta);
        if (tope > tr.desde) ppmPorPeso += tr.ppm * (tope - tr.desde);
      }
      const variable = Math.round(ppmPorPeso / 10_000_000) * 10;   // ppm·$ → $ → decena más cercana
      return regla.combina === 'suma' ? regla.fijo + variable : Math.max(regla.fijo, variable);
    }
  }
}

/**
 * **Los honorarios de CertiVeh, SIN escalar.** Quien lo consuma tiene que envolverlo en el
 * `scaleCop` de su orilla; ver el encabezado de este fichero.
 *
 * La tasa oficial de la UPME **no** depende del tipo de activo: es la misma tabla de tramos sobre
 * UVT para las dos verticales. Lo único que cambia entre ellas es esto. Un valor no finito cuenta
 * como 0, como siempre.
 *
 * @param valorSinIva Para `gnv`, el precio antes de impuestos de chasis + carrocería SUMADOS.
 */
export function honorariosCertivehSinEscalar(tipo: TipoDeActivo, valorSinIva: number, tarifa: Tarifa): number {
  const v = Number.isFinite(valorSinIva) ? valorSinIva : 0;
  return precioDeLaRegla(tarifa.honorarios[normalizaTipoDeActivo(tipo)], v);
}
/** Gestión de la devolución de IVA junto al certificado, SIN escalar. */
export function costoIvaBundled(valorSinIva: number, tarifa: Tarifa): number { return precioDeLaRegla(tarifa.ivaPaquete, valorSinIva); }
/** Gestión de la devolución de IVA por separado, SIN escalar. */
export function costoIvaStandalone(valorSinIva: number, tarifa: Tarifa): number { return precioDeLaRegla(tarifa.ivaSuelto, valorSinIva); }

// ── El TEXTO de una regla: aquí y no en Camila, porque lo necesitan el navegador del portal
//    (`ServiceInfo`), Deno (Camila, `partner-context`) y la landing, y solo este módulo llega a las
//    cinco orillas. Sin `Intl`: el formato no depende del idioma del runtime.
export function pesosDeLaTarifa(valor: number): string {
  return '$' + Math.round(valor).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
export function millonesDeLaTarifa(valor: number): string { return `$${Math.round(valor / 1_000_000)}M`; }
export function porcentajeDePpm(ppm: number): string { return String(ppm / 10_000).replace('.', ',') + '%'; }
export function porcentajeDeFactores(factores: readonly number[]): string {
  return String(Math.round(factores.reduce((a, f) => a * f, 100) * 1000) / 1000).replace('.', ',') + '%';
}
/** «$606.000 + IVA para vehículos de hasta $200M. Si vale más, el 0,303% del valor del vehículo
 *  hasta $500M y el 0,15% de lo que pase de $500M, y nunca menos de $606.000». Describe las tres
 *  formas de regla con las mismas palabras en las cinco orillas (es el mismo fichero). */
export function textoDeLaRegla(regla: ReglaDePrecio): string {
  const fijo = `${pesosDeLaTarifa(regla.fijo)} + IVA`;
  if (regla.modo === 'fijo') return fijo;
  const hasta = `para vehículos de hasta ${millonesDeLaTarifa(regla.umbral)}`;
  if (regla.modo === 'fijo_y_porcentaje') {
    return `${fijo} ${hasta}; por encima, el ${porcentajeDeFactores(regla.factores)} del valor del vehículo`;
  }
  const partes = regla.tramos.map((tr, i) => {
    const pct = `el ${porcentajeDePpm(tr.ppm)}`;
    if (tr.hasta === null) return `${pct} de lo que pase de ${millonesDeLaTarifa(tr.desde)}`;
    if (tr.desde === 0 || (i === 0 && regla.combina === 'maximo')) return `${pct} del valor del vehículo hasta ${millonesDeLaTarifa(tr.hasta)}`;
    return `${pct} de la parte entre ${millonesDeLaTarifa(tr.desde)} y ${millonesDeLaTarifa(tr.hasta)}`;
  });
  const lista = partes.length === 1 ? partes[0]
    : `${partes.slice(0, -1).join(', ')} y ${partes[partes.length - 1]}`;
  return regla.combina === 'suma'
    ? `${fijo} ${hasta}. Si vale más, a esos ${pesosDeLaTarifa(regla.fijo)} se les suma ${lista}`
    : `${fijo} ${hasta}. Si vale más, ${lista}, y nunca menos de ${pesosDeLaTarifa(regla.fijo)}`;
}

/**
 * **La tasa de IVA que la DIAN devuelve, por vertical.** Regla del dueño (30-ago-2026).
 *
 * Un vehículo eléctrico o híbrido paga IVA del 5% y eso es lo que se le devuelve. **Un vehículo a
 * gas natural paga el 19%, y se le devuelve el 19%.** No es un matiz: en un camión de 350 millones
 * son 66,5 millones en vez de 17,5 — el beneficio que se le enseña al cliente estaba a menos de un
 * tercio de lo que le corresponde.
 *
 * ⚠️ Esto es el BENEFICIO que recibe el cliente, no el PRECIO del servicio. El precio de la gestión
 * del IVA vive en `TARIFAS` (`ivaPaquete` / `ivaSuelto`), expresado sobre el VALOR del vehículo e
 * igual en las dos verticales: no se deriva de esta tasa.
 */
export const TASA_DEVOLUCION_IVA: Record<TipoDeActivo, number> = {
  veh: 0.05,
  gnv: 0.19,
};

/** El IVA que la DIAN le devuelve a este activo, en pesos. Redondeado, como todo el dinero. */
export function devolucionDeIvaEstimada(tipo: TipoDeActivo, valorSinIva: number): number {
  const v = Number.isFinite(valorSinIva) ? valorSinIva : 0;
  return Math.round(v * TASA_DEVOLUCION_IVA[normalizaTipoDeActivo(tipo)]);
}
