import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontRegular = readFileSync(join(__dirname, "fonts/Inter-Regular.ttf"));
const fontSemiBold = readFileSync(join(__dirname, "fonts/Inter-SemiBold.ttf"));
const fontBold = readFileSync(join(__dirname, "fonts/Inter-Bold.ttf"));
const outDir = join(__dirname, "../public/og");
mkdirSync(outDir, { recursive: true });

const EMERALD = "#34D399";
const EMERALD_DARK = "#059669";
const TEAL = "#14B8A6";

const logoBase64 = `data:image/png;base64,${readFileSync(join(__dirname, "fonts/logo.png")).toString("base64")}`;

function loadImageAsBase64(path) {
  const buf = readFileSync(path);
  const ext = path.endsWith(".png") ? "png" : "jpeg";
  return `data:image/${ext};base64,${buf.toString("base64")}`;
}

// Preload background images (pre-cropped to 1200x630)
const bgDir = "/tmp/og-bgs";
const backgrounds = {
  home: loadImageAsBase64(join(bgDir, "hyundai-motor-group-KpsavDr0nmo-unsplash.jpg")),
  "otros-activos": loadImageAsBase64(join(bgDir, "solar.jpg")),
  blog: loadImageAsBase64(join(bgDir, "kelly-sikkema-SiOW0btU0zk-unsplash.jpg")),
  vehiculos: loadImageAsBase64(join(bgDir, "unsplash-community-ZmP1lmbfl70-unsplash.jpg")),
  aliados: loadImageAsBase64(join(bgDir, "towfiqu-barbhuiya-jpqyfK7GB4w-unsplash.jpg")),
  nosotros: loadImageAsBase64(join(bgDir, "jakub-zerdzicki-8wLZi9OhsWU-unsplash.jpg")),
  portal: loadImageAsBase64(join(bgDir, "portal-dashboard.jpg")),
};

function Pill({ text }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        padding: "6px 16px",
        borderRadius: 9999,
        background: "rgba(5,150,105,0.2)",
        border: "1px solid rgba(52,211,153,0.35)",
        fontSize: 14,
        fontWeight: 600,
        color: EMERALD,
      },
      children: text,
    },
  };
}

function createOGImage({ title, subtitle, pills = [], url = "certiveh.co", bg }) {
  return {
    type: "div",
    props: {
      style: {
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 64px",
        fontFamily: "Inter",
        position: "relative",
        overflow: "hidden",
        background: "#0F172A",
      },
      children: [
        // Background image (pre-cropped to 1200x630)
        {
          type: "img",
          props: {
            src: bg,
            width: 1200,
            height: 630,
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              opacity: 0.25,
            },
          },
        },
        // Dark overlay with gradient
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              width: 1200,
              height: 630,
              background: "linear-gradient(180deg, rgba(15,23,42,0.7) 0%, rgba(15,23,42,0.4) 50%, rgba(5,150,105,0.12) 100%)",
            },
          },
        },
        // Gradient accent line at top
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              width: 1200,
              height: 4,
              background: `linear-gradient(90deg, ${EMERALD_DARK}, ${TEAL})`,
            },
          },
        },
        // Top: Logo
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 12,
              position: "relative",
            },
            children: [
              // Shield logo PNG
              {
                type: "img",
                props: {
                  src: logoBase64,
                  width: 40,
                  height: 40,
                },
              },
              // Brand name
              {
                type: "div",
                props: {
                  style: { display: "flex" },
                  children: [
                    {
                      type: "span",
                      props: {
                        style: { fontSize: 36, fontWeight: 700, color: "white" },
                        children: "Certi",
                      },
                    },
                    {
                      type: "span",
                      props: {
                        style: { fontSize: 36, fontWeight: 700, color: EMERALD_DARK },
                        children: "Veh",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        // Middle: Title + Subtitle
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: 16,
              flex: 1,
              justifyContent: "center",
              position: "relative",
            },
            children: [
              // Title with colored keywords
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 48,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    letterSpacing: "-0.03em",
                    maxWidth: 900,
                    color: "white",
                    display: "flex",
                    flexWrap: "wrap",
                  },
                  children: title.flatMap((line, i) => {
                    const words = line.text.split(" ");
                    return words.map((word, j) => ({
                      type: "span",
                      props: {
                        style: {
                          color: line.color === "emerald" ? EMERALD : "white",
                          marginRight: 14,
                        },
                        children: word,
                      },
                    }));
                  }),
                },
              },
              subtitle
                ? {
                    type: "div",
                    props: {
                      style: {
                        fontSize: 21,
                        color: "rgba(255,255,255,0.55)",
                        lineHeight: 1.5,
                        maxWidth: 700,
                      },
                      children: subtitle,
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
        // Bottom: Pills + URL
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              position: "relative",
            },
            children: [
              pills.length > 0
                ? {
                    type: "div",
                    props: {
                      style: { display: "flex", gap: 10 },
                      children: pills.map((p) => Pill({ text: p })),
                    },
                  }
                : { type: "div", props: { children: "" } },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 17,
                    fontWeight: 600,
                    color: EMERALD,
                  },
                  children: url,
                },
              },
            ],
          },
        },
      ],
    },
  };
}

