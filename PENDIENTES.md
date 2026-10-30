# Pendientes antes de lanzar

## Datos del negocio (hoy son temporales o ficticios)
- [ ] **WhatsApp real** → `js/config.js` (`whatsapp` y `whatsappDisplay`). Hoy: +57 300 000 0000.
- [ ] **Correo real** → `js/config.js` (`email`). Hoy: ventas@plasticosjr.com.
- [ ] **Formulario con archivo adjunto**: con el correo real, poner `formEndpoint: "https://formsubmit.co/CORREO"` y hacer un envío de prueba para activarlo.
- [ ] **Dominio** plasticosjr (.com / .co): `siteUrl` + archivo `CNAME` + DNS (ver README).
- [ ] Dirección o punto de despacho, razón social y NIT → `politicas.html` (se genera desde `scripts/build.mjs`, campos entre [corchetes]).
- [ ] Horario real → `js/config.js`.
- [ ] Redes sociales (Instagram, Facebook, TikTok) → `js/config.js` (`social`).

## Para confirmar con producción
- [x] **Unidades**: confirmado en **centímetros**. Línea estándar 6×11 a 20×30 cm; lo demás se cotiza como "medida especial".
- [ ] Confirmar las medidas de cada tipo (`sizes` en `js/data.js`), sobre todo TNT, papel e industriales (bolsas de basura suelen ser más grandes).
- [ ] **Pedidos mínimos** de referencia por tipo (`min` en `js/data.js`): 1.000 plásticas, 200 TNT, 300 papel.
- [ ] **Tiempos**: producción 8–15 días hábiles; entrega por zonas (`ZONES` y `PRODUCTION` en `js/data.js`).
- [ ] Calibres, gramajes y colores disponibles por tipo de bolsa.
- [ ] Formas de pago y condiciones (anticipo / contra entrega).
- [ ] ¿Venden también bolsas de papel y TNT? (están en el catálogo porque aparecen en las fotos).

## Mejoras sugeridas
- [ ] Lista de precios → activar precio estimado al instante en el diseñador.
- [ ] Fotos propias de producción y de clientes (con su permiso) para la galería.
- [ ] Logo oficial en vector para reemplazar el monograma "JR" provisional.
- [ ] Reseñas reales de Google cuando existan (no se publicaron testimonios inventados).
- [ ] Google Business Profile + Search Console + sitemap.
