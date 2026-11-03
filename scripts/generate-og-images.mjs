import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

// Imágenes sociales de certiveh.co (1200x630) con satori. Estándar visual 2026-11 (DESIGN_SYSTEM.md §0):
// Albert Sans (OFL, los TTF y su licencia en scripts/fonts/), el escudo en un solo verde plano, el titular en una
// sola tinta, sin degradados de marca ni píldoras. Lo único en degradado es el velo neutro oscuro sobre la foto,
// que es la excepción que permite §0.4 para poder leer encima.

const __dirname = dirname(fileURLToPath(import.meta.url));
// sharp no es dependencia directa del repo: llega con astro, así que se resuelve desde él.
const sharp = createRequire(createRequire(import.meta.url).resolve("astro/package.json"))("sharp");
const fontRegular = readFileSync(join(__dirname, "fonts/AlbertSans-Regular.ttf"));
const fontSemiBold = readFileSync(join(__dirname, "fonts/AlbertSans-SemiBold.ttf"));
const fontBold = readFileSync(join(__dirname, "fonts/AlbertSans-Bold.ttf"));
const outDir = join(__dirname, "../public/og");
mkdirSync(outDir, { recursive: true });

const MINT = "#A7F3D0";   // --cv-mint: el verde legible sobre fondo oscuro
const FIELD = "#0F172A";  // --cv-field

// El escudo sale del favicon (un solo verde, rayo blanco), rasterizado aquí mismo: ya no depende de un PNG aparte.
const logoPng = new Resvg(readFileSync(join(__dirname, "../public/favicon.svg"), "utf8"), { fitTo: { mode: "width", value: 96 } }).render().asPng();
const logoBase64 = `data:image/png;base64,${logoPng.toString("base64")}`;

function loadImageAsBase64(path) {
  const buf = readFileSync(path);
  const ext = path.endsWith(".png") ? "png" : "jpeg";
  return `data:image/${ext};base64,${buf.toString("base64")}`;
}

// Fondos: VIVEN EN EL REPO (scripts/og-bgs/, ya recortados a 1200x630), así que el guion se puede reejecutar.
// Hasta noviembre de 2026 eran siete fotos de banco que estaban en /tmp y no en el repo: el guion moría con
// ENOENT. Ahora son las piezas reales del sitio: el fotograma del video de la home (público en
// /hero-bg-poster.webp, el mismo de las cabeceras de las páginas interiores) y el del video de /otros-activos.
// Para cambiar uno: recortarlo a 1200x630 en JPEG, dejarlo en scripts/og-bgs/ y reejecutar.
const bgDir = join(__dirname, "og-bgs");
const poster = loadImageAsBase64(join(bgDir, "hero-bg-poster.jpg"));
const backgrounds = {
  home: poster,
  "otros-activos": loadImageAsBase64(join(bgDir, "otros-activos-poster.jpg")),
  blog: poster,
  vehiculos: poster,
  aliados: poster,
  nosotros: poster, // la foto de los fundadores quedaba debajo del titular, con el texto sobre las caras
  portal: poster,
};

