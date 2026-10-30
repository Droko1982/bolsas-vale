# Plásticos JR · sitio web (repo `bolsas-vale`)

Sitio de venta de bolsas plásticas personalizadas para todo Colombia, con foco SEO en el
Eje Cafetero (Quindío, Risaralda, Caldas, norte del Valle y Tolima).

**Vista previa:** https://droko1982.github.io/bolsas-vale/

## Qué incluye

- **Diseñador y cotizador en línea** (`#disena`): 8 tipos de bolsa, medidas de 6×11 a 20×30 cm
  (con equivalencia en pulgadas y campo de medida especial), color, calibre o gramaje, tintas, logo del cliente (quita el fondo blanco y simula
  la impresión a 1–2 tintas), textos, cantidad y ciudad de entrega con tiempos. Genera un código
  de referencia y envía todo por **WhatsApp** o correo, descarga el **boceto PNG** y lo comparte
  desde el celular.
- **Comparación a escala real** de la bolsa frente a una hoja carta y un celular.
- **Vale, asesora virtual**: recomienda bolsas por tipo de negocio, responde preguntas escritas
  (precios, mínimos, medidas, envíos por ciudad, Ley 2232, pagos…) y pasa a WhatsApp con el contexto.
- **Modo claro / oscuro** y **español / inglés** (la página principal).
- **SEO local**: 29 páginas de ciudad, 5 de departamento, 8 de producto y una de toda Colombia,
  todas con datos estructurados (LocalBusiness, Service, FAQPage, BreadcrumbList), sitemap y robots.
- Galería con visor, guía de medidas, sección de la Ley 2232 de 2022, mapa de cobertura,
  formulario de contacto con archivo adjunto y políticas (Ley 1581 / Ley 1480).

## Cómo editar

| Quiero cambiar… | Archivo |
|---|---|
| WhatsApp, correo, horario, dominio, formulario | `js/config.js` |
| Productos, medidas, colores, mínimos, ciudades, tiempos, preguntas | `js/data.js` |
| Textos de la página principal (español) | `index.html` |
| Textos en inglés | `js/i18n.js` |
| Respuestas del asistente Vale | `js/assistant.js` |
| Colores y estilos | `css/styles.css` (tokens en `:root`) |
| Fotos | `assets/img/bolsas/` y `assets/img/fotos/` (WebP) |

Después de editar `config.js` o `data.js`, **vuelve a generar las páginas**:

```bash
node scripts/build.mjs        # páginas de ciudad/producto, sitemap y contenido estático del inicio
python scripts/iconos.py      # (opcional) íconos y og-image si cambias el logo
```

No hay dependencias ni paso de compilación: es HTML, CSS y JavaScript puro, publicado con
GitHub Pages desde la rama `main`.

## Dominio propio (plasticosjr)

1. Cambia `siteUrl` en `js/config.js` por el dominio (ej. `https://www.plasticosjr.com`) y corre `node scripts/build.mjs`.
2. Crea el archivo `CNAME` con el dominio y apunta el DNS a GitHub Pages.
3. Da de alta el sitio en Google Search Console y envía `sitemap.xml`. Crea el perfil de Google Business en Armenia.

Ver `PENDIENTES.md` para los datos que faltan antes del lanzamiento.
