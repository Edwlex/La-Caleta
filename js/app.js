// ===== Helpers =====
const MON = "S/";
const DIAS = ["domingo","lunes","martes","miercoles","jueves","viernes","sabado"];
const $ = id => document.getElementById(id); // devuelve null si no existe, sin crash
function fmt(n){ return `${MON} ${Number(n).toFixed(2)}`; }
function hoy(){ return DIAS[new Date().getDay()]; }
function setText(id, txt){ const el = $(id); if(el) el.textContent = txt; }
function setHref(id, url){ const el = $(id); if(el) el.href = url; }
function html(id, content){ const el = $(id); if(el) el.innerHTML = content; }

function getMenu(){
  try { const g = localStorage.getItem('menuEdit'); return g ? JSON.parse(g) : MENU_DATA; }
  catch(e){ return MENU_DATA; }
}
const EMO={polleria:'🍗',alitas:'🔥',promos:'👑',mariscos:'🐟',bebidas:'🥤',extras:'🍟'};
const q=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
function img(o,cat){
  return `<div class="img-wrap" data-e="${EMO[cat]||'🍽️'}">
    <img src="${q(o.img||'')}" alt="${q(o.nombre)}" loading="lazy" class="${o.fit==='contain'?'fit-contain':''}" onerror="this.parentElement.classList.add('img-missing');this.remove()" />
  </div>`;
}

// ===== CONFIG =====
function cargarConfig(){
  setText('h-nombre', CONFIG.nombre);
  setText('h-eslogan', CONFIG.eslogan);
  setText('f-nombre', CONFIG.nombre);
  const t = $('titulo'); if(t) t.textContent = `${CONFIG.nombre} | Restaurante & Pollería en Trujillo`;
  setHref('float-wa', `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Hola "+CONFIG.nombre+", quisiera hacer un pedido")}`);
  setText('hero-horario', `Abierto Hoy • ${CONFIG.horario}`);
  setText('u-direccion', CONFIG.direccion);
  setText('u-horario', CONFIG.horario);
  setText('u-telefono', CONFIG.telefono);
  setHref('u-maps', CONFIG.mapsLink);
  setHref('f-facebook', CONFIG.facebook);
  setText('taper-precio-txt', fmt(CONFIG.taperPrecio));
  const w=$('float-wa'); if(w) setHref('h-whatsapp', w.href);
}

// ===== MENÚ DEL DÍA =====
function renderMenuDelDia(){
  const m = getMenu();
  const d = m.menuDelDia.semana[hoy()];
  const dia = hoy();
  const titulo = dia.charAt(0).toUpperCase()+dia.slice(1);
  setText('md-hoy', `Hoy: ${titulo} • ${m.menuDelDia.descripcion}`);
  const contE = $('md-entradas'), contS = $('md-segundos'), vacio = $('md-vacio');
  if(contE) contE.innerHTML=''; if(contS) contS.innerHTML='';

  if(!d || !d.activo){ setText('md-precio','Cerrado'); if(vacio) vacio.classList.remove('hidden'); return; }
  if(vacio) vacio.classList.add('hidden');
  setText('md-precio', fmt(d.precio));

  const ent = (d.entradas||[]).filter(x=>x.disponible);
  const seg = (d.segundos||[]).filter(x=>x.disponible);

  if(contE && ent.length){
    contE.innerHTML = `<h3 class="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">1. Elige tu Entrada</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">` +
      ent.map(e=>`<div class="bg-[#06121a] border border-stone-800 rounded-xl px-4 py-3 flex items-center justify-between"><span>🍽️ ${q(e.nombre)}</span><span class="text-xs text-emerald-400 font-bold">Incluida</span></div>`).join('') + `</div>`;
  }
  if(contS && seg.length){
    contS.innerHTML = seg.map(s=>`<div class="card-x p-5 flex flex-col justify-between gap-4">
      <div><h4 class="text-lg sm:text-xl font-bold font-display text-white">${q(s.nombre)}</h4><p class="text-sm text-stone-400 mt-1">${q(s.desc||'')}</p></div>
      <div class="flex items-center justify-between pt-3 border-t border-stone-800">
        <span class="font-extrabold text-lg text-amber-400">${fmt(d.precio)}</span>
        <button data-add data-n="${q('Menú: '+s.nombre)}" data-p="${d.precio}" class="bg-orange-600 active:bg-orange-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl w-full sm:w-auto">+ Agregar</button>
      </div></div>`).join('');
  }
  if(vacio && !ent.length && !seg.length) vacio.classList.remove('hidden');
}

