// "BASE DE DATOS" editable. Los señores la cambian desde admin.html.
const MENU_DATA = {

  // ===== MENÚ DEL DÍA (cambia cada día; aquí va la plantilla semanal) =====
  // Cada día tiene su precio y una lista de platos con "disponible" (true/false).
  menuDelDia: {
    descripcion: "Entrada + Segundo + Refresco",
    semana: {
      lunes:    { precio: 12.00, activo: true,
        entradas: [{ nombre: "Sopa Criolla de la casa", disponible: true },
                   { nombre: "Papa a la Huancaína", disponible: true }],
        segundos: [{ nombre: "Lomo Saltado al Jugo", desc: "Con papas y arroz graneado", disponible: true },
                   { nombre: "Arroz con Pollo + Huancaína", desc: "Con sarsa criolla", disponible: true }] },
      martes:   { precio: 12.00, activo: true,
        entradas: [{ nombre: "Tequeños con Guacamole", disponible: true }],
        segundos: [{ nombre: "Ceviche de Pescado del Día", desc: "Camote, choclo y cancha", disponible: true },
                   { nombre: "Seco de Pollo con Frejoles", desc: "Porción generosa", disponible: true }] },
      miercoles:{ precio: 12.00, activo: true,
        entradas: [{ nombre: "Choros a la Chalaca", disponible: true }],
        segundos: [{ nombre: "Ají de Gallina", desc: "Con papa y arroz", disponible: true }] },
      jueves:   { precio: 12.00, activo: true,
        entradas: [{ nombre: "Papa a la Huancaína", disponible: true }],
        segundos: [{ nombre: "Tacaracacho con Carne", desc: "Frito, con sarza", disponible: true }] },
      viernes:  { precio: 12.00, activo: true,
        entradas: [{ nombre: "Sopa Criolla de la casa", disponible: true }],
        segundos: [{ nombre: "Arroz con Mariscos", desc: "Preparado al momento", disponible: true }] },
      sabado:   { precio: 13.00, activo: true,
        entradas: [{ nombre: "Ceviche de Pescado", disponible: true }],
        segundos: [{ nombre: "Chicharrón de Pescado", desc: "Con yuca y sarsa", disponible: true }] },
      domingo:  { precio: 13.00, activo: false, // ejemplo: domingo cerrado de menú
        entradas: [], segundos: [] }
    }
  },

  // ===== POLLERÍA (precios FIJOS, del flyer) =====
  polleria: [
    { nombre: "1/4 de Pollo a la Brasa", desc: "Con papas fritas y ensalada", precio: 15.00, img: "assets/img/pollo-cuarto.jpg" },
    { nombre: "1/2 Pollo a la Brasa",    desc: "Con papas fritas y ensalada", precio: 25.00, img: "assets/img/pollo-medio.jpg" },
    { nombre: "Octavo de Pollo",         desc: "Porción individual",          precio: 9.99,  img: "assets/img/pollo-octavo.jpg" },
    { nombre: "Pollo Entero",            desc: "Con papas fritas y ensalada", precio: 45.00, img: "assets/img/pollo-entero.jpg" }
  ],

  // ===== ALITAS CON PAPAS FRITAS (del flyer) =====
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

  // ===== PROMO (del flyer) =====
  promos: [
    { nombre: "PROMO Pollo Entero + Gaseosa 1L", desc: "Pollo entero, papas fritas, ensalada, chaufa y gaseosa de 1 litro", precio: 55.00, img: "assets/img/promo.png", fit: "contain" }
  ],

  // ===== CARTA / MARISCOS (completa con tus platos reales) =====
  carta: [
    { nombre: "Ceviche Mixto La Caleta", desc: "Pescado y mariscos con leche de tigre", precio: 25.00, img: "assets/img/ceviche.jpg" },
    { nombre: "Chicharrón de Pescado",   desc: "Crocante, con yuca y sarsa criolla",    precio: 24.00, img: "assets/img/chicharron.jpg" }
  ],

  // ===== BEBIDAS (del flyer; pon los precios reales) =====
  bebidas: [
    { nombre: "Gaseosa Personal", precio: 3.00,  img: "assets/img/gaseosa.jpg" },
    { nombre: "Gaseosa Gordita",  precio: 5.00,  img: "assets/img/gaseosa.jpg" },
    { nombre: "Gaseosa 1 Litro",  precio: 7.00,  img: "assets/img/gaseosa.jpg" },
    { nombre: "Gaseosa 2 Litros", precio: 10.00, img: "assets/img/gaseosa.jpg" },
    { nombre: "Jarra de Chicha Morada (1L)", precio: 10.00, img: "assets/img/chicha.jpg" }
  ],

  // ===== EXTRAS (del flyer) =====
  extras: [
    { nombre: "Papas Fritas",         precio: 8.00 },
    { nombre: "Ensalada",             precio: 7.00 },
    { nombre: "Porción de Chaufa o Papas", precio: 10.00 },
    { nombre: "Crema de Ají",         precio: 2.00 },
    { nombre: "Kétchup",              precio: 1.50 }
  ],

  // ===== RESEÑAS (seed de ejemplo; el público agrega desde la web) =====
  reseñas: [
    { nombre: "Cliente", estrellas: 5, texto: "El pollo bien jugoso y las porciones generosas.", fecha: "2026-11-10" }
  ]
};