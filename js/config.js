/* ==========================================================================
   Plásticos JR — CONFIGURACIÓN DEL NEGOCIO (editar aquí)
   Todo el sitio (botones, formularios, asistente, páginas por ciudad) toma
   los datos de contacto de este archivo. Tras cambiarlo, vuelve a generar
   las páginas con:  node scripts/build.mjs
   ========================================================================== */
window.BV_CONFIG = {
  brand: "Plásticos JR",
  // URL pública del sitio (sin barra final). Cambiar al dominio propio cuando exista.
  siteUrl: "https://droko1982.github.io/bolsas-vale",

  // ⚠️ DATOS TEMPORALES / FICTICIOS — reemplazar por los reales antes de lanzar
  whatsapp: "573000000000",          // formato internacional sin "+" ni espacios
  whatsappDisplay: "+57 300 000 0000",
  phoneDisplay: "+57 300 000 0000",
  email: "ventas@plasticosjr.com",

  // Formulario con archivo adjunto. Déjalo vacío ("") para usar solo WhatsApp/correo.
  // Con un correo real: "https://formsubmit.co/TU-CORREO" (el primer envío pide activarlo).
  formEndpoint: "",

  city: "Armenia",
  region: "Quindío",
  regionCode: "CO-QUI",
  geo: { lat: 4.5339, lng: -75.6811 },
  hours: { es: "Lunes a viernes 8:00 a.m. – 6:00 p.m. · Sábados 8:00 a.m. – 1:00 p.m.",
           en: "Mon–Fri 8:00 a.m. – 6:00 p.m. · Sat 8:00 a.m. – 1:00 p.m." },
  social: { instagram: "", facebook: "", tiktok: "" }
};
