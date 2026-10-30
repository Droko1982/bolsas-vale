"""Plásticos JR — genera favicon, íconos PWA y la imagen para redes (og-image).
Uso:  python scripts/iconos.py      (requiere Pillow)
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICONS = os.path.join(ROOT, "assets", "icons")
os.makedirs(ICONS, exist_ok=True)
FONT_B = "C:/Windows/Fonts/segoeuib.ttf"
FONT_R = "C:/Windows/Fonts/segoeui.ttf"
MAGENTA_A, MAGENTA_B = (255, 79, 160), (194, 14, 98)
NAVY = (14, 21, 48)


def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def gradient(size, a, b):
    w, h = size
    g = Image.new("RGB", size)
    px = g.load()
    for y in range(h):
        for x in range(w):
            t = (x / w + y / h) / 2
            px[x, y] = tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))
    return g


def mark(size):
    """Bolsa magenta con manija troquelada y monograma JR (fondo transparente)."""
    S = size * 4  # supermuestreo
    k = S / 48
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    mask = Image.new("L", (S, S), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle([7 * k, 6 * k, 41 * k, 44 * k], radius=5 * k, fill=255)
    d.rounded_rectangle([16 * k, 11 * k, 32 * k, 16 * k], radius=2.5 * k, fill=0)
    img.paste(gradient((S, S), MAGENTA_A, MAGENTA_B), (0, 0), mask)
    d2 = ImageDraw.Draw(img)
    f = font(FONT_B, int(17 * k))
    d2.text((24 * k, 31 * k), "JR", font=f, fill="white", anchor="mm")
    d2.ellipse([(41 - 3.2) * k, (7 - 3.2) * k, (41 + 3.2) * k, (7 + 3.2) * k], fill=(0, 166, 230))
    d2.ellipse([(44.5 - 2.2) * k, (12.5 - 2.2) * k, (44.5 + 2.2) * k, (12.5 + 2.2) * k], fill=(255, 194, 26))
    return img.resize((size, size), Image.LANCZOS)


def on_bg(size, bg, scale):
    im = Image.new("RGB", (size, size), bg)
    m = mark(int(size * scale))
    o = (size - m.width) // 2
    im.paste(m, (o, o), m)
    return im


mark(32).save(os.path.join(ICONS, "favicon-32.png"))
on_bg(180, (255, 255, 255), 0.78).save(os.path.join(ICONS, "apple-touch-icon.png"))
on_bg(192, (255, 255, 255), 0.8).save(os.path.join(ICONS, "icon-192.png"))
on_bg(512, (255, 255, 255), 0.8).save(os.path.join(ICONS, "icon-512.png"))
on_bg(512, NAVY, 0.6).save(os.path.join(ICONS, "maskable-512.png"))

with open(os.path.join(ICONS, "favicon.svg"), "w", encoding="utf-8") as fh:
    fh.write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">'
             '<stop offset="0" stop-color="#FF4FA0"/><stop offset="1" stop-color="#C20E62"/></linearGradient></defs>'
             '<path fill="url(#g)" fill-rule="evenodd" d="M12 6h24a5 5 0 0 1 5 5v28a5 5 0 0 1-5 5H12a5 5 0 0 1-5-5V11a5 5 0 0 1 5-5Zm6.5 5a2.5 2.5 0 0 0 0 5h11a2.5 2.5 0 0 0 0-5Z"/>'
             '<text x="24" y="37.5" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="16" fill="#fff">JR</text>'
             '<circle cx="41" cy="7" r="3.2" fill="#00A6E6"/><circle cx="44.5" cy="12.5" r="2.2" fill="#FFC21A"/></svg>')

# ---------- og-image 1200x630 ----------
W, H = 1200, 630
og = Image.new("RGB", (W, H), (7, 11, 24))
glow = Image.new("RGB", (W, H), (7, 11, 24))
gd = ImageDraw.Draw(glow)
gd.ellipse([700, -200, 1400, 500], fill=(120, 18, 80))
gd.ellipse([780, 330, 1300, 820], fill=(0, 70, 110))
gd.ellipse([-200, -260, 360, 200], fill=(90, 70, 10))
og = Image.blend(og, glow.filter(ImageFilter.GaussianBlur(120)), 0.9)
d = ImageDraw.Draw(og)
for y in range(0, H, 24):
    for x in range(0, W, 24):
        d.point((x, y), fill=(40, 48, 80))

m = mark(96)
og.paste(m, (64, 60), m)
d.text((176, 108), "Plásticos", font=font(FONT_R, 54), fill="white", anchor="lm")
tw = d.textlength("Plásticos ", font=font(FONT_R, 54))
d.text((176 + tw, 108), "JR", font=font(FONT_B, 54), fill=(255, 61, 151), anchor="lm")
d.text((64, 230), "Bolsas plásticas", font=font(FONT_B, 66), fill="white")
d.text((64, 306), "personalizadas con tu logo", font=font(FONT_B, 50), fill=(255, 120, 185))
d.text((64, 392), "Camiseta · Troqueladas · Manija flexible · TNT · Papel · Rollos", font=font(FONT_R, 25), fill=(200, 206, 230))
d.rounded_rectangle([64, 460, 560, 520], radius=30, fill=(31, 175, 90))
d.text((312, 490), "Diseña y cotiza por WhatsApp", font=font(FONT_B, 25), fill="white", anchor="mm")
d.text((64, 560), "Eje Cafetero · Entrega en el Quindío · Envíos a toda Colombia", font=font(FONT_R, 22), fill=(154, 162, 196))

cards = ["bolsas/troquelada-zona-sport", "bolsas/manija-flexible-calzado", "bolsas/tnt-colores"]
pos = [(690, 120, -6), (880, 70, 4), (1010, 250, -3)]
for name, (x, y, ang) in zip(cards, pos):
    src = Image.open(os.path.join(ROOT, "assets", "img", name + ".webp")).convert("RGB")
    src = src.resize((230, 288), Image.LANCZOS)
    card = Image.new("RGBA", (246, 304), (255, 255, 255, 255))
    card.paste(src, (8, 8))
    card = card.rotate(ang, expand=True, resample=Image.BICUBIC)
    shadow = Image.new("RGBA", card.size, (0, 0, 0, 0))
    shadow.paste((0, 0, 0, 140), (0, 0), card.split()[3])
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    og.paste(shadow, (x + 10, y + 16), shadow)
    og.paste(card, (x, y), card)

og.save(os.path.join(ROOT, "assets", "og-image.jpg"), "JPEG", quality=86, optimize=True)
print("Íconos y og-image generados")
