// ====== OVERRIDE نهائي واجباري - حطه في آخر database.js ======
(() => {
  const FINAL_CATS = ["دواء", "كوزمتكس", "مصاريف"];
  
  // 1- اجبار الـ localStorage يتحول للـ 3 دول بس
  let store = JSON.parse(localStorage.getItem('dbStore')||'{}');
  if(store.suppliers){
    store.suppliers = store.suppliers.map(s=>{
      let name = s.name||s;
      let cur = (s.category||'').toString();
      if(cur.includes('دواء') || cur.includes('مخزن') || cur.includes('شرك') || cur.includes('عام')) cur="دواء";
      else if(cur.includes('كوز')) cur="كوزمتكس";
      else cur="مصاريف";
      return {name, category:cur};
    });
    localStorage.setItem('dbStore', JSON.stringify(store));
  }

  // 2- اجبار الدروب ليست تبقى 3 بس
  window.FINAL_CATS = FINAL_CATS;
  
  const oldAdd = window.addDBRow;
  window.addDBRow = function(type, data){
    if(type!=='suppliers' && type!=='tasnefSarf') {
      if(oldAdd) return oldAdd(type,data);
      return;
    }
    let tbody=document.getElementById(`db-${type}`);
    if(!tbody) return;
    let tr=document.createElement('tr');
    let cur = (data?.category||'').toString().trim();
    if(cur.includes('دواء') || cur.includes('مخزن') || cur.includes('شرك') || cur.includes('عام')) cur="دواء";
    if(cur.includes('كوز')) cur="كوزمتكس";
    if(!FINAL_CATS.includes(cur)) cur=FINAL_CATS[0];
    let opts = FINAL_CATS.map(c=>`<option value="${c}" ${c===cur?'selected':''}>${c}</option>`).join('');
    
    if(type==='suppliers'){
      tr.innerHTML=`<td><input value="${data?.name||''}" style="width:100%;padding:6px;text-align:center;font-weight:700" onblur="saveDBTable('suppliers')"></td><td><select style="width:100%;padding:6px;background:#ecfdf5;border:1.5px solid #0f766e;border-radius:6px;font-weight:800;text-align:center" onchange="saveDBTable('suppliers')">${opts}</select></td><td style="text-align:center"><span style="color:red;cursor:pointer;font-weight:900" onclick="this.closest('tr').remove();saveDBTable('suppliers')">✖</span></td>`;
    } else {
      tr.innerHTML=`<td><input value="${data?.name||''}" placeholder="الاسم"></td><td><select style="width:100%;padding:5px;background:#f0fdf4;border:1px solid #0f766e;border-radius:6px;font-weight:700;text-align:center" onchange="saveDBTable('tasnefSarf')">${opts}</select></td><td><span style="cursor:pointer;color:#dc2626;font-weight:800" onclick="this.closest('tr').remove();saveDBTable('tasnefSarf')">✖</span></td>`;
    }
    tbody.appendChild(tr);
  };

  // 3- اعادة رسم فوري
  setTimeout(()=>{ if(typeof renderDatabase==='function') renderDatabase(); }, 100);
  console.log('✅ تم تثبيت 3 تصنيفات فقط:', FINAL_CATS);
})();
let dbStore = JSON.parse(localStorage.getItem('dbStore')||'null');
if(!dbStore ||!dbStore.asnaf){
  if(!dbStore) dbStore={};
  dbStore.employees = dbStore.employees || defaultEmployees.map(n=>({name:n, job:"", hodor:"", insiraf:"", firstDay:"", lastDay:""}));
  dbStore.suppliers = dbStore.suppliers || defaultSuppliers.map(n=>({name:n, category:"دواء"}));
  dbStore.transactions = dbStore.transactions || [{name:"نقدي"},{name:"اجل"}];
  dbStore.arba7 = dbStore.arba7 || defaultArba7.map(n=>({c1:n, c2:""}));
  dbStore.masrofat = dbStore.masrofat || defaultMasrofat.map(n=>({c1:n, c2:""}));
  dbStore.tasnefSarf = dbStore.tasnefSarf || defaultTasnefSarf.map(n=>({name:n, category:n}));
  dbStore.asnaf = defaultAsnaf.map(a=>({name:a[0], price:a[1]}));
  localStorage.setItem('dbStore', JSON.stringify(dbStore));
}
dbStore.employees = (dbStore.employees||[]).map(e=>{ if(typeof e==='string') return {name:e, job:"", hodor:"", insiraf:"", firstDay:"", lastDay:""}; return {name:e.name||"", job:e.job||"", hodor:e.hodor||"", insiraf:e.insiraf||"", firstDay:e.firstDay||"", lastDay:e.lastDay||""}; });
dbStore.suppliers = (dbStore.suppliers||[]).map(s=>{
  if(typeof s==='string') return {name:s, category:"دواء"};
  let cur=(s.category||s.info||"").toString().trim();
  if(cur.includes('دواء')||cur.includes('مخزن')||cur.includes('شرك')||cur.includes('عام')) cur="دواء";
  if(cur.includes('كوز')) cur="كوزمتكس";
  if(cur.toLowerCase().includes('imp')||cur.includes('مصاريف')||cur.includes('مصروف')) cur="مصاريف";
  if(!FINAL_CATS.includes(cur)) cur=FINAL_CATS[0];
  return {name:s.name, category:cur};
});
dbStore.tasnefSarf = dbStore.tasnefSarf || defaultTasnefSarf.map(n=>({name:n, category:n}));

