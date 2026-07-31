// database.js - Omar System - محدث بالدروب ليست + تصنيف الصرف
let defaultEmployees = ["عم جمال", "عمر", "د.محمد", "د.محمود", "عم احمد", "مدحت"];
let defaultSuppliers = ["بدر", "الفاتح", "بكر", "كريم", "مالك", "المنيسي", "القيصر", "المروه", "كلاستر", "ترند", "مكه", "مشتريات", "اون لاين", "سمارتس", "مستورد", "GTN", "التحرير", "باراديس", "سوفيكو", "ايفا", "مالتي", "رامكو", "كيما", "العامرية", "ايبكو", "سيناء", "المصريه ن", "المصريه", "كورتكسين", "لونا", "سانيتا", "سوتير", "كايروميد", "الحمد", "العالميه", "الباسط", "روز", "ليفر", "كزمو", "السلام", "مكه م", "مستحضرات", "قصر الطب", "الحافظ", "القصر العيني"];
let defaultArba7 = ["فودافون", "انستا", "د.خالد", "ا/محمود", "ام مصطفي", "نجاة", "هند"];
let defaultMasrofat = ["شنط", "نت/ارضي", "المياة", "فكه", "مصروفات", "غاز", "كهرباء", "ضرائب"];
let defaultTasnefSarf = ["دواء", "كوزمتكس", "مصاريف"];

