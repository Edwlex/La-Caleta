// ===== Helpers =====
const MON = "S/";
const DIAS = ["domingo","lunes","martes","miercoles","jueves","viernes","sabado"];
const $ = id => document.getElementById(id);
function fmt(n){ return `${MON} ${Number(n).toFixed(2)}`; }
function hoy(){ return DIAS[new Date().getDay()]; }
function setText(id, txt){ const el = $(id); if(el) el.textContent = txt; }
function setHref(id, url){ const el = $(id); if(el) el.href = url; }
function html(id, content){ const el = $(id); if(el) el.innerHTML = content; }

function driveImg(url) {
  if (!url) return "";
  const m = url.match(/[-\w]{25,}/);
  if (!m) return url;
  return `https://drive.google.com/thumbnail?id=${m[0]}&sz=w800`;
}

function getMenu(){
  if (typeof MENU_DATA !== 'undefined' && MENU_DATA) return MENU_DATA;
  try { const g = localStorage.getItem('menuEdit'); return g ? JSON.parse(g) : {}; }
  catch(e){ return {}; }
}
const EMO={polleria:'🍗',alitas:'🔥',promos:'👑',extras:'🍟',bebidas:'🥤',ceviches:'🐟',arroces:'🍚',fritos:'🍤',sudados:'🍲',chicharrones:'🥘',criollos:'🍽️',refrescos:'🥤',cervezas:'🍺'};
const q=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
function img(o,cat){
  return `<div class="img-wrap" data-e="${EMO[cat]||'🍽️'}">
    <img src="${q(o.img||'')}" alt="${q(o.nombre)}" loading="lazy" class="${o.fit==='contain'?'fit-contain':''}" onerror="this.parentElement.classList.add('img-missing');this.remove()" />
  </div>`;
}

// ===== NAVEGACIÓN POR VISTAS (CORREGIDA) =====
const VIEWS = ['inicio', 'menu-dia', 'carta', 'nosotros', 'ubicacion']; // 'resenas' eliminado

function showView(name){
  if(!VIEWS.includes(name)) name = 'inicio';
  
  // Ya no hay trucos: si es menu-dia, muestra v-menu-dia. Si es carta, muestra v-carta.
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === 'v-' + name));
  document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('nav-on', a.dataset.nav === name));
  if(name !== 'menu-dia') mostrarMenuBar(false);

  
  window.scrollTo({top: 0});
  document.querySelectorAll('#v-' + name + ' .reveal').forEach((el, i) => setTimeout(() => el.classList.add('in'), 70 * i));
  
  const act = document.querySelector('.pill.nav-on'); 
  if(act) act.scrollIntoView({inline: 'center', block: 'nearest'});
}

function route(){ showView(location.hash.slice(1)); }

// ===== CONFIG =====
function cargarConfig(){
  setText('h-nombre', CONFIG.nombre);
  setText('f-nombre', CONFIG.nombre);
  const t = $('titulo'); if(t) t.textContent = `${CONFIG.nombre} | Restaurante & Pollería en Trujillo`;
  setHref('float-wa', `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Hola "+CONFIG.nombre+", quisiera hacer una consulta")}`);
  setText('hero-horario', `Abierto Hoy • ${CONFIG.horario}`);
  setText('u-direccion', CONFIG.direccion);
  setText('u-horario', CONFIG.horario);
  setText('u-telefono', CONFIG.telefono);
  setHref('u-maps', CONFIG.mapsLink);
  setHref('f-facebook', CONFIG.facebook);
  setText('taper-precio-txt', fmt(CONFIG.taperPrecio));
}


// ===== MENÚ DEL DÍA (LÓGICA: SEGUNDO OBLIGATORIO, ENTRADA OPCIONAL) =====
let seleccionMenu = { entradaIdx: -1, segundoIdx: -1 };

