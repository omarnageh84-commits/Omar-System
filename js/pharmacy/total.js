// total.js V5 ULTRA PRO + النسب رجعت - شكل احترافي
let selectedMonthKey = 'all'; let currentPage = 1; const PAGE_SIZE = 40;
let _cache = null, _monthsMap = null; let _activeCatFilter = 'الكل';
const AR_MONTHS = ['يناير', 'فبراير', 'مارس', 'ابريل', 'مايو', 'يونيو', 'يوليو', 'اغسطس', 'سبتمبر', 'اكتوبر', 'نوفمبر', 'ديسمبر'];
window.FINAL_CATS_TASNEF = window.FINAL_CATS_TASNEF || ["دواء", "كوزمتكس", "مصاريف"];
let _lastData = { expensesByCat: {}, expensesBySupplier: {}, list: [], totalSales: 0, trend: {} };

function parseDate(s) { if (!s) return null; let p = s.split('/'); if (p.length !== 3) return null; let d = new Date(+p[2], +p[1] - 1, +p[0]); return isNaN(d) ? null : d; }
function calcNum(v) { if (v == null) return 0; let e = (v + '').replace(/,/g, '').replace(/٫/g, '.').trim(); if (!e) return 0; let n = parseFloat(e); return isNaN(n) ? 0 : n; }
function getMonthKey(d) { return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`; }
function getMonthNameOnly(k) { if (!k) return 'الكل'; let [m] = k.split('/'); return AR_MONTHS[+m - 1] || k; }
function toArray(d) { if (!d) return []; if (Array.isArray(d)) return d; if (typeof d === 'object') return Object.values(d); return []; }
function getTasnefMap() { try { let db = JSON.parse(localStorage.getItem('dbStore') || '{}'); let m = {}; (db.tasnef || []).forEach(t => { let n = (t.name || "").trim(); if (n) m[n] = (t.category || "دواء").trim(); }); return m; } catch { return {}; } }
function getCategoryForSupplier(s, map) { if (!s) return 'غير مصنف'; let t = s.trim(); if (map[t]) return map[t]; for (let k in map) { if (t.includes(k) || k.includes(t)) return map[k]; } return 'دواء'; }

function renderTotal() {
  let c = document.getElementById('total'); if (!c) return;
  if (document.getElementById('total-wrap')) { buildCache(); renderBar(); renderTable(); return; }
  c.innerHTML = `
  <div id="total-wrap">
    <style>
.months-scroll{display:flex;gap:6px;overflow-x:auto;padding:8px 4px;white-space:nowrap}
.m-tab{flex:0 0 auto;padding:7px 16px;border-radius:12px;border:1px solid #e2e8f0;background:#fff;font-weight:800;font-size:11px;cursor:pointer}
.m-tab.active{background:#0f172a;color:#fff}
.kpi-row{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}
.kpi{flex:1;min-width:140px;background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:10px 12px;display:flex;justify-content:space-between;align-items:center}
.kpi b{font-size:16px}
.cat-pills{display:flex;gap:6px;margin:8px 0}
.cat-pill{padding:6px 14px;border-radius:20px;border:1px solid #e2e8f0;background:#fff;font-weight:800;font-size:11px;cursor:pointer}
.cat-pill.active{background:#0f172a;color:#fff}
.ultra-grid{display:grid;grid-template-columns:1.2fr.8fr;gap:12px;margin-top:12px}
@media(max-width:1100px){.ultra-grid{grid-template-columns:1fr}}
.card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden}
.card-h{padding:10px 12px;border-bottom:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center;font-weight:900;font-size:12px}
.tbl{width:100%;border-collapse:collapse;font-size:11px}.tbl th{background:#f8fafc;padding:8px;color:#64748b;position:sticky;top:0}.tbl td{padding:8px;text-align:center;border-bottom:1px solid #f1f5f9}
.row-day{cursor:pointer}.row-day:hover{background:#f0f9ff!important}
.bar-bg{height:6px;background:#f1f5f9;border-radius:10px;overflow:hidden}.bar-f{height:100%;border-radius:10px}
.modal{position:fixed;inset:0;background:rgba(0,0,0,.5);display:none;align-items:center;justify-content:center;z-index:10000;padding:12px}.modal.show{display:flex}.modal-box{background:#fff;border-radius:18px;width:95vw;max-width:1000px;max-height:90vh;overflow:auto}
.search{width:100%;padding:8px 12px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:12px}
.mini-input{width:52px;padding:4px 6px;border:1.5px solid #cbd5e1;border-radius:8px;font-weight:800;text-align:center;font-size:12px;background:#f8fafc}
.pro-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:10px}
@media(max-width:900px){.pro-grid{grid-template-columns:1fr}}
    </style>
    <div id="monthsBar" class="months-scroll"></div>
    <div style="display:flex;gap:8px;align-items:center;margin:6px 0;flex-wrap:wrap"><span id="monthSummary" style="font-weight:800;font-size:11px"></span><div style="margin-right:auto;display:flex;gap:6px"><input id="supSearch" class="search" style="width:200px" placeholder="🔍 ابحث مورد..." oninput="filterSuppliers()"><button onclick="exportExcel()" style="background:#0f172a;color:#fff;border:none;border-radius:8px;padding:6px 10px;font-weight:800">📥 اكسل</button><button onclick="_cache=null;_monthsMap=null;buildCache();renderTable()" style="background:#16a34a;color:#fff;border:none;border-radius:8px;padding:6px 10px">🔄</button></div></div>

    <div id="proStats"></div>

    <div class="ultra-grid">
      <div class="card"><div class="card-h"><span>🏆 الموردين - حسب الفلتر</span><span id="supCount" style="background:#f1f5f9;padding:3px 8px;border-radius:20px;font-size:10px"></span></div><div style="max-height:420px;overflow:auto"><table class="tbl"><thead><tr><th style="text-align:right">المورد</th><th>الفئة</th><th>القيمة</th><th style="width:120px">نسبة</th></tr></thead><tbody id="supTbody"></tbody></table></div></div>
      <div class="card"><div class="card-h"><span>📈 تطور الشراء يوميا</span></div><div style="max-height:420px;overflow:auto"><table class="tbl"><thead><tr><th>التاريخ</th><th>دواء</th><th>كوزمتكس</th><th>مصاريف</th><th>الاجمالي</th></tr></thead><tbody id="dailyTrend"></tbody></table></div></div>
    </div>

    <div class="card" style="margin-top:12px"><div class="card-h"><span>📋 تفاصيل اليومية (دوس لفتح اليوم)</span><div class="cat-pills" id="catPills"></div></div><div id="totalTableCard" style="max-height:45vh;overflow:auto"></div><div id="totalPager" style="display:flex;gap:5px;justify-content:center;padding:8px"></div></div>
    <div id="drillModal" class="modal" onclick="if(event.target===this)closeDrill()"><div class="modal-box" id="drillBox"></div></div>
  </div>`;
  buildCache(); renderBar(); renderTable();
}
function buildCache() { if (_cache && _monthsMap) return; let store = {}; try { store = JSON.parse(localStorage.getItem('dailyStore') || '{}'); } catch { } let all = [], map = {}; for (let k in store) { let d = parseDate(k); if (!d) continue; all.push({ k, d, data: store[k] }); let mk = getMonthKey(d); if (!map[mk]) map[mk] = { key: mk, items: [] }; map[mk].items.push({ k, d, data: store[k] }); } all.sort((a, b) => a.d - b.d); Object.values(map).forEach(g => g.items.sort((a, b) => a.d - b.d)); _cache = all; _monthsMap = map; }
function renderBar() {
  let bar = document.getElementById('monthsBar'); if (!bar || !_monthsMap) return;
  let keys = Object.keys(_monthsMap).sort((a, b) => { let [am, ay] = a.split('/'), [bm, by] = b.split('/'); return new Date(by, bm - 1) - new Date(ay, am - 1); });
  let h = ''; keys.forEach(mk => { h += `<button class="m-tab ${selectedMonthKey === mk ? 'active' : ''}" data-m="${mk}">${getMonthNameOnly(mk)}</button>`; }); h += `<button class="m-tab ${selectedMonthKey === 'all' ? 'active' : ''}" data-m="all">الكل ${_cache.length}</button>`;
  bar.innerHTML = h; bar.querySelectorAll('.m-tab').forEach(b => b.onclick = () => { selectedMonthKey = b.dataset.m; currentPage = 1; renderBar(); renderTable(); });
}
function renderTable() {
  let tasnefMap = getTasnefMap(); let list = selectedMonthKey === 'all' ? _cache : (_monthsMap[selectedMonthKey]?.items || []);
  let totalSales = 0, expensesByCat = {}; window.FINAL_CATS_TASNEF.forEach(c => expensesByCat[c] = 0); let expensesBySupplier = {}; let trend = {};
  list.forEach(({ k: dateKey, data }) => {
    let arr = toArray(data); let empRows = {}, insta = 0, voda = 0;
    arr.forEach(it => { if (!it || !it.id) return; let id = it.id + ''; if (id.startsWith('t1_')) { let m = id.match(/t1_r(\d+)_c(\d+)/); if (!m) return; let r = m[1], c = m[2]; if (!empRows[r]) empRows[r] = { shift: 0, diff: 0, val: 0, sup: '' }; if (c === '2') empRows[r].shift = calcNum(it.val); else if (c === '3') empRows[r].diff = calcNum(it.val); else if (c === '5') empRows[r].sup = (it.val || '').trim(); else if (c === '6') empRows[r].val = calcNum(it.val); } else { if (id.includes('insta')) insta += calcNum(it.val); else if (id.includes('voda')) voda += calcNum(it.val); } });
    if (!trend[dateKey]) trend[dateKey] = { دواء: 0, كوزمتكس: 0, مصاريف: 0, total: 0 };
    Object.values(empRows).forEach(r => { totalSales += (r.shift + r.diff); if (r.val && r.sup) { let cat = getCategoryForSupplier(r.sup, tasnefMap); expensesByCat[cat] = (expensesByCat[cat] || 0) + r.val; expensesBySupplier[r.sup] = (expensesBySupplier[r.sup] || 0) + r.val; trend[dateKey][cat] = (trend[dateKey][cat] || 0) + r.val; trend[dateKey].total += r.val; } }); totalSales += insta + voda;
  });
  _lastData = { expensesByCat, expensesBySupplier, list, totalSales, trend };
  let totalExpenses = Object.values(expensesByCat).reduce((a, b) => a + b, 0);
  document.getElementById('monthSummary').textContent = `${list.length} يوم | بيع ${totalSales.toLocaleString()} | مصروف ${totalExpenses.toLocaleString()} | صافي ${(totalSales - totalExpenses).toLocaleString()}`;

  // ===== النسب رجعت هنا =====
  let saved = JSON.parse(localStorage.getItem('profitDist2') || '{"my":10,"dist":{"دواء":50,"كوزمتكس":30,"مصاريف":20}}');
  document.getElementById('proStats').innerHTML = `
  <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:12px">
    <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px">
      <b>📊 ملخص احترافي بالنسب - ${selectedMonthKey === 'all' ? 'الكل' : getMonthNameOnly(selectedMonthKey)} - ${Object.keys(tasnefMap).length} مورد مصنف</b>
      <div style="display:flex;gap:6px;align-items:center"><span style="font-size:11px;font-weight:800">نسبة ربحي</span><input id="myP" class="mini-input" type="number" value="${saved.my}" oninput="updatePro()"><span>%</span></div>
    </div>
    <div class="kpi-row">
      <div class="kpi"><div><div style="font-size:10px;color:#64748b">إجمالي البيع</div><b>${totalSales.toLocaleString()}</b></div><span>💰</span></div>
      <div class="kpi"><div><div style="font-size:10px;color:#64748b">المصروف الفعلي</div><b>${totalExpenses.toLocaleString()}</b></div><span>📦</span></div>
      <div class="kpi"><div><div style="font-size:10px;color:#64748b">الصافي قبل ربحك</div><b>${(totalSales - totalExpenses).toLocaleString()}</b></div><span>📈</span></div>
      <div class="kpi" style="background:#f0fdf4"><div><div style="font-size:10px">ربحي</div><b id="myV">0</b></div><span>👤</span></div>
      <div class="kpi" style="background:#fff7ed"><div><div style="font-size:10px">الباقي للتوزيع</div><b id="remV">0</b></div><span>🧮</span></div>
    </div>
    <div class="pro-grid">
      ${window.FINAL_CATS_TASNEF.map(cat => {
    let actual = expensesByCat[cat] || 0; let perc = totalExpenses ? (actual / totalExpenses * 100).toFixed(1) : 0;
    let col = cat === 'دواء' ? '#0f766e' : cat === 'كوزمتكس' ? '#7c3aed' : '#dc2626';
    let allocPerc = saved.dist[cat] || 0;
    return `<div style="border:1px solid #f1f5f9;border-radius:14px;padding:10px;border-top:3px solid ${col};cursor:pointer" onclick="openCategoryDetails('${cat}')">
          <div style="display:flex;justify-content:space-between"><b><span style="display:inline-block;width:8px;height:8px;background:${col};border-radius:50%"></span> ${cat}</b><small>${perc}% من المصروف • دوس</small></div>
          <div style="font-size:20px;font-weight:900;margin-top:4px">${actual.toLocaleString()} <small style="font-size:11px;color:#64748b">جنيه</small></div>
          <div class="bar-bg" style="margin-top:6px"><div class="bar-f" style="width:${perc}%;background:${col}"></div></div>
          <div style="display:flex;gap:6px;align-items:center;margin-top:8px" onclick="event.stopPropagation()"><span style="font-size:11px">مخصص:</span><input data-cat="${cat}" class="mini-input percI" type="number" value="${allocPerc}" oninput="updatePro()"><span style="font-size:10px">%</span><b data-res="${cat}" style="margin-right:auto;background:#f8fafc;padding:3px 8px;border-radius:6px">0</b></div>
          <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:11px"><span>الفرق:</span><b data-diff="${cat}">0</b></div>
          <div data-status="${cat}" style="margin-top:4px"></div>
        </div>`;
  }).join('')}
    </div>
    <div id="sumErr" style="text-align:center;margin-top:8px;font-size:11px;font-weight:800"></div>
  </div>`;
  updatePro();
  document.getElementById('catPills').innerHTML = ['الكل', ...window.FINAL_CATS_TASNEF].map(c => `<button class="cat-pill ${_activeCatFilter === c ? 'active' : ''}" onclick="setCatFilter('${c}')">${c}</button>`).join('');
  filterSuppliers(); renderTrend(); renderDailyRows();
}

function updatePro() {
  let totalSales = _lastData.totalSales; let totalExpenses = Object.values(_lastData.expensesByCat).reduce((a, b) => a + b, 0);
  let myP = parseFloat(document.getElementById('myP')?.value) || 0; let percIs = document.querySelectorAll('.percI'); let dist = {}, sum = 0;
  percIs.forEach(i => { let v = parseFloat(i.value) || 0; dist[i.dataset.cat] = v; sum += v; });
  let myV = totalSales * myP / 100; let rem = totalSales - myV;
  let myEl = document.getElementById('myV'); if (myEl) myEl.textContent = myV.toLocaleString(); let remEl = document.getElementById('remV'); if (remEl) remEl.textContent = rem.toLocaleString();
  let err = document.getElementById('sumErr'); if (err) { err.innerHTML = sum !== 100 && sum !== 0 ? `<span style="color:#dc2626">⚠ مجموع ${sum}% لازم 100%</span>` : `<span style="color:#16a34a">✓ مجموع ${sum}%</span>`; }
  document.querySelectorAll('[data-res]').forEach(el => {
    let cat = el.dataset.res; let p = dist[cat] || 0; let alloc = rem * p / 100; el.textContent = alloc.toLocaleString();
    let actual = _lastData.expensesByCat[cat] || 0; let diff = alloc - actual;
    let diffEl = document.querySelector(`[data-diff="${cat}"]`); if (diffEl) { diffEl.textContent = diff.toLocaleString(); diffEl.style.color = diff >= 0 ? '#16a34a' : '#dc2626'; }
    let statusEl = document.querySelector(`[data-status="${cat}"]`); if (statusEl) { statusEl.innerHTML = diff >= 0 ? `<span style="background:#ecfdf5;color:#065f46;border:1px solid #bbf7d0;padding:2px 6px;border-radius:20px;font-size:10px">✅ متبقي ${diff.toLocaleString()}</span>` : `<span style="background:#fef2f2;color:#991b1b;border:1px solid #fecaca;padding:2px 6px;border-radius:20px;font-size:10px">⚠ تجاوز ${Math.abs(diff).toLocaleString()}</span>`; }
  });
  localStorage.setItem('profitDist2', JSON.stringify({ my: myP, dist }));
}

function setCatFilter(cat) { _activeCatFilter = cat; document.querySelectorAll('.cat-pill').forEach(b => b.classList.toggle('active', b.textContent === cat)); filterSuppliers(); renderDailyRows(); }
function filterSuppliers() {
  let q = (document.getElementById('supSearch')?.value || '').toLowerCase().trim();
  let map = getTasnefMap(); let sup = _lastData.expensesBySupplier; let entries = Object.entries(sup).sort((a, b) => b[1] - a[1]);
  let total = Object.values(sup).reduce((a, b) => a + b, 0);
  if (_activeCatFilter !== 'الكل') entries = entries.filter(([name]) => getCategoryForSupplier(name, map) === _activeCatFilter);
  if (q) entries = entries.filter(([name]) => name.toLowerCase().includes(q));
  document.getElementById('supCount').textContent = `${entries.length} مورد`;
  document.getElementById('supTbody').innerHTML = entries.map(([name, val]) => {
    let cat = getCategoryForSupplier(name, map); let perc = total ? (val / total * 100).toFixed(1) : 0; let col = cat === 'دواء' ? '#0f766e' : cat === 'كوزمتكس' ? '#7c3aed' : '#dc2626';
    return `<tr style="cursor:pointer" onclick="openSupplierDetails('${name.replace(/'/g, "\\'")}')"><td style="text-align:right;font-weight:700">${name}</td><td><span style="background:${col}22;color:${col};padding:2px 6px;border-radius:10px;font-size:10px">${cat}</span></td><td style="font-weight:800">${val.toLocaleString()}</td><td><div style="display:flex;align-items:center;gap:6px"><div class="bar-bg" style="flex:1"><div class="bar-f" style="width:${perc}%;background:${col}"></div></div><small>${perc}%</small></div></td></tr>`;
  }).join('') || `<tr><td colspan=4 style="padding:20px;color:#94a3b8">مفيش</td></tr>`;
}
function renderTrend() {
  let trend = _lastData.trend; let keys = Object.keys(trend).sort((a, b) => parseDate(a) - parseDate(b));
  document.getElementById('dailyTrend').innerHTML = keys.map(k => { let r = trend[k]; return `<tr style="cursor:pointer" onclick="openDayDetails('${k}')"><td>${k}</td><td>${(r['دواء'] || 0).toLocaleString()}</td><td>${(r['كوزمتكس'] || 0).toLocaleString()}</td><td>${(r['مصاريف'] || 0).toLocaleString()}</td><td style="font-weight:900">${(r.total || 0).toLocaleString()}</td></tr>`; }).join('') || '<tr><td colspan=5>فاضي</td></tr>';
}
function renderDailyRows() {
  let list = _lastData.list; let map = getTasnefMap(); let totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE)); if (currentPage > totalPages) currentPage = totalPages;
  let slice = list.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE); let rows = [];
  slice.forEach(({ k: dateKey, data }) => {
    let arr = toArray(data); let empRows = {};
    arr.forEach(it => { if (!it || !it.id) return; let id = it.id + ''; if (id.startsWith('t1_')) { let m = id.match(/t1_r(\d+)_c(\d+)/); if (!m) return; let r = m[1], c = m[2]; if (!empRows[r]) empRows[r] = { emp: '', shift: 0, diff: 0, val: 0, sup: '' }; if (c === '1') empRows[r].emp = (it.val || '').toString(); else if (c === '2') empRows[r].shift = calcNum(it.val); else if (c === '3') empRows[r].diff = calcNum(it.val); else if (c === '5') empRows[r].sup = (it.val || '').toString(); else if (c === '6') empRows[r].val = calcNum(it.val); } });
    for (let r of Object.values(empRows)) { if (!r.emp && !r.sup && !r.shift && !r.diff && !r.val) continue; let cat = r.sup ? getCategoryForSupplier(r.sup, map) : '-'; if (_activeCatFilter !== 'الكل' && cat !== _activeCatFilter) continue; rows.push(`<tr class="row-day" onclick="openDayDetails('${dateKey}')"><td>${dateKey}</td><td>${r.emp || '-'}</td><td>${r.shift || '-'}</td><td>${r.diff || 0}</td><td>${r.val ? r.val.toLocaleString() : '-'}</td><td>${r.sup || '-'} <small>(${cat})</small></td></tr>`); }
  });
  document.getElementById('totalTableCard').innerHTML = rows.length ? `<table class="tbl"><thead><tr><th>التاريخ</th><th>الموظف</th><th>الشيفت</th><th>العجز</th><th>القيمة</th><th>المورد</th></tr></thead><tbody>${rows.join('')}</tbody></table>` : '<div style="padding:20px;text-align:center;color:#94a3b8">فاضي حسب الفلتر</div>';
  let pHtml = ''; if (totalPages > 1) { for (let i = 1; i <= totalPages; i++) { if (i == 1 || i == totalPages || Math.abs(i - currentPage) <= 1) pHtml += `<button style="padding:4px 8px;border-radius:7px;border:1px solid #e2e8f0;background:${i == currentPage ? '#0f172a' : '#fff'};color:${i == currentPage ? '#fff' : '#000'}" onclick="currentPage=${i};renderDailyRows()">${i}</button>`; else if (Math.abs(i - currentPage) == 2) pHtml += '<span>...</span>'; } } document.getElementById('totalPager').innerHTML = pHtml;
}
function openSupplierDetails(name) {
  let list = _lastData.list; let total = 0; let days = [];
  list.forEach(({ k: dateKey, data }) => { let arr = toArray(data); let rows = {}; arr.forEach(it => { let m = (it.id + '').match(/t1_r(\d+)_c(\d+)/); if (!m) return; let r = m[1], c = m[2]; if (!rows[r]) rows[r] = { sup: '', val: 0 }; if (c === '5') rows[r].sup = (it.val || '').trim(); if (c === '6') rows[r].val = calcNum(it.val); }); Object.values(rows).forEach(r => { if (r.sup === name && r.val) { total += r.val; days.push({ date: dateKey, val: r.val }); } }); });
  days.sort((a, b) => parseDate(a.date) - parseDate(b.date));
  document.getElementById('drillBox').innerHTML = `<div style="padding:14px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between"><b>📦 ${name} - إجمالي ${total.toLocaleString()} - ${days.length} عملية</b><button onclick="closeDrill()" style="background:#0f172a;color:#fff;border:none;border-radius:8px;padding:5px 10px">✕</button></div><div style="padding:12px;max-height:70vh;overflow:auto"><table class="tbl"><thead><tr><th>التاريخ</th><th>القيمة</th><th>تراكمي</th></tr></thead><tbody>${days.map((d, i) => { let cum = days.slice(0, i + 1).reduce((a, b) => a + b.val, 0); return `<tr><td>${d.date}</td><td>${d.val.toLocaleString()}</td><td>${cum.toLocaleString()}</td></tr>`; }).join('')}</tbody></table></div>`;
  document.getElementById('drillModal').classList.add('show');
}
function openDayDetails(dateKey) {
  let store = {}; try { store = JSON.parse(localStorage.getItem('dailyStore') || '{}'); } catch { } let data = store[dateKey]; if (!data) return;
  let arr = toArray(data); let map = getTasnefMap(); let rows = []; arr.forEach(it => { let m = (it.id + '').match(/t1_r(\d+)_c(\d+)/); if (!m) return; let r = m[1], c = m[2]; if (!rows[r]) rows[r] = {}; rows[r][c] = it.val; });
  let htmlRows = Object.values(rows).map(r => { if (!r['1'] && !r['5']) return ''; let cat = r['5'] ? getCategoryForSupplier(r['5'], map) : '-'; return `<tr><td>${r['1'] || '-'}</td><td>${r['2'] || '-'}</td><td>${r['3'] || '-'}</td><td>${r['5'] || '-'} (${cat})</td><td>${r['6'] || '-'}</td></tr>`; }).join('');
  document.getElementById('drillBox').innerHTML = `<div style="padding:14px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between"><b>📅 يوم ${dateKey}</b><div><button onclick="localStorage.setItem('selectedDate','${dateKey}'); closeDrill(); showTab('daily');" style="background:#16a34a;color:#fff;border:none;border-radius:8px;padding:5px 10px;margin-left:6px">تعديل</button><button onclick="closeDrill()" style="background:#0f172a;color:#fff;border:none;border-radius:8px;padding:5px 10px">✕</button></div></div><div style="padding:12px"><table class="tbl"><thead><tr><th>الموظف</th><th>الشيفت</th><th>العجز</th><th>المورد</th><th>القيمة</th></tr></thead><tbody>${htmlRows}</tbody></table></div>`;
  document.getElementById('drillModal').classList.add('show');
}
function openCategoryDetails(cat) { _activeCatFilter = cat; renderTable(); window.scrollTo(0, 0); }
function closeDrill() { document.getElementById('drillModal').classList.remove('show'); }
function exportExcel() { let rows = [['المورد', 'الفئة', 'القيمة']]; Object.entries(_lastData.expensesBySupplier).forEach(([n, v]) => { rows.push([n, getCategoryForSupplier(n, getTasnefMap()), v]); }); let csv = rows.map(r => r.join(',')).join('\n'); let blob = new Blob([csv], { type: 'text/csv' }); let url = URL.createObjectURL(blob); let a = document.createElement('a'); a.href = url; a.download = `موردين-${selectedMonthKey}.csv`; a.click(); }
window.renderTotal = renderTotal; window.filterSuppliers = filterSuppliers; window.setCatFilter = setCatFilter; window.openSupplierDetails = openSupplierDetails; window.openDayDetails = openDayDetails; window.closeDrill = closeDrill; window.exportExcel = exportExcel; window.renderDailyRows = renderDailyRows; window.updatePro = updatePro; window.openCategoryDetails = openCategoryDetails;
