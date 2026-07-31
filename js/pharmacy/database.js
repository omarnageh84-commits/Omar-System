// database.js - كامل محدث - اصناف رجع + تصنيف شامل + اضافة
window.FINAL_CATS = ["مخزن دواء", "شركة دواء", "عام", "كوزمتكس", "مصاريف"];
window.FINAL_CATS_TASNEF = ["دواء", "كوزمتكس", "مصاريف"];

let defaultEmployees = ["عم جمال", "عمر", "د.محمد", "د.محمود", "عم احمد", "مدحت"];
let defaultSuppliers = ["بدر", "الفاتح", "بكر", "كريم", "مالك", "المنيسي", "القيصر", "المروه", "كلاستر", "ترند", "مكه", "مشتريات", "اون لاين", "سمارتس", "مستورد", "GTN", "التحرير", "باراديس", "سوفيكو", "ايفا", "مالتي", "رامكو", "كيما", "العامرية", "ايبكو", "سيناء", "المصريه ن", "المصريه", "كورتكسين", "لونا", "سانيتا", "سوتير", "كايروميد", "الحمد", "العالميه", "الباسط", "روز", "ليفر", "كزمو", "السلام", "مكه م", "مستحضرات", "قصر الطب", "الحافظ", "القصر العيني"];
let defaultArba7 = ["فودافون", "انستا", "د.خالد", "ا/محمود", "ام مصطفي", "نجاة", "هند"];
let defaultMasrofat = ["شنط", "نت/ارضي", "المياة", "فكه", "مصروفات", "غاز", "كهرباء", "ضرائب"];

let dbStore = {}; try { dbStore = JSON.parse(localStorage.getItem('dbStore') || '{}'); } catch { dbStore = {}; }

function getAllNamesForTasnef() {
  let emps = (dbStore.employees || []).map(e => (e.name || "").trim()).filter(Boolean);
  let sups = (dbStore.suppliers || []).map(s => (s.name || "").trim()).filter(Boolean);
  let arb = (dbStore.arba7 || []).map(a => (a.c1 || "").trim()).filter(Boolean);
  let mas = (dbStore.masrofat || []).map(m => (m.c1 || "").trim()).filter(Boolean);
  return [...new Set([...emps, ...sups, ...arb, ...mas])];
}
function syncTasnefWithSuppliers(list, existing) {
  let map = {}; (existing || []).forEach(t => { if (t.name) map[t.name.trim()] = t.category || "دواء"; });
  let src = list && list.length ? list : getAllNamesForTasnef();
  src = [...new Set(src.map(s => typeof s === 'string' ? s : s.name).map(s => s.trim()).filter(Boolean))];
  return src.map(s => ({ name: s, category: map[s] || "دواء" }));
}
function syncTasnefAll() { dbStore.tasnef = syncTasnefWithSuppliers(getAllNamesForTasnef(), dbStore.tasnef); saveDB(); renderDatabase(); }

if (!Array.isArray(dbStore.employees)) dbStore.employees = defaultEmployees.map(n => ({ name: n }));
if (!Array.isArray(dbStore.suppliers)) dbStore.suppliers = defaultSuppliers.map(n => ({ name: n, category: "مخزن دواء" }));
if (!Array.isArray(dbStore.transactions)) dbStore.transactions = [{ name: "نقدي" }, { name: "اجل" }];
if (!Array.isArray(dbStore.arba7)) dbStore.arba7 = defaultArba7.map(n => ({ c1: n, c2: "" }));
if (!Array.isArray(dbStore.masrofat)) dbStore.masrofat = defaultMasrofat.map(n => ({ c1: n, c2: "" }));
if (!Array.isArray(dbStore.asnaf)) dbStore.asnaf = [];
if (!Array.isArray(dbStore.tasnef)) dbStore.tasnef = syncTasnefWithSuppliers(getAllNamesForTasnef(), []);

let asnafPage = 1, asnafPageSize = 50, asnafQuery = "";
function saveDB() { localStorage.setItem('dbStore', JSON.stringify(dbStore)); }

