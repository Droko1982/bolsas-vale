/* ==========================================================================
   Plásticos JR — "Vale", asesora virtual
   Guiada por botones + texto libre por palabras clave (sin servidor).
   Recomienda bolsas por tipo de negocio, responde dudas, abre el diseñador y
   pasa la conversación a WhatsApp con el contexto ya escrito.
   ========================================================================== */
(function () {
  "use strict";
  const D = window.BV_DATA, C = window.BV_CONFIG || {};
  if (!D) return;
  const L = () => (window.BVI18n ? window.BVI18n.lang : "es");
  const base = document.documentElement.dataset.base || "";
  const home = document.documentElement.dataset.page === "home";

  const TX = {
    es: {
      launch: "¿Te asesoro?", name: "Vale", role: "Asesora de empaques · en línea",
      bubble: "¡Hola! 👋 Soy Vale. ¿Te ayudo a elegir la bolsa ideal para tu negocio?",
      greet: "¡Hola! 👋 Soy *Vale*, tu asesora de Plásticos JR. Te ayudo a elegir tu bolsa, la medida y a cotizar en minutos.",
      menu: "¿Qué necesitas? Elige una opción o escríbeme 👇",
      m_rec: "🛍️ Recomiéndame una bolsa", m_size: "📏 Medidas", m_min: "📦 Mínimos y precios", m_ship: "🚚 Envíos y tiempos",
      m_design: "🎨 Enviar mi diseño", m_law: "♻ Ley 2232", m_human: "💬 Hablar con un asesor",
      back: "↩ Menú", designer: "Abrir el diseñador", wa: "Seguir por WhatsApp", placeholder: "Escribe tu pregunta…", send: "Enviar",
      foot: "Respuestas automáticas · un asesor confirma todo por WhatsApp",
      rec_q: "¡Con gusto! ¿Qué tipo de negocio tienes?",
      rec_a: "Para *{sector}* te recomiendo:",
      design_x: "Diseñar {p}",
      size_a: "Fabricamos desde *6 × 11* hasta *20 × 30 pulgadas* (≈ 15 × 28 cm a 51 × 76 cm).\n\n• 6×11 – 8×12: joyería, cosméticos, droguería\n• 10×14 – 12×16: ropa, domicilios\n• 14×18 – 16×20: calzado, mercado\n• 18×24 – 20×30: artículos grandes, industrial\n\nEn el diseñador ves tu bolsa a escala junto a una hoja carta y un celular 📐",
      min_a: "El precio depende del *tipo de bolsa, la medida, el calibre, las tintas y la cantidad*: entre más unidades, mejor precio por bolsa 💪\n\nMínimos de referencia:\n• Plásticas impresas: desde *1.000* und.\n• Ecológicas TNT: desde *200* und.\n• Papel: desde *300* und.\n\nArma tu bolsa en el diseñador y te enviamos la cotización exacta.",
      ship_q: "¿A qué ciudad o departamento enviamos? Escríbela o elige una 👇",
      ship_city: "📍 *{city}*: {eta}.\nLa producción toma aprox. 8–15 días hábiles después de aprobar el boceto.",
      ship_page: "Ver bolsas en {city}",
      ship_other: "Despachamos a *toda Colombia* por transportadora (3–6 días hábiles). En el Eje Cafetero somos más rápidos 🚚",
      design_a: "¡Perfecto! 🎨 Lo ideal es un archivo *vectorial* (AI, PDF, SVG o EPS); también recibimos PNG o JPG en buena calidad.\n\nPuedes subirlo en el diseñador para ver cómo queda, y luego enviarlo por WhatsApp. Si no tienes diseño, te ayudamos a crearlo.",
      law_a: "Desde el *7 de julio de 2024* la Ley 2232 de 2022 prohíbe varias bolsas plásticas de un solo uso, como las de punto de pago, con excepciones como las *reutilizables* y algunas *para alimentos*.\n\nOpciones que te recomendamos: manija flexible de calibre alto, ecológicas TNT y papel. Es información orientativa; cuéntanos tu caso y te asesoramos.",
      law_more: "Leer más",
      human_a: "¡Claro! Toca el botón y te atiende un asesor por WhatsApp con lo que hablamos 👇",
      pay_a: "Las condiciones se confirman en la cotización. Normalmente se trabaja con un *anticipo* para iniciar la producción y el saldo contra entrega, por transferencia, Nequi, Daviplata o efectivo.",
      cal_a: "El *calibre* es el grosor de la bolsa. A mayor calibre, más resistencia y reutilización. Para bolsas reutilizables recomendamos calibre alto; para alimentos o productos livianos, calibre bajo.",
      hours_a: "Atendemos {hours}. Por WhatsApp puedes escribirnos a cualquier hora y te respondemos en horario de atención 🕘",
      where_a: "Despachamos desde *Armenia, Quindío* a todo el país. Entregamos directo en los 12 municipios del Quindío y con rutas frecuentes a Pereira, Manizales, el norte del Valle y el Tolima.",
      sample_a: "Pregúntale a un asesor por muestras físicas disponibles; también te enviamos fotos de trabajos similares 📸",
      proof_a: "Sí ✅ Antes de producir te enviamos un *boceto digital* con medidas, colores y ubicación del logo. No producimos nada sin tu aprobación.",
      thanks: "¡Con mucho gusto! 💚 ¿Te ayudo con algo más?",
      hello: "¡Hola! 😊 ¿En qué te puedo ayudar?",
      product_a: "*{p}*: {d}\n\nMedidas desde {from} hasta {to}.",
      fallback: "Mmm, no estoy segura de haber entendido 🙈. Puedo pasarte con un asesor por WhatsApp o puedes elegir una opción del menú.",
      wa_intro: "¡Hola Plásticos JR! Vengo de la página web (chat con Vale).",
      wa_sector: "Negocio:", wa_product: "Bolsa:", wa_city: "Ciudad:", wa_q: "Pregunta:"
    },
    en: {
      launch: "Need advice?", name: "Vale", role: "Packaging advisor · online",
      bubble: "Hi! 👋 I'm Vale. Want help choosing the right bag for your business?",
      greet: "Hi! 👋 I'm *Vale*, your Plásticos JR advisor. I'll help you pick your bag, size and get a quote in minutes.",
      menu: "What do you need? Pick an option or type 👇",
      m_rec: "🛍️ Recommend a bag", m_size: "📏 Sizes", m_min: "📦 Minimums & prices", m_ship: "🚚 Shipping & times",
      m_design: "🎨 Send my design", m_law: "♻ Law 2232", m_human: "💬 Talk to an advisor",
      back: "↩ Menu", designer: "Open the designer", wa: "Continue on WhatsApp", placeholder: "Type your question…", send: "Send",
      foot: "Automated answers · an advisor confirms everything on WhatsApp",
      rec_q: "Happy to help! What kind of business do you have?",
      rec_a: "For *{sector}* I recommend:",
      design_x: "Design {p}",
      size_a: "We make bags from *6 × 11* up to *20 × 30 inches* (≈ 15 × 28 cm to 51 × 76 cm).\n\n• 6×11 – 8×12: jewelry, cosmetics, pharmacy\n• 10×14 – 12×16: clothing, delivery\n• 14×18 – 16×20: shoes, groceries\n• 18×24 – 20×30: bulky items, industrial\n\nThe designer shows your bag to scale next to a letter sheet and a phone 📐",
      min_a: "Price depends on *bag type, size, gauge, inks and quantity*: the more units, the better the price per bag 💪\n\nReference minimums:\n• Printed plastic: from *1,000* pcs\n• Non-woven: from *200* pcs\n• Paper: from *300* pcs\n\nBuild your bag in the designer and we'll send the exact quote.",
      ship_q: "Which city or department should we ship to? Type it or pick one 👇",
      ship_city: "📍 *{city}*: {eta}.\nProduction takes about 8–15 business days after proof approval.",
      ship_page: "Bags in {city}",
      ship_other: "We ship *across Colombia* by courier (3–6 business days). In the Coffee Region we're fastest 🚚",
      design_a: "Great! 🎨 A *vector* file is best (AI, PDF, SVG or EPS); we also accept good-quality PNG or JPG.\n\nUpload it in the designer to preview it, then send it on WhatsApp. No design yet? We'll help you create it.",
      law_a: "Since *July 7, 2024*, Law 2232 of 2022 bans several single-use plastic bags, such as checkout bags, with exceptions like *reusable* bags and some *food* bags.\n\nOur suggestions: heavy-gauge soft-loop, non-woven and paper bags. This is guidance only; tell us your case and we'll advise you.",
      law_more: "Read more",
      human_a: "Sure! Tap the button and an advisor will help you on WhatsApp with our chat summary 👇",
      pay_a: "Terms are confirmed in your quote. Usually an *advance payment* starts production and the balance is paid on delivery, by bank transfer, Nequi, Daviplata or cash.",
      cal_a: "*Gauge* is the bag's thickness. Higher gauge means more strength and reuse. We recommend heavy gauge for reusable bags and lighter gauge for food or light items.",
      hours_a: "Our hours: {hours}. You can message us on WhatsApp anytime and we'll reply during business hours 🕘",
      where_a: "We ship from *Armenia, Quindío* nationwide, with direct delivery in all 12 towns of Quindío and frequent routes to Pereira, Manizales, northern Valle and Tolima.",
      sample_a: "Ask an advisor about available physical samples; we can also send photos of similar jobs 📸",
      proof_a: "Yes ✅ Before production we send a *digital proof* with size, colors and logo placement. Nothing is produced without your approval.",
      thanks: "You're welcome! 💚 Anything else?",
      hello: "Hi! 😊 How can I help?",
      product_a: "*{p}*: {d}\n\nSizes from {from} to {to}.",
      fallback: "Hmm, I'm not sure I understood 🙈. I can connect you with an advisor on WhatsApp, or pick an option from the menu.",
      wa_intro: "Hi Plásticos JR! I'm coming from your website (chat with Vale).",
      wa_sector: "Business:", wa_product: "Bag:", wa_city: "City:", wa_q: "Question:"
    }
  };
  const t = (k, v) => { let s = TX[L()][k] || TX.es[k] || ""; if (v) Object.keys(v).forEach(x => { s = s.split("{" + x + "}").join(v[x]); }); return s; };
  const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = s => esc(s).replace(/\*([^*]+)\*/g, "<b>$1</b>");
  const ctx = { sector: "", product: "", city: "", q: "" };

  /* ---------- interfaz ---------- */
  const launch = document.createElement("button");
  launch.type = "button"; launch.className = "va-launch"; launch.setAttribute("aria-haspopup", "dialog");
  const panel = document.createElement("section");
  panel.className = "va-panel"; panel.hidden = true; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-modal", "false");
  document.body.append(launch, panel);

  function paintShell() {
    launch.innerHTML = `<span class="va-avatar" aria-hidden="true">V</span><span class="va-txt">${t("launch")}</span>`;
    launch.setAttribute("aria-label", `${t("name")} – ${t("launch")}`);
    panel.setAttribute("aria-label", `${t("name")} – ${t("role")}`);
    panel.innerHTML = `<header class="va-head"><span class="va-avatar" aria-hidden="true">V</span><div class="va-title"><b>${t("name")}</b><span>${t("role")}</span></div><button type="button" class="va-x" aria-label="✕">✕</button></header>
      <div class="va-body" aria-live="polite"></div>
      <form class="va-input"><input type="text" autocomplete="off" maxlength="200" placeholder="${t("placeholder")}" aria-label="${t("placeholder")}"><button type="submit" aria-label="${t("send")}">➤</button></form>
      <p class="va-foot">${t("foot")}</p>`;
    panel.querySelector(".va-x").addEventListener("click", close);
    panel.querySelector(".va-input").addEventListener("submit", e => {
      e.preventDefault();
      const i = panel.querySelector(".va-input input"), v = i.value.trim();
      if (!v) return;
      i.value = ""; user(v); answer(v);
    });
  }
  const body = () => panel.querySelector(".va-body");
  function scroll() { const b = body(); b.scrollTop = b.scrollHeight; }
  function user(text) { const m = document.createElement("div"); m.className = "va-msg me"; m.textContent = text; body().appendChild(m); scroll(); }
  function bot(text, quick, delay) {
    const b = body(), typing = document.createElement("div");
    typing.className = "va-msg bot va-typing"; typing.innerHTML = "<i></i><i></i><i></i>";
    b.appendChild(typing); scroll();
    setTimeout(() => {
      typing.remove();
      const m = document.createElement("div"); m.className = "va-msg bot"; m.innerHTML = fmt(text); b.appendChild(m);
      if (quick && quick.length) {
        const q = document.createElement("div"); q.className = "va-quick";
        quick.forEach(o => {
          let n;
          if (o.href) { n = document.createElement("a"); n.href = o.href; if (o.wa) { n.target = "_blank"; n.rel = "noopener"; n.className = "va-wa"; } }
          else { n = document.createElement("button"); n.type = "button"; n.addEventListener("click", () => { q.remove(); if (o.say !== false) user(o.label); o.go(); }); }
          n.textContent = o.label; q.appendChild(n);
        });
        b.appendChild(q);
      }
      scroll();
    }, delay == null ? 450 : delay);
  }

  function waLink() {
    const lines = [t("wa_intro")];
    if (ctx.sector) lines.push(`• ${t("wa_sector")} ${ctx.sector}`);
    if (ctx.product) lines.push(`• ${t("wa_product")} ${ctx.product}`);
    if (ctx.city) lines.push(`• ${t("wa_city")} ${ctx.city}`);
    if (ctx.q) lines.push(`• ${t("wa_q")} ${ctx.q}`);
    if (window.BVDesigner && home) lines.push("", window.BVDesigner.summaryText());
    return window.BVApp ? window.BVApp.waUrl(lines.join("\n")) : `https://wa.me/${C.whatsapp}`;
  }
  const waBtn = () => ({ label: t("wa"), href: waLink(), wa: true });
  const backBtn = () => ({ label: t("back"), go: menu });
  const designBtn = (id) => ({
    label: id ? t("design_x", { p: D.product(id)[L()].name }) : t("designer"),
    go: () => {
      if (id) ctx.product = D.product(id)[L()].name;
      if (window.BVDesigner) { window.BVDesigner.set(id ? { type: id } : {}); if (innerWidth < 700) close(); }
      else location.href = `${base}${id ? "?tipo=" + id : ""}#disena`;
    }, say: false
  });

  /* ---------- flujos ---------- */
  function menu() {
    bot(t("menu"), [
      { label: t("m_rec"), go: recommend }, { label: t("m_size"), go: () => bot(t("size_a"), [designBtn(), backBtn()]) },
      { label: t("m_min"), go: () => bot(t("min_a"), [designBtn(), waBtn(), backBtn()]) }, { label: t("m_ship"), go: shipAsk },
      { label: t("m_design"), go: () => bot(t("design_a"), [designBtn(), waBtn(), backBtn()]) },
      { label: t("m_law"), go: law }, { label: t("m_human"), go: () => bot(t("human_a"), [waBtn(), backBtn()]) }
    ]);
  }
  function recommend() {
    bot(t("rec_q"), D.SECTORS.map(s => ({ label: `${s.icon} ${s[L()]}`, go: () => recFor(s) })).concat([backBtn()]));
  }
  function recFor(s) {
    ctx.sector = s[L()];
    const names = s.rec.map(id => `• *${D.product(id)[L()].name}*: ${D.product(id)[L()].short}`).join("\n");
    bot(`${t("rec_a", { sector: s[L()].toLowerCase() })}\n${names}`, s.rec.map(id => designBtn(id)).concat([waBtn(), backBtn()]));
  }
  function shipAsk() {
    bot(t("ship_q"), D.CITIES.filter(c => c.featured).map(c => ({ label: c.name, go: () => shipTo(c) }))
      .concat([{ label: L() === "en" ? "Other city" : "Otra ciudad", go: () => bot(t("ship_other"), [waBtn(), backBtn()]) }]));
  }
  function shipTo(c) {
    const d = D.dept(c.dept);
    ctx.city = `${c.name}, ${d.name}`;
    bot(t("ship_city", { city: `${c.name}, ${d.name}`, eta: D.ZONES[c.zone][L()] }),
      [{ label: t("ship_page", { city: c.name }), href: `${base}bolsas-plasticas-${c.slug}/` }, designBtn(), waBtn(), backBtn()]);
  }
  function law() {
    bot(t("law_a"), [designBtn("flexible"), designBtn("tnt"), { label: t("law_more"), href: home ? "#ley-2232" : `${base}#ley-2232` }, backBtn()]);
  }

  /* ---------- texto libre ---------- */
  const BIG = { bogota: 3, medellin: 3, barranquilla: 4, cartagena: 4, bucaramanga: 4, cucuta: 4, "santa marta": 4, villavicencio: 4,
                pasto: 4, neiva: 3, popayan: 3, monteria: 4, valledupar: 4, sincelejo: 4, tunja: 4, envigado: 3, bello: 3, itagui: 3, palmira: 3, jamundi: 3, yumbo: 3 };
  const TOPICS = [
    [/\b(gracias|thank)/, () => bot(t("thanks"), [backBtn()])],
    [/\b(precio|precios|cuanto|valor|cuesta|costo|price|cost|how much)/, () => bot(t("min_a"), [designBtn(), waBtn()])],
    [/\b(minimo|minima|cantidad|unidades|minimum|quantity)/, () => bot(t("min_a"), [designBtn(), waBtn()])],
    [/\b(boceto|prueba|aprobar|proof)/, () => bot(t("proof_a"), [designBtn(), backBtn()])],
    [/\b(medida|medidas|tamano|tamanos|pulgada|grande|pequen|size|inch)/, () => bot(t("size_a"), [designBtn(), backBtn()])],
    [/\b(envio|envian|envios|despach|llega|demora|tarda|entrega|domicilio|ship|deliver)/, shipAsk],
    [/\b(logo|diseno|archivo|imagen|arte|vector|design|file|artwork)/, () => bot(t("design_a"), [designBtn(), waBtn()])],
    [/\b(ley|2232|prohib|ambient|reutiliz|law|ban|reusable)/, law],
    [/\b(calibre|grosor|resisten|gauge|thick)/, () => bot(t("cal_a"), [designBtn(), backBtn()])],
    [/\b(pago|pagar|nequi|daviplata|transferencia|anticipo|pay)/, () => bot(t("pay_a"), [waBtn(), backBtn()])],
    [/\b(horario|hora|abren|atienden|hours|open)/, () => bot(t("hours_a", { hours: (C.hours && C.hours[L()]) || "" }), [waBtn(), backBtn()])],
    [/\b(donde|ubicacion|direccion|quedan|where|located)/, () => bot(t("where_a"), [shipBtn(), waBtn()])],
    [/\b(muestra|sample)/, () => bot(t("sample_a"), [waBtn(), backBtn()])],
    [/\b(asesor|humano|persona|llamar|whatsapp|advisor|human)/, () => bot(t("human_a"), [waBtn(), backBtn()])],
    [/\b(recomi|que bolsa|cual bolsa|negocio|tienda|recommend|which bag)/, recommend],
    [/^(hola|buenas|buenos|hey|hello|hi)\b/, () => bot(t("hello"), [{ label: t("m_rec"), go: recommend }, { label: t("m_min"), go: () => bot(t("min_a"), [designBtn(), waBtn()]) }, backBtn()])]
  ];
  const PRODUCT_KW = [
    [/camiseta|t-?shirt/, "camiseta"], [/troquel|die.?cut/, "troquelada"], [/manija|lazo|rinon|flexible|loop/, "flexible"],
    [/tnt|tela|cambrel|no tejida|ecologic|non.?woven|tote/, "tnt"], [/papel|kraft|regalo|paper|gift/, "papel"],
    [/rollo|dispensador|precortad|roll|dispenser/, "rollo"], [/fruver|carne|alimento|pan|grano|food|produce|meat/, "alimentos"],
    [/basura|industrial|pelicula|lamina|residuo|trash|film/, "industrial"]
  ];
  function shipBtn() { return { label: t("m_ship"), go: shipAsk }; }

  function answer(raw) {
    const s = norm(raw);
    ctx.q = raw;
    // ¿mencionó una ciudad?
    const city = D.CITIES.find(c => s.includes(norm(c.name)));
    if (city) return shipTo(city);
    const big = Object.keys(BIG).find(k => s.includes(k));
    if (big) { ctx.city = raw; return bot(t("ship_city", { city: big.replace(/\b\w/g, m => m.toUpperCase()), eta: D.ZONES[BIG[big]][L()] }), [designBtn(), waBtn(), backBtn()]); }
    const reg = D.OTHER_REGIONS.find(r => s.includes(norm(r[0].split(" (")[0])));
    if (reg) { ctx.city = reg[0]; return bot(t("ship_city", { city: reg[0], eta: D.ZONES[reg[1]][L()] }), [designBtn(), waBtn(), backBtn()]); }
    // ¿tema general?
    for (const [re, fn] of TOPICS) if (re.test(s)) return fn();
    // ¿producto?
    const pk = PRODUCT_KW.find(([re]) => re.test(s));
    if (pk) {
      const p = D.product(pk[1]), a = p.sizes[0], b = p.sizes[p.sizes.length - 1];
      ctx.product = p[L()].name;
      return bot(t("product_a", { p: p[L()].name, d: p[L()].desc, from: `${a[0]}×${a[1]}″`, to: `${b[0]}×${b[1]}″` }), [designBtn(p.id), waBtn(), backBtn()]);
    }
    bot(t("fallback"), [waBtn(), backBtn()]);
  }

  /* ---------- abrir / cerrar ---------- */
  let started = false, lastFocus = null;
  function open() {
    lastFocus = document.activeElement;
    panel.hidden = false; launch.hidden = true;
    const bub = launch.querySelector(".va-bubble"); if (bub) bub.remove();
    if (!started) { started = true; bot(t("greet"), null, 300); setTimeout(menu, 700); }
    setTimeout(() => { const i = panel.querySelector(".va-input input"); if (i && innerWidth > 700) i.focus(); }, 350);
  }
  function close() { panel.hidden = true; launch.hidden = false; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  launch.addEventListener("click", open);
  document.addEventListener("click", e => { if (e.target.closest("[data-open-assistant]")) { e.preventDefault(); open(); } });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !panel.hidden) close(); });
  document.addEventListener("bv:lang", () => { const wasOpen = !panel.hidden; started = false; paintShell(); if (wasOpen) { panel.hidden = true; open(); } });

  paintShell();
  // burbuja de saludo una vez por sesión
  try {
    if (!sessionStorage.getItem("bv-bubble")) {
      setTimeout(() => {
        if (!panel.hidden || launch.hidden) return;
        const b = document.createElement("span"); b.className = "va-bubble"; b.textContent = t("bubble");
        launch.appendChild(b); sessionStorage.setItem("bv-bubble", "1");
        setTimeout(() => b.remove(), 9000);
      }, 7000);
    }
  } catch (e) {}

  window.BVAssistant = { open, close };
})();