// ===== CARTA =====
function renderCarta(){
  const m = getMenu();
  let cards = '';
  (m.polleria||[]).forEach(p=> cards += card(p,'polleria','Pollería','text-amber-400','bg-orange-600'));
  ((m.alitas||{}).items||[]).forEach(a=> cards += card({...a, desc:(m.alitas.desc||'')+' • Sabores: '+(m.alitas.sabores||[]).join(', ')},'alitas','Alitas','text-amber-400','bg-orange-600'));
  (m.promos||[]).forEach(p=> cards += card(p,'promos','Promo','text-amber-400','bg-amber-500'));
  (m.carta||[]).forEach(c=> cards += card(c,'mariscos','Carta Marina','text-cyan-400','bg-cyan-700'));
  (m.bebidas||[]).forEach(b=> cards += card(b,'bebidas','Bebidas','text-emerald-400','bg-emerald-700'));
  (m.extras||[]).forEach(e=> cards += card({...e, img:e.img||'assets/img/extras.jpg', desc:e.desc||'Extra'},'extras','Extra','text-stone-400','bg-stone-700'));
  html('grid-carta', cards);
}
function card(o,cat,tag,color,btn){
  return `<div data-cat="${cat}" class="item-carta reveal"><article class="card-x tilt h-full flex flex-col">
    <div class="relative">${img(o,cat)}<span class="absolute top-3 right-3 bg-amber-400 text-stone-900 font-extrabold text-sm px-3 py-1 rounded-full shadow-lg">${fmt(o.precio)}</span></div>
    <div class="p-4 sm:p-5 flex-1 flex flex-col gap-1"><span class="text-[11px] font-bold uppercase tracking-wider ${color}">${tag}</span>
      <h3 class="font-display text-xl font-bold text-white">${q(o.nombre)}</h3>
      <p class="text-sm text-stone-400 flex-1">${q(o.desc||'')}</p></div>
    <div class="px-4 sm:px-5 pb-4 sm:pb-5"><button data-add data-n="${q(o.nombre)}" data-p="${o.precio}" class="${btn} w-full text-white font-bold py-3 rounded-xl active:scale-95 transition">+ Agregar al pedido</button></div>
  </article></div>`;
}

// ===== FILTROS =====
function initFiltros(){
  const cont = $('filtros'); if(!cont) return;
  cont.addEventListener('click', e=>{
    const btn = e.target.closest('button'); if(!btn) return;
    const f = btn.dataset.f;
    document.querySelectorAll('#filtros button').forEach(b=>{
      b.classList.remove('tab-active');
      b.classList.add('bg-[#10283a]','text-stone-300','border-stone-800');
    });
    btn.classList.add('tab-active');
    btn.classList.remove('bg-[#10283a]','text-stone-300','border-stone-800');
    document.querySelectorAll('.item-carta').forEach(c=>{
      c.classList.toggle('hidden', !(f==='todos' || c.dataset.cat===f));
    });
  });
}

