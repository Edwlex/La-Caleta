// ===== CARTA FIJA (no cambia, se queda en el código) =====
const CARTA_LOCAL = {
  polleria: [
    { nombre: "1/8 de Pollo a la Brasa", desc: "Porción individual",          precio: 10.00,  img: "assets/img/octavo de pollo.webp" },
    { nombre: "1/4 de Pollo a la Brasa", desc: "Con papas fritas y ensalada", precio: 15.00, img: "assets/img/cuarto de pollo.webp" },
    { nombre: "1/2 Pollo a la Brasa",    desc: "Con papas fritas y ensalada", precio: 30.00, img: "assets/img/medio pollo.webp" },
    { nombre: "Pollo Entero",            desc: "Con papas fritas y ensalada", precio: 50.00, img: "assets/img/pollo entero.webp" },
    { nombre: "1/8 de Mostrito",         desc: "Con papas fritas y ensalada", precio: 12.00, img: "assets/img/mostrito 1-8.webp" },
    { nombre: "1/4 de Mostrito",         desc: "Con papas fritas y ensalada", precio: 18.00, img: "assets/img/mostrito 1-8.webp" }
  ],
  alitas: {
    desc: "Con papas fritas y cremas",
    sabores: ["BBQ", "Maracuyá", "Acevichada", "Broster"],
    items: [
      { nombre: "6 Alitas",  precio: 16.00, img: "assets/img/6 alitas.webp" },
      { nombre: "10 Alitas", precio: 28.00, img: "assets/img/10 alitas.webp" },
      { nombre: "15 Alitas", precio: 40.00, img: "assets/img/15 alitas.webp" },
      { nombre: "20 Alitas", precio: 55.00, img: "assets/img/20 alitas.webp" }
    ]
  },
  promos: [
    { nombre: "PROMO Pollo Entero + Gaseosa 1L", desc: "Pollo entero, papas fritas, ensalada, chaufa y gaseosa de 1 litro", precio: 55.00, img: "assets/img/promo.png", fit: "contain" }
  ],
  // ===== A LA CARTA: 6 secciones. Agrega los platos dentro de cada [ ] =====
  // Modelo: { nombre: "Nombre del plato", desc: "Descripción corta", precio: 0.00, img: "assets/img/archivo.jpg" },
  carta: {
    ceviches: [
      { nombre: "Simple" , precio: 30.00, img: "assets/img/simple.webp" },
      { nombre: "Mixto" , precio: 35.00, img: "assets/img/ceviche mixto.webp" },
      { nombre: "Combinado", precio: 12.00, img: "assets/img/combinado.webp" },
      { nombre: "Fuente Simple" , precio: 60.00, img: "assets/img/fuente-simple.webp" },
      { nombre: "Fuente Mixta" , precio: 70.00, img: "assets/img/fuente-mixta.webp" },
      { nombre: "Leche de Tigre" , precio: 15.00, img: "assets/img/leche de tigre.webp" }
    
    ],
    arroces: [
      { nombre: "Arroz c/Mariscos", precio: 32.00, img: "assets/img/arroz-mariscos.webp" },
      { nombre: "Chaufa de Mariscos", precio: 32.00, img: "assets/img/chaufa-mariscos.webp" },
      { nombre: "Arroz y Langostinos", precio: 35.00, img: "assets/img/arroz-langostinos.webp" },
      { nombre: "Picante de Mariscos", precio: 30.00, img: "assets/img/picante-mariscos.webp" },
    ],
    fritos: [
      { nombre: "Cabrilla Frita", precio: 30.00, img: "assets/img/cabrilla-frita.webp" },
      { nombre: "Chita Frita", precio: 30.00, img: "assets/img/chita-frita.webp" },
      { nombre: "Zuco", precio: 30.00, img: "assets/img/zuco.webp" },
    ],
    sudados: [
      { nombre: "Cabrilla", precio: 30.00, img: "assets/img/sudado-cabrilla.webp" },
      { nombre: "Chita", precio: 30.00, img: "assets/img/sudado-chita.webp" },
      { nombre: "Chilcano", precio: 20.00, img: "assets/img/chilcano.webp" },
      { nombre: "Parihuela", precio: 40.00, img: "assets/img/pahuela.webp" },
    ],
    chicharrones: [
      { nombre: "Simple", precio: 30.00, img: "assets/img/chicharron simple.webp" },
      { nombre: "Mixto", precio: 35.00, img: "assets/img/chicharron mixto.webp" },
      { nombre: "Duo Marino", precio: 45.00, img: "assets/img/duo-marino.webp" },
      { nombre: "Trio Marino", precio: 55.00, img: "assets/img/trio-marino.webp" },
      { nombre: "Jalea", precio: 60.00, img: "assets/img/chichaaron de jalea.webp" },
    ],
    criollos: [
      { nombre: "Pato Guisado", precio: 25.00, img: "assets/img/pato guisado.webp" },
      { nombre: "Cabrito", precio: 25.00, img: "assets/img/cabrito.webp" },
      { nombre: "Lomo Saltado", precio: 20.00, img: "assets/img/lomo saltado.webp" },
      { nombre: "Filete de pollo", precio: 15.00, img: "assets/img/filete de pollo.webp" },
      { nombre: "Milanesa", precio: 15.00, img: "assets/img/milanesa.webp" },
      { nombre: "Churrasco", precio: 18.00, img: "assets/img/churrasco.webp" },
      { nombre: "Chuleta", precio: 18.00, img: "assets/img/chuleta.webp" },
    ]
  },
  // ===== BEBIDAS: agrega las que falten dentro de cada [ ] =====
  bebidas: {
    gaseosas: [
      { nombre: "Agua", precio: 3.00,  img: "assets/img/san luis.webp" },
      { nombre: "Inca Kola de 1/2",  precio: 4.00,  img: "assets/img/inca kola.webp" },
      { nombre: "Coca cola de 1/2",  precio: 4.00,  img: "assets/img/coca cola.webp" },
      { nombre: "Coca cola de 1L", precio: 8.00, img: "assets/img/coca cola 1L.webp" },
      { nombre: "Inca Kola de 1L", precio: 8.00, img: "assets/img/inca kola 1L.webp" },
      { nombre: "Coca cola de 2L", precio: 10.00, img: "assets/img/coca cola 2L.webp" },
      { nombre: "Inca Kola de 2L", precio: 10.00, img: "assets/img/inca kola 2L.webp" },
    ],
    cervezas: [
      { nombre: "Trujillo", precio: 10.00, img: "assets/img/cerveza trujillo.webp" },
      { nombre: "Callao", precio: 10.00, img: "assets/img/pilsen.webp" },
      { nombre: "Negra", precio: 12.00, img: "assets/img/cerveza negra.webp" }
    ],
    refrescos:[
      { nombre: "Limonada Frozen 1L", precio: 15, img: "assets/img/frozen.webp" },
    ]
  },
  extras: [
    { nombre: "Papas Fritas", precio: 8.00, img: "assets/img/papas fritas.webp" },
    { nombre: "Ensalada", precio: 7.00, img: "assets/img/ensalada.webp" },
    { nombre: "Porción de Chaufa", precio: 10.00, img: "assets/img/chaufa.webp" },
    { nombre: "Crema de Ají", precio: 2.00, img: "assets/img/crema de aji.webp" },
    { nombre: "Kétchup", precio: 1.50, img: "assets/img/ketchup.webp" }
  ],
  reseñas: [
    { nombre: "Cliente", estrellas: 5, texto: "El pollo bien jugoso y las porciones generosas.", fecha: "2026-11-10" }
  ]
};

