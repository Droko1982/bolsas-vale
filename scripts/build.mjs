/* ==========================================================================
   Plásticos JR — generador de páginas estáticas (SEO)
   Uso:  node scripts/build.mjs
   Lee js/config.js + js/data.js + js/render.js y:
     • rellena las zonas <!--@x-->…<!--/@x--> de index.html (contenido estático)
     • crea páginas por producto, departamento y ciudad, toda Colombia,
       políticas, gracias y 404
     • escribe sitemap.xml y robots.txt
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ctx = { console };
ctx.window = ctx; ctx.globalThis = ctx;
vm.createContext(ctx);
for (const f of ["js/config.js", "js/data.js", "js/render.js"]) vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f });
const C = ctx.BV_CONFIG, D = ctx.BV_DATA, R = ctx.BVRender;
const SITE = C.siteUrl.replace(/\/$/, "");
const BASEPATH = new URL(SITE + "/").pathname;          // "/bolsas-vale/" o "/" con dominio propio
const TODAY = new Date().toISOString().slice(0, 10);
const esc = R.esc;
const write = (rel, html) => { const p = path.join(ROOT, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, html); };
const deptOf = c => D.dept(c.dept);
const urls = [];

/* ---------- piezas comunes ---------- */
const LOGO = (id) => `<svg class="logo-mark" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF4FA0"/><stop offset="1" stop-color="#C20E62"/></linearGradient></defs><path fill="url(#${id})" fill-rule="evenodd" d="M12 6h24a5 5 0 0 1 5 5v28a5 5 0 0 1-5 5H12a5 5 0 0 1-5-5V11a5 5 0 0 1 5-5Zm6.5 5a2.5 2.5 0 0 0 0 5h11a2.5 2.5 0 0 0 0-5Z"/><text x="24" y="37.5" text-anchor="middle" font-family="Bricolage Grotesque,Arial Black,Arial,sans-serif" font-weight="800" font-size="16.5" letter-spacing="-.5" fill="#fff">JR</text><circle cx="41" cy="7" r="3.2" fill="#00A6E6"/><circle cx="44.5" cy="12.5" r="2.2" fill="#FFC21A"/></svg>`;
const WA_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true" class="i-wa"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.8 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1a17 17 0 0 1-1.7-.6 13.4 13.4 0 0 1-5.2-4.6 5.9 5.9 0 0 1-1.2-3.1 3.4 3.4 0 0 1 1-2.5 1.1 1.1 0 0 1 .8-.4h.6c.2 0 .4 0 .7.5l1 2.4a.6.6 0 0 1 0 .6 2.3 2.3 0 0 1-.4.6l-.5.6c-.2.2-.3.3-.1.7a8.6 8.6 0 0 0 1.6 2 7.9 7.9 0 0 0 2.3 1.4c.3.1.5.1.7-.1l1-1.2c.2-.3.4-.3.7-.2l2.2 1.1c.3.2.5.2.6.4a2.7 2.7 0 0 1-.2 1.5Z"/></svg>`;
const waHref = msg => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`;

function footer(base) {
  return `<div><h4 data-i18n="ft.h1">Productos</h4><ul>${D.PRODUCTS.map(p => `<li><a href="${base}${p.slug}/" data-i18n="prodname.${p.id}">${esc(p.es.name)}</a></li>`).join("")}</ul></div>
    <div><h4 data-i18n="ft.h2">Cobertura</h4><ul>${D.DEPARTMENTS.map(d => `<li><a href="${base}${d.slug}/">Bolsas en ${esc(d.name)}</a></li>`).join("")}<li><a href="${base}bolsas-plasticas-colombia/" data-i18n="ft.colombia">Toda Colombia</a></li></ul></div>
    <div><h4 data-i18n="ft.h3">Empresa</h4><ul><li><a href="${base}#disena" data-i18n="ft.design">Diseñador de bolsas</a></li><li><a href="${base}#medidas" data-i18n="ft.sizes">Guía de medidas</a></li><li><a href="${base}#ley-2232" data-i18n="ft.law">Ley 2232</a></li><li><a href="${base}#faq" data-i18n="ft.faq">Preguntas frecuentes</a></li><li><a href="${base}#contacto" data-i18n="ft.contact">Contacto</a></li><li><a href="#" data-wa="float">WhatsApp <span data-contact="wa-display">${esc(C.whatsappDisplay)}</span></a></li><li><a href="#" data-contact="mail"><span data-contact="mail-display">${esc(C.email)}</span></a></li></ul></div>
    <div class="ftr-cities"><span data-i18n="ft.cities">Ciudades con entrega rápida:</span> ${D.CITIES.map(c => `<a href="${base}bolsas-plasticas-${c.slug}/">Bolsas plásticas en ${esc(c.name)}</a>`).join(" ")}</div>`;
}