// Lo que antes eran píldoras: texto con la viñeta cuadrada de la marca.
function Item({ text }) {
  return {
    type: "div",
    props: {
      style: { display: "flex", alignItems: "center", gap: 10, fontSize: 19, fontWeight: 600, color: "white" },
      children: [
        { type: "div", props: { style: { width: 9, height: 9, background: MINT } } },
        { type: "div", props: { children: text } },
      ],
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
        fontFamily: "Albert Sans",
        position: "relative",
        overflow: "hidden",
        background: FIELD,
      },
      children: [
        // La foto, a todo color
        {
          type: "img",
          props: {
            src: bg,
            width: 1200,
            height: 630,
            style: { position: "absolute", top: 0, left: 0 },
          },
        },
        // Velo neutro oscuro sobre la foto (el mismo de los heros del sitio), para leer encima
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              width: 1200,
              height: 630,
              background: "linear-gradient(90deg, rgba(9,14,26,0.92) 0%, rgba(9,14,26,0.8) 55%, rgba(9,14,26,0.55) 100%)",
            },
          },
        },
        // Arriba: el escudo y la palabra en una sola tinta
        {
          type: "div",
          props: {
            style: { display: "flex", alignItems: "center", gap: 14, position: "relative" },
            children: [
              { type: "img", props: { src: logoBase64, width: 44, height: 44 } },
              {
                type: "div",
                props: {
                  style: { display: "flex", fontSize: 38, fontWeight: 700, letterSpacing: "-0.03em", color: "white" },
                  children: "CertiVeh",
                },
              },
            ],
          },
        },
        // En medio: el titular (una tinta) y la entradilla
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: 20,
              flex: 1,
              justifyContent: "center",
              position: "relative",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 58,
                    fontWeight: 700,
                    lineHeight: 1.04,
                    letterSpacing: "-0.03em",
                    maxWidth: 940,
                    color: "white",
                    display: "flex",
                    flexWrap: "wrap",
                  },
                  // Las palabras que antes iban en verde van en la misma tinta: un titular, un color.
                  children: title.flatMap((line) =>
                    line.text.split(" ").map((word) => ({
                      type: "span",
                      props: { style: { marginRight: 15 }, children: word },
                    })),
                  ),
                },
              },
              subtitle
                ? {
                    type: "div",
                    props: {
                      style: { fontSize: 24, color: "#E2E8F0", lineHeight: 1.4, maxWidth: 840 },
                      children: subtitle,
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
        // Abajo: los puntos y la dirección
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
                      style: { display: "flex", gap: 28 },
                      children: pills.map((p) => Item({ text: p })),
                    },
                  }
                : { type: "div", props: { children: "" } },
              {
                type: "div",
                props: {
                  style: { fontSize: 20, fontWeight: 600, color: MINT },
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
      { text: "de tu carro eléctrico o híbrido" },
    ],
    subtitle: "Tramitamos tu certificado UPME y gestionamos tu devolución de IVA ante la DIAN.",
    pills: ["Devolución de IVA", "Deducción en renta", "Depreciación acelerada"],
    url: "certiveh.co",
  },
  {
    name: "otros-activos",
    title: [
      { text: "Certificado UPME", color: "emerald" },
      { text: "para cargadores, flotas GNV" },
      { text: "y energía solar" },
    ],
    subtitle: "Deducción de renta del 50%, exclusión de IVA, exención arancelaria y depreciación acelerada.",
    pills: ["GEE", "FNCE", "Ley 1715/2014"],
    url: "certiveh.co/otros-activos",
  },
  {
    name: "blog",
    title: [
      { text: "Beneficios tributarios para" },
      { text: "carros eléctricos e híbridos", color: "emerald" },
      { text: "en Colombia" },
    ],
    subtitle: "Guías, calculadoras y todo lo que necesitas saber sobre el certificado UPME, la devolución de IVA y la deducción en renta.",
    pills: ["Certificado UPME", "Devolución de IVA", "Deducción en renta"],
    url: "certiveh.co/blog",
  },
  {
    name: "vehiculos",
    title: [
      { text: "Vehículos" },
      { text: "eléctricos e híbridos", color: "emerald" },
      { text: "elegibles para beneficios tributarios" },
    ],
    subtitle: "Consulta si tu marca y modelo califica para devolución de IVA, deducción en renta y depreciación acelerada con el certificado UPME.",
    pills: ["498+ modelos", "62 marcas"],
    url: "certiveh.co/vehiculos",
  },
  {
    name: "aliados",
    title: [
      { text: "Programa de Aliados", color: "emerald" },
      { text: "CertiVeh" },
    ],
    subtitle: "Genera ingresos adicionales ayudando a tus clientes a obtener su certificado UPME. Sin inversión, sin riesgo.",
    pills: ["Comisiones por referido", "Sin inversión"],
    url: "certiveh.co/aliados",
  },
  {
    name: "nosotros",
    title: [
      { text: "Quiénes somos" },
      { text: "CertiVeh", color: "emerald" },
    ],
    subtitle: "Tramitamos tu certificado UPME y gestionamos la devolución de IVA de tu carro eléctrico o híbrido ante la DIAN.",
    pills: ["Medellín, Colombia"],
    url: "certiveh.co/nosotros",
  },
  {
    name: "portal",
    title: [
      { text: "Tramita tu" },
      { text: "certificado UPME", color: "emerald" },
      { text: "100% en línea" },
    ],
    subtitle: "Sube tus documentos, paga una sola vez y sigue tu trámite en el portal. Avisos por WhatsApp.",
    pills: ["100% en línea", "Pago único", "Sin portales gubernamentales"],
    url: "portal.certiveh.co",
  },
];