function renderDatabase() {
  let el = document.getElementById('database'); if (!el) return;
  el.innerHTML = `
    <style>.db-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.db-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;height:340px;display:flex;flex-direction:column}.db-card.big{grid-column:span 3;height:420px}.db-head{padding:8px 10px;color:#fff;font-weight:800;font-size:12px;display:flex;justify-content:space-between;flex-shrink:0}.db-body{overflow:auto;flex:1}td input,td select{width:100%;font-size:11px;padding:4px}</style>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-bottom:8px">
      <button onclick="syncTasnefAll()" style="background:#7c3aed;color:#fff;border:none;padding:6px 12px;border-radius:8px;font-weight:800">🔄 تحديث التصنيف (${getAllNamesForTasnef().length})</button>
      <button onclick="saveAllDB()" style="background:#0f172a;color:#fff;border:none;padding:6px 12px;border-radius:8px">💾 حفظ الكل</button>
    </div>
    <div class="db-grid">
      <div class="db-card"><div class="db-head" style="background:#0f172a">👨⚕ موظفين (${dbStore.employees.length}) <div><span onclick="addDBRow('employees')" style="cursor:pointer;background:#fff;color:#000;padding:2px 6px;border-radius:6px">+</span> <span onclick="saveDBTable('employees')" style="cursor:pointer;background:#22c55e;padding:2px 6px;border-radius:6px">💾</span></div></div><div class="db-body"><table style="width:100%"><tbody id="db-employees"></tbody></table></div></div>
      <div class="db-card"><div class="db-head" style="background:#0f766e">🏪 موردين (${dbStore.suppliers.length}) <div><span onclick="addDBRow('suppliers')" style="cursor:pointer;background:#fff;color:#000;padding:2px 6px;border-radius:6px">+</span> <span onclick="saveDBTable('suppliers')" style="cursor:pointer;background:#000;padding:2px 6px;border-radius:6px">💾</span></div></div><div class="db-body"><table style="width:100%"><thead><tr><th>اسم</th><th>تصنيف</th><th></th></tr></thead><tbody id="db-suppliers"></tbody></table></div></div>
      <div class="db-card"><div class="db-head" style="background:#7c3aed">💳 معاملات <span onclick="addDBRow('transactions')" style="cursor:pointer;background:#fff;color:#000;padding:2px 6px;border-radius:6px">+</span></div><div class="db-body"><table style="width:100%"><tbody id="db-transactions"></tbody></table></div></div>
      <div class="db-card"><div class="db-head" style="background:#0d9488">🏷 التصنيف الشامل - كل الاسماء (${dbStore.tasnef.length}) <div><span onclick="addDBRow('tasnef')" style="cursor:pointer;background:#fff;color:#0d9488;padding:2px 8px;border-radius:6px">+ إضافة</span> <span onclick="saveDBTable('tasnef')" style="cursor:pointer;background:#000;padding:2px 6px;border-radius:6px">💾</span></div></div><div class="db-body"><table style="width:100%"><thead><tr><th>الاسم</th><th>التصنيف</th><th></th></tr></thead><tbody id="db-tasnef"></tbody></table></div></div>
      <div class="db-card"><div class="db-head" style="background:#f59e0b;color:#000">💰 ارباح (${dbStore.arba7.length}) <div><span onclick="addDBRow('arba7')" style="cursor:pointer;background:#000;color:#fff;padding:2px 6px;border-radius:6px">+</span> <span onclick="saveDBTable('arba7')" style="cursor:pointer;background:#fff;padding:2px 6px;border-radius:6px">💾</span></div></div><div class="db-body"><table style="width:100%"><tbody id="db-arba7"></tbody></table></div></div>
      <div class="db-card"><div class="db-head" style="background:#dc2626">💸 مصروفات (${dbStore.masrofat.length}) <div><span onclick="addDBRow('masrofat')" style="cursor:pointer;background:#fff;color:#dc2626;padding:2px 6px;border-radius:6px">+</span> <span onclick="saveDBTable('masrofat')" style="cursor:pointer;background:#000;padding:2px 6px;border-radius:6px">💾</span></div></div><div class="db-body"><table style="width:100%"><tbody id="db-masrofat"></tbody></table></div></div>
      <div class="db-card big"><div class="db-head" style="background:linear-gradient(135deg,#0f172a,#1e40af)">💊 الاصناف (${dbStore.asnaf.length}) <input id="asnafSearch" oninput="filterAsnaf(this.value)" placeholder="🔍 بحث..." style="padding:5px 10px;border-radius:8px;border:none;width:150px;color:#000"><div><span onclick="asnafPage=1;renderAsnaf()" style="cursor:pointer;background:#fff;color:#000;padding:3px 6px;border-radius:6px">🔄</span> <span onclick="addDBRow('asnaf')" style="cursor:pointer;background:#fff;color:#000;padding:3px 6px;border-radius:6px">+</span> <span onclick="saveDBTable('asnaf')" style="cursor:pointer;background:#22c55e;padding:3px 6px;border-radius:6px">💾</span></div></div><div class="db-body"><table style="width:100%"><thead><tr><th style="width:70%">الاسم</th><th style="width:20%">السعر</th><th>✖</th></tr></thead><tbody id="db-asnaf"></tbody></table><div id="asnafPager" style="display:flex;gap:5px;justify-content:center;padding:6px;position:sticky;bottom:0;background:#fff;border-top:1px solid #e2e8f0"></div></div></div>
    </div>
  `;
  loadDBTables();
}
function loadDBTables() {
  ['employees', 'suppliers', 'transactions', 'arba7', 'masrofat', 'tasnef'].forEach(t => { let tb = document.getElementById(`db-${t}`); if (!tb) return; tb.innerHTML = ''; (dbStore[t] || []).forEach(d => addDBRow(t, d)); });
  renderAsnaf();
}
function renderAsnaf() {
  let tb = document.getElementById('db-asnaf'); let pager = document.getElementById('asnafPager'); if (!tb) return;
  let list = dbStore.asnaf; if (asnafQuery) { let q = asnafQuery.toLowerCase(); list = list.filter(a => (a.name || "").toLowerCase().includes(q)); }
  let total = Math.max(1, Math.ceil(list.length / asnafPageSize)); if (asnafPage > total) asnafPage = total;
  let slice = list.slice((asnafPage - 1) * asnafPageSize, asnafPage * asnafPageSize);
  tb.innerHTML = ''; slice.forEach((r, i) => {
    let idx = (asnafPage - 1) * asnafPageSize + i;
    let tr = document.createElement('tr');
    tr.innerHTML = `<td><input value="${(r.name || '').replace(/"/g, '&quot;')}" data-idx="${idx}" oninput="updateAsnafName(this)"></td><td><input value="${r.price || ''}" type="number" data-idx="${idx}" oninput="updateAsnafPrice(this)" style="background:#f0fdf4"></td><td><span style="color:red;cursor:pointer" onclick="deleteAsnaf(${idx})">✖</span></td>`;
    tb.appendChild(tr);
  });
  let h = ''; for (let i = 1; i <= total; i++) { h += `<button onclick="asnafPage=${i};renderAsnaf()" style="padding:3px 7px;border-radius:6px;border:1px solid #e2e8f0;background:${i === asnafPage ? '#0f172a' : '#fff'};color:${i === asnafPage ? '#fff' : '#000'}">${i}</button>`; } if (pager) pager.innerHTML = h;
}
function addDBRow(type, data) {
  if (type === 'asnaf') { dbStore.asnaf.unshift({ name: data?.name || '', price: data?.price || '' }); asnafPage = 1; saveDB(); renderAsnaf(); return; }
  let tb = document.getElementById(`db-${type}`); if (!tb) return;
  let tr = document.createElement('tr');
  if (type === 'suppliers') { let cur = data?.category || "مخزن دواء"; let opts = window.FINAL_CATS.map(c => `<option ${c === cur ? 'selected' : ''}>${c}</option>`).join(''); tr.innerHTML = `<td><input value="${(data?.name || '').replace(/"/g, '&quot;')}"></td><td><select>${opts}</select></td><td><span onclick="this.closest('tr').remove();saveDBTable('suppliers')" style="color:red;cursor:pointer">✖</span></td>`; }
  else if (type === 'tasnef') { let cur = data?.category || "دواء"; let opts = window.FINAL_CATS_TASNEF.map(c => `<option ${c === cur ? 'selected' : ''}>${c}</option>`).join(''); tr.innerHTML = `<td><input value="${(data?.name || '').replace(/"/g, '&quot;')}" placeholder="اسم جديد"></td><td><select>${opts}</select></td><td><span onclick="this.closest('tr').remove();saveDBTable('tasnef')" style="color:red;cursor:pointer">✖</span></td>`; }
  else if (type === 'arba7' || type === 'masrofat') { tr.innerHTML = `<td><input value="${(data?.c1 || '').replace(/"/g, '&quot;')}"></td><td><input value="${(data?.c2 || '').replace(/"/g, '&quot;')}"></td><td><span onclick="this.closest('tr').remove();saveDBTable('${type}')" style="color:red;cursor:pointer">✖</span></td>`; }
  else { tr.innerHTML = `<td><input value="${(data?.name || '').replace(/"/g, '&quot;')}"></td><td><span onclick="this.closest('tr').remove();saveDBTable('${type}')" style="color:red;cursor:pointer">✖</span></td>`; }
  tb.appendChild(tr);
}
function saveDBTable(type) {
  if (type === 'asnaf') { saveDB(); return; }
  let tb = document.getElementById(`db-${type}`); if (!tb) return;
  let arr = []; tb.querySelectorAll('tr').forEach(tr => {
    let inp = tr.querySelectorAll('input'); let sel = tr.querySelector('select'); let n = inp[0]?.value.trim(); if (!n) return;
    if (type === 'suppliers' || type === 'tasnef') arr.push({ name: n, category: sel?.value });
    else if (type === 'arba7' || type === 'masrofat') arr.push({ c1: inp[0].value.trim(), c2: inp[1]?.value.trim() });
    else arr.push({ name: n });
  });
  dbStore[type] = arr; if (type !== 'tasnef' && type !== 'asnaf') { dbStore.tasnef = syncTasnefWithSuppliers(getAllNamesForTasnef(), dbStore.tasnef); } saveDB(); if (type !== 'tasnef') renderDatabase();
}
function updateAsnafName(inp) { let i = +inp.dataset.idx; if (dbStore.asnaf[i]) { dbStore.asnaf[i].name = inp.value; saveDB(); } }
function updateAsnafPrice(inp) { let i = +inp.dataset.idx; if (dbStore.asnaf[i]) { dbStore.asnaf[i].price = inp.value; saveDB(); } }
function deleteAsnaf(i) { if (confirm('تحذف؟')) { dbStore.asnaf.splice(i, 1); saveDB(); renderAsnaf(); } }
function filterAsnaf(q) { asnafQuery = q || ""; asnafPage = 1; renderAsnaf(); }
function saveAllDB() { ['employees', 'suppliers', 'transactions', 'arba7', 'masrofat', 'tasnef', 'asnaf'].forEach(t => saveDBTable(t)); saveDB(); alert('✅ اتحفظ - التصنيف: ' + dbStore.tasnef.length + ' - الاصناف: ' + dbStore.asnaf.length); }

window.renderDatabase = renderDatabase; window.addDBRow = addDBRow; window.saveDBTable = saveDBTable; window.saveAllDB = saveAllDB; window.syncTasnefAll = syncTasnefAll; window.renderAsnaf = renderAsnaf; window.updateAsnafName = updateAsnafName; window.updateAsnafPrice = updateAsnafPrice; window.deleteAsnaf = deleteAsnaf; window.filterAsnaf = filterAsnaf;