function renderMenuDelDia(){
  const m = getMenu();
  const dia = hoy();
  const d = m.menuDelDia?.semana?.[dia];
  const titulo = dia.charAt(0).toUpperCase() + dia.slice(1);
  const jugo = d && d.jugo ? `🥤 ${d.jugo}` : "🥤 Refresco";

  setText('md-hoy', `Hoy: ${titulo} • Entrada (Opcional) + Segundo + ${jugo}`);
  const contE = $('md-entradas'), contS = $('md-segundos'), vacio = $('md-vacio');
  if(contE) contE.innerHTML=''; if(contS) contS.innerHTML='';

  if(!d || !d.activo){
    setText('md-precio','Cerrado');
    setText('q-precio','Hoy no hay menú del día');
    if(vacio) vacio.classList.remove('hidden');
    mostrarMenuBar(false);
    return;
  }
  if(vacio) vacio.classList.add('hidden');

  const ent = (d.entradas||[]).filter(x=>x.disponible);
  const seg = (d.segundos||[]).filter(x=>x.disponible);

  // Precio "DESDE" (mínimo de los segundos)
  const precios = seg.map(s => parseFloat(s.precio || 0)).filter(p => p > 0);
  const minP = precios.length ? Math.min(...precios) : parseFloat(d.precio || 0);
  setText('md-precio', minP > 0 ? fmt(minP) : 'S/ --');
  setText('q-precio', minP > 0 ? `Hoy desde ${fmt(minP)}` : 'Ver menú de hoy');

  seleccionMenu = { entradaIdx: -1, segundoIdx: -1 };

  // ===== ENTRADAS =====
  if(contE && ent.length){
    contE.innerHTML = `<h3 class="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">1. Elige tu Entrada (Opcional)</h3>
      <div class="menu-grid-entradas">` +
      ent.map((e, i) => {
        const pE = parseFloat(e.precio || 0);
        return `<div class="menu-select-card entrada-card bg-[#06121a] border border-stone-800 rounded-xl overflow-hidden flex items-center gap-3 p-3" onclick="seleccionarEntrada(${i})" data-idx="${i}">
          <div class="check-badge">✓</div>
          ${e.img ? `<div class="w-16 h-16 rounded-lg overflow-hidden border border-stone-700 shrink-0"><img src="${q(e.img)}" alt="${q(e.nombre)}" class="w-full h-full object-cover" /></div>` : `<div class="w-16 h-16 rounded-lg bg-stone-800 flex items-center justify-center text-2xl shrink-0">🍽️</div>`}
          <div class="flex-1 min-w-0">
            <h4 class="font-display text-sm font-bold text-white leading-tight truncate">${q(e.nombre)}</h4>
            <span class="text-[10px] ${pE>0?'text-amber-400':'text-emerald-400'} font-bold">${pE>0?fmt(pE):'Incluida en el combo'}</span>
          </div>
        </div>`;
      }).join('') + `</div>`;
  }

  // ===== SEGUNDOS =====
  if(contS && seg.length){
    contS.innerHTML = `<h3 class="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 mt-6">2. Elige tu Segundo (Obligatorio)</h3>
      <div class="menu-grid-segundos">` +
      seg.map((s, i) => {
        const pS = parseFloat(s.precio || 0);
        return `<div class="menu-select-card segundo-card card-x flex flex-col overflow-hidden" onclick="seleccionarSegundo(${i})" data-idx="${i}">
          <div class="check-badge">✓</div>
          <div class="segundo-img-wrap">
            ${s.img ? `<img src="${q(s.img)}" alt="${q(s.nombre)}" loading="lazy" class="w-full h-full object-cover" />` : `<div class="flex items-center justify-center w-full h-full text-6xl">🍗</div>`}
          </div>
          <div class="p-4 flex flex-col justify-between gap-2 flex-1">
            <h4 class="text-base font-bold font-display text-white leading-tight">${q(s.nombre)}</h4>
            <span class="font-extrabold text-lg text-amber-400">${fmt(pS)}</span>
          </div>
        </div>`;
      }).join('') + `</div>`;
  }

  if(vacio && !ent.length && !seg.length) vacio.classList.remove('hidden');
  actualizarResumenMenu();
}




