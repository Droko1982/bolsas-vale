/* ==========================================================================
   Plásticos JR — motor de bocetos SVG
   BVBag.render(opts) → SVG del boceto de la bolsa (forma, color, logo, textos,
   medidas). BVBag.compare(w, h, lang) → comparación de tamaño a escala real.
   ========================================================================== */
(function () {
  "use strict";
  const D = window.BV_DATA;

  /* ---------- utilidades de color ---------- */
  function hexToRgb(hex) {
    const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex || "");
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [255, 255, 255];
  }
  function mix(hex, amt) { // amt < 0 oscurece, > 0 aclara
    const [r, g, b] = hexToRgb(hex);
    const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
    const f = c => Math.round(c + (t - c) * p);
    return `rgb(${f(r)},${f(g)},${f(b)})`;
  }
  function lum(hex) {
    const [r, g, b] = hexToRgb(hex);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function rr(x, y, w, h, r) { // rectángulo redondeado como subtrayecto
    r = Math.min(r, w / 2, h / 2);
    return `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  }
  const f1 = n => Math.round(n * 10) / 10;

  /* ---------- proporciones extra por forma (en fracción del alto del cuerpo) ---------- */
  const EXTRA = { troquelada: [1, 0], camiseta: [1, 0], lazo: [1, 0.24], tnt: [1, 0.42],
                  papel: [1.17, 0.3], rollo: [1.1, 0.16], plana: [1.1, 0.16], basura: [1, 0] };

  /* ==========================================================================
     render(opts)
     opts: shape, w, h (centímetros), color (clave), handle (clave), print (0-4),
           ink1, ink2 (claves), logo {src, scale, y}, text1, text2,
           dims (bool), units ('cm'|'in'), id (prefijo único), bg (color export), lang
     ========================================================================== */
  function render(o) {
    const p = o.id || "bv";
    const VBW = 400, VBH = 500, MAXW = 290, MAXH = 380, BASE = 452;
    const shape = o.shape || "troquelada";
    const col = D.COLORS[o.color] || D.COLORS.blanco;
    const clear = !!col.clear;
    const base = clear ? "#E9F1F7" : col.hex;
    const fill = clear ? col.hex : col.hex;
    const edge = clear ? "rgba(110,135,160,.75)" : (lum(base) > 0.85 ? "rgba(20,30,50,.28)" : mix(base, -0.35));
    const shade = clear ? "rgba(150,170,190,.25)" : mix(base, -0.16);
    const deep = clear ? "rgba(120,140,160,.35)" : mix(base, -0.32);
    const hcolKey = o.handle && D.COLORS[o.handle] ? o.handle : o.color;
    const hcol = (D.COLORS[hcolKey] || col);
    const hfill = hcol.clear ? "rgba(225,235,245,.7)" : hcol.hex;
    const ink1 = (D.INKS[o.ink1] || D.INKS.negro).hex;
    const ink2 = (D.INKS[o.ink2] || D.INKS[o.ink1] || D.INKS.negro).hex;
    const print = o.print == null ? 1 : o.print;

    const [ew, eh] = EXTRA[shape] || [1, 0];
    const aspect = Math.max(0.25, (o.w || 16) / (o.h || 24));
    // dimensiones en unidades "alto del cuerpo = 1"
    const figW = aspect * ew, figH = 1 + eh;
    const s = Math.min(MAXW / figW, MAXH / figH);
    const W = aspect * s, H = s;                  // cuerpo en px
    const FW = figW * s, FH = figH * s;
    const X0 = (VBW - FW) / 2, Y0 = BASE - FH;    // esquina de la figura
    let X = X0, Y = Y0 + eh * s;                  // esquina del cuerpo
    if (shape === "rollo" || shape === "plana") X = X0 + (FW - W) / 2;

    let defs = "", back = "", body = "", front = "", area;
    const light = `url(#${p}-light)`;

    defs += `<linearGradient id="${p}-light" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="${clear ? 0.35 : 0.22}"/>
      <stop offset=".32" stop-color="#fff" stop-opacity="0"/>
      <stop offset=".68" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="${clear ? 0.06 : 0.16}"/></linearGradient>
      <radialGradient id="${p}-shadow"><stop offset="0" stop-color="#000" stop-opacity=".32"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <filter id="${p}-ink1" color-interpolation-filters="sRGB"><feFlood flood-color="${ink1}"/><feComposite in2="SourceAlpha" operator="in"/></filter>`;

    // sombra al piso
    back += `<ellipse cx="${VBW / 2}" cy="${BASE + 6}" rx="${f1(FW * 0.52)}" ry="12" fill="url(#${p}-shadow)"/>`;

    const sheen = (x, y, w, h) => clear || shape === "papel" || shape === "tnt" ? "" :
      `<path d="M${f1(x + w * 0.18)} ${f1(y + h * 0.1)} L${f1(x + w * 0.34)} ${f1(y + h * 0.1)} L${f1(x + w * 0.12)} ${f1(y + h * 0.95)} L${f1(x + w * 0.02)} ${f1(y + h * 0.95)}Z" fill="#fff" opacity=".07"/>
       <path d="M${f1(x + w * 0.62)} ${f1(y + h * 0.05)} L${f1(x + w * 0.68)} ${f1(y + h * 0.05)} L${f1(x + w * 0.5)} ${f1(y + h * 0.98)} L${f1(x + w * 0.46)} ${f1(y + h * 0.98)}Z" fill="#fff" opacity=".06"/>`;

    const bodyPath = (d, extraCls) =>
      `<path d="${d}" fill="${fill}" fill-rule="evenodd" stroke="${edge}" stroke-width="1.3" stroke-linejoin="round"${extraCls || ""}/>
       <path d="${d}" fill="${light}" fill-rule="evenodd"/>`;

    if (shape === "troquelada" || shape === "rollo") {
      if (shape === "rollo") {
        const rh = eh * s * 0.8, rx = X0, ry = Y0, rw = FW;
        back += `<rect x="${f1(rx + 10)}" y="${f1(ry)}" width="${f1(rw - 20)}" height="${f1(rh)}" fill="${clear ? "rgba(220,232,242,.9)" : shade}" stroke="${edge}"/>
          <ellipse cx="${f1(rx + 10)}" cy="${f1(ry + rh / 2)}" rx="10" ry="${f1(rh / 2)}" fill="${clear ? "rgba(220,232,242,.9)" : shade}" stroke="${edge}"/>
          <ellipse cx="${f1(rx + rw - 10)}" cy="${f1(ry + rh / 2)}" rx="10" ry="${f1(rh / 2)}" fill="${clear ? "#dfe8f0" : mix(base, -0.05)}" stroke="${edge}"/>
          <ellipse cx="${f1(rx + rw - 10)}" cy="${f1(ry + rh / 2)}" rx="4" ry="${f1(rh / 5)}" fill="#6b5a45"/>
          <rect x="${f1(rx + 10)}" y="${f1(ry + rh * 0.18)}" width="${f1(rw - 20)}" height="${f1(rh * 0.12)}" fill="#fff" opacity=".18"/>`;
        Y = ry + rh * 0.62; // la bolsa sale del rollo
      }
      const Hh = BASE - Y;
      const hw = Math.max(34, W * 0.3), hh = Math.max(12, Hh * 0.05);
      const hole = rr(X + (W - hw) / 2, Y + Hh * 0.07, hw, hh, hh / 2);
      const d = `M${f1(X)} ${f1(Y)}H${f1(X + W)}V${f1(Y + Hh - 5)}Q${f1(X + W)} ${f1(Y + Hh)} ${f1(X + W - 5)} ${f1(Y + Hh)}H${f1(X + 5)}Q${f1(X)} ${f1(Y + Hh)} ${f1(X)} ${f1(Y + Hh - 5)}Z ${hole}`;
      body += bodyPath(d);
      body += `<rect x="${f1(X + 2)}" y="${f1(Y + 2)}" width="${f1(W - 4)}" height="${f1(Hh * 0.16)}" fill="#000" opacity=".045"/>
        <line x1="${f1(X + 4)}" y1="${f1(Y + Hh * 0.165)}" x2="${f1(X + W - 4)}" y2="${f1(Y + Hh * 0.165)}" stroke="${edge}" stroke-opacity=".35" stroke-dasharray="2 3"/>
        <line x1="${f1(X + 4)}" y1="${f1(Y + Hh - 7)}" x2="${f1(X + W - 4)}" y2="${f1(Y + Hh - 7)}" stroke="${edge}" stroke-opacity=".3"/>`;
      if (shape === "rollo") body += `<line x1="${f1(X)}" y1="${f1(Y)}" x2="${f1(X + W)}" y2="${f1(Y)}" stroke="${clear ? "#7f93a6" : deep}" stroke-width="1.6" stroke-dasharray="4 3"/>`;
      body += sheen(X, Y, W, Hh);
      area = { x: X + W * 0.1, y: Y + Hh * 0.21, w: W * 0.8, h: Hh * 0.7 };
    }

    else if (shape === "camiseta") {
      const sw = W * 0.21, cd = H * 0.3, r = 7;
      const d = `M${f1(X)} ${f1(Y + r)}Q${f1(X)} ${f1(Y)} ${f1(X + r)} ${f1(Y)}H${f1(X + sw - r)}Q${f1(X + sw)} ${f1(Y)} ${f1(X + sw)} ${f1(Y + r)}V${f1(Y + cd * 0.35)}C${f1(X + sw)} ${f1(Y + cd * 1.05)} ${f1(X + W - sw)} ${f1(Y + cd * 1.05)} ${f1(X + W - sw)} ${f1(Y + cd * 0.35)}V${f1(Y + r)}Q${f1(X + W - sw)} ${f1(Y)} ${f1(X + W - sw + r)} ${f1(Y)}H${f1(X + W - r)}Q${f1(X + W)} ${f1(Y)} ${f1(X + W)} ${f1(Y + r)}V${f1(Y + H - 4)}Q${f1(X + W)} ${f1(Y + H)} ${f1(X + W - 4)} ${f1(Y + H)}H${f1(X + 4)}Q${f1(X)} ${f1(Y + H)} ${f1(X)} ${f1(Y + H - 4)}Z`;
      body += bodyPath(d);
      const g = W * 0.09;
      body += `<path d="M${f1(X + g)} ${f1(Y + 6)}V${f1(Y + H - 8)}M${f1(X + W - g)} ${f1(Y + 6)}V${f1(Y + H - 8)}" stroke="${shade}" stroke-width="2" opacity=".55"/>
        <path d="M${f1(X + g * 0.5)} ${f1(Y + 6)}V${f1(Y + H - 8)}M${f1(X + W - g * 0.5)} ${f1(Y + 6)}V${f1(Y + H - 8)}" stroke="#fff" stroke-width="1" opacity="${clear ? 0.5 : 0.18}"/>
        <line x1="${f1(X + 3)}" y1="${f1(Y + H - 9)}" x2="${f1(X + W - 3)}" y2="${f1(Y + H - 9)}" stroke="${edge}" stroke-opacity=".35"/>`;
      body += sheen(X, Y, W, H);
      area = { x: X + W * 0.15, y: Y + cd * 0.95 + H * 0.05, w: W * 0.7, h: H - cd * 0.95 - H * 0.14 };
    }

    else if (shape === "lazo") {
      const hh = eh * s, Yb = Y, Hb = H;
      const xl = X + W * 0.3, xr = X + W * 0.7, top = Y0 + 4, rr2 = Math.min(26, (xr - xl) / 2);
      const sw = Math.max(9, W * 0.065);
      const loop = `M${f1(xl)} ${f1(Yb + Hb * 0.08)}V${f1(top + rr2)}Q${f1(xl)} ${f1(top)} ${f1(xl + rr2)} ${f1(top)}H${f1(xr - rr2)}Q${f1(xr)} ${f1(top)} ${f1(xr)} ${f1(top + rr2)}V${f1(Yb + Hb * 0.08)}`;
      back += `<path d="${loop}" fill="none" stroke="${hcol.clear ? "rgba(160,180,200,.6)" : mix(hcol.hex, -0.25)}" stroke-width="${f1(sw + 2.4)}" stroke-linecap="round" transform="translate(5 -4)" opacity=".7"/>
        <path d="${loop}" fill="none" stroke="${hcol.clear ? "rgba(160,180,200,.7)" : mix(hcol.hex, -0.2)}" stroke-width="${f1(sw + 2.4)}" stroke-linecap="round"/>
        <path d="${loop}" fill="none" stroke="${hfill}" stroke-width="${f1(sw)}" stroke-linecap="round"/>`;
      const d = `M${f1(X)} ${f1(Yb)}H${f1(X + W)}V${f1(Yb + Hb - 4)}Q${f1(X + W)} ${f1(Yb + Hb)} ${f1(X + W - 4)} ${f1(Yb + Hb)}H${f1(X + 4)}Q${f1(X)} ${f1(Yb + Hb)} ${f1(X)} ${f1(Yb + Hb - 4)}Z`;
      body += bodyPath(d);
      body += `<rect x="${f1(X + 2)}" y="${f1(Yb + 2)}" width="${f1(W - 4)}" height="${f1(Hb * 0.13)}" fill="#000" opacity=".05"/>
        <line x1="${f1(X + 4)}" y1="${f1(Yb + Hb * 0.135)}" x2="${f1(X + W - 4)}" y2="${f1(Yb + Hb * 0.135)}" stroke="${edge}" stroke-opacity=".35"/>`;
      [xl, xr].forEach(x => {
        body += `<rect x="${f1(x - sw * 0.85)}" y="${f1(Yb + Hb * 0.03)}" width="${f1(sw * 1.7)}" height="${f1(Hb * 0.075)}" rx="${f1(sw * 0.6)}" fill="none" stroke="${hcol.clear ? "#9fb2c4" : mix(hcol.hex, -0.15)}" stroke-width="2.2"/>`;
      });
      body += sheen(X, Yb, W, Hb);
      area = { x: X + W * 0.1, y: Yb + Hb * 0.19, w: W * 0.8, h: Hb * 0.74 };
    }

    else if (shape === "tnt") {
      const Yb = Y, Hb = H, sw = Math.max(10, W * 0.075), top = Y0 + 4;
      const l1 = X + W * 0.27, l2 = X + W * 0.73;
      const strap = `M${f1(l1)} ${f1(Yb + Hb * 0.1)}C${f1(l1)} ${f1(top - 6)} ${f1(l2)} ${f1(top - 6)} ${f1(l2)} ${f1(Yb + Hb * 0.1)}`;
      defs += `<pattern id="${p}-tex" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".8" fill="#000" opacity=".08"/><circle cx="4.5" cy="4.5" r=".8" fill="#fff" opacity=".08"/></pattern>`;
      back += `<path d="${strap}" fill="none" stroke="${mix(base, -0.3)}" stroke-width="${f1(sw)}" transform="translate(8 -6)"/>`;
      front += `<path d="${strap}" fill="none" stroke="${mix(base, -0.12)}" stroke-width="${f1(sw + 2)}"/>
        <path d="${strap}" fill="none" stroke="${base}" stroke-width="${f1(sw)}"/>
        <path d="${strap}" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="1" stroke-dasharray="3 3" transform="translate(0 0)"/>`;
      [l1, l2].forEach(x => {
        front += `<rect x="${f1(x - sw / 2 - 1)}" y="${f1(Yb + 1)}" width="${f1(sw + 2)}" height="${f1(Hb * 0.1)}" fill="${base}" stroke="#000" stroke-opacity=".18" stroke-dasharray="2 2"/>
          <path d="M${f1(x - sw / 2 + 2)} ${f1(Yb + 4)}L${f1(x + sw / 2 - 2)} ${f1(Yb + Hb * 0.1 - 3)}M${f1(x + sw / 2 - 2)} ${f1(Yb + 4)}L${f1(x - sw / 2 + 2)} ${f1(Yb + Hb * 0.1 - 3)}" stroke="#000" stroke-opacity=".18" stroke-dasharray="2 2"/>`;
      });
      const d = `M${f1(X)} ${f1(Yb)}H${f1(X + W)}V${f1(Yb + Hb)}H${f1(X)}Z`;
      body += `<path d="${d}" fill="${base}" stroke="${edge}" stroke-width="1.3"/><path d="${d}" fill="url(#${p}-tex)"/><path d="${d}" fill="${light}"/>
        <line x1="${f1(X + 5)}" y1="${f1(Yb + 7)}" x2="${f1(X + W - 5)}" y2="${f1(Yb + 7)}" stroke="#000" stroke-opacity=".2" stroke-dasharray="3 3"/>
        <path d="M${f1(X + 5)} ${f1(Yb + 7)}V${f1(Yb + Hb - 5)}H${f1(X + W - 5)}V${f1(Yb + 7)}" fill="none" stroke="#000" stroke-opacity=".12" stroke-dasharray="3 3"/>`;
      area = { x: X + W * 0.12, y: Yb + Hb * 0.16, w: W * 0.76, h: Hb * 0.76 };
    }

    else if (shape === "papel") {
      const Yb = Y, Hb = H, g = W * 0.17, k = g * 0.38;
      const cordCol = lum(base) > 0.6 ? "#3a3a44" : "#f2efe8";
      // cordones traseros
      const c = (x1, x2, dy, dx, col2) => `<path d="M${f1(x1 + dx)} ${f1(Yb + Hb * 0.05 - dy)}C${f1(x1 + dx)} ${f1(Y0 - 4 - dy)} ${f1(x2 + dx)} ${f1(Y0 - 4 - dy)} ${f1(x2 + dx)} ${f1(Yb + Hb * 0.05 - dy)}" fill="none" stroke="${col2}" stroke-width="3.6" stroke-linecap="round"/>`;
      back += c(X + W * 0.34, X + W * 0.66, k * 0.9, g * 0.55, mix(cordCol === "#3a3a44" ? "#3a3a44" : "#d9d4c8", -0.15));
      back += `<path d="M${f1(X)} ${f1(Yb)}L${f1(X + g)} ${f1(Yb - k)}H${f1(X + W + g)}L${f1(X + W)} ${f1(Yb)}Z" fill="${mix(base, -0.42)}"/>`;
      back += `<path d="M${f1(X + W)} ${f1(Yb)}L${f1(X + W + g)} ${f1(Yb - k)}V${f1(Yb + Hb - k)}L${f1(X + W)} ${f1(Yb + Hb)}Z" fill="${mix(base, -0.2)}" stroke="${edge}" stroke-width="1"/>
        <path d="M${f1(X + W + g / 2)} ${f1(Yb - k / 2)}V${f1(Yb + Hb - k / 2)}" stroke="#000" stroke-opacity=".12"/>`;
      const d = `M${f1(X)} ${f1(Yb)}H${f1(X + W)}V${f1(Yb + Hb)}H${f1(X)}Z`;
      body += bodyPath(d);
      body += `<rect x="${f1(X)}" y="${f1(Yb)}" width="${f1(W)}" height="${f1(Hb * 0.085)}" fill="#000" opacity=".06"/>`;
      [X + W * 0.34, X + W * 0.66].forEach(x => { body += `<circle cx="${f1(x)}" cy="${f1(Yb + Hb * 0.05)}" r="3.4" fill="${mix(base, -0.5)}"/>`; });
      front += c(X + W * 0.34, X + W * 0.66, 0, 0, cordCol);
      area = { x: X + W * 0.1, y: Yb + Hb * 0.14, w: W * 0.8, h: Hb * 0.8 };
    }

    else if (shape === "plana") {
      const rh = eh * s * 0.8, rx = X0, ry = Y0, rw = FW;
      back += `<rect x="${f1(rx + 10)}" y="${f1(ry)}" width="${f1(rw - 20)}" height="${f1(rh)}" fill="${clear ? "rgba(220,232,242,.95)" : shade}" stroke="${edge}"/>
        <ellipse cx="${f1(rx + 10)}" cy="${f1(ry + rh / 2)}" rx="10" ry="${f1(rh / 2)}" fill="${clear ? "rgba(220,232,242,.95)" : shade}" stroke="${edge}"/>
        <ellipse cx="${f1(rx + rw - 10)}" cy="${f1(ry + rh / 2)}" rx="10" ry="${f1(rh / 2)}" fill="${clear ? "#e3ecf3" : mix(base, -0.05)}" stroke="${edge}"/>
        <ellipse cx="${f1(rx + rw - 10)}" cy="${f1(ry + rh / 2)}" rx="4" ry="${f1(rh / 5)}" fill="#6b5a45"/>`;
      Y = ry + rh * 0.62;
      const Hh = BASE - Y;
      const d = `M${f1(X)} ${f1(Y)}H${f1(X + W)}V${f1(Y + Hh)}H${f1(X)}Z`;
      body += bodyPath(d);
      body += `<line x1="${f1(X)}" y1="${f1(Y)}" x2="${f1(X + W)}" y2="${f1(Y)}" stroke="#7f93a6" stroke-width="1.6" stroke-dasharray="4 3"/>
        <line x1="${f1(X + 2)}" y1="${f1(Y + Hh - 8)}" x2="${f1(X + W - 2)}" y2="${f1(Y + Hh - 8)}" stroke="${edge}" stroke-opacity=".4"/>
        <path d="M${f1(X + W * 0.2)} ${f1(Y + Hh * 0.15)}l${f1(W * 0.05)} ${f1(Hh * 0.7)}M${f1(X + W * 0.75)} ${f1(Y + Hh * 0.1)}l${f1(-W * 0.04)} ${f1(Hh * 0.75)}" stroke="#fff" stroke-width="3" opacity=".35"/>`;
      area = { x: X + W * 0.12, y: Y + Hh * 0.14, w: W * 0.76, h: Hh * 0.72 };
    }

    else { // basura / industrial
      const n = 9, amp = Math.max(3, H * 0.012);
      let top = `M${f1(X)} ${f1(Y + amp)}`;
      for (let i = 1; i <= n; i++) top += `Q${f1(X + (W / n) * (i - 0.5))} ${f1(Y + (i % 2 ? -amp : amp * 2))} ${f1(X + (W / n) * i)} ${f1(Y + amp)}`;
      const d = `${top}V${f1(Y + H)}H${f1(X)}Z`;
      body += bodyPath(d);
      let zz = `M${f1(X + 3)} ${f1(Y + H - 10)}`;
      for (let i = 1; i <= 16; i++) zz += `L${f1(X + 3 + ((W - 6) / 16) * i)} ${f1(Y + H - (i % 2 ? 4 : 10))}`;
      body += `<path d="${zz}" fill="none" stroke="${clear ? "#8ea3b6" : mix(base, lum(base) > 0.5 ? -0.25 : 0.25)}" stroke-width="1.2"/>
        <path d="M${f1(X + W * 0.15)} ${f1(Y + H * 0.2)}q${f1(W * 0.1)} ${f1(H * 0.2)} 0 ${f1(H * 0.4)}M${f1(X + W * 0.8)} ${f1(Y + H * 0.15)}q${f1(-W * 0.12)} ${f1(H * 0.25)} ${f1(W * 0.02)} ${f1(H * 0.55)}M${f1(X + W * 0.45)} ${f1(Y + H * 0.6)}q${f1(W * 0.08)} ${f1(H * 0.1)} ${f1(W * 0.2)} ${f1(H * 0.12)}" fill="none" stroke="#fff" stroke-opacity="${lum(base) > 0.5 ? 0.5 : 0.14}" stroke-width="2.4" stroke-linecap="round"/>`;
      area = { x: X + W * 0.15, y: Y + H * 0.2, w: W * 0.7, h: H * 0.55 };
    }

    /* ---------- impresión: logo + textos ---------- */
    let art = "";
    if (print > 0 && area) {
      const L = o.logo || {}, t1 = (o.text1 || "").trim(), t2 = (o.text2 || "").trim();
      const hasLogo = !!L.src, hasText = !!(t1 || t2);
      const cx = area.x + area.w / 2;
      const sc = Math.max(0.2, Math.min(1, L.scale || 0.62));
      const offs = (L.y || 0) * area.h * 0.28;
      const textBlock = (t1 ? area.w * 0.15 : 0) + (t2 ? area.w * 0.09 : 0);
      const logoH = hasLogo ? Math.min(area.h - textBlock - 6, area.w * sc) : 0;
      const totalH = logoH + (hasLogo && hasText ? 8 : 0) + textBlock;
      let yy = area.y + (area.h - totalH) / 2 + offs;
      if (hasLogo) {
        const lw = area.w * sc;
        const filt = print <= 2 && !L.color ? ` filter="url(#${p}-ink1)"` : "";
        art += `<image href="${esc(L.src)}" x="${f1(cx - lw / 2)}" y="${f1(yy)}" width="${f1(lw)}" height="${f1(logoH)}" preserveAspectRatio="xMidYMid meet"${filt}/>`;
        yy += logoH + 8;
      } else if (L.fileName) {
        art += `<rect x="${f1(area.x + area.w * 0.1)}" y="${f1(yy)}" width="${f1(area.w * 0.8)}" height="${f1(area.w * 0.32)}" rx="10" fill="none" stroke="${ink1}" stroke-width="2" stroke-dasharray="6 5"/>
          <text x="${f1(cx)}" y="${f1(yy + area.w * 0.19)}" text-anchor="middle" font-family="Manrope,Arial,sans-serif" font-weight="700" font-size="${f1(area.w * 0.06)}" fill="${ink1}">📎 ${esc(L.fileName.slice(0, 26))}</text>`;
        yy += area.w * 0.32 + 8;
      }
      const fit = (txt, maxSize, k) => Math.min(maxSize, (area.w * k) / Math.max(4, txt.length * 0.56));
      if (t1) {
        const fs = fit(t1, area.w * 0.15, 0.96);
        art += `<text x="${f1(cx)}" y="${f1(yy + fs * 0.82)}" text-anchor="middle" font-family="'Bricolage Grotesque','Arial Black',Arial,sans-serif" font-weight="800" font-size="${f1(fs)}" fill="${ink1}" letter-spacing="-.5">${esc(t1)}</text>`;
        yy += area.w * 0.15;
      }
      if (t2) {
        const fs = fit(t2, area.w * 0.07, 0.98);
        art += `<text x="${f1(cx)}" y="${f1(yy + fs)}" text-anchor="middle" font-family="Manrope,Arial,sans-serif" font-weight="700" font-size="${f1(fs)}" fill="${print === 2 || print === 3 ? ink2 : ink1}">${esc(t2)}</text>`;
      }
      if (!hasLogo && !hasText && !L.fileName) {
        const bw = area.w * 0.7, bh = Math.min(area.h * 0.45, area.w * 0.42);
        art += `<rect x="${f1(cx - bw / 2)}" y="${f1(area.y + (area.h - bh) / 2)}" width="${f1(bw)}" height="${f1(bh)}" rx="12" fill="none" stroke="${ink1}" stroke-opacity=".75" stroke-width="2" stroke-dasharray="7 6"/>
          <text x="${f1(cx)}" y="${f1(area.y + area.h / 2 + area.w * 0.035)}" text-anchor="middle" font-family="'Bricolage Grotesque',Arial,sans-serif" font-weight="800" font-size="${f1(area.w * 0.1)}" fill="${ink1}" opacity=".85">${o.lang === "en" ? "YOUR LOGO" : "TU LOGO"}</text>`;
      }
    }

    /* ---------- cotas ---------- */
    let dims = "";
    if (o.dims) {
      const u = o.units === "in";
      const wl = u ? `${D.cmToIn(o.w)}″` : `${o.w} cm`, hl = u ? `${D.cmToIn(o.h)}″` : `${o.h} cm`;
      const bx = (shape === "rollo" || shape === "plana") ? X : X, by = (shape === "rollo" || shape === "plana") ? Y : (shape === "camiseta" || shape === "troquelada" || shape === "basura" ? Y0 : Y);
      const bh = BASE - by;
      const dc = "currentColor";
      dims = `<g class="bv-dims" fill="${dc}" stroke="${dc}" font-family="Manrope,Arial,sans-serif" font-size="13" font-weight="800">
        <path d="M${f1(bx)} ${BASE + 22}H${f1(bx + W)}M${f1(bx)} ${BASE + 16}v12M${f1(bx + W)} ${BASE + 16}v12" stroke-width="1.4" fill="none"/>
        <text x="${f1(bx + W / 2)}" y="${BASE + 40}" text-anchor="middle" stroke="none">${o.lang === "en" ? "W" : "Ancho"} ${wl}</text>
        <path d="M${f1(bx - 18)} ${f1(by)}V${BASE}M${f1(bx - 24)} ${f1(by)}h12M${f1(bx - 24)} ${BASE}h12" stroke-width="1.4" fill="none"/>
        <text transform="translate(${f1(bx - 26)} ${f1(by + bh / 2)}) rotate(-90)" text-anchor="middle" stroke="none">${o.lang === "en" ? "H" : "Alto"} ${hl}</text></g>`;
    }

    const bg = o.bg ? `<rect width="${VBW}" height="${VBH}" fill="${o.bg}"/>` : "";
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VBW} ${VBH}" role="img" aria-label="${esc(o.label || "Boceto de bolsa")}"><defs>${defs}</defs>${bg}${back}${body}${art}${front}${dims}</svg>`;
  }

  /* ==========================================================================
     compare(w, h, lang): bolsa vs. hoja carta y celular, a la misma escala
     ========================================================================== */
  function compare(w, h, lang, units) {
    const en = lang === "en", inch = units === "in";
    const VBW = 380, VBH = 296, base = 236, gap = 2.6;
    const sheet = [21.6, 27.9], phone = [7.5, 15.5];
    const totalW = w + gap + sheet[0] + gap + phone[0];
    const s = Math.min((VBW - 30) / totalW, 200 / Math.max(h, sheet[1]));
    let x = 15;
    const lab = (cx, txt, sub) => `<text x="${f1(cx)}" y="${base + 22}" text-anchor="middle" font-size="17" font-weight="800" fill="currentColor">${txt}</text>
      <text x="${f1(cx)}" y="${base + 42}" text-anchor="middle" font-size="14" fill="currentColor" opacity=".7">${sub}</text>`;
    const meas = (a, b) => inch ? `${D.cmToIn(a)} × ${D.cmToIn(b)}″` : `${a} × ${b} cm`;
    let out = `<line x1="8" y1="${base}" x2="${VBW - 8}" y2="${base}" stroke="currentColor" stroke-opacity=".25"/>`;
    // bolsa
    out += `<rect x="${f1(x)}" y="${f1(base - h * s)}" width="${f1(w * s)}" height="${f1(h * s)}" rx="3" fill="var(--brand)" fill-opacity=".16" stroke="var(--brand)" stroke-width="2"/>`;
    out += lab(x + (w * s) / 2, en ? "Your bag" : "Tu bolsa", meas(w, h));
    x += w * s + gap * s;
    // hoja carta
    out += `<rect x="${f1(x)}" y="${f1(base - sheet[1] * s)}" width="${f1(sheet[0] * s)}" height="${f1(sheet[1] * s)}" fill="none" stroke="currentColor" stroke-opacity=".7" stroke-width="1.5" stroke-dasharray="5 4"/>
      <path d="M${f1(x + sheet[0] * s * 0.18)} ${f1(base - sheet[1] * s * 0.82)}h${f1(sheet[0] * s * 0.64)}M${f1(x + sheet[0] * s * 0.18)} ${f1(base - sheet[1] * s * 0.72)}h${f1(sheet[0] * s * 0.5)}M${f1(x + sheet[0] * s * 0.18)} ${f1(base - sheet[1] * s * 0.62)}h${f1(sheet[0] * s * 0.58)}" stroke="currentColor" stroke-opacity=".3" stroke-width="2"/>`;
    out += lab(x + (sheet[0] * s) / 2, en ? "Letter sheet" : "Hoja carta", inch ? "8.5 × 11″" : "21.6 × 27.9 cm");
    x += sheet[0] * s + gap * s;
    // celular
    out += `<rect x="${f1(x)}" y="${f1(base - phone[1] * s)}" width="${f1(phone[0] * s)}" height="${f1(phone[1] * s)}" rx="${f1(1 * s)}" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-opacity=".7" stroke-width="1.5"/>
      <rect x="${f1(x + 0.45 * s)}" y="${f1(base - phone[1] * s + 0.9 * s)}" width="${f1((phone[0] - 0.9) * s)}" height="${f1((phone[1] - 1.8) * s)}" rx="${f1(0.5 * s)}" fill="currentColor" fill-opacity=".14"/>`;
    out += lab(x + (phone[0] * s) / 2, en ? "Phone" : "Celular", inch ? "3 × 6.1″" : "7.5 × 15.5 cm");
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VBW} ${VBH}" font-family="Manrope,Arial,sans-serif" role="img" aria-label="${en ? "Size comparison" : "Comparación de tamaño"}">${out}</svg>`;
  }

  window.BVBag = { render, compare, mix, lum, esc };
})();