function orgLd() {
  return {
    "@type": "LocalBusiness", "@id": `${SITE}/#org`, name: C.brand, url: `${SITE}/`,
    logo: `${SITE}/assets/icons/icon-512.png`, image: `${SITE}/assets/og-image.jpg`,
    description: "Fabricación y venta de bolsas plásticas personalizadas: camiseta, troqueladas, manija flexible, ecológicas TNT, papel, rollos e industriales. Entrega en el Eje Cafetero y envíos a toda Colombia.",
    telephone: C.phoneDisplay, email: C.email, priceRange: "$$", currenciesAccepted: "COP",
    address: { "@type": "PostalAddress", addressLocality: C.city, addressRegion: C.region, addressCountry: "CO" },
    geo: { "@type": "GeoCoordinates", latitude: C.geo.lat, longitude: C.geo.lng },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "13:00" }],
    areaServed: [{ "@type": "Country", name: "Colombia" }]
      .concat(D.DEPARTMENTS.map(d => ({ "@type": "State", name: d.name })))
      .concat(D.CITIES.map(c => ({ "@type": "City", name: c.name }))),
    hasOfferCatalog: { "@type": "OfferCatalog", name: "Bolsas personalizadas",
      itemListElement: D.PRODUCTS.map(p => ({ "@type": "Offer", itemOffered: { "@type": "Product", name: p.es.name, description: p.es.desc, url: `${SITE}/${p.slug}/` } })) },
    sameAs: Object.values(C.social || {}).filter(Boolean)
  };
}
const faqLd = list => ({ "@type": "FAQPage", mainEntity: list.map(f => ({ "@type": "Question", name: f.q.es || f.q, acceptedAnswer: { "@type": "Answer", text: f.a.es || f.a } })) });
const crumbLd = items => ({ "@type": "BreadcrumbList", itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it[0], item: it[1] })) });
const ldScript = graph => `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>`;

function page({ rel, title, desc, h1, crumbs, body, graph, base, noindex, ogImage }) {
  const canonical = `${SITE}/${rel}`;
  if (!noindex) urls.push(rel);
  const img = ogImage ? `${SITE}/assets/img/${ogImage}.webp` : `${SITE}/assets/og-image.jpg`;
  const crumbHtml = crumbs ? `<nav class="crumbs" aria-label="Migas de pan">${crumbs.map((c, i) => i < crumbs.length - 1 ? `<a href="${c[1]}">${esc(c[0])}</a><span aria-hidden="true">›</span>` : `<span>${esc(c[0])}</span>`).join("")}</nav>` : "";
  return `<!doctype html>
<html lang="es-CO" class="no-js" data-page="sub" data-base="${base}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="author" content="Dr. Mauricio Rodríguez Herrera">
<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}">
<link rel="canonical" href="${canonical}">
<meta name="geo.region" content="CO-QUI"><meta name="geo.placename" content="Armenia, Quindío">
<meta name="theme-color" content="#F6F7FB" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#070B18" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="website"><meta property="og:locale" content="es_CO"><meta property="og:site_name" content="${esc(C.brand)}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}"><meta property="og:image" content="${img}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${base}assets/icons/favicon.svg" type="image/svg+xml">
<link rel="icon" href="${base}assets/icons/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${base}assets/icons/apple-touch-icon.png">
<link rel="manifest" href="${base}site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${base}css/styles.css">
<script>(function(){try{var t=localStorage.getItem("bv-theme");if(t)document.documentElement.setAttribute("data-theme",t);}catch(e){}})();</script>
${graph ? ldScript(graph) : ""}
</head>
<body>
<a class="skip" href="#main">Saltar al contenido</a>
<header class="hdr">
  <div class="wrap hdr-in">
    <a class="brand" href="${base}" aria-label="${esc(C.brand)}, inicio">${LOGO("lg")}<span class="brand-txt">Plásticos<b>JR</b></span></a>
    <nav class="nav" id="nav" aria-label="Principal">
      <a href="${base}#productos">Productos</a><a href="${base}#disena">Diseña tu bolsa</a><a href="${base}#medidas">Medidas</a>
      <a href="${base}#cobertura">Cobertura</a><a href="${base}#faq">Preguntas</a><a href="${base}#contacto">Contacto</a>
    </nav>
    <div class="hdr-actions">
      <button class="icon-btn" type="button" id="themeBtn" aria-label="Cambiar tema">
        <svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>
        <svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z"/></svg>
      </button>
      <a class="btn btn-primary btn-sm hdr-cta" href="${base}#disena">Cotizar</a>
      <button class="icon-btn burger" type="button" id="burger" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>
<main id="main">
<section class="page-hero"><div class="hero-bg" aria-hidden="true"></div><div class="wrap">${crumbHtml}${body}</div></section>
</main>
<footer class="ftr">
  <div class="wrap ftr-grid">
    <div class="ftr-brand"><a class="brand" href="${base}">${LOGO("lgf")}<span class="brand-txt">Plásticos<b>JR</b></span></a>
      <p>Bolsas plásticas, ecológicas y de papel personalizadas para negocios del Eje Cafetero y de toda Colombia.</p></div>
    ${footer(base)}
  </div>
  <div class="wrap ftr-bottom"><p>© <span id="year">${new Date().getFullYear()}</span> ${esc(C.brand)} · <a href="${base}politicas.html">Políticas y privacidad</a></p><p>Hecho en el Eje Cafetero · Colombia</p></div>
</footer>
<a class="wa-float" href="${waHref("¡Hola Plásticos JR! Vengo de su página web y quiero información sobre sus bolsas.")}" data-wa="float" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.8 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1a17 17 0 0 1-1.7-.6 13.4 13.4 0 0 1-5.2-4.6 5.9 5.9 0 0 1-1.2-3.1 3.4 3.4 0 0 1 1-2.5 1.1 1.1 0 0 1 .8-.4h.6c.2 0 .4 0 .7.5l1 2.4a.6.6 0 0 1 0 .6 2.3 2.3 0 0 1-.4.6l-.5.6c-.2.2-.3.3-.1.7a8.6 8.6 0 0 0 1.6 2 7.9 7.9 0 0 0 2.3 1.4c.3.1.5.1.7-.1l1-1.2c.2-.3.4-.3.7-.2l2.2 1.1c.3.2.5.2.6.4a2.7 2.7 0 0 1-.2 1.5Z"/></svg></a>
<script src="${base}js/config.js"></script>
<script src="${base}js/data.js"></script>
<script src="${base}js/render.js"></script>
<script src="${base}js/bag.js"></script>
<script src="${base}js/main.js"></script>
<script src="${base}js/assistant.js"></script>
</body>
</html>
`;
}

