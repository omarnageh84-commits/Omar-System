// ==================== الاجمالي - نسخة تبويبات شهور + نسبة ربح ====================
let activeMonthTab = localStorage.getItem('activeMonthTab') || null;

function renderTotal() {
  let el = document.getElementById('total'); if (!el) return;
  el.innerHTML = `<div id="total-wrap">
    <style>
     .glass{background:#fff;border-radius:14px;padding:12px;margin-bottom:12px;border:1px solid #e2e8f0}
     .filters{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
     .filters input{padding:8px 12px;border-radius:10px;border:1.5px solid #e2e8f0;font-size:11px;font-weight:700}
     .filters button{padding:8px 16px;border:none;border-radius:10px;font-weight:800;font-size:11px;cursor:pointer;color:#fff}
      table{width:100%;border-collapse:collapse;font-size:11px}
      th{background:#0f172a;color:#fff;padding:10px 6px;font-size:10px;text-align:center;position:sticky;top:0}
      td{padding:8px 6px;text-align:center;border-bottom:1px solid #f1f5f9;cursor:pointer;transition:.1s}
      tr:hover td{background:#f8fafc}
     .safi{background:#0f172a;color:#fff;border-radius:8px;font-weight:900}
     .month-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
     .month-tab{padding:8px 14px;border-radius:20px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:900;font-size:11px;cursor:pointer}
     .month-tab.active{background:#0f172a;color:#fff;border-color:#0f172a;transform:scale(1.05)}
     .profit-input{width:75px;padding:6px;border-radius:8px;border:1.5px solid #e2e8f0;text-align:center;font-weight:900}
    </style>

    <div class="glass">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
        <b>⚙️ توزيع الأرباح - نسبة الربح والتوزيع على التصنيفات</b>
        <div style="display:flex;gap:8px;align-items:center">
          <span style="font-size:11px;font-weight:800">نسبة الربح اللي عايزها %</span>
          <input id="desiredProfit" type="number" class="profit-input" oninput="saveProfitConfig()" placeholder="20">
          <button onclick="saveProfitConfig();renderTotalTable()" style="background:#0f172a;padding:6px 12px;border:none;border-radius:8px;color:#fff;font-weight:800;font-size:10px">حفظ</button>
        </div>
      <div id="profitDistTable" style="margin-top:12px;overflow:auto"></div>
      <div style="font-size:10px;color:#64748b;margin-top:6px">الباقي بعد نسبة الربح (100% - نسبة ربحك) بيتوزع تلقائي على التصنيفات اللي في عامود "التصنيف" في جدول الموردين</div>
    </div>

    <div class="glass">
      <div class="filters">
        <input id="totalFrom" placeholder="من تاريخ" onblur="this.value=parseDateSmartTotal(this.value);renderTotalTable()">
        <input id="totalTo" placeholder="إلى تاريخ" onblur="this.value=parseDateSmartTotal(this.value);renderTotalTable()">
        <button onclick="clearTotalFilters()" style="background:#64748b">مسح الفلتر</button>
        <button onclick="fetchSheetData()" style="background:#16a34a">🔄 مزامنة من الشيت</button>
        <button onclick="exportTotalExcel()" style="background:#0f172a">📥 تصدير Excel</button>
      </div>
    <div id="monthTabs" class="month-tabs"></div>
    <div id="totalTableCard"></div>
  </div>`;
  loadProfitConfig();
  renderTotalTable();
}