// ===== FUNCIONES DE CONTROL DE SELECCIÓN =====
function seleccionarEntrada(idx) {
  seleccionMenu.entradaIdx = (seleccionMenu.entradaIdx === idx) ? -1 : idx;
  actualizarUISeleccion();
}
function seleccionarSegundo(idx) {
  seleccionMenu.segundoIdx = (seleccionMenu.segundoIdx === idx) ? -1 : idx;
  actualizarUISeleccion();
}
function actualizarUISeleccion() {
  document.querySelectorAll('.entrada-card').forEach((card, i) => card.classList.toggle('selected', i === seleccionMenu.entradaIdx));
  document.querySelectorAll('.segundo-card').forEach((card, i) => card.classList.toggle('selected', i === seleccionMenu.segundoIdx));
  actualizarResumenMenu();
}

// Muestra/oculta la barra en vivo y evita que choque con la barra del carrito
function mostrarMenuBar(mostrar){
  const mb = $('menu-bar'), cb = $('cart-bar');
  if(mb){ mb.classList.toggle('show', mostrar); mb.setAttribute('aria-hidden', mostrar ? 'false' : 'true'); }
  if(cb){
    if(mostrar){
      cb.classList.remove('show');
    } else {
      // Re-sincroniza y muestra la barra del carrito con el total real
      actualizarVistaCarrito();
    }
  }
}

function actualizarResumenMenu(){
  const m = getMenu();
  const dia = hoy();
  const d = m.menuDelDia?.semana?.[dia];
  if(!d){ mostrarMenuBar(false); return; }

  const ent = (d.entradas||[]).filter(x=>x.disponible);
  const seg = (d.segundos||[]).filter(x=>x.disponible);

  const tieneEntrada = seleccionMenu.entradaIdx !== -1 && ent[seleccionMenu.entradaIdx];
  const tieneSegundo = seleccionMenu.segundoIdx !== -1 && seg[seleccionMenu.segundoIdx];

  // Solo aparece cuando eligieron al menos el segundo
  if(!tieneSegundo){ mostrarMenuBar(false); return; }

  let precioTotal = parseFloat(seg[seleccionMenu.segundoIdx].precio || 0);
  let nombre = seg[seleccionMenu.segundoIdx].nombre;
  let detalle = 'Solo segundo';
  let count = 1;

  if(tieneEntrada){
    precioTotal += parseFloat(ent[seleccionMenu.entradaIdx].precio || 0);
    nombre = `${ent[seleccionMenu.entradaIdx].nombre} + ${nombre}`;
    detalle = 'Entrada + Segundo';
    count = 2;
  }

  setText('mb-count', count);
  setText('mb-nombre', nombre);
  setText('mb-detalle', detalle);
  setText('mb-total', fmt(precioTotal));
  mostrarMenuBar(true);
}

function agregarMenuCompleto(){
  const m = getMenu();
  const dia = hoy();
  const d = m.menuDelDia?.semana?.[dia];
  if(!d || seleccionMenu.segundoIdx === -1) return;

  const ent = (d.entradas||[]).filter(x=>x.disponible);
  const seg = (d.segundos||[]).filter(x=>x.disponible);

  const segundoElegido = seg[seleccionMenu.segundoIdx];
  let precioTotal = parseFloat(segundoElegido.precio || 0);
  let nombreCombo = `Menú: ${segundoElegido.nombre}`;

  if(seleccionMenu.entradaIdx !== -1 && ent[seleccionMenu.entradaIdx]){
    const entradaElegida = ent[seleccionMenu.entradaIdx];
    precioTotal += parseFloat(entradaElegida.precio || 0);
    nombreCombo = `Menú: ${entradaElegida.nombre} + ${segundoElegido.nombre}`;
  }

  // Agregar al carrito (esto ya actualiza la barra del carrito)
  agregarAlCarrito(nombreCombo, precioTotal);

  // Resetear la selección
  seleccionMenu = { entradaIdx: -1, segundoIdx: -1 };
  document.querySelectorAll('.entrada-card,.segundo-card').forEach(c => c.classList.remove('selected'));

  // Ocultar la barra en vivo y mostrar la del carrito con el total real
  mostrarMenuBar(false);
  actualizarVistaCarrito();
}