let defaultAsnaf = [
  ["ابونوف 20 قرص - سعر 110", 110], ["اتاكاند 16 مجم 14 قرص - سعر 116 - (IMP)", 116], ["اتاكاند 16 مجم 14 قرص - سعر 85 - (IMP)", 85], ["اتاكاند 8 مجم 14 قرص - سعر 83 - (IMP)", 83], ["اتاكاند بلس 16/12.5 مجم 14 قرص - سعر 116", 116], ["اتاكاند بلس 32/25 مجم 14 قرص - سعر 179 - (IMP)", 179], ["ارث فري 20 مجم 30 قرص - سعر 261", 261], ["اركوكسيا 90 مجم 14 قرص - سعر 239", 239], ["اريسبت 10 مجم 14 قرص - سعر 360", 360], ["اريسبت 10 مجم 7 قرص - سعر 235", 235], ["اريسيبت 10 مجم 14 قرص - سعر 180", 180], ["اريسيبت 10 مجم 14 قرص - سعر 470", 470], ["اريسيبت 5 مجم 14 قرص - سعر 300", 300], ["اريميدكس 1 مجم 28 قرص - سعر 706 - (IMP)", 706], ["افارا 20 مجم 30 قرص - سعر 483 - (IMP)", 483], ["افاصويا 300 مجم 30 كبسول - سعر 350", 350], ["افودارت 0.5 مجم 30 كبسول-سعر219", 219], ["اكتوس 15 - سعر 210 - (IMP)", 210], ["اكتوس 30 - سعر 372 - (IMP)", 150], ["اكتونكس كيدز 20 مل - سعر 370", 370], ["اكتي - كولا 10 كيس - سعر 258", 258], ["اكتي - كولا سي 30 كيس - سعر 666", 666], ["اكسفورج 160/10 مجم سعر 218 - (IMP)", 218], ["اكسفورج اتش سي تي 10/160/25 مجم سعر 270 - (IMP)", 270], ["اكسفورج اتش سي تي 5/160/12.5 مجم سعر 270 - (IMP)", 270], ["الفافيم 300 مجم 20 كبسول - سعر 160", 160], ["الفافيم 600 مجم 20 كبسول - سعر 290", 290], ["الليرديب بخاخ - سعر 300", 300], ["اليكوس 5 مجم - سعر 532 - (IMP)", 532], ["اليمبوسيسس 5 مجم 30 قرص - سعر 269.25", 269.25], ["انتريستو 100 مجم 28 قرص - سعر 1700 - (IMP)", 1700], ["انتريستو 200 مجم 56 قرص - سعر 3559 - (IMP)", 3559], ["انتريستو 50 مجم 28 قرص - سعر 1700 - (IMP)", 1700], ["انسيلاكوكس 90 مجم 30 قرص - سعر 315", 315], ["انهالكس 30 كبسول - سعر 415", 415], ["انيجي 10/20 مجم 14 قرص-سعر200.25", 200.25], ["اوكساليبتال 300 مجم 30 قرص - سعر 180", 180], ["اوكساليبتال 600 مجم 30 قرص - سعر 180", 303], ["اوميجال الترا 30 كبسول - سعر 210", 210], ["اومينك اوكاس 0.4 - سعر 282 - (IMP)", 282], ["ايزوجاست 40 مجم 14 كبسول - سعر 160", 160], ["ايزوجاست 40 مجم 28 كبسول - سعر 320", 320], ["ايكتونكس كيدز - سعر 370", 370], ["ايكندرا بلس 30 قرص - سعر 147", 147], ["ايكوزاليب 1 جم - سعر276", 276], ["ايمباكوزا بلس 10/5 مجم 30 قرص - سعر 357", 357], ["ايمباكوزا بلس 25/5 مجم 30 قرص - 357", 357], ["اينرا 10 أكياس - سعر 250", 250], ["اينرا 10 أكياس - سعر 300", 300], ["براديبيكت 7.5 مجم 28 قرص - سعر 176", 176], ["بروتولانس 30 مجم - سعر 114", 114], ["بروست ايد 20 كبسول - سعر 83.5", 83.5], ["بروستانورم 30 كبسوله - سعر 165", 165], ["بروستانورم 30 كبسوله - سعر 231", 231], ["بروكورالان 5 مجم 28 قرص - سعر 352 - (IMP)", 352], ["بروكورالان 7.5مجم 28 قرص - سعر352 - (IMP)", 352], ["بريزتري بخاخ 160/9/4.8 مكم 120 جرعه - سعر 1060 - (IMP)", 1060], ["برينتاليكس 10 مجم 14 قرص - سعر 364 - (IMP)", 364], ["برينتاليكس 20 مجم 14 قرص - سعر 573 - (IMP)", 573], ["بلادوجرا 50 مجم 30 قرص - سعر 357", 357], ["بلنديل 5 مجم 30 قرص - سعر 81 - (IMP)", 81], ["بنجيرايد 0.5 مجم 30 كبسول - سعر 123", 123], ["بنجيرايد 0.5 مجم 30 كبسول - سعر 162", 162], ["بولي فريش اكسترا - سعر 185", 185], ["بون كير 1 جرام 30 كبسوله - سعر 132", 132], ["بيبون بلس - سعر 100", 100], ["بيبون بلس 20 كبسول - سعر 150", 150], ["بيتاسيرك 16 مجم 60 قرص - سعر 219", 219], ["بيتاسيرك 24 مجم 40 قرص - سعر 218", 218], ["بيتاسيرك 8 مجم 100 قرص - سعر 160", 160], ["بيتميجا 50 مجم 30 قرص - سعر 498 - (IMP)", 498], ["بيتميجا 50 مجم 30 قرص - سعر 562 - (IMP)", 562], ["بيريليك 90 مجم - سعر 1064 - (IMP)", 1064], ["بيسكالدين 300 مجم 15 كبسول - سعر450 - (IMP)", 450]
  //... باقي الأصناف الـ 232 زي ما هي هتفضل
];

