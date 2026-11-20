// ===== Helpers =====
const MON = "S/";
const DIAS = ["domingo","lunes","martes","miercoles","jueves","viernes","sabado"];
const $ = id => document.getElementById(id);
function fmt(n){ return `${MON} ${Number(n).toFixed(2)}`; }
function hoy(){ return DIAS[new Date().getDay()]; }
function setText(id, txt){ const el = $(id); if(el) el.textContent = txt; }
function setHref(id, url){ const el = $(id); if(el) el.href = url; }
function html(id, content){ const el = $(id); if(el) el.innerHTML = content; }

// Convierte cualquier link de Google Drive en una imagen visible
function driveImg(url) {
  if (!url) return "";
  // Extrae el ID de cualquier formato de link de Drive
  const m = url.match(/[-\w]{25,}/);
  if (!m) return url; // si ya es una URL directa de imagen, la deja igual
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

// ===== NAVEGACIÓN POR VISTAS =====
const VIEWS = ['inicio','menu-dia','carta','nosotros','resenas','ubicacion'];
function showView(name){
  if(!VIEWS.includes(name)) name = 'inicio';
  const vid = name==='menu-dia' ? 'carta' : name;
  if(vid==='carta') setTab(name==='menu-dia' ? 'menus' : curTab);
  document.querySelectorAll('.view').forEach(v=> v.classList.toggle('active', v.id === 'v-'+vid));
  document.querySelectorAll('[data-nav]').forEach(a=> a.classList.toggle('nav-on', a.dataset.nav === name));
  window.scrollTo({top:0});
  document.querySelectorAll('#v-'+vid+' .reveal').forEach((el,i)=> setTimeout(()=>el.classList.add('in'), 70*i));
  const act = document.querySelector('.pill.nav-on'); if(act) act.scrollIntoView({inline:'center',block:'nearest'});
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

// ===== MENÚ DEL DÍA =====
function renderMenuDelDia(){
  const m = getMenu();
  const dia = hoy();
  const d = m.menuDelDia.semana[dia];
  const titulo = dia.charAt(0).toUpperCase()+dia.slice(1);
  const jugo = d && d.jugo ? `🥤 ${d.jugo}` : "🥤 Refresco";

  setText('md-hoy', `Hoy: ${titulo} • Entrada + Segundo + ${jugo}`);
  setText('q-precio', (d && d.activo) ? `Hoy ${fmt(d.precio)} • Entrada + Segundo + ${jugo}` : 'Hoy no hay menú del día');
  const contE = $('md-entradas'), contS = $('md-segundos'), vacio = $('md-vacio');
  if(contE) contE.innerHTML=''; if(contS) contS.innerHTML='';

  if(!d || !d.activo){ setText('md-precio','Cerrado'); if(vacio) vacio.classList.remove('hidden'); return; }
  if(vacio) vacio.classList.add('hidden');
  setText('md-precio', fmt(d.precio));

  const ent = (d.entradas||[]).filter(x=>x.disponible);
  const seg = (d.segundos||[]).filter(x=>x.disponible);

  // ===== ENTRADAS: Grid profesional =====
  if(contE && ent.length){
    contE.innerHTML = `<h3 class="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">1. Elige tu Entrada</h3>
      <div class="menu-grid-entradas">` +
      ent.map(e=>`<div class="entrada-card bg-[#06121a] border border-stone-800 rounded-xl overflow-hidden flex items-center gap-3 p-3 hover:border-amber-500/50 transition-all duration-200 hover:-translate-y-1">
        ${e.img ? `<div class="w-16 h-16 rounded-lg overflow-hidden border border-stone-700 shrink-0"><img src="${q(e.img)}" alt="${q(e.nombre)}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<span class=\\'flex items-center justify-center w-full h-full text-2xl\\'>🍽️</span>'" /></div>` : `<div class="w-16 h-16 rounded-lg bg-stone-800 flex items-center justify-center text-2xl shrink-0">🍽️</div>`}
        <div class="flex-1 min-w-0">
          <h4 class="font-display text-sm font-bold text-white leading-tight truncate">${q(e.nombre)}</h4>
          ${e.desc ? `<p class="text-xs text-stone-400 mt-0.5 truncate">${q(e.desc)}</p>` : ''}
        </div>
        <div class="flex flex-col items-end gap-1.5 shrink-0">
          <span class="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded">Incluida</span>
          <button data-add data-n="${q(e.nombre)}" data-p="0" class="bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded transition">+ Agregar</button>
        </div>
      </div>`).join('') + `</div>`;
  }

  // ===== SEGUNDOS: Grid profesional =====
  if(contS && seg.length){
    contS.innerHTML = `<h3 class="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 mt-6">2. Elige tu Segundo</h3>
      <div class="menu-grid-segundos">` +
      seg.map(s=>`<div class="card-x segundo-card flex flex-col overflow-hidden">
        <div class="segundo-img-wrap">
          ${s.img ? `<img src="${q(s.img)}" alt="${q(s.nombre)}" loading="lazy" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" onerror="this.parentElement.innerHTML='<div class=\\'flex items-center justify-center w-full h-full text-6xl\\'>🍗</div>'" />` : `<div class="flex items-center justify-center w-full h-full text-6xl">🍗</div>`}
        </div>
        <div class="p-5 flex flex-col justify-between gap-4 flex-1">
          <div><h4 class="text-lg sm:text-xl font-bold font-display text-white leading-tight">${q(s.nombre)}</h4><p class="text-sm text-stone-400 mt-1">${q(s.desc||'')}</p></div>
          <div class="flex items-center justify-between pt-3 border-t border-stone-800">
            <span class="font-extrabold text-lg text-amber-400">${fmt(d.precio)}</span>
            <button data-add data-n="${q('Menú: '+s.nombre)}" data-p="${d.precio}" class="bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition">+ Agregar</button>
          </div>
        </div>
      </div>`).join('') + `</div>`;
  }
  if(vacio && !ent.length && !seg.length) vacio.classList.remove('hidden');
}

// ===== CARTA: tabs Menús · Cena · A la carta · Bebidas =====
function card(o,cat,tag){
  return `<div class="item-carta reveal"><article class="card-x tilt h-full flex flex-col">
    <div class="relative">${img(o,cat)}<span class="absolute top-3 right-3 bg-amber-400 text-stone-900 font-extrabold text-sm px-3 py-1 rounded-full shadow-lg">${fmt(o.precio)}</span></div>
    <div class="p-4 sm:p-5 flex-1 flex flex-col gap-1"><span class="text-[11px] font-bold uppercase tracking-wider text-amber-400">${q(tag)}</span>
      <h4 class="font-display text-xl font-bold text-white">${q(o.nombre)}</h4>
      <p class="text-sm text-stone-400 flex-1">${q(o.desc||'')}</p></div>
    <div class="px-4 sm:px-5 pb-4 sm:pb-5"><button data-add data-n="${q(o.nombre)}" data-p="${o.precio}" class="bg-orange-600 hover:bg-orange-500 w-full text-white font-bold py-3 rounded-xl active:scale-95 transition">+ Agregar al pedido</button></div>
  </article></div>`;
}
function panel(defs){
  const chips = defs.length>1 ? `<div class="chips">${defs.map((d,i)=>`<button data-sub="sec-${d.id}" class="${i===0?'on':''}">${d.ico} ${d.t}</button>`).join('')}</div>` : '';
  return chips + defs.map((d,i)=>`<section id="sec-${d.id}" class="seccion-menu${i===0?' active':''}">
    <div class="sec-head"><span class="sec-ico">${d.ico}</span><div><h3 class="font-display font-black text-2xl sm:text-3xl text-white leading-none">${d.t}</h3>${d.sub?`<p class="text-sm text-stone-400 mt-1">${q(d.sub)}</p>`:''}</div></div>
    ${d.items.length ? `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">${d.items.map(o=>card(o,d.id,d.t)).join('')}</div>` : '<p class="text-stone-400 italic">Pronto agregaremos platos aquí 🍽️</p>'}
  </section>`).join('');
}
function renderCarta(){
  const m = getMenu(), al = m.alitas||{}, C = m.carta||{};
  html('tab-cena', panel([
    {id:'polleria', ico:'🍗', t:'Pollo a la brasa', items:m.polleria||[]},
    {id:'alitas',   ico:'🔥', t:'Alitas', sub:'Sabores: '+(al.sabores||[]).join(' • '), items:(al.items||[]).map(a=>({...a,desc:al.desc||''}))},
    {id:'promos',   ico:'👑', t:'Promos', items:m.promos||[]},
    {id:'extras',   ico:'🍟', t:'Extras', items:(m.extras||[]).map(e=>({...e,img:e.img||''}))}
  ]));
  html('tab-carta', panel([['ceviches','🐟','Ceviches'],['arroces','🍚','Arroces'],['fritos','🍤','Fritos'],['sudados','🍲','Sudados'],['chicharrones','🥘','Chicharrones'],['criollos','🍽️','Criollos']]
    .map(([id,ico,t])=>({id,ico,t,items:C[id]||[]}))));
  const B = Array.isArray(m.bebidas) ? {refrescos:m.bebidas} : (m.bebidas||{});
  html('tab-bebidas', panel([{id:'refrescos', ico:'🥤', t:'Refrescos', items:B.refrescos||[]}, {id:'cervezas', ico:'🍺', t:'Cervezas', items:B.cervezas||[]}]));
}

// ===== TABS =====
let curTab = 'menus';
function setTab(t){
  if(!$('tab-'+t)) t = 'menus';
  curTab = t;
  document.querySelectorAll('.tab-panel').forEach(p=> p.classList.toggle('active', p.id==='tab-'+t));
  document.querySelectorAll('#tabs .tab-btn').forEach(b=> b.classList.toggle('tab-active', b.dataset.tab===t));
}
function initTabs(){
  document.addEventListener('click', e=>{
    const t = e.target.closest('[data-tab]'); if(t){ setTab(t.dataset.tab); return; }
    const g = e.target.closest('[data-sub]'); if(g){ const pn=g.closest('.tab-panel');
      pn.querySelectorAll('.chips button').forEach(b=> b.classList.toggle('on', b===g));
      pn.querySelectorAll('.seccion-menu').forEach(x=> x.classList.toggle('active', x.id===g.dataset.sub)); }
  });
}


// ===== CARRITO =====
let carrito = [], tapers = 0, modalidad = 'Delivery';
function guardarCarrito(){ try{ localStorage.setItem('cart', JSON.stringify({carrito,tapers})); }catch(e){} }
function cargarCarrito(){
  try{ const g = JSON.parse(localStorage.getItem('cart')||'null'); if(g){ carrito = g.carrito||[]; tapers = g.tapers||0; } }catch(e){}
}
function agregarAlCarrito(nombre, precio){
  const ex = carrito.find(i=>i.nombre===nombre);
  if(ex) ex.cantidad++; else carrito.push({nombre,precio,cantidad:1});
  actualizarVistaCarrito();
  const b = $('contador-carrito'); if(b){ b.classList.add('scale-125'); setTimeout(()=>b.classList.remove('scale-125'),200); }
}
function cambiarCantidad(i,d){ carrito[i].cantidad+=d; if(carrito[i].cantidad<=0) carrito.splice(i,1); actualizarVistaCarrito(); }
function cambiarTaper(d){ tapers=Math.max(0,tapers+d); actualizarVistaCarrito(); }
function vaciarCarrito(){ if(!carrito.length && !tapers) return; if(confirm('¿Vaciar todo tu pedido?')){ carrito=[]; tapers=0; actualizarVistaCarrito(); } }
function subtotal(){ return carrito.reduce((a,i)=>a+i.precio*i.cantidad,0); }
function total(){ return subtotal() + tapers*CONFIG.taperPrecio; }

function actualizarVistaCarrito(){
  const n = carrito.reduce((a,i)=>a+i.cantidad,0);
  setText('contador-carrito', n);
  setText('taper-cantidad', tapers);
  setText('total-carrito', fmt(total()));
  setText('res-platos', fmt(subtotal()));
  setText('res-tapers', fmt(tapers*CONFIG.taperPrecio));
  const tr = $('res-taper-row'); if(tr) tr.style.display = tapers ? '' : 'none';
  setText('cart-sub', n ? `${n} ${n===1?'plato':'platos'} en tu pedido` : 'Revisa tus platos antes de enviar');
  // barra flotante
  setText('cb-count', n); setText('cb-total', fmt(total()));
  const bar = $('cart-bar'); if(bar) bar.classList.toggle('show', n>0);
  // lista
  const lista = $('lista-carrito');
  if(lista){
    lista.innerHTML = !carrito.length
      ? `<div class="cart-empty"><span class="big">🍽️</span><p class="font-bold text-white">Tu pedido está vacío</p><p class="text-sm mt-1">Agrega algo rico de la carta o del menú del día.</p><a href="#carta" onclick="toggleCarrito()" class="btn-fire !py-2.5 !px-5 text-sm mt-4">Ver la carta</a></div>`
      : carrito.map((it,idx)=>`<div class="cart-item">
          <div class="min-w-0"><p class="font-bold text-white leading-tight">${q(it.nombre)}</p><p class="text-xs text-stone-400 mt-1">${fmt(it.precio)} c/u</p></div>
          <div class="flex flex-col items-end gap-2 shrink-0">
            <span class="font-extrabold text-amber-400 text-sm">${fmt(it.precio*it.cantidad)}</span>
            <div class="qty"><button onclick="cambiarCantidad(${idx},-1)">−</button><span>${it.cantidad}</span><button onclick="cambiarCantidad(${idx},1)">+</button></div>
          </div></div>`).join('');
  }
  guardarCarrito();
}
function toggleCarrito(forceClose){
  const m = $('modal-carrito'); if(!m) return;
  const open = forceClose===true ? false : !m.classList.contains('open');
  m.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
function setModalidad(mod){
  modalidad = mod;
  document.querySelectorAll('#mods .mod').forEach(b=> b.classList.toggle('on', b.dataset.mod===mod));
  const d = $('cliente-direccion'); if(d){ d.style.display = mod==='Delivery' ? '' : 'none'; d.classList.remove('err'); }
}
function initCarrito(){
  const mods = $('mods'); if(mods) mods.addEventListener('click', e=>{ const b=e.target.closest('.mod'); if(b) setModalidad(b.dataset.mod); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') toggleCarrito(true); });
  setModalidad('Delivery');
  actualizarVistaCarrito();
}
function enviarPedidoWhatsApp(){
  if(!carrito.length){ alert('Agrega al menos un plato.'); return; }
  const nombre=($('cliente-nombre')?.value.trim())||'Cliente';
  const dirEl=$('cliente-direccion'); const dir=(dirEl?.value.trim())||'';
  if(modalidad==='Delivery' && !dir){ dirEl.classList.add('err'); dirEl.focus(); return; }
  let t=`Hola *${CONFIG.nombre}*, quiero este pedido:\n\n`;
  carrito.forEach(i=> t+=`• ${i.cantidad}x ${i.nombre} — ${fmt(i.precio*i.cantidad)}\n`);
  if(tapers>0) t+=`• ${tapers}x Taper (envase para llevar) — ${fmt(tapers*CONFIG.taperPrecio)}\n`;
  t+=`\n*Total:* ${fmt(total())}\n*Cliente:* ${nombre}\n*Modalidad:* ${modalidad}\n`;
  if(modalidad==='Delivery' && dir) t+=`*Dirección/Ref:* ${dir}\n`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(t)}`,'_blank');
}

// ===== RESEÑAS =====
let rating=0;
function getResenas(){
  const m=getMenu();
  try{ const g=localStorage.getItem('reviews'); return [...(m.reseñas||[]), ...(g?JSON.parse(g):[])]; }
  catch(e){ return m.reseñas||[]; }
}
function renderResenas(){
  const r=getResenas();
  html('lista-resenas', r.map(x=>`<div class="bg-[#0b1c27] border border-stone-800 rounded-2xl p-4 sm:p-5">
    <div class="text-amber-400 text-sm">${'★'.repeat(x.estrellas)}${'☆'.repeat(5-x.estrellas)}</div>
    <p class="text-stone-200 mt-2 text-sm">"${q(x.texto)}"</p>
    <p class="text-xs text-stone-400 mt-2">— ${q(x.nombre)}${x.fecha?' • '+q(x.fecha):''}</p></div>`).join('') || '<p class="text-stone-400">Sé el primero en dejar una reseña.</p>');
}
function initResenas(){
  document.querySelectorAll('#r-estrellas .star-btn').forEach(s=> s.onclick=()=>{
    rating=+s.dataset.v;
    document.querySelectorAll('#r-estrellas .star-btn').forEach(b=> b.classList.toggle('active', +b.dataset.v<=rating));
  });
  const form=$('form-resena'); if(!form) return;
  form.addEventListener('submit', e=>{
    e.preventDefault();
    if(!rating){ alert('Elige las estrellas.'); return; }
    const nueva={ nombre:($('r-nombre')?.value.trim())||'Anónimo', estrellas:rating, texto:($('r-texto')?.value.trim())||'', fecha:new Date().toISOString().slice(0,10) };
    let arr=[]; try{ arr=JSON.parse(localStorage.getItem('reviews')||'[]'); }catch(e){}
    arr.push(nueva); localStorage.setItem('reviews', JSON.stringify(arr));
    form.reset(); rating=0;
    document.querySelectorAll('#r-estrellas .star-btn').forEach(b=>b.classList.remove('active'));
    renderResenas();
  });
}

// ===== EFECTOS =====
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-add]'); if(!b) return;
  agregarAlCarrito(b.dataset.n, parseFloat(b.dataset.p));
  const t=b.textContent; b.textContent='✓ Agregado'; setTimeout(()=>b.textContent=t,900);
});
function initFX(){
  const top=$('top'); if(top) addEventListener('scroll',()=>top.classList.toggle('solid',scrollY>30),{passive:true});
  const mq=$('mq'); if(mq) mq.innerHTML+=mq.innerHTML;
  const em=$('embers');
  if(em && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    for(let i=0;i<22;i++){ const p=document.createElement('i'), z=3+Math.random()*5;
      p.style.cssText=`left:${Math.random()*100}%;width:${z}px;height:${z}px;animation-duration:${6+Math.random()*8}s;animation-delay:${-Math.random()*10}s`; em.appendChild(p); }
  }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }),{threshold:.1});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  if(matchMedia('(hover:hover)').matches){
    document.addEventListener('pointermove',e=>{ const c=e.target.closest('.tilt'); if(!c) return;
      const r=c.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      c.style.transform=`perspective(800px) rotateX(${-y*7}deg) rotateY(${x*7}deg) translateY(-6px)`; });
    document.addEventListener('pointerout',e=>{ const c=e.target.closest('.tilt'); if(c && !c.contains(e.relatedTarget)) c.style.transform=''; });
  }
}

// ===== INICIO =====
document.addEventListener('DOMContentLoaded', async () => {
  await window.DATOS_LISTOS;
  try { cargarConfig(); } catch(e){ console.warn('Config:', e); }
  try { renderMenuDelDia(); } catch(e){ console.warn('Menú día:', e); }
  try { renderCarta(); } catch(e){ console.warn('Carta:', e); }
  try { initTabs(); } catch(e){ console.warn('Tabs:', e); }
  try { renderResenas(); } catch(e){ console.warn('Reseñas:', e); }
  try { initResenas(); } catch(e){ console.warn('Form reseñas:', e); }
  try { cargarCarrito(); initCarrito(); } catch(e){ console.warn('Carrito:', e); }
  try { initFX(); } catch(e){ console.warn('FX:', e); }
  addEventListener('hashchange', route);
  route();

  if (MENU_DATA && MENU_DATA.__error) {
    const p = document.getElementById('md-hoy');
    if (p) p.textContent = '⚠️ Menú del día no cargado: ' + MENU_DATA.__error;
  }
});