// ===== CARTA: tabs Cena · A la carta · Bebidas =====
function card(o,cat,tag,sumarTaper=true){
  return `<div class="item-carta reveal"><article class="card-x tilt h-full flex flex-col">
    <div class="relative">${img(o,cat)}<span class="absolute top-3 right-3 bg-amber-400 text-stone-900 font-extrabold text-sm px-3 py-1 rounded-full shadow-lg">${fmt(o.precio)}</span></div>
    <div class="p-4 sm:p-5 flex-1 flex flex-col gap-1"><span class="text-[11px] font-bold uppercase tracking-wider text-amber-400">${q(tag)}</span>
      <h4 class="font-display text-xl font-bold text-white">${q(o.nombre)}</h4>
      <p class="text-sm text-stone-400 flex-1">${q(o.desc||'')}</p></div>
    <div class="px-4 sm:px-5 pb-4 sm:pb-5"><button data-add data-n="${q(o.nombre)}" data-p="${o.precio}" data-taper="${sumarTaper}" class="bg-orange-600 hover:bg-orange-500 w-full text-white font-bold py-3 rounded-xl active:scale-95 transition">+ Agregar al pedido</button></div>
  </article></div>`;
}

function panel(defs){
  const chips = defs.length>1 ? `<div class="chips">${defs.map((d,i)=>`<button data-sub="sec-${d.id}" class="${i===0?'on':''}">${d.ico} ${d.t}</button>`).join('')}</div>` : '';
  return chips + defs.map((d,i)=>`<section id="sec-${d.id}" class="seccion-menu${i===0?' active':''}">
    <div class="sec-head"><span class="sec-ico">${d.ico}</span><div><h3 class="font-display font-black text-2xl sm:text-3xl text-white leading-none">${d.t}</h3>${d.sub?`<p class="text-sm text-stone-400 mt-1">${q(d.sub)}</p>`:''}</div></div>
    ${d.items.length ? `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">${d.items.map(o=>card(o,d.id,d.t, !o._noTaper)).join('')}</div>` : '<p class="text-stone-400 italic">Pronto agregaremos platos aquí 🍽️</p>'}
  </section>`).join('');
}


function renderCarta(){
  const m = getMenu(), al = m.alitas||{}, C = m.carta||{};
  
  // ===== CENA (NO suman taper) =====
  html('tab-cena', panel([
    {id:'polleria', ico:'🍗', t:'Pollo a la brasa', items:(m.polleria||[]).map(p=>({...p, _noTaper:true}))},
    {id:'alitas',   ico:'🔥', t:'Alitas', sub:'Sabores: '+(al.sabores||[]).join(' • '), items:(al.items||[]).map(a=>({...a,desc:al.desc||'', _noTaper:true}))},
    {id:'promos',   ico:'👑', t:'Promos', items:(m.promos||[]).map(p=>({...p, _noTaper:true}))},
    {id:'extras',   ico:'🍟', t:'Extras', items:(m.extras||[]).map(e=>({...e,img:e.img||'', _noTaper:true}))}
  ]));
  
  // ===== A LA CARTA (SÍ suman taper) =====
  html('tab-carta', panel([['ceviches','🐟','Ceviches'],['arroces','🍚','Arroces'],['fritos','🍤','Fritos'],['sudados','🍲','Sudados'],['chicharrones','🥘','Chicharrones'],['criollos','🍽️','Criollos']]
    .map(([id,ico,t])=>({id,ico,t,items:C[id]||[]}))));
    
  // ===== BEBIDAS (NO suman taper) =====
  const B = Array.isArray(m.bebidas) ? {refrescos:m.bebidas} : (m.bebidas||{});
  const ICONOS_BEB = {gaseosas:'🥤', refrescos:'🍋', cervezas:'🍺', jugos:'🧃', chichas:'🍹', cocteles:'🍸'};
  
  const defsBeb = Object.keys(B)
    .map(id => ({
      id: id,
      ico: ICONOS_BEB[id] || '🥤',
      t: id.charAt(0).toUpperCase() + id.slice(1),
      items: (B[id] || []).map(b=>({...b, _noTaper:true}))
    }))
    .filter(d => d.items.length);
    
  html('tab-bebidas', panel(defsBeb));
}


// ===== TABS =====
let curTab = 'cena'; // Cambiado de 'menus' a 'cena'
function setTab(t){
  if(!$('tab-'+t)) t = 'cena'; // Fallback seguro
  curTab = t;
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-'+t));
  document.querySelectorAll('#tabs .tab-btn').forEach(b => b.classList.toggle('tab-active', b.dataset.tab === t));
}
function initTabs(){
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-tab]'); if(t){ setTab(t.dataset.tab); return; }
    const g = e.target.closest('[data-sub]'); if(g){ const pn = g.closest('.tab-panel');
      pn.querySelectorAll('.chips button').forEach(b => b.classList.toggle('on', b === g));
      pn.querySelectorAll('.seccion-menu').forEach(x => x.classList.toggle('active', x.id === g.dataset.sub)); }
  });
}


// ===== MODAL DETALLE DE PLATO =====
let platoModalData = null;

function abrirModalPlato(p){
  platoModalData = p;
  const m = $('modal-plato');
  if(!m){ console.error('❌ No existe #modal-plato en el HTML'); return; }
  
  const imgBox = $('pm-img');
  const emoji = p.tipo === 'entrada' ? '🥗' : '🍗';
  imgBox.innerHTML = p.img
    ? `<img src="${q(p.img)}" alt="${q(p.nombre)}" onerror="this.parentElement.innerHTML='<div class=\\'pm-emoji\\'>${emoji}</div>'" />`
    : `<div class="pm-emoji">${emoji}</div>`;
  
  const tag = $('pm-tag');
  tag.textContent = p.tipo === 'entrada' ? '☀️ Entrada incluida' : '☀️ Segundo del día';
  tag.classList.toggle('sec', p.tipo === 'segundo');
  
  setText('pm-nombre', p.nombre);
  setText('pm-desc', p.desc || 'Plato preparado al momento con ingredientes frescos del día.');
  setText('pm-precio', p.precioCarrito > 0 ? fmt(p.precioCarrito) : 'Incluido');
  setText('pm-prelabel', p.precioCarrito > 0 ? 'Precio hoy' : 'Con tu menú');
  
  m.classList.add('open');
  m.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
  console.log('✅ Modal abierto:', p.nombre);
}

function cerrarModalPlato(){
  const m = $('modal-plato');
  if(!m) return;
  m.classList.remove('open');
  m.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

function initModalPlato(){
  console.log('🔧 Inicializando modal de plato...');
  
  // Delegación en document para capturar clicks en tarjetas
  document.addEventListener('click', e => {
    // Si clickeó un botón "Agregar", NO abrir modal
    if(e.target.closest('[data-add]')) return;
    
    const t = e.target.closest('[data-plato]');
    if(!t) return;
    
    console.log('👆 Click en tarjeta:', t.dataset.n);
    
    abrirModalPlato({
      nombre: t.dataset.n,
      desc: t.dataset.desc,
      img: t.dataset.img,
      tipo: t.dataset.tipo,
      nombreCarrito: t.dataset.nc,
      precioCarrito: parseFloat(t.dataset.pc) || 0
    });
  });
  
  // Botón agregar dentro del modal
  const addBtn = $('pm-add');
  if(addBtn){
    addBtn.addEventListener('click', e => {
      e.stopPropagation();
      if(!platoModalData) return;
      agregarAlCarrito(platoModalData.nombreCarrito, platoModalData.precioCarrito);
      const t = addBtn.textContent;
      addBtn.textContent = '✓ Agregado al pedido';
      addBtn.classList.add('bg-emerald-600');
      setTimeout(() => {
        addBtn.textContent = t;
        addBtn.classList.remove('bg-emerald-600');
      }, 1100);
    });
  }
  
  // Cerrar con ESC
  document.addEventListener('keydown', e => { if(e.key === 'Escape') cerrarModalPlato(); });
  
  console.log('✅ Modal de plato inicializado');
}


// ===== CARRITO =====
let carrito = [], tapers = 0, modalidad = 'Delivery';

function guardarCarrito(){
  try{ localStorage.setItem('cart', JSON.stringify({carrito,tapers,modalidad})); }catch(e){}
}

function cargarCarrito(){
  try{
    const g = JSON.parse(localStorage.getItem('cart')||'null');
    if(g){ carrito = g.carrito||[]; tapers = g.tapers||0; modalidad = g.modalidad || 'Delivery'; }
  }catch(e){}
}


function agregarAlCarrito(nombre, precio, sumarTaper = true){
  const ex = carrito.find(i=>i.nombre===nombre);
  if(ex){
    ex.cantidad++;
    // Si el ítem ya existía, conservamos su flag de taper
  } else {
    carrito.push({nombre, precio, cantidad:1, taper: sumarTaper});
  }
  
  // Solo suma taper si el ítem lo permite Y no es salón
  if(sumarTaper && modalidad !== 'Salon'){
    tapers++;
  }
  
  actualizarVistaCarrito();
  const b = $('contador-carrito');
  if(b){ b.classList.add('scale-125'); setTimeout(()=>b.classList.remove('scale-125'),200); }
}

// 🧮 Única fuente de verdad: tapers = suma de cantidades de ítems con taper:true
function calcularTapers(){
  if(modalidad === 'Salon') return 0;
  return carrito.reduce((acc, item) => acc + (item.taper ? item.cantidad : 0), 0);
}

function cambiarCantidad(i,d){
  carrito[i].cantidad += d;
  if(carrito[i].cantidad <= 0) carrito.splice(i,1);
  tapers = calcularTapers();   // ✅ recalcula según flags
  actualizarVistaCarrito();
}

function eliminarDelCarrito(i){
  carrito.splice(i,1);
  tapers = calcularTapers();   // ✅ recalcula según flags
  actualizarVistaCarrito();
}

function cambiarTaper(d){
  tapers = Math.max(0, tapers+d);
  actualizarVistaCarrito();
}

function vaciarCarrito(){
  if(!carrito.length && !tapers) return;
  if(confirm('¿Vaciar todo tu pedido?')){
    carrito=[]; tapers=0;
    actualizarVistaCarrito();
  }
}

function subtotal(){ return carrito.reduce((a,i)=>a+i.precio*i.cantidad,0); }
function total(){ return subtotal() + tapers*CONFIG.taperPrecio; }

function setModalidad(mod){
  modalidad = mod;
  document.querySelectorAll('#mods .mod').forEach(b=> b.classList.toggle('on', b.dataset.mod===mod));

  const taperRow = $('taper-row');
  const campoDir = $('cliente-direccion');
  const campoPers = $('cliente-personas');

  if(mod === 'Salon'){
    tapers = 0;
    if(taperRow) taperRow.classList.add('oculto');
    if(campoDir) campoDir.style.display = 'none';
    if(campoPers) campoPers.style.display = '';
  } else {
    // ✅ Delivery y Recojo: solo cuentan los ítems marcados con taper:true
    tapers = calcularTapers();
    
    if(taperRow){
      taperRow.classList.remove('oculto');
      taperRow.classList.add('auto');
    }
    if(campoDir) campoDir.style.display = mod === 'Delivery' ? '' : 'none';
    if(campoPers) campoPers.style.display = 'none';
  }

  document.querySelectorAll('.field').forEach(f=>f.classList.remove('err'));
  actualizarVistaCarrito();
  validarCampos();
}


function validarCampos(){
  const nombre = ($('cliente-nombre')?.value.trim()) || '';
  const telefono = ($('cliente-telefono')?.value.trim()) || '';
  const direccion = ($('cliente-direccion')?.value.trim()) || '';
  const personas = ($('cliente-personas')?.value.trim()) || '';

  let valido = carrito.length > 0;
  if(!nombre) valido = false;
  if(!telefono) valido = false;
  if(modalidad === 'Delivery' && !direccion) valido = false;
  if(modalidad === 'Salon' && (!personas || parseInt(personas) < 1)) valido = false;

  const btn = $('btn-enviar');
  if(btn){
    btn.disabled = !valido;
    btn.textContent = valido ? 'Enviar pedido por WhatsApp' : 'Completa los datos para enviar';
  }
}

function actualizarVistaCarrito(){
  const n = carrito.reduce((a,i)=>a+i.cantidad,0);
  const totalVal = total();
  
  setText('contador-carrito', n);
  setText('taper-cantidad', tapers);
  setText('total-carrito', fmt(totalVal));
  setText('res-platos', fmt(subtotal()));
  setText('res-tapers', fmt(tapers*CONFIG.taperPrecio));
  setText('cb-count', n);
  setText('cb-total', fmt(totalVal));
  
  const bar = $('cart-bar');
  if(bar) bar.classList.toggle('show', n > 0);
  
  const tr = $('res-taper-row');
  if(tr) tr.style.display = tapers ? '' : 'none';
  
  setText('cart-sub', n ? `${n} ${n===1?'plato':'platos'} en tu pedido` : 'Revisa tus platos antes de enviar');

  const lista = $('lista-carrito');
  if(lista){
    if(!carrito.length){
      lista.innerHTML = `<div class="cart-empty">
        <span class="big">🍽️</span>
        <p class="font-bold text-white">Tu pedido está vacío</p>
        <p class="text-sm">Agrega algo rico de la carta o del menú del día.</p>
        <a href="#menu-dia" onclick="toggleCarrito()" class="btn-fire !py-2.5 !px-5 text-sm mt-4">Ver menú del día</a>
      </div>`;
    } else {
        lista.innerHTML = carrito.map((it,idx)=>`
        <div class="cart-item">
          <div class="cart-item-header">
            <p class="cart-item-nombre">${q(it.nombre)}</p>
            <span class="cart-item-precio">${fmt(it.precio*it.cantidad)}</span>
          </div>
          <div class="cart-item-footer">
            <div class="cart-item-meta">
              <div class="cart-item-qty">
                <button class="restar" onclick="cambiarCantidad(${idx},-1)" aria-label="Restar">−</button>
                <span>${it.cantidad}</span>
                <button class="sumar" onclick="cambiarCantidad(${idx},1)" aria-label="Sumar">+</button>
              </div>
              <span class="cart-item-unit">${fmt(it.precio)} c/u</span>
            </div>
            <button class="cart-delete" onclick="eliminarDelCarrito(${idx})" aria-label="Eliminar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                <path d="M10 11v6"></path><path d="M14 11v6"></path>
                <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>`).join('');
    }
  }
  
  guardarCarrito();
  validarCampos();
}

function toggleCarrito(forceClose){
  const m = $('modal-carrito');
  if(!m) return;
  const open = forceClose===true ? false : !m.classList.contains('open');
  m.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  if(open){
    setModalidad(modalidad);
    ['cliente-nombre','cliente-telefono','cliente-direccion','cliente-personas'].forEach(id=>{
      const el = $(id);
      if(el){
        el.oninput = validarCampos;
        el.onchange = validarCampos;
      }
    });
  }
}

function initCarrito(){
  const mods = $('mods');
  if(mods) mods.addEventListener('click', e=>{
    const b = e.target.closest('.mod');
    if(b) setModalidad(b.dataset.mod);
  });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') toggleCarrito(true); });
  setModalidad('Delivery');
  actualizarVistaCarrito();
}

function enviarPedidoWhatsApp(){
  if(!carrito.length){ alert('Agrega al menos un plato.'); return; }

  const nombre = ($('cliente-nombre')?.value.trim()) || '';
  const telefono = ($('cliente-telefono')?.value.trim()) || '';
  const direccion = ($('cliente-direccion')?.value.trim()) || '';
  const personas = ($('cliente-personas')?.value.trim()) || '';

  let error = null;
  if(!nombre) error = 'Escribe tu nombre completo';
  else if(!telefono) error = 'Escribe tu teléfono';
  else if(modalidad === 'Delivery' && !direccion) error = 'Escribe tu dirección o referencia';
  else if(modalidad === 'Salon' && (!personas || parseInt(personas) < 1)) error = 'Indica cuántas personas van a comer';

  if(error){
    alert(error);
    if(error.includes('nombre')) $('cliente-nombre')?.classList.add('err');
    if(error.includes('teléfono')) $('cliente-telefono')?.classList.add('err');
    if(error.includes('dirección')) $('cliente-direccion')?.classList.add('err');
    if(error.includes('personas')) $('cliente-personas')?.classList.add('err');
    return;
  }

  document.querySelectorAll('.field').forEach(f=>f.classList.remove('err'));

  let t = `Hola *${CONFIG.nombre}*, quiero este pedido:\n\n`;
  carrito.forEach(i => t += `• ${i.cantidad}x ${i.nombre} — ${fmt(i.precio*i.cantidad)}\n`);
  if(tapers > 0) t += `• ${tapers}x Taper (envase para llevar) — ${fmt(tapers*CONFIG.taperPrecio)}\n`;
  t += `\n*Total:* ${fmt(total())}\n`;
  t += `*Cliente:* ${nombre}\n`;
  t += `*Teléfono:* ${telefono}\n`;
  
  if(modalidad === 'Delivery'){
    t += `*Modalidad:* Delivery\n*Dirección/Ref:* ${direccion}\n`;
  } else if(modalidad === 'Recojo'){
    t += `*Modalidad:* Recojo en local\n`;
  } else if(modalidad === 'Salon'){
    t += `*Modalidad:* Comer en salón\n*Personas:* ${personas}\n`;
  }

  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(t)}`, '_blank');
}


