/**
 * **El proceso de /otros-activos, dibujado** (decisión de Julian, 6-nov-2026). El portal no tiene un flujo de proyectos
 * (solo certificados de vehículos y devolución de IVA), así que estas piezas no pueden ser «capturas» de nada: son
 * ilustraciones planas de las cosas de cada paso, sin imitar ninguna pantalla. Un solo lenguaje para las cinco: formas
 * planas sin contorno, las esquinas de 6 px del sistema 2026-11 y su paleta (verde de la marca, tinta, tonos, papel), con
 * luz por escalones de tono y sin degradados. Van en `aria-hidden` (no cuentan para el SEO) y sin texto dentro.
 */
const C = {
  tinta: "#0F172A", gris: "#475569", grisClaro: "#94A3B8",
  verde: "#047857", verdeOsc: "#065F46", verdeMedio: "#10B981", verdeClaro: "#A7F3D0", verdeTinte: "#ECFDF5",
  tono: "#F0F4F2", tono2: "#E1E9E5", tono3: "#C9D4CE", papel: "#FFFFFF",
  sol: "#F5C518", solOsc: "#D9A90F", celda: "#1E3A5F", celdaLuz: "#2B5283", ambar: "#B45309",
};

/** Líneas de texto fingido: barras de 4 px en el gris claro. */
function Lineas({ x, y, anchos, sep = 10, color = C.tono3 }: { x: number; y: number; anchos: number[]; sep?: number; color?: string }) {
  return <>{anchos.map((w, k) => <rect key={k} x={x} y={y + k * sep} width={w} height={4} rx={2} fill={color} />)}</>;
}

/** Un panel solar visto de frente: 4 × 3 celdas, con su marco. */
function Panel({ x, y, w }: { x: number; y: number; w: number }) {
  const h = w * 0.62, cw = (w - 10) / 4, ch = (h - 8) / 3;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill={C.gris} />
      {Array.from({ length: 12 }, (_, k) => {
        const c = k % 4, f = Math.floor(k / 4);
        return <rect key={k} x={x + 2 + c * (cw + 2)} y={y + 2 + f * (ch + 2)} width={cw} height={ch} fill={(c + f) % 3 === 0 ? C.celdaLuz : C.celda} />;
      })}
    </g>
  );
}

/** Un cargador de pared, con su pantalla, su manguera y el conector. */
function Cargador({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={0} y={0} width={44} height={74} rx={6} fill={C.papel} />
      <rect x={30} y={0} width={14} height={74} rx={6} fill={C.tono2} />
      <rect x={8} y={10} width={22} height={14} rx={2} fill={C.celda} />
      <rect x={11} y={14} width={10} height={3} rx={1.5} fill={C.verdeClaro} />
      <circle cx={19} cy={36} r={5} fill={C.verde} />
      <path d="M36 58 C 58 62, 60 92, 40 96" stroke={C.tinta} strokeWidth={5} fill="none" strokeLinecap="round" />
      <rect x={30} y={92} width={14} height={18} rx={4} fill={C.tinta} />
      <rect x={34} y={108} width={6} height={4} fill={C.gris} />
    </g>
  );
}

function Lienzo({ children }: { children: React.ReactNode }) {
  return (
    <div className="oa-ilu">
      <svg viewBox="0 0 440 300" width="100%" role="presentation" focusable="false">
        <rect width={440} height={300} fill={C.tono} />
        {children}
      </svg>
    </div>
  );
}