// ===== URL DE TU GOOGLE SHEETS =====
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbwgRthRqyQn9rg50oUgyi8VXcXdzN7ZM90R7TCQUbs0CpmpDlXbDpXhFhHc12eso_Oc/exec";

let MENU_DATA = null;

// Promesa global: la web ESPERA esto antes de pintar
const DATOS_LISTOS = (async () => {
  // 1. Empezamos con la carta local (siempre existe) y el menú vacío
  MENU_DATA = Object.assign({}, CARTA_LOCAL, { menuDelDia: { descripcion: "Entrada + Segundo + Refresco", semana: {} } });
  
  try {
    // 2. Intentamos traer el menú del día desde Google Sheets
    const r = await fetch(`${SHEET_API_URL}?t=${Date.now()}`);
    if (!r.ok) throw new Error("HTTP " + r.status);
    
    const google = JSON.parse(await r.text());
    if (google.__error) throw new Error(google.__error);
    
    // 3. Si llega bien, SOLO reemplazamos la parte del menú del día
    if (google.menuDelDia) {
      MENU_DATA.menuDelDia = google.menuDelDia;
    }
    console.log("✅ Menú del día cargado desde Google Sheets");
  } catch (err) {
    console.error("❌ Error cargando el menú del día (la carta local sí funcionará):", err);
    MENU_DATA.__error = err.message; 
  }
  
  return MENU_DATA;
})();

// Hacemos la promesa accesible globalmente para app.js
window.DATOS_LISTOS = DATOS_LISTOS;