/* ---------- bloques reutilizables ---------- */
const sizeSpan = p => { const a = p.sizes[0], b = p.sizes[p.sizes.length - 1]; return [`${a[0]}×${a[1]}`, `${b[0]}×${b[1]} cm`]; };
const productMini = base => `<div class="mini-grid">${D.PRODUCTS.map(p => `<a class="mini-card" href="${base}${p.slug}/"><img src="${base}assets/img/${p.images[0]}.webp" alt="${esc(p.es.name)} personalizada" loading="lazy" decoding="async" width="300" height="300"><span>${esc(p.es.name)}</span></a>`).join("")}</div>`;
const ctaBand = (base, title, text, waMsg, q) => `<div class="cta-band"><div><h2>${title}</h2><p>${text}</p></div><div class="hero-cta" style="margin:0"><a class="btn btn-ghost btn-lg" href="${base}${q || ""}#disena">Diseñar mi bolsa →</a><a class="btn btn-wa btn-lg" href="${waHref(waMsg)}" data-wa="hero" data-wa-msg="${esc(waMsg)}" target="_blank" rel="noopener">${WA_ICON} WhatsApp</a></div></div>`;
const faqBlock = list => `<div class="faq-list" style="margin-top:1rem">${R.faq("es", list)}</div>`;
const section = (title, inner) => `<div class="prose" style="max-width:none;margin-top:3rem"><h2>${title}</h2>${inner}</div>`;

/* ---------- index.html: contenido estático ---------- */
function fillIndex() {
  const file = path.join(ROOT, "index.html");
  let html = fs.readFileSync(file, "utf8");
  const sec = R.sectors("es");
  const graph = [{ "@type": "WebSite", "@id": `${SITE}/#web`, url: `${SITE}/`, name: C.brand, inLanguage: "es-CO", publisher: { "@id": `${SITE}/#org` } }, orgLd(), faqLd(D.FAQ)];
  const blocks = {
    jsonld: ldScript(graph),
    sectors: sec + sec.replace(/<li /g, '<li aria-hidden="true" '),
    products: R.products("es", ""), sizes: R.sizes("es", ""), map: R.map("", ""), coverage: R.coverage(""),
    galfilters: R.galleryFilters("es"), gallery: R.gallery("es", ""), faq: R.faq("es"), footer: footer("")
  };
  for (const [k, v] of Object.entries(blocks)) {
    const re = new RegExp(`<!--@${k}-->[\\s\\S]*?<!--/@${k}-->`);
    if (!re.test(html)) { console.warn("Falta el marcador", k); continue; }
    html = html.replace(re, () => `<!--@${k}-->${v}<!--/@${k}-->`);
  }
  fs.writeFileSync(file, html);
  urls.unshift("");
}

