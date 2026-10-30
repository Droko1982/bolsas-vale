/* ==========================================================================
   Plásticos JR — CATÁLOGO, MEDIDAS, COBERTURA Y PREGUNTAS (editar aquí)
   Lo usan el navegador (diseñador, asistente, idioma EN) y el generador de
   páginas SEO (scripts/build.mjs). Medidas en CENTÍMETROS: ancho × alto.
   ========================================================================== */
window.BV_DATA = (function () {
  "use strict";

  /* ---------- Colores de bolsa e tintas ---------- */
  const COLORS = {
    blanco:   { hex: "#FFFFFF", es: "Blanco",   en: "White" },
    natural:  { hex: "rgba(236,244,250,.42)", es: "Natural / translúcido", en: "Clear / natural", clear: true },
    negro:    { hex: "#16171C", es: "Negro",    en: "Black" },
    rojo:     { hex: "#D7262E", es: "Rojo",     en: "Red" },
    fucsia:   { hex: "#E0177A", es: "Fucsia",   en: "Magenta" },
    rosado:   { hex: "#F7A8C8", es: "Rosado",   en: "Pink" },
    amarillo: { hex: "#FFD23F", es: "Amarillo", en: "Yellow" },
    naranja:  { hex: "#F57C1F", es: "Naranja",  en: "Orange" },
    azul:     { hex: "#1F4FB5", es: "Azul rey", en: "Royal blue" },
    celeste:  { hex: "#5DBDEB", es: "Azul cielo", en: "Sky blue" },
    verde:    { hex: "#1E9E5A", es: "Verde",    en: "Green" },
    limon:    { hex: "#9BCB3C", es: "Verde limón", en: "Lime" },
    morado:   { hex: "#6B3FA0", es: "Morado",   en: "Purple" },
    gris:     { hex: "#9AA0A8", es: "Gris",     en: "Grey" },
    beige:    { hex: "#E9DCC3", es: "Beige",    en: "Beige" },
    cafe:     { hex: "#6B3A2A", es: "Café",     en: "Brown" },
    kraft:    { hex: "#C49A6C", es: "Kraft",    en: "Kraft" }
  };

  const INKS = {
    negro:    { hex: "#16171C", es: "Negro",    en: "Black" },
    blanco:   { hex: "#FFFFFF", es: "Blanco",   en: "White" },
    rojo:     { hex: "#D7262E", es: "Rojo",     en: "Red" },
    fucsia:   { hex: "#E0177A", es: "Fucsia",   en: "Magenta" },
    azul:     { hex: "#1F4FB5", es: "Azul",     en: "Blue" },
    celeste:  { hex: "#1BA1E2", es: "Cian",     en: "Cyan" },
    amarillo: { hex: "#FFC21A", es: "Amarillo", en: "Yellow" },
    naranja:  { hex: "#F57C1F", es: "Naranja",  en: "Orange" },
    verde:    { hex: "#1E9E5A", es: "Verde",    en: "Green" },
    morado:   { hex: "#6B3FA0", es: "Morado",   en: "Purple" },
    cafe:     { hex: "#5A3424", es: "Café",     en: "Brown" },
    dorado:   { hex: "#C9A54C", es: "Dorado",   en: "Gold" },
    plateado: { hex: "#B4BAC3", es: "Plateado", en: "Silver" }
  };

  /* ---------- Opciones de impresión ---------- */
  const PRINT = [
    { id: 0, es: "Sin impresión (lisa)", en: "No print (plain)" },
    { id: 1, es: "1 tinta", en: "1 color" },
    { id: 2, es: "2 tintas", en: "2 colors" },
    { id: 3, es: "3 tintas", en: "3 colors" },
    { id: 4, es: "4 tintas / full color", en: "4 colors / full color" }
  ];

  /* ---------- Productos ----------
     shape: forma del boceto en el diseñador (js/bag.js)
     min: pedido mínimo de REFERENCIA (confirmar con producción)            */
  const PRODUCTS = [
    {
      id: "camiseta", slug: "bolsas-camiseta", shape: "camiseta", icon: "camiseta",
      es: { name: "Bolsa camiseta", short: "La clásica de supermercados, tiendas y domicilios.",
            desc: "Bolsa con asas tipo camiseta en polietileno de alta o baja densidad. Resistente, económica y perfecta para impresión de tu logo a una o varias tintas.",
            uses: ["Supermercados y minimercados", "Droguerías y tiendas", "Domicilios y restaurantes", "Almacenes de calzado"],
            material: "Polietileno de alta (PEAD) o baja densidad (PEBD)" },
      en: { name: "T-shirt bag", short: "The classic for supermarkets, shops and delivery.",
            desc: "T-shirt style carrier bag in high or low-density polyethylene. Strong, affordable and ready for your logo in one or more colors.",
            uses: ["Supermarkets and grocery stores", "Pharmacies and shops", "Delivery and restaurants", "Shoe stores"],
            material: "High (HDPE) or low-density (LDPE) polyethylene" },
      sizes: [[12, 20], [14, 22], [15, 25], [17, 27], [18, 28], [20, 30]], def: [17, 27],
      calibres: ["1.5", "2", "2.5", "3"], defCal: "2",
      colors: ["blanco", "natural", "negro", "amarillo", "rojo", "azul", "verde", "fucsia", "naranja"],
      prints: [0, 1, 2, 3, 4], min: 1000,
      images: ["bolsas/camiseta-amarilla", "bolsas/camiseta-olimpica", "bolsas/camiseta-unitex"]
    },
    {
      id: "troquelada", slug: "bolsas-troqueladas", shape: "troquelada", icon: "troquelada",
      es: { name: "Bolsa troquelada", short: "Manija troquelada: elegante y práctica para ropa y calzado.",
            desc: "Bolsa con manija troquelada (perforada), con opción de refuerzo en la manija y fuelle. La más pedida por boutiques, almacenes de ropa, calzado y cosméticos.",
            uses: ["Ropa y boutiques", "Calzado y accesorios", "Cosméticos y perfumería", "Tecnología y celulares"],
            material: "Polietileno de baja densidad (PEBD), mate o brillante" },
      en: { name: "Die-cut handle bag", short: "Die-cut handle: clean and practical for fashion and shoes.",
            desc: "Bag with a die-cut handle, optional handle reinforcement and gusset. The favorite of boutiques, clothing, shoe and cosmetics stores.",
            uses: ["Clothing and boutiques", "Shoes and accessories", "Cosmetics and fragrance", "Tech and phone stores"],
            material: "Low-density polyethylene (LDPE), matte or gloss" },
      sizes: [[6, 11], [8, 12], [10, 15], [12, 18], [15, 20], [16, 24], [18, 26], [20, 30]], def: [16, 24],
      calibres: ["2", "2.5", "3", "4"], defCal: "3",
      colors: ["blanco", "negro", "fucsia", "rosado", "rojo", "azul", "celeste", "amarillo", "naranja", "verde", "morado", "natural"],
      prints: [0, 1, 2, 3, 4], min: 1000,
      images: ["bolsas/troquelada-zona-sport", "bolsas/troquelada-krika", "bolsas/troquelada-bahia"]
    },
    {
      id: "flexible", slug: "bolsas-manija-flexible", shape: "lazo", icon: "lazo",
      es: { name: "Bolsa manija flexible", short: "Manija de lazo (riñón) cómoda y reutilizable.",
            desc: "Bolsa con manija flexible tipo lazo sellada, cómoda de cargar y pensada para reutilizarse. Ideal para dar una imagen premium a tu marca.",
            uses: ["Calzado y marroquinería", "Boutiques y tiendas de regalo", "Eventos y ferias", "Marcas corporativas"],
            material: "Polietileno de baja densidad (PEBD) calibre alto" },
      en: { name: "Soft-loop handle bag", short: "Comfortable, reusable soft-loop handle.",
            desc: "Bag with a heat-sealed soft-loop handle, comfortable to carry and designed to be reused. A premium look for your brand.",
            uses: ["Shoes and leather goods", "Boutiques and gift shops", "Events and trade shows", "Corporate brands"],
            material: "Heavy-gauge low-density polyethylene (LDPE)" },
      sizes: [[12, 18], [15, 20], [16, 24], [18, 26], [20, 30]], def: [18, 26],
      calibres: ["3", "3.5", "4"], defCal: "3.5",
      colors: ["blanco", "negro", "fucsia", "rosado", "rojo", "azul", "amarillo", "verde", "morado", "natural"],
      prints: [0, 1, 2, 3, 4], min: 1000, reusable: true,
      images: ["bolsas/manija-flexible-calzado", "bolsas/manija-flexible-cheap", "bolsas/manija-flexible-zona-secreta"]
    },
    {
      id: "tnt", slug: "bolsas-ecologicas-tnt", shape: "tnt", icon: "tnt",
      es: { name: "Bolsa ecológica TNT", short: "Tela no tejida reutilizable, ideal como publicidad.",
            desc: "Bolsa en tela no tejida (TNT / cambrel) con asas cosidas o termoselladas. Reutilizable, liviana y perfecta como regalo publicitario o bolsa de compra.",
            uses: ["Eventos, ferias y congresos", "Marcas y campañas", "Supermercados (reutilizable)", "Tiendas naturistas y agro"],
            material: "Tela no tejida de polipropileno (60–80 g/m²)" },
      en: { name: "Non-woven eco tote", short: "Reusable non-woven fabric, great for promotion.",
            desc: "Non-woven polypropylene tote with sewn or heat-sealed handles. Reusable, lightweight and perfect as a promotional gift or shopping bag.",
            uses: ["Events, fairs and conferences", "Brands and campaigns", "Supermarkets (reusable)", "Health food and agro stores"],
            material: "Non-woven polypropylene fabric (60–80 g/m²)" },
      sizes: [[15, 20], [18, 24], [20, 25], [20, 30]], def: [20, 30],
      calibres: ["60 g", "70 g", "80 g"], defCal: "70 g", calLabel: "gramaje",
      colors: ["negro", "blanco", "rojo", "fucsia", "rosado", "azul", "verde", "limon", "amarillo", "naranja", "beige", "cafe", "morado"],
      prints: [0, 1, 2, 4], min: 200, reusable: true,
      images: ["bolsas/tnt-colores", "bolsas/tnt-bodylogic", "bolsas/tnt-tradecorp"]
    },
    {
      id: "papel", slug: "bolsas-de-papel", shape: "papel", icon: "papel",
      es: { name: "Bolsa de papel con cordón", short: "Kraft o propalcote: lujo para regalo y moda.",
            desc: "Bolsa de papel kraft o propalcote, con plastificado mate o brillante, cordón y refuerzo superior. Acabados especiales como foil dorado o plateado.",
            uses: ["Joyerías y relojerías", "Moda premium", "Tiendas de regalo y detalles", "Cosmética y spa"],
            material: "Papel kraft o propalcote (150–250 g)" },
      en: { name: "Paper bag with cord", short: "Kraft or coated paper: luxury for gifts and fashion.",
            desc: "Kraft or coated paper bag with matte or gloss lamination, cord handles and top reinforcement. Special finishes like gold or silver foil.",
            uses: ["Jewelry and watch stores", "Premium fashion", "Gift shops", "Cosmetics and spa"],
            material: "Kraft or coated paper (150–250 gsm)" },
      sizes: [[10, 15], [12, 18], [15, 20], [18, 24], [20, 30]], def: [15, 20],
      calibres: ["150 g", "200 g", "250 g"], defCal: "200 g", calLabel: "gramaje",
      colors: ["blanco", "kraft", "negro", "rojo", "fucsia", "azul", "rosado"],
      prints: [0, 1, 2, 4], min: 300, reusable: true,
      images: ["bolsas/papel-tua", "bolsas/papel-memo", "bolsas/papel-encantadas"]
    },
    {
      id: "rollo", slug: "bolsas-en-rollo-con-dispensador", shape: "rollo", icon: "rollo",
      es: { name: "Bolsas en rollo con dispensador", short: "Precortadas: despacho rápido en caja.",
            desc: "Bolsas troqueladas y precortadas en rollo, impresas con tu marca, con dispensador para el punto de pago. Agilizan la atención en almacenes de alto flujo.",
            uses: ["Almacenes de ropa y calzado", "Cadenas y franquicias", "Puntos de pago de alto flujo", "Bodegas y despachos"],
            material: "Polietileno de baja densidad (PEBD)" },
      en: { name: "Bags on a roll + dispenser", short: "Pre-cut on a roll: faster checkout.",
            desc: "Die-cut, pre-perforated bags on a roll, printed with your brand, plus a counter dispenser. Speeds up service in high-traffic stores.",
            uses: ["Clothing and shoe stores", "Chains and franchises", "High-traffic checkouts", "Warehouses and shipping"],
            material: "Low-density polyethylene (LDPE)" },
      sizes: [[12, 18], [15, 20], [16, 24], [18, 26], [20, 30]], def: [16, 24],
      calibres: ["2", "2.5", "3"], defCal: "2.5",
      colors: ["blanco", "natural", "negro", "fucsia", "azul", "rojo", "amarillo"],
      prints: [0, 1, 2, 3, 4], min: 1000,
      images: ["bolsas/rollo-dispensador-rs", "fotos/rollo-tienda"]
    },
    {
      id: "alimentos", slug: "bolsas-para-alimentos", shape: "plana", icon: "alimentos",
      es: { name: "Bolsas para alimentos en rollo", short: "Fruver, carnes, granos y panadería.",
            desc: "Bolsas planas en rollo o en paquete, transparentes o naturales, para frutas, verduras, carnes, granos y panadería. Grado alimentario, con o sin impresión.",
            uses: ["Fruver y supermercados", "Carnicerías y pollerías", "Graneros y panaderías", "Plazas de mercado"],
            material: "Polietileno de alta o baja densidad, grado alimentario" },
      en: { name: "Food bags on a roll", short: "Produce, meat, grains and bakery.",
            desc: "Flat bags on a roll or in packs, clear or natural, for produce, meat, grains and bakery. Food-grade, plain or printed.",
            uses: ["Produce and supermarkets", "Butchers and poultry", "Grocers and bakeries", "Farmers' markets"],
            material: "Food-grade high or low-density polyethylene" },
      sizes: [[6, 11], [8, 12], [10, 15], [12, 18], [15, 20], [20, 30]], def: [10, 15],
      calibres: ["0.8", "1", "1.5", "2"], defCal: "1",
      colors: ["natural", "blanco", "amarillo", "rojo", "verde"],
      prints: [0, 1, 2], min: 1000,
      images: ["fotos/fruver-mano", "fotos/fruver-rollo", "fotos/carniceria"]
    },
    {
      id: "industrial", slug: "bolsas-industriales-y-pelicula", shape: "basura", icon: "industrial",
      es: { name: "Bolsas industriales y película", short: "Bolsas de basura, lámina y rollos a medida.",
            desc: "Bolsas de basura con el código de colores de residuos (blanco, negro y verde), bolsas industriales de alto calibre y película de polietileno en rollo para embalaje, construcción y agro.",
            uses: ["Conjuntos residenciales y empresas", "Construcción y obras", "Agro y fincas cafeteras", "Bodegas y embalaje"],
            material: "Polietileno de baja densidad, virgen o reciclado" },
      en: { name: "Industrial bags & film", short: "Trash bags, film and custom rolls.",
            desc: "Trash bags in the waste color code (white, black and green), heavy-duty industrial bags and polyethylene film on rolls for packaging, construction and agriculture.",
            uses: ["Residential complexes and companies", "Construction sites", "Agro and coffee farms", "Warehouses and packing"],
            material: "Virgin or recycled low-density polyethylene" },
      sizes: [[15, 20], [18, 26], [20, 30]], def: [20, 30],
      calibres: ["1.5", "2", "3", "4", "6"], defCal: "2",
      colors: ["negro", "blanco", "verde", "natural", "gris", "rojo"],
      prints: [0, 1, 2], min: 1000,
      images: ["bolsas/pelicula-negra", "bolsas/pelicula-blanca", "fotos/fabrica-extrusion"]
    }
  ];

  /* ---------- Guía de medidas (centímetros) ----------
     Línea estándar de 6 × 11 a 20 × 30 cm; lo demás se cotiza como medida especial. */
  const SIZE_RANGE = { minW: 6, maxW: 20, minH: 11, maxH: 30 };
  const SIZE_GUIDE = [
    { w: 6,  h: 11, es: "Joyería, bisutería, accesorios", en: "Jewelry, trinkets, accessories" },
    { w: 8,  h: 12, es: "Celulares, accesorios, cosméticos pequeños", en: "Phones, accessories, small cosmetics" },
    { w: 10, h: 15, es: "Droguería, panadería, detalles", en: "Pharmacy, bakery, small gifts" },
    { w: 12, h: 18, es: "Cosméticos, ropa interior, accesorios", en: "Cosmetics, underwear, accessories" },
    { w: 15, h: 20, es: "Perfumería, comidas, libros pequeños", en: "Fragrance, take-out, small books" },
    { w: 16, h: 24, es: "Camisetas dobladas, regalos", en: "Folded T-shirts, gifts" },
    { w: 18, h: 26, es: "Ropa doblada, droguería, domicilios", en: "Folded clothing, pharmacy, delivery" },
    { w: 20, h: 30, es: "Ropa, calzado infantil, mercado liviano", en: "Clothing, kids' shoes, light groceries" }
  ];

  const QUANTITIES = [200, 500, 1000, 2000, 3000, 5000, 10000, 20000, 50000];

  /* ---------- Zonas de entrega (tiempos aproximados tras producción) ---------- */
  const ZONES = {
    1: { es: "Entrega directa en 24–48 h hábiles", en: "Direct delivery in 1–2 business days" },
    2: { es: "1 a 2 días hábiles", en: "1–2 business days" },
    3: { es: "2 a 4 días hábiles", en: "2–4 business days" },
    4: { es: "3 a 6 días hábiles por transportadora", en: "3–6 business days by courier" }
  };
  const PRODUCTION = { es: "8 a 15 días hábiles después de aprobar el boceto (según tipo y cantidad)",
                       en: "8–15 business days after artwork approval (depending on type and quantity)" };

  /* ---------- Departamentos con página propia ---------- */
  const DEPARTMENTS = [
    { id: "quindio", name: "Quindío", slug: "bolsas-plasticas-quindio", zone: 1,
      blurb: "Somos del Quindío y aquí está nuestra ruta de entrega directa: los 12 municipios del departamento, de Armenia a Génova, con despacho rápido y asesoría en tu negocio." },
    { id: "risaralda", name: "Risaralda", slug: "bolsas-plasticas-risaralda", zone: 2,
      blurb: "Pereira y el área metropolitana son el gran centro comercial del Eje Cafetero. Abastecemos almacenes, mayoristas, industria y comercio de barrio con despachos frecuentes desde el Quindío." },
    { id: "caldas", name: "Caldas", slug: "bolsas-plasticas-caldas", zone: 2,
      blurb: "De Manizales a Chinchiná, llevamos bolsas personalizadas para comercio, universidades, cooperativas cafeteras y eventos, con tiempos de entrega cortos." },
    { id: "valle", name: "Valle del Cauca", slug: "bolsas-plasticas-valle-del-cauca", zone: 2,
      blurb: "El norte del Valle está a minutos del Quindío: Cartago, Caicedonia, Sevilla, Zarzal y La Unión reciben entrega rápida, y despachamos de forma programada a Tuluá, Buga y Cali." },
    { id: "tolima", name: "Tolima", slug: "bolsas-plasticas-tolima", zone: 3,
      blurb: "Cruzando La Línea llegamos a Ibagué y al Tolima con bolsas personalizadas para comercio, centros comerciales y eventos." }
  ];

  /* ---------- Ciudades con página SEO propia ----------
     km: distancia aproximada por carretera desde Armenia                  */
  const CITIES = [
    // Quindío
    { slug: "armenia", name: "Armenia", dept: "quindio", zone: 1, km: 0, featured: true,
      blurb: "Armenia es nuestra base de despacho: atendemos el centro, la Avenida Bolívar, la Carrera 14, los centros comerciales y las zonas industriales con entrega directa." },
    { slug: "calarca", name: "Calarcá", dept: "quindio", zone: 1, km: 7, featured: true,
      blurb: "En Calarcá abastecemos almacenes del centro, graneros, panaderías y negocios de la vía al Tolima, a solo minutos de Armenia." },
    { slug: "montenegro", name: "Montenegro", dept: "quindio", zone: 1, km: 12,
      blurb: "Montenegro y el corredor del Parque del Café: bolsas para tiendas de recuerdos, restaurantes, alojamientos y comercio local." },
    { slug: "quimbaya", name: "Quimbaya", dept: "quindio", zone: 1, km: 20,
      blurb: "Quimbaya, con su comercio y la ruta turística hacia Panaca: bolsas para almacenes, droguerías, artesanías y hoteles campestres." },
    { slug: "la-tebaida", name: "La Tebaida", dept: "quindio", zone: 1, km: 17,
      blurb: "La Tebaida, vecina del aeropuerto El Edén: empaques para el comercio local, parques temáticos y negocios de la vía a Cali." },
    { slug: "circasia", name: "Circasia", dept: "quindio", zone: 1, km: 13,
      blurb: "Circasia, el municipio libre: bolsas para tiendas del centro, cafés, panaderías y comercio de la vía a Pereira." },
    { slug: "filandia", name: "Filandia", dept: "quindio", zone: 1, km: 26,
      blurb: "Filandia y su comercio artesanal y cafetero: bolsas de papel, TNT y troqueladas para tiendas de artesanías, cafés de origen y hoteles boutique." },
    { slug: "salento", name: "Salento", dept: "quindio", zone: 1, km: 24,
      blurb: "Salento y el Valle de Cocora reciben visitantes todo el año: bolsas reutilizables y de papel con tu marca para tiendas, cafés y hostales de la Calle Real." },
    { slug: "cordoba", name: "Córdoba", dept: "quindio", zone: 1, km: 25,
      blurb: "En Córdoba, Quindío, llevamos bolsas para graneros, tiendas y productores agrícolas de la cordillera." },
    { slug: "pijao", name: "Pijao", dept: "quindio", zone: 1, km: 32,
      blurb: "Pijao, municipio Cittaslow: empaques sostenibles para comercio local, cafés de origen y productores de la región." },
    { slug: "buenavista", name: "Buenavista", dept: "quindio", zone: 1, km: 30,
      blurb: "Buenavista, el mirador del Quindío: bolsas para tiendas, cafés especiales y negocios turísticos." },
    { slug: "genova", name: "Génova", dept: "quindio", zone: 1, km: 50,
      blurb: "Génova, en el sur cordillerano del Quindío: bolsas para tiendas, productores de café y comercio local." },
    // Risaralda
    { slug: "pereira", name: "Pereira", dept: "risaralda", zone: 2, km: 45, featured: true,
      blurb: "Pereira, la ciudad comercial del Eje: bolsas para almacenes del centro, la Circunvalar, centros comerciales y distribuidores mayoristas." },
    { slug: "dosquebradas", name: "Dosquebradas", dept: "risaralda", zone: 2, km: 50,
      blurb: "Dosquebradas y su zona industrial: bolsas camiseta, troqueladas y película industrial para fábricas, bodegas y comercio." },
    { slug: "santa-rosa-de-cabal", name: "Santa Rosa de Cabal", dept: "risaralda", zone: 2, km: 60,
      blurb: "Santa Rosa de Cabal, tierra de chorizos y termales: bolsas para alimentos, carnicerías, restaurantes y negocios turísticos." },
    { slug: "la-virginia", name: "La Virginia", dept: "risaralda", zone: 2, km: 75,
      blurb: "La Virginia: bolsas para comercio local, graneros y negocios a orillas del río Cauca." },
    // Caldas
    { slug: "manizales", name: "Manizales", dept: "caldas", zone: 2, km: 95, featured: true,
      blurb: "Manizales: bolsas personalizadas para el comercio de El Cable y el centro, universidades y grandes eventos como la Feria de Manizales." },
    { slug: "chinchina", name: "Chinchiná", dept: "caldas", zone: 2, km: 70,
      blurb: "Chinchiná, corazón cafetero de Caldas: bolsas para comercio, cooperativas y productores." },
    { slug: "villamaria", name: "Villamaría", dept: "caldas", zone: 2, km: 95,
      blurb: "Villamaría: bolsas para tiendas, panaderías y negocios vecinos de Manizales." },
    // Valle del Cauca
    { slug: "cartago", name: "Cartago", dept: "valle", zone: 2, km: 60, featured: true,
      blurb: "Cartago, capital del bordado: bolsas para almacenes de bordados, ropa y calzado, a cerca de una hora de Armenia." },
    { slug: "caicedonia", name: "Caicedonia", dept: "valle", zone: 2, km: 45,
      blurb: "Caicedonia, vecina del Quindío: bolsas con entrega rápida para comercio, graneros y droguerías." },
    { slug: "sevilla", name: "Sevilla", dept: "valle", zone: 2, km: 70,
      blurb: "Sevilla, capital cafetera del Valle: bolsas para tiendas, cafés y comercio local." },
    { slug: "zarzal", name: "Zarzal", dept: "valle", zone: 2, km: 75,
      blurb: "Zarzal: bolsas para comercio, agroindustria y negocios de la vía Panamericana." },
    { slug: "la-union", name: "La Unión", dept: "valle", zone: 2, km: 85,
      blurb: "La Unión, tierra de uvas del Valle: bolsas para comercio, viveros y productores agrícolas." },
    { slug: "roldanillo", name: "Roldanillo", dept: "valle", zone: 2, km: 95,
      blurb: "Roldanillo: bolsas para el comercio local, la agroindustria y el turismo de parapente." },
    { slug: "tulua", name: "Tuluá", dept: "valle", zone: 3, km: 120, featured: true,
      blurb: "Tuluá, corazón del Valle: bolsas para su comercio mayorista, la galería y los almacenes del centro." },
    { slug: "buga", name: "Buga", dept: "valle", zone: 3, km: 150,
      blurb: "Buga, ciudad señora y destino de peregrinos: bolsas para almacenes, tiendas de recuerdos y comercio del centro histórico." },
    { slug: "cali", name: "Cali", dept: "valle", zone: 3, km: 190, featured: true,
      blurb: "Cali: bolsas personalizadas para marcas de moda y calzado, droguerías, cosméticos y eventos, con despacho programado desde el Eje Cafetero." },
    // Tolima
    { slug: "ibague", name: "Ibagué", dept: "tolima", zone: 3, km: 85, featured: true,
      blurb: "Ibagué, capital musical de Colombia: bolsas para comercio, centros comerciales y eventos culturales, cruzando La Línea." }
  ];

  /* ---------- Otros departamentos (selector de envío) ---------- */
  const OTHER_REGIONS = [
    ["Antioquia", 3], ["Bogotá D.C.", 3], ["Cundinamarca", 3], ["Huila", 3], ["Cauca", 3], ["Chocó", 4],
    ["Amazonas", 4], ["Arauca", 4], ["Atlántico", 4], ["Bolívar", 4], ["Boyacá", 4], ["Caquetá", 4],
    ["Casanare", 4], ["Cesar", 4], ["Córdoba (departamento)", 4], ["Guainía", 4], ["Guaviare", 4],
    ["La Guajira", 4], ["Magdalena", 4], ["Meta", 4], ["Nariño", 4], ["Norte de Santander", 4],
    ["Putumayo", 4], ["San Andrés y Providencia", 4], ["Santander", 4], ["Sucre", 4], ["Vaupés", 4], ["Vichada", 4]
  ];

  /* ---------- Sectores ---------- */
  const SECTORS = [
    { icon: "👗", es: "Moda y boutiques", en: "Fashion & boutiques", rec: ["troquelada", "flexible", "papel"] },
    { icon: "👟", es: "Calzado", en: "Shoe stores", rec: ["flexible", "troquelada", "camiseta"] },
    { icon: "💊", es: "Droguerías y cosméticos", en: "Pharmacies & cosmetics", rec: ["troquelada", "camiseta"] },
    { icon: "🛒", es: "Supermercados y fruver", en: "Supermarkets & produce", rec: ["camiseta", "alimentos", "tnt"] },
    { icon: "🥩", es: "Carnicerías y pollerías", en: "Butchers & poultry", rec: ["alimentos", "camiseta"] },
    { icon: "🍔", es: "Restaurantes y domicilios", en: "Restaurants & delivery", rec: ["camiseta", "papel"] },
    { icon: "🥖", es: "Panaderías", en: "Bakeries", rec: ["alimentos", "camiseta"] },
    { icon: "🎉", es: "Eventos y ferias", en: "Events & fairs", rec: ["tnt", "flexible"] },
    { icon: "🏢", es: "Empresas y marcas", en: "Companies & brands", rec: ["tnt", "papel", "flexible"] },
    { icon: "☕", es: "Café, agro y fincas", en: "Coffee, agro & farms", rec: ["industrial", "tnt"] },
    { icon: "🏘️", es: "Conjuntos residenciales", en: "Residential complexes", rec: ["industrial"] },
    { icon: "🎁", es: "Regalos y detalles", en: "Gifts & treats", rec: ["papel", "troquelada"] }
  ];

  /* ---------- Preguntas frecuentes ---------- */
  const FAQ = [
    { q: { es: "¿Cuál es el pedido mínimo?", en: "What is the minimum order?" },
      a: { es: "Depende del tipo de bolsa y de la impresión. Como referencia, las bolsas plásticas impresas se producen desde 1.000 unidades, y las ecológicas TNT y de papel desde 200–300 unidades. Escríbenos y te confirmamos el mínimo exacto para tu pedido.",
           en: "It depends on the bag type and printing. As a guide, printed plastic bags start at 1,000 units, and non-woven or paper bags at 200–300 units. Message us and we'll confirm the exact minimum for your order." } },
    { q: { es: "¿Qué medidas manejan?", en: "Which sizes do you make?" },
      a: { es: "Nuestra línea estándar va desde 6 × 11 hasta 20 × 30 cm (ancho × alto). Si necesitas una bolsa más grande o con fuelle, la cotizamos como medida especial. En el diseñador puedes probar tu medida y compararla a tamaño real.",
           en: "Our standard line goes from 6 × 11 up to 20 × 30 cm (width × height). Need a larger bag or a gusset? We quote it as a custom size. In the designer you can try your size and compare it at real scale." } },
    { q: { es: "¿Cuánto tarda mi pedido?", en: "How long does my order take?" },
      a: { es: "La producción toma aproximadamente de 8 a 15 días hábiles después de aprobar el boceto, según el tipo y la cantidad. En el Quindío entregamos directamente en 24–48 horas hábiles; al resto del Eje Cafetero, de 1 a 2 días, y a toda Colombia por transportadora.",
           en: "Production takes about 8–15 business days after artwork approval, depending on type and quantity. In Quindío we deliver directly within 1–2 business days; elsewhere in the Coffee Region in 1–2 days, and nationwide by courier." } },
    { q: { es: "¿En qué formato envío mi logo o diseño?", en: "Which file format should I send?" },
      a: { es: "Lo ideal es un archivo vectorial (AI, PDF, SVG o EPS). También recibimos PNG o JPG en buena resolución. Si no tienes diseño, nuestro equipo te ayuda a adaptarlo para impresión.",
           en: "A vector file is best (AI, PDF, SVG or EPS). We also accept high-resolution PNG or JPG. No design yet? Our team will help you prepare it for print." } },
    { q: { es: "¿Me muestran un boceto antes de producir?", en: "Do I get a proof before production?" },
      a: { es: "Sí. Antes de producir te enviamos un boceto digital con medidas, colores y ubicación del logo para tu aprobación. No producimos nada sin tu visto bueno.",
           en: "Yes. Before production we send a digital proof with size, colors and logo placement for your approval. Nothing is produced without your OK." } },
    { q: { es: "¿Hacen envíos a toda Colombia?", en: "Do you ship across Colombia?" },
      a: { es: "Sí. Nos especializamos en el Eje Cafetero y sus alrededores (Quindío, Risaralda, Caldas, norte del Valle y Tolima) con entrega rápida, y despachamos a cualquier ciudad del país por transportadora.",
           en: "Yes. We specialize in the Coffee Region and surroundings (Quindío, Risaralda, Caldas, northern Valle and Tolima) with fast delivery, and ship anywhere in Colombia by courier." } },
    { q: { es: "¿Sus bolsas cumplen la Ley 2232 de 2022?", en: "Do your bags comply with Law 2232 of 2022?" },
      a: { es: "Desde el 7 de julio de 2024 la Ley 2232 de 2022 prohíbe varias bolsas plásticas de un solo uso, como las de punto de pago, con excepciones como las bolsas reutilizables y algunas para alimentos. Te asesoramos para elegir la opción adecuada para tu negocio: manija flexible de calibre alto, TNT, papel o bolsas para alimentos. Esta información es orientativa.",
           en: "Since July 7, 2024, Colombia's Law 2232 of 2022 bans several single-use plastic bags, such as checkout bags, with exceptions like reusable bags and some food bags. We'll help you choose the right option for your business: heavy-gauge soft-loop, non-woven, paper or food bags. This information is for guidance only." } },
    { q: { es: "¿Qué es el calibre de una bolsa?", en: "What is bag gauge?" },
      a: { es: "Es el grosor de la película plástica. A mayor calibre, más resistencia y más usos. Para bolsas reutilizables recomendamos calibres altos; para alimentos o productos livianos, calibres bajos.",
           en: "It's the thickness of the plastic film. Higher gauge means more strength and more reuse. We recommend heavy gauges for reusable bags and lighter gauges for food or light items." } },
    { q: { es: "¿Puedo pedir bolsas sin logo?", en: "Can I order plain bags?" },
      a: { es: "Claro. Todas nuestras bolsas están disponibles lisas, sin impresión, en los colores disponibles para cada tipo.",
           en: "Of course. All our bags are available plain, without printing, in the colors available for each type." } },
    { q: { es: "¿Cómo pago mi pedido?", en: "How do I pay?" },
      a: { es: "Te confirmamos las condiciones en la cotización. Normalmente se trabaja con un anticipo para iniciar la producción y el saldo contra entrega, por transferencia, Nequi, Daviplata o efectivo.",
           en: "Terms are confirmed in your quote. Usually an advance payment starts production and the balance is paid on delivery, by bank transfer, Nequi, Daviplata or cash." } }
  ];

  /* ---------- Galería (fotos reales de referencia) ---------- */
  const GALLERY = [
    { src: "bolsas/troquelada-zona-sport", type: "troquelada" },
    { src: "bolsas/manija-flexible-calzado", type: "flexible" },
    { src: "bolsas/camiseta-amarilla", type: "camiseta" },
    { src: "bolsas/tnt-colores", type: "tnt" },
    { src: "bolsas/papel-tua", type: "papel" },
    { src: "bolsas/troquelada-krika", type: "troquelada" },
    { src: "bolsas/manija-flexible-cheap", type: "flexible" },
    { src: "bolsas/rollo-dispensador-rs", type: "rollo" },
    { src: "bolsas/camiseta-olimpica", type: "camiseta" },
    { src: "bolsas/tnt-bodylogic", type: "tnt" },
    { src: "bolsas/papel-memo", type: "papel" },
    { src: "bolsas/troquelada-bahia", type: "troquelada" },
    { src: "bolsas/manija-flexible-zona-secreta", type: "flexible" },
    { src: "bolsas/camiseta-unitex", type: "camiseta" },
    { src: "bolsas/tnt-tradecorp", type: "tnt" },
    { src: "bolsas/papel-encantadas", type: "papel" },
    { src: "fotos/rollo-tienda", type: "rollo" },
    { src: "fotos/fruver-mano", type: "alimentos" },
    { src: "fotos/carniceria", type: "alimentos" },
    { src: "bolsas/pelicula-negra", type: "industrial" },
    { src: "bolsas/pelicula-blanca", type: "industrial" },
    { src: "fotos/fabrica-extrusion", type: "industrial" }
  ];

  /* ---------- Coordenadas aproximadas (mapa de cobertura) ---------- */
  const COORDS = {
    armenia: [4.534, -75.681], calarca: [4.519, -75.643], montenegro: [4.566, -75.751], quimbaya: [4.623, -75.763],
    "la-tebaida": [4.452, -75.788], circasia: [4.619, -75.636], filandia: [4.674, -75.658], salento: [4.637, -75.570],
    cordoba: [4.392, -75.688], pijao: [4.334, -75.705], buenavista: [4.360, -75.739], genova: [4.207, -75.790],
    pereira: [4.813, -75.696], dosquebradas: [4.839, -75.667], "santa-rosa-de-cabal": [4.869, -75.621], "la-virginia": [4.899, -75.882],
    manizales: [5.068, -75.517], chinchina: [4.985, -75.604], villamaria: [5.045, -75.515],
    cartago: [4.746, -75.911], caicedonia: [4.333, -75.832], sevilla: [4.268, -75.931], zarzal: [4.392, -76.071],
    "la-union": [4.533, -76.103], roldanillo: [4.413, -76.154], tulua: [4.084, -76.195], buga: [3.901, -76.297],
    cali: [3.452, -76.532], ibague: [4.438, -75.232]
  };

  function product(id) { return PRODUCTS.find(p => p.id === id) || PRODUCTS[0]; }
  function cmToIn(v) { return Math.round((v / 2.54) * 10) / 10; }
  function cityBySlug(slug) { return CITIES.find(c => c.slug === slug); }
  function dept(id) { return DEPARTMENTS.find(d => d.id === id); }

  return { COLORS, INKS, PRINT, PRODUCTS, SIZE_RANGE, SIZE_GUIDE, QUANTITIES, ZONES, PRODUCTION,
           DEPARTMENTS, CITIES, OTHER_REGIONS, SECTORS, FAQ, GALLERY, COORDS,
           product, cmToIn, cityBySlug, dept };
})();