const pages = [
  {
    name: "home",
    title: [
      { text: "Reclama los" },
      { text: "beneficios tributarios", color: "emerald" },
      { text: "de tu carro electrico o hibrido" },
    ],
    subtitle: "Tramitamos tu certificado UPME y preparamos todo para la devolucion de tu IVA.",
    pills: ["Devolucion de IVA", "Deduccion en renta", "Depreciacion acelerada"],
    url: "certiveh.co",
  },
  {
    name: "otros-activos",
    title: [
      { text: "Certificado UPME", color: "emerald" },
      { text: "para cargadores, flotas GNV" },
      { text: "y energia solar" },
    ],
    subtitle: "Deduccion de renta del 50%, exclusion de IVA, exencion arancelaria y depreciacion acelerada.",
    pills: ["GEE", "FNCE", "Ley 1715/2014"],
    url: "certiveh.co/otros-activos",
  },
  {
    name: "blog",
    title: [
      { text: "Beneficios tributarios para" },
      { text: "carros electricos e hibridos", color: "emerald" },
      { text: "en Colombia" },
    ],
    subtitle: "Guias, calculadoras y todo lo que necesitas saber sobre el certificado UPME, la devolucion de IVA y la deduccion en renta.",
    pills: ["Certificado UPME", "Devolucion de IVA", "Deduccion en renta"],
    url: "certiveh.co/blog",
  },
  {
    name: "vehiculos",
    title: [
      { text: "Vehiculos" },
      { text: "electricos e hibridos", color: "emerald" },
      { text: "elegibles para beneficios tributarios" },
    ],
    subtitle: "Consulta si tu marca y modelo califica para devolucion de IVA, deduccion en renta y depreciacion acelerada con el certificado UPME.",
    pills: ["362+ modelos", "51 marcas"],
    url: "certiveh.co/vehiculos",
  },
  {
    name: "aliados",
    title: [
      { text: "Programa de Aliados", color: "emerald" },
      { text: "CertiVeh" },
    ],
    subtitle: "Genera ingresos adicionales ayudando a tus clientes a obtener su certificado UPME. Sin inversion, sin riesgo.",
    pills: ["Comisiones por referido", "Sin inversion"],
    url: "certiveh.co/aliados",
  },
  {
    name: "nosotros",
    title: [
      { text: "Quienes somos" },
      { text: "CertiVeh", color: "emerald" },
    ],
    subtitle: "Tramitamos tu certificado UPME y preparamos la devolucion de IVA de tu carro electrico o hibrido. 100% en linea.",
    pills: ["Medellin, Colombia"],
    url: "certiveh.co/nosotros",
  },
  {
    name: "portal",
    title: [
      { text: "Tramita tu" },
      { text: "certificado UPME", color: "emerald" },
      { text: "100% en linea" },
    ],
    subtitle: "Sube tus documentos, paga una sola vez y CertiVeh se encarga de todo. Seguimiento por WhatsApp.",
    pills: ["100% en linea", "Pago unico", "Sin portales gubernamentales"],
    url: "portal.certiveh.co",
  },
];

async function generate() {
  for (const page of pages) {
    const bg = backgrounds[page.name];
    const markup = createOGImage({ ...page, bg });

    const svg = await satori(markup, {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: fontRegular, weight: 400, style: "normal" },
        { name: "Inter", data: fontSemiBold, weight: 600, style: "normal" },
        { name: "Inter", data: fontBold, weight: 700, style: "normal" },
      ],
    });

    const resvg = new Resvg(svg, {
      fitTo: { mode: "width", value: 1200 },
    });
    const png = resvg.render().asPng();

    writeFileSync(join(outDir, `${page.name}.png`), png);
    console.log(`Generated: ${page.name}.png`);
  }
}

generate().catch(console.error);