// Una imagen por artículo del blog, con el titular del propio artículo: al compartir un artículo por WhatsApp o
// redes se ve DE QUÉ trata, no la portada genérica del blog. El texto NO se escribe aquí: se lee del
// `<h1 class="banner-title">` de cada página, así que un titular corregido se corrige también en su imagen al
// reejecutar el guion. BlogLayout la enlaza por el slug y cae en blog.png si un artículo nuevo aún no tiene la suya.
const blogDir = join(__dirname, "../src/pages/blog");
const decode = (t) => t.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/<[^>]+>/g, "");
const articulos = readdirSync(blogDir)
  .filter((f) => f.endsWith(".astro") && f !== "index.astro")
  .map((f) => {
    const h1 = readFileSync(join(blogDir, f), "utf8").match(/<h1 class="banner-title">([\s\S]*?)<\/h1>/);
    if (!h1) throw new Error(`${f}: no tiene <h1 class="banner-title">`);
    return { slug: f.replace(/\.astro$/, ""), h1: decode(h1[1]).replace(/\s+/g, " ").trim() };
  });

// El titular de un artículo es largo (hasta ~150 caracteres): el cuerpo baja con la longitud para que quepa
// siempre en el campo sin cortarse.
function createArticleImage({ h1, bg }) {
  const size = h1.length <= 60 ? 64 : h1.length <= 95 ? 54 : h1.length <= 125 ? 46 : 40;
  const base = createOGImage({ title: [{ text: h1 }], subtitle: null, url: "certiveh.co/blog", bg });
  const centro = base.props.children[3];
  centro.props.children[0].props.style = { ...centro.props.children[0].props.style, fontSize: size, maxWidth: 1040 };
  centro.props.children[0].props.children = h1.split(" ").map((word) => ({
    type: "span",
    props: { style: { marginRight: Math.round(size * 0.26) }, children: word },
  }));
  return base;
}

async function render(markup) {
  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Albert Sans", data: fontRegular, weight: 400, style: "normal" },
      { name: "Albert Sans", data: fontSemiBold, weight: 600, style: "normal" },
      { name: "Albert Sans", data: fontBold, weight: 700, style: "normal" },
    ],
  });
  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
}

// Las páginas enlazan el JPEG (~75 KB): el PNG de satori pesa ~500 KB por la foto de fondo, y WhatsApp deja de
// pintar la vista previa con imágenes pesadas. El PNG de las siete páginas se sigue escribiendo con su nombre de
// siempre porque es la URL que las redes ya tienen en caché; los artículos, que son nuevos, solo tienen JPEG.
async function escribir(base, png, { png: conPng = true } = {}) {
  if (conPng) writeFileSync(`${base}.png`, png);
  writeFileSync(`${base}.jpg`, await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toBuffer());
}

async function generate() {
  mkdirSync(join(outDir, "blog"), { recursive: true });
  for (const a of articulos) {
    await escribir(join(outDir, "blog", a.slug), await render(createArticleImage({ h1: a.h1, bg: poster })), { png: false });
    console.log(`Generated: blog/${a.slug}.jpg`);
  }
  for (const page of pages) {
    const bg = backgrounds[page.name];
    const markup = createOGImage({ ...page, bg });

    const svg = await satori(markup, {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Albert Sans", data: fontRegular, weight: 400, style: "normal" },
        { name: "Albert Sans", data: fontSemiBold, weight: 600, style: "normal" },
        { name: "Albert Sans", data: fontBold, weight: 700, style: "normal" },
      ],
    });

    const resvg = new Resvg(svg, {
      fitTo: { mode: "width", value: 1200 },
    });
    const png = resvg.render().asPng();

    await escribir(join(outDir, page.name), png);
    console.log(`Generated: ${page.name}.png + .jpg`);
  }
}

generate().catch((e) => { console.error(e); process.exit(1); });
