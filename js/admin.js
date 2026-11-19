const DIAS = ["lunes","martes","miercoles","jueves","viernes","sabado","domingo"];
let menu, diaActivo;

function load(){
  try{ menu = JSON.parse(localStorage.getItem('menuEdit')) || JSON.parse(JSON.stringify(MENU_DATA)); }
  catch(e){ menu = JSON.parse(JSON.stringify(MENU_DATA)); }
  diaActivo = DIAS[(new Date().getDay()+6)%7]; // día de hoy en nuestro orden
  renderDias(); renderDia();
}
const qa=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
function syncDia(){ const d=menu.menuDelDia.semana[diaActivo]; d.activo=document.getElementById('dia-activo').checked; d.precio=parseFloat(document.getElementById('precio-dia').value)||0; }
function renderDias(){
  document.getElementById('dias').innerHTML = DIAS.map(d=>`<button data-d="${d}" class="px-4 py-2 rounded-xl text-sm font-bold border ${d===diaActivo?'tab-active':'bg-[#10283a] text-stone-300 border-stone-800'}">${d[0].toUpperCase()+d.slice(1)}</button>`).join('');
  document.querySelectorAll('#dias button').forEach(b=> b.onclick=()=>{ syncDia(); diaActivo=b.dataset.d; renderDias(); renderDia(); });
}
function renderDia(){
  const d = menu.menuDelDia.semana[diaActivo];
  document.getElementById('precio-dia').value = d.precio;
  document.getElementById('dia-activo').checked = !!d.activo;
  ['entradas','segundos'].forEach(tipo=>{
    const cont = document.getElementById('lista-'+tipo);
    cont.innerHTML = (d[tipo]||[]).map((p,i)=>`
      <div class="flex items-center gap-3 bg-[#06121a] border border-stone-800 rounded-xl p-3">
        <input type="checkbox" ${p.disponible?'checked':''} onchange="toggleDisp('${tipo}',${i},this.checked)" class="w-5 h-5 accent-emerald-500" title="Disponible hoy" />
        <input value="${qa(p.nombre)}" oninput="editTxt('${tipo}',${i},'nombre',this.value)" class="flex-1 bg-transparent text-white border-b border-stone-700 focus:outline-none" />
        ${tipo==='segundos'?`<input value="${qa(p.desc||'')}" oninput="editTxt('${tipo}',${i},'desc',this.value)" placeholder="descripción" class="flex-1 bg-transparent text-stone-300 text-sm border-b border-stone-700 focus:outline-none" />`:''}
        <button onclick="quitar('${tipo}',${i})" class="text-red-400 font-bold px-2">✕</button>
      </div>`).join('') || '<p class="text-stone-500 text-sm">Sin platos. Usa "+ Agregar".</p>';
  });
}
function toggleDisp(tipo,i,v){ menu.menuDelDia.semana[diaActivo][tipo][i].disponible=v; }
function editTxt(tipo,i,k,v){ menu.menuDelDia.semana[diaActivo][tipo][i][k]=v; }
function quitar(tipo,i){ menu.menuDelDia.semana[diaActivo][tipo].splice(i,1); renderDia(); }
function agregarPlato(tipo){
  const d=menu.menuDelDia.semana[diaActivo];
  if(!d[tipo]) d[tipo]=[];
  d[tipo].push({nombre:'Nuevo plato', desc:'', disponible:true});
  renderDia();
}
function guardar(){
  menu.menuDelDia.semana[diaActivo].activo=document.getElementById('dia-activo').checked;
  menu.menuDelDia.semana[diaActivo].precio=parseFloat(document.getElementById('precio-dia').value)||0;
  localStorage.setItem('menuEdit', JSON.stringify(menu));
  document.getElementById('msg').textContent='✅ Guardado. Recarga index.html para ver los cambios.';
  setTimeout(()=>document.getElementById('msg').textContent='',3000);
}
function exportar(){
  const txt='const MENU_DATA = '+JSON.stringify(menu,null,2)+';';
  const blob=new Blob([txt],{type:'text/javascript'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='data.js'; a.click();
}
function reset(){ localStorage.removeItem('menuEdit'); load(); document.getElementById('msg').textContent='↺ Restaurado el menú original.'; }
document.addEventListener('DOMContentLoaded', load);