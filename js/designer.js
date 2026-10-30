/* ==========================================================================
   Plásticos JR — diseñador y cotizador en línea
   Estado → boceto SVG en vivo (js/bag.js) → resumen con código de referencia
   → WhatsApp / correo / PNG / compartir. Guarda el borrador en el navegador.
   ========================================================================== */
(function () {
  "use strict";
  const D = window.BV_DATA, B = window.BVBag, C = window.BV_CONFIG || {};
  const root = document.getElementById("designer");
  if (!root || !D || !B) return;

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const L = () => (window.BVI18n ? window.BVI18n.lang : "es");
  const store = { get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
                  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };

  const S = {
    es: { custom: "Personalizada", fits: "Ideal para", equiv: "equivale a", cal: "Calibre (grosor)", gram: "Gramaje", rec: "recomendado",
          units: "unidades", min: "mínimo de referencia", prod: "Producción", ship: "Envío", type: "Tipo", size: "Medida", color: "Color",
          handle: "Manija", calS: "Calibre", gramS: "Gramaje", print: "Impresión", inks: "Tintas", sides: "Caras", side1: "1 cara", side2: "2 caras",
          logo: "Logo", text: "Texto", qty: "Cantidad", city: "Entrega en", none: "—", attach: "lo adjunto en el chat",
          title: "🛍️ Cotización Plásticos JR", ref: "Ref.", inches: "pulgadas", hello: "¡Hola Plásticos JR! Quiero cotizar esta bolsa:",
          bigFile: "El archivo pesa más de 10 MB. Envíalo directamente por WhatsApp o correo.", noPreview: "Recibimos este formato; la vista previa no está disponible, pero lo adjuntas al enviar.",
          copied: "Resumen copiado. Pégalo en WhatsApp o en tu correo.", special: "Medida especial", proof: "Boceto de referencia · los colores pueden variar en impresión",
          other: "Otras regiones", featured: "Eje Cafetero y alrededores", choose: "Elige tu ciudad", subject: "Cotización de bolsas" },
    en: { custom: "Custom", fits: "Great for", equiv: "equals", cal: "Gauge (thickness)", gram: "Fabric weight", rec: "recommended",
          units: "units", min: "reference minimum", prod: "Production", ship: "Shipping", type: "Type", size: "Size", color: "Color",
          handle: "Handle", calS: "Gauge", gramS: "Weight", print: "Printing", inks: "Inks", sides: "Sides", side1: "1 side", side2: "2 sides",
          logo: "Logo", text: "Text", qty: "Quantity", city: "Deliver to", none: "—", attach: "I'll attach it in the chat",
          title: "🛍️ Plásticos JR quote", ref: "Ref.", inches: "inches", hello: "Hi Plásticos JR! I'd like a quote for this bag:",
          bigFile: "This file is over 10 MB. Please send it directly via WhatsApp or email.", noPreview: "We accept this format; preview isn't available, but attach it when you send.",
          copied: "Summary copied. Paste it in WhatsApp or your email.", special: "Custom size", proof: "Reference proof · printed colors may vary",
          other: "Other regions", featured: "Coffee Region & nearby", choose: "Choose your city", subject: "Bag quote" }
  };
  const t = k => S[L()][k];
  const num = n => Number(n).toLocaleString(L() === "en" ? "en-US" : "es-CO");

  /* ---------- estado ---------- */
  const saved = store.get("bv-design-cm") || {};
  const st = Object.assign({
    type: "troquelada", w: 16, h: 24, units: "cm", special: "", color: "fucsia", handle: "", cal: "3", print: 1,
    ink1: "blanco", ink2: "amarillo", sides: 1, text1: "", text2: "", qty: 1000, city: "Armenia, Quindío", dims: true
  }, saved);
  st.logo = { src: "", fileName: "", scale: 0.62, y: 0, color: false, white: true };
  st.file = null;
  st.ref = sessionStorage.getItem("bv-ref") || ("BV-" + Date.now().toString(36).slice(-4).toUpperCase() + Math.random().toString(36).slice(2, 4).toUpperCase());
  try { sessionStorage.setItem("bv-ref", st.ref); } catch (e) {}

  // parámetros en la URL (?tipo=, ?w=&h=, ?ciudad=)
  const q = new URLSearchParams(location.search);
  if (q.get("tipo") && D.PRODUCTS.some(p => p.id === q.get("tipo"))) applyType(q.get("tipo"), true);
  if (q.get("w") && q.get("h")) { st.w = clampW(+q.get("w")); st.h = clampH(+q.get("h")); }
  if (q.get("ciudad")) { const c = D.cityBySlug(q.get("ciudad")); if (c) st.city = `${c.name}, ${D.dept(c.dept).name}`; }

  function clampW(v) { return Math.min(D.SIZE_RANGE.maxW, Math.max(D.SIZE_RANGE.minW, v || 16)); }
  function clampH(v) { return Math.min(D.SIZE_RANGE.maxH, Math.max(D.SIZE_RANGE.minH, v || 24)); }
  const P = () => D.product(st.type);

  function applyType(id, quiet) {
    const p = D.product(id);
    st.type = p.id;
    if (!quiet || !saved.type) { st.w = p.def[0]; st.h = p.def[1]; }
    if (p.colors.indexOf(st.color) < 0) st.color = p.colors[0];
    if (!quiet || p.calibres.indexOf(st.cal) < 0) st.cal = p.defCal;
    if (p.prints.indexOf(st.print) < 0) st.print = p.prints.indexOf(1) >= 0 ? 1 : p.prints[0];
    if (st.qty < p.min) st.qty = p.min;
    if (p.shape === "lazo" && !st.handle) st.handle = st.color;
    fixInk();
  }
  function fixInk() {
    const bag = D.COLORS[st.color], ink = D.INKS[st.ink1];
    if (!bag || !ink || bag.clear) return;
    if (Math.abs(B.lum(bag.hex) - B.lum(ink.hex)) < 0.22) st.ink1 = B.lum(bag.hex) < 0.5 ? "blanco" : "negro";
  }

  /* ---------- construcción de controles ---------- */
  const el = {
    type: $("#typeGrid"), sizes: $("#sizeChips"), wR: $("#wRange"), hR: $("#hRange"), wO: $("#wOut"), hO: $("#hOut"), hint: $("#sizeHint"),
    colors: $("#colorSwatches"), colorName: $("#colorName"), handleWrap: $("#handleWrap"), handles: $("#handleSwatches"),
    cal: $("#calChips"), calLegend: $("#calLegend"), print: $("#printChips"), inkWrap: $("#inkWrap"), ink1: $("#ink1Swatches"),
    ink2Box: $("#ink2Box"), ink2: $("#ink2Swatches"), sides: $("#sidesRow"), file: $("#logoFile"), drop: $("#drop"),
    fileChip: $("#fileChip"), fileName: $("#fileName"), fileClear: $("#fileClear"), tools: $("#logoTools"),
    lScale: $("#lScale"), lPos: $("#lPos"), lWhite: $("#lWhite"), lColor: $("#lColor"), text1: $("#text1"), text2: $("#text2"),
    qty: $("#qtyChips"), qtyIn: $("#qtyInput"), city: $("#citySel"), eta: $("#eta"), stage: $("#stage"), compare: $("#compareSvg"),
    summary: $("#summary"), ref: $("#refCode"), dims: $("#showDims"), wa: $("#sendWa"), mail: $("#sendMail"), png: $("#dlPng"), share: $("#shareBtn")
  };

  function fmtSize(w, h) {
    return st.units === "in" ? `${D.cmToIn(w)} × ${D.cmToIn(h)}″` : `${w} × ${h} cm`;
  }
  function swatch(key, def, on, group) {
    const chk = def.clear || B.lum(def.hex) > 0.7 ? "#0E1530" : "#fff";
    return `<button type="button" class="sw${def.clear ? " clear" : ""}${on ? " is-on" : ""}" style="--c:${def.hex};--chk:${chk}" data-${group}="${key}" title="${def[L()]}" aria-label="${def[L()]}" aria-pressed="${on}"></button>`;
  }

  function buildTypes() {
    el.type.innerHTML = D.PRODUCTS.map(p => {
      const mini = B.render({ id: "mini-" + p.id, shape: p.shape, color: p.id === "papel" ? "kraft" : p.id === "industrial" ? "negro" : p.id === "tnt" ? "verde" : p.id === "camiseta" ? "amarillo" : p.id === "alimentos" ? "natural" : p.id === "flexible" ? "blanco" : "fucsia", handle: "rojo", w: p.def[0], h: p.def[1], print: 0 });
      return `<button type="button" class="type-opt${p.id === st.type ? " is-on" : ""}" data-type="${p.id}" aria-pressed="${p.id === st.type}"><span class="mini">${mini}</span>${p[L()].name}</button>`;
    }).join("");
  }

  function buildOptions() {
    const p = P(), lg = L();
    // medidas
    el.sizes.innerHTML = p.sizes.map(s => `<button type="button" class="chip${s[0] === st.w && s[1] === st.h ? " is-on" : ""}" data-size="${s[0]}x${s[1]}">${fmtSize(s[0], s[1])}</button>`).join("");
    // colores
    el.colors.innerHTML = p.colors.map(k => swatch(k, D.COLORS[k], k === st.color, "color")).join("");
    el.handleWrap.hidden = p.shape !== "lazo";
    if (p.shape === "lazo") el.handles.innerHTML = p.colors.map(k => swatch(k, D.COLORS[k], k === (st.handle || st.color), "handle")).join("");
    // calibre
    el.calLegend.textContent = p.calLabel ? t("gram") : t("cal");
    el.cal.innerHTML = p.calibres.map(c => `<button type="button" class="chip${c === st.cal ? " is-on" : ""}" data-cal="${c}">${c}${c === p.defCal ? ` <small>(${t("rec")})</small>` : ""}</button>`).join("");
    // impresión
    el.print.innerHTML = p.prints.map(i => `<button type="button" class="chip${i === st.print ? " is-on" : ""}" data-print="${i}">${D.PRINT[i][lg]}</button>`).join("");
    el.ink1.innerHTML = Object.keys(D.INKS).map(k => swatch(k, D.INKS[k], k === st.ink1, "ink1")).join("");
    el.ink2.innerHTML = Object.keys(D.INKS).map(k => swatch(k, D.INKS[k], k === st.ink2, "ink2")).join("");
    // cantidades
    const qs = D.QUANTITIES.filter(n => n >= p.min);
    if (qs[0] !== p.min) qs.unshift(p.min);
    el.qty.innerHTML = qs.map(n => `<button type="button" class="chip${n === st.qty ? " is-on" : ""}" data-qty="${n}">${num(n)}</button>`).join("");
    el.qtyIn.min = p.min;
    el.qtyIn.placeholder = `${t("min")}: ${num(p.min)}`;
  }

  function buildCities() {
    let h = `<option value="">${t("choose")}</option><optgroup label="${t("featured")}">`;
    D.DEPARTMENTS.forEach(d => { D.CITIES.filter(c => c.dept === d.id).forEach(c => { h += `<option value="${c.name}, ${d.name}">${c.name} · ${d.name}</option>`; }); });
    h += `</optgroup><optgroup label="${t("other")}">` + D.OTHER_REGIONS.map(r => `<option value="${r[0]}">${r[0]}</option>`).join("") + "</optgroup>";
    el.city.innerHTML = h;
    el.city.value = st.city;
  }

  function zoneOf(city) {
    if (!city) return null;
    const name = city.split(",")[0].trim();
    const c = D.CITIES.find(x => x.name === name);
    if (c) return c.zone;
    const r = D.OTHER_REGIONS.find(x => x[0] === city);
    return r ? r[1] : null;
  }

  /* ---------- sincronizar UI ---------- */
  function syncControls() {
    const p = P();
    $$(".type-opt", el.type).forEach(b => { const on = b.dataset.type === st.type; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on); });
    el.wR.value = st.w; el.hR.value = st.h;
    el.wO.textContent = st.units === "in" ? `${D.cmToIn(st.w)}″` : `${st.w} cm`;
    el.hO.textContent = st.units === "in" ? `${D.cmToIn(st.h)}″` : `${st.h} cm`;
    $$("[data-units]").forEach(b => b.classList.toggle("is-on", b.dataset.units === st.units));
    $$("[data-size]", el.sizes).forEach(b => { const [w, h] = b.dataset.size.split("x").map(Number); b.classList.toggle("is-on", w === st.w && h === st.h); });
    // pista de uso
    let best = D.SIZE_GUIDE[0], bd = 1e9;
    D.SIZE_GUIDE.forEach(g => { const d = Math.abs(g.w - st.w) + Math.abs(g.h - st.h) * 0.6; if (d < bd) { bd = d; best = g; } });
    el.hint.innerHTML = `${st.w} × ${st.h} cm ${t("equiv")} <b>${D.cmToIn(st.w)} × ${D.cmToIn(st.h)}″</b> · ${t("fits")}: ${best[L()].toLowerCase()}`;
    $$("[data-color]", el.colors).forEach(b => { const on = b.dataset.color === st.color; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on); });
    el.colorName.textContent = (D.COLORS[st.color] || {})[L()] || "";
    $$("[data-handle]", el.handles).forEach(b => b.classList.toggle("is-on", b.dataset.handle === (st.handle || st.color)));
    $$("[data-cal]", el.cal).forEach(b => b.classList.toggle("is-on", b.dataset.cal === st.cal));
    $$("[data-print]", el.print).forEach(b => b.classList.toggle("is-on", +b.dataset.print === st.print));
    el.inkWrap.hidden = st.print === 0 || st.print === 4;
    el.ink2Box.hidden = st.print < 2;
    el.sides.hidden = st.print === 0;
    $$("[data-sides]", el.sides).forEach(b => b.classList.toggle("is-on", +b.dataset.sides === st.sides));
    $$("[data-ink1]", el.ink1).forEach(b => b.classList.toggle("is-on", b.dataset.ink1 === st.ink1));
    $$("[data-ink2]", el.ink2).forEach(b => b.classList.toggle("is-on", b.dataset.ink2 === st.ink2));
    $$("[data-qty]", el.qty).forEach(b => b.classList.toggle("is-on", +b.dataset.qty === st.qty));
    el.tools.hidden = !st.logo.src;
    el.fileChip.hidden = !st.logo.fileName;
    el.fileName.textContent = st.logo.fileName ? "📎 " + st.logo.fileName : "";
    el.dims.checked = st.dims;
    if (el.text1.value !== st.text1) el.text1.value = st.text1;
    if (el.text2.value !== st.text2) el.text2.value = st.text2;
    const sp = $("#specialSize"); if (sp && document.activeElement !== sp && sp.value.trim() !== (st.special || "")) sp.value = st.special || "";
    if (el.city.value !== st.city) el.city.value = st.city;
    // tiempos
    const z = zoneOf(st.city);
    el.eta.innerHTML = `<div><span aria-hidden="true">🏭</span><span><b>${t("prod")}:</b> ${D.PRODUCTION[L()]}</span></div>` +
      (z ? `<div><span aria-hidden="true">🚚</span><span><b>${t("ship")}:</b> ${D.ZONES[z][L()]} <span class="zone z${z}">${z}</span></span></div>` : "");
  }

  function bagOpts(extra) {
    return Object.assign({
      id: "des", shape: P().shape, w: st.w, h: st.h, color: st.color, handle: st.handle, print: st.print,
      ink1: st.ink1, ink2: st.ink2, logo: { src: st.logo.src, scale: st.logo.scale, y: st.logo.y, color: st.logo.color || st.print >= 3, fileName: st.logo.src ? "" : st.logo.fileName },
      text1: st.text1, text2: st.text2, dims: st.dims, units: st.units, lang: L(), label: P()[L()].name
    }, extra || {});
  }

  function rows() {
    const p = P(), lg = L();
    const col = (D.COLORS[st.color] || {})[lg];
    const inks = st.print === 0 ? "" : st.print === 4 ? (lg === "en" ? "Full color" : "Policromía") :
      [st.ink1, st.print >= 2 ? st.ink2 : null].filter(Boolean).map(k => D.INKS[k][lg]).join(" + ") + (st.print === 3 ? " + 1" : "");
    const r = [
      [t("type"), p[lg].name],
      [t("size"), `${st.w} × ${st.h} cm (${D.cmToIn(st.w)} × ${D.cmToIn(st.h)}″)`],
      [t("color"), col + (p.shape === "lazo" && st.handle && st.handle !== st.color ? ` · ${t("handle")}: ${D.COLORS[st.handle][lg]}` : "")],
      [p.calLabel ? t("gramS") : t("calS"), st.cal],
      [t("print"), D.PRINT[st.print][lg] + (st.print ? ` · ${st.sides === 2 ? t("side2") : t("side1")}` : "")]
    ];
    if (st.special) r.splice(2, 0, [t("special"), st.special]);
    if (inks) r.push([t("inks"), inks]);
    if (st.text1 || st.text2) r.push([t("text"), [st.text1, st.text2].filter(Boolean).join(" / ")]);
    if (st.logo.fileName) r.push([t("logo"), st.logo.fileName]);
    r.push([t("qty"), `${num(st.qty)} ${t("units")}`]);
    if (st.city) r.push([t("city"), st.city]);
    return r;
  }

  function summaryText() {
    const lines = [`${t("title")} · ${t("ref")} ${st.ref}`].concat(rows().map(([k, v]) => `• ${k}: ${k === t("logo") ? `${v} (${t("attach")})` : v}`));
    return lines.join("\n");
  }

  let raf = 0;
  function render() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      syncControls();
      el.stage.innerHTML = B.render(bagOpts());
      el.compare.innerHTML = B.compare(st.w, st.h, L(), st.units);
      el.summary.innerHTML = rows().map(([k, v]) => `<dt>${k}</dt><dd>${B.esc(v)}</dd>`).join("");
      el.ref.textContent = st.ref;
      const app = window.BVApp;
      const msg = `${t("hello")}\n\n${summaryText()}`;
      el.wa.href = app ? app.waUrl(msg) : "#";
      el.mail.href = app ? app.mailUrl(`${t("subject")} · ${st.ref}`, summaryText()) : "#";
      const { logo, file, ...keep } = st;
      store.set("bv-design-cm", keep);
    });
  }

  /* ---------- logo ---------- */
  function readFile(f) {
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { alert(t("bigFile")); return; }
    st.file = f;
    st.logo.fileName = f.name;
    st.logo.src = "";
    st.logo.raw = "";
    const type = f.type || "";
    if (/^image\/(png|jpe?g|webp|gif)$/.test(type)) {
      const fr = new FileReader();
      fr.onload = () => { st.logo.raw = fr.result; processLogo(); };
      fr.readAsDataURL(f);
    } else if (type === "image/svg+xml" || /\.svg$/i.test(f.name)) {
      const fr = new FileReader();
      fr.onload = () => { st.logo.src = fr.result; render(); };
      fr.readAsDataURL(f);
    } else {
      render();
      el.hint.insertAdjacentHTML("afterend", "");
      setTimeout(() => { el.fileName.textContent = "📎 " + f.name + " · " + t("noPreview"); }, 50);
    }
  }
  function processLogo() {
    if (!st.logo.raw) return;
    const img = new Image();
    img.onload = () => {
      const max = 900, k = Math.min(1, max / Math.max(img.width, img.height));
      const cv = document.createElement("canvas");
      cv.width = Math.max(1, Math.round(img.width * k)); cv.height = Math.max(1, Math.round(img.height * k));
      const cx = cv.getContext("2d");
      cx.drawImage(img, 0, 0, cv.width, cv.height);
      if (st.logo.white) {
        const d = cx.getImageData(0, 0, cv.width, cv.height), a = d.data;
        for (let i = 0; i < a.length; i += 4) {
          const m = Math.min(a[i], a[i + 1], a[i + 2]);
          if (m > 238) a[i + 3] = 0;
          else if (m > 212) a[i + 3] = Math.round(a[i + 3] * (238 - m) / 26);
        }
        cx.putImageData(d, 0, 0);
      }
      st.logo.src = cv.toDataURL("image/png");
      render();
    };
    img.src = st.logo.raw;
  }

  /* ---------- PNG del boceto ---------- */
  function toPng(cb) {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    const svg = B.render(bagOpts({ id: "png", bg: dark ? "#0F162B" : "#F3F4FA" })).replace("<svg ", `<svg width="1000" height="1250" style="color:${dark ? "#DCE0F2" : "#1B2240"}" `).replace(/currentColor/g, dark ? "#DCE0F2" : "#1B2240");
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement("canvas"); cv.width = 1000; cv.height = 1250 + 330;
      const c = cv.getContext("2d");
      c.fillStyle = dark ? "#0F162B" : "#F3F4FA"; c.fillRect(0, 0, cv.width, cv.height);
      c.drawImage(img, 0, 0, 1000, 1250);
      c.fillStyle = "#E0177A"; c.fillRect(0, 1250, 1000, 8);
      c.fillStyle = dark ? "#F2F4FD" : "#0E1530";
      c.font = "800 38px 'Bricolage Grotesque', Arial, sans-serif";
      c.fillText(`Plásticos JR · ${t("ref")} ${st.ref}`, 50, 1316);
      c.font = "600 24px Manrope, Arial, sans-serif";
      const r = rows();
      r.slice(0, 8).forEach(([k, v], i) => {
        const x = i < 4 ? 50 : 520, y = 1366 + (i % 4) * 38;
        c.fillStyle = dark ? "#9AA2C4" : "#5C6385"; c.fillText(k + ":", x, y);
        c.fillStyle = dark ? "#F2F4FD" : "#0E1530"; c.fillText(String(v).slice(0, 26), x + c.measureText(k + ": ").width, y);
      });
      c.font = "600 18px Manrope, Arial, sans-serif"; c.fillStyle = dark ? "#9AA2C4" : "#5C6385";
      c.fillText(t("proof"), 50, 1545);
      cv.toBlob(b => cb(b), "image/png");
    };
    img.onerror = () => cb(null);
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  /* ---------- eventos ---------- */
  root.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b || !root.contains(b)) return;
    const d = b.dataset;
    if (d.type) { applyType(d.type); buildOptions(); }
    else if (d.size) { const [w, h] = d.size.split("x").map(Number); st.w = w; st.h = h; }
    else if (d.units) { st.units = d.units; buildOptions(); }
    else if (d.color) { st.color = d.color; if (P().shape === "lazo" && !st.handleTouched) st.handle = d.color; fixInk(); buildOptions(); }
    else if (d.handle) { st.handle = d.handle; st.handleTouched = true; }
    else if (d.cal) st.cal = d.cal;
    else if (d.print) { st.print = +d.print; }
    else if (d.ink1) st.ink1 = d.ink1;
    else if (d.ink2) st.ink2 = d.ink2;
    else if (d.sides) st.sides = +d.sides;
    else if (d.qty) { st.qty = +d.qty; el.qtyIn.value = ""; }
    else return;
    render();
  });
  el.wR.addEventListener("input", () => { st.w = +el.wR.value; render(); });
  el.hR.addEventListener("input", () => { st.h = +el.hR.value; render(); });
  el.text1.addEventListener("input", () => { st.text1 = el.text1.value; render(); });
  el.text2.addEventListener("input", () => { st.text2 = el.text2.value; render(); });
  $("#specialSize").addEventListener("input", e => { st.special = e.target.value.trim(); render(); });
  el.qtyIn.addEventListener("input", () => { const v = parseInt(el.qtyIn.value, 10); if (v > 0) { st.qty = v; render(); } });
  el.city.addEventListener("change", () => { st.city = el.city.value; render(); });
  el.dims.addEventListener("change", () => { st.dims = el.dims.checked; render(); });
  el.lScale.addEventListener("input", () => { st.logo.scale = +el.lScale.value; render(); });
  el.lPos.addEventListener("input", () => { st.logo.y = +el.lPos.value; render(); });
  el.lWhite.addEventListener("change", () => { st.logo.white = el.lWhite.checked; processLogo(); });
  el.lColor.addEventListener("change", () => { st.logo.color = el.lColor.checked; render(); });
  el.file.addEventListener("change", () => readFile(el.file.files[0]));
  el.fileClear.addEventListener("click", () => { st.logo = { src: "", fileName: "", scale: st.logo.scale, y: st.logo.y, color: false, white: true }; st.file = null; el.file.value = ""; el.lWhite.checked = true; render(); });
  ["dragenter", "dragover"].forEach(ev => el.drop.addEventListener(ev, e => { e.preventDefault(); el.drop.classList.add("is-over"); }));
  ["dragleave", "drop"].forEach(ev => el.drop.addEventListener(ev, e => { e.preventDefault(); el.drop.classList.remove("is-over"); }));
  el.drop.addEventListener("drop", e => { const f = e.dataTransfer && e.dataTransfer.files[0]; if (f) readFile(f); });

  el.png.addEventListener("click", () => toPng(b => {
    if (!b) return;
    const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `boceto-${st.ref}.png`;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }));
  el.share.addEventListener("click", () => {
    const text = `${t("hello")}\n\n${summaryText()}`;
    toPng(async b => {
      const files = [];
      if (b) files.push(new File([b], `boceto-${st.ref}.png`, { type: "image/png" }));
      if (st.file) files.push(st.file);
      try {
        if (navigator.canShare && files.length && navigator.canShare({ files })) { await navigator.share({ files, text, title: "Plásticos JR" }); return; }
        if (navigator.share) { await navigator.share({ text, title: "Plásticos JR" }); return; }
      } catch (e) { if (e && e.name === "AbortError") return; }
      try { await navigator.clipboard.writeText(text); alert(t("copied")); } catch (e) { prompt(t("copied"), text); }
    });
  });

  // enlaces de otras secciones que preseleccionan el diseñador
  document.addEventListener("click", e => {
    const a = e.target.closest("a[data-design], a[data-size]");
    if (!a || root.contains(a)) return;
    e.preventDefault();
    if (a.dataset.design) { applyType(a.dataset.design); buildOptions(); }
    if (a.dataset.size) { const [w, h] = a.dataset.size.split("x").map(Number); st.w = w; st.h = h; buildOptions(); }
    render();
    document.getElementById("disena").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });
  document.addEventListener("bv:lang", () => { buildTypes(); buildOptions(); buildCities(); render(); });

  // API para el asistente y el formulario
  window.BVDesigner = {
    summaryText,
    set(o) {
      if (o.type) applyType(o.type);
      if (o.w && o.h) { st.w = clampW(o.w); st.h = clampH(o.h); }
      if (o.city) st.city = o.city;
      buildOptions(); render();
      document.getElementById("disena").scrollIntoView({ behavior: "smooth" });
    },
    get state() { return st; }
  };

  buildTypes(); buildOptions(); buildCities(); render();
})();
