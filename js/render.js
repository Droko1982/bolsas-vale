/* ==========================================================================
   Plásticos JR — plantillas compartidas (navegador + scripts/build.mjs)
   Producen el HTML de productos, preguntas, medidas, sectores, galería y
   cobertura. El generador las usa para dejar el contenido estático (SEO) y el
   navegador las vuelve a usar al cambiar de idioma.
   ========================================================================== */
(function (root) {
  "use strict";
  const D = root.BV_DATA;

  const T = {
    es: { design: "Diseñar", details: "Ver detalles", reusable: "Reutilizable", min: "Mín. ref.", units: "und.",
          sizes: "Medidas", inks: "Hasta 4 tintas", inks2: "Hasta 2 tintas", plain: "Lisa o impresa",
          tryIt: "Probar", fits: "Ideal para", inch: "pulgadas", ref: "Imagen de referencia",
          cityPrefix: "Bolsas en", all: "Todas", zone: "Zona" },
    en: { design: "Design", details: "View details", reusable: "Reusable", min: "Ref. min.", units: "pcs",
          sizes: "Sizes", inks: "Up to 4 colors", inks2: "Up to 2 colors", plain: "Plain or printed",
          tryIt: "Try it", fits: "Great for", inch: "inches", ref: "Reference image",
          cityPrefix: "Bags in", all: "All", zone: "Zone" }
  };

  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const num = (n, lang) => n.toLocaleString(lang === "en" ? "en-US" : "es-CO");

  function sizeSpan(p) {
    const ws = p.sizes.map(s => s[0]), hs = p.sizes.map(s => s[1]);
    const a = p.sizes[0], b = p.sizes[p.sizes.length - 1];
    return { from: `${a[0]}×${a[1]}″`, to: `${b[0]}×${b[1]}″`, minW: Math.min(...ws), maxH: Math.max(...hs) };
  }

  function products(lang, base) {
    lang = lang || "es"; base = base || "";
    const t = T[lang];
    return D.PRODUCTS.map(p => {
      const L = p[lang], sp = sizeSpan(p), maxPrint = Math.max(...p.prints);
      return `<article class="pcard reveal" id="p-${p.id}">
  <a class="pcard-media" href="${base}${p.slug}/" aria-label="${esc(L.name)}">
    <img src="${base}assets/img/${p.images[0]}.webp" alt="${esc(L.name)} ${lang === "en" ? "with custom print" : "personalizada con logo"}" loading="lazy" decoding="async" width="400" height="500">
    ${p.reusable ? `<span class="badge badge-eco">♻ ${t.reusable}</span>` : ""}
  </a>
  <div class="pcard-body">
    <h3>${esc(L.name)}</h3>
    <p>${esc(L.short)}</p>
    <ul class="pcard-meta">
      <li><span aria-hidden="true">📏</span> ${sp.from} – ${sp.to}</li>
      <li><span aria-hidden="true">🎨</span> ${maxPrint >= 4 ? t.inks : t.inks2}</li>
      <li><span aria-hidden="true">📦</span> ${t.min} ${num(p.min, lang)} ${t.units}</li>
    </ul>
    <div class="pcard-actions">
      <a class="btn btn-sm btn-primary" href="${base}?tipo=${p.id}#disena" data-design="${p.id}">${t.design}</a>
      <a class="btn btn-sm btn-ghost" href="${base}${p.slug}/">${t.details}</a>
    </div>
  </div>
</article>`;
    }).join("\n");
  }

  function faq(lang, list) {
    lang = lang || "es";
    return (list || D.FAQ).map((f, i) => `<details class="faq-item"${i === 0 ? " open" : ""}>
  <summary><span class="faq-n">${String(i + 1).padStart(2, "0")}</span><span class="faq-q">${esc(f.q[lang] || f.q)}</span><span class="chev" aria-hidden="true"></span></summary>
  <div class="faq-a"><p>${esc(f.a[lang] || f.a)}</p></div>
</details>`).join("\n");
  }

  function sizes(lang, base) {
    lang = lang || "es"; base = base || "";
    const t = T[lang];
    return D.SIZE_GUIDE.map(s => `<tr>
  <td><strong>${s.w} × ${s.h}″</strong></td>
  <td>${D.inToCm(s.w)} × ${D.inToCm(s.h)} cm</td>
  <td>${esc(s[lang])}</td>
  <td><a class="link-try" href="${base}?w=${s.w}&amp;h=${s.h}#disena" data-size="${s.w}x${s.h}">${t.tryIt} →</a></td>
</tr>`).join("\n");
  }

  function sectors(lang) {
    lang = lang || "es";
    return D.SECTORS.map(s => `<li class="chip-sector"><span aria-hidden="true">${s.icon}</span>${esc(s[lang])}</li>`).join("");
  }

  function gallery(lang, base) {
    lang = lang || "es"; base = base || "";
    return D.GALLERY.map((g, i) => {
      const p = D.product(g.type);
      return `<figure class="gal-item reveal" data-type="${g.type}">
  <button type="button" class="gal-btn" data-index="${i}" aria-label="${esc(p[lang].name)} – ${T[lang].ref}">
    <img src="${base}assets/img/${g.src}.webp" alt="${esc(p[lang].name)} – ${T[lang].ref}" loading="lazy" decoding="async">
  </button>
  <figcaption>${esc(p[lang].name)}</figcaption>
</figure>`;
    }).join("\n");
  }

  function galleryFilters(lang) {
    lang = lang || "es";
    const used = [...new Set(D.GALLERY.map(g => g.type))];
    return `<button type="button" class="chip is-on" data-filter="all">${T[lang].all}</button>` +
      used.map(id => `<button type="button" class="chip" data-filter="${id}">${esc(D.product(id)[lang].name)}</button>`).join("");
  }

  function coverage(base) {
    base = base || "";
    return D.DEPARTMENTS.map(d => {
      const cs = D.CITIES.filter(c => c.dept === d.id);
      return `<div class="cov-group">
  <h3><a href="${base}${d.slug}/">${esc(d.name)}</a> <span class="zone z${d.zone}">${T.es.zone} ${d.zone}</span></h3>
  <ul>${cs.map(c => `<li><a href="${base}bolsas-plasticas-${c.slug}/">${esc(c.name)}</a></li>`).join("")}</ul>
</div>`;
    }).join("\n");
  }

  /* Mapa esquemático de cobertura (proyección simple lat/lng) */
  function map(base, highlight) {
    base = base || "";
    const POS = { armenia: [-10, 4, "end"], cartago: [-10, 4, "end"], calarca: [9, 18, "start"], ibague: [0, -12, "middle"] };
    const P = ([lat, lng]) => [10 + ((lng + 76.65) / 1.55) * 380, 10 + ((5.2 - lat) / 1.85) * 440];
    const [ax, ay] = P(D.COORDS.armenia);
    const r = n => Math.round(n * 10) / 10;
    let s = `<svg class="cov-map" viewBox="0 0 400 460" role="img" aria-label="Mapa de cobertura de Plásticos JR en el Eje Cafetero">
<defs><radialGradient id="covz"><stop offset="0" stop-color="var(--brand)" stop-opacity=".28"/><stop offset="1" stop-color="var(--brand)" stop-opacity=".04"/></radialGradient></defs>
<circle cx="${r(ax)}" cy="${r(ay)}" r="300" fill="var(--cyan)" fill-opacity=".05" stroke="var(--cyan)" stroke-opacity=".35" stroke-dasharray="4 6"/>
<circle cx="${r(ax)}" cy="${r(ay)}" r="165" fill="var(--cyan)" fill-opacity=".07" stroke="var(--cyan)" stroke-opacity=".5" stroke-dasharray="4 6"/>
<circle cx="${r(ax)}" cy="${r(ay)}" r="88" fill="url(#covz)" stroke="var(--brand)" stroke-opacity=".7" stroke-dasharray="4 5"/>
<g class="cov-dept" font-size="11" font-weight="800" letter-spacing="2" fill="currentColor" opacity=".38">
<text x="300" y="26">CALDAS</text><text x="150" y="66">RISARALDA</text><text x="300" y="232">QUINDÍO</text><text x="320" y="300">TOLIMA</text><text x="26" y="330">VALLE DEL CAUCA</text></g>`;
    D.CITIES.forEach(c => {
      const ll = D.COORDS[c.slug]; if (!ll) return;
      const [x, y] = P(ll), hub = c.slug === "armenia", on = c.slug === highlight;
      const big = hub || c.featured || on;
      s += `<a href="${base}bolsas-plasticas-${c.slug}/" class="cov-pt${on ? " is-on" : ""}"><title>${esc(c.name)} · ${c.km ? "~" + c.km + " km" : "base"}</title>
${hub ? `<circle cx="${r(x)}" cy="${r(y)}" r="14" class="pulse" fill="var(--brand)" fill-opacity=".25"/>` : ""}
<circle cx="${r(x)}" cy="${r(y)}" r="${hub ? 7 : big ? 5 : 3.4}" fill="${hub || on ? "var(--brand)" : c.zone === 1 ? "var(--brand)" : "var(--cyan)"}" stroke="var(--surface)" stroke-width="1.6"/>
${big ? `<text x="${r(x + (POS[c.slug] || [9])[0])}" y="${r(y + (POS[c.slug] || [0, 4])[1])}" text-anchor="${(POS[c.slug] || [0, 0, "start"])[2]}" font-size="${hub ? 14 : 12}" font-weight="800" fill="currentColor">${esc(c.name)}</text>` : ""}</a>`;
    });
    return s + "</svg>";
  }

  root.BVRender = { products, faq, sizes, sectors, gallery, galleryFilters, coverage, map, T, esc };
})(typeof window !== "undefined" ? window : globalThis);
