let purchaseStore = JSON.parse(localStorage.getItem('purchaseStore') || '[]');

function getSuppliersFromDB() {
    try {
        let db = JSON.parse(localStorage.getItem('dbStore') || '{}');
        return [...new Set((db.suppliers || []).map(s => s.name).filter(Boolean))];
    } catch { return []; }
}
function parseDateSmartPurch(v) { if (!v) return ''; v = v.trim().replace(/-/g, '/'); let p = v.split('/'); let y = new Date().getFullYear(); if (p.length == 2) return `${p[0]}/${p[1]}/${y}`; if (p.length == 3) { if (p[2].length == 2) p[2] = '20' + p[2]; return p.join('/'); } return v; }
function calcNum(v) { try { if (!v) return 0; let e = (v + '').replace(/,/g, '').trim(); if (/[\+\-\*\/]/.test(e)) return Function('"use strict";return (' + e + ')')(); return parseFloat(e) || 0; } catch { return 0; } }
function formatNum(n) { return Number(n || 0).toLocaleString('en-US'); }
function parseDateForFilter(s) { if (!s) return null; let p = s.split('/'); if (p.length !== 3) return null; return new Date(p[2], p[1] - 1, p[0]); }

let activePurchTab = 'sup'; // sup | date

function renderPurchases() {
    let supList = getSuppliersFromDB();
    let datalist = `<datalist id="suppliersDL">${supList.map(n => `<option value="${n}">`).join('')}</datalist>`;
    let uniqSup = [...new Set(purchaseStore.map(r => r.supplier).filter(Boolean))].concat(supList);
    uniqSup = [...new Set(uniqSup)];
    let uniqTypes = ['فواتير', 'مرتجعات', 'اشعارات', 'مبيعات', 'مردودات', 'مدفوعات'];
    let uniqPays = [...new Set(purchaseStore.map(r => r.pay).filter(Boolean))];
    if (uniqPays.length === 0) uniqPays = ['كاش', 'اجل', 'انستا', 'فودافون', 'تحويل'];

    document.getElementById('purchases').innerHTML = `
    ${datalist}
    <style>
    .smart-filter{ background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:10px 12px; display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-bottom:12px; }
    .sf-group{ display:flex; flex-direction:column; gap:2px; flex:1; min-width:90px; }
    .sf-group label{ font-size:10px; font-weight:800; color:#64748b; }
    .sf-group input,.sf-group select{ padding:7px 8px; border:1px solid #e2e8f0; border-radius:8px; font-weight:700; font-size:13px; outline:none; }
    .sf-group input:focus,.sf-group select:focus{ border-color:#0f172a; }
    .sf-btn{ padding:7px 12px; border-radius:8px; font-weight:800; cursor:pointer; border:1px solid #e2e8f0; background:#fff; font-size:12px; white-space:nowrap; }
    .sf-btn.primary{ background:#0f172a; color:#fff; }
    .sf-btn.success{ background:#059669; color:#fff; border-color:#059669; }
    .sf-count{ background:#f0fdf4; border:1px dashed #bbf7d0; padding:5px 10px; border-radius:20px; font-weight:800; font-size:11px; color:#065f46; }
    .purch-tabs{ display:flex; gap:6px; margin-bottom:10px; }
    .p-tab{ padding:8px 16px; border-radius:20px; font-weight:800; font-size:12px; cursor:pointer; border:1px solid #e2e8f0; background:#fff; }
    .p-tab.active{ background:#0f172a; color:#fff; border-color:#0f172a; }
    .pro-table-card{ border-radius:12px; overflow:hidden; border:1px solid #e2e8f0; background:#fff; }
    .pro-table{ width:100%; border-collapse:collapse; font-size:13px; }
    .pro-table th{ background:#f8fafc; padding:8px; font-size:11px; color:#64748b; }
    .pro-table td{ padding:7px; text-align:center; border-top:1px solid #f1f5f9; }
    .safi-cell.pos-bg{ background:#f0fdf4; color:#065f46; font-weight:800; }
    .safi-cell.neg-bg{ background:#fef2f2; color:#991b1b; font-weight:800; }
    .pro-table-card.pro-table-title{ padding:10px 14px; font-weight:800; display:flex; justify-content:space-between; align-items:center; font-size:13px; }
    .pro-table-title.dark{ background:#0f172a; color:#fff; }
    </style>

    <div class="smart-filter">
      <div class="sf-group" style="max-width:95px"><label>من تاريخ</label><input id="purchFrom" placeholder="1/7" onblur="this.value=parseDateSmartPurch(this.value);renderTables()"></div>
      <div class="sf-group" style="max-width:95px"><label>إلى تاريخ</label><input id="purchTo" placeholder="31/7" onblur="this.value=parseDateSmartPurch(this.value);renderTables()"></div>
      <div class="sf-group"><label>المورد</label><select id="fSup" onchange="renderTables()"><option value="">كل الموردين</option>${uniqSup.map(s => `<option value="${s}">${s}</option>`).join('')}</select></div>
      <div class="sf-group"><label>النوع</label><select id="fType" onchange="renderTables()"><option value="">الكل</option>${uniqTypes.map(t => `<option value="${t}">${t}</option>`).join('')}</select></div>
      <div class="sf-group"><label>الدفع</label><select id="fPay" onchange="renderTables()"><option value="">الكل</option>${uniqPays.map(p => `<option value="${p}">${p}</option>`).join('')}</select></div>
      <button class="sf-btn" onclick="clearPurchFilter()">مسح</button>
      <button class="sf-btn success" onclick="savePurch()">💾 حفظ</button>
      <span id="filterCount" class="sf-count">0</span>
    </div>

    <div class="purch-tabs">
      <div class="p-tab ${activePurchTab == 'sup' ? 'active' : ''}" onclick="activePurchTab='sup';renderTables()">📦 حسب المورد</div>
      <div class="p-tab ${activePurchTab == 'date' ? 'active' : ''}" onclick="activePurchTab='date';renderTables()">📅 حسب اليوم</div>
      <div style="flex:1"></div>
      <span style="font-size:11px;color:#64748b;font-weight:700">اضغط على الصف للفلترة به</span>
    </div>

    <div id="purchTables"></div>

    <div class="pro-table-card" style="margin-top:12px">
      <div class="pro-table-title dark">الإدخال السريع <div><span style="cursor:pointer;background:#fff;color:#0f172a;padding:4px 10px;border-radius:20px;font-size:12px" onclick="addPurchRow()">+ إضافة صف</span></div></div>
      <table class="pro-table"><thead><tr><th>التاريخ</th><th>اسم المورد</th><th>نوع الفاتورة</th><th>طريقة الدفع</th><th>الصافي</th><th>حذف</th></tr></thead><tbody id="purchEntryBody"></tbody></table>
    </div>
  `;
    loadEntry(); renderTables();
}