function saveDB(){ localStorage.setItem('dbStore', JSON.stringify(dbStore)); }

function renderDatabase(){
  let asnafCount=(dbStore.asnaf||[]).length;
  document.getElementById('database').innerHTML=`
    <style>
    .db-grid{ display:grid; grid-template-columns: repeat(6, 1fr); gap:10px; align-items:start; }
    .db-card{ background:#fff; border-radius:14px; border:1px solid #e2e8f0; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,.04); display:flex; flex-direction:column; height:420px; max-height:420px; }
    .db-card.big{ grid-column: span 2; height:420px; max-height:420px; }
    .db-card.employees{ grid-column: span 2; height:420px; max-height:420px; }
    .db-head{ padding:10px 12px; color:#fff; font-weight:800; font-size:12px; display:flex; justify-content:space-between; align-items:center; }
    .db-body{ overflow:auto; flex:1; }
    .db-body table{ width:100%; table-layout:fixed; }
    .db-body th{ font-size:10px; padding:8px 4px; position:sticky; top:0; background:#f8fafc; z-index:1; }
    .db-body td{ height:38px; font-size:12px; }
    .db-body td input,.db-body td select{ font-size:11px; padding:0 4px; width:100%; box-sizing:border-box; }
    </style>
    <div class="db-grid">
      <div class="db-card employees">
        <div class="db-head" style="background:#0f172a">👨‍⚕️ الموظفين (${dbStore.employees.length}) <div><span onclick="addDBRow('employees')" style="cursor:pointer;background:#fff;color:#000;padding:3px 7px;border-radius:6px">+</span> <span onclick="saveDBTable('employees')" style="cursor:pointer;background:#22c55e;padding:3px 7px;border-radius:6px">💾</span></div></div>
        <div class="db-body"><table class="pro-table"><thead><tr><th>الاسم</th><th>الوظيفة</th><th>الحضور</th><th>الانصراف</th><th>أول يوم</th><th>آخر يوم</th><th>✖</th></tr></thead><tbody id="db-employees"></tbody></table></div>
      </div>
      <div class="db-card">
        <div class="db-head" style="background:#0f766e">🏪 الموردين (${dbStore.suppliers.length}) <div><span onclick="addDBRow('suppliers')" style="cursor:pointer;background:#fff;color:#0f766e;padding:3px 7px;border-radius:6px">+</span> <span onclick="saveDBTable('suppliers')" style="cursor:pointer;background:#0f172a;padding:3px 7px;border-radius:6px">💾</span></div></div>
        <div class="db-body"><table class="pro-table"><thead><tr><th>اسم المورد/المصروف</th><th>التصنيف</th><th>✖</th></tr></thead><tbody id="db-suppliers"></tbody></table></div>
      </div>
      <div class="db-card"><div class="db-head" style="background:#7c3aed">💳 المعاملات <div><span onclick="addDBRow('transactions')" style="cursor:pointer;background:#fff;color:#7c3aed;padding:3px 7px;border-radius:6px">+</span> <span onclick="saveDBTable('transactions')" style="cursor:pointer;background:#000;padding:3px 7px;border-radius:6px">💾</span></div></div><div class="db-body"><table class="pro-table"><thead><tr><th>المعاملة</th><th>✖</th></tr></thead><tbody id="db-transactions"></tbody></table></div></div>
      <div class="db-card"><div class="db-head" style="background:#f59e0b;color:#000">💰 الارباح (${dbStore.arba7.length}) <div><span onclick="addDBRow('arba7')" style="cursor:pointer;background:#000;color:#fff;padding:3px 7px;border-radius:6px">+</span> <span onclick="saveDBTable('arba7')" style="cursor:pointer;background:#fff;color:#000;padding:3px 7px;border-radius:6px">💾</span></div></div><div class="db-body"><table class="pro-table"><thead><tr><th>الاسم</th><th>المعلومة</th><th>✖</th></tr></thead><tbody id="db-arba7"></tbody></table></div></div>
      <div class="db-card"><div class="db-head" style="background:#dc2626">💸 المصروفات (${dbStore.masrofat.length}) <div><span onclick="addDBRow('masrofat')" style="cursor:pointer;background:#fff;color:#dc2626;padding:3px 7px;border-radius:6px">+</span> <span onclick="saveDBTable('masrofat')" style="cursor:pointer;background:#000;padding:3px 7px;border-radius:6px">💾</span></div></div><div class="db-body"><table class="pro-table"><thead><tr><th>الاسم</th><th>المعلومة</th><th>✖</th></tr></thead><tbody id="db-masrofat"></tbody></table></div></div>
      <div class="db-card" style="border:2px solid #0f766e"><div class="db-head" style="background:#0f766e">🏷️ تصنيف الصرف (${(dbStore.tasnefSarf||[]).length}) <div><span onclick="addDBRow('tasnefSarf')" style="cursor:pointer;background:#fff;color:#0f766e;padding:3px 7px;border-radius:6px">+</span> <span onclick="saveDBTable('tasnefSarf')" style="cursor:pointer;background:#000;padding:3px 7px;border-radius:6px">💾</span></div></div><div class="db-body"><table class="pro-table"><thead><tr><th>الاسم</th><th>التصنيف</th><th>✖</th></tr></thead><tbody id="db-tasnefSarf"></tbody></table></div></div>
      <div class="db-card big"><div class="db-head" style="background:linear-gradient(135deg,#0f172a,#1e40af)">💊 الاصناف (${asnafCount}) <input id="asnafSearch" oninput="filterAsnaf(this.value)" placeholder="🔍 ابحث..." style="padding:6px 10px;border-radius:8px;border:none;width:140px;font-size:12px;color:#000"><div><span onclick="addDBRow('asnaf')" style="cursor:pointer;background:#fff;color:#000;padding:3px 8px;border-radius:6px">+ إضافة</span> <span onclick="saveDBTable('asnaf')" style="cursor:pointer;background:#22c55e;padding:3px 8px;border-radius:6px">💾 حفظ</span></div></div><div class="db-body"><table class="pro-table"><thead><tr><th style="width:75%">الاسم</th><th style="width:20%">السعر</th><th style="width:5%">✖</th></tr></thead><tbody id="db-asnaf"></tbody></table></div></div>
    </div>
  `;
  loadDBTables();
}
function loadDBTables(){ ['employees','suppliers','transactions','arba7','masrofat','tasnefSarf','asnaf'].forEach(t=>{ let tb=document.getElementById(`db-${t}`); if(!tb) return; tb.innerHTML=''; (dbStore[t]||[]).forEach(d=>addDBRow(t,d)); }); }
function addDBRow(type,data){
  let tbody=document.getElementById(`db-${type}`); if(!tbody) return; let tr=document.createElement('tr');
  if(type==='employees'){
    let row=data||{name:'',job:'',hodor:'',insiraf:'',firstDay:'',lastDay:''};
    tr.innerHTML=`<td><input value="${row.name||''}" placeholder="الاسم"></td><td><input value="${row.job||''}" placeholder="الوظيفة"></td><td><input value="${row.hodor||''}" placeholder="حضور"></td><td><input value="${row.insiraf||''}" placeholder="انصراف"></td><td><input value="${row.firstDay||''}" placeholder="أول يوم 1/7"></td><td><input value="${row.lastDay||''}" placeholder="آخر يوم 1/7"></td><td><span style="cursor:pointer;color:#dc2626;font-weight:800" onclick="this.closest('tr').remove();saveDBTable('employees')">✖</span></td>`;
  } else if(type==='suppliers'){
    let cur=(data?.category||'').toString().trim(); if(cur.includes('دواء')||cur.includes('مخزن')||cur.includes('شرك')||cur.includes('عام')) cur="دواء"; if(cur.includes('كوز')) cur="كوزمتكس"; if(cur.includes('مصاريف')) cur="مصاريف"; if(!FINAL_CATS.includes(cur)) cur=FINAL_CATS[0]; let opts=FINAL_CATS.map(c=>`<option value="${c}" ${c===cur?'selected':''}>${c}</option>`).join(''); tr.innerHTML=`<td><input value="${data?.name||''}" style="width:100%;padding:6px;text-align:center;font-weight:700" onblur="saveDBTable('suppliers')"></td><td><select style="width:100%;padding:6px;background:#ecfdf5;border:1.5px solid #0f766e;border-radius:6px;font-weight:800;text-align:center" onchange="saveDBTable('suppliers')">${opts}</select></td><td style="text-align:center"><span style="color:red;cursor:pointer;font-weight:900" onclick="this.closest('tr').remove();saveDBTable('suppliers')">✖</span></td>`;
  } else if(type==='tasnefSarf'){
    let cur=(data?.category||'').toString().trim()||'دواء'; if(!FINAL_CATS.includes(cur)) cur=FINAL_CATS[0]; let opts=FINAL_CATS.map(c=>`<option value="${c}" ${c===cur?'selected':''}>${c}</option>`).join(''); tr.innerHTML=`<td><input value="${data?.name||''}" placeholder="الاسم"></td><td><select onchange="saveDBTable('tasnefSarf')">${opts}</select></td><td><span onclick="this.closest('tr').remove();saveDBTable('tasnefSarf')">✖</span></td>`;
  } else if(type==='transactions'){
    let row=data||{name:''}; tr.innerHTML=`<td><input value="${row.name||''}"></td><td><span onclick="this.closest('tr').remove();saveDBTable('transactions')">✖</span></td>`;
  } else if(type==='asnaf'){
    let row=data||{name:'',price:''}; tr.innerHTML=`<td><input value="${row.name||''}"></td><td><input value="${row.price||''}"></td><td><span onclick="this.closest('tr').remove();saveDBTable('asnaf')">✖</span></td>`;
  } else {
    let row=data||{c1:'',c2:''}; tr.innerHTML=`<td><input value="${row.c1||''}"></td><td><input value="${row.c2||''}"></td><td><span onclick="this.closest('tr').remove();saveDBTable('${type}')">✖</span></td>`;
  }
  tbody.appendChild(tr);
}
function saveDBTable(type){
  let tbody=document.getElementById(`db-${type}`); if(!tbody) return; let arr=[];
  tbody.querySelectorAll('tr').forEach(tr=>{
    if(type==='suppliers'){ let name=tr.children[0]?.querySelector('input')?.value.trim(); let cat=tr.children[1]?.querySelector('select')?.value; if(name) arr.push({name, category:cat}); }
    else if(type==='tasnefSarf'){ let n=tr.querySelectorAll('input')[0]?.value.trim(); let cat=tr.querySelector('select')?.value||'دواء'; if(n) arr.push({name:n, category:cat}); }
    else if(type==='employees'){ let inputs=tr.querySelectorAll('input'); let name=inputs[0]?.value.trim(); if(name) arr.push({name, job:inputs[1]?.value||'', hodor:inputs[2]?.value||'', insiraf:inputs[3]?.value||'', firstDay:inputs[4]?.value||'', lastDay:inputs[5]?.value||''}); }
    else if(type==='transactions'){ let v=tr.querySelector('input')?.value.trim(); if(v) arr.push({name:v}); }
    else if(type==='asnaf'){ let inputs=tr.querySelectorAll('input'); let n=inputs[0]?.value.trim(); let p=(inputs[1]?.value||'').replace(/,/g,''); if(n) arr.push({name:n, price:p}); }
    else { let inputs=tr.querySelectorAll('input'); let c1=inputs[0]?.value.trim(); let c2=inputs[1]?.value.trim(); if(c1||c2) arr.push({c1, c2}); }
  });
  dbStore[type]=arr; localStorage.setItem('dbStore', JSON.stringify(dbStore));
}
function saveAllDB(){ ["employees","suppliers","transactions","arba7","masrofat","tasnefSarf","asnaf"].forEach(t=>saveDBTable(t)); alert(`✅ اتحفظت`); }
function resetAllDB(){ if(confirm('هتمسح كل القواعد؟')){ localStorage.removeItem('dbStore'); location.reload(); } }
function filterAsnaf(q){ q=(q||'').toLowerCase(); document.querySelectorAll('#db-asnaf tr').forEach(tr=>{ let txt=tr.querySelector('input')?.value?.toLowerCase()||''; tr.style.display=txt.includes(q)?'':'none'; }); }