/** 1. Los documentos del proyecto: la carpeta con la ficha técnica de un panel y la factura. */
function Documentos() {
  return (
    <Lienzo>
      <rect x={70} y={262} width={300} height={8} rx={4} fill={C.tono2} />
      <path d="M78 92 h92 l14 16 h178 a6 6 0 0 1 6 6 v142 a6 6 0 0 1 -6 6 H78 a6 6 0 0 1 -6 -6 V98 a6 6 0 0 1 6 -6z" fill={C.verdeOsc} />
      {/* la ficha técnica, inclinada hacia la izquierda */}
      <g transform="rotate(-6 170 150)">
        <rect x={104} y={56} width={142} height={176} rx={6} fill={C.papel} />
        <rect x={104} y={56} width={142} height={22} rx={6} fill={C.verde} />
        <rect x={104} y={70} width={142} height={8} fill={C.verde} />
        <rect x={114} y={64} width={46} height={5} rx={2.5} fill={C.verdeClaro} />
        <Panel x={118} y={90} w={74} />
        <Lineas x={200} y={92} anchos={[34, 26, 30, 22]} />
        <Lineas x={118} y={148} anchos={[112, 96, 104, 70]} sep={11} />
        <rect x={118} y={196} width={50} height={20} rx={3} fill={C.verdeTinte} />
        <rect x={124} y={203} width={30} height={5} rx={2.5} fill={C.verde} />
      </g>
      {/* la factura, inclinada hacia la derecha, con su total */}
      <g transform="rotate(5 290 150)">
        <rect x={226} y={60} width={128} height={168} rx={6} fill={C.papel} />
        <rect x={238} y={74} width={40} height={6} rx={3} fill={C.tinta} />
        <Lineas x={238} y={88} anchos={[60, 44]} sep={9} />
        {[0, 1, 2, 3].map((k) => (
          <g key={k}>
            <rect x={238} y={114 + k * 16} width={62} height={4} rx={2} fill={C.tono3} />
            <rect x={316} y={114 + k * 16} width={26} height={4} rx={2} fill={C.grisClaro} />
          </g>
        ))}
        <rect x={238} y={180} width={104} height={2} fill={C.tono2} />
        <rect x={238} y={190} width={40} height={6} rx={3} fill={C.tinta} />
        <rect x={302} y={188} width={40} height={10} rx={3} fill={C.verde} />
        {[0, 3, 5, 6, 9, 11, 14, 15, 18, 20, 23].map((d, k) => <rect key={k} x={238 + d * 3} y={208} width={k % 3 ? 1.5 : 2.5} height={12} fill={C.tinta} />)}
      </g>
      {/* el clip que las une */}
      <path d="M318 50 v40 a8 8 0 0 0 16 0 v-34 a5 5 0 0 0 -10 0 v30" stroke={C.gris} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      {/* el frente de la carpeta */}
      <path d="M72 168 h296 v88 a6 6 0 0 1 -6 6 H78 a6 6 0 0 1 -6 -6z" fill={C.verde} />
      <rect x={72} y={168} width={296} height={6} fill={C.verdeMedio} opacity={0.35} />
      <rect x={196} y={196} width={48} height={14} rx={3} fill={C.verdeOsc} />
      <rect x={202} y={201} width={36} height={4} rx={2} fill={C.verdeClaro} />
    </Lienzo>
  );
}

/** 2. La radicación: la solicitud sellada al entrar en la bandeja, y el año con la ventana del 1 de febrero al 15 de diciembre. */
function Radicacion() {
  const meses = Array.from({ length: 12 }, (_, k) => k);
  return (
    <Lienzo>
      {/* el calendario del año */}
      <rect x={40} y={52} width={150} height={190} rx={6} fill={C.papel} />
      <rect x={40} y={52} width={150} height={34} rx={6} fill={C.tinta} />
      <rect x={40} y={78} width={150} height={8} fill={C.tinta} />
      <rect x={56} y={64} width={48} height={8} rx={4} fill={C.tono3} />
      {[70, 160].map((cx) => <rect key={cx} x={cx - 4} y={42} width={8} height={20} rx={4} fill={C.gris} />)}
      {meses.map((m) => {
        const c = m % 3, f = Math.floor(m / 3), x = 54 + c * 44, y = 98 + f * 34;
        const fuera = m === 0;
        return (
          <g key={m}>
            <rect x={x} y={y} width={36} height={26} rx={4} fill={fuera ? C.tono2 : C.verdeTinte} />
            {!fuera && <rect x={x} y={y + 20} width={m === 11 ? 18 : 36} height={6} rx={m === 11 ? 3 : 0} fill={C.verde} />}
            <rect x={x + 6} y={y + 6} width={14} height={4} rx={2} fill={fuera ? C.grisClaro : C.verde} />
          </g>
        );
      })}
      {/* la bandeja de entrada */}
      <path d="M232 214 h168 l-14 34 H246z" fill={C.gris} />
      <rect x={226} y={206} width={180} height={12} rx={4} fill={C.tinta} />
      {/* la solicitud, entrando */}
      <g transform="rotate(-3 316 140)">
        <rect x={258} y={62} width={116} height={150} rx={6} fill={C.papel} />
        <rect x={258} y={62} width={116} height={150} rx={6} fill="none" />
        <rect x={272} y={78} width={54} height={7} rx={3.5} fill={C.tinta} />
        <Lineas x={272} y={96} anchos={[88, 74, 82, 60, 84, 50]} sep={11} />
        <path d="M274 180 c8 -10 14 6 22 -4 s12 4 18 -2" stroke={C.celda} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        {/* el sello de radicado */}
        <circle cx={344} cy={170} r={24} fill={C.verdeTinte} />
        <circle cx={344} cy={170} r={24} fill="none" stroke={C.verde} strokeWidth={4} />
        <circle cx={344} cy={170} r={15} fill="none" stroke={C.verde} strokeWidth={2} />
        <path d="M336 170 l6 6 l10 -12" stroke={C.verde} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M318 26 v26 m-10 -10 l10 10 l10 -10" stroke={C.verde} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Lienzo>
  );
}

