// ===== CARTA FIJA (no cambia, se queda en el código) =====
const CARTA_LOCAL = {
  polleria: [
    { nombre: "1/4 de Pollo a la Brasa", desc: "Con papas fritas y ensalada", precio: 15.00, img: "assets/img/pollo-cuarto.jpg" },
    { nombre: "1/2 Pollo a la Brasa",    desc: "Con papas fritas y ensalada", precio: 25.00, img: "assets/img/pollo-medio.jpg" },
    { nombre: "Octavo de Pollo",         desc: "Porción individual",          precio: 9.99,  img: "assets/img/pollo-octavo.jpg" },
    { nombre: "Pollo Entero",            desc: "Con papas fritas y ensalada", precio: 45.00, img: "assets/img/pollo-entero.jpg" }
  ],
  alitas: {
    desc: "Con papas fritas y cremas",
    sabores: ["BBQ", "Maracuyá", "Acevichada", "Broster"],
    items: [
      { nombre: "6 Alitas",  precio: 16.00, img: "assets/img/alitas.jpg" },
      { nombre: "10 Alitas", precio: 28.00, img: "assets/img/alitas.jpg" },
      { nombre: "15 Alitas", precio: 40.00, img: "assets/img/alitas.jpg" },
      { nombre: "20 Alitas", precio: 55.00, img: "assets/img/alitas.jpg" }
    ]
  },
  promos: [
    { nombre: "PROMO Pollo Entero + Gaseosa 1L", desc: "Pollo entero, papas fritas, ensalada, chaufa y gaseosa de 1 litro", precio: 55.00, img: "assets/img/promo.png", fit: "contain" }
  ],
  carta: [
    { nombre: "Ceviche Mixto La Caleta", desc: "Pescado y mariscos con leche de tigre", precio: 25.00, img: "assets/img/ceviche.jpg" },
    { nombre: "Chicharrón de Pescado",   desc: "Crocante, con yuca y sarsa criolla",    precio: 24.00, img: "assets/img/chicharron.jpg" }
  ],
  bebidas: [
    { nombre: "Gaseosa Personal", precio: 3.00,  img: "assets/img/gaseosa.jpg" },
    { nombre: "Gaseosa Gordita",  precio: 5.00,  img: "assets/img/gaseosa.jpg" },
    { nombre: "Gaseosa 1 Litro",  precio: 7.00,  img: "assets/img/gaseosa.jpg" },
    { nombre: "Gaseosa 2 Litros", precio: 10.00, img: "assets/img/gaseosa.jpg" },
    { nombre: "Jarra de Chicha Morada (1L)", precio: 10.00, img: "assets/img/chicha.jpg" }
  ],
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