// ===== CARRITO + TAPER =====
let carrito = []; let tapers = 0;
function agregarAlCarrito(nombre, precio){
  const ex = carrito.find(i=>i.nombre===nombre);
  if(ex) ex.cantidad++; else carrito.push({nombre,precio,cantidad:1});
  actualizarVistaCarrito();
  const b = $('contador-carrito'); if(b){ b.classList.add('scale-125'); setTimeout(()=>b.classList.remove('scale-125'),200); }
}
function cambiarCantidad(i,d){ carrito[i].cantidad+=d; if(carrito[i].cantidad<=0) carrito.splice(i,1); actualizarVistaCarrito(); }
function cambiarTaper(d){ tapers=Math.max(0,tapers+d); actualizarVistaCarrito(); }
function total(){ return carrito.reduce((a,i)=>a+i.precio*i.cantidad,0) + tapers*CONFIG.taperPrecio; }
function actualizarVistaCarrito(){
  const c1=$('contador-carrito'); if(c1) c1.textContent = carrito.reduce((a,i)=>a+i.cantidad,0);
  const c2=$('taper-cantidad'); if(c2) c2.textContent = tapers;
  const c3=$('total-carrito'); if(c3) c3.textContent = fmt(total());
  const lista = $('lista-carrito'); if(!lista) return;
  if(!carrito.length){ lista.innerHTML='<p class="text-stone-400 text-center py-8">Aún no has agregado platos.</p>'; return; }
  lista.innerHTML = carrito.map((it,idx)=>`<div class="bg-[#06121a] border border-stone-800 rounded-xl p-3 flex items-center justify-between">
    <div><p class="font-bold text-white">${it.nombre}</p><p class="text-xs text-amber-400">${fmt(it.precio*it.cantidad)}</p></div>
    <div class="flex items-center gap-2">
      <button onclick="cambiarCantidad(${idx},-1)" class="w-8 h-8 bg-stone-800 active:bg-stone-700 rounded-lg font-bold text-lg">-</button>
      <span class="font-bold text-sm w-6 text-center">${it.cantidad}</span>
      <button onclick="cambiarCantidad(${idx},1)" class="w-8 h-8 bg-orange-600 active:bg-orange-500 rounded-lg font-bold text-lg">+</button>
    </div></div>`).join('');
}
function toggleCarrito(){ const m=$('modal-carrito'); if(m) m.classList.toggle('hidden'); }
function enviarPedidoWhatsApp(){
  if(!carrito.length){ alert('Agrega al menos un plato.'); return; }
  const nombre=($('cliente-nombre')?.value.trim())||'Cliente';
  const mod=($('cliente-modalidad')?.value)||'Delivery';
  const dir=($('cliente-direccion')?.value.trim())||'';
  let t=`Hola *${CONFIG.nombre}*, quiero este pedido:\n\n`;
  carrito.forEach(i=> t+=`• ${i.cantidad}x ${i.nombre} — ${fmt(i.precio*i.cantidad)}\n`);
  if(tapers>0) t+=`• ${tapers}x Taper (envase para llevar) — ${fmt(tapers*CONFIG.taperPrecio)}\n`;
  t+=`\n*Total:* ${fmt(total())}\n*Cliente:* ${nombre}\n*Modalidad:* ${mod}\n`;
  if(dir) t+=`*Dirección/Ref:* ${dir}\n`;
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
    <p class="text-stone-200 mt-2 text-sm">"${x.texto}"</p>
    <p class="text-xs text-stone-400 mt-2">— ${x.nombre}${x.fecha?' • '+x.fecha:''}</p></div>`).join('') || '<p class="text-stone-400">Sé el primero en dejar una reseña.</p>');
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

// ===== EFECTOS (si algo falla aquí, la web sigue funcionando) =====
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
document.addEventListener('DOMContentLoaded', ()=>{
  try { cargarConfig(); } catch(e){ console.warn('Config:', e); }
  try { renderMenuDelDia(); } catch(e){ console.warn('Menú día:', e); }
  try { renderCarta(); } catch(e){ console.warn('Carta:', e); }
  try { initFiltros(); } catch(e){ console.warn('Filtros:', e); }
  try { renderResenas(); } catch(e){ console.warn('Reseñas:', e); }
  try { initResenas(); } catch(e){ console.warn('Form reseñas:', e); }
  try { initFX(); } catch(e){ console.warn('FX:', e); }
});