/** 3. La evaluación técnica: la lista de la UPME en su tablilla y la lupa sobre el equipo (un cargador), con el reloj de los días hábiles. */
function Evaluacion() {
  const filas = [true, true, true, false];
  return (
    <Lienzo>
      <rect x={52} y={262} width={340} height={8} rx={4} fill={C.tono2} />
      {/* la tablilla */}
      <rect x={52} y={50} width={164} height={212} rx={6} fill={C.tinta} />
      <rect x={62} y={66} width={144} height={188} rx={4} fill={C.papel} />
      <rect x={104} y={40} width={60} height={22} rx={6} fill={C.gris} />
      <rect x={124} y={46} width={20} height={6} rx={3} fill={C.tinta} />
      {filas.map((ok, k) => (
        <g key={k}>
          <rect x={76} y={86 + k * 40} width={22} height={22} rx={4} fill={ok ? C.verde : C.papel} stroke={ok ? "none" : C.solOsc} strokeWidth={ok ? 0 : 3} />
          {ok && <path d={`M81 ${97 + k * 40} l4 4 l8 -9`} stroke={C.papel} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
          <rect x={108} y={90 + k * 40} width={k === 3 ? 56 : 82} height={5} rx={2.5} fill={ok ? C.tinta : C.grisClaro} />
          <rect x={108} y={100 + k * 40} width={k === 1 ? 44 : 64} height={4} rx={2} fill={C.tono3} />
        </g>
      ))}
      {/* el equipo bajo la lupa: un cargador de pared entero, con la lupa sobre su pantalla */}
      <rect x={292} y={52} width={92} height={10} rx={3} fill={C.tono3} />
      <Cargador x={300} y={62} s={1.5} />
      <rect x={334} y={232} width={24} height={30} rx={3} fill={C.tono3} />
      <circle cx={318} cy={110} r={34} fill={C.verdeClaro} opacity={0.4} />
      <circle cx={318} cy={110} r={34} fill="none" stroke={C.tinta} strokeWidth={7} />
      <rect x={262} y={136} width={14} height={50} rx={6} fill={C.tinta} transform="rotate(42 269 161)" />
      <path d="M296 98 a24 24 0 0 1 14 -12" stroke={C.papel} strokeWidth={4} fill="none" strokeLinecap="round" />
      {/* el reloj de los días hábiles */}
      <circle cx={248} cy={234} r={22} fill={C.papel} />
      <circle cx={248} cy={234} r={22} fill="none" stroke={C.verde} strokeWidth={5} />
      <path d="M248 221 v13 l9 6" stroke={C.tinta} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Lienzo>
  );
}

/** 4. La emisión: el certificado de la UPME con su sello y sus cintas. */
function Certificado() {
  return (
    <Lienzo>
      <rect x={70} y={252} width={300} height={8} rx={4} fill={C.tono2} />
      <rect x={58} y={46} width={324} height={206} rx={6} fill={C.papel} />
      <rect x={70} y={58} width={300} height={182} rx={4} fill="none" stroke={C.verde} strokeWidth={3} />
      <rect x={76} y={64} width={288} height={170} rx={3} fill="none" stroke={C.verdeClaro} strokeWidth={1.5} />
      {[[70, 58], [370, 58], [70, 240], [370, 240]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r={6} fill={C.verde} />)}
      <rect x={150} y={84} width={140} height={10} rx={5} fill={C.tinta} />
      <rect x={176} y={102} width={88} height={6} rx={3} fill={C.grisClaro} />
      <Lineas x={100} y={124} anchos={[240, 220, 236, 150]} sep={13} />
      <rect x={100} y={206} width={88} height={2} fill={C.tinta} />
      <path d="M106 200 c10 -14 16 4 24 -6 s14 2 22 -4 s8 4 14 0" stroke={C.celda} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <rect x={100} y={214} width={56} height={4} rx={2} fill={C.tono3} />
      {/* el sello con sus cintas */}
      <path d="M300 200 l-14 56 l16 -8 l10 14 l6 -58z" fill={C.verdeOsc} />
      <path d="M326 200 l14 56 l-16 -8 l-10 14 l-6 -58z" fill={C.verde} />
      {Array.from({ length: 16 }, (_, k) => {
        const a = (k / 16) * Math.PI * 2;
        return <circle key={k} cx={313 + Math.cos(a) * 34} cy={190 + Math.sin(a) * 34} r={9} fill={C.verde} />;
      })}
      <circle cx={313} cy={190} r={34} fill={C.verde} />
      <circle cx={313} cy={190} r={24} fill={C.verdeOsc} />
      <path d="M302 190 l8 8 l14 -16" stroke={C.verdeClaro} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Lienzo>
  );
}

/** 5. Los beneficios: del certificado salen los cuatro (el IVA, la renta, el arancel y la depreciación), cada uno con su cosa. */
function Beneficios() {
  return (
    <Lienzo>
      <rect x={24} y={244} width={392} height={8} rx={4} fill={C.tono2} />
      {/* el certificado, pequeño, de donde sale todo */}
      <rect x={176} y={28} width={88} height={60} rx={4} fill={C.papel} />
      <rect x={182} y={34} width={76} height={48} rx={3} fill="none" stroke={C.verde} strokeWidth={2} />
      <rect x={196} y={44} width={36} height={5} rx={2.5} fill={C.tinta} />
      <Lineas x={196} y={56} anchos={[44, 36]} sep={8} />
      <circle cx={246} cy={72} r={9} fill={C.verde} />
      <path d="M220 96 v18 M220 114 H70 v20 M220 114 h150 v20 M170 114 v20 M270 114 v20" stroke={C.tono3} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* IVA: el recibo con el porcentaje */}
      <g>
        <path d="M44 142 h52 v100 l-6 -5 l-7 5 l-7 -5 l-6 5 l-7 -5 l-7 5 l-6 -5 l-6 5z" fill={C.papel} />
        <circle cx={60} cy={164} r={6} fill={C.verde} />
        <circle cx={80} cy={188} r={6} fill={C.verde} />
        <path d="M82 158 l-24 36" stroke={C.verde} strokeWidth={5} strokeLinecap="round" />
        <Lineas x={54} y={206} anchos={[32, 24, 30]} sep={9} />
      </g>
      {/* Renta: la pila de monedas */}
      <g>
        {[0, 1, 2, 3, 4].map((k) => (
          <g key={k}>
            <ellipse cx={170} cy={234 - k * 14} rx={28} ry={9} fill={C.solOsc} />
            <rect x={142} y={222 - k * 14} width={56} height={12} fill={C.solOsc} />
            <ellipse cx={170} cy={222 - k * 14} rx={28} ry={9} fill={C.sol} />
          </g>
        ))}
        <ellipse cx={170} cy={166} rx={16} ry={4} fill={C.solOsc} />
      </g>
      {/* Arancel: el contenedor de importación */}
      <g>
        <rect x={230} y={168} width={84} height={70} rx={4} fill={C.verde} />
        <rect x={230} y={168} width={84} height={10} rx={4} fill={C.verdeOsc} />
        {[0, 1, 2, 3, 4, 5].map((k) => <rect key={k} x={238 + k * 12} y={184} width={6} height={46} rx={2} fill={C.verdeOsc} />)}
        <rect x={296} y={198} width={4} height={18} rx={2} fill={C.verdeClaro} />
        <rect x={234} y={160} width={76} height={6} rx={3} fill={C.gris} />
      </g>
      {/* Depreciación: las barras que bajan año tras año */}
      <g>
        {[64, 48, 32, 16].map((hgt, k) => <rect key={k} x={344 + k * 18} y={238 - hgt} width={12} height={hgt} rx={3} fill={k === 0 ? C.celda : C.celdaLuz} />)}
        <path d="M344 158 l60 34" stroke={C.ambar} strokeWidth={4} strokeLinecap="round" />
        <path d="M398 182 l8 12 l-14 1" stroke={C.ambar} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Lienzo>
  );
}

export function IlustracionDelPaso({ i }: { i: number }) {
  switch (i) {
    case 0: return <Documentos />;
    case 1: return <Radicacion />;
    case 2: return <Evaluacion />;
    case 3: return <Certificado />;
    default: return <Beneficios />;
  }
}

export const CSS_ILUSTRACION = `
  /* Las ilustraciones del proceso: un cuadro de 440 × 300 en el tono, esquinas de 6 px como todo el sistema. */
  .oa-ilu { width: min(440px, 100%); aspect-ratio: 440 / 300; border-radius: 6px; overflow: hidden; background: #F0F4F2; }
  .oa-ilu svg { display: block; width: 100%; height: 100%; }
`;