/* ---------- productos ---------- */
function productPages() {
  D.PRODUCTS.forEach(p => {
    const base = "../", L = p.es, [from, to] = sizeSpan(p);
    const waMsg = `¡Hola Plásticos JR! Quiero cotizar ${L.name.toLowerCase()} con mi logo.`;
    const faqs = [
      { q: `¿Cuál es el pedido mínimo de ${L.name.toLowerCase()}?`, a: `Como referencia, desde ${p.min.toLocaleString("es-CO")} unidades. El mínimo exacto depende de la medida, el calibre y la impresión; escríbenos y te lo confirmamos.` },
      { q: `¿Qué medidas de ${L.name.toLowerCase()} fabrican?`, a: `Manejamos ${p.sizes.map(s => `${s[0]}×${s[1]} cm`).join(", ")}. Si necesitas una bolsa más grande o con fuelle, la cotizamos como medida especial.` },
      D.FAQ[4], D.FAQ[6]
    ];
    const body = `<div class="page-grid">
  <div>
    <p class="kicker">Catálogo · ${p.reusable ? "Reutilizable" : "Bolsas personalizadas"}</p>
    <h1>${esc(L.name)} personalizada con tu logo</h1>
    <p class="lead">${esc(L.desc)}</p>
    <ul class="facts">
      <li><b>${from} – ${to}</b><span>Medidas estándar</span></li>
      <li><b>${p.calibres.join(" · ")}</b><span>${p.calLabel ? "Gramaje" : "Calibres"}</span></li>
      <li><b>${Math.max(...p.prints) >= 4 ? "1 a 4 tintas" : "1 a 2 tintas"}</b><span>Impresión</span></li>
      <li><b>${p.min.toLocaleString("es-CO")} und.</b><span>Mínimo de referencia</span></li>
    </ul>
    <div class="hero-cta"><a class="btn btn-primary btn-lg" href="${base}?tipo=${p.id}#disena">Diseñar esta bolsa →</a><a class="btn btn-wa btn-lg" href="${waHref(waMsg)}" data-wa="hero" data-wa-msg="${esc(waMsg)}" target="_blank" rel="noopener">${WA_ICON} Cotizar</a></div>
  </div>
  <div>
    <figure class="page-figure"><img src="${base}assets/img/${p.images[0]}.webp" alt="${esc(L.name)} impresa con logo" width="600" height="630"></figure>
    ${p.images.length > 1 ? `<div class="thumbs">${p.images.slice(1).map(i => `<img src="${base}assets/img/${i}.webp" alt="${esc(L.name)} – referencia" loading="lazy" width="200" height="200">`).join("")}</div>` : ""}
  </div>
</div>
${section(`Usos ideales de la ${esc(L.name.toLowerCase())}`, `<ul>${L.uses.map(u => `<li>${esc(u)}</li>`).join("")}</ul><p><b>Material:</b> ${esc(L.material)}.</p>`)}
${section("Medidas disponibles", `<div class="table-wrap"><table class="size-table"><thead><tr><th>Centímetros</th><th>Pulgadas</th><th></th></tr></thead><tbody>${p.sizes.map(s => `<tr><td><strong>${s[0]} × ${s[1]} cm</strong></td><td>${D.cmToIn(s[0])} × ${D.cmToIn(s[1])}″</td><td><a class="link-try" href="${base}?tipo=${p.id}&amp;w=${s[0]}&amp;h=${s[1]}#disena">Probar →</a></td></tr>`).join("")}</tbody></table></div><p class="hint">¿Necesitas una bolsa más grande o con fuelle? La cotizamos como medida especial.</p>`)}
${section("Colores disponibles", `<div class="swatches">${p.colors.map(k => `<span class="sw${D.COLORS[k].clear ? " clear" : ""}" style="--c:${D.COLORS[k].hex}" title="${D.COLORS[k].es}" role="img" aria-label="${D.COLORS[k].es}"></span>`).join("")}</div><p class="hint">${p.colors.map(k => D.COLORS[k].es).join(" · ")}. Impresión en tintas planas o full color según el tipo.</p>`)}
${section(`${esc(L.name)} con entrega en el Eje Cafetero`, `<p>Entregamos ${esc(L.name.toLowerCase())} en todo el Quindío y despachamos a Risaralda, Caldas, el Valle del Cauca, el Tolima y toda Colombia.</p><ul class="city-links">${D.CITIES.filter(c => c.featured || c.dept === "quindio").map(c => `<li><a href="${base}bolsas-plasticas-${c.slug}/">${esc(c.name)}</a></li>`).join("")}</ul>`)}
${section("Preguntas frecuentes", faqBlock(faqs))}
${section("Otros tipos de bolsa", productMini(base))}
${ctaBand(base, `Cotiza tu ${esc(L.name.toLowerCase())}`, "Súbenos tu logo, elige medida y cantidad, y recibe tu cotización con boceto.", waMsg, `?tipo=${p.id}`)}`;
    const rel = `${p.slug}/`;
    write(`${p.slug}/index.html`, page({
      rel, base, ogImage: p.images[0],
      title: `${L.name} Personalizada con Logo · Armenia y Eje Cafetero | ${C.brand}`,
      desc: `${L.name} personalizada con tu logo: ${L.short} Medidas de ${from} a ${to}. Entrega en Quindío, Risaralda, Caldas, Valle y toda Colombia.`,
      crumbs: [["Inicio", base], ["Productos", `${base}#productos`], [L.name, ""]],
      body,
      graph: [crumbLd([["Inicio", `${SITE}/`], ["Productos", `${SITE}/#productos`], [L.name, `${SITE}/${rel}`]]),
        { "@type": "Service", name: `${L.name} personalizada`, serviceType: "Fabricación de bolsas personalizadas", description: L.desc, provider: { "@id": `${SITE}/#org`, "@type": "LocalBusiness", name: C.brand }, areaServed: D.DEPARTMENTS.map(d => ({ "@type": "State", name: d.name })), image: `${SITE}/assets/img/${p.images[0]}.webp` },
        faqLd(faqs)]
    }));
  });
}

