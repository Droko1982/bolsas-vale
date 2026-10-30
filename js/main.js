/* ==========================================================================
   Plásticos JR — comportamiento general del sitio
   Tema claro/oscuro, menú, contacto (WhatsApp/correo desde js/config.js),
   animaciones, bolsas del hero, galería con visor, formulario de contacto.
   ========================================================================== */
(function () {
  "use strict";
  const C = window.BV_CONFIG || {}, D = window.BV_DATA, R = window.BVRender;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const lang = () => (window.BVI18n ? window.BVI18n.lang : "es");
  const en = () => lang() === "en";
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
                  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  /* ---------- contacto ---------- */
  const MSG = {
    es: { hero: "¡Hola Plásticos JR! 👋 Quiero cotizar bolsas personalizadas para mi negocio.",
          float: "¡Hola Plásticos JR! Vengo de su página web y quiero información sobre sus bolsas.",
          contact: "¡Hola Plásticos JR! Quiero cotizar bolsas. ¿Me ayudan?" },
    en: { hero: "Hi Plásticos JR! 👋 I'd like a quote for custom bags for my business.",
          float: "Hi Plásticos JR! I found your website and would like information about your bags.",
          contact: "Hi Plásticos JR! I'd like a quote for bags. Can you help?" }
  };
  function waUrl(text) { return `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text || "")}`; }
  function mailUrl(subject, body) { return `mailto:${C.email}?subject=${encodeURIComponent(subject || "")}&body=${encodeURIComponent(body || "")}`; }
  function wireContacts() {
    $$("[data-wa]").forEach(a => {
      const custom = a.getAttribute("data-wa-msg");
      a.href = waUrl(custom || MSG[lang()][a.getAttribute("data-wa")] || MSG[lang()].float);
    });
    $$('[data-contact="mail"]').forEach(a => { a.href = mailUrl(en() ? "Bag quote request" : "Solicitud de cotización de bolsas", ""); });
    $$('[data-contact="wa-display"]').forEach(e => { e.textContent = C.whatsappDisplay; });
    $$('[data-contact="mail-display"]').forEach(e => { e.textContent = C.email; });
    $$('[data-contact="hours"]').forEach(e => { if (C.hours) e.textContent = C.hours[lang()] || C.hours.es; });
  }

  /* ---------- tema ---------- */
  function currentTheme() {
    const t = document.documentElement.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    store.set("bv-theme", t);
    const b = $("#themeBtn");
    if (b) b.setAttribute("aria-label", t === "dark" ? (en() ? "Switch to light mode" : "Cambiar a modo claro") : (en() ? "Switch to dark mode" : "Cambiar a modo oscuro"));
    $$('meta[name="theme-color"]').forEach(m => m.setAttribute("content", t === "dark" ? "#070B18" : "#F6F7FB"));
    document.dispatchEvent(new CustomEvent("bv:theme", { detail: { theme: t } }));
  }

  /* ---------- encabezado y menú ---------- */
  function header() {
    const hdr = $(".hdr"), burger = $("#burger"), nav = $("#nav");
    const onScroll = () => hdr && hdr.classList.toggle("is-scrolled", scrollY > 8);
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    if (burger && nav) {
      burger.addEventListener("click", () => {
        const open = !nav.classList.contains("is-open");
        nav.classList.toggle("is-open", open);
        burger.setAttribute("aria-expanded", String(open));
      });
      nav.addEventListener("click", e => { if (e.target.closest("a")) { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); } });
      document.addEventListener("keydown", e => { if (e.key === "Escape") { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); } });
    }
    // enlace activo según sección visible
    const links = $$('.nav a[href^="#"]');
    if ("IntersectionObserver" in window && links.length) {
      const map = new Map(links.map(a => [a.getAttribute("href").slice(1), a]));
      const io = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { links.forEach(l => l.classList.remove("is-active")); const a = map.get(e.target.id); if (a) a.classList.add("is-active"); }
      }), { rootMargin: "-45% 0px -50% 0px" });
      map.forEach((a, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
    }
  }

  /* ---------- aparición al hacer scroll ---------- */
  let revealIO;
  function reveal(root) {
    const els = $$(".reveal:not(.is-in)", root);
    if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("is-in")); return; }
    revealIO = revealIO || new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); revealIO.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach(e => revealIO.observe(e));
    // respaldo: si un salto de scroll se "salta" un elemento, se muestra igual
    if (!reveal.bound) {
      reveal.bound = true;
      let tick = 0;
      addEventListener("scroll", () => {
        if (tick) return;
        tick = setTimeout(() => {
          tick = 0;
          $$(".reveal:not(.is-in)").forEach(e => { if (e.getBoundingClientRect().top < innerHeight) { e.classList.add("is-in"); revealIO.unobserve(e); } });
        }, 150);
      }, { passive: true });
    }
  }

  /* ---------- bolsas del hero ---------- */
  function heroBags() {
    const main = $("#heroBag"); if (!main || !window.BVBag) return;
    const designs = [
      { shape: "troquelada", color: "fucsia", w: 12, h: 16, ink1: "blanco", text1: en() ? "YOUR BRAND" : "TU MARCA", text2: "Armenia · Quindío" },
      { shape: "lazo", color: "blanco", handle: "rojo", w: 14, h: 18, ink1: "azul", text1: "Calzado La 14", text2: "Eje Cafetero" },
      { shape: "camiseta", color: "amarillo", w: 12, h: 18, ink1: "rojo", text1: "MINIMERCADO", text2: "Domicilios 24/7" },
      { shape: "tnt", color: "verde", w: 14, h: 16, ink1: "blanco", text1: "Café de Origen", text2: "Salento · Quindío" },
      { shape: "papel", color: "negro", w: 12, h: 14, ink1: "dorado", text1: "BOUTIQUE", text2: "Pereira" }
    ];
    let i = 0;
    const draw = (el, d, id) => { const o = Object.assign({ id, print: 1, lang: lang() }, d); if (o.text1 === "TU MARCA" || o.text1 === "YOUR BRAND") o.text1 = en() ? "YOUR BRAND" : "TU MARCA"; el.innerHTML = window.BVBag.render(o); };
    draw($("#heroBag2"), { shape: "tnt", color: "azul", w: 14, h: 16, ink1: "blanco", text1: "ECO" }, "hb2");
    draw($("#heroBag3"), { shape: "papel", color: "kraft", w: 12, h: 14, ink1: "negro", text1: "GIFT" }, "hb3");
    draw(main, designs[0], "hb1");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setInterval(() => {
      if (document.hidden) return;
      main.classList.add("is-swap");
      setTimeout(() => { i = (i + 1) % designs.length; draw(main, designs[i], "hb1"); main.classList.remove("is-swap"); }, 600);
    }, 3600);
  }

  /* ---------- secciones generadas (idioma) ---------- */
  function renderHome() {
    if (document.documentElement.dataset.page !== "home" || !R) return;
    const L = lang();
    const set = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html; };
    const sec = R.sectors(L);
    set("#sectorsTrack", sec + sec.replace(/<li /g, '<li aria-hidden="true" '));
    set("#productsGrid", R.products(L, ""));
    set("#faqList", R.faq(L));
    set("#sizeRows", R.sizes(L, ""));
    set("#galFilters", R.galleryFilters(L));
    set("#gallery", R.gallery(L, ""));
    reveal();
  }

  /* ---------- galería + visor ---------- */
  function gallery() {
    const lb = $("#lightbox"); if (!lb) return;
    const img = $("img", lb), cap = $("figcaption", lb);
    let list = [], idx = 0, lastFocus = null;
    const visible = () => $$(".gal-item:not(.is-hidden) .gal-btn");
    const show = i => {
      list = visible(); if (!list.length) return;
      idx = (i + list.length) % list.length;
      const b = list[idx], im = $("img", b);
      img.src = im.src; img.alt = im.alt; cap.textContent = $("figcaption", b.parentElement).textContent;
    };
    document.addEventListener("click", e => {
      const f = e.target.closest("[data-filter]");
      if (f) {
        $$("[data-filter]").forEach(c => c.classList.toggle("is-on", c === f));
        const t = f.getAttribute("data-filter");
        $$(".gal-item").forEach(g => g.classList.toggle("is-hidden", t !== "all" && g.dataset.type !== t));
        return;
      }
      const b = e.target.closest(".gal-btn");
      if (b) { lastFocus = b; list = visible(); show(list.indexOf(b)); lb.hidden = false; $(".lb-close", lb).focus(); document.body.style.overflow = "hidden"; }
    });
    const close = () => { lb.hidden = true; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); };
    $(".lb-close", lb).addEventListener("click", close);
    $(".lb-prev", lb).addEventListener("click", () => show(idx - 1));
    $(".lb-next", lb).addEventListener("click", () => show(idx + 1));
    lb.addEventListener("click", e => { if (e.target === lb) close(); });
    document.addEventListener("keydown", e => {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------- formulario de contacto ---------- */
  function citiesOptions(sel, withPlaceholder) {
    const L = lang();
    let h = withPlaceholder ? `<option value="">${L === "en" ? "Select…" : "Selecciona…"}</option>` : "";
    D.DEPARTMENTS.forEach(d => {
      h += `<optgroup label="${d.name}">` + D.CITIES.filter(c => c.dept === d.id).map(c => `<option value="${c.name}, ${d.name}">${c.name}</option>`).join("") + "</optgroup>";
    });
    h += `<optgroup label="${L === "en" ? "Other regions" : "Otras regiones"}">` + D.OTHER_REGIONS.map(r => `<option value="${r[0]}">${r[0]}</option>`).join("") + "</optgroup>";
    const v = sel.value; sel.innerHTML = h; if (v) sel.value = v;
  }
  function contactForm() {
    const f = $("#contactForm"); if (!f) return;
    const type = $("#ctType"), city = $("#ctCity"), file = $("#ctFile"), msg = $("#ctMsg"), formBtn = $("#ctFormBtn");
    const fill = () => {
      const L = lang(), v = type.value;
      type.innerHTML = `<option value="">${L === "en" ? "Not sure / advise me" : "No sé / asesórame"}</option>` + D.PRODUCTS.map(p => `<option value="${p[L].name}">${p[L].name}</option>`).join("");
      if (v) type.value = v;
      citiesOptions(city, true);
    };
    fill();
    document.addEventListener("bv:lang", fill);
    if (C.formEndpoint) { formBtn.hidden = false; f.action = C.formEndpoint; }
    file.addEventListener("change", () => { const n = file.files[0]; $("#ctFileName").textContent = n ? "📎 " + n.name : (en() ? "Attach your logo or artwork (optional)" : "Adjunta tu logo o diseño (opcional)"); });
    let via = "wa";
    $$('button[type="submit"]', f).forEach(b => b.addEventListener("click", () => { via = b.dataset.via; }));
    f.addEventListener("submit", e => {
      const L = lang(), d = Object.fromEntries(new FormData(f).entries());
      msg.className = "form-msg"; msg.textContent = "";
      if (d._honey) { e.preventDefault(); return; }
      if (!d.nombre || !d.telefono || !f.acepto.checked) {
        e.preventDefault();
        msg.classList.add("err");
        msg.textContent = L === "en" ? "Please add your name, phone and accept the privacy policy." : "Escribe tu nombre, tu teléfono y acepta la política de datos.";
        return;
      }
      const design = $("#ctIncl").checked && window.BVDesigner ? window.BVDesigner.summaryText() : "";
      const lines = [
        L === "en" ? "Hi Plásticos JR! I'd like a quote:" : "¡Hola Plásticos JR! Quiero una cotización:",
        `• ${L === "en" ? "Name" : "Nombre"}: ${d.nombre}`,
        d.negocio ? `• ${L === "en" ? "Business" : "Negocio"}: ${d.negocio}` : "",
        `• ${L === "en" ? "Phone" : "Teléfono"}: ${d.telefono}`,
        d.email ? `• Email: ${d.email}` : "",
        d.tipo ? `• ${L === "en" ? "Bag" : "Bolsa"}: ${d.tipo}` : "",
        d.ciudad ? `• ${L === "en" ? "City" : "Ciudad"}: ${d.ciudad}` : "",
        d.mensaje ? `• ${L === "en" ? "Details" : "Detalle"}: ${d.mensaje}` : "",
        design ? "\n" + design : "",
        file.files[0] ? (L === "en" ? "\n(I'll attach my logo in this chat 📎)" : "\n(Adjunto mi logo en este chat 📎)") : ""
      ].filter(Boolean).join("\n");
      if (via === "form" && C.formEndpoint) {
        // envío real con archivo (FormSubmit u otro servicio)
        let extra = f.querySelector('input[name="cotizacion"]');
        if (!extra) { extra = document.createElement("input"); extra.type = "hidden"; extra.name = "cotizacion"; f.appendChild(extra); }
        extra.value = design;
        [["_subject", "Nueva cotización · Plásticos JR"], ["_template", "table"], ["_captcha", "false"],
         ["_next", location.href.split("#")[0].replace(/[^/]*$/, "") + "gracias.html"]].forEach(([n, v]) => {
          let i = f.querySelector(`input[name="${n}"]`);
          if (!i) { i = document.createElement("input"); i.type = "hidden"; i.name = n; f.appendChild(i); }
          i.value = v;
        });
        return; // envío nativo
      }
      e.preventDefault();
      if (via === "mail") location.href = mailUrl((L === "en" ? "Bag quote · " : "Cotización de bolsas · ") + d.nombre, lines);
      else window.open(waUrl(lines), "_blank", "noopener");
      msg.classList.add("ok");
      msg.textContent = L === "en" ? "Done! Finish sending the message in the app that just opened." : "¡Listo! Termina de enviar el mensaje en la aplicación que se abrió.";
    });
  }

  /* ---------- pie de página ---------- */
  function footer() { const y = $("#year"); if (y) y.textContent = new Date().getFullYear(); }

  function init() {
    document.documentElement.classList.remove("no-js");
    wireContacts();
    const tb = $("#themeBtn");
    if (tb) tb.addEventListener("click", () => setTheme(currentTheme() === "dark" ? "light" : "dark"));
    if (!window.BVI18n) { const lb = $("#langBtn"); if (lb) lb.hidden = true; }
    header();
    if (lang() === "en") renderHome();
    reveal();
    heroBags();
    gallery();
    contactForm();
    footer();
    document.addEventListener("bv:lang", () => { wireContacts(); renderHome(); const hb = $("#heroBag"); if (hb && window.BVBag) hb.innerHTML = window.BVBag.render({ id: "hb1", print: 1, shape: "troquelada", color: "fucsia", w: 12, h: 16, ink1: "blanco", text1: en() ? "YOUR BRAND" : "TU MARCA", text2: "Armenia · Quindío" }); });
  }

  window.BVApp = { waUrl, mailUrl, lang, citiesOptions, reveal, config: C };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