function toggleCarrito(forceClose){
  const m = $('modal-carrito'); if(!m) return;
  const open = forceClose===true ? false : !m.classList.contains('open');
  m.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  if(open){ setModalidad(modalidad); } // re-aplica estado al abrir
}

function initCarrito(){
  const mods = $('mods'); if(mods) mods.addEventListener('click', e=>{ const b=e.target.closest('.mod'); if(b) setModalidad(b.dataset.mod); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') toggleCarrito(true); });
  setModalidad('Delivery');
  actualizarVistaCarrito();
}


// ===== EFECTOS =====
document.addEventListener('click', e => {
  const b = e.target.closest('[data-add]'); if(!b) return;
  const sumarTaper = b.dataset.taper !== 'false';
  agregarAlCarrito(b.dataset.n, parseFloat(b.dataset.p), sumarTaper);
  const t = b.textContent; b.textContent = '✓ Agregado'; setTimeout(() => b.textContent = t, 900);
});

function initFX(){
  const top = $('top'); if(top) addEventListener('scroll', () => top.classList.toggle('solid', scrollY > 30), {passive: true});
  const mq = $('mq'); if(mq) mq.innerHTML += mq.innerHTML;
  const em = $('embers');
  if(em && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    for(let i=0; i<22; i++){ const p = document.createElement('i'), z = 3 + Math.random() * 5;
      p.style.cssText = `left:${Math.random()*100}%;width:${z}px;height:${z}px;animation-duration:${6+Math.random()*8}s;animation-delay:${-Math.random()*10}s`; em.appendChild(p); }
  }
  const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold: .1});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  if(matchMedia('(hover:hover)').matches){
    document.addEventListener('pointermove', e => { const c = e.target.closest('.tilt'); if(!c) return;
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transform = `perspective(800px) rotateX(${-y*7}deg) rotateY(${x*7}deg) translateY(-6px)`; });
    document.addEventListener('pointerout', e => { const c = e.target.closest('.tilt'); if(c && !c.contains(e.relatedTarget)) c.style.transform = ''; });
  }
}

// ===== INICIO =====
document.addEventListener('DOMContentLoaded', async () => {
  await window.DATOS_LISTOS;
  try { cargarConfig(); } catch(e){ console.warn('Config:', e); }
  try { renderMenuDelDia(); } catch(e){ console.warn('Menú día:', e); }
  try { renderCarta(); } catch(e){ console.warn('Carta:', e); }
  try { initTabs(); } catch(e){ console.warn('Tabs:', e); }
  // Reseñas eliminadas por completo
  try { cargarCarrito(); initCarrito(); } catch(e){ console.warn('Carrito:', e); }
  try { initFX(); } catch(e){ console.warn('FX:', e); }
  addEventListener('hashchange', route);
  route();

  if (MENU_DATA && MENU_DATA.__error) {
    const p = document.getElementById('md-hoy');
    if (p) p.textContent = '⚠️ Menú del día no cargado: ' + MENU_DATA.__error;
  }
});