function clearPurchFilter() {
    document.getElementById('purchFrom').value = '';
    document.getElementById('purchTo').value = '';
    document.getElementById('fSup').value = '';
    document.getElementById('fType').value = '';
    document.getElementById('fPay').value = '';
    renderTables();
}

function loadEntry() { let tbody = document.getElementById('purchEntryBody'); tbody.innerHTML = ''; if (purchaseStore.length === 0) addPurchRow(); else purchaseStore.forEach(r => addPurchRow(r)); }
function addPurchRow(data) { let tbody = document.getElementById('purchEntryBody'); let tr = document.createElement('tr'); let row = data || { date: '', supplier: '', type: 'فواتير', pay: 'كاش', value: '' }; let types = ['فواتير', 'مرتجعات', 'اشعارات', 'مبيعات', 'مردودات', 'مدفوعات']; let pays = ['كاش', 'اجل', 'انستا', 'فودافون', 'تحويل']; tr.innerHTML = `<td><input value="${row.date || ''}" placeholder="1/9/2026" style="width:90px" onblur="this.value=parseDateSmartPurch(this.value);updateStore()"></td><td><input list="suppliersDL" value="${row.supplier || ''}" placeholder="المورد" oninput="updateStore()" style="font-weight:700;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:5px;width:120px"></td><td><select onchange="updateStore()">${types.map(t => `<option ${row.type === t ? 'selected' : ''}>${t}</option>`).join('')}</select></td><td><select onchange="updateStore()">${pays.map(p => `<option ${row.pay === p ? 'selected' : ''}>${p}</option>`).join('')}</select></td><td><input value="${row.value || ''}" placeholder="0" style="width:90px" onblur="this.value=formatNum(calcNum(this.value));updateStore()"></td><td><span style="cursor:pointer;color:#dc2626;font-weight:800" onclick="this.closest('tr').remove();updateStore()">✖</span></td>`; tbody.appendChild(tr); }
function updateStore() { let arr = []; document.querySelectorAll('#purchEntryBody tr').forEach(tr => { let i = tr.querySelectorAll('input,select'); arr.push({ date: i[0].value || '', supplier: i[1].value || '', type: i[2].value, pay: i[3].value, value: i[4].value || '' }); }); purchaseStore = arr; localStorage.setItem('purchaseStore', JSON.stringify(arr)); renderTables(); }
function savePurch() { updateStore(); alert('✅ اتحفظ'); }