/* ---------- ciudades ---------- */
function cityPages() {
  D.CITIES.forEach(c => {
    const d = deptOf(c), base = "../", eta = D.ZONES[c.zone].es;
    const near = D.CITIES.filter(x => x.slug !== c.slug && (x.dept === c.dept || x.featured));
    const waMsg = `¡Hola Plásticos JR! Estoy en ${c.name} (${d.name}) y quiero cotizar bolsas personalizadas.`;
    const faqs = [
      { q: `¿Cuánto tarda la entrega de bolsas en ${c.name}?`, a: `La producción toma aprox. 8 a 15 días hábiles después de aprobar el boceto. El envío a ${c.name}: ${eta.toLowerCase()}.` },
      { q: `¿Cuál es el pedido mínimo de bolsas personalizadas en ${c.name}?`, a: "Como referencia, las bolsas plásticas impresas desde 1.000 unidades, y las ecológicas TNT y de papel desde 200–300 unidades. Te confirmamos el mínimo exacto para tu pedido." },
      { q: `¿Cómo envío mi logo desde ${c.name}?`, a: "Súbelo en el diseñador de la página para ver cómo queda tu bolsa, y envíanoslo por WhatsApp o correo. Te devolvemos un boceto digital para aprobar antes de producir." },
      D.FAQ[6]
    ];
    const dist = c.km ? `~${c.km} km` : "Base";
    const body = `<div class="page-grid">
  <div>
    <p class="kicker">Bolsas plásticas en ${esc(d.name)}</p>
    <h1>Bolsas plásticas personalizadas en ${esc(c.name)}</h1>
    <p class="lead">${esc(c.blurb)} Fabricamos bolsas camiseta, troqueladas, de manija flexible, ecológicas TNT, de papel, en rollo e industriales con el logo de tu negocio.</p>
    <ul class="facts">
      <li><b>${esc(eta)}</b><span>Entrega en ${esc(c.name)}</span></li>
      <li><b>${dist}</b><span>${c.km ? "Desde Armenia, Quindío" : "Despachamos desde aquí"}</span></li>
      <li><b>6×11 – 20×30 cm</b><span>Línea estándar de medidas</span></li>
      <li><b>1 a 4 tintas</b><span>Impresión de tu logo</span></li>
    </ul>
    <div class="hero-cta"><a class="btn btn-primary btn-lg" href="${base}?ciudad=${c.slug}#disena">Diseñar mi bolsa →</a><a class="btn btn-wa btn-lg" href="${waHref(waMsg)}" data-wa="hero" data-wa-msg="${esc(waMsg)}" target="_blank" rel="noopener">${WA_ICON} Cotizar en ${esc(c.name)}</a></div>
  </div>
  <div class="cov-map-wrap">${R.map(base, c.slug)}</div>
</div>
${section(`Bolsas que más piden los negocios de ${esc(c.name)}`, productMini(base))}
${section(`¿Por qué pedir tus bolsas en ${esc(c.name)} con ${esc(C.brand)}?`, `<ul>
  <li><b>${c.zone === 1 ? "Entrega directa" : "Rutas frecuentes"}:</b> ${c.zone === 1 ? `somos del Quindío y llegamos a ${esc(c.name)} sin intermediarios.` : `despachamos a ${esc(c.name)} con tiempos de ${esc(eta.toLowerCase())}.`}</li>
  <li><b>Boceto antes de producir:</b> apruebas medidas, colores y ubicación del logo antes de fabricar.</li>
  <li><b>Diseñador en línea:</b> prueba tu bolsa con tu logo y compárala a tamaño real.</li>
  <li><b>Asesoría Ley 2232 de 2022:</b> te orientamos hacia bolsas reutilizables, de papel, TNT o para alimentos según tu negocio.</li>
</ul>`)}
${section(`Preguntas sobre bolsas en ${esc(c.name)}`, faqBlock(faqs))}
${section("También entregamos en", `<ul class="city-links">${near.map(x => `<li><a href="${base}bolsas-plasticas-${x.slug}/">${esc(x.name)}</a></li>`).join("")}<li><a href="${base}${d.slug}/">Todo ${esc(d.name)}</a></li></ul>`)}
${ctaBand(base, `Cotiza tus bolsas en ${esc(c.name)}`, "Envíanos tu logo y la cantidad: te respondemos con cotización y boceto.", waMsg, `?ciudad=${c.slug}`)}`;
    const rel = `bolsas-plasticas-${c.slug}/`;
    write(`${rel}index.html`, page({
      rel, base,
      title: `Bolsas Plásticas Personalizadas en ${c.name}, ${d.name} | ${C.brand}`,
      desc: `Bolsas plásticas personalizadas con tu logo en ${c.name}: camiseta, troqueladas, manija flexible, TNT, papel y rollos. ${eta}. Cotiza por WhatsApp.`,
      crumbs: [["Inicio", base], [d.name, `${base}${d.slug}/`], [c.name, ""]],
      body,
      graph: [crumbLd([["Inicio", `${SITE}/`], [d.name, `${SITE}/${d.slug}/`], [c.name, `${SITE}/${rel}`]]),
        { "@type": "Service", name: `Bolsas plásticas personalizadas en ${c.name}`, serviceType: "Fabricación y entrega de bolsas plásticas personalizadas", provider: { "@id": `${SITE}/#org`, "@type": "LocalBusiness", name: C.brand }, areaServed: { "@type": "City", name: c.name, containedInPlace: { "@type": "State", name: d.name } } },
        faqLd(faqs)]
    }));
  });
}