function parseDateSmartTotal(v) { if (!v) return ''; v = v.trim().replace(/-/g, '/'); let p = v.split('/'); let y = new Date().getFullYear(); if (p.length == 2) return p[0] + '/' + p[1] + '/' + y; if (p.length == 3) { if (p[2].length == 2) p[2] = '20' + p[2]; return p.join('/'); } return v; }
function parseDateForFilterTotal(s) { if (!s) return null; let p = s.split('/'); if (p.length!== 3) return null; return new Date(p[2], p[1] - 1, p[0]); }
function calcNumTotal(v) { try { if (!v) return 0; let e = (v + '').toString().replace(/,/g, '').trim(); if (/[\+\-\*\/]/.test(e)) return Function('"use strict";return (' + e + ')')(); return parseFloat(e) || 0; } catch { return 0; } }
function clearTotalFilters() { let a = document.getElementById('totalFrom'), b = document.getElementById('totalTo'); if (a) a.value = ''; if (b) b.value = ''; renderTotalTable(); }
function exportTotalExcel() { let html = document.getElementById('totalTableCard').innerHTML; let blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel' }); let url = URL.createObjectURL(blob); let a = document.createElement('a'); a.href = url; a.download = 'الاجمالي_' + (activeMonthTab||'') + '.xls'; a.click(); }

// ==================== دوال التوزيع والتصنيفات ====================
function getSupplierClassifications(){
  let cats = new Set();
  try{
    // بنجرب كل المفاتيح المحتملة للتصنيفات
    let possibleKeys = ['suppliersStore','suppliers','supplierStore','suppliersData'];
    for(let key of possibleKeys){
      let raw = localStorage.getItem(key);
      if(!raw) continue;
      let s = JSON.parse(raw);
      if(Array.isArray(s)){
        s.forEach(o=>{ let v=o.category||o.classification||o.tasnef||o['التصنيف']||o['تصنيف']; if(v) cats.add(v.toString().trim()); });
      } else if(typeof s === 'object'){
        Object.values(s).forEach(v=>{
          if(Array.isArray(v)) v.forEach(o=>{ if(o && (o.category||o.classification||o.tasnef||o['التصنيف'])) cats.add((o.category||o.classification||o.tasnef||o['التصنيف']).toString().trim()) });
          else if(v && (v.category||v.classification)) cats.add((v.category||v.classification).toString().trim());
        });
      }
    }
    // لو بتخزن التصنيف في نفس dailyStore كـ t1_c4
    let daily = JSON.parse(localStorage.getItem('dailyStore')||'{}');
    Object.values(daily).forEach(arr=>{
      if(!Array.isArray(arr)) return;
      arr.forEach(it=>{
        if(it.id && it.id.match(/t1_r\d+_c4/) && it.val) cats.add(it.val.trim());
        if(it.id && it.id.includes('supp_cat') && it.val) cats.add(it.val.trim());
      });
    });
  }catch(e){ console.log('cats err', e) }
  return [...cats].filter(Boolean);
}

function loadProfitConfig(){
  let cfg = JSON.parse(localStorage.getItem('profitConfigTotal')||'{"desired":20,"dist":{}}');
  setTimeout(()=>{
    let inp = document.getElementById('desiredProfit');
    if(inp) inp.value = cfg.desired || 20;
  },0);
  let cats = getSupplierClassifications();
  let dist = cfg.dist || {};
  let html = `<table><thead><tr><th>التصنيف (من عامود التصنيف في الموردين)</th><th>نسبة من الباقي %</th><th>الحسبة النهائية</th></tr></thead><tbody>`;
  if(cats.length===0){
    html+=`<tr><td colspan=3 style="color:#ef4444;padding:12px">مفيش تصنيفات لسه - روح جدول الموردين وضيف عامود "التصنيف" مثلا: مطبخ - بار - نظافة -... وهيظهر هنا تلقائي</td></tr>`;
  } else {
    cats.forEach(cat=>{
      if(dist[cat]===undefined) dist[cat]=0;
      html+=`<tr>
        <td style="font-weight:900">${cat}</td>
        <td><input class="profit-input" data-cat="${cat}" value="${dist[cat]}" oninput="saveProfitConfig()" type="number" min="0" max="100"></td>
        <td data-calc="${cat}" style="font-weight:800">-</td>
      </tr>`;
    });
  }
  html+=`</tbody></table>`;
  let el = document.getElementById('profitDistTable');
  if(el) el.innerHTML = html;
  calcProfitPreview();
}

function saveProfitConfig(){
  let desired = calcNumTotal(document.getElementById('desiredProfit')?.value || 20);
  let dist={};
  document.querySelectorAll('#profitDistTable input[data-cat]').forEach(inp=>{ dist[inp.dataset.cat]=calcNumTotal(inp.value) });
  localStorage.setItem('profitConfigTotal', JSON.stringify({desired, dist}));
  calcProfitPreview();
}

function calcProfitPreview(){
  let cfg = JSON.parse(localStorage.getItem('profitConfigTotal')||'{"desired":20,"dist":{}}');
  let remaining = 100 - (cfg.desired||0);
  document.querySelectorAll('[data-calc]').forEach(td=>{
    let cat = td.getAttribute('data-calc');
    let p = cfg.dist[cat]||0;
    let finalShare = (remaining * p / 100);
    td.innerText = `${p}% من الباقي = ${finalShare.toFixed(1)}% من الاجمالي`;
  });
}

// ==================== التنقل عند الضغط ====================
function goToDaily(dateKey){
  localStorage.setItem('jumpToDate', dateKey);
  // لو عندك فانكشن showTab غير الاسم هنا
  if(typeof showTab === 'function'){ showTab('daily'); }
  else if(document.getElementById('daily')){ document.getElementById('daily').click(); }
  // لو بتستخدم renderDaily
  if(typeof renderDaily === 'function'){ setTimeout(()=>renderDaily(), 200); }
}
function goToSupplier(supName){
  if(!supName || supName=='-') return;
  localStorage.setItem('supplierFilter', supName);
  if(typeof showTab === 'function'){ showTab('suppliers'); }
  if(typeof renderSuppliers === 'function'){ setTimeout(()=>renderSuppliers(), 200); }
}

// ==================== الجدول الرئيسي بالتبويبات ====================
function renderTotalTable() {
  try {
    let dailyStore = JSON.parse(localStorage.getItem('dailyStore') || '{}');
    let fromV = document.getElementById('totalFrom')?.value || '', toV = document.getElementById('totalTo')?.value || '';
    let fromD = parseDateForFilterTotal(fromV), toD = parseDateForFilterTotal(toV);

    let months = {};
    let sortedDates = Object.keys(dailyStore).sort((a, b) => {
      let da = parseDateForFilterTotal(a), db = parseDateForFilterTotal(b);
      if(!da ||!db) return 0;
      return db - da; // الاحدث الاول
    });

    sortedDates.forEach(dateKey => {
      let d = parseDateForFilterTotal(dateKey);
      if (!d) return;
      if (fromD && d < fromD) return; if (toD && d > toD) return;
      let monthKey = `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}`;
      if(!months[monthKey]) months[monthKey]=[];
      let data = dailyStore[dateKey]; if (!Array.isArray(data)) return;
      let empRows = {}, instaSum = 0, vodaSum = 0;
      data.forEach(it => {
        if (!it ||!it.id) return;
        if (it.id.startsWith('t1_')) {
          let m = it.id.match(/t1_r(\d+)_c(\d+)/); if (!m) return;
          let r = m[1], c = m[2]; if (!empRows[r]) empRows[r] = { emp: '', shift: 0, diff: 0, val: 0, sup: '' };
          if (c === '1') empRows[r].emp = (it.val || '').trim();
          if (c === '2') empRows[r].shift = calcNumTotal(it.val);
          if (c === '3') empRows[r].diff = calcNumTotal(it.val);
          if (c === '5') empRows[r].sup = (it.val || '').trim();
          if (c === '6') empRows[r].val = calcNumTotal(it.val);
        }
        if (it.id.includes('insta_')) instaSum += calcNumTotal(it.val);
        if (it.id.includes('voda_')) vodaSum += calcNumTotal(it.val);
      });
      months[monthKey].push({dateKey, empRows, instaSum, vodaSum});
    });

    let monthKeys = Object.keys(months).sort((a,b)=> b.localeCompare(a)); // احدث شهر اول واحد
    if(!activeMonthTab ||!months[activeMonthTab]){
      activeMonthTab = monthKeys[0] || null;
      if(activeMonthTab) localStorage.setItem('activeMonthTab', activeMonthTab);
    }

    let tabsEl = document.getElementById('monthTabs');
    if(tabsEl){
      tabsEl.innerHTML = monthKeys.map(m=>{
        let isActive = m===activeMonthTab? 'active' : '';
        let count = months[m].reduce((acc, day)=> acc + Object.keys(day.empRows).length, 0);
        return `<div class="month-tab ${isActive}" onclick="activeMonthTab='${m}';localStorage.setItem('activeMonthTab','${m}');renderTotalTable()">${m} - ${months[m].length} يوم (${count} صف)</div>`;
      }).join('') || '<div style="font-size:11px">مفيش بيانات - اعمل مزامنة من الشيت</div>';
    }

    let rows = '';
    let activeData = months[activeMonthTab] || [];
    activeData.forEach(({dateKey, empRows, instaSum, vodaSum})=>{
      let first = true;
      let hasEmp = false;
      Object.values(empRows).forEach(r => {
        if (!r.emp &&!r.sup && r.shift == 0 && r.diff == 0 && r.val == 0) return;
        hasEmp=true;
        let safi = r.shift + r.diff - r.val + (first? (instaSum + vodaSum) : 0);
        rows += `<tr>
          <td style="font-weight:900" onclick="goToDaily('${dateKey}')">${dateKey}</td>
          <td onclick="goToDaily('${dateKey}')">${r.emp || '-'}</td>
          <td onclick="goToDaily('${dateKey}')">${r.shift? r.shift.toLocaleString() : '-'}</td>
          <td style="font-weight:800;${r.diff < 0? 'color:#dc2626' : 'color:#16a34a'}" onclick="goToDaily('${dateKey}')">${r.diff || 0}</td>
          <td onclick="event.stopPropagation();goToSupplier('${r.sup}')">${r.val? r.val.toLocaleString() : '-'}</td>
          <td onclick="event.stopPropagation();goToSupplier('${r.sup}')">${r.sup || '-'}</td>
          <td style="color:#7c3aed;font-weight:900" onclick="goToDaily('${dateKey}')">${first && instaSum? instaSum.toLocaleString() : '-'}</td>
          <td style="color:#dc2626;font-weight:900" onclick="goToDaily('${dateKey}')">${first && vodaSum? vodaSum.toLocaleString() : '-'}</td>
          <td class="safi" onclick="goToDaily('${dateKey}')">${safi.toLocaleString()}</td>
        </tr>`;
        first = false;
      });
      if (!hasEmp && (instaSum || vodaSum)) {
        rows += `<tr style="background:#f5f3ff" onclick="goToDaily('${dateKey}')"><td>${dateKey}</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>${instaSum.toLocaleString()}</td><td>${vodaSum.toLocaleString()}</td><td class="safi">${(instaSum + vodaSum).toLocaleString()}</td></tr>`;
      }
    });

    let card = document.getElementById('totalTableCard');
    if(card){
      card.innerHTML = `
        <div class="glass"><b>📅 ${activeMonthTab? 'شهر ' + activeMonthTab : 'الاجمالي'} - اضغط على الصف يوديك لليومي، اضغط على المورد يوديك للموردين</b>
        <div style="overflow:auto;max-height:70vh;margin-top:10px"><table><thead><tr>
          <th>تاريخ اليوم</th><th>الموظف</th><th>قيمة الشيفت</th><th>العجز/الزيادة</th>
          <th>قيمة المورد</th><th>اسم مورد</th><th>انستا</th><th>فودافون</th><th>الصافي (حساب المشروع)</th>
        </tr></thead><tbody>${rows || '<tr><td colspan=9>اعمل مزامنة من الشيت - مفيش بيانات في الفلتر ده</td></tr>'}</tbody></table></div></div>`;
    }
  } catch (e) { console.error(e); document.getElementById('totalTableCard').innerHTML = 'Error: ' + e.message; }
}