const FINAL_CATS = ["دواء", "كوزمتكس", "مصاريف"];

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
dbStore.suppliers = (dbStore.suppliers||[]).map(s=>{ if(typeof s==='string') return {name:s, category:"دواء"}; let cur=(s.category||s.info||"").toString().trim(); if(cur.includes('دواء')||cur.includes('مخزن')||cur.includes('شرك')) cur="دواء"; if(cur.includes('كوز')) cur="كوزمتكس"; if(cur.toLowerCase().includes('imp')||cur.includes('مصاريف')||cur.includes('مصروف')) cur="مصاريف"; if(!FINAL_CATS.includes(cur)) cur=FINAL_CATS[0]; return {name:s.name, category:cur}; });
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
     .db-head{ padding:10px 12px; color:#fff; font-weight:800; font-size:12px; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; z-index:2; flex-shrink:0; }
     .db-body{ overflow:auto; flex:1; }
     .db-body table{ width:100%; table-layout:fixed; }
     .db-body th{ font-size:10px; padding:8px 4px; position:sticky; top:0; background:#f8fafc; z-index:1; white-space:nowrap; }
     .db-body td{ height:38px; font-size:12px; overflow:hidden; text-overflow:ellipsis; }
     .db-body td input,.db-body td select{ font-size:11px; padding:0 4px; width:100%; box-sizing:border-box; }
    </style>
    <div id="dbActions" style="grid-column:1/-1;display:flex;gap:8px;justify-content:flex-end;margin-bottom:6px">
      <button onclick="saveAllDB()" style="background:#0f172a;color:#fff;border:none;padding:7px 16px;border-radius:8px;font-weight:800;font-size:11px;cursor:pointer">💾 حفظ الكل</button>
      <button onclick="resetAllDB()" style="background:#fff;color:#dc2626;border:1.5px solid #fecdd3;padding:7px 16px;border-radius:8px;font-weight:800;font-size:11px;cursor:pointer">♻ تهيئة القواعد</button>
    </div>
    <div class="db-grid">
      <div class="db-card employees">
        <div class="db-head" style="background:#0f172a">👨‍⚕️ الموظفين (${dbStore.employees.length}) <div><span onclick="addDBRow('employees')" style="cursor:pointer;background:#fff;color:#000;padding:3px 7px;border-radius:6px">+</span> <span onclick="saveDBTable('employees')" style="cursor:pointer;background:#22c55e;padding:3px 7px;border-radius:6px">💾</span></div></div>
        <div class="db-body"><table class="pro-table"><thead><tr><th>الاسم</th><th>الوظيفة</th><th>الحضور</th><th>الانصراف</th><th>أول يوم</th><th>آخر يوم</th><th>✖</th></tr></thead><tbody id="db-employees"></tbody></table></div>
      </div>
      <div class="db-card">
        <div class="db-head" style="background:#0f766e">🏪 الموردين (${dbStore.suppliers.length}) <div><span onclick="addDBRow('suppliers')" style="cursor:pointer;background:#fff;color:#0f766e;padding:3px 7px;border-radius:6px">+</span> <span onclick="saveDBTable('suppliers')" style="cursor:pointer;background:#0f172a;padding:3px 7px;border-radius:6px">💾</span></div></div>
        <div class="db-body"><table class="pro-table"><thead><tr><th>اسم المورد/المصروف</th><th>التصنيف</th><th>✖</th></tr></thead><tbody id="db-suppliers"></tbody></table></div>
      </div>
      <div class="db-card">
        <div class="db-head" style="background:#7c3aed">💳 المعاملات <div><span onclick="addDBRow('transactions')" style="cursor:pointer;background:#fff;color:#7c3aed;padding:3px 7px;border-radius:6px">+</span> <span onclick="saveDBTable('transactions')" style="cursor:pointer;background:#000;padding:3px 7px;border-radius:6px">💾</span></div></div>
        <div class="db-body"><table class="pro-table"><thead><tr><th>المعاملة</th><th>✖</th></tr></thead><tbody id="db-transactions"></tbody></table></div>
      </div>
      <div class="db-card">
        <div class="db-head" style="background:#f59e0b;color:#000">💰 الارباح (${dbStore.arba7.length}) <div><span onclick="addDBRow('arba7')" style="cursor:pointer;background:#000;color:#fff;padding:3px 7px;border-radius:6px">+</span> <span onclick="saveDBTable('arba7')" style="cursor:pointer;background:#fff;color:#000;padding:3px 7px;border-radius:6px">💾</span></div></div>
        <div class="db-body"><table class="pro-table"><thead><tr><th>الاسم</th><th>المعلومة</th><th>✖</th></tr></thead><tbody id="db-arba7"></tbody></table></div>
      </div>
      <div class="db-card">
        <div class="db-head" style="background:#dc2626">💸 المصروفات (${dbStore.masrofat.length}) <div><span onclick="addDBRow('masrofat')" style="cursor:pointer;background:#fff;color:#dc2626;padding:3px 7px;border-radius:6px">+</span> <span onclick="saveDBTable('masrofat')" style="cursor:pointer;background:#000;padding:3px 7px;border-radius:6px">💾</span></div></div>
        <div class="db-body"><table class="pro-table"><thead><tr><th>الاسم</th><th>المعلومة</th><th>✖</th></tr></thead><tbody id="db-masrofat"></tbody></table></div>
      </div>
      <div class="db-card" style="border:2px solid #0f766e">
        <div class="db-head" style="background:#0f766e">🏷️ تصنيف الصرف (${(dbStore.tasnefSarf||[]).length}) <div><span onclick="addDBRow('tasnefSarf')" style="cursor:pointer;background:#fff;color:#0f766e;padding:3px 7px;border-radius:6px">+</span> <span onclick="saveDBTable('tasnefSarf')" style="cursor:pointer;background:#000;padding:3px 7px;border-radius:6px">💾</span></div></div>
        <div class="db-body"><table class="pro-table"><thead><tr><th>الاسم</th><th>التصنيف</th><th>✖</th></tr></thead><tbody id="db-tasnefSarf"></tbody></table></div>
      </div>
      <div class="db-card big">
        <div class="db-head" style="background:linear-gradient(135deg,#0f172a,#1e40af)">💊 الاصناف (${asnafCount}) <input id="asnafSearch" oninput="filterAsnaf(this.value)" placeholder="🔍 ابحث..." style="padding:6px 10px;border-radius:8px;border:none;width:140px;font-size:12px;color:#000"><div><span onclick="addDBRow('asnaf')" style="cursor:pointer;background:#fff;color:#000;padding:3px 8px;border-radius:6px">+ إضافة</span> <span onclick="saveDBTable('asnaf')" style="cursor:pointer;background:#22c55e;padding:3px 8px;border-radius:6px">💾 حفظ</span></div></div>
        <div class="db-body"><table class="pro-table"><thead><tr><th style="width:75%">الاسم</th><th style="width:20%">السعر</th><th style="width:5%">✖</th></tr></thead><tbody id="db-asnaf"></tbody></table></div>
      </div>
    </div>
  `;
  loadDBTables();
}
function loadDBTables(){ ['employees','suppliers','transactions','arba7','masrofat','tasnefSarf','asnaf'].forEach(t=>{ let tb=document.getElementById(`db-${t}`); if(!tb) return; tb.innerHTML=''; (dbStore[t]||[]).forEach(d=>addDBRow(t,d)); }); }
function addDBRow(type,data){
  let tbody=document.getElementById(`db-${type}`); if(!tbody) return; let tr=document.createElement('tr'); tr.className='asnaf-row';
  if(type==='employees'){
    let row=data||{name:'',job:'',hodor:'',insiraf:'',firstDay:'',lastDay:''};
    tr.innerHTML=`<td><input value="${row.name||''}" placeholder="الاسم"></td><input value="${row.job||''}" placeholder="الوظيفة"></td><td><input value="${row.hodor||''}" placeholder="حضور"></td><td><input value="${row.insiraf||''}" placeholder="انصراف"></td><td><input value="${row.firstDay||''}" placeholder="أول يوم 1/7"></td><td><input value="${row.lastDay||''}" placeholder="آخر يوم 1/7"></td><td><span style="cursor:pointer;color:#dc2626;font-weight:800" onclick="this.closest('tr').remove();saveDBTable('${type}')">✖</span></td>`;
  } else if(type==='suppliers'){
    let cur=(data?.category||'').toString().trim(); if(cur.includes('دواء')||cur.includes('مخزن')||cur.includes('شرك')) cur="دواء"; if(cur.includes('كوز')) cur="كوزمتكس"; if(cur.includes('مصاريف')||cur.includes('مصروف')) cur="مصاريف"; if(!FINAL_CATS.includes(cur)) cur=FINAL_CATS[0]; let opts=FINAL_CATS.map(c=>`<option value="${c}" ${c===cur?'selected':''}>${c}</option>`).join(''); tr.innerHTML=`<td><input value="${(data?.name||'').replace(/"/g,'&quot;')}" style="width:100%;padding:6px;text-align:center;font-weight:700" onblur="saveDBTable('suppliers')"></td><td><select style="width:100%;padding:6px;background:#ecfdf5;border:1.5px solid #0f766e;border-radius:6px;font-weight:800;text-align:center" onchange="saveDBTable('suppliers')">${opts}</select></td><td style="text-align:center"><span style="color:red;cursor:pointer;font-weight:900" onclick="this.closest('tr').remove();saveDBTable('suppliers')">✖</span></td>`;
  } else if(type==='tasnefSarf'){
    let cur=(data?.category||'').toString().trim()||'دواء'; if(!FINAL_CATS.includes(cur)) cur=FINAL_CATS[0]; let opts=FINAL_CATS.map(c=>`<option value="${c}" ${c===cur?'selected':''}>${c}</option>`).join(''); let row=data||{name:'',category:cur}; tr.innerHTML=`<td><input value="${(row.name||'').replace(/"/g,'&quot;')}" placeholder="الاسم"></td><td><select style="width:100%;padding:5px;background:#f0fdf4;border:1px solid #0f766e;border-radius:6px;font-weight:700;text-align:center" onchange="saveDBTable('tasnefSarf')">${opts}</select></td><td><span style="cursor:pointer;color:#dc2626;font-weight:800" onclick="this.closest('tr').remove();saveDBTable('tasnefSarf')">✖</span></td>`;
  } else if(type==='transactions'){
    let row=data||{name:''}; tr.innerHTML=`<td><input value="${row.name||''}" placeholder="المعاملة"></td><td><span style="cursor:pointer;color:#dc2626;font-weight:800" onclick="this.closest('tr').remove();saveDBTable('${type}')">✖</span></td>`;
  } else if(type==='asnaf'){
    let row=data||{name:'',price:''}; tr.innerHTML=`<td><input value="${(row.name||'').replace(/"/g,'&quot;')}" placeholder="اسم الصنف"></td><td><input value="${row.price||''}" placeholder="السعر" type="text"></td><td><span style="cursor:pointer;color:#dc2626;font-weight:800" onclick="this.closest('tr').remove();saveDBTable('${type}')">✖</span></td>`;
  } else {
    let row=data||{c1:'',c2:''}; tr.innerHTML=`<td><input value="${row.c1||''}" placeholder="الاسم"></td><td><input value="${row.c2||''}" placeholder="المعلومة"></td><td><span style="cursor:pointer;color:#dc2626;font-weight:800" onclick="this.closest('tr').remove();saveDBTable('${type}')">✖</span></td>`;
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
function saveAllDB(){ ["employees","suppliers","transactions","arba7","masrofat","tasnefSarf","asnaf"].forEach(t=>saveDBTable(t)); alert(`✅ اتحفظت كل القواعد`); }
function resetAllDB(){ if(confirm('⚠️ هتمسح كل القواعد؟')){ localStorage.removeItem('dbStore'); location.reload(); } }
function filterAsnaf(q){ q=(q||'').toLowerCase(); document.querySelectorAll('#db-asnaf tr').forEach(tr=>{ let txt=tr.querySelector('input')?.value?.toLowerCase()||''; tr.style.display=txt.includes(q)?'':'none'; }); }