function renderTables() {
    let fromV = document.getElementById('purchFrom')?.value || '';
    let toV = document.getElementById('purchTo')?.value || '';
    let fSup = document.getElementById('fSup')?.value || '';
    let fType = document.getElementById('fType')?.value || '';
    let fPay = document.getElementById('fPay')?.value || '';
    let fromD = parseDateForFilter(fromV);
    let toD = parseDateForFilter(toV);
    let filtered = purchaseStore.filter(r => {
        let d = parseDateForFilter(r.date);
        if (fromD && d && d < fromD) return false;
        if (toD && d && d > toD) return false;
        if (fSup && r.supplier !== fSup) return false;
        if (fType && r.type !== fType) return false;
        if (fPay && r.pay !== fPay) return false;
        return true;
    });
    let countEl = document.getElementById('filterCount');
    if (countEl) countEl.innerText = `${filtered.length} / ${purchaseStore.length}`;

    let bySup = {}; filtered.forEach(r => { let s = r.supplier || 'بدون'; if (!bySup[s]) bySup[s] = { فواتير: 0, مرتجعات: 0, اشعارات: 0, مبيعات: 0, مردودات: 0, مدفوعات: 0 }; let v = calcNum(r.value); if (bySup[s][r.type] !== undefined) bySup[s][r.type] += v; });
    let byDate = {}; filtered.forEach(r => { let dt = r.date || 'بدون'; if (!byDate[dt]) byDate[dt] = { فواتير: 0, مرتجعات: 0, اشعارات: 0, مبيعات: 0, مردودات: 0, مدفوعات: 0 }; let v = calcNum(r.value); if (byDate[dt][r.type] !== undefined) byDate[dt][r.type] += v; });
    let calcSafi = o => (o.فواتير + o.مبيعات) - (o.مرتجعات + o.اشعارات + o.مردودات + o.مدفوعات);

    let supRows = Object.keys(bySup).map(s => { let o = bySup[s]; let safi = calcSafi(o); return `<tr style="cursor:pointer" onclick="document.getElementById('fSup').value='${s}';renderTables()"><td style="font-weight:700;text-align:right;padding-right:15px">${s}</td><td>${formatNum(o.فواتير)}</td><td>${formatNum(o.مرتجعات)}</td><td>${formatNum(o.اشعارات)}</td><td>${formatNum(o.مبيعات)}</td><td>${formatNum(o.مردودات)}</td><td>${formatNum(o.مدفوعات)}</td><td class="safi-cell ${safi < 0 ? 'neg-bg' : 'pos-bg'}">${formatNum(safi)}</td></tr>`; }).join('') || '<tr><td colspan=8>لا يوجد بيانات</td></tr>';
    let dateRows = Object.keys(byDate).map(d => { let o = byDate[d]; let safi = calcSafi(o); return `<tr><td style="font-weight:700">${d}</td><td>${formatNum(o.فواتير)}</td><td>${formatNum(o.مرتجعات)}</td><td>${formatNum(o.اشعارات)}</td><td>${formatNum(o.مبيعات)}</td><td>${formatNum(o.مردودات)}</td><td>${formatNum(o.مدفوعات)}</td><td class="safi-cell ${safi < 0 ? 'neg-bg' : 'pos-bg'}">${formatNum(safi)}</td></tr>`; }).join('') || '<tr><td colspan=8>لا يوجد بيانات</td></tr>';

    let html = '';
    if (activePurchTab === 'sup') {
        html = `<div class="pro-table-card"><table class="pro-table"><thead><tr><th>المورد</th><th>فواتير</th><th>مرتجعات</th><th>اشعارات</th><th>مبيعات</th><th>مردودات</th><th>مدفوعات</th><th>الصافي</th></tr></thead><tbody>${supRows}</tbody></table></div>`;
    } else {
        html = `<div class="pro-table-card"><table class="pro-table"><thead><tr><th>التاريخ</th><th>فواتير</th><th>مرتجعات</th><th>اشعارات</th><th>مبيعات</th><th>مردودات</th><th>مدفوعات</th><th>الصافي</th></tr></thead><tbody>${dateRows}</tbody></table></div>`;
    }
    document.getElementById('purchTables').innerHTML = html;
}