/* ---------- departamentos ---------- */
function deptPages() {
  D.DEPARTMENTS.forEach(d => {
    const base = "../", cs = D.CITIES.filter(c => c.dept === d.id);
    const waMsg = `¡Hola Plásticos JR! Quiero cotizar bolsas personalizadas en ${d.name}.`;
    const body = `<div class="page-grid">
  <div>
    <p class="kicker">Cobertura · Zona ${d.zone}</p>
    <h1>Bolsas plásticas personalizadas en ${esc(d.name)}</h1>
    <p class="lead">${esc(d.blurb)}</p>
    <ul class="facts"><li><b>${cs.length}</b><span>Ciudades con página propia</span></li><li><b>${esc(D.ZONES[d.zone].es)}</b><span>Tiempo de envío aprox.</span></li><li><b>8</b><span>Tipos de bolsa</span></li></ul>
    <div class="hero-cta"><a class="btn btn-primary btn-lg" href="${base}#disena">Diseñar mi bolsa →</a><a class="btn btn-wa btn-lg" href="${waHref(waMsg)}" data-wa="hero" data-wa-msg="${esc(waMsg)}" target="_blank" rel="noopener">${WA_ICON} WhatsApp</a></div>
  </div>
  <div class="cov-map-wrap">${R.map(base, "")}</div>
</div>
${section(`Ciudades de ${esc(d.name)} donde entregamos`, `<div class="cov-list" style="margin:1rem 0">${cs.map(c => `<a class="cov-group" href="${base}bolsas-plasticas-${c.slug}/" style="color:inherit;text-decoration:none"><h3>${esc(c.name)} <span class="zone z${c.zone}">${c.zone}</span></h3><p class="hint" style="margin:0">${esc(D.ZONES[c.zone].es)}${c.km ? ` · ~${c.km} km` : ""}</p></a>`).join("")}</div>`)}
${section("Nuestras bolsas", productMini(base))}
${section(`Preguntas frecuentes en ${esc(d.name)}`, faqBlock([D.FAQ[0], D.FAQ[2], D.FAQ[3], D.FAQ[6]]))}
${ctaBand(base, `Bolsas personalizadas en ${esc(d.name)}`, "Te asesoramos para elegir el tipo de bolsa ideal para tu negocio.", waMsg)}`;
    const rel = `${d.slug}/`;
    write(`${rel}index.html`, page({
      rel, base,
      title: `Bolsas Plásticas Personalizadas en ${d.name} | ${C.brand}`,
      desc: `Fábrica de bolsas plásticas personalizadas con entrega en ${d.name}: ${cs.map(c => c.name).slice(0, 6).join(", ")} y más. Camiseta, troqueladas, TNT, papel y rollos.`,
      crumbs: [["Inicio", base], ["Cobertura", `${base}#cobertura`], [d.name, ""]],
      body,
      graph: [crumbLd([["Inicio", `${SITE}/`], ["Cobertura", `${SITE}/#cobertura`], [d.name, `${SITE}/${rel}`]]),
        { "@type": "Service", name: `Bolsas plásticas personalizadas en ${d.name}`, serviceType: "Fabricación y entrega de bolsas plásticas personalizadas", provider: { "@id": `${SITE}/#org`, "@type": "LocalBusiness", name: C.brand }, areaServed: { "@type": "State", name: d.name } },
        faqLd([D.FAQ[0], D.FAQ[2], D.FAQ[3], D.FAQ[6]])]
    }));
  });
}

/* ---------- toda Colombia ---------- */
function colombiaPage() {
  const base = "../", waMsg = "¡Hola Plásticos JR! Quiero cotizar bolsas personalizadas con envío a mi ciudad.";
  const rows = D.DEPARTMENTS.map(d => [d.name, d.zone, `${base}${d.slug}/`]).concat(D.OTHER_REGIONS.map(r => [r[0], r[1], ""]))
    .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0], "es"));
  const body = `<div class="page-grid">
  <div>
    <p class="kicker">Cobertura nacional</p>
    <h1>Bolsas plásticas personalizadas con envío a toda Colombia</h1>
    <p class="lead">Somos especialistas en el Eje Cafetero, pero despachamos bolsas camiseta, troqueladas, de manija flexible, ecológicas TNT, de papel, en rollo e industriales a cualquier ciudad del país por transportadora.</p>
    <div class="hero-cta"><a class="btn btn-primary btn-lg" href="${base}#disena">Diseñar mi bolsa →</a><a class="btn btn-wa btn-lg" href="${waHref(waMsg)}" data-wa="hero" data-wa-msg="${esc(waMsg)}" target="_blank" rel="noopener">${WA_ICON} WhatsApp</a></div>
  </div>
  <div class="cov-map-wrap">${R.map(base, "")}</div>
</div>
${section("Tiempos de envío por departamento", `<div class="table-wrap"><table class="size-table"><thead><tr><th>Departamento</th><th>Zona</th><th>Envío aprox. (después de producción)</th></tr></thead><tbody>${rows.map(r => `<tr><td><strong>${r[2] ? `<a href="${r[2]}">${esc(r[0])}</a>` : esc(r[0])}</strong></td><td><span class="zone z${r[1]}">${r[1]}</span></td><td>${esc(D.ZONES[r[1]].es)}</td></tr>`).join("")}</tbody></table></div>`)}
${section("Nuestras bolsas", productMini(base))}
${ctaBand(base, "¿En qué ciudad estás?", "Cuéntanos y te damos el tiempo de entrega exacto con tu cotización.", waMsg)}`;
  write("bolsas-plasticas-colombia/index.html", page({
    rel: "bolsas-plasticas-colombia/", base,
    title: `Bolsas Plásticas Personalizadas con Envío a Toda Colombia | ${C.brand}`,
    desc: "Bolsas plásticas personalizadas con tu logo y envío a toda Colombia: Bogotá, Medellín, Cali, Barranquilla y más. Especialistas en el Eje Cafetero.",
    crumbs: [["Inicio", base], ["Toda Colombia", ""]], body,
    graph: [crumbLd([["Inicio", `${SITE}/`], ["Toda Colombia", `${SITE}/bolsas-plasticas-colombia/`]])]
  }));
}

/* ---------- políticas, gracias, 404 ---------- */
function staticPages() {
  const pol = `<div class="prose-legal">
<p class="kicker">Legal</p><h1>Políticas y privacidad</h1>
<p class="hint">Última actualización: ${TODAY}. Los datos entre [corchetes] los completa el propietario del negocio.</p>
<h2>1. Responsable del tratamiento de datos</h2>
<p>${esc(C.brand)} · [Razón social] · NIT [número] · ${esc(C.city)}, ${esc(C.region)}, Colombia · Correo: <a href="mailto:${esc(C.email)}">${esc(C.email)}</a> · WhatsApp: ${esc(C.whatsappDisplay)}.</p>
<h2>2. Datos que recogemos y para qué</h2>
<p>Cuando nos escribes por WhatsApp, correo o el formulario, recogemos tu nombre, teléfono, correo, ciudad, negocio y los archivos de diseño que nos envíes. Los usamos únicamente para responder tu solicitud, elaborar cotizaciones y bocetos, producir y entregar tu pedido, y darte servicio posventa.</p>
<p>El diseñador de bolsas funciona en tu navegador: el logo que subes para la vista previa no se envía a ningún servidor; solo lo recibimos si tú nos lo mandas. Tu borrador y tus preferencias (tema e idioma) se guardan en tu propio navegador.</p>
<h2>3. Tus derechos (Ley 1581 de 2012)</h2>
<p>Puedes conocer, actualizar, rectificar y suprimir tus datos, revocar la autorización y presentar quejas ante la Superintendencia de Industria y Comercio. Para ejercerlos, escríbenos a ${esc(C.email)}; respondemos en los plazos de ley.</p>
<h2>4. Diseños y marcas de los clientes</h2>
<p>Los logos y diseños que nos envías siguen siendo de su titular. Solo los usamos para producir tu pedido. Al enviarlos declaras tener derecho a usarlos. Las fotos de la galería son imágenes de referencia de estilos y acabados.</p>
<h2>5. Cotizaciones, pedidos y entregas</h2>
<p>Las cotizaciones tienen la vigencia indicada en cada una. La producción inicia con el boceto aprobado y el anticipo acordado. Los tiempos de producción y transporte publicados son aproximados. Por ser productos personalizados, revisa con cuidado el boceto: los colores impresos pueden variar ligeramente respecto a la pantalla.</p>
<h2>6. Garantía y reclamos (Ley 1480 de 2011)</h2>
<p>Si tu pedido llega con defectos de fabricación o no corresponde al boceto aprobado, escríbenos dentro de los [5] días hábiles siguientes a la entrega con fotos del producto y lo solucionamos.</p>
<h2>7. Normativa ambiental</h2>
<p>La información sobre la Ley 2232 de 2022 publicada en este sitio es orientativa y no constituye asesoría legal. Cada negocio es responsable de verificar el uso permitido de sus empaques.</p>
</div>`;
  write("politicas.html", page({ rel: "politicas.html", base: "", title: `Políticas y privacidad | ${C.brand}`, desc: `Tratamiento de datos personales, términos de cotización, pedidos y garantía de ${C.brand}.`, crumbs: [["Inicio", "./"], ["Políticas", ""]], body: pol }));
  write("gracias.html", page({ rel: "gracias.html", base: "", noindex: true, title: `¡Gracias! | ${C.brand}`, desc: "Recibimos tu solicitud.", body: `<div class="prose center" style="margin:3rem auto"><p class="kicker">Solicitud recibida</p><h1>¡Gracias! Ya tenemos tu solicitud 🙌</h1><p class="lead">Te responderemos pronto con tu cotización y el boceto para aprobar. Si es urgente, escríbenos por WhatsApp.</p><div class="hero-cta" style="justify-content:center"><a class="btn btn-wa btn-lg" href="#" data-wa="float" target="_blank" rel="noopener">${WA_ICON} WhatsApp</a><a class="btn btn-ghost btn-lg" href="./">Volver al inicio</a></div></div>` }));
  write("404.html", page({ rel: "404.html", base: BASEPATH, noindex: true, title: `Página no encontrada | ${C.brand}`, desc: "La página que buscas no existe.", body: `<div class="prose center" style="margin:3rem auto"><p class="kicker">Error 404</p><h1>Esta bolsa se nos perdió 🛍️</h1><p class="lead">La página que buscas no existe o cambió de dirección. Prueba desde el inicio o diseña tu bolsa.</p><div class="hero-cta" style="justify-content:center"><a class="btn btn-primary btn-lg" href="${BASEPATH}#disena">Diseñar mi bolsa</a><a class="btn btn-ghost btn-lg" href="${BASEPATH}">Ir al inicio</a></div></div>` }));
}

/* ---------- sitemap + robots ---------- */
function sitemap() {
  const prio = rel => rel === "" ? "1.0" : D.PRODUCTS.some(p => rel === `${p.slug}/`) || D.DEPARTMENTS.some(d => rel === `${d.slug}/`) ? "0.8"
    : D.CITIES.some(c => c.featured && rel === `bolsas-plasticas-${c.slug}/`) ? "0.8" : rel === "politicas.html" ? "0.3" : "0.7";
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE}/${u}</loc><lastmod>${TODAY}</lastmod><priority>${prio(u)}</priority></url>`).join("\n")}
</urlset>
`;
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml);
  fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
}

fillIndex();
productPages();
deptPages();
cityPages();
colombiaPage();
staticPages();
sitemap();
console.log(`Listo: ${urls.length} URLs en el sitemap (${D.PRODUCTS.length} productos, ${D.DEPARTMENTS.length} departamentos, ${D.CITIES.length} ciudades).`);
