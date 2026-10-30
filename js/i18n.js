/* ==========================================================================
   Plásticos JR — idiomas (ES / EN)
   El español vive en el HTML (bueno para SEO). Al cambiar a inglés se toman
   los textos de EN; al volver, se restaura el original. Elementos:
     data-i18n="clave"                 → innerHTML
     data-i18n-attr="atributo:clave;…"  → atributos (placeholder, aria-label…)
   Evento: document 'bv:lang' con detail.lang
   ========================================================================== */
(function () {
  "use strict";

  const EN = {
    "a11y.skip": "Skip to content", "a11y.lang": "Cambiar idioma a español", "a11y.theme": "Toggle dark mode", "a11y.menu": "Open menu",
    "top.1": "🚚 Direct delivery in Quindío", "top.2": "📦 Shipping across Colombia", "top.3": "♻ Guidance on Law 2232 of 2022",
    "nav.products": "Products", "nav.design": "Design your bag", "nav.sizes": "Sizes", "nav.coverage": "Coverage",
    "nav.gallery": "Gallery", "nav.faq": "FAQ", "nav.contact": "Contact", "nav.quote": "Get a quote",
    "hero.eyebrow": "Bag factory · Quindío & all of Colombia",
    "hero.title": "Custom plastic bags that <span class=\"hl\">sell for you</span>",
    "hero.lead": "T-shirt, die-cut, soft-loop, non-woven, paper and roll bags. Design your bag right here, upload your logo and get your quote on WhatsApp. Direct delivery in Quindío and shipping across the Coffee Region and Colombia.",
    "hero.cta1": "Design your bag", "hero.cta2": "Quote on WhatsApp",
    "hero.c1": "📏 From 6×11 to 20×30 cm", "hero.c2": "🎨 Up to 4-color printing", "hero.c3": "✅ Proof before production", "hero.c4": "♻ Reusable options",
    "hero.f1t": "Free proof", "hero.f1": "Approve it before production", "hero.f2t": "1–2 days", "hero.f2": "Delivery in Quindío",
    "stats.1": "bag types", "stats.2": "standard line + custom sizes", "stats.3": "cities with fast delivery", "stats.4": "print colors",
    "sec.aria": "Industries we serve",
    "prod.kicker": "Catalog", "prod.title": "Every bag your business needs",
    "prod.lead": "Plain or printed with your brand, in the color, size and gauge you need. Tap <b>Design</b> to see your bag instantly.",
    "des.kicker": "Online designer", "des.title": "Design your bag and get a quote in 2 minutes",
    "des.lead": "Pick the type, size and color, upload your logo and see how it looks. Then send everything via WhatsApp or email with a reference code.",
    "des.s1": "Bag type", "des.s2": "Size", "des.s3": "Bag color", "des.s4": "Gauge (thickness)", "des.s5": "Printing", "des.s6": "Your logo or artwork", "des.s7": "Quantity & delivery",
    "des.in": "in", "des.special": "Need a larger or custom size? (optional)", "des.specialPh": "e.g. 40 × 50 cm with gusset", "des.width": "Width", "des.height": "Height", "des.handle": "Handle color",
    "des.calHint": "Higher gauge means stronger and more reusable. Not sure? Keep the recommended one.",
    "des.ink1": "Main ink color", "des.ink2": "Second ink", "des.side1": "1 side", "des.side2": "2 sides",
    "des.drop": "Drag your logo here or tap to upload", "des.dropS": "PNG, JPG, SVG, PDF, AI, EPS · max 10 MB",
    "des.lsize": "Logo size", "des.lpos": "Vertical position", "des.white": "Remove white background", "des.keep": "Show original colors",
    "des.t1": "Business name", "des.t1ph": "e.g. Main Street Shoes", "des.t2": "Second line (optional)", "des.t2ph": "e.g. Armenia · 300 000 0000",
    "des.qtyOther": "Other quantity", "des.city": "Where do we ship?", "des.ref": "Ref.", "des.dims": "Dimensions",
    "des.compare": "Real size comparison", "des.sendWa": "Send quote request on WhatsApp", "des.sendMail": "✉ Email",
    "des.download": "⬇ PNG proof", "des.share": "↗ Share",
    "des.attach": "When WhatsApp opens, attach your logo in the chat so we get it in high quality.",
    "des.noscript": "Enable JavaScript to use the designer, or message us on WhatsApp.",
    "size.kicker": "Size guide", "size.title": "Which bag size do I need?",
    "size.lead": "We measure bags in <b>centimeters: width × height</b>. Our standard line goes from <b>6 × 11</b> up to <b>20 × 30 cm</b>; any other size is quoted as a custom size. Use this table as a guide or try yours in the designer.",
    "size.w": "WIDTH", "size.h": "HEIGHT", "size.g": "gusset",
    "size.tip": "A gusset (side or bottom fold) adds capacity without changing the width. Ask us about it.",
    "size.th1": "Centimeters", "size.th2": "Inches", "size.th3": "Great for", "size.th4": "Try",
    "proc.alt": "Extrusion machine producing red plastic film for bags", "proc.cap": "Film extrusion: where your bag is born.",
    "proc.kicker": "How we work", "proc.title": "From your idea to your counter in 4 steps",
    "proc.1t": "Design & quote", "proc.1": "Build your bag in the designer or message us. We reply with your quote and exact minimum.",
    "proc.2t": "Approve the proof", "proc.2": "We prepare your logo for print and send a digital proof with size and colors. Nothing is produced without your OK.",
    "proc.3t": "We produce", "proc.3": "Film extrusion, flexographic printing, cutting, sealing and quality control for every batch.",
    "proc.4t": "We deliver", "proc.4": "Direct delivery in Quindío and shipping to the Coffee Region, Valle, Tolima and all of Colombia.",
    "law.kicker": "Compliant bags", "law.title": "We help you with Law 2232 of 2022",
    "law.lead": "Since July 7, 2024, Colombia bans several single-use plastic bags, such as checkout bags, with exceptions like reusable bags and some food bags. We guide you so your bag keeps selling your brand and fits your type of business.",
    "law.1t": "Reusable", "law.1": "Heavy-gauge soft-loop, non-woven and paper bags: made to be used many times while showing your logo.",
    "law.2t": "For food", "law.2": "Roll bags for produce, meat, grains and bakery, designed for food hygiene and preservation.",
    "law.3t": "Industrial & waste", "law.3": "Trash bags in the waste color code (white, black and green) plus film for packaging, construction and agriculture.",
    "law.cta1": "Design a reusable bag →", "law.cta2": "See food bags →", "law.cta3": "Quote industrial bags →",
    "law.note": "Guidance only, not legal advice. Tell us about your case and we'll recommend the right option.",
    "cov.kicker": "Coverage", "cov.title": "Coffee Region specialists, shipping across Colombia",
    "cov.lead": "We ship from Quindío. The closer you are, the faster it arrives: direct delivery to all 12 towns in Quindío and frequent routes to Risaralda, Caldas, northern Valle and Tolima.",
    "cov.z1t": "Quindío", "cov.z1": "Direct delivery in 1–2 business days",
    "cov.z2t": "Risaralda, Caldas & northern Valle", "cov.z2": "1–2 business days",
    "cov.z3t": "Cali, Tuluá, Buga, Ibagué, Medellín & Bogotá", "cov.z3": "2–4 business days",
    "cov.z4t": "Rest of Colombia", "cov.z4": "3–6 business days by courier",
    "cov.hint": "Approximate transit times, after production.", "cov.all": "See shipping across Colombia →",
    "gal.kicker": "Gallery", "gal.title": "Reference styles and finishes", "gal.lead": "This is how printed bags look in real life. Tap a photo to enlarge it.",
    "faq.kicker": "FAQ", "faq.title": "Everything to know before you order",
    "faq.lead": "Can't find your answer? Ask <b>Vale</b>, our virtual advisor, or message us on WhatsApp.", "faq.ask": "💬 Ask Vale",
    "ct.kicker": "Contact", "ct.title": "Send us your design and get a quote today",
    "ct.lead": "Send your logo, size and quantity. We'll reply with a quote and a proof to approve.",
    "ct.mail": "Email", "ct.where": "We ship from", "ct.whereV": "Armenia, Quindío · all of Colombia", "ct.hours": "Hours",
    "ct.name": "Name *", "ct.biz": "Business or company", "ct.phone": "WhatsApp / mobile *", "ct.email": "Email",
    "ct.type": "Bag type", "ct.city": "City", "ct.msg": "Tell us what you need", "ct.msgPh": "Size, quantity, colors, date you need it…",
    "ct.file": "Attach your logo or artwork (optional)", "ct.incl": "Include the bag I built in the designer",
    "ct.consent": "I authorize the processing of my data under the <a href=\"politicas.html\">privacy policy</a> (Colombian Law 1581 of 2012).",
    "ct.sendWa": "Send via WhatsApp", "ct.sendMail": "Send via email", "ct.sendForm": "Send with attachment",
    "ft.about": "Custom plastic, non-woven and paper bags for businesses in the Coffee Region and across Colombia.",
    "ft.policies": "Policies & privacy", "ft.made": "Made in Colombia's Coffee Region",
    "ft.h1": "Products", "ft.h2": "Coverage", "ft.h3": "Company", "ft.design": "Bag designer", "ft.sizes": "Size guide",
    "ft.law": "Law 2232", "ft.faq": "FAQ", "ft.contact": "Contact", "ft.colombia": "All of Colombia", "ft.cities": "Fast-delivery cities:"
  };

  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
                  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  const orig = new Map(), origAttr = new Map();
  let lang = "es";

  function capture(root) {
    (root || document).querySelectorAll("[data-i18n]").forEach(el => { if (!orig.has(el)) orig.set(el, el.innerHTML); });
    (root || document).querySelectorAll("[data-i18n-attr]").forEach(el => {
      if (origAttr.has(el)) return;
      const m = {};
      el.getAttribute("data-i18n-attr").split(";").forEach(pair => { const [a] = pair.split(":"); if (a) m[a.trim()] = el.getAttribute(a.trim()); });
      origAttr.set(el, m);
    });
  }

  function prodName(key) {
    const id = key.slice(9), p = window.BV_DATA && window.BV_DATA.PRODUCTS.find(x => x.id === id);
    return p ? p[lang === "en" ? "en" : "es"].name : null;
  }

  function apply() {
    capture();
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const k = el.getAttribute("data-i18n");
      let v = k.startsWith("prodname.") ? prodName(k) : (lang === "en" ? EN[k] : null);
      if (lang === "es" && !k.startsWith("prodname.")) v = orig.get(el);
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(el => {
      const o = origAttr.get(el) || {};
      el.getAttribute("data-i18n-attr").split(";").forEach(pair => {
        const [a, k] = pair.split(":").map(s => s && s.trim());
        if (!a || !k) return;
        const v = lang === "en" ? EN[k] : o[a];
        if (v != null) el.setAttribute(a, v);
      });
    });
    document.documentElement.lang = lang === "en" ? "en" : "es-CO";
    const b = document.getElementById("langBtn");
    if (b) b.querySelector("span").textContent = lang === "en" ? "ES" : "EN";
  }

  function setLang(l, silent) {
    lang = l === "en" ? "en" : "es";
    store.set("bv-lang", lang);
    apply();
    if (!silent) document.dispatchEvent(new CustomEvent("bv:lang", { detail: { lang } }));
  }

  function init() {
    capture();
    const q = new URLSearchParams(location.search).get("lang");
    const saved = q || store.get("bv-lang") || "es";
    const b = document.getElementById("langBtn");
    if (b) b.addEventListener("click", () => setLang(lang === "en" ? "es" : "en"));
    if (saved === "en") setLang("en"); else apply();
  }

  window.BVI18n = { t: k => (lang === "en" ? EN[k] : null), get lang() { return lang; }, setLang, capture, EN };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
