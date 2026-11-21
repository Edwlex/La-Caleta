// ===== CARTA FIJA (no cambia, se queda en el código) =====
const CARTA_LOCAL = {
  polleria: [
    { nombre: "1/4 de Pollo a la Brasa", desc: "Con papas fritas y ensalada", precio: 15.00, img: "assets/img/pollo-cuarto.jpg" },
    { nombre: "1/2 Pollo a la Brasa",    desc: "Con papas fritas y ensalada", precio: 25.00, img: "assets/img/medio pollo.webp" },
    { nombre: "Octavo de Pollo",         desc: "Porción individual",          precio: 9.99,  img: "assets/img/pollo-octavo.jpg" },
    { nombre: "Pollo Entero",            desc: "Con papas fritas y ensalada", precio: 45.00, img: "assets/img/pollo entero.webp" }
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
      { nombre: "Simple" , precio: 30.00, img: "assets/img/ceviche.jpg" },
      { nombre: "Mixto" , precio: 35.00, img: "assets/img/ceviche.jpg" },
      { nombre: "Fuente Simple" , precio: 60.00, img: "assets/img/ceviche.jpg" },
      { nombre: "Fuente Mixta" , precio: 70.00, img: "assets/img/ceviche.jpg" },
      { nombre: "Leche de Tigre" , precio: 15.00, img: "assets/img/ceviche.jpg" }
    
    ],
    arroces: [
      { nombre: "Arroz c/Mariscos", precio: 32.00, img: "assets/img/archivo.jpg" },
      { nombre: "Chaufa de Mariscos", precio: 32.00, img: "assets/img/archivo.jpg" },
      { nombre: "Arroz y Langostinos", precio: 35.00, img: "assets/img/archivo.jpg" },
    ],
    fritos: [
      { nombre: "Cabrilla Frita", precio: 30.00, img: "assets/img/archivo.jpg" },
      { nombre: "Chita Frita", precio: 30.00, img: "assets/img/archivo.jpg" },
      { nombre: "Zuco", precio: 30.00, img: "assets/img/archivo.jpg" },
    ],
    sudados: [
      { nombre: "Cabrilla", precio: 30.00, img: "assets/img/archivo.jpg" },
      { nombre: "Chita", precio: 30.00, img: "assets/img/archivo.jpg" },
      { nombre: "Chilcano", precio: 20.00, img: "assets/img/archivo.jpg" },
      { nombre: "Picante de Mariscos", precio: 30.00, img: "assets/img/archivo.jpg" },
      { nombre: "Pahuela", precio: 40.00, img: "assets/img/archivo.jpg" },
    ],
    chicharrones: [
      { nombre: "Simple", precio: 30.00, img: "assets/img/archivo.jpg" },
      { nombre: "Mixto", precio: 35.00, img: "assets/img/archivo.jpg" },
      { nombre: "Duo Marino", precio: 45.00, img: "assets/img/archivo.jpg" },
      { nombre: "Trio Marino", precio: 55.00, img: "assets/img/archivo.jpg" },
      { nombre: "Jalea", precio: 60.00, img: "assets/img/archivo.jpg" },
    ],
    criollos: [
      { nombre: "Pato", precio: 25.00, img: "assets/img/archivo.jpg" },
      { nombre: "Cabrito", precio: 25.00, img: "assets/img/archivo.jpg" },
      { nombre: "Lomo Saltado", precio: 20.00, img: "assets/img/archivo.jpg" },
      { nombre: "Filete de pollo", precio: 15.00, img: "assets/img/archivo.jpg" },
      { nombre: "Milanesa", precio: 15.00, img: "assets/img/archivo.jpg" },
      { nombre: "Churrasco", precio: 18.00, img: "assets/img/archivo.jpg" },
      { nombre: "Chuleta", precio: 18.00, img: "assets/img/archivo.jpg" },
    ]
  },
  // ===== BEBIDAS: agrega las que falten dentro de cada [ ] =====
  bebidas: {
    bebidas: [
      { nombre: "Agua", precio: 3.00,  img: "assets/img/gaseosa.jpg" },
      { nombre: "Inca cola de 1/2",  precio: 4.00,  img: "assets/img/gaseosa.jpg" },
      { nombre: "Coca cola de 1/2",  precio: 4.00,  img: "assets/img/gaseosa.jpg" },
      { nombre: "Coca cola de 1L", precio: 8.00, img: "assets/img/gaseosa.jpg" },
      { nombre: "Inka cola de 1L", precio: 8.00, img: "assets/img/chicha.jpg" },
      { nombre: "Coca cola de 2L", precio: 10.00, img: "assets/img/chicha.jpg" },
      { nombre: "Inka cola de 2L", precio: 10.00, img: "assets/img/chicha.jpg" },
    ],
    cervezas: [
      { nombre: "Trujillo", precio: 10.00, img: "assets/img/chicha.jpg" },
      { nombre: "Callao", precio: 10.00, img: "assets/img/chicha.jpg" },
      { nombre: "Negra", precio: 12.00, img: "assets/img/chicha.jpg" }
    ],
    refrescos:[
      { nombre: "Limonada Frozen 1L", precio: 15, img: "assets/img/limonada"}
    ]
  },
  extras: [
    { nombre: "Papas Fritas", precio: 8.00 },
    { nombre: "Ensalada", precio: 7.00 },
    { nombre: "Porción de Chaufa o Papas", precio: 10.00 },
    { nombre: "Crema de Ají", precio: 2.00 },
    { nombre: "Kétchup", precio: 1